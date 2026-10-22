#!/usr/bin/env node
/* Muestra los pedidos de Printumo.  USO:
     export PRINTUMO_API_KEY='tu clave'
     node ver-pedidos.mjs
*/
const clave = process.env.PRINTUMO_API_KEY;
if(!clave){ console.error('Falta PRINTUMO_API_KEY'); process.exit(1); }
for (const ep of ['orders','api_image_orders']) {
  const r = await fetch('https://printumo.com/api/v1/'+ep, { headers:{ 'Authorization':'Bearer '+clave } });
  const j = await r.json().catch(()=>({}));
  console.log('== '+ep+' ==\n'+JSON.stringify(j, null, 1).slice(0, 3000)+'\n');
}
