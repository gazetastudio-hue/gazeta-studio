// GAZETA STUDIO — Formulario de contacto (Vercel Function → Resend)
const emailValido = e => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e || '');
const limpia = (s, max) => String(s || '').replace(/[<>]/g, '').trim().slice(0, max);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'https://www.gazetastudio.com');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'solo POST' });

  const nombre = limpia(req.body?.nombre, 80);
  const correo = limpia(req.body?.email, 120);
  const mensaje = limpia(req.body?.mensaje, 3000);
  if (!nombre || !emailValido(correo) || mensaje.length < 5) {
    return res.status(400).json({ error: 'faltan datos o el correo no es válido' });
  }

  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + process.env.RESEND_API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: process.env.MAIL_FROM,
      to: [process.env.MAIL_TO],
      reply_to: correo,
      subject: `Contacto web: ${nombre}`,
      html: `<div style="font-family:Georgia,serif"><p><b>${nombre}</b> (${correo}) escribió:</p><p>${mensaje.replace(/\n/g, '<br>')}</p></div>`,
    }),
  });
  if (!r.ok) return res.status(500).json({ error: 'no se pudo enviar' });
  return res.status(200).json({ ok: true });
}
