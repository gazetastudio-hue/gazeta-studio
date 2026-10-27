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
  plink_1UUtIH85u7jC8FxLsP7M3KnV: { id:'vino-primero',      nombre:'Corriente',        product:'prod_VVv8zJYc3NUEIr', edicion:20, size:22, fija:false, img:'https://www.gazetastudio.com/assets/print-vino-v2.jpg' },
  plink_1UTNiz85u7jC8FxLzPpIXtNu: { id:'trazo-unico',       nombre:'Pulso',            product:'prod_VUMRGwjTiy5ffP', edicion:20, size:44, fija:false, img:'https://www.gazetastudio.com/assets/print-trazo-v3.jpg' },
  plink_1UTNj085u7jC8FxLv8Aq1AfY: { id:'linea-y-vino',      nombre:'Perfil en reposo', product:'prod_VUMRXQn31wHO1U', edicion:20, size:19, fija:false, img:'https://www.gazetastudio.com/assets/print-linea-v2.jpg' },
  plink_1UTNj185u7jC8FxLMLRqV6lM: { id:'arena-calma',       nombre:'Mediodía',         product:'prod_VUMR8RqqCZm1Pp', edicion:20, size:30, fija:false, img:'https://www.gazetastudio.com/assets/print-arena-v2.jpg' },
  plink_1UTNj285u7jC8FxLAlEUaRc0: { id:'horizonte-vino',    nombre:'Última luz',       product:'prod_VUMRSpUJGD3fMY', edicion:20, size:22, fija:false, img:'https://www.gazetastudio.com/assets/print-horizonte-v2.jpg' },
  plink_1UTNj385u7jC8FxLbqRJAfN5: { id:'geometria-callada', nombre:'Equilibrio',       product:'prod_VUMRdH5PhvuJDa', edicion:20, size:39, fija:false, img:'https://www.gazetastudio.com/assets/print-geometria-v2.jpg' },
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

  plink_1UUtEO85u7jC8FxLZC4XgpSM: { id:'popart-1', nombre:'Rostro pop', product:'prod_VVv4BeBm0Lr2H0', edicion:100, size:22, fija:true, img:'https://www.gazetastudio.com/assets/print-popart-1.jpg' },
  plink_1UUtEP85u7jC8FxLY0AlTLYX: { id:'popart-2', nombre:'Plátano explosivo', product:'prod_VVv4O29TXcG8YE', edicion:100, size:22, fija:true, img:'https://www.gazetastudio.com/assets/print-popart-2.jpg' },
  plink_1UUtEQ85u7jC8FxLU7TVK5jl: { id:'popart-3', nombre:'Big bang', product:'prod_VVv4bfaaLngEnu', edicion:100, size:44, fija:true, img:'https://www.gazetastudio.com/assets/print-popart-3.jpg' },
  plink_1UUtE085u7jC8FxLToVJeZQ7: { id:'dimension-1', nombre:'Estratos', product:'prod_VVv4GzefGvIzVY', edicion:100, size:22, fija:true, img:'https://www.gazetastudio.com/assets/print-dimension-1.jpg' },
  plink_1UUtE285u7jC8FxLldpyL5fI: { id:'dimension-2', nombre:'Arcos flotantes', product:'prod_VVv4EXZNaST9FC', edicion:100, size:44, fija:true, img:'https://www.gazetastudio.com/assets/print-dimension-2.jpg' },
  plink_1UUtE385u7jC8FxLtj26Sqx8: { id:'dimension-3', nombre:'Ola tallada', product:'prod_VVv4OmD7kjjFk5', edicion:100, size:30, fija:true, img:'https://www.gazetastudio.com/assets/print-dimension-3.jpg' },

  plink_1UUtED85u7jC8FxLKLrX6NUY: { id:'ethereum-2', nombre:'Vórtice', product:'prod_VVv4gAGjZdoZf3', edicion:100, size:22, fija:true, img:'https://www.gazetastudio.com/assets/print-ethereum-2.jpg' },
  plink_1UUtEE85u7jC8FxLcjTwYECS: { id:'ethereum-3', nombre:'Nébula', product:'prod_VVv4tNtC54HyXN', edicion:100, size:44, fija:true, img:'https://www.gazetastudio.com/assets/print-ethereum-3.jpg' },
  plink_1UUtEF85u7jC8FxLNEq2kmGK: { id:'ethereum-4', nombre:'Fractura', product:'prod_VVv4YrBK904c41', edicion:100, size:30, fija:true, img:'https://www.gazetastudio.com/assets/print-ethereum-4.jpg' },
  plink_1UUtE885u7jC8FxLvwqCMVvC: { id:'eclectic-4', nombre:'Azotea', product:'prod_VVv4XFhUi6nfOL', edicion:100, size:22, fija:true, img:'https://www.gazetastudio.com/assets/print-eclectic-4.jpg' },
  plink_1UUtE985u7jC8FxLr4lvw43j: { id:'eclectic-5', nombre:'Bodegón eléctrico', product:'prod_VVv4KVdQ7GHdZJ', edicion:100, size:44, fija:true, img:'https://www.gazetastudio.com/assets/print-eclectic-5.jpg' },
  plink_1UUtEK85u7jC8FxLwqFJcLwa: { id:'nordic-4', nombre:'Lago quieto', product:'prod_VVv4DP09APd4CI', edicion:100, size:44, fija:true, img:'https://www.gazetastudio.com/assets/print-nordic-4.jpg' },
  plink_1UUtEL85u7jC8FxLwnxswcWV: { id:'nordic-5', nombre:'Bosque blanco', product:'prod_VVv4wIfRpiDpT6', edicion:100, size:22, fija:true, img:'https://www.gazetastudio.com/assets/print-nordic-5.jpg' },
  plink_1UUtDw85u7jC8FxLmIsvxrF1: { id:'bauhaus-4', nombre:'Progresión', product:'prod_VVv45kDDBlGOsY', edicion:100, size:8, fija:true, img:'https://www.gazetastudio.com/assets/print-bauhaus-4.jpg' },
  plink_1UUtDw85u7jC8FxL4e9Fg2O0: { id:'bauhaus-5', nombre:'Arco primario', product:'prod_VVv4rBMfgJHetQ', edicion:100, size:44, fija:true, img:'https://www.gazetastudio.com/assets/print-bauhaus-5.jpg' },
  plink_1UUtER85u7jC8FxLHHDt51Df: { id:'popart-4', nombre:'Chicle', product:'prod_VVv4gFeAtMOf4w', edicion:100, size:22, fija:true, img:'https://www.gazetastudio.com/assets/print-popart-4.jpg' },
  plink_1UUtEA85u7jC8FxLv9RyIFUu: { id:'eclectic-6', nombre:'Mercado de flores', product:'prod_VVv4ggSWyYqVfW', edicion:100, size:44, fija:true, img:'https://www.gazetastudio.com/assets/print-eclectic-6.jpg' },
  plink_1UUtEA85u7jC8FxLZuF27vtI: { id:'eclectic-7', nombre:'La cocina roja', product:'prod_VVv47lgoIxSeUW', edicion:100, size:32, fija:true, img:'https://www.gazetastudio.com/assets/print-eclectic-7.jpg' },
  plink_1UUtEB85u7jC8FxLpckg9ATP: { id:'eclectic-8', nombre:'Danza de sombrillas', product:'prod_VVv4pm964pzQCA', edicion:100, size:22, fija:true, img:'https://www.gazetastudio.com/assets/print-eclectic-8.jpg' },
  plink_1UUtEC85u7jC8FxLPTKKqMQ1: { id:'eclectic-9', nombre:'Jardín nocturno', product:'prod_VVv4Vo7YpmgUwt', edicion:100, size:39, fija:true, img:'https://www.gazetastudio.com/assets/print-eclectic-9.jpg' },
  plink_1UUtE885u7jC8FxLID6CgDR8: { id:'eclectic-10', nombre:'El coleccionista', product:'prod_VVv4khjWbLD5Yk', edicion:100, size:8, fija:true, img:'https://www.gazetastudio.com/assets/print-eclectic-10.jpg' },
  plink_1UUtEL85u7jC8FxLtze04r0I: { id:'nordic-6', nombre:'Marea baja', product:'prod_VVv4qcpbnxHmOu', edicion:100, size:44, fija:true, img:'https://www.gazetastudio.com/assets/print-nordic-6.jpg' },
  plink_1UUtEM85u7jC8FxLlFI5wLQt: { id:'nordic-7', nombre:'Hielo', product:'prod_VVv4OR8FnbKGuK', edicion:100, size:32, fija:true, img:'https://www.gazetastudio.com/assets/print-nordic-7.jpg' },
  plink_1UUtEN85u7jC8FxLlOqaaLbZ: { id:'nordic-8', nombre:'Campo de centeno', product:'prod_VVv4f9wBhHtLsK', edicion:100, size:22, fija:true, img:'https://www.gazetastudio.com/assets/print-nordic-8.jpg' },
  plink_1UUtEN85u7jC8FxLI4T6PZFi: { id:'nordic-9', nombre:'Primer tren', product:'prod_VVv4N3LWeuWI1p', edicion:100, size:39, fija:true, img:'https://www.gazetastudio.com/assets/print-nordic-9.jpg' },
  plink_1UUtEJ85u7jC8FxLfbRIEF2G: { id:'nordic-10', nombre:'Ventana al fiordo', product:'prod_VVv4Tuzxoszuzp', edicion:100, size:8, fija:true, img:'https://www.gazetastudio.com/assets/print-nordic-10.jpg' },
  plink_1UUtDx85u7jC8FxLYmIAV6F8: { id:'bauhaus-6', nombre:'Contracomposición', product:'prod_VVv47Y25GeXKBB', edicion:100, size:22, fija:true, img:'https://www.gazetastudio.com/assets/print-bauhaus-6.jpg' },
  plink_1UUtDy85u7jC8FxLnzseqEuu: { id:'bauhaus-7', nombre:'Tres mástiles', product:'prod_VVv4aU7gV1tTga', edicion:100, size:44, fija:true, img:'https://www.gazetastudio.com/assets/print-bauhaus-7.jpg' },
  plink_1UUtDz85u7jC8FxLDZXkSsdM: { id:'bauhaus-8', nombre:'Círculo roto', product:'prod_VVv40IF070dkrW', edicion:100, size:32, fija:true, img:'https://www.gazetastudio.com/assets/print-bauhaus-8.jpg' },
  plink_1UUtE085u7jC8FxLcKxapQ7K: { id:'bauhaus-9', nombre:'Escalera cromática', product:'prod_VVv4PQPNgbieHT', edicion:100, size:39, fija:true, img:'https://www.gazetastudio.com/assets/print-bauhaus-9.jpg' },
  plink_1UUtDv85u7jC8FxLnRBpE9Ho: { id:'bauhaus-10', nombre:'Metropolitano', product:'prod_VVv4kzc6maeYYl', edicion:100, size:8, fija:true, img:'https://www.gazetastudio.com/assets/print-bauhaus-10.jpg' },
  plink_1UUtEG85u7jC8FxL9uNwqV52: { id:'ethereum-5', nombre:'Espejo líquido', product:'prod_VVv41X2byIUhW8', edicion:100, size:22, fija:true, img:'https://www.gazetastudio.com/assets/print-ethereum-5.jpg' },
  plink_1UUtEG85u7jC8FxLMKtJVFtp: { id:'ethereum-6', nombre:'Señal', product:'prod_VVv4YpYIV7yFYd', edicion:100, size:32, fija:true, img:'https://www.gazetastudio.com/assets/print-ethereum-6.jpg' },
  plink_1UUtEH85u7jC8FxLNUCELWJb: { id:'ethereum-7', nombre:'Constelación', product:'prod_VVv4ri9nTCmRvJ', edicion:100, size:44, fija:true, img:'https://www.gazetastudio.com/assets/print-ethereum-7.jpg' },
  plink_1UUtEI85u7jC8FxL1yiVB3jY: { id:'ethereum-8', nombre:'Abismo dorado', product:'prod_VVv44m13eXGEwy', edicion:100, size:8, fija:true, img:'https://www.gazetastudio.com/assets/print-ethereum-8.jpg' },
  plink_1UUtEI85u7jC8FxLvoYo0n5Z: { id:'ethereum-9', nombre:'Latencia', product:'prod_VVv4b4vE5jKp3k', edicion:100, size:39, fija:true, img:'https://www.gazetastudio.com/assets/print-ethereum-9.jpg' },
  plink_1UUtED85u7jC8FxLtslXJGL1: { id:'ethereum-10', nombre:'Núcleo', product:'prod_VVv4ZP0wF5lSkW', edicion:100, size:30, fija:true, img:'https://www.gazetastudio.com/assets/print-ethereum-10.jpg' },
  plink_1UUtER85u7jC8FxLC4x96z0Z: { id:'popart-5', nombre:'Cóctel', product:'prod_VVv4fxyVeqkqfn', edicion:100, size:22, fija:true, img:'https://www.gazetastudio.com/assets/print-popart-5.jpg' },
  plink_1UUtES85u7jC8FxLhK985cJd: { id:'popart-6', nombre:'Patatas fritas', product:'prod_VVv4Guojk2D7r3', edicion:100, size:32, fija:true, img:'https://www.gazetastudio.com/assets/print-popart-6.jpg' },
  plink_1UUtET85u7jC8FxLLnZz3pZm: { id:'popart-7', nombre:'La estrella', product:'prod_VVv4FJjiOcU44D', edicion:100, size:44, fija:true, img:'https://www.gazetastudio.com/assets/print-popart-7.jpg' },
  plink_1UUtET85u7jC8FxLA455Kb8z: { id:'popart-8', nombre:'Burbujas', product:'prod_VVv4XuFZtRv6sO', edicion:100, size:39, fija:true, img:'https://www.gazetastudio.com/assets/print-popart-8.jpg' },
  plink_1UUtEU85u7jC8FxLcttQjvNB: { id:'popart-9', nombre:'Casete', product:'prod_VVv43NkclROvSV', edicion:100, size:8, fija:true, img:'https://www.gazetastudio.com/assets/print-popart-9.jpg' },
  plink_1UUtEP85u7jC8FxLHjzM8cfo: { id:'popart-10', nombre:'Sirena', product:'prod_VVv4MydoGH7WhH', edicion:100, size:30, fija:true, img:'https://www.gazetastudio.com/assets/print-popart-10.jpg' },
  plink_1UUtE385u7jC8FxLUlHsF62w: { id:'dimension-4', nombre:'Estratos II', product:'prod_VVv4f5kb9NzTMy', edicion:100, size:22, fija:true, img:'https://www.gazetastudio.com/assets/print-dimension-4.jpg' },
  plink_1UUtE485u7jC8FxL5tEsoRle: { id:'dimension-5', nombre:'Plegado', product:'prod_VVv43VLn9NFgzR', edicion:100, size:32, fija:true, img:'https://www.gazetastudio.com/assets/print-dimension-5.jpg' },
  plink_1UUtE585u7jC8FxLJ6CUlMkp: { id:'dimension-6', nombre:'Duna interior', product:'prod_VVv4Dwn3QOqBYK', edicion:100, size:44, fija:true, img:'https://www.gazetastudio.com/assets/print-dimension-6.jpg' },
  plink_1UUtE585u7jC8FxL2p732Gnd: { id:'dimension-7', nombre:'Fronda', product:'prod_VVv4Et29N6qXB7', edicion:100, size:39, fija:true, img:'https://www.gazetastudio.com/assets/print-dimension-7.jpg' },
  plink_1UUtE685u7jC8FxLCXhFz77i: { id:'dimension-8', nombre:'Marea de papel', product:'prod_VVv45NJ0UsCM3Z', edicion:100, size:8, fija:true, img:'https://www.gazetastudio.com/assets/print-dimension-8.jpg' },
  plink_1UUtE785u7jC8FxLVpbkxBbu: { id:'dimension-9', nombre:'Umbral', product:'prod_VVv49z1QMSpdDP', edicion:100, size:19, fija:true, img:'https://www.gazetastudio.com/assets/print-dimension-9.jpg' },
  plink_1UUtE185u7jC8FxLD02NJOvF: { id:'dimension-10', nombre:'Vertedera', product:'prod_VVv4qs4r2rwFTQ', edicion:100, size:30, fija:true, img:'https://www.gazetastudio.com/assets/print-dimension-10.jpg' },
  plink_1UUtEW85u7jC8FxLyxUl0CvB: { id:'textures-7', nombre:'Vena', product:'prod_VVv4u2wKPL90nP', edicion:20, size:22, fija:false, img:'https://www.gazetastudio.com/assets/print-textures-7.jpg' },
  plink_1UUtEW85u7jC8FxLBNLlzEgq: { id:'textures-8', nombre:'Ceniza', product:'prod_VVv47ALRy0k7SD', edicion:20, size:44, fija:false, img:'https://www.gazetastudio.com/assets/print-textures-8.jpg' },
  plink_1UUtEX85u7jC8FxLPMs8W5Hp: { id:'textures-9', nombre:'Atardecer en yeso', product:'prod_VVv4GYmLWHvGbR', edicion:20, size:30, fija:false, img:'https://www.gazetastudio.com/assets/print-textures-9.jpg' },
  plink_1UUtEV85u7jC8FxLVcyxsxNK: { id:'textures-10', nombre:'Piel', product:'prod_VVv4NYU0rjWJBe', edicion:20, size:19, fija:false, img:'https://www.gazetastudio.com/assets/print-textures-10.jpg' },
};
const POR_IMPORTE = { 89000:'plink_1UTNij85u7jC8FxLbnArsbXA', 42000:'plink_1UTNiz85u7jC8FxLzPpIXtNu',
  24000:'plink_1UTNj085u7jC8FxLv8Aq1AfY', 56000:'plink_1UTNj185u7jC8FxLMLRqV6lM',
  115000:'plink_1UTNj285u7jC8FxLAlEUaRc0', 14500:'plink_1UTNj385u7jC8FxLbqRJAfN5' };
const RESTANTES_INI = {"vino-primero": 20, "trazo-unico": 20, "linea-y-vino": 20, "arena-calma": 20, "horizonte-vino": 20, "geometria-callada": 20, "textures-7": 20, "textures-8": 20, "textures-9": 20, "textures-10": 20};
const sbCred = () => process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY ? { url: process.env.SUPABASE_URL, key: process.env.SUPABASE_SERVICE_KEY } : null;
async function stockLeer(id, obra){
  const sb = sbCred();
  if(sb){
    try{
      const r = await fetch(`${sb.url}/rest/v1/ediciones?obra_id=eq.${id}&select=restantes`, { headers: { apikey: sb.key, Authorization: `Bearer ${sb.key}` } }).then(x => x.json());
      if(Array.isArray(r) && r[0]) return parseInt(r[0].restantes, 10);
    }catch(e){ console.error('sb leer:', e.message); }
  }
  const prod = await stripe(`products/${obra.product}`);
  return parseInt(prod.metadata?.restantes ?? RESTANTES_INI[obra.id], 10);
}
async function stockVender(id, obra, n){
  const sb = sbCred();
  let rest = null;
  if(sb){
    try{
      const r = await fetch(`${sb.url}/rest/v1/rpc/vender_obra`, { method:'POST', headers: { apikey: sb.key, Authorization: `Bearer ${sb.key}`, 'Content-Type':'application/json' }, body: JSON.stringify({ p_obra:id, p_n:n }) }).then(x => x.json());
      const v = parseInt(r, 10); if(Number.isFinite(v)) rest = v;
    }catch(e){ console.error('sb vender:', e.message); }
  }
  if(rest === null){ const actual = await stockLeer(id, obra); rest = Math.max(0, actual - n); }
  await stripe(`products/${obra.product}`, 'POST', { 'metadata[restantes]': String(rest) }).catch(e => console.error('sync stripe:', e.message));
  return rest;
}
const OBRAS_BY_ID = {}; for(const [plink,o] of Object.entries(OBRAS)) OBRAS_BY_ID[o.id] = { ...o, plink };

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


// ── Procesa un pago de carrito: stock y numeración por obra (con unidades),
//    un pedido Printumo por obra (quantity = unidades), emails estudio+cliente.
async function procesarCarrito(s, res){
  const sid = s.id;
  const items = (s.metadata?.obras || '').split(',').map(x => { const [id, q] = x.split(':'); return { id, qty: Math.max(1, parseInt(q, 10) || 1) }; }).filter(x => OBRAS_BY_ID[x.id]);
  if(items.length === 0) return res.status(200).json({ ok:true, ign:'carrito sin obras reconocidas' });

  const ventas = [];
  for(const { id, qty } of items){
    const obra = OBRAS_BY_ID[id];
    let nums = null, vendidas = qty;
    if(!obra.fija){
      try{
        const prod = await stripe(`products/${obra.product}`);
        if((prod.metadata?.['ult_sesion_'+obra.id] || '') === sid){ ventas.push({ ...obra, qty, dup:true }); continue; }
        const restantes = await stockLeer(id, obra);
        vendidas = Math.min(qty, Math.max(0, restantes));
        if(vendidas > 0){
          const primera = obra.edicion - restantes + 1;
          nums = [primera, primera + vendidas - 1];
          const quedan = await stockVender(id, obra, vendidas);
          if(quedan <= 0 && obra.plink){
            await stripe(`payment_links/${obra.plink}`, 'POST', { active:'false' }).catch(e => console.error('archivo plink:', e.message));
          }
        }
        if(vendidas < qty) console.error('SOBREVENTA', obra.id, 'pagadas', qty, 'disponibles', vendidas);
        await stripe(`products/${obra.product}`, 'POST', { [`metadata[ult_sesion_${obra.id}]`]: sid });
      }catch(e){ console.error('stock carrito:', e.message); }
    }
    ventas.push({ ...obra, qty, nums, vendidas });
  }
  const unicas = ventas.filter(v => !v.dup);

  const cd = s.customer_details || {};
  const dir = cd.address || {};
  const [first_name='Cliente', ...ap] = (cd.name || 'Cliente').split(' ');
  const envio = { email: cd.email || s.customer_email, first_name, last_name: ap.join(' ') || '-',
    address1: dir.line1 || '', city: dir.city || '', postcode: dir.postal_code || '', country_code: dir.country || '' };
  const direccionOk = envio.address1 && envio.city && envio.postcode && envio.country_code;

  const pedidos = [];
  if(direccionOk){
    for(const v of unicas){
      try{
        const r = await fetch('https://printumo.com/api/v1/api_image_orders', { method:'POST',
          headers:{ 'Authorization':`Bearer ${process.env.PRINTUMO_API_KEY}`, 'Content-Type':'application/json' },
          body: JSON.stringify({ line_items:[{ image_url:v.img, print_type_id:2, size_id:v.size,
            framing_id:2, market_id:1, quantity:v.qty, canvas_wrapping:{ wrap_type:'mirrored' } }],
            shipping_address: envio }) });
        const j = await r.json().catch(()=>({}));
        pedidos.push(j?.data ? String(j.data.api_image_order_id||j.data.id) : null);
        if(!r.ok) console.error('printumo carrito:', r.status, JSON.stringify(j).slice(0,200));
      }catch(e){ pedidos.push(null); console.error('printumo fetch:', e.message); }
    }
  }

  const rango = v => v.nums ? (v.nums[0] === v.nums[1] ? `№ ${v.nums[0]} de ${v.edicion}` : `№ ${v.nums[0]}–${v.nums[1]} de ${v.edicion}`) : '';
  const sobreventa = unicas.some(v => !OBRAS_BY_ID[v.id].fija && v.vendidas < v.qty);
  const listaEstudio = unicas.map((v,i)=>`<li>«${v.nombre}» ×${v.qty}${rango(v)?` — ${rango(v)}`:''} · pedido Printumo: <b>${pedidos[i]||'PENDIENTE'}</b>${(!OBRAS_BY_ID[v.id].fija && v.vendidas < v.qty)?` <b style="color:#b00">⚠ SOBREVENTA: pagadas ${v.qty}, quedaban ${v.vendidas} — REEMBOLSAR ${(v.qty-v.vendidas)*(v.precio||0)/100 || 'la diferencia'} €</b>`:''}</li>`).join('');
  try{
    await email(process.env.MAIL_TO, `¡VENTA! Carrito de ${unicas.reduce((a,v)=>a+v.qty,0)} lienzo(s) — ${((s.amount_total||0)/100).toFixed(0)} €${sobreventa?' ⚠ REVISAR':''}`,
      `<div style="font-family:Georgia,serif"><h2>Pedido multi-obra</h2><ul>${listaEstudio}</ul>
       <p><b>Cliente:</b> ${cd.name||'—'} (${cd.email||'—'}, ${cd.phone||'sin teléfono'})</p>
       <p><b>Envío:</b> ${envio.address1||'—'}, ${envio.postcode||'—'} ${envio.city||'—'}, ${envio.country_code||'—'}</p>
       <p>Envío cobrado: ${s.metadata?.envio_euros||'—'} € · Sesión Stripe: ${sid}</p></div>`);
  }catch(e){ console.error('mail estudio carrito:', e.message); }

  if(envio.email){
    const listaCli = unicas.map(v=>`<li>«${v.nombre}» ×${v.qty}${rango(v)?` — ejemplar${v.nums&&v.nums[0]!==v.nums[1]?'es':''} <b>${rango(v)}</b>`:''}</li>`).join('');
    try{
      await email(envio.email, `GAZETA STUDIO — Pedido confirmado (${unicas.reduce((a,v)=>a+v.qty,0)} lienzo${unicas.reduce((a,v)=>a+v.qty,0)>1?'s':''})`,
        `<div style="font-family:Georgia,serif;max-width:560px">
         <p style="letter-spacing:.3em">GAZETA STUDIO</p>
         <h2>Gracias por su compra</h2>
         <ul>${listaCli}</ul>
         <p>Las obras ya están en preparación y viajarán con <b>envío asegurado</b> a: ${envio.address1}, ${envio.postcode} ${envio.city}, ${envio.country_code}.</p>
         <p>Cada lienzo incluye su <b>certificado de autenticidad</b>. Las TEXTURES son edición limitada de 20: cuando se agotan, no vuelven.</p>
         <p style="color:#777;font-size:.9em">Gazeta Studio · contacto@gazetastudio.com</p></div>`);
    }catch(e){ console.error('mail cliente carrito:', e.message); }
  }

  return res.status(200).json({ ok:true, canal:'carrito', lienzos: unicas.reduce((a,v)=>a+v.qty,0), printumo: pedidos.filter(Boolean).length + '/' + unicas.length });
}

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

  // ── Carrito multi-obra: un pago → N obras (endpoint /api/checkout)
  if(s.metadata?.canal === 'carrito') return procesarCarrito(s, res);

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
