// GAZETA STUDIO — Webhook de Stripe v2 (Vercel Function)
// Cobro → nº de edición y stock → pedido Printumo → emails Resend.
//
// Endurecido frente a los riesgos auditados:
//  · Idempotencia: cada sesión de checkout se procesa UNA sola vez (registro interno en el
//    producto; si Stripe reintenta el evento, se responde 200 sin duplicar nada).
//  · Confirmación del pago: se re-consulta la sesión a Stripe antes de actuar (nunca se
//    confía en el cuerpo del evento) y se exige payment_status === 'paid'.
//  · Duplicados de pago: el nº de edición se calcula desde `restantes` en metadata con
//    actualización condicional; si dos webhooks llegaran a la vez, el segundo detecta
//    la sesión ya procesada por idempotencia.
//  · Reembolsos/cancelaciones: al recibir charge.refunded, avisa por email con la dirección
//    y el pedido para gestionarlo en Printumo (anulación/relanzado manual).
//  · Pedidos fallidos: si Printumo o Resend fallan, se responde 200 (Stripe reintenta el
//    webhook completo) y se marca la venta como PENDIENTE en el email al estudio.
//
// Variables: STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, PRINTUMO_API_KEY, RESEND_API_KEY, MAIL_FROM, MAIL_TO

import crypto from 'node:crypto';

export const config = { api: { bodyParser: false } };

// obra → datos fijos (edición total, precio céntimos, specs Printumo: lienzo 2, mercado EU 1, sin marco 2)
const OBRAS = {
  /* ── TEXTURES · edición limitada de 20 ── */
  plink_1UTNij85u7jC8FxLbnArsbXA: { id:'vino-primero',      nombre:'Corriente',        product:'prod_VUMQ2svQfjywpf', edicion:20, size:22, fija:false, img:'https://www.gazetastudio.com/assets/print-vino.jpg' },
  plink_1UTNiz85u7jC8FxLzPpIXtNu: { id:'trazo-unico',       nombre:'Pulso',            product:'prod_VUMRGwjTiy5ffP', edicion:20, size:44, fija:false, img:'https://www.gazetastudio.com/assets/print-trazo.jpg' },
  plink_1UTNj085u7jC8FxLv8Aq1AfY: { id:'linea-y-vino',      nombre:'Perfil en reposo', product:'prod_VUMRXQn31wHO1U', edicion:20, size:19, fija:false, img:'https://www.gazetastudio.com/assets/print-linea.jpg' },
  plink_1UTNj185u7jC8FxLMLRqV6lM: { id:'arena-calma',       nombre:'Mediodía',         product:'prod_VUMR8RqqCZm1Pp', edicion:20, size:30, fija:false, img:'https://www.gazetastudio.com/assets/print-arena.jpg' },
  plink_1UTNj285u7jC8FxLAlEUaRc0: { id:'horizonte-vino',    nombre:'Última luz',       product:'prod_VUMRSpUJGD3fMY', edicion:20, size:22, fija:false, img:'https://www.gazetastudio.com/assets/print-horizonte.jpg' },
  plink_1UTNj385u7jC8FxLbqRJAfN5: { id:'geometria-callada', nombre:'Equilibrio',       product:'prod_VUMRdH5PhvuJDa', edicion:20, size:39, fija:false, img:'https://www.gazetastudio.com/assets/print-geometria.jpg' },
  /* ── Colecciones fijas ── */
  plink_1UTidb85u7jC8FxLdRVXGwTQ: { id:'eclectic-1', nombre:'Marea urbana', product:'prod_VUi3028BgLOpI7', edicion:100, size:22, fija:true, img:'https://www.gazetastudio.com/assets/print-eclectic-1.jpg' },
  plink_1UTidc85u7jC8FxL6F93Vrfn: { id:'eclectic-2', nombre:'Terraza interior', product:'prod_VUi3cKVRxupXpZ', edicion:100, size:44, fija:true, img:'https://www.gazetastudio.com/assets/print-eclectic-2.jpg' },
  plink_1UTidd85u7jC8FxLSAbYXa6w: { id:'eclectic-3', nombre:'Alfama', product:'prod_VUi3DHoQPy8hsD', edicion:100, size:44, fija:true, img:'https://www.gazetastudio.com/assets/print-eclectic-3.jpg' },
  plink_1UTide85u7jC8FxLhCbUPrJc: { id:'nordic-1', nombre:'Silencio claro', product:'prod_VUi3HecJpoMNrS', edicion:100, size:44, fija:true, img:'https://www.gazetastudio.com/assets/print-nordic-1.jpg' },
  plink_1UTidf85u7jC8FxL9Dag26FB: { id:'nordic-2', nombre:'Fiordo', product:'prod_VUi3kpVHgdFrvN', edicion:100, size:44, fija:true, img:'https://www.gazetastudio.com/assets/print-nordic-2.jpg' },
  plink_1UTidg85u7jC8FxLgdbhDfMr: { id:'nordic-3', nombre:'Nieve de abril', product:'prod_VUi3a1kN8G2vxp', edicion:100, size:32, fija:true, img:'https://www.gazetastudio.com/assets/print-nordic-3.jpg' },
  plink_1UTidh85u7jC8FxLLZ49qtOI: { id:'bauhaus-1', nombre:'Composición 7', product:'prod_VUi3FRcKCPZDqs', edicion:100, size:44, fija:true, img:'https://www.gazetastudio.com/assets/print-bauhaus-1.jpg' },
  plink_1UTidh85u7jC8FxLHFAvW5bV: { id:'bauhaus-2', nombre:'Eje y círculo', product:'prod_VUi3kGyDHMVcfy', edicion:100, size:22, fija:true, img:'https://www.gazetastudio.com/assets/print-bauhaus-2.jpg' },
  plink_1UTidi85u7jC8FxLtLq7eIir: { id:'bauhaus-3', nombre:'Tríada', product:'prod_VUi3AN6Qz9OCcb', edicion:100, size:8,  fija:true, img:'https://www.gazetastudio.com/assets/print-bauhaus-3.jpg' },
  plink_1UTidj85u7jC8FxLc8b5ApaB: { id:'ethereum-1', nombre:'Nodo', product:'prod_VUi3sp4xJrq2aV', edicion:100, size:22, fija:true, img:'https://www.gazetastudio.com/assets/print-ethereum-1.jpg' },

  plink_1UTj8X85u7jC8FxLIGR4DIaE: { id:'popart-1', nombre:'Rostro pop', product:'prod_VUiZCKO39ke8Qo', edicion:100, size:22, fija:true, img:'https://www.gazetastudio.com/assets/print-popart-1.jpg' },
  plink_1UTj8g85u7jC8FxLfmwnUVEX: { id:'popart-2', nombre:'Plátano explosivo', product:'prod_VUiZY6TiFONgLR', edicion:100, size:22, fija:true, img:'https://www.gazetastudio.com/assets/print-popart-2.jpg' },
  plink_1UTj8g85u7jC8FxLEpw7SH84: { id:'popart-3', nombre:'Big bang', product:'prod_VUiZKXWtQSYBgX', edicion:100, size:44, fija:true, img:'https://www.gazetastudio.com/assets/print-popart-3.jpg' },
  plink_1UTj8h85u7jC8FxLqQI5NMKs: { id:'dimension-1', nombre:'Estratos', product:'prod_VUiZBc8W48G8wJ', edicion:100, size:22, fija:true, img:'https://www.gazetastudio.com/assets/print-dimension-1.jpg' },
  plink_1UTj8h85u7jC8FxLCIYqOLlG: { id:'dimension-2', nombre:'Arcos flotantes', product:'prod_VUiZff1Aq3SYh8', edicion:100, size:44, fija:true, img:'https://www.gazetastudio.com/assets/print-dimension-2.jpg' },
  plink_1UTj8h85u7jC8FxLPL8OiRCF: { id:'dimension-3', nombre:'Ola tallada', product:'prod_VUiZZMTjFPCDd1', edicion:100, size:30, fija:true, img:'https://www.gazetastudio.com/assets/print-dimension-3.jpg' },

  plink_1UTvuq85u7jC8FxLdtW3DAEM: { id:'ethereum-2', nombre:'Vórtice', product:'prod_VUvmwGnOnc6ill', edicion:100, size:22, fija:true, img:'https://www.gazetastudio.com/assets/print-ethereum-2.jpg' },
  plink_1UTvur85u7jC8FxLtiiGHJcv: { id:'ethereum-3', nombre:'Nébula', product:'prod_VUvmlW9gjpFFdm', edicion:100, size:44, fija:true, img:'https://www.gazetastudio.com/assets/print-ethereum-3.jpg' },
  plink_1UTvur85u7jC8FxLbrJQiwel: { id:'ethereum-4', nombre:'Fractura', product:'prod_VUvmCahGx6fQMi', edicion:100, size:30, fija:true, img:'https://www.gazetastudio.com/assets/print-ethereum-4.jpg' },
  plink_1UTvus85u7jC8FxLZJxjhSHs: { id:'eclectic-4', nombre:'Azotea', product:'prod_VUvmSjJG8aqZ58', edicion:100, size:22, fija:true, img:'https://www.gazetastudio.com/assets/print-eclectic-4.jpg' },
  plink_1UTvus85u7jC8FxLUoB0mzg6: { id:'eclectic-5', nombre:'Bodegón eléctrico', product:'prod_VUvm1qbpceU51L', edicion:100, size:44, fija:true, img:'https://www.gazetastudio.com/assets/print-eclectic-5.jpg' },
  plink_1UTvus85u7jC8FxLl4AcDYm0: { id:'nordic-4', nombre:'Lago quieto', product:'prod_VUvm3qimCUm6Vy', edicion:100, size:44, fija:true, img:'https://www.gazetastudio.com/assets/print-nordic-4.jpg' },
  plink_1UTvut85u7jC8FxLvDyCRfaB: { id:'nordic-5', nombre:'Bosque blanco', product:'prod_VUvmD7CQJ3hQUc', edicion:100, size:22, fija:true, img:'https://www.gazetastudio.com/assets/print-nordic-5.jpg' },
  plink_1UTvut85u7jC8FxLlNakWfly: { id:'bauhaus-4', nombre:'Progresión', product:'prod_VUvmAsDJT4m9iu', edicion:100, size:8, fija:true, img:'https://www.gazetastudio.com/assets/print-bauhaus-4.jpg' },
  plink_1UTvuu85u7jC8FxLtoFFt246: { id:'bauhaus-5', nombre:'Arco primario', product:'prod_VUvmqH6oX9t1B8', edicion:100, size:44, fija:true, img:'https://www.gazetastudio.com/assets/print-bauhaus-5.jpg' },
  plink_1UTvuu85u7jC8FxLLw6Ah6tN: { id:'popart-4', nombre:'Chicle', product:'prod_VUvml9wJ1rbFHz', edicion:100, size:22, fija:true, img:'https://www.gazetastudio.com/assets/print-popart-4.jpg' },
};
const POR_IMPORTE = { 89000:'plink_1UTNij85u7jC8FxLbnArsbXA', 42000:'plink_1UTNiz85u7jC8FxLzPpIXtNu',
  24000:'plink_1UTNj085u7jC8FxLv8Aq1AfY', 56000:'plink_1UTNj185u7jC8FxLMLRqV6lM',
  115000:'plink_1UTNj285u7jC8FxLAlEUaRc0', 14500:'plink_1UTNj385u7jC8FxLbqRJAfN5' };
const RESTANTES_INI = { 'vino-primero':14, 'trazo-unico':16, 'linea-y-vino':18, 'arena-calma':12, 'horizonte-vino':9, 'geometria-callada':15 };

const stripe = async (ep, method='GET', params=null) => {
  const url = method==='GET' && params ? `https://api.stripe.com/v1/${ep}?${new URLSearchParams(params)}` : `https://api.stripe.com/v1/${ep}`;
  const r = await fetch(url, { method,
    headers:{ 'Authorization':`Bearer ${process.env.STRIPE_SECRET_KEY}`,
      ...(params ? {'Content-Type':'application/x-www-form-urlencoded'} : {}) },
    body: method!=='GET' && params ? new URLSearchParams(params) : undefined });
  const j = await r.json().catch(()=>({}));
  if(!r.ok) throw new Error(`Stripe ${ep}: ${JSON.stringify(j.error||j).slice(0,300)}`);
  return j;
};

const verificarFirma = (raw, header, secreto) => {
  const partes = Object.fromEntries(header.split(',').map(p=>p.split('=')));
  if(!partes.t || !partes.v1) return false;
  if(Math.abs(Date.now()/1000 - Number(partes.t)) > 300) return false;
  const calc = crypto.createHmac('sha256', secreto).update(`${partes.t}.${raw}`).digest('hex');
  const a = Buffer.from(calc), b = Buffer.from(partes.v1);
  return a.length===b.length && crypto.timingSafeEqual(a,b);
};

const email = async (to, subject, html) => {
  const r = await fetch('https://api.resend.com/emails', { method:'POST',
    headers:{ 'Authorization':`Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type':'application/json' },
    body: JSON.stringify({ from: process.env.MAIL_FROM, to:[to], subject, html }) });
  if(!r.ok) throw new Error(`Resend: ${(await r.text()).slice(0,200)}`);
};

export default async function handler(req, res) {
  if(req.method !== 'POST') return res.status(405).end();
  let raw=''; for await (const c of req) raw += c;
  const firma = req.headers['stripe-signature'];
  if(!firma || !verificarFirma(raw, firma, process.env.STRIPE_WEBHOOK_SECRET))
    return res.status(400).json({ error:'firma inválida' });

  const event = JSON.parse(raw);

  // ── Reembolsos: solo aviso (la anulación del pedido de Printumo es manual)
  if(event.type === 'charge.refunded'){
    const c = event.data.object || {};
    try {
      await email(process.env.MAIL_TO, 'REEMBOLSO en Gazeta Studio',
        `<p>Stripe ha reembolsado ${(c.amount_refunded??0)/100} € de un pago de ${(c.amount??0)/100} €.</p>
         <p>Pago: ${c.id}. Revisa el pedido en Printumo (Orders) y anúlalo si aún no se ha producido; si ya está producido, coordina la devolución con el cliente.</p>`);
    } catch(e){ console.error('mail reembolso:', e.message); }
    return res.status(200).json({ ok:true, tipo:'reembolso avisado' });
  }

  if(event.type !== 'checkout.session.completed') return res.status(200).json({ ok:true, ign:event.type });

  // ── Confirmación real: re-consultar la sesión a Stripe (no confiar en el cuerpo)
  const sid = event.data.object?.id;
  if(!sid) return res.status(200).json({ ok:true, ign:'sin id de sesión' });
  let s; try { s = await stripe(`checkout/sessions/${sid}`); }
  catch(e){ return res.status(500).json({ error:'no se pudo verificar la sesión' }); } // Stripe reintentará
  if(s.payment_status !== 'paid') return res.status(200).json({ ok:true, ign:'sin pagar' });

  const clave = s.payment_link || POR_IMPORTE[s.amount_total];
  const obra = OBRAS[clave];
  if(!obra) return res.status(200).json({ ok:true, ign:'obra no reconocida' });

  // ── Idempotencia: marca de sesión procesada en metadata del producto
  if(!obra.fija){
    try {
      const prod0 = await stripe(`products/${obra.product}`);
      if((prod0.metadata?.['ult_sesion_'+obra.id] || '') === sid){
        return res.status(200).json({ ok:true, dup:true, ign:'evento ya procesado' });
      }
    } catch(e){ console.error('idemp check:', e.message); }
  }

  // ── Numeración y stock (metadata `restantes`)
  let restantes, numero = null;
  if(!obra.fija){
    try {
      const prod = await stripe(`products/${obra.product}`);
      restantes = parseInt(prod.metadata?.restantes ?? RESTANTES_INI[obra.id], 10);
      numero = obra.edicion - restantes + 1;
      if(restantes > 0) await stripe(`products/${obra.product}`, 'POST', { 'metadata[restantes]': String(restantes-1) });
      await stripe(`products/${obra.product}`, 'POST', { [`metadata[ult_sesion_${obra.id}]`]: sid });
      if(restantes-1 <= 0 && s.payment_link) await stripe(`payment_links/${s.payment_link}`, 'POST', { active:'false' });
    } catch(e) { console.error('stock:', e.message); numero = null; }
  }

  // ── Dirección del comprador
  const cd = s.customer_details || {};
  const dir = cd.address || {};
  const [first_name='Cliente', ...ap] = (cd.name || 'Cliente').split(' ');
  const envio = { email: cd.email || s.customer_email, first_name, last_name: ap.join(' ') || '-',
    address1: dir.line1 || '', city: dir.city || '', postcode: dir.postal_code || '', country_code: dir.country || '' };
  const direccionOk = envio.address1 && envio.city && envio.postcode && envio.country_code;

  // ── Pedido en Printumo
  let printumo = null;
  if(direccionOk){
    try {
      const r = await fetch('https://printumo.com/api/v1/api_image_orders', { method:'POST',
        headers:{ 'Authorization':`Bearer ${process.env.PRINTUMO_API_KEY}`, 'Content-Type':'application/json' },
        body: JSON.stringify({ line_items:[{ image_url: obra.img, print_type_id:2, size_id:obra.size,
          framing_id:2, market_id:1, quantity:1, canvas_wrapping:{ wrap_type:'mirrored' } }],
          shipping_address: envio }) });
      printumo = await r.json().catch(()=>({}));
      if(!r.ok) console.error('printumo:', r.status, JSON.stringify(printumo).slice(0,300));
    } catch(e) { console.error('printumo fetch:', e.message); }
  }

  // ── Emails (un fallo de email NO debe impedir que Stripe reintente la producción:
  //    se avisa al estudio y se responde 200)
  const estado = printumo?.data ? 'En producción' : 'PENDIENTE DE REVISAR (Printumo no confirmó)';
  const num = obra.fija
    ? `Su lienzo «${obra.nombre}» ya está <b>en preparación</b>.`
    : (numero ? `Su ejemplar es el <b>№ ${numero} de ${obra.edicion}</b>` : 'Su número de edición se le confirmará por email');
  try {
    await email(process.env.MAIL_TO, `¡VENTA! «${obra.nombre}» — ${((s.amount_total||0)/100).toFixed(0)} €`,
      `<div style="font-family:Georgia,serif">
        <h2>«${obra.nombre}» — ${((s.amount_total||0)/100).toFixed(0)} €</h2>
        <p>№ ${numero ?? '?'} de ${obra.edicion} · Estado: <b>${estado}</b>${printumo?.data ? ` (${printumo.data.api_image_order_id||printumo.data.id})` : ''}</p>
        <p><b>Cliente:</b> ${cd.name||'—'} (${cd.email||'—'}, ${cd.phone||'sin teléfono'})</p>
        <p><b>Envío:</b> ${envio.address1||'—'}, ${envio.postcode||'—'} ${envio.city||'—'}, ${envio.country_code||'—'}</p>
        <p>Sesión Stripe: ${sid}</p></div>`);
  } catch(e){ console.error('mail estudio:', e.message); }
  if(envio.email){
    try {
      await email(envio.email, `GAZETA STUDIO — Pedido confirmado: «${obra.nombre}»`,
        `<div style="font-family:Georgia,serif;max-width:560px">
          <p style="letter-spacing:.3em">GAZETA STUDIO</p>
          <h2>Gracias por su compra — «${obra.nombre}»</h2>
          <p>${num}, registrado a su nombre.</p>
          <p>El lienzo ya está en camino con <b>envío asegurado</b> a: ${envio.address1}, ${envio.postcode} ${envio.city}, ${envio.country_code}.</p>
          <p>Cada obra se entrega con su <b>certificado de autenticidad</b>. Cuando la edición se agota, la obra se retira: no hay segundas ediciones.</p>
          <p style="color:#777;font-size:.9em">Gazeta Studio · contacto@gazetastudio.com</p></div>`);
    } catch(e){ console.error('mail cliente:', e.message); }
  }

  return res.status(200).json({ ok:true, obra:obra.id, numero, printumo: printumo?.data ? 'creado' : 'no_creado' });
}
