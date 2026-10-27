// GAZETA STUDIO — Stock en vivo de las ediciones limitadas (TEXTURES)
// Fuente de verdad: Supabase (tabla `ediciones`) si hay SUPABASE_URL + SUPABASE_SERVICE_KEY;
// si no, metadatos `restantes` de los productos en Stripe. Cache 20s.
const LIMITADAS = {"vino-primero":{"product":"prod_VVv8zJYc3NUEIr","edicion":20},"trazo-unico":{"product":"prod_VUMRGwjTiy5ffP","edicion":20},"linea-y-vino":{"product":"prod_VUMRXQn31wHO1U","edicion":20},"arena-calma":{"product":"prod_VUMR8RqqCZm1Pp","edicion":20},"horizonte-vino":{"product":"prod_VUMRSpUJGD3fMY","edicion":20},"geometria-callada":{"product":"prod_VUMRdH5PhvuJDa","edicion":20},"textures-7":{"product":"prod_VVv4u2wKPL90nP","edicion":20},"textures-8":{"product":"prod_VVv47ALRy0k7SD","edicion":20},"textures-9":{"product":"prod_VVv4GYmLWHvGbR","edicion":20},"textures-10":{"product":"prod_VVv4NYU0rjWJBe","edicion":20}};
const RESTANTES_INI = {"vino-primero":20,"trazo-unico":20,"linea-y-vino":20,"arena-calma":20,"horizonte-vino":20,"geometria-callada":20,"textures-7":20,"textures-8":20,"textures-9":20,"textures-10":20};
let cache = { t: 0, data: null };

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'https://www.gazetastudio.com');
  res.setHeader('Cache-Control', 'public, max-age=20');
  if (Date.now() - cache.t < 20000 && cache.data) return res.status(200).json(cache.data);
  const out = {};
  const U = process.env.SUPABASE_URL, K = process.env.SUPABASE_SERVICE_KEY;
  if (U && K) {
    try {
      const ids = Object.keys(LIMITADAS).map(i => `"${i}"`).join(',');
      const rows = await fetch(`${U}/rest/v1/ediciones?obra_id=in.(${ids})&select=obra_id,restantes`, { headers: { apikey: K, Authorization: `Bearer ${K}` } }).then(x => x.json());
      if (Array.isArray(rows)) for (const r of rows) out[r.obra_id] = parseInt(r.restantes, 10);
    } catch (e) {}
  }
  await Promise.all(Object.entries(LIMITADAS).map(async ([id, o]) => {
    if (out[id] !== undefined) return;
    try {
      const r = await fetch('https://api.stripe.com/v1/products/' + o.product, { headers: { Authorization: 'Bearer ' + process.env.STRIPE_SECRET_KEY } }).then(x => x.json());
      out[id] = parseInt(r.metadata?.restantes ?? RESTANTES_INI[id] ?? 0, 10);
    } catch (e) { out[id] = RESTANTES_INI[id] ?? 0; }
  }));
  const data = { restantes: out, fuente: (U && K) ? 'supabase' : 'stripe', ts: Date.now() };
  cache = { t: Date.now(), data };
  return res.status(200).json(data);
}
