/* GAZETA STUDIO — Tienda (e-commerce) */
const RAIZ = location.hostname.includes('github.io') ? '/gazeta-studio/' : '/';

/* colecciones fijas de temporada + TEXTURES (edición limitada de 20) */
const COLECCIONES = {
  eclectic:  { nombre:'ECLECTIC',           desc:'Color, contraste y energía. Arte con carácter para salas con personalidad.' },
  nordic:    { nombre:'NORDIC',             desc:'Calma nórdica: tonos suaves y líneas serenas para espacios luminosos.' },
  bauhaus:   { nombre:'BAUHAUS',            desc:'Geometría y color primario. El modernismo que nunca pasa de moda.' },
  ethereum:  { nombre:'ETHEREUM',           desc:'Lo digital hecho arte: cristal, luz y profundidad sobre negro.' },
  popart:    { nombre:'POP ART',            desc:'Cultura pop en gran formato: color puro, contornos negros y energía de cómic.' },
  dimension: { nombre:'ABSTRACT DIMENSION', desc:'Capas, sombras y relieve: abstracción que se sale del plano.' },
  textures:  { nombre:'TEXTURES',           desc:'Edición limitada: 20 copias numeradas por obra, con certificado. Cuando se agota, no vuelve.' }
};

const productos = [
  /* ───── TEXTURES · edición limitada de 20 ───── */
  { id:'vino-primero', nombre:'Corriente', coleccion:'textures', img:'assets/obra-vino.jpg', img2:'assets/print-vino.jpg', tamano:'100 × 150 cm', size_id:22, edicion:20, restantes:14, precio:890,  pago:'https://buy.stripe.com/6oUdR3cXOgIc3G2bmf5os00', gran:true },
  { id:'trazo-unico', nombre:'Pulso', coleccion:'textures', img:'assets/obra-trazo.jpg', img2:'assets/print-trazo.jpg', tamano:'100 × 140 cm', size_id:44, edicion:20, restantes:16, precio:420,  pago:'https://buy.stripe.com/4gM7sF9LCfE890m2PJ5os01', gran:true },
  { id:'linea-y-vino', nombre:'Perfil en reposo', coleccion:'textures', img:'assets/obra-linea.jpg', img2:'assets/print-linea.jpg', tamano:'60 × 90 cm', size_id:19, edicion:20, restantes:18, precio:240,  pago:'https://buy.stripe.com/dRmcMZ2ja63ydgC9e75os02', gran:false },
  { id:'arena-calma', nombre:'Mediodía', coleccion:'textures', img:'assets/obra-arena.jpg', img2:'assets/print-arena.jpg', tamano:'120 × 165 cm', size_id:30, edicion:20, restantes:12, precio:560,  pago:'https://buy.stripe.com/cNi00d0b2crW7Wieyr5os03', gran:true },
  { id:'horizonte-vino', nombre:'Última luz', coleccion:'textures', img:'assets/obra-horizonte.jpg', img2:'assets/print-horizonte.jpg', tamano:'150 × 100 cm', size_id:22, edicion:20, restantes:9,  precio:1150, pago:'https://buy.stripe.com/00wcMZbTK0Jeb8u9e75os04', gran:true },
  { id:'geometria-callada', nombre:'Equilibrio', coleccion:'textures', img:'assets/obra-geometria.jpg', img2:'assets/print-geometria.jpg', tamano:'40 × 55 cm', size_id:39, edicion:20, restantes:15, precio:145,  pago:'https://buy.stripe.com/5kQcMZcXO63y6Se4XR5os05', gran:false },
  { id:'textures-7', nombre:'Vena', coleccion:'textures', img:'assets/art-textures-7.jpg', img2:'assets/print-textures-7.jpg', tamano:'100 × 150 cm', size_id:22, edicion:20, restantes:20, precio:289, pago:'https://buy.stripe.com/7sY9AN3nebnSb8ueyr5os14', gran:false },
  { id:'textures-8', nombre:'Ceniza', coleccion:'textures', img:'assets/art-textures-8.jpg', img2:'assets/print-textures-8.jpg', tamano:'140 × 100 cm', size_id:44, edicion:20, restantes:20, precio:259, pago:'https://buy.stripe.com/14A7sF7Dudw0dgC2PJ5os15', gran:false },
  { id:'textures-9', nombre:'Atardecer en yeso', coleccion:'textures', img:'assets/art-textures-9.jpg', img2:'assets/print-textures-9.jpg', tamano:'165 × 120 cm', size_id:30, edicion:20, restantes:20, precio:299, pago:'https://buy.stripe.com/8x24gt2ja8bGb8u4XR5os16', gran:false },
  { id:'textures-10', nombre:'Piel', coleccion:'textures', img:'assets/art-textures-10.jpg', img2:'assets/print-textures-10.jpg', tamano:'60 × 90 cm', size_id:19, edicion:20, restantes:20, precio:189, pago:'https://buy.stripe.com/9B66oB4ri63ygsO75Z5os17', gran:false },
  /* ───── ECLECTIC ───── */
  { id:'eclectic-1', nombre:'Marea urbana', coleccion:'eclectic', img:'assets/art-eclectic-1.jpg', img2:'assets/print-eclectic-1.jpg', tamano:'100 × 150 cm', size_id:22, edicion:100, restantes:100, precio:289, pago:'https://buy.stripe.com/5kQ00dcXOfE87Wi9e75os06', gran:true },
  { id:'eclectic-2', nombre:'Terraza interior', coleccion:'eclectic', img:'assets/art-eclectic-2.jpg', img2:'assets/print-eclectic-2.jpg', tamano:'70 × 100 cm', size_id:44, edicion:100, restantes:100, precio:169, pago:'https://buy.stripe.com/9B64gt1f68bG90m1LF5os07', gran:false },
  { id:'eclectic-3', nombre:'Alfama', coleccion:'eclectic', img:'assets/art-eclectic-3.jpg', img2:'assets/print-eclectic-3.jpg', tamano:'70 × 100 cm', size_id:44, edicion:100, restantes:100, precio:159, pago:'https://buy.stripe.com/6oU3cpaPG4Zu90mbmf5os08', gran:false },
  { id:'eclectic-4', nombre:'Azotea', coleccion:'eclectic', img:'assets/art-eclectic-4.jpg', img2:'assets/print-eclectic-4.jpg', tamano:'100 × 150 cm', size_id:22, edicion:100, restantes:100, precio:199, pago:'https://buy.stripe.com/7sY9AN7DucrW90mfCv5os0p', gran:true },
  { id:'eclectic-5', nombre:'Bodegón eléctrico', coleccion:'eclectic', img:'assets/art-eclectic-5.jpg', img2:'assets/print-eclectic-5.jpg', tamano:'110 × 140 cm', size_id:44, edicion:100, restantes:100, precio:179, pago:'https://buy.stripe.com/eVqcMZe1S4ZugsO8a35os0q', gran:true },
  { id:'eclectic-6', nombre:'Mercado de flores', coleccion:'eclectic', img:'assets/art-eclectic-6.jpg', img2:'assets/print-eclectic-6.jpg', tamano:'140 × 100 cm', size_id:44, edicion:100, restantes:100, precio:179, pago:'https://buy.stripe.com/9B66oB3ne2Rm7Wi61V5os0w', gran:false },
  { id:'eclectic-7', nombre:'La cocina roja', coleccion:'eclectic', img:'assets/art-eclectic-7.jpg', img2:'assets/print-eclectic-7.jpg', tamano:'50 × 40 cm', size_id:32, edicion:100, restantes:100, precio:119, pago:'https://buy.stripe.com/5kQeV7bTKdw0foK2PJ5os0x', gran:false },
  { id:'eclectic-8', nombre:'Danza de sombrillas', coleccion:'eclectic', img:'assets/art-eclectic-8.jpg', img2:'assets/print-eclectic-8.jpg', tamano:'100 × 150 cm', size_id:22, edicion:100, restantes:100, precio:199, pago:'https://buy.stripe.com/3cI14hcXO1Nib8u1LF5os0y', gran:false },
  { id:'eclectic-9', nombre:'Jardín nocturno', coleccion:'eclectic', img:'assets/art-eclectic-9.jpg', img2:'assets/print-eclectic-9.jpg', tamano:'55 × 40 cm', size_id:39, edicion:100, restantes:100, precio:89, pago:'https://buy.stripe.com/28EbIV4ri4ZugsOfCv5os0z', gran:false },
  { id:'eclectic-10', nombre:'El coleccionista', coleccion:'eclectic', img:'assets/art-eclectic-10.jpg', img2:'assets/print-eclectic-10.jpg', tamano:'150 × 75 cm', size_id:8, edicion:100, restantes:100, precio:229, pago:'https://buy.stripe.com/6oU00d7DueA4ccybmf5os0A', gran:false },
  /* ───── NORDIC ───── */
  { id:'nordic-1', nombre:'Silencio claro', coleccion:'nordic', img:'assets/art-nordic-1.jpg', img2:'assets/print-nordic-1.jpg', tamano:'70 × 100 cm', size_id:44, edicion:100, restantes:100, precio:159, pago:'https://buy.stripe.com/6oU3cp1f6fE86Se3TN5os09', gran:false },
  { id:'nordic-2', nombre:'Fiordo', coleccion:'nordic', img:'assets/art-nordic-2.jpg', img2:'assets/print-nordic-2.jpg', tamano:'70 × 100 cm', size_id:44, edicion:100, restantes:100, precio:149, pago:'https://buy.stripe.com/9B6cMZbTK77Cb8u8a35os0a', gran:false },
  { id:'nordic-3', nombre:'Nieve de abril', coleccion:'nordic', img:'assets/art-nordic-3.jpg', img2:'assets/print-nordic-3.jpg', tamano:'40 × 50 cm', size_id:32, edicion:100, restantes:100, precio:89, pago:'https://buy.stripe.com/8x2dR39LCdw05Oabmf5os0b', gran:false },
  { id:'nordic-4', nombre:'Lago quieto', coleccion:'nordic', img:'assets/art-nordic-4.jpg', img2:'assets/print-nordic-4.jpg', tamano:'140 × 100 cm', size_id:44, edicion:100, restantes:100, precio:139, pago:'https://buy.stripe.com/eVqcMZga0crW4K68a35os0r', gran:true },
  { id:'nordic-5', nombre:'Bosque blanco', coleccion:'nordic', img:'assets/art-nordic-5.jpg', img2:'assets/print-nordic-5.jpg', tamano:'100 × 150 cm', size_id:22, edicion:100, restantes:100, precio:149, pago:'https://buy.stripe.com/dRmbIVga04ZufoKgGz5os0s', gran:true },
  { id:'nordic-6', nombre:'Marea baja', coleccion:'nordic', img:'assets/art-nordic-6.jpg', img2:'assets/print-nordic-6.jpg', tamano:'140 × 100 cm', size_id:44, edicion:100, restantes:100, precio:139, pago:'https://buy.stripe.com/fZufZb2jafE85Oa2PJ5os0B', gran:false },
  { id:'nordic-7', nombre:'Hielo', coleccion:'nordic', img:'assets/art-nordic-7.jpg', img2:'assets/print-nordic-7.jpg', tamano:'50 × 40 cm', size_id:32, edicion:100, restantes:100, precio:79, pago:'https://buy.stripe.com/eVq3cp8HybnS1xU61V5os0C', gran:false },
  { id:'nordic-8', nombre:'Campo de centeno', coleccion:'nordic', img:'assets/art-nordic-8.jpg', img2:'assets/print-nordic-8.jpg', tamano:'100 × 150 cm', size_id:22, edicion:100, restantes:100, precio:149, pago:'https://buy.stripe.com/28E4gt6zqbnSccy4XR5os0D', gran:false },
  { id:'nordic-9', nombre:'Primer tren', coleccion:'nordic', img:'assets/art-nordic-9.jpg', img2:'assets/print-nordic-9.jpg', tamano:'55 × 40 cm', size_id:39, edicion:100, restantes:100, precio:79, pago:'https://buy.stripe.com/8x214hf5W4Zu2BY4XR5os0E', gran:false },
  { id:'nordic-10', nombre:'Ventana al fiordo', coleccion:'nordic', img:'assets/art-nordic-10.jpg', img2:'assets/print-nordic-10.jpg', tamano:'150 × 75 cm', size_id:8, edicion:100, restantes:100, precio:199, pago:'https://buy.stripe.com/bJeaER6zqcrW3G20HB5os0F', gran:false },
  /* ───── BAUHAUS ───── */
  { id:'bauhaus-1', nombre:'Composición 7', coleccion:'bauhaus', img:'assets/art-bauhaus-1.jpg', img2:'assets/print-bauhaus-1.jpg', tamano:'70 × 100 cm', size_id:44, edicion:100, restantes:100, precio:159, pago:'https://buy.stripe.com/4gMbIVcXO3VqdgCdun5os0c', gran:false },
  { id:'bauhaus-2', nombre:'Eje y círculo', coleccion:'bauhaus', img:'assets/art-bauhaus-2.jpg', img2:'assets/print-bauhaus-2.jpg', tamano:'100 × 150 cm', size_id:22, edicion:100, restantes:100, precio:279, pago:'https://buy.stripe.com/fZueV72jafE8b8u4XR5os0d', gran:true },
  { id:'bauhaus-3', nombre:'Tríada', coleccion:'bauhaus', img:'assets/art-bauhaus-3.jpg', img2:'assets/print-bauhaus-3.jpg', tamano:'75 × 150 cm', size_id:8, edicion:100, restantes:100, precio:249, pago:'https://buy.stripe.com/cNi00df5WfE87Wi0HB5os0e', gran:true },
  { id:'bauhaus-4', nombre:'Progresión', coleccion:'bauhaus', img:'assets/art-bauhaus-4.jpg', img2:'assets/print-bauhaus-4.jpg', tamano:'100 × 200 cm', size_id:8, edicion:100, restantes:100, precio:229, pago:'https://buy.stripe.com/3cI7sFaPG2Rm1xUaib5os0t', gran:true },
  { id:'bauhaus-5', nombre:'Arco primario', coleccion:'bauhaus', img:'assets/art-bauhaus-5.jpg', img2:'assets/print-bauhaus-5.jpg', tamano:'110 × 140 cm', size_id:44, edicion:100, restantes:100, precio:189, pago:'https://buy.stripe.com/00weV7e1SgIc7Wibmf5os0u', gran:true },
  { id:'bauhaus-6', nombre:'Contracomposición', coleccion:'bauhaus', img:'assets/art-bauhaus-6.jpg', img2:'assets/print-bauhaus-6.jpg', tamano:'100 × 150 cm', size_id:22, edicion:100, restantes:100, precio:189, pago:'https://buy.stripe.com/bJe14h3ne3Vqb8u1LF5os0G', gran:false },
  { id:'bauhaus-7', nombre:'Tres mástiles', coleccion:'bauhaus', img:'assets/art-bauhaus-7.jpg', img2:'assets/print-bauhaus-7.jpg', tamano:'140 × 100 cm', size_id:44, edicion:100, restantes:100, precio:169, pago:'https://buy.stripe.com/3cI4gt7Du3Vqb8ueyr5os0H', gran:false },
  { id:'bauhaus-8', nombre:'Círculo roto', coleccion:'bauhaus', img:'assets/art-bauhaus-8.jpg', img2:'assets/print-bauhaus-8.jpg', tamano:'50 × 40 cm', size_id:32, edicion:100, restantes:100, precio:99, pago:'https://buy.stripe.com/00w3cpe1S63y4K61LF5os0I', gran:false },
  { id:'bauhaus-9', nombre:'Escalera cromática', coleccion:'bauhaus', img:'assets/art-bauhaus-9.jpg', img2:'assets/print-bauhaus-9.jpg', tamano:'55 × 40 cm', size_id:39, edicion:100, restantes:100, precio:89, pago:'https://buy.stripe.com/28E28lf5WcrWdgC1LF5os0J', gran:false },
  { id:'bauhaus-10', nombre:'Metropolitano', coleccion:'bauhaus', img:'assets/art-bauhaus-10.jpg', img2:'assets/print-bauhaus-10.jpg', tamano:'150 × 75 cm', size_id:8, edicion:100, restantes:100, precio:199, pago:'https://buy.stripe.com/4gM00d1f63Vq0tQ1LF5os0K', gran:false },
  /* ───── ETHEREUM ───── */
  { id:'ethereum-1', nombre:'Nodo', coleccion:'ethereum', img:'assets/art-ethereum-1.jpg', img2:'assets/print-ethereum-1.jpg', tamano:'100 × 150 cm', size_id:22, edicion:100, restantes:100, precio:289, pago:'https://buy.stripe.com/28EfZbe1S3Vq5Oaaib5os0f', gran:true },
  { id:'ethereum-2', nombre:'Vórtice', coleccion:'ethereum', img:'assets/art-ethereum-2.jpg', img2:'assets/print-ethereum-2.jpg', tamano:'100 × 150 cm', size_id:22, edicion:100, restantes:100, precio:289, pago:'https://buy.stripe.com/5kQ00d3ne63y7Wiaib5os0m', gran:true },
  { id:'ethereum-3', nombre:'Nébula', coleccion:'ethereum', img:'assets/art-ethereum-3.jpg', img2:'assets/print-ethereum-3.jpg', tamano:'140 × 100 cm', size_id:44, edicion:100, restantes:100, precio:269, pago:'https://buy.stripe.com/8x2eV76zq9fKccyeyr5os0n', gran:true },
  { id:'ethereum-4', nombre:'Fractura', coleccion:'ethereum', img:'assets/art-ethereum-4.jpg', img2:'assets/print-ethereum-4.jpg', tamano:'165 × 120 cm', size_id:30, edicion:100, restantes:100, precio:249, pago:'https://buy.stripe.com/00w00d4riajOfoKeyr5os0o', gran:true },
  { id:'ethereum-5', nombre:'Espejo líquido', coleccion:'ethereum', img:'assets/art-ethereum-5.jpg', img2:'assets/print-ethereum-5.jpg', tamano:'100 × 150 cm', size_id:22, edicion:100, restantes:100, precio:289, pago:'https://buy.stripe.com/cNi8wJ0b28bG4K661V5os0L', gran:false },
  { id:'ethereum-6', nombre:'Señal', coleccion:'ethereum', img:'assets/art-ethereum-6.jpg', img2:'assets/print-ethereum-6.jpg', tamano:'50 × 40 cm', size_id:32, edicion:100, restantes:100, precio:129, pago:'https://buy.stripe.com/3cI5kx7Dudw02BY1LF5os0M', gran:false },
  { id:'ethereum-7', nombre:'Constelación', coleccion:'ethereum', img:'assets/art-ethereum-7.jpg', img2:'assets/print-ethereum-7.jpg', tamano:'140 × 100 cm', size_id:44, edicion:100, restantes:100, precio:259, pago:'https://buy.stripe.com/4gMbIVaPG4Zu6Sedun5os0N', gran:false },
  { id:'ethereum-8', nombre:'Abismo dorado', coleccion:'ethereum', img:'assets/art-ethereum-8.jpg', img2:'assets/print-ethereum-8.jpg', tamano:'150 × 75 cm', size_id:8, edicion:100, restantes:100, precio:199, pago:'https://buy.stripe.com/4gM8wJ2jadw02BYcqj5os0O', gran:false },
  { id:'ethereum-9', nombre:'Latencia', coleccion:'ethereum', img:'assets/art-ethereum-9.jpg', img2:'assets/print-ethereum-9.jpg', tamano:'55 × 40 cm', size_id:39, edicion:100, restantes:100, precio:119, pago:'https://buy.stripe.com/aFa3cp8HyajOgsOgGz5os0P', gran:false },
  { id:'ethereum-10', nombre:'Núcleo', coleccion:'ethereum', img:'assets/art-ethereum-10.jpg', img2:'assets/print-ethereum-10.jpg', tamano:'165 × 120 cm', size_id:30, edicion:100, restantes:100, precio:289, pago:'https://buy.stripe.com/cNi6oB6zq2RmdgCgGz5os0Q', gran:false },
  { id:'popart-1', nombre:'Rostro pop', coleccion:'popart', img:'assets/art-popart-1.jpg', img2:'assets/print-popart-1.jpg', tamano:'100 × 140 cm', size_id:22, edicion:100, restantes:100, precio:149, pago:'https://buy.stripe.com/dRmeV7f5WcrWccygGz5os0g', gran:false },
  { id:'popart-2', nombre:'Plátano explosivo', coleccion:'popart', img:'assets/art-popart-2.jpg', img2:'assets/print-popart-2.jpg', tamano:'100 × 150 cm', size_id:22, edicion:100, restantes:100, precio:159, pago:'https://buy.stripe.com/28EdR31f61Ni5Oa9e75os0h', gran:true },
  { id:'popart-3', nombre:'Big bang', coleccion:'popart', img:'assets/art-popart-3.jpg', img2:'assets/print-popart-3.jpg', tamano:'110 × 140 cm', size_id:44, edicion:100, restantes:100, precio:179, pago:'https://buy.stripe.com/cNieV7bTKfE81xU4XR5os0i', gran:true },
  { id:'popart-4', nombre:'Chicle', coleccion:'popart', img:'assets/art-popart-4.jpg', img2:'assets/print-popart-4.jpg', tamano:'100 × 140 cm', size_id:22, edicion:100, restantes:100, precio:139, pago:'https://buy.stripe.com/3cIcMZe1SfE82BY0HB5os0v', gran:true },
  { id:'popart-5', nombre:'Cóctel', coleccion:'popart', img:'assets/art-popart-5.jpg', img2:'assets/print-popart-5.jpg', tamano:'100 × 150 cm', size_id:22, edicion:100, restantes:100, precio:149, pago:'https://buy.stripe.com/7sYcMZ9LCbnS4K63TN5os0R', gran:false },
  { id:'popart-6', nombre:'Patatas fritas', coleccion:'popart', img:'assets/art-popart-6.jpg', img2:'assets/print-popart-6.jpg', tamano:'50 × 40 cm', size_id:32, edicion:100, restantes:100, precio:99, pago:'https://buy.stripe.com/14AfZbbTK3Vq3G2eyr5os0S', gran:false },
  { id:'popart-7', nombre:'La estrella', coleccion:'popart', img:'assets/art-popart-7.jpg', img2:'assets/print-popart-7.jpg', tamano:'140 × 100 cm', size_id:44, edicion:100, restantes:100, precio:169, pago:'https://buy.stripe.com/00w28laPGeA4foK8a35os0T', gran:false },
  { id:'popart-8', nombre:'Burbujas', coleccion:'popart', img:'assets/art-popart-8.jpg', img2:'assets/print-popart-8.jpg', tamano:'55 × 40 cm', size_id:39, edicion:100, restantes:100, precio:89, pago:'https://buy.stripe.com/28E3cpga04ZugsO8a35os0U', gran:false },
  { id:'popart-9', nombre:'Casete', coleccion:'popart', img:'assets/art-popart-9.jpg', img2:'assets/print-popart-9.jpg', tamano:'150 × 75 cm', size_id:8, edicion:100, restantes:100, precio:199, pago:'https://buy.stripe.com/9B614h4rieA40tQbmf5os0V', gran:false },
  { id:'popart-10', nombre:'Sirena', coleccion:'popart', img:'assets/art-popart-10.jpg', img2:'assets/print-popart-10.jpg', tamano:'165 × 120 cm', size_id:30, edicion:100, restantes:100, precio:189, pago:'https://buy.stripe.com/eVqdR32ja77C4K69e75os0W', gran:false },
  { id:'dimension-1', nombre:'Estratos', coleccion:'dimension', img:'assets/art-dimension-1.jpg', img2:'assets/print-dimension-1.jpg', tamano:'100 × 150 cm', size_id:22, edicion:100, restantes:100, precio:169, pago:'https://buy.stripe.com/dRm3cpe1S1Ni2BY2PJ5os0j', gran:true },
  { id:'dimension-2', nombre:'Arcos flotantes', coleccion:'dimension', img:'assets/art-dimension-2.jpg', img2:'assets/print-dimension-2.jpg', tamano:'80 × 160 cm', size_id:44, edicion:100, restantes:100, precio:219, pago:'https://buy.stripe.com/fZudR39LCgIc90mcqj5os0k', gran:true },
  { id:'dimension-3', nombre:'Ola tallada', coleccion:'dimension', img:'assets/art-dimension-3.jpg', img2:'assets/print-dimension-3.jpg', tamano:'110 × 140 cm', size_id:30, edicion:100, restantes:100, precio:189, pago:'https://buy.stripe.com/fZu14hcXO1Ni3G2dun5os0l', gran:true },
  { id:'dimension-4', nombre:'Estratos II', coleccion:'dimension', img:'assets/art-dimension-4.jpg', img2:'assets/print-dimension-4.jpg', tamano:'100 × 150 cm', size_id:22, edicion:100, restantes:100, precio:169, pago:'https://buy.stripe.com/eVqdR37DubnSfoKgGz5os0X', gran:false },
  { id:'dimension-5', nombre:'Plegado', coleccion:'dimension', img:'assets/art-dimension-5.jpg', img2:'assets/print-dimension-5.jpg', tamano:'50 × 40 cm', size_id:32, edicion:100, restantes:100, precio:99, pago:'https://buy.stripe.com/6oU9AN4rifE8a4q2PJ5os0Y', gran:false },
  { id:'dimension-6', nombre:'Duna interior', coleccion:'dimension', img:'assets/art-dimension-6.jpg', img2:'assets/print-dimension-6.jpg', tamano:'140 × 100 cm', size_id:44, edicion:100, restantes:100, precio:189, pago:'https://buy.stripe.com/fZu00d7Du77Cb8ufCv5os0Z', gran:false },
  { id:'dimension-7', nombre:'Fronda', coleccion:'dimension', img:'assets/art-dimension-7.jpg', img2:'assets/print-dimension-7.jpg', tamano:'55 × 40 cm', size_id:39, edicion:100, restantes:100, precio:89, pago:'https://buy.stripe.com/cNi5kxe1S77Cccycqj5os10', gran:false },
  { id:'dimension-8', nombre:'Marea de papel', coleccion:'dimension', img:'assets/art-dimension-8.jpg', img2:'assets/print-dimension-8.jpg', tamano:'150 × 75 cm', size_id:8, edicion:100, restantes:100, precio:199, pago:'https://buy.stripe.com/7sY28lf5W63y2BYfCv5os11', gran:false },
  { id:'dimension-9', nombre:'Umbral', coleccion:'dimension', img:'assets/art-dimension-9.jpg', img2:'assets/print-dimension-9.jpg', tamano:'60 × 90 cm', size_id:19, edicion:100, restantes:100, precio:139, pago:'https://buy.stripe.com/6oUeV7f5W3Vqccy61V5os12', gran:false },
  { id:'dimension-10', nombre:'Vertedera', coleccion:'dimension', img:'assets/art-dimension-10.jpg', img2:'assets/print-dimension-10.jpg', tamano:'165 × 120 cm', size_id:30, edicion:100, restantes:100, precio:199, pago:'https://buy.stripe.com/dRm3cp4ri4Zu6Se2PJ5os13', gran:false },
];

const euros = n => n.toLocaleString('es-ES') + ' €';

function cardHTML(p){
  const c = COLECCIONES[p.coleccion];
  const limitada = p.coleccion === 'textures';
  const quedan = limitada ? `<span class="card-quedan">Quedan ${p.restantes} de ${p.edicion} · numerada</span>` : `<span class="card-quedan">${p.tamano}</span>`;
  return `<article class="card" data-id="${p.id}" data-col="${p.coleccion}" data-gran="${p.gran}">
    <a class="card-media" href="${RAIZ}coleccion/${p.coleccion}/" aria-label="${p.nombre}">
      ${limitada ? '<span class="flag flag-vino">Edición de 20</span>' : ''}
      ${p.gran ? '<span class="flag">Gran formato</span>' : ''}
      <img src="${RAIZ}${p.img}" alt="Lienzo ${p.nombre}" loading="lazy">
    </a>
    <div class="card-info">
      <span class="card-col">${c.nombre}</span>
      <h3>${p.nombre}</h3>
      ${quedan}
      <div class="card-foot"><span class="card-precio">${euros(p.precio)}<small>IVA incluido</small></span>
      <button class="btn-mini" data-comprar="${p.id}">Comprar</button></div>
    </div></article>`;
}

/* --- Carrito --- */
let cart = [];
try{ cart = JSON.parse(localStorage.getItem('gazeta_cart') || '[]'); }catch(e){ cart = []; }
function saveCart(){ localStorage.setItem('gazeta_cart', JSON.stringify(cart)); renderCart(); }
function renderCart(){
  const body = document.getElementById('cartBody'), count = document.getElementById('cartCount'), totalEl = document.getElementById('cartTotal');
  if(!body) return;
  count.textContent = cart.length;
  if(cart.length === 0){
    body.innerHTML = '<p class="cesta-vacia">Tu cesta está vacía.<br>Explora las colecciones y encuentra tu cuadro.</p>';
    totalEl.textContent = '0 €'; return;
  }
  let total = 0;
  body.innerHTML = cart.map((id,i)=>{
    const p = productos.find(x=>x.id===id); total += p.precio;
    return `<div class="cart-item"><img src="${RAIZ}${p.img}" alt="${p.nombre}"><div><b>${p.nombre}</b><small>${COLECCIONES[p.coleccion].nombre} · ${p.tamano}</small><div class="cart-acciones"><button class="pay" data-pay="${p.id}">Pagar</button><button class="remove" data-remove="${i}">Quitar</button></div></div><b>${euros(p.precio)}</b></div>`;
  }).join('');
  totalEl.textContent = euros(total);
  body.querySelectorAll('[data-remove]').forEach(b=>b.addEventListener('click',()=>{ cart.splice(Number(b.dataset.remove),1); saveCart(); }));
  body.querySelectorAll('[data-pay]').forEach(b=>b.addEventListener('click',()=>{ const p=productos.find(x=>x.id===b.dataset.pay); if(p&&p.pago) window.open(p.pago,'_blank'); }));
}
function openCart(){ document.getElementById('cartDrawer')?.classList.add('open'); document.body.classList.add('cart-open'); setOverlay(true); }
function closeCart(){ document.getElementById('cartDrawer')?.classList.remove('open'); document.body.classList.remove('cart-open'); setOverlay(false); }
function setOverlay(on){ document.getElementById('overlay')?.classList.toggle('visible', on); }
function showToast(msg){ const t=document.getElementById('toast'); if(!t) return; t.textContent=msg; t.classList.add('ver'); clearTimeout(t._x); t._x=setTimeout(()=>t.classList.remove('ver'),3400); }

/* --- Grid con filtros --- */
function pintarGrid(sel, filtro){
  const grid = document.querySelector(sel); if(!grid) return;
  let lista = productos;
  if(filtro === 'gran') lista = productos.filter(p=>p.gran);
  else if(filtro && filtro !== 'todas') lista = productos.filter(p=>p.coleccion===filtro);
  grid.innerHTML = lista.map(cardHTML).join('');
}
function initFiltros(){
  const caja = document.querySelector('.filtros'); if(!caja) return;
  caja.addEventListener('click', e=>{
    const btn = e.target.closest('.filtro'); if(!btn) return;
    caja.querySelectorAll('.filtro').forEach(b=>b.classList.remove('activo'));
    btn.classList.add('activo');
    pintarGrid('#gridTienda', btn.dataset.filtro);
  });
}

function initShop(){
  document.addEventListener('click', e=>{
    const btn = e.target.closest('[data-comprar]'); if(!btn) return;
    const p = productos.find(x=>x.id===btn.dataset.comprar);
    if(!p || !p.pago){ showToast('El pago no está disponible ahora mismo. Escríbenos y reservamos tu ejemplar.'); return; }
    if(!cart.includes(p.id)){ cart.push(p.id); saveCart(); }
    showToast('«'+p.nombre+'» te espera en la cesta. Te abrimos el pago seguro.');
    window.open(p.pago,'_blank');
  });
  pintarGrid('#gridTienda'); pintarGrid('#gridTexturas','textures');
  document.querySelectorAll('[data-grid-col]').forEach(g=>pintarGrid('#'+g.id, g.dataset.gridCol));
  /* grid de favoritos (home) */
  const gf=document.querySelector('[data-fav]');
  if(gf){ gf.innerHTML=gf.dataset.fav.split(',').map(id=>{const p=productos.find(x=>x.id===id);return p?cardHTML(p):''}).join(''); }
  initFiltros();
  renderCart();
  document.getElementById('cartBtn')?.addEventListener('click', openCart);
  document.getElementById('closeCart')?.addEventListener('click', closeCart);
  document.getElementById('overlay')?.addEventListener('click', ()=>{ closeCart(); cerrarMenu(); });
  document.addEventListener('keydown', e=>{ if(e.key==='Escape'){ closeCart(); cerrarMenu(); } });
  document.getElementById('checkoutBtn')?.addEventListener('click', ()=>{
    if(cart.length===0){ showToast('La cesta está vacía. Cuando elijas un cuadro, lo verás aquí.'); return; }
    const p = productos.find(x=>x.id===cart[0]);
    window.open(p.pago,'_blank');
  });
  /* menú móvil */
  const btn=document.getElementById('menuBtn');
  btn?.addEventListener('click', ()=>{ document.getElementById('mainNav').classList.toggle('abierto'); document.body.classList.toggle('nav-open'); });
  document.getElementById('navClose')?.addEventListener('click', cerrarMenu);
  document.querySelectorAll('#mainNav a').forEach(a=>a.addEventListener('click', cerrarMenu));
  /* newsletter → Google Forms (invisible para el cliente) */
  document.querySelectorAll('[data-newsletter]').forEach(f=>f.addEventListener('submit', e=>{
    e.preventDefault();
    const correo=f.querySelector('input[type="email"]').value.trim();
    if(!correo || !correo.includes('@')){ showToast('Escribe tu correo para apuntarte.'); return; }
    fetch('https://docs.google.com/forms/d/e/1FAIpQLSdYpdeMBAL06OEbn3x1LTMKoV-LYZhwScxYuMDloV8ybgcWwA/formResponse',
      {method:'POST',mode:'no-cors',headers:{'Content-Type':'application/x-www-form-urlencoded'},
       body:new URLSearchParams({'entry.675051248':correo})}).catch(()=>{});
    showToast('Hecho. Te avisamos de cada nueva colección antes que a nadie.');
    f.reset();
  }));
}
function cerrarMenu(){ document.getElementById('mainNav')?.classList.remove('abierto'); document.body.classList.remove('nav-open'); }

/* Fallback temporal: sustituye imágenes aún no generadas por un bloque sobrio */
function imgFallback(el){
  const div = document.createElement('div');
  div.className = 'img-fallback' + (el.dataset.fb === 'iniciales' ? ' iniciales' : '');
  const datos = el.dataset.fbTexto || '';
  div.innerHTML = datos ? `<span>${datos}</span>` : '';
  el.replaceWith(div);
}
