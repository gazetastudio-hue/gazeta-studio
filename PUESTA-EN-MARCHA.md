## PUBLICACIÓN DEL REDISEÑO (2026-10-23) — PUBLICADA ✓ (commit 8d7ddaf)

Todo el rediseño e-commerce está en esta carpeta, auditado con Playwright (0 fallos). Para publicar:

1. ✓ Push `8d7ddaf` (home, tienda, 7 colecciones, empresas, nosotros, contacto, gracias, legales, 22 obras). Auditoría Playwright LIVE limpia.
2. ✓ Vercel `gazeta-tienda` desplegado con webhook v2 (22 obras). Los envs no cambian.
3. ✓ Ruta temporal `api/admin-batch.js` usada SOLO para el alta de 6 obras (clave nunca salió de Vercel) y ya eliminada de workspace y producción.
4. PENDIENTE: verificación con pedido real de control (Nieve de abril, 89 €) para confirmar webhook→Printumo→email de punta a punta.
5. Tokens usados este turno: GitHub PAT (ghp_…yrhcI, sin scope admin) y Vercel (vcp_7TT…). Rotarlos cuando toque; el PAT vive solo en /tmp durante la sesión.

CATÁLOGO: 70 OBRAS — 10 por colección (Eclectic, Nordic, Bauhaus, Ethereum, Pop Art, Abstract Dimension y Textures). Las 38 últimas integradas desde el repo lienzos (commit 110db2a); alta en herramientas/alta-lote-final.json. TEXTURES = 10 de máx. 12 (ediciones de 20, restantes 20 las nuevas). Alta de las 10 últimas vía ruta temporal en Vercel (ya eliminada; archivos de resultados en herramientas/alta-*.json).

ENVÍOS STRIPE (2026-10-24): detectados todos los links SIN tarifa de envío (0 €). Creadas 3 Shipping Rates y aplicadas a los 32 links según tamaño: pequeño (sizes 32/39, 50×40 y 55×40) 8 € · mediano (size 19 = 90×60 apaisado) 39,99 € · grande (sizes 8/22/30/44) 49,99 €. Verificado 32/32.

SIZE IDS PRINTUMO VERIFICADOS vía /api/v1/shipping_profiles (copia en herramientas/printumo-profiles.json): size 19 = 90×60 cm — los bastidores Printumo son orientación-agnóstica: se giran según la obra (igual que 22=150×100 que vendemos como 100×150 vertical). Etiqueta cliente: 60×90 cm. · 22=150×100 · 44=140×100 · 30=165×120 · 8=150×75 (perfil Large 3) · 32=50×40 · 39=55×40 (perfil Small 1). Los pedidos inferirán perfil Small/Medium/Large según size_id.

# GAZETA STUDIO — Puesta en marcha del ecommerce

## Qué está montado

| Pieza | Estado |
|---|---|
| Tienda con pago real (Stripe live, 6 enlaces) | ✅ en la web |
| Webhook Stripe → pedido Printumo automático | ✅ desplegado en Vercel (`gazeta-tienda`) |
| Stock y número de edición (metadata Stripe) | ✅ automático |
| Emails con Resend | ⚠️ requiere **verificar el dominio** (paso 1) |
| Formulario de contacto real | ⚠️ depende de lo mismo |
| Condiciones de venta, aviso legal, privacidad, cookies | ✅ en la web |

## Paso 1 — Verificar el dominio en Resend (10 min)

El dominio `gazetastudio.com` YA ESTÁ CREADO en Resend (id `17ddbae2-368e-4d2d-b018-cc263d10b5b8`).
Entra en https://resend.com/domains/gazetastudio.com y añade estos 4 registros en el panel DNS de tu registrador:

| Tipo | Nombre | Valor | Prioridad |
|---|---|---|---|
| TXT | `resend._domainkey` | `p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCvw5suC30WGdQrza7nGS49HKi5qQqoJtD4jJWuWwKyQDAY/zwZMLgB4i8Pxpmv1l4yP+AlEaeMtUlE9tD+B9gJJ9zGfu+zWMNKkawX+mVMa+/BfkCC5TEIu4nNQWtfXS2qHAZkYpm+gEuAXFBtn8nIxvH2hmOO7NjcIR4+WXit0QIDAQAB` | — |
| MX | `send` | `feedback-smtp.eu-west-1.amazonses.com` | 10 |
| TXT | `send` | `v=spf1 include:amazonses.com ~all` | — |
| CNAME | `rsend` | `send.forge.rmta.net` | — |

Después pulsa **Verify** en Resend (tarda de minutos a unas horas). Mientras no esté verificado, los emails no salen,
pero el cobro y el pedido en Printumo funcionan igual.

## Paso 2 — Cómo funciona una venta (automático)

1. El cliente paga en Stripe (enlace de pago de la obra).
2. Stripe avisa al webhook → la función hace, en orden:
   - Resta 1 a `restantes` (metadata del producto) y calcula el número de edición.
   - Si quedaban 0 → desactiva el enlace de pago (la obra se agota de verdad).
   - Crea el pedido en Printumo con la imagen de la obra y la dirección del cliente.
   - Envía email al cliente (nº de edición, envío) y a ti (venta + dirección).
3. Stripe → Desarrolladores → Webhooks: ahí verás cada intento y su respuesta.

## Probarlo sin vender

- **Formulario**: rellénalo en la web (fallará hasta verificar el dominio).
- **Webhook**: Stripe → Webhooks → `we_1UTQZ085u7jC8FxLuPfnDVmh` → *Send test event*.
- **Printumo**: `GET https://printumo.com/api/v1/orders` con tu clave tras una venta real.
- Única prueba 100 % real: compra tú «Equilibrio» (145 €) con tu tarjeta → se fabrica y te llega a casa. Luego, si quieres, archívalo en Stripe.

## Logs y cambios

- Logs de Vercel: https://vercel.com/gazetastudio-3049/gazeta-tienda (pestaña Logs → en tiempo real).
- El código de las funciones está en `api/` de este repo. Para cambiar algo: edita y vuelve a desplegar.
- Stock mostrado en la web (`script.js` → campo `restantes`): ajústalo a mano cuando haya ventas (la verdad para evitar sobreventa está en Stripe).

## SEGURIDAD — pendiente importante

Estas claves pasaron por el chat y **deben rotarse** cuando el flujo esté verificado:
1. GitHub token (ya revocable) → crea uno nuevo si lo necesitas.
2. Printumo → API Keys → regenerar → actualizar en Vercel (gazeta-tienda → Settings → Environment Variables).
3. Stripe → Developers → API keys → **Roll secret** → actualizar en Vercel.
4. Resend → API Keys → crear nueva → actualizar en Vercel.
5. Vercel token → Account Settings → Tokens → eliminar este y crear otro si lo necesitas.
Nunca pegues claves en chats ni las subas al repo: solo en Vercel → Environment Variables.
