// GAZETA STUDIO — Formulario de contacto (Vercel Function + Resend)
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  if(req.method === 'OPTIONS') return res.status(204).end();
  if(req.method !== 'POST') return res.status(405).json({ ok:false, error:'método' });

  const { nombre, email:de, mensaje, obra } = req.body || {};
  if(!nombre || !de || !mensaje || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(de) || mensaje.length > 5000)
    return res.status(400).json({ ok:false, error:'datos inválidos' });

  const r = await fetch('https://api.resend.com/emails', { method:'POST',
    headers:{ 'Authorization':`Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type':'application/json' },
    body: JSON.stringify({
      from: process.env.MAIL_FROM,
      to: [process.env.MAIL_TO],
      reply_to: de,
      subject: `Web — mensaje de ${nombre}${obra ? ` (${obra})` : ''}`,
      html: `<div style="font-family:Georgia,serif;max-width:560px">
        <p style="letter-spacing:.3em">GAZETA STUDIO</p>
        <p><b>${nombre}</b> &lt;${de}&gt;${obra ? ` · pregunta por: ${obra}` : ''}</p>
        <p style="white-space:pre-line">${String(mensaje).replace(/</g,'&lt;')}</p></div>`
    }) });

  if(!r.ok){
    const detalle = await r.text();
    console.error('resend contacto:', r.status, detalle.slice(0,300));
    return res.status(502).json({ ok:false, error:'email_no_enviado',
      pista: 'Si el error es de dominio, verifica gazetastudio.com en Resend (registros DNS).' });
  }
  return res.status(200).json({ ok:true });
}
