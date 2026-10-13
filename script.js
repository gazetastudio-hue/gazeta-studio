/* GAZETA STUDIO — datos y tienda */
const productos = [
  { id:'vino-primero', nombre:'Corriente', coleccion:'Serie II — Origen', img:'assets/obra-vino.jpg', tamano:'150 × 200 cm', tipo:'gran', tipoLabel:'Gran formato', edicion:30, restantes:11, precio:890, horizontal:false, anio:2026, tecnica:'Acrílico y pigmento sobre lienzo', nota:'Composición vertical en gran formato, con capas de pigmento y un trazo final en negro.' },
  { id:'trazo-unico', nombre:'Pulso', coleccion:'Serie II — Origen', img:'assets/obra-trazo.jpg', tamano:'100 × 140 cm', tipo:'normal', tipoLabel:'Tamaño normal', edicion:50, restantes:23, precio:420, horizontal:false, anio:2026, tecnica:'Tinta y acrílico sobre lienzo', nota:'Un único trazo central sobre fondo claro, sin elementos secundarios.' },
  { id:'linea-y-vino', nombre:'Perfil en reposo', coleccion:'Serie II — Origen', img:'assets/obra-linea.jpg', tamano:'70 × 100 cm', tipo:'normal', tipoLabel:'Tamaño normal', edicion:75, restantes:41, precio:240, horizontal:false, anio:2025, tecnica:'Grafito y acrílico sobre lienzo', nota:'Dibujo de línea continua con una única intervención de color.' },
  { id:'arena-calma', nombre:'Mediodía', coleccion:'Serie II — Origen', img:'assets/obra-arena.jpg', tamano:'120 × 160 cm', tipo:'gran', tipoLabel:'Gran formato', edicion:40, restantes:6, precio:560, horizontal:false, anio:2026, tecnica:'Acrílico sobre lienzo', nota:'Campo claro y forma central en arco; se aprecia la textura del lienzo.' },
  { id:'horizonte-vino', nombre:'Última luz', coleccion:'Serie II — Origen', img:'assets/obra-horizonte.jpg', tamano:'200 × 120 cm', tipo:'gran', tipoLabel:'Gran formato', edicion:20, restantes:4, precio:1150, horizontal:true, anio:2026, tecnica:'Acrílico y pigmento sobre lienzo', nota:'Tres franjas horizontales en formato panorámico.' },
  { id:'geometria-callada', nombre:'Equilibrio', coleccion:'Serie II — Origen', img:'assets/obra-geometria.jpg', tamano:'50 × 70 cm', tipo:'normal', tipoLabel:'Tamaño normal', edicion:100, restantes:58, precio:145, horizontal:false, anio:2025, tecnica:'Acrílico sobre lienzo', nota:'Dos formas geométricas sobre fondo blanco. Es el formato menor de la serie.' },
  { id:'umbral-i', nombre:'Umbral I', coleccion:'Serie I — Umbral (cerrada)', img:'assets/archivo-umbral-1.jpg', tamano:'130 × 180 cm', tipo:'gran', tipoLabel:'Gran formato', edicion:25, restantes:0, precio:740, cerrada:true, horizontal:false, anio:2025, tecnica:'Tinta y acrílico sobre lienzo', nota:'Serie I. Edición agotada.' },
  { id:'primera-vendimia', nombre:'Primera sala', coleccion:'Serie I — Umbral (cerrada)', img:'assets/archivo-primera-sala.jpg', tamano:'90 × 120 cm', tipo:'normal', tipoLabel:'Tamaño normal', edicion:40, restantes:0, precio:380, cerrada:true, horizontal:false, anio:2025, tecnica:'Acrílico y pigmento sobre lienzo', nota:'Serie I. Edición agotada.' },
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
        <p class="ficha">Juan Casper · ${p.anio} · ${p.tecnica}</p>
        <div class="meta-obra"><span>Solo se hizo en <b>${p.tamano}</b></span><span>Serie de ${p.edicion}</span></div>
        <div class="unico" style="background:var(--gris);border-color:#8a8782">Edición agotada. <b>No disponible para la venta.</b></div>
        <div class="card-foot"><span class="precio" style="color:#8a8782">${euros(p.precio)}<small>El precio que tuvo</small></span><button class="add" disabled>Ya no se vende</button></div>
      </div></article>`;
  }
  const ultimas = p.restantes <= 8;
  return `<article class="card reveal" data-id="${p.id}">
    <div class="card-media ${p.horizontal?'horizontal':''}">
      ${ultimas ? '<span class="badge vino">Quedan pocas</span>' : '<span class="badge">Serie limitada</span>'}
      <img src="${p.img}" alt="Cuadro «${p.nombre}», de Juan Casper. Se hace solo en ${p.tamano}" loading="lazy">
    </div>
    <div class="card-info">
      <div class="card-top"><h3>${p.nombre}</h3><span class="edicion">Serie de ${p.edicion}</span></div>
      <p class="ficha">Juan Casper · ${p.anio} · ${p.tecnica}</p>
      <p class="nota">${p.nota}</p>
      <div class="meta-obra"><span><b>${p.tamano}</b></span><span>${p.tipoLabel}</span><span>Firmada y numerada</span></div>
      <div class="unico">Medida única. No se produce en otros tamaños.</div>
      <div class="barra-edicion" aria-hidden="true"><i style="width:${pct}%"></i></div>
      <span class="quedan">Quedan ${p.restantes} de ${p.edicion}, con su número y su certificado</span>
      <div class="card-foot"><span class="precio">${euros(p.precio)}<small>IVA incluido</small></span><button class="add" data-add="${p.id}">Añadir a la cesta</button></div>
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
    body.innerHTML = '<p class="muted" style="text-align:center;padding:2rem 0">La cesta está vacía.<br><br>Si tienes dudas sobre una medida,<br>contacta con el estudio antes de comprar.</p>';
    totalEl.textContent = '0 €'; return;
  }
  let total = 0;
  body.innerHTML = cart.map((id, i)=>{
    const p = productos.find(x=>x.id===id); total += p.precio;
    return `<div class="cart-item"><img src="${p.img}" alt="${p.nombre}"><div><b>${p.nombre}</b><small>Medida: ${p.tamano}</small><small>Serie de ${p.edicion} · Con número y certificado</small><button class="remove" data-remove="${i}">Quitar</button></div><b>${euros(p.precio)}</b></div>`;
  }).join('');
  totalEl.textContent = euros(total);
  body.querySelectorAll('[data-remove]').forEach(b=>b.addEventListener('click',()=>{ cart.splice(Number(b.dataset.remove),1); saveCart(); }));
}

function showToast(msg){
  const t = document.getElementById('toast'); if(!t) return;
  t.textContent = msg; t.classList.add('show');
  clearTimeout(t._h); t._h = setTimeout(()=>t.classList.remove('show'), 3400);
}

function setOverlay(v){ document.getElementById('overlay')?.classList.toggle('show', v); }
function openMenu(){
  document.getElementById('mainNav')?.classList.add('open');
  document.getElementById('menuBtn')?.setAttribute('aria-expanded','true');
  document.body.classList.add('menu-open'); setOverlay(true);
}
function closeMenu(){
  document.getElementById('mainNav')?.classList.remove('open');
  document.getElementById('menuBtn')?.setAttribute('aria-expanded','false');
  document.body.classList.remove('menu-open');
  if(!document.getElementById('cartDrawer')?.classList.contains('open')) setOverlay(false);
}
function toggleMenu(){
  document.getElementById('mainNav')?.classList.contains('open') ? closeMenu() : openMenu();
}
function openCart(){ closeMenu(); document.getElementById('cartDrawer')?.classList.add('open'); document.body.classList.add('cart-open'); setOverlay(true); }
function closeCart(){
  document.getElementById('cartDrawer')?.classList.remove('open');
  document.body.classList.remove('cart-open'); closeMenu(); setOverlay(false);
}

function initShop(){
  renderCart();
  document.getElementById('cartBtn')?.addEventListener('click', openCart);
  document.getElementById('closeCart')?.addEventListener('click', closeCart);
  document.getElementById('overlay')?.addEventListener('click', closeCart);
  document.getElementById('menuBtn')?.addEventListener('click', toggleMenu);
  document.getElementById('navClose')?.addEventListener('click', closeMenu);
  document.querySelectorAll('#mainNav a').forEach(a=>a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e=>{ if(e.key==='Escape'){ closeMenu(); closeCart(); } });
  window.addEventListener('resize', ()=>{ if(window.innerWidth>980) closeMenu(); });
  document.getElementById('checkoutBtn')?.addEventListener('click', ()=>{
    if(cart.length===0){ showToast('La cesta está vacía. Cuando elijas un cuadro, lo verás aquí.'); return; }
    showToast('Compra de prueba hecha. En una compra real te asignaríamos el siguiente número libre y te escribiríamos para confirmar el envío.');
    cart = []; saveCart(); closeCart();
  });
  document.querySelectorAll('[data-add]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const p = productos.find(x=>x.id===btn.dataset.add);
      if(cart.includes(p.id)){ showToast('Esta obra ya está en tu cesta. Solo puede añadirse un ejemplar por compra.'); openCart(); return; }
      cart.push(p.id); saveCart();
      showToast('«' + p.nombre + '» se ha añadido a la cesta. Al completar la compra asignaremos el siguiente número disponible.');
      openCart();
    });
  });
  document.querySelectorAll('[data-newsletter]').forEach(f=>f.addEventListener('submit', e=>{
    e.preventDefault();
    showToast('Hecho. Solo te escribiremos cuando haya una serie nueva o una a punto de cerrarse.');
    f.reset();
  }));
  // Marquee
  const track = document.getElementById('marqueeTrack');
  if(track){
    const items = 'Series cortas <i>●</i> Número escrito a mano <i>●</i> Certificado firmado <i>●</i> Un solo tamaño por cuadro <i>●</i> Especialistas en gran formato <i>●</i> Cuando se cierra, no vuelve <i>●</i> ';
    track.innerHTML = '<span>' + items.repeat(3) + '</span><span>' + items.repeat(3) + '</span>';
  }
  // Reveal on scroll
  const io = new IntersectionObserver(entries=>entries.forEach(en=>{ if(en.isIntersecting){ en.target.classList.add('visible'); io.unobserve(en.target); } }), {threshold:.08});
  document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
}
