#!/usr/bin/env node
/* Crea el pedido de producción en Printumo tras recibir un pago.
   USO:
     export PRINTUMO_API_KEY='tu clave'
     node crear-pedido-printumo.mjs pedido.json
   Formato de pedido.json:
   {
     "obra": "vino-primero",
     "cliente": { "email":"...", "first_name":"...", "last_name":"...",
                  "address1":"...", "city":"...", "postcode":"...", "country_code":"ES" }
   }
   (La dirección está en Stripe → Pagos → el pago del cliente → Dirección de envío.)
*/
import { readFileSync } from 'node:fs';
const clave = process.env.PRINTUMO_API_KEY;
if(!clave){ console.error('Falta PRINTUMO_API_KEY'); process.exit(1); }
const { obra, cliente } = JSON.parse(readFileSync(process.argv[2],'utf8'));
const datos = JSON.parse(readFileSync(new URL('./datos-obras.json', import.meta.url),'utf8'));
const d = datos[obra];
if(!d){ console.error('Obra desconocida:', obra); process.exit(1); }
const cuerpo = {
  line_items: [{ image_url: d.image_url, print_type_id: d.print_type_id, size_id: d.size_id,
                 framing_id: d.framing_id, market_id: d.market_id, quantity: 1,
                 canvas_wrapping: { wrap_type: 'mirrored' } }],
  shipping_address: cliente
};
const r = await fetch('https://printumo.com/api/v1/api_image_orders', {
  method:'POST',
  headers:{ 'Authorization':'Bearer '+clave, 'Content-Type':'application/json' },
  body: JSON.stringify(cuerpo)
});
const j = await r.json().catch(()=>({}));
console.log(r.status, JSON.stringify(j, null, 1));
if(r.status===202) console.log('\n✔ Pedido aceptado. Consulta el estado con: node ver-pedidos.mjs');
