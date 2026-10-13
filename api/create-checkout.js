// Vercel Function — Stripe Checkout. Variables en Vercel: STRIPE_SECRET_KEY, SITE_URL
// El precio NUNCA se acepta del navegador: se recalcula aquí desde el catálogo servidor.
const CATALOG = {
  "origen-01": { name: "GAZETA — Materia primera (150×100)", price: 129000 },
  "origen-02": { name: "GAZETA — Vino detenido (120×80)", price: 89000 },
  "origen-03": { name: "GAZETA — Umbral blanco (90×60)", price: 49000 }
};
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return res.status(501).json({ error: "Stripe no configurado: añade STRIPE_SECRET_KEY en Vercel." });
  try {
    const { default: Stripe } = await import("stripe");
    const stripe = new Stripe(key);
    const items = (req.body?.items || []).filter(i => CATALOG[i.id]);
    if (!items.length) return res.status(400).json({ error: "Carrito vacío o no válido" });
    const origin = process.env.SITE_URL || `https://${req.headers.host}`;
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: items.map(i => ({ quantity: Math.max(1, Math.min(3, i.qty || 1)),
        price_data: { currency: "eur", unit_amount: CATALOG[i.id].price, product_data: { name: CATALOG[i.id].name } } })),
      shipping_address_collection: { allowed_countries: ["ES","PT","FR","DE","IT","NL","BE","AT","IE"] },
      success_url: `${origin}/colecciones.html?pedido=confirmado`,
      cancel_url: `${origin}/colecciones.html?pedido=cancelado`,
      metadata: { source: "gazeta-web", items: JSON.stringify(items) }
    });
    return res.status(200).json({ url: session.url });
  } catch (e) { return res.status(500).json({ error: e.message }); }
}
