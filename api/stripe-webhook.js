// GAZETA STUDIO — Webhook de Stripe (Vercel Function)
// Flujo al cobrarse un pago: registra el número de edición (stock en metadata del producto),
// agota el enlace de pago si es el último ejemplar, crea el pedido de producción en Printumo
// y envía emails (cliente + estudio) con Resend.
//
// Variables requeridas en Vercel:
//   STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, PRINTUMO_API_KEY, RESEND_API_KEY, MAIL_FROM, MAIL_TO

import crypto from 'node:crypto';

export const config = { api: { bodyParser: false } };

const SITE = 'https://gazetastudio-hue.github.io/gazeta-studio/';

// obra → datos fijos (precios = cent€, edición total, specs Printumo: lienzo(2), mercado EU(1), sin marco(2))
const OBRAS = {
  plink_1UTNij85u7jC8FxLbnArsbXA: { id:'vino-primero', nombre:'Corriente',        product:'prod_VUMQ2svQfjywpf', edicion:30,  precio:89000,  size:22, img:SITE+'assets/print-vino.jpg' },
  plink_1UTNiz85u7jC8FxLzPpIXtNu: { id:'trazo-unico',  nombre:'Pulso',            product:'prod_VUMRGwjTiy5ffP', edicion:50,  precio:42000,  size:44, img:SITE+'assets/print-trazo.jpg' },
  plink_1UTNj085u7jC8FxLv8Aq1AfY: { id:'linea-y-vino', nombre:'Perfil en reposo', product:'prod_VUMRXQn31wHO1U', edicion:75,  precio:24000,  size:19, img:SITE+'assets/print-linea.jpg' },
  plink_1UTNj185u7jC8FxLMLRqV6lM: { id:'arena-calma',  nombre:'Mediodía',         product:'prod_VUMR8RqqCZm1Pp', edicion:40,  precio:56000,  size:30, img:SITE+'assets/print-arena.jpg' },
  plink_1UTNj285u7jC8FxLAlEUaRc0: { id:'horizonte-vino',nombre:'Última luz',      product:'prod_VUMRSpUJGD3fMY', edicion:20,  precio:115000, size:22, img:SITE+'assets/print-horizonte.jpg' },
  plink_1UTNj385u7jC8FxLbqRJAfN5: { id:'geometria-callada',nombre:'Equilibrio',   product:'prod_VUMRdH5PhvuJDa', edicion:100, precio:14500,  size:39, img:SITE+'assets/print-geometria.jpg' },
};
// respaldo por importe si el payment_link no viniera en el evento
const POR_IMPORTE = { 89000:'plink_1UTNij85u7jC8FxLbnArsbXA', 42000:'plink_1UTNiz85u7jC8FxLzPpIXtNu',
  24000:'plink_1UTNj085u7jC8FxLv8Aq1AfY', 56000:'plink_1UTNj185u7jC8FxLMLRqV6lM',
  115000:'plink_1UTNj285u7jC8FxLAlEUaRc0', 14500:'plink_1UTNj385u7jC8FxLbqRJAfN5' };
// restantes iniciales por si un producto aún no la lleva en metadata
const RESTANTES_INI = { 'vino-primero':11, 'trazo-unico':23, 'linea-y-vino':41, 'arena-calma':6, 'horizonte-vino':4, 'geometria-callada':58 };

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
  const t = partes.t, firma = partes.v1;
  if(!t || !firma) return false;
  if(Math.abs(Date.now()/1000 - Number(t)) > 300) return false;
  const calc = crypto.createHmac('sha256', secreto).update(`${t}.${raw}`).digest('hex');
  const a = Buffer.from(calc), b = Buffer.from(firma);
  return a.length===b.length && crypto.timingSafeEqual(a,b);
};

const email = async (to, subject, html) => {
  const r = await fetch('https://api.resend.com/emails', { method:'POST',
    headers:{ 'Authorization':`Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type':'application/json' },
    body: JSON.stringify({ from: process.env.MAIL_FROM, to:[to], subject, html }) });
  if(!r.ok) throw new Error(`Resend: ${(await r.text()).slice(0,300)}`);
  return r.json();
};

export default async function handler(req, res) {
  if(req.method !== 'POST') return res.status(405).end();
  let raw=''; for await (const c of req) raw += c;
  const firma = req.headers['stripe-signature'];
  if(!firma || !verificarFirma(raw, firma, process.env.STRIPE_WEBHOOK_SECRET))
    return res.status(400).json({ error:'firma inválida' });

  const event = JSON.parse(raw);
  if(event.type !== 'checkout.session.completed') return res.status(200).json({ ok:true, ign:'evento no gestionado' });
  const s = event.data.object;
  if(s.payment_status !== 'paid') return res.status(200).json({ ok:true, ign:'sin pagar todavía' });

  const clave = s.payment_link || POR_IMPORTE[s.amount_total];
  const obra = OBRAS[clave];
  if(!obra) return res.status(200).json({ ok:true, ign:'importe/conocido no coincidente' });

  // 1) Numeración y stock (metadata del producto Stripe como fuente de verdad)
  let restantes, numero;
  try {
    const prod = await stripe(`products/${obra.product}`);
    restantes = parseInt(prod.metadata?.restantes ?? RESTANTES_INI[obra.id], 10);
    numero = obra.edicion - restantes + 1;
    if(restantes > 0) await stripe(`products/${obra.product}`, 'POST', { 'metadata[restantes]': String(restantes-1) });
    const plinkId = s.payment_link || clave;
    if(restantes-1 <= 0) await stripe(`payment_links/${plinkId}`, 'POST', { active:'false' }); // agotado → fuera de venta
  } catch(e) { console.error('stock:', e.message); numero = null; }

  // 2) Dirección del comprador
  const cd = s.customer_details || {};
  const dir = cd.address || {};
  const [first_name='Cliente', ...ap] = (cd.name || 'Cliente').split(' ');
  const envio = { email: cd.email || s.customer_email, first_name, last_name: ap.join(' ') || '-',
    address1: dir.line1 || '', city: dir.city || '', postcode: dir.postal_code || '', country_code: dir.country || '' };
  const direccionOk = envio.address1 && envio.city && envio.postcode && envio.country_code;

  // 3) Producción bajo demanda en Printumo
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

  // 4) Emails (si fallan, no bloquean la respuesta al Stripe)
  const num = numero ? `Su ejemplar es el <b>№ ${numero} de ${obra.edicion}</b>` : 'Su número de edición se le confirmará por email';
  const htmlCliente = `<div style="font-family:Georgia,serif;max-width:560px">
    <p style="letter-spacing:.3em">GAZETA STUDIO</p>
    <h2>Gracias por su compra — «${obra.nombre}»</h2>
    <p>${num}, registrado a su nombre.</p>
    <p>El lienzo se produce ahora bajo demanda y viaja con <b>envío asegurado</b> a: ${envio.address1}, ${envio.postcode} ${envio.city}, ${envio.country_code}.</p>
    <p>Cada obra se entrega con su <b>certificado de autenticidad</b>. Cuando la edición se agota, la obra se retira: no hay segundas ediciones.</p>
    <p style="color:#777;font-size:.9em">Gazeta Studio · contacto@gazetastudio.com</p></div>`;
  const htmlEstudio = `<div style="font-family:Georgia,serif">
    <h2>¡Venta! «${obra.nombre}» — ${((s.amount_total||obra.precio)/100).toFixed(0)} €</h2>
    <p>№ ${numero ?? '?'} de ${obra.edicion} · Quedan ${Math.max(0,(restantes??1)-1)}</p>
    <p><b>Cliente:</b> ${cd.name} (${cd.email}, ${cd.phone||'sin teléfono'})</p>
    <p><b>Envío:</b> ${envio.address1}, ${envio.postcode} ${envio.city}, ${envio.country_code}</p>
    <p><b>Printumo:</b> ${printumo?.data ? 'pedido creado ('+(printumo.data.api_image_order_id||printumo.data.id)+')' : '⚠️ NO creado — revísalo a mano'}</p></div>`;
  const avisos=[];
  try { await email(process.env.MAIL_TO, `¡VENTA! «${obra.nombre}» — Gazeta Studio`, htmlEstudio); } catch(e){ avisos.push('mail_estudio'); console.error(e.message); }
  if(envio.email){ try { await email(envio.email, `GAZETA STUDIO — Pedido confirmado: «${obra.nombre}»`, htmlCliente); } catch(e){ avisos.push('mail_cliente'); console.error(e.message); } }

  return res.status(200).json({ ok:true, obra:obra.id, numero, printumo: printumo?.data ? 'creado' : 'no_creado', avisos });
}
