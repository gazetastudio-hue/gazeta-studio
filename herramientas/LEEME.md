# Cómo se fabrica y envía una obra vendida (Printumo)

1. El cliente paga en Stripe (enlace de pago de su obra). Stripe guarda su **dirección de envío**.
2. Entra en Stripe → Pagos → abre el pago del cliente y copia la dirección.
3. Crea `pedido.json`:
   { "obra": "vino-primero",
     "cliente": { "email":"cliente@mail.com", "first_name":"Ana", "last_name":"García",
                  "address1":"C/ Mayor 1, 3ºB", "city":"Madrid", "postcode":"28013", "country_code":"ES" } }
4. `export PRINTUMO_API_KEY='tu-clave'` y `node herramientas/crear-pedido-printumo.mjs pedido.json`
5. Printumo descarga la imagen de la obra desde esta web, produce el lienzo (barras espejadas, sin marco) y lo envía.
6. Apunta el número de edición entregado y **resta 1 a `restantes` de esa obra en `script.js`** (y sube el cambio).

Identificadores de obra → tamaño Printumo (mercado 1 = Europa/UK, lienzo 2, sin marco 2):
- Corriente → 100×150 · Perfil en reposo → 60×90 · Mediodía → 120×165 · Última luz → 150×100 · Pulso → 100×140 · Equilibrio → 40×55

NOTA: la clave de Printumo **nunca** se publica en la web; úsala solo aquí, en tu ordenador.
