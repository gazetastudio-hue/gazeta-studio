/* GAZETA STUDIO — datos y tienda */
const productos = [
  { id:'vino-primero', nombre:'Vino Primero', coleccion:'Colección II — Origen', img:'assets/obra-vino.jpg', tamano:'150 × 200 cm', tipo:'gran', tipoLabel:'Gran formato', edicion:30, restantes:11, precio:890, horizontal:false },
  { id:'trazo-unico', nombre:'Trazo Único', coleccion:'Colección II — Origen', img:'assets/obra-trazo.jpg', tamano:'100 × 140 cm', tipo:'normal', tipoLabel:'Tamaño normal', edicion:50, restantes:23, precio:420, horizontal:false },
  { id:'linea-y-vino', nombre:'Línea y Vino', coleccion:'Colección II — Origen', img:'assets/obra-linea.jpg', tamano:'70 × 100 cm', tipo:'normal', tipoLabel:'Tamaño normal', edicion:75, restantes:41, precio:240, horizontal:false },
  { id:'arena-calma', nombre:'Arena Calma', coleccion:'Colección II — Origen', img:'assets/obra-arena.jpg', tamano:'120 × 160 cm', tipo:'gran', tipoLabel:'Gran formato', edicion:40, restantes:6, precio:560, horizontal:false },
  { id:'horizonte-vino', nombre:'Horizonte Vino', coleccion:'Colección II — Origen', img:'assets/obra-horizonte.jpg', tamano:'200 × 120 cm', tipo:'gran', tipoLabel:'Gran formato panorámico', edicion:20, restantes:4, precio:1150, horizontal:true },
  { id:'geometria-callada', nombre:'Geometría Callada', coleccion:'Colección II — Origen', img:'assets/obra-geometria.jpg', tamano:'50 × 70 cm', tipo:'normal', tipoLabel:'Tamaño normal', edicion:100, restantes:58, precio:145, horizontal:false },
  { id:'umbral-i', nombre:'Umbral I', coleccion:'Colección I — Umbral (cerrada)', img:'assets/obra-trazo.jpg', tamano:'130 × 180 cm', tipo:'gran', tipoLabel:'Gran formato', edicion:25, restantes:0, precio:740, cerrada:true, horizontal:false },
  { id:'primera-vendimia', nombre:'Primera Vendimia', coleccion:'Colección I — Umbral (cerrada)', img:'assets/obra-vino.jpg', tamano:'90 × 120 cm', tipo:'normal', tipoLabel:'Tamaño normal', edicion:40, restantes:0, precio:380, cerrada:true, horizontal:false },
];

function euros(n){ return n.toLocaleString('es-ES') + ' €'; }

function cardHTML(p){
  const vendidos = p.edicion - p.restantes;
  const pct = Math.round((vendidos / p.edicion) * 100);
  if(p.cerrada){
    return `<article class="card cerrada reveal" data-id="${p.id}">
      <div class="card-media ${p.horizontal?'horizontal':''}"><span class="badge cerrada">Colección cerrada</span><img src="${p.img}" alt="Obra ${p.nombre} de Gazeta Studio, colección cerrada" loading="lazy"></div>
      <div class="card-info">
        <div class="card-top"><h3>${p.nombre}</h3><span class="edicion" style="color:#8a8782">Agotada</span></div>
        <div class="meta-obra"><span>Tamaño único: <b>${p.tamano}</b></span><span>Edición de ${p.edicion}</span></div>
        <div class="unico" style="background:var(--gris);border-color:#8a8782">Esta colección se cerró y <b>no volverá a venderse</b>. Sin reediciones.</div>
        <div class="card-foot"><span class="precio" style="color:#8a8782">${euros(p.precio)}<small>Precio de archivo</small></span><button class="add" disabled>No disponible</button></div>
      </div></article>`;
  }
  const ultimas = p.restantes <= 8;
  return `<article class="card reveal" data-id="${p.id}">
    <div class="card-media ${p.horizontal?'horizontal':''}">
      ${ultimas ? '<span class="badge vino">Últimas unidades</span>' : '<span class="badge">Edición limitada</span>'}
      <img src="${p.img}" alt="Lienzo ${p.nombre} de Gazeta Studio, tamaño ${p.tamano}" loading="lazy">
    </div>
    <div class="card-info">
      <div class="card-top"><h3>${p.nombre}</h3><span class="edicion">Ed. ${p.edicion}</span></div>
      <div class="meta-obra"><span>Tamaño único: <b>${p.tamano}</b></span><span>${p.tipoLabel}</span></div>
      <div class="unico">Tamaño cerrado por el autor — <b>no disponible en otros tamaños.</b></div>
      <div class="barra-edicion" aria-hidden="true"><i style="width:${pct}%"></i></div>
      <span class="quedan">Quedan ${p.restantes} de ${p.edicion} · Numerada + certificado</span>
      <div class="card-foot"><span class="precio">${euros(p.precio)}<small>Impuestos incluidos</small></span><button class="add" data-add="${p.id}">Añadir a la cesta</button></div>
    </div></article>`;
}

/* --- Carrito (localStorage) --- */
let cart = [];
try{ cart = JSON.parse(localStorage.getItem('gazeta_cart') || '[]'); }catch(e){ cart = []; }

function saveCart(){ localStorage.setItem('gazeta_cart', JSON.stringify(cart)); renderCart(); }
function renderCart(){
  const body = document.getElementById('cartBody');
  const count = document.getElementById('cartCount');
  const totalEl = document.getElementById('cartTotal');
  if(!body) return;
  count.textContent = cart.length;
  if(cart.length === 0){
    body.innerHTML = '<p class="muted" style="text-align:center;padding:2rem 0">Tu cesta está vacía.<br><br>Recuerda: cuando una obra se agota,<br>no vuelve.</p>';
    totalEl.textContent = '0 €'; return;
  }
  let total = 0;
  body.innerHTML = cart.map((id, i)=>{
    const p = productos.find(x=>x.id===id); total += p.precio;
    return `<div class="cart-item"><img src="${p.img}" alt="${p.nombre}"><div><b>${p.nombre}</b><small>Tamaño único: ${p.tamano}</small><small>Edición de ${p.edicion} · Numerada + certificado</small><button class="remove" data-remove="${i}">Quitar</button></div><b>${euros(p.precio)}</b></div>`;
  }).join('');
  totalEl.textContent = euros(total);
  body.querySelectorAll('[data-remove]').forEach(b=>b.addEventListener('click',()=>{ cart.splice(Number(b.dataset.remove),1); saveCart(); }));
}

function showToast(msg){
  const t = document.getElementById('toast'); if(!t) return;
  t.textContent = msg; t.classList.add('show');
  clearTimeout(t._h); t._h = setTimeout(()=>t.classList.remove('show'), 3400);
}

function openCart(){ document.getElementById('cartDrawer')?.classList.add('open'); document.getElementById('overlay')?.classList.add('show'); }
function closeCart(){ document.getElementById('cartDrawer')?.classList.remove('open'); document.getElementById('overlay')?.classList.remove('show'); document.getElementById('mainNav')?.classList.remove('open'); }

function initShop(){
  renderCart();
  document.getElementById('cartBtn')?.addEventListener('click', openCart);
  document.getElementById('closeCart')?.addEventListener('click', closeCart);
  document.getElementById('overlay')?.addEventListener('click', closeCart);
  document.getElementById('menuBtn')?.addEventListener('click', ()=>{ document.getElementById('mainNav').classList.add('open'); document.getElementById('overlay').classList.add('show'); });
  document.getElementById('checkoutBtn')?.addEventListener('click', ()=>{
    if(cart.length===0){ showToast('Tu cesta está vacía. Elige tu obra antes de que se agote su edición.'); return; }
    showToast('Pedido simulado registrado ✔ Cada obra se numerará a tu nombre y viajará con su certificado firmado por Juan Casper.');
    cart = []; saveCart(); closeCart();
  });
  document.querySelectorAll('[data-add]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const p = productos.find(x=>x.id===btn.dataset.add);
      if(cart.includes(p.id)){ showToast('Esa obra ya está en tu cesta. Cada ejemplar numerado es único: solo necesitas uno.'); openCart(); return; }
      cart.push(p.id); saveCart();
      showToast(p.nombre + ' (' + p.tamano + ') añadida. Tu número se asignará al confirmar la compra.');
      openCart();
    });
  });
  document.querySelectorAll('[data-newsletter]').forEach(f=>f.addEventListener('submit', e=>{
    e.preventDefault();
    showToast('Bienvenido/a a Gazeta Studio. Serás de los primeros en saber cuándo abre la próxima colección.');
    f.reset();
  }));
  // Marquee
  const track = document.getElementById('marqueeTrack');
  if(track){
    const items = 'Edición limitada <i>●</i> Numerada a mano <i>●</i> Certificado firmado <i>●</i> Tamaño único por obra <i>●</i> Gran formato <i>●</i> Sin reediciones <i>●</i> ';
    track.innerHTML = '<span>' + items.repeat(3) + '</span><span>' + items.repeat(3) + '</span>';
  }
  // Reveal on scroll
  const io = new IntersectionObserver(entries=>entries.forEach(en=>{ if(en.isIntersecting){ en.target.classList.add('visible'); io.unobserve(en.target); } }), {threshold:.08});
  document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
}
