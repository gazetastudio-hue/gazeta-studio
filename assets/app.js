/* GAZETA STUDIO — app: header, menú, carrito (localStorage), formularios.
   Stripe: el checkout llama a /api/create-checkout (Vercel Function). Sin claves = modo demo avisado.
   Supabase: si configuras SUPABASE_URL/ANON en el endpoint /api/lead, los leads se guardan allí. */
(function(){
  const $=(s,c=document)=>c.querySelector(s), $$=(s,c=document)=>[...c.querySelectorAll(s)];
  // Header scroll
  const header=$('#siteHeader'); const onScroll=()=>header&&header.classList.toggle('scrolled',scrollY>40); addEventListener('scroll',onScroll,{passive:true}); onScroll();
  // Mobile nav
  const burger=$('#burger'), nav=$('#mainNav'); burger&&burger.addEventListener('click',()=>nav.classList.toggle('open'));
  // Obras (inicio + colecciones comparten render)
  const fmt=n=>new Intl.NumberFormat('es-ES',{style:'currency',currency:'EUR',maximumFractionDigits:0}).format(n);
  function workCard(w,i){
    const media=w.image?`<img src="${w.image}" alt="Obra ${w.title}, lienzo edición limitada ${w.format}" loading="lazy">`:`<div class="art-placeholder">GAZETA<br><small style="font-size:.72rem;letter-spacing:.34em">OBRA ${String(i+1).padStart(2,'0')}</small></div>`;
    return `<article class="obra-row ${i%2?'reverse':''}"><div class="obra-media">${media}</div>
    <div class="obra-info"><p class="obra-num">N.º ${String(i+1).padStart(2,'0')} — ${window.GAZETA.collection.name}</p><h3>${w.title}</h3><p class="lead">${w.desc}</p>
    <dl class="specs"><div><dt>Formato</dt><dd>${w.format} · formato único</dd></div><div><dt>Edición</dt><dd>${w.editionTotal} ejemplares numerados</dd></div><div><dt>Disponibles</dt><dd>${w.editionLeft} de ${w.editionTotal}</dd></div></dl>
    <p class="cert-line">Con certificado numerado de GAZETA STUDIO, firmado por Juan Casper.</p>
    <p class="price">${fmt(w.price)}</p><button class="btn light" data-add="${w.id}">Añadir al carrito</button></div></article>`;
  }
  $$('[data-works]').forEach(el=>{ el.innerHTML=window.GAZETA.works.map(workCard).join(''); });
  const up=$('[data-upcoming]'); if(up) up.innerHTML=window.GAZETA.upcoming.map(c=>`<article class="poster-card"><figure><div class="art-placeholder" style="background:linear-gradient(150deg,#24060f,#571627 60%,#170409)"><span style="font-size:1rem;letter-spacing:.34em">GAZETA STUDIO</span></div></figure><figcaption><p class="eyebrow" style="margin-bottom:12px">Próxima colección</p><h3>${c.name}</h3><p>${c.date}<br>${c.note}</p><p style="margin-top:18px"><a class="link-arrow" href="#proxima-apertura">Acceso anticipado</a></p></figcaption></article>`).join('');
  const cl=$('[data-closed]'); if(cl) cl.innerHTML=window.GAZETA.closed.map((c,i)=>{
    const fig=c.image?`<img src="${c.image}" alt="Obra de la colección cerrada ${c.name} instalada en un interior" loading="lazy">`:`<div class="art-placeholder" style="aspect-ratio:4/3">GAZETA</div>`;
    return `<article class="poster-card closed"><figure>${fig}<span class="closed-stamp">Colección cerrada</span></figure><figcaption><h3>${c.name}</h3><p>${c.note}. No se reimprime. No se reedita.</p></figcaption></article>`}).join('');
  // Carrito
  let cart=[]; try{cart=JSON.parse(localStorage.getItem('gazeta_cart')||'[]')}catch(e){cart=[]}
  const drawer=$('#cartDrawer'), scrim=$('#scrim');
  function save(){localStorage.setItem('gazeta_cart',JSON.stringify(cart)); render();}
  function openCart(){drawer&&drawer.classList.add('open'); scrim&&scrim.classList.add('show')}
  function closeCart(){drawer&&drawer.classList.remove('open'); scrim&&scrim.classList.remove('show')}
  function render(){
    const count=cart.reduce((a,i)=>a+i.qty,0), total=cart.reduce((a,i)=>{const w=window.GAZETA.works.find(x=>x.id===i.id);return a+(w?w.price*i.qty:0)},0);
    $$('.cart-count').forEach(e=>e.textContent=count);
    const body=$('#cartBody'); if(!body) return;
    body.innerHTML=cart.length?cart.map(i=>{const w=window.GAZETA.works.find(x=>x.id===i.id); if(!w)return''; return `<div class="cart-item"><div class="thumb">G</div><div><strong>${w.title}</strong><br><small>${w.format} · Edición de ${w.editionTotal}</small><br><button data-dec="${w.id}" aria-label="Quitar uno">−</button> ${i.qty} <button data-inc="${w.id}" aria-label="Añadir uno">+</button></div><strong>${fmt(w.price*i.qty)}</strong></div>`}).join('')+`<p style="margin-top:22px;display:flex;justify-content:space-between"><span>Total (IVA incl.)</span><strong>${fmt(total)}</strong></p><p class="form-note">Pago seguro con Stripe. Tu ejemplar se asigna por orden de compra y viaja con su certificado numerado firmado.</p><button class="btn wine" style="width:100%" id="checkoutBtn">Pagar con Stripe</button>`:`<p class="lead">Tu carrito está vacío.<br>Cuando una edición se cierra, no vuelve.</p><a class="btn" href="colecciones.html">Ver colección actual</a>`;
    const cb=$('#checkoutBtn'); cb&&cb.addEventListener('click',checkout);
    $$('[data-inc]',body).forEach(b=>b.onclick=()=>{cart.find(i=>i.id===b.dataset.inc).qty++;save()});
    $$('[data-dec]',body).forEach(b=>b.onclick=()=>{const it=cart.find(i=>i.id===b.dataset.dec); it.qty--; if(it.qty<1)cart=cart.filter(i=>i.id!==it.id); save()});
  }
  document.addEventListener('click',e=>{const b=e.target.closest('[data-add]'); if(b){const id=b.dataset.add; const ex=cart.find(i=>i.id===id); ex?ex.qty++:cart.push({id,qty:1}); save(); toast('Obra añadida. La unidad queda sujeta a confirmación de edición al pagar.'); openCart();}});
  $$('[data-open-cart]').forEach(b=>b.addEventListener('click',openCart)); $$('[data-close-cart]').forEach(b=>b.addEventListener('click',closeCart)); scrim&&scrim.addEventListener('click',closeCart);
  async function checkout(){
    const items=cart.map(i=>({id:i.id,qty:i.qty}));
    try{ const r=await fetch('/api/create-checkout',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({items})});
      const d=await r.json(); if(d.url){location.href=d.url; return;} throw new Error(d.error||'Stripe no configurado'); }
    catch(err){ toast('Modo demo: conecta STRIPE_SECRET_KEY en Vercel para cobrar de verdad. Ningún cargo realizado.'); }
  }
  function toast(msg){const t=$('#toast'); if(!t)return; t.textContent=msg; t.classList.add('show'); setTimeout(()=>t.classList.remove('show'),4200);}
  // Formularios -> /api/lead (Supabase). Fallback honesto si no hay backend.
  $$('form[data-lead]').forEach(f=>f.addEventListener('submit',async e=>{e.preventDefault(); const data=Object.fromEntries(new FormData(f)); data.type=f.dataset.lead; data.page=location.pathname;
    try{const r=await fetch('/api/lead',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)}); if(!r.ok)throw 0; f.reset(); const s=f.parentElement.querySelector('.success'); if(s)s.style.display='block'; toast('Recibido. Bienvenido al acceso anticipado de GAZETA STUDIO.');}
    catch(_){ toast('Formulario en modo demo: conecta Supabase (ver README) para guardar contactos.'); }}));
  render();
})();
