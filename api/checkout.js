// GAZETA STUDIO — Checkout multi-obra con unidades (Vercel Function)
// Recibe {items:[{id,qty}]} y crea UNA Checkout Session de Stripe:
// un solo pago, envío combinado por tamaños, stock de limitadas validado.
const RATE = { 32:0, 39:0, 19:0, 44:0, 22:0, 30:0, 8:0 }; // envío siempre gratuito (asegurado)
const CATALOGO = {"vino-primero":{"n":"Corriente","t":"100 × 150 cm","c":89000,"i":"https://www.gazetastudio.com/assets/print-vino-v2.jpg","s":22,"e":20,"r":20,"f":0},"trazo-unico":{"n":"Pulso","t":"100 × 140 cm","c":42000,"i":"https://www.gazetastudio.com/assets/print-trazo-v3.jpg","s":44,"e":20,"r":20,"f":0},"linea-y-vino":{"n":"Perfil en reposo","t":"60 × 90 cm","c":24000,"i":"https://www.gazetastudio.com/assets/print-linea-v2.jpg","s":19,"e":20,"r":20,"f":0},"arena-calma":{"n":"Mediodía","t":"120 × 165 cm","c":56000,"i":"https://www.gazetastudio.com/assets/print-arena-v2.jpg","s":30,"e":20,"r":20,"f":0},"horizonte-vino":{"n":"Última luz","t":"150 × 100 cm","c":115000,"i":"https://www.gazetastudio.com/assets/print-horizonte-v2.jpg","s":22,"e":20,"r":20,"f":0},"geometria-callada":{"n":"Equilibrio","t":"40 × 55 cm","c":14500,"i":"https://www.gazetastudio.com/assets/print-geometria-v2.jpg","s":39,"e":20,"r":20,"f":0},"textures-7":{"n":"Vena","t":"100 × 150 cm","c":28900,"i":"https://www.gazetastudio.com/assets/print-textures-7.jpg","s":22,"e":20,"r":20,"f":0},"textures-8":{"n":"Ceniza","t":"140 × 100 cm","c":25900,"i":"https://www.gazetastudio.com/assets/print-textures-8.jpg","s":44,"e":20,"r":20,"f":0},"textures-9":{"n":"Atardecer en yeso","t":"165 × 120 cm","c":29900,"i":"https://www.gazetastudio.com/assets/print-textures-9.jpg","s":30,"e":20,"r":20,"f":0},"textures-10":{"n":"Piel","t":"60 × 90 cm","c":18900,"i":"https://www.gazetastudio.com/assets/print-textures-10.jpg","s":19,"e":20,"r":20,"f":0},"eclectic-1":{"n":"Marea urbana","t":"100 × 150 cm","c":28900,"i":"https://www.gazetastudio.com/assets/print-eclectic-1.jpg","s":22,"e":100,"r":100,"f":1},"eclectic-2":{"n":"Terraza interior","t":"140 × 100 cm","c":17900,"i":"https://www.gazetastudio.com/assets/print-eclectic-2.jpg","s":44,"e":100,"r":100,"f":1},"eclectic-3":{"n":"Alfama","t":"140 × 100 cm","c":17900,"i":"https://www.gazetastudio.com/assets/print-eclectic-3.jpg","s":44,"e":100,"r":100,"f":1},"eclectic-4":{"n":"Azotea","t":"100 × 150 cm","c":19900,"i":"https://www.gazetastudio.com/assets/print-eclectic-4.jpg","s":22,"e":100,"r":100,"f":1},"eclectic-5":{"n":"Bodegón eléctrico","t":"140 × 100 cm","c":17900,"i":"https://www.gazetastudio.com/assets/print-eclectic-5.jpg","s":44,"e":100,"r":100,"f":1},"eclectic-6":{"n":"Mercado de flores","t":"140 × 100 cm","c":17900,"i":"https://www.gazetastudio.com/assets/print-eclectic-6.jpg","s":44,"e":100,"r":100,"f":1},"eclectic-7":{"n":"La cocina roja","t":"50 × 40 cm","c":11900,"i":"https://www.gazetastudio.com/assets/print-eclectic-7.jpg","s":32,"e":100,"r":100,"f":1},"eclectic-8":{"n":"Danza de sombrillas","t":"100 × 150 cm","c":19900,"i":"https://www.gazetastudio.com/assets/print-eclectic-8.jpg","s":22,"e":100,"r":100,"f":1},"eclectic-9":{"n":"Jardín nocturno","t":"55 × 40 cm","c":8900,"i":"https://www.gazetastudio.com/assets/print-eclectic-9.jpg","s":39,"e":100,"r":100,"f":1},"eclectic-10":{"n":"El coleccionista","t":"150 × 75 cm","c":22900,"i":"https://www.gazetastudio.com/assets/print-eclectic-10.jpg","s":8,"e":100,"r":100,"f":1},"nordic-1":{"n":"Silencio claro","t":"140 × 100 cm","c":17900,"i":"https://www.gazetastudio.com/assets/print-nordic-1.jpg","s":44,"e":100,"r":100,"f":1},"nordic-2":{"n":"Fiordo","t":"140 × 100 cm","c":17900,"i":"https://www.gazetastudio.com/assets/print-nordic-2.jpg","s":44,"e":100,"r":100,"f":1},"nordic-3":{"n":"Nieve de abril","t":"40 × 50 cm","c":8900,"i":"https://www.gazetastudio.com/assets/print-nordic-3.jpg","s":32,"e":100,"r":100,"f":1},"nordic-4":{"n":"Lago quieto","t":"140 × 100 cm","c":17900,"i":"https://www.gazetastudio.com/assets/print-nordic-4.jpg","s":44,"e":100,"r":100,"f":1},"nordic-5":{"n":"Bosque blanco","t":"100 × 150 cm","c":17900,"i":"https://www.gazetastudio.com/assets/print-nordic-5.jpg","s":22,"e":100,"r":100,"f":1},"nordic-6":{"n":"Marea baja","t":"140 × 100 cm","c":17900,"i":"https://www.gazetastudio.com/assets/print-nordic-6.jpg","s":44,"e":100,"r":100,"f":1},"nordic-7":{"n":"Hielo","t":"50 × 40 cm","c":7900,"i":"https://www.gazetastudio.com/assets/print-nordic-7.jpg","s":32,"e":100,"r":100,"f":1},"nordic-8":{"n":"Campo de centeno","t":"100 × 150 cm","c":17900,"i":"https://www.gazetastudio.com/assets/print-nordic-8.jpg","s":22,"e":100,"r":100,"f":1},"nordic-9":{"n":"Primer tren","t":"55 × 40 cm","c":7900,"i":"https://www.gazetastudio.com/assets/print-nordic-9.jpg","s":39,"e":100,"r":100,"f":1},"nordic-10":{"n":"Ventana al fiordo","t":"150 × 75 cm","c":19900,"i":"https://www.gazetastudio.com/assets/print-nordic-10.jpg","s":8,"e":100,"r":100,"f":1},"bauhaus-1":{"n":"Composición 7","t":"140 × 100 cm","c":17900,"i":"https://www.gazetastudio.com/assets/print-bauhaus-1.jpg","s":44,"e":100,"r":100,"f":1},"bauhaus-2":{"n":"Eje y círculo","t":"100 × 150 cm","c":27900,"i":"https://www.gazetastudio.com/assets/print-bauhaus-2.jpg","s":22,"e":100,"r":100,"f":1},"bauhaus-3":{"n":"Tríada","t":"75 × 150 cm","c":24900,"i":"https://www.gazetastudio.com/assets/print-bauhaus-3.jpg","s":8,"e":100,"r":100,"f":1},"bauhaus-4":{"n":"Progresión","t":"150 × 75 cm","c":22900,"i":"https://www.gazetastudio.com/assets/print-bauhaus-4.jpg","s":8,"e":100,"r":100,"f":1},"bauhaus-5":{"n":"Arco primario","t":"140 × 100 cm","c":18900,"i":"https://www.gazetastudio.com/assets/print-bauhaus-5.jpg","s":44,"e":100,"r":100,"f":1},"bauhaus-6":{"n":"Contracomposición","t":"100 × 150 cm","c":18900,"i":"https://www.gazetastudio.com/assets/print-bauhaus-6.jpg","s":22,"e":100,"r":100,"f":1},"bauhaus-7":{"n":"Tres mástiles","t":"140 × 100 cm","c":17900,"i":"https://www.gazetastudio.com/assets/print-bauhaus-7.jpg","s":44,"e":100,"r":100,"f":1},"bauhaus-8":{"n":"Círculo roto","t":"50 × 40 cm","c":9900,"i":"https://www.gazetastudio.com/assets/print-bauhaus-8.jpg","s":32,"e":100,"r":100,"f":1},"bauhaus-9":{"n":"Escalera cromática","t":"55 × 40 cm","c":8900,"i":"https://www.gazetastudio.com/assets/print-bauhaus-9.jpg","s":39,"e":100,"r":100,"f":1},"bauhaus-10":{"n":"Metropolitano","t":"150 × 75 cm","c":19900,"i":"https://www.gazetastudio.com/assets/print-bauhaus-10.jpg","s":8,"e":100,"r":100,"f":1},"ethereum-1":{"n":"Nodo","t":"100 × 150 cm","c":28900,"i":"https://www.gazetastudio.com/assets/print-ethereum-1.jpg","s":22,"e":100,"r":100,"f":1},"ethereum-2":{"n":"Vórtice","t":"100 × 150 cm","c":28900,"i":"https://www.gazetastudio.com/assets/print-ethereum-2.jpg","s":22,"e":100,"r":100,"f":1},"ethereum-3":{"n":"Nébula","t":"140 × 100 cm","c":26900,"i":"https://www.gazetastudio.com/assets/print-ethereum-3.jpg","s":44,"e":100,"r":100,"f":1},"ethereum-4":{"n":"Fractura","t":"165 × 120 cm","c":24900,"i":"https://www.gazetastudio.com/assets/print-ethereum-4.jpg","s":30,"e":100,"r":100,"f":1},"ethereum-5":{"n":"Espejo líquido","t":"100 × 150 cm","c":28900,"i":"https://www.gazetastudio.com/assets/print-ethereum-5.jpg","s":22,"e":100,"r":100,"f":1},"ethereum-6":{"n":"Señal","t":"50 × 40 cm","c":12900,"i":"https://www.gazetastudio.com/assets/print-ethereum-6.jpg","s":32,"e":100,"r":100,"f":1},"ethereum-7":{"n":"Constelación","t":"140 × 100 cm","c":25900,"i":"https://www.gazetastudio.com/assets/print-ethereum-7.jpg","s":44,"e":100,"r":100,"f":1},"ethereum-8":{"n":"Abismo dorado","t":"150 × 75 cm","c":19900,"i":"https://www.gazetastudio.com/assets/print-ethereum-8.jpg","s":8,"e":100,"r":100,"f":1},"ethereum-9":{"n":"Latencia","t":"55 × 40 cm","c":11900,"i":"https://www.gazetastudio.com/assets/print-ethereum-9.jpg","s":39,"e":100,"r":100,"f":1},"ethereum-10":{"n":"Núcleo","t":"165 × 120 cm","c":28900,"i":"https://www.gazetastudio.com/assets/print-ethereum-10.jpg","s":30,"e":100,"r":100,"f":1},"popart-1":{"n":"Rostro pop","t":"150 × 100 cm","c":17900,"i":"https://www.gazetastudio.com/assets/print-popart-1.jpg","s":22,"e":100,"r":100,"f":1},"popart-2":{"n":"Plátano explosivo","t":"100 × 150 cm","c":17900,"i":"https://www.gazetastudio.com/assets/print-popart-2.jpg","s":22,"e":100,"r":100,"f":1},"popart-3":{"n":"Big bang","t":"140 × 100 cm","c":17900,"i":"https://www.gazetastudio.com/assets/print-popart-3.jpg","s":44,"e":100,"r":100,"f":1},"popart-4":{"n":"Chicle","t":"150 × 100 cm","c":17900,"i":"https://www.gazetastudio.com/assets/print-popart-4.jpg","s":22,"e":100,"r":100,"f":1},"popart-5":{"n":"Cóctel","t":"100 × 150 cm","c":17900,"i":"https://www.gazetastudio.com/assets/print-popart-5.jpg","s":22,"e":100,"r":100,"f":1},"popart-6":{"n":"Patatas fritas","t":"50 × 40 cm","c":9900,"i":"https://www.gazetastudio.com/assets/print-popart-6.jpg","s":32,"e":100,"r":100,"f":1},"popart-7":{"n":"La estrella","t":"140 × 100 cm","c":17900,"i":"https://www.gazetastudio.com/assets/print-popart-7.jpg","s":44,"e":100,"r":100,"f":1},"popart-8":{"n":"Burbujas","t":"55 × 40 cm","c":8900,"i":"https://www.gazetastudio.com/assets/print-popart-8.jpg","s":39,"e":100,"r":100,"f":1},"popart-9":{"n":"Casete","t":"150 × 75 cm","c":19900,"i":"https://www.gazetastudio.com/assets/print-popart-9.jpg","s":8,"e":100,"r":100,"f":1},"popart-10":{"n":"Sirena","t":"165 × 120 cm","c":19900,"i":"https://www.gazetastudio.com/assets/print-popart-10.jpg","s":30,"e":100,"r":100,"f":1},"dimension-1":{"n":"Estratos","t":"100 × 150 cm","c":17900,"i":"https://www.gazetastudio.com/assets/print-dimension-1.jpg","s":22,"e":100,"r":100,"f":1},"dimension-2":{"n":"Arcos flotantes","t":"140 × 100 cm","c":21900,"i":"https://www.gazetastudio.com/assets/print-dimension-2.jpg","s":44,"e":100,"r":100,"f":1},"dimension-3":{"n":"Ola tallada","t":"165 × 120 cm","c":19900,"i":"https://www.gazetastudio.com/assets/print-dimension-3.jpg","s":30,"e":100,"r":100,"f":1},"dimension-4":{"n":"Estratos II","t":"100 × 150 cm","c":17900,"i":"https://www.gazetastudio.com/assets/print-dimension-4.jpg","s":22,"e":100,"r":100,"f":1},"dimension-5":{"n":"Plegado","t":"50 × 40 cm","c":9900,"i":"https://www.gazetastudio.com/assets/print-dimension-5.jpg","s":32,"e":100,"r":100,"f":1},"dimension-6":{"n":"Duna interior","t":"140 × 100 cm","c":18900,"i":"https://www.gazetastudio.com/assets/print-dimension-6.jpg","s":44,"e":100,"r":100,"f":1},"dimension-7":{"n":"Fronda","t":"55 × 40 cm","c":8900,"i":"https://www.gazetastudio.com/assets/print-dimension-7.jpg","s":39,"e":100,"r":100,"f":1},"dimension-8":{"n":"Marea de papel","t":"150 × 75 cm","c":19900,"i":"https://www.gazetastudio.com/assets/print-dimension-8.jpg","s":8,"e":100,"r":100,"f":1},"dimension-9":{"n":"Umbral","t":"60 × 90 cm","c":14900,"i":"https://www.gazetastudio.com/assets/print-dimension-9.jpg","s":19,"e":100,"r":100,"f":1},"dimension-10":{"n":"Vertedera","t":"165 × 120 cm","c":19900,"i":"https://www.gazetastudio.com/assets/print-dimension-10.jpg","s":30,"e":100,"r":100,"f":1}};
const PRODUCTO_LIMITADA = {"vino-primero":"prod_VVv8zJYc3NUEIr","trazo-unico":"prod_VUMRGwjTiy5ffP","linea-y-vino":"prod_VUMRXQn31wHO1U","arena-calma":"prod_VUMR8RqqCZm1Pp","horizonte-vino":"prod_VUMRSpUJGD3fMY","geometria-callada":"prod_VUMRdH5PhvuJDa","textures-7":"prod_VVv4u2wKPL90nP","textures-8":"prod_VVv47ALRy0k7SD","textures-9":"prod_VVv4GYmLWHvGbR","textures-10":"prod_VVv4NYU0rjWJBe"};
const MAX_UNIDADES_OBRA = 10;
const MAX_UNIDADES_PEDIDO = 20;
const PAISES = ['AT','BE','BG','HR','CY','CZ','DK','EE','FI','FR','DE','GR','HU','IE','IT','LV','LT','LU','MT','NL','PL','PT','RO','SK','SI','ES','SE','NO'];

const stockDe = async (id) => {
  const U = process.env.SUPABASE_URL, K = process.env.SUPABASE_SERVICE_KEY;
  if (U && K) {
    try {
      const r = await fetch(`${U}/rest/v1/ediciones?obra_id=eq.${id}&select=restantes`, { headers: { apikey: K, Authorization: 'Bearer ' + K } }).then(x => x.json());
      if (Array.isArray(r) && r[0]) return parseInt(r[0].restantes, 10);
    } catch (e) {}
  }
  const pid = PRODUCTO_LIMITADA[id];
  if (!pid) return null;
  try {
    const r = await fetch('https://api.stripe.com/v1/products/' + pid, { headers: { Authorization: 'Bearer ' + process.env.STRIPE_SECRET_KEY } }).then(x => x.json());
    return parseInt(r.metadata?.restantes ?? CATALOGO[id].r ?? 0, 10);
  } catch (e) { return CATALOGO[id].r; }
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'https://www.gazetastudio.com');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'solo POST' });

  // admite {items:[{id,qty}]} y el formato antiguo {ids:[...]}
  const bruto = Array.isArray(req.body?.items) && req.body.items.length
    ? req.body.items
    : (Array.isArray(req.body?.ids) ? req.body.ids.map(x => ({ id: x, qty: 1 })) : []);
  const mezcla = {};
  for (const it of bruto) {
    const id = String(it?.id || '');
    const qty = Math.max(1, Math.min(99, parseInt(it?.qty, 10) || 1));
    if (CATALOGO[id]) mezcla[id] = (mezcla[id] || 0) + qty;
  }
  const items = Object.entries(mezcla).map(([id, qty]) => ({ id, qty }));
  if (items.length === 0) return res.status(400).json({ error: 'cesta vacía u obras desconocidas' });

  const unidades = items.reduce((s, i) => s + i.qty, 0);
  if (unidades > MAX_UNIDADES_PEDIDO) return res.status(400).json({ error: 'máximo ' + MAX_UNIDADES_PEDIDO + ' lienzos por pedido' });

  // validación de ediciones limitadas contra el stock REAL de Stripe
  for (const it of items) {
    const o = CATALOGO[it.id];
    const techo = o.f ? MAX_UNIDADES_OBRA : await stockDe(it.id);
    if (it.qty > techo) {
      return res.status(409).json({ error: techo === 0 ? '«' + o.n + '» está agotada' : '«' + o.n + '»: solo quedan ' + techo + ' de ' + o.e });
    }
  }

  const envioCents = items.reduce((s, i) => s + RATE[CATALOGO[i.id].s] * i.qty, 0);

  const p = new URLSearchParams();
  p.set('mode', 'payment');
  p.set('managed_payments[enabled]', 'false');
  p.set('locale', 'es');
  p.set('submit_type', 'pay');
  p.set('client_reference_id', 'carrito');
  p.set('success_url', 'https://www.gazetastudio.com/gracias/?pedido=multi&sesion={CHECKOUT_SESSION_ID}');
  p.set('cancel_url', 'https://www.gazetastudio.com/tienda/');
  p.set('expires_at', String(Math.floor(Date.now() / 1000) + 5400));
  p.set('phone_number_collection[enabled]', 'true');
  PAISES.forEach((c, i) => p.set(`shipping_address_collection[allowed_countries][${i}]`, c));
  p.set('shipping_options[0][shipping_rate_data][type]', 'fixed_amount');
  p.set('shipping_options[0][shipping_rate_data][fixed_amount][amount]', String(envioCents));
  p.set('shipping_options[0][shipping_rate_data][fixed_amount][currency]', 'eur');
  p.set('shipping_options[0][shipping_rate_data][display_name]', 'Envío gratis · asegurado');
  p.set('metadata[canal]', 'carrito');
  p.set('metadata[obras]', items.map(i => `${i.id}:${i.qty}`).join(','));
  p.set('metadata[envio_euros]', (envioCents / 100).toFixed(2));
  items.forEach((it, i) => {
    const o = CATALOGO[it.id];
    p.set(`line_items[${i}][quantity]`, String(it.qty));
    p.set(`line_items[${i}][price_data][currency]`, 'eur');
    p.set(`line_items[${i}][price_data][unit_amount]`, String(o.c));
    p.set(`line_items[${i}][price_data][product_data][name]`, `GAZETA STUDIO — ${o.n} (${o.t})`);
    p.set(`line_items[${i}][price_data][product_data][images][0]`, o.i);
  });

  const r = await fetch('https://api.stripe.com/v1/checkout/sessions', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + process.env.STRIPE_SECRET_KEY, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: p,
  }).then(x => x.json()).catch(e => ({ error: { message: e.message } }));
  if (r.error) return res.status(500).json({ error: r.error.message.slice(0, 160) });
  return res.status(200).json({ url: r.url, id: r.id, envio: envioCents / 100 });
}
