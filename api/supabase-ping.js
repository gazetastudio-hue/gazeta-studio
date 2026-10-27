// GAZETA STUDIO — Ping diario (Vercel Cron) para que el proyecto de Supabase
// no se pause por inactividad. Activo en cuanto existan las dos variables
// SUPABASE_URL y SUPABASE_SERVICE_KEY en Vercel.
export default async function handler(req, res) {
  const U = process.env.SUPABASE_URL, K = process.env.SUPABASE_SERVICE_KEY;
  if (!U || !K) return res.status(200).json({ ok: false, motivo: 'faltan SUPABASE_URL / SUPABASE_SERVICE_KEY en Vercel' });
  try {
    const r = await fetch(`${U}/rest/v1/ediciones?select=obra_id&limit=1`, { headers: { apikey: K, Authorization: `Bearer ${K}` } }).then(x => x.json());
    return res.status(200).json({ ok: true, ping: 'supabase', tabla: Array.isArray(r) ? 'ediciones' : r });
  } catch (e) {
    return res.status(200).json({ ok: false, error: e.message });
  }
}
