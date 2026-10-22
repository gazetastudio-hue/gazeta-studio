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
