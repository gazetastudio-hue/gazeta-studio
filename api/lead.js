// Vercel Function — guarda leads en Supabase (tabla `leads`). Vars: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env;
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY)
    return res.status(501).json({ error: "Supabase no configurado: añade SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY en Vercel." });
  const { type = "newsletter", email, name = null, phone = null, project_type = null, message = null, page = null } = req.body || {};
  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return res.status(400).json({ error: "Email no válido" });
  const r = await fetch(`${SUPABASE_URL}/rest/v1/leads`, { method: "POST",
    headers: { apikey: SUPABASE_SERVICE_ROLE_KEY, Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`, "Content-Type": "application/json", Prefer: "return=minimal" },
    body: JSON.stringify({ type, email, name, phone, project_type, message, page }) });
  if (!r.ok) return res.status(502).json({ error: "No se pudo guardar el contacto" });
  return res.status(200).json({ ok: true });
}
