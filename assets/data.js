/* ============================================================
   GAZETA STUDIO — CATÁLOGO EDITABLE
   Sustituye `image` por la ruta de cada obra final (ej. assets/obras/origen-01.jpg)
   REGLA DE NEGOCIO: cada obra tiene UN SOLO formato. No añadas selector de medidas.
   `editionTotal` y `editionLeft` controlan escasez real. No publiques cifras falsas.
============================================================ */
window.GAZETA = {
  collection: {
    id: "coleccion-i-origen", name: "Colección I — Origen",
    window: "15 octubre — 8 noviembre 2026 · o hasta agotar ediciones",
    claim: "Negro mineral, blanco roto y granate. El origen no se repite."
  },
  works: [
    {id:"origen-01", title:"Materia primera", image:"assets/hero-interior.jpg", format:"150 × 100 cm", orientation:"Horizontal", editionTotal:10, editionLeft:10, price:1290, tag:"Gran formato · Obra insignia", desc:"Una masa oscura que respira sobre el muro. Pensada para salones con luz natural, hormigón, piedra y madera noble: no decora la estancia, la ordena."},
    {id:"origen-02", title:"Vino detenido", image:"", format:"120 × 80 cm", orientation:"Horizontal", editionTotal:15, editionLeft:15, price:890, tag:"Gran formato", desc:"Granate profundo sobre negro. La pieza de entrada a la colección: presencia rotunda sin saturar, ideal sobre un sofá de línea baja o un aparador escultórico."},
    {id:"origen-03", title:"Umbral blanco", image:"", format:"90 × 60 cm", orientation:"Horizontal", editionTotal:25, editionLeft:25, price:490, tag:"Formato esencial", desc:"Blanco roto, gris humo y un solo gesto. Para dormitorios serenos, despachos y espacios donde el silencio también forma parte del diseño."}
  ],
  upcoming: [
    {name:"Colección II — Ceniza y Vino", date:"28 noviembre — 19 diciembre 2026", note:"Edición especial de invierno. 7 obras · 2 gran formato."},
    {name:"Colección III — Arquitectura Interior", date:"Febrero 2027", note:"Diálogo con hormigón, travertino y luz mediterránea. 8 obras."}
  ],
  closed: ["Preludio — Estudio 01","Negro sobre Negro","La Primera Pared","Materia — Serie Corta","Granate Profundo","Archivo 001"]
};
