# GAZETA STUDIO — Web + despliegue (sin pegar tokens en ningún chat)

Web estática (HTML/CSS/JS) + funciones serverless en `/api` para Vercel. Sin build: Vercel sirve los HTML e instala `stripe` para las funciones.

## 1. Revocar tokens expuestos
Si alguna vez pegaste un token en un chat/correo, revócalo (GitHub: Settings → Developer settings → Personal access tokens · Vercel: Settings → Tokens) y crea otros nuevos. Desplegar NO requiere pegar tokens en chats.
## 2. GitHub (desde tu ordenador)
```
cd gazeta-studio
git init && git add . && git commit -m "GAZETA STUDIO v1"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/gazeta-studio.git
git push -u origin main
```
Crea antes el repo vacío `gazeta-studio` en github.com (sin README). Al hacer push, GitHub te pedirá login en el navegador (no pegues el token en archivos).
## 3. Vercel
vercel.com → Add New → Project → importa `gazeta-studio` → Framework: **Other** → Deploy. Cada push a `main` redespliega solo.
## 4. Variables de entorno (Vercel → Settings → Environment Variables)
`STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `PRINTUMO_API_KEY`, `SITE_URL`. Nunca en el repo (ver `.env.example`). Sin ellas, la web funciona en modo demo (carrito y formularios avisan, no cobran ni guardan).
## 5. Supabase
supabase.com → proyecto nuevo → SQL Editor → pega `supabase/schema.sql` → Run. Las claves están en Settings → API.
## 6. Stripe + Printumo
Stripe: crea los productos o usa el checkout incluido (`/api/create-checkout.js`, precio en servidor en `CATALOG` — actualízalo al cambiar precios). Webhook `checkout.session.completed` → conecta ahí la reserva de edición y `/api/printumo-order.js` (completa los campos con la documentación oficial de la API de Printumo). Haz siempre primero un pedido en modo test y una prueba física impresa.
## 7. Dominio y legal
Sustituye `TU-DOMINIO.es` en HTML, `sitemap.xml` y `robots.txt`. Completa los [CORCHETES] de `/legal` con tu razón social/NIF/domicilio y revísalos con un profesional antes de vender.
## 8. Añadir una obra nueva
Edita `assets/data.js` (título, imagen en `assets/obras/`, formato único, edición, precio) y el mismo precio en `api/create-checkout.js`. Nada más.
