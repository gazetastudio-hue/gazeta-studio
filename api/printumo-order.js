// Flujo PRODUCCIÓN (Printumo) — NO llamar desde el navegador. Llamar solo tras webhook Stripe `checkout.session.completed` verificado.
// 1) Verifica la firma Stripe (STRIPE_WEBHOOK_SECRET). 2) Marca pedido pagado en Supabase (orders.status='paid').
// 3) Reserva nº de edición de forma atómica (función SQL reserve_edition). 4) Crea el pedido en Printumo con file_id + dirección.
// 5) Guarda printumo_order_id y pasa a 'in_production'. Todo idempotente por stripe_session_id: si el webhook se repite, no dupliques pedido ni número.
// Este esqueleto devuelve 501 hasta que pegues aquí el endpoint y credenciales oficiales de la API de Printumo (PRINTUMO_API_KEY).
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  if (!process.env.PRINTUMO_API_KEY) return res.status(501).json({ error: "Printumo no configurado: añade PRINTUMO_API_KEY y completa este handler con la documentación oficial de su API." });
  return res.status(501).json({ error: "Pendiente de mapear campos con la API oficial de Printumo (ver README, paso 6)." });
}
