// GAZETA STUDIO — Stock en vivo de las ediciones limitadas (TEXTURES)
// Consulta en paralelo con cache de 20s.
const LIMITADAS = {"vino-primero":{"product":"prod_VVv8zJYc3NUEIr","edicion":20},"trazo-unico":{"product":"prod_VUMRGwjTiy5ffP","edicion":20},"linea-y-vino":{"product":"prod_VUMRXQn31wHO1U","edicion":20},"arena-calma":{"product":"prod_VUMR8RqqCZm1Pp","edicion":20},"horizonte-vino":{"product":"prod_VUMRSpUJGD3fMY","edicion":20},"geometria-callada":{"product":"prod_VUMRdH5PhvuJDa","edicion":20},"textures-7":{"product":"prod_VVv4u2wKPL90nP","edicion":20},"textures-8":{"product":"prod_VVv47ALRy0k7SD","edicion":20},"textures-9":{"product":"prod_VVv4GYmLWHvGbR","edicion":20},"textures-10":{"product":"prod_VVv4NYU0rjWJBe","edicion":20}};
const RESTANTES_INI = { 'vino-primero':14, 'trazo-unico':16, 'linea-y-vino':18, 'arena-calma':12, 'horizonte-vino':9, 'geometria-callada':15 };
let cache = { t: 0, data: null };

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'https://www.gazetastudio.com');
  res.setHeader('Cache-Control', 'public, max-age=20');
  if (Date.now() - cache.t < 20000 && cache.data) return res.status(200).json(cache.data);
  const out = {};
  await Promise.all(Object.entries(LIMITADAS).map(async ([id, o]) => {
    try {
      const r = await fetch('https://api.stripe.com/v1/products/' + o.product, { headers: { Authorization: 'Bearer ' + process.env.STRIPE_SECRET_KEY } }).then(x => x.json());
      out[id] = parseInt(r.metadata?.restantes ?? RESTANTES_INI[id] ?? 0, 10);
    } catch (e) { out[id] = RESTANTES_INI[id] ?? 0; }
  }));
  const data = { restantes: out, ts: Date.now() };
  cache = { t: Date.now(), data };
  return res.status(200).json(data);
}
