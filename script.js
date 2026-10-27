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
  { id:'vino-primero', nombre:'Corriente', coleccion:'textures', img:'assets/obra-vino.jpg', img2:'assets/print-vino.jpg', tamano:'100 × 150 cm', size_id:22, edicion:20, restantes:14, precio:890,  pago:'https://buy.stripe.com/28EbIVga0bnS2BY3TN5os21', gran:true },
  { id:'trazo-unico', nombre:'Pulso', coleccion:'textures', img:'assets/obra-trazo.jpg', img2:'assets/print-trazo.jpg', tamano:'100 × 140 cm', size_id:44, edicion:20, restantes:16, precio:420,  pago:'https://buy.stripe.com/4gM7sF9LCfE890m2PJ5os01', gran:true },
  { id:'linea-y-vino', nombre:'Perfil en reposo', coleccion:'textures', img:'assets/obra-linea.jpg', img2:'assets/print-linea.jpg', tamano:'60 × 90 cm', size_id:19, edicion:20, restantes:18, precio:240,  pago:'https://buy.stripe.com/dRmcMZ2ja63ydgC9e75os02', gran:false },
  { id:'arena-calma', nombre:'Mediodía', coleccion:'textures', img:'assets/obra-arena.jpg', img2:'assets/print-arena.jpg', tamano:'120 × 165 cm', size_id:30, edicion:20, restantes:12, precio:560,  pago:'https://buy.stripe.com/cNi00d0b2crW7Wieyr5os03', gran:true },
  { id:'horizonte-vino', nombre:'Última luz', coleccion:'textures', img:'assets/obra-horizonte.jpg', img2:'assets/print-horizonte.jpg', tamano:'150 × 100 cm', size_id:22, edicion:20, restantes:9,  precio:1150, pago:'https://buy.stripe.com/00wcMZbTK0Jeb8u9e75os04', gran:true },
  { id:'geometria-callada', nombre:'Equilibrio', coleccion:'textures', img:'assets/obra-geometria.jpg', img2:'assets/print-geometria.jpg', tamano:'40 × 55 cm', size_id:39, edicion:20, restantes:15, precio:145,  pago:'https://buy.stripe.com/5kQcMZcXO63y6Se4XR5os05', gran:false },
  { id:'textures-7', nombre:'Vena', coleccion:'textures', img:'assets/art-textures-7.jpg', img2:'assets/print-textures-7.jpg', tamano:'100 × 150 cm', size_id:22, edicion:20, restantes:20, precio:289, pago:'https://buy.stripe.com/aFa6oB2ja63yccyeyr5os1Y', gran:false },
  { id:'textures-8', nombre:'Ceniza', coleccion:'textures', img:'assets/art-textures-8.jpg', img2:'assets/print-textures-8.jpg', tamano:'140 × 100 cm', size_id:44, edicion:20, restantes:20, precio:259, pago:'https://buy.stripe.com/9B6eV7f5W77C5Oabmf5os1Z', gran:false },
  { id:'textures-9', nombre:'Atardecer en yeso', coleccion:'textures', img:'assets/art-textures-9.jpg', img2:'assets/print-textures-9.jpg', tamano:'165 × 120 cm', size_id:30, edicion:20, restantes:20, precio:299, pago:'https://buy.stripe.com/7sYfZbaPG9fK2BY4XR5os20', gran:false },
  { id:'textures-10', nombre:'Piel', coleccion:'textures', img:'assets/art-textures-10.jpg', img2:'assets/print-textures-10.jpg', tamano:'60 × 90 cm', size_id:19, edicion:20, restantes:20, precio:189, pago:'https://buy.stripe.com/dRmdR39LC4Zuccy9e75os1X', gran:false },
  /* ───── ECLECTIC ───── */
  { id:'eclectic-1', nombre:'Marea urbana', coleccion:'eclectic', img:'assets/art-eclectic-1.jpg', img2:'assets/print-eclectic-1.jpg', tamano:'100 × 150 cm', size_id:22, edicion:100, restantes:100, precio:289, pago:'https://buy.stripe.com/5kQ00dcXOfE87Wi9e75os06', gran:true },
  { id:'eclectic-2', nombre:'Terraza interior', coleccion:'eclectic', img:'assets/art-eclectic-2.jpg', img2:'assets/print-eclectic-2.jpg', tamano:'70 × 100 cm', size_id:44, edicion:100, restantes:100, precio:169, pago:'https://buy.stripe.com/9B64gt1f68bG90m1LF5os07', gran:false },
  { id:'eclectic-3', nombre:'Alfama', coleccion:'eclectic', img:'assets/art-eclectic-3.jpg', img2:'assets/print-eclectic-3.jpg', tamano:'70 × 100 cm', size_id:44, edicion:100, restantes:100, precio:159, pago:'https://buy.stripe.com/6oU3cpaPG4Zu90mbmf5os08', gran:false },
  { id:'eclectic-4', nombre:'Azotea', coleccion:'eclectic', img:'assets/art-eclectic-4.jpg', img2:'assets/print-eclectic-4.jpg', tamano:'100 × 150 cm', size_id:22, edicion:100, restantes:100, precio:199, pago:'https://buy.stripe.com/14AbIV5vmfE84K6bmf5os1r', gran:true },
  { id:'eclectic-5', nombre:'Bodegón eléctrico', coleccion:'eclectic', img:'assets/art-eclectic-5.jpg', img2:'assets/print-eclectic-5.jpg', tamano:'110 × 140 cm', size_id:44, edicion:100, restantes:100, precio:179, pago:'https://buy.stripe.com/fZu14h0b23VqekGdun5os1s', gran:true },
  { id:'eclectic-6', nombre:'Mercado de flores', coleccion:'eclectic', img:'assets/art-eclectic-6.jpg', img2:'assets/print-eclectic-6.jpg', tamano:'140 × 100 cm', size_id:44, edicion:100, restantes:100, precio:179, pago:'https://buy.stripe.com/6oU5kx4ridw0ccy75Z5os1t', gran:false },
  { id:'eclectic-7', nombre:'La cocina roja', coleccion:'eclectic', img:'assets/art-eclectic-7.jpg', img2:'assets/print-eclectic-7.jpg', tamano:'50 × 40 cm', size_id:32, edicion:100, restantes:100, precio:119, pago:'https://buy.stripe.com/9B67sFcXO63ya4qbmf5os1u', gran:false },
  { id:'eclectic-8', nombre:'Danza de sombrillas', coleccion:'eclectic', img:'assets/art-eclectic-8.jpg', img2:'assets/print-eclectic-8.jpg', tamano:'100 × 150 cm', size_id:22, edicion:100, restantes:100, precio:199, pago:'https://buy.stripe.com/cNi9ANaPG1Ni5Oabmf5os1v', gran:false },
  { id:'eclectic-9', nombre:'Jardín nocturno', coleccion:'eclectic', img:'assets/art-eclectic-9.jpg', img2:'assets/print-eclectic-9.jpg', tamano:'55 × 40 cm', size_id:39, edicion:100, restantes:100, precio:89, pago:'https://buy.stripe.com/4gMbIV5vm0JefoKcqj5os1w', gran:false },
  { id:'eclectic-10', nombre:'El coleccionista', coleccion:'eclectic', img:'assets/art-eclectic-10.jpg', img2:'assets/print-eclectic-10.jpg', tamano:'150 × 75 cm', size_id:8, edicion:100, restantes:100, precio:229, pago:'https://buy.stripe.com/4gM9AN4rieA4a4q4XR5os1q', gran:false },
  /* ───── NORDIC ───── */
  { id:'nordic-1', nombre:'Silencio claro', coleccion:'nordic', img:'assets/art-nordic-1.jpg', img2:'assets/print-nordic-1.jpg', tamano:'70 × 100 cm', size_id:44, edicion:100, restantes:100, precio:159, pago:'https://buy.stripe.com/6oU3cp1f6fE86Se3TN5os09', gran:false },
  { id:'nordic-2', nombre:'Fiordo', coleccion:'nordic', img:'assets/art-nordic-2.jpg', img2:'assets/print-nordic-2.jpg', tamano:'70 × 100 cm', size_id:44, edicion:100, restantes:100, precio:149, pago:'https://buy.stripe.com/9B6cMZbTK77Cb8u8a35os0a', gran:false },
  { id:'nordic-3', nombre:'Nieve de abril', coleccion:'nordic', img:'assets/art-nordic-3.jpg', img2:'assets/print-nordic-3.jpg', tamano:'40 × 50 cm', size_id:32, edicion:100, restantes:100, precio:89, pago:'https://buy.stripe.com/8x2dR39LCdw05Oabmf5os0b', gran:false },
  { id:'nordic-4', nombre:'Lago quieto', coleccion:'nordic', img:'assets/art-nordic-4.jpg', img2:'assets/print-nordic-4.jpg', tamano:'140 × 100 cm', size_id:44, edicion:100, restantes:100, precio:139, pago:'https://buy.stripe.com/8x29AN5vm3Vq7Wi75Z5os1H', gran:true },
  { id:'nordic-5', nombre:'Bosque blanco', coleccion:'nordic', img:'assets/art-nordic-5.jpg', img2:'assets/print-nordic-5.jpg', tamano:'100 × 150 cm', size_id:22, edicion:100, restantes:100, precio:149, pago:'https://buy.stripe.com/fZu00d3ne63y3G20HB5os1I', gran:true },
  { id:'nordic-6', nombre:'Marea baja', coleccion:'nordic', img:'assets/art-nordic-6.jpg', img2:'assets/print-nordic-6.jpg', tamano:'140 × 100 cm', size_id:44, edicion:100, restantes:100, precio:139, pago:'https://buy.stripe.com/6oU9AN7DucrWfoK2PJ5os1J', gran:false },
  { id:'nordic-7', nombre:'Hielo', coleccion:'nordic', img:'assets/art-nordic-7.jpg', img2:'assets/print-nordic-7.jpg', tamano:'50 × 40 cm', size_id:32, edicion:100, restantes:100, precio:79, pago:'https://buy.stripe.com/cNiaERf5Wdw01xUdun5os1K', gran:false },
  { id:'nordic-8', nombre:'Campo de centeno', coleccion:'nordic', img:'assets/art-nordic-8.jpg', img2:'assets/print-nordic-8.jpg', tamano:'100 × 150 cm', size_id:22, edicion:100, restantes:100, precio:149, pago:'https://buy.stripe.com/cNi14hbTK9fK0tQfCv5os1L', gran:false },
  { id:'nordic-9', nombre:'Primer tren', coleccion:'nordic', img:'assets/art-nordic-9.jpg', img2:'assets/print-nordic-9.jpg', tamano:'55 × 40 cm', size_id:39, edicion:100, restantes:100, precio:79, pago:'https://buy.stripe.com/cNifZbe1SfE81xU8a35os1M', gran:false },
  { id:'nordic-10', nombre:'Ventana al fiordo', coleccion:'nordic', img:'assets/art-nordic-10.jpg', img2:'assets/print-nordic-10.jpg', tamano:'150 × 75 cm', size_id:8, edicion:100, restantes:100, precio:199, pago:'https://buy.stripe.com/dRm3cp9LCdw07Wiaib5os1G', gran:false },
  /* ───── BAUHAUS ───── */
  { id:'bauhaus-1', nombre:'Composición 7', coleccion:'bauhaus', img:'assets/art-bauhaus-1.jpg', img2:'assets/print-bauhaus-1.jpg', tamano:'70 × 100 cm', size_id:44, edicion:100, restantes:100, precio:159, pago:'https://buy.stripe.com/4gMbIVcXO3VqdgCdun5os0c', gran:false },
  { id:'bauhaus-2', nombre:'Eje y círculo', coleccion:'bauhaus', img:'assets/art-bauhaus-2.jpg', img2:'assets/print-bauhaus-2.jpg', tamano:'100 × 150 cm', size_id:22, edicion:100, restantes:100, precio:279, pago:'https://buy.stripe.com/fZueV72jafE8b8u4XR5os0d', gran:true },
  { id:'bauhaus-3', nombre:'Tríada', coleccion:'bauhaus', img:'assets/art-bauhaus-3.jpg', img2:'assets/print-bauhaus-3.jpg', tamano:'75 × 150 cm', size_id:8, edicion:100, restantes:100, precio:249, pago:'https://buy.stripe.com/cNi00df5WfE87Wi0HB5os0e', gran:true },
  { id:'bauhaus-4', nombre:'Progresión', coleccion:'bauhaus', img:'assets/art-bauhaus-4.jpg', img2:'assets/print-bauhaus-4.jpg', tamano:'100 × 200 cm', size_id:8, edicion:100, restantes:100, precio:229, pago:'https://buy.stripe.com/aFa28l5vm8bG5Oa61V5os1a', gran:true },
  { id:'bauhaus-5', nombre:'Arco primario', coleccion:'bauhaus', img:'assets/art-bauhaus-5.jpg', img2:'assets/print-bauhaus-5.jpg', tamano:'110 × 140 cm', size_id:44, edicion:100, restantes:100, precio:189, pago:'https://buy.stripe.com/fZufZb6zq1Nib8uaib5os1b', gran:true },
  { id:'bauhaus-6', nombre:'Contracomposición', coleccion:'bauhaus', img:'assets/art-bauhaus-6.jpg', img2:'assets/print-bauhaus-6.jpg', tamano:'100 × 150 cm', size_id:22, edicion:100, restantes:100, precio:189, pago:'https://buy.stripe.com/9B6eV7e1SajO7Wicqj5os1c', gran:false },
  { id:'bauhaus-7', nombre:'Tres mástiles', coleccion:'bauhaus', img:'assets/art-bauhaus-7.jpg', img2:'assets/print-bauhaus-7.jpg', tamano:'140 × 100 cm', size_id:44, edicion:100, restantes:100, precio:169, pago:'https://buy.stripe.com/4gM28l4ri4Zu0tQgGz5os1d', gran:false },
  { id:'bauhaus-8', nombre:'Círculo roto', coleccion:'bauhaus', img:'assets/art-bauhaus-8.jpg', img2:'assets/print-bauhaus-8.jpg', tamano:'50 × 40 cm', size_id:32, edicion:100, restantes:100, precio:99, pago:'https://buy.stripe.com/7sYbIV5vm63ydgCbmf5os1e', gran:false },
  { id:'bauhaus-9', nombre:'Escalera cromática', coleccion:'bauhaus', img:'assets/art-bauhaus-9.jpg', img2:'assets/print-bauhaus-9.jpg', tamano:'55 × 40 cm', size_id:39, edicion:100, restantes:100, precio:89, pago:'https://buy.stripe.com/7sY14h9LC3Vqb8uaib5os1f', gran:false },
  { id:'bauhaus-10', nombre:'Metropolitano', coleccion:'bauhaus', img:'assets/art-bauhaus-10.jpg', img2:'assets/print-bauhaus-10.jpg', tamano:'150 × 75 cm', size_id:8, edicion:100, restantes:100, precio:199, pago:'https://buy.stripe.com/00w5kxcXO9fK6Se61V5os19', gran:false },
  /* ───── ETHEREUM ───── */
  { id:'ethereum-1', nombre:'Nodo', coleccion:'ethereum', img:'assets/art-ethereum-1.jpg', img2:'assets/print-ethereum-1.jpg', tamano:'100 × 150 cm', size_id:22, edicion:100, restantes:100, precio:289, pago:'https://buy.stripe.com/28EfZbe1S3Vq5Oaaib5os0f', gran:true },
  { id:'ethereum-2', nombre:'Vórtice', coleccion:'ethereum', img:'assets/art-ethereum-2.jpg', img2:'assets/print-ethereum-2.jpg', tamano:'100 × 150 cm', size_id:22, edicion:100, restantes:100, precio:289, pago:'https://buy.stripe.com/28EfZb2jagIc4K60HB5os1y', gran:true },
  { id:'ethereum-3', nombre:'Nébula', coleccion:'ethereum', img:'assets/art-ethereum-3.jpg', img2:'assets/print-ethereum-3.jpg', tamano:'140 × 100 cm', size_id:44, edicion:100, restantes:100, precio:269, pago:'https://buy.stripe.com/7sYcMZ5vmeA4b8ucqj5os1z', gran:true },
  { id:'ethereum-4', nombre:'Fractura', coleccion:'ethereum', img:'assets/art-ethereum-4.jpg', img2:'assets/print-ethereum-4.jpg', tamano:'165 × 120 cm', size_id:30, edicion:100, restantes:100, precio:249, pago:'https://buy.stripe.com/6oU4gt7DucrW1xUbmf5os1A', gran:true },
  { id:'ethereum-5', nombre:'Espejo líquido', coleccion:'ethereum', img:'assets/art-ethereum-5.jpg', img2:'assets/print-ethereum-5.jpg', tamano:'100 × 150 cm', size_id:22, edicion:100, restantes:100, precio:289, pago:'https://buy.stripe.com/eVqeV71f6ajO7WigGz5os1B', gran:false },
  { id:'ethereum-6', nombre:'Señal', coleccion:'ethereum', img:'assets/art-ethereum-6.jpg', img2:'assets/print-ethereum-6.jpg', tamano:'50 × 40 cm', size_id:32, edicion:100, restantes:100, precio:129, pago:'https://buy.stripe.com/bJe5kx9LCgIcccyfCv5os1C', gran:false },
  { id:'ethereum-7', nombre:'Constelación', coleccion:'ethereum', img:'assets/art-ethereum-7.jpg', img2:'assets/print-ethereum-7.jpg', tamano:'140 × 100 cm', size_id:44, edicion:100, restantes:100, precio:259, pago:'https://buy.stripe.com/28E9AN7DufE82BY8a35os1D', gran:false },
  { id:'ethereum-8', nombre:'Abismo dorado', coleccion:'ethereum', img:'assets/art-ethereum-8.jpg', img2:'assets/print-ethereum-8.jpg', tamano:'150 × 75 cm', size_id:8, edicion:100, restantes:100, precio:199, pago:'https://buy.stripe.com/7sY6oBga0ajO6Sebmf5os1E', gran:false },
  { id:'ethereum-9', nombre:'Latencia', coleccion:'ethereum', img:'assets/art-ethereum-9.jpg', img2:'assets/print-ethereum-9.jpg', tamano:'55 × 40 cm', size_id:39, edicion:100, restantes:100, precio:119, pago:'https://buy.stripe.com/9B628lf5WbnSfoK3TN5os1F', gran:false },
  { id:'ethereum-10', nombre:'Núcleo', coleccion:'ethereum', img:'assets/art-ethereum-10.jpg', img2:'assets/print-ethereum-10.jpg', tamano:'165 × 120 cm', size_id:30, edicion:100, restantes:100, precio:289, pago:'https://buy.stripe.com/fZu9AN0b21Nia4q3TN5os1x', gran:false },
  { id:'popart-1', nombre:'Rostro pop', coleccion:'popart', img:'assets/art-popart-1.jpg', img2:'assets/print-popart-1.jpg', tamano:'100 × 140 cm', size_id:22, edicion:100, restantes:100, precio:149, pago:'https://buy.stripe.com/9B68wJaPGgIc5Oa3TN5os1N', gran:false },
  { id:'popart-2', nombre:'Plátano explosivo', coleccion:'popart', img:'assets/art-popart-2.jpg', img2:'assets/print-popart-2.jpg', tamano:'100 × 150 cm', size_id:22, edicion:100, restantes:100, precio:159, pago:'https://buy.stripe.com/14AbIVaPG1Nia4qeyr5os1P', gran:true },
  { id:'popart-3', nombre:'Big bang', coleccion:'popart', img:'assets/art-popart-3.jpg', img2:'assets/print-popart-3.jpg', tamano:'110 × 140 cm', size_id:44, edicion:100, restantes:100, precio:179, pago:'https://buy.stripe.com/5kQ3cp7Du77CekG8a35os1Q', gran:true },
  { id:'popart-4', nombre:'Chicle', coleccion:'popart', img:'assets/art-popart-4.jpg', img2:'assets/print-popart-4.jpg', tamano:'100 × 140 cm', size_id:22, edicion:100, restantes:100, precio:139, pago:'https://buy.stripe.com/5kQ3cpaPG77C4K6gGz5os1R', gran:true },
  { id:'popart-5', nombre:'Cóctel', coleccion:'popart', img:'assets/art-popart-5.jpg', img2:'assets/print-popart-5.jpg', tamano:'100 × 150 cm', size_id:22, edicion:100, restantes:100, precio:149, pago:'https://buy.stripe.com/7sYfZb0b29fK2BY9e75os1S', gran:false },
  { id:'popart-6', nombre:'Patatas fritas', coleccion:'popart', img:'assets/art-popart-6.jpg', img2:'assets/print-popart-6.jpg', tamano:'50 × 40 cm', size_id:32, edicion:100, restantes:100, precio:99, pago:'https://buy.stripe.com/dRm00d0b2ajOekGbmf5os1T', gran:false },
  { id:'popart-7', nombre:'La estrella', coleccion:'popart', img:'assets/art-popart-7.jpg', img2:'assets/print-popart-7.jpg', tamano:'140 × 100 cm', size_id:44, edicion:100, restantes:100, precio:169, pago:'https://buy.stripe.com/5kQ7sF8Hy8bG2BY3TN5os1U', gran:false },
  { id:'popart-8', nombre:'Burbujas', coleccion:'popart', img:'assets/art-popart-8.jpg', img2:'assets/print-popart-8.jpg', tamano:'55 × 40 cm', size_id:39, edicion:100, restantes:100, precio:89, pago:'https://buy.stripe.com/9B6cMZ4ri2RmgsO61V5os1V', gran:false },
  { id:'popart-9', nombre:'Casete', coleccion:'popart', img:'assets/art-popart-9.jpg', img2:'assets/print-popart-9.jpg', tamano:'150 × 75 cm', size_id:8, edicion:100, restantes:100, precio:199, pago:'https://buy.stripe.com/14A28l4ri3Vqa4q1LF5os1W', gran:false },
  { id:'popart-10', nombre:'Sirena', coleccion:'popart', img:'assets/art-popart-10.jpg', img2:'assets/print-popart-10.jpg', tamano:'165 × 120 cm', size_id:30, edicion:100, restantes:100, precio:189, pago:'https://buy.stripe.com/6oUcMZ4ri2Rm90m1LF5os1O', gran:false },
  { id:'dimension-1', nombre:'Estratos', coleccion:'dimension', img:'assets/art-dimension-1.jpg', img2:'assets/print-dimension-1.jpg', tamano:'100 × 150 cm', size_id:22, edicion:100, restantes:100, precio:169, pago:'https://buy.stripe.com/7sYdR34ri63y1xUfCv5os1g', gran:true },
  { id:'dimension-2', nombre:'Arcos flotantes', coleccion:'dimension', img:'assets/art-dimension-2.jpg', img2:'assets/print-dimension-2.jpg', tamano:'80 × 160 cm', size_id:44, edicion:100, restantes:100, precio:219, pago:'https://buy.stripe.com/4gMfZb0b28bG2BYaib5os1i', gran:true },
  { id:'dimension-3', nombre:'Ola tallada', coleccion:'dimension', img:'assets/art-dimension-3.jpg', img2:'assets/print-dimension-3.jpg', tamano:'110 × 140 cm', size_id:30, edicion:100, restantes:100, precio:189, pago:'https://buy.stripe.com/3cI14h8HygIc5Oa3TN5os1j', gran:true },
  { id:'dimension-4', nombre:'Estratos II', coleccion:'dimension', img:'assets/art-dimension-4.jpg', img2:'assets/print-dimension-4.jpg', tamano:'100 × 150 cm', size_id:22, edicion:100, restantes:100, precio:169, pago:'https://buy.stripe.com/cNi6oB2jagIca4q61V5os1k', gran:false },
  { id:'dimension-5', nombre:'Plegado', coleccion:'dimension', img:'assets/art-dimension-5.jpg', img2:'assets/print-dimension-5.jpg', tamano:'50 × 40 cm', size_id:32, edicion:100, restantes:100, precio:99, pago:'https://buy.stripe.com/7sYfZbbTKajOgsO61V5os1l', gran:false },
  { id:'dimension-6', nombre:'Duna interior', coleccion:'dimension', img:'assets/art-dimension-6.jpg', img2:'assets/print-dimension-6.jpg', tamano:'140 × 100 cm', size_id:44, edicion:100, restantes:100, precio:189, pago:'https://buy.stripe.com/9B67sF7Du1Ni90m61V5os1m', gran:false },
  { id:'dimension-7', nombre:'Fronda', coleccion:'dimension', img:'assets/art-dimension-7.jpg', img2:'assets/print-dimension-7.jpg', tamano:'55 × 40 cm', size_id:39, edicion:100, restantes:100, precio:89, pago:'https://buy.stripe.com/cNieV7cXOfE8ccyfCv5os1n', gran:false },
  { id:'dimension-8', nombre:'Marea de papel', coleccion:'dimension', img:'assets/art-dimension-8.jpg', img2:'assets/print-dimension-8.jpg', tamano:'150 × 75 cm', size_id:8, edicion:100, restantes:100, precio:199, pago:'https://buy.stripe.com/6oU5kx8Hy3Vq90mdun5os1o', gran:false },
  { id:'dimension-9', nombre:'Umbral', coleccion:'dimension', img:'assets/art-dimension-9.jpg', img2:'assets/print-dimension-9.jpg', tamano:'60 × 90 cm', size_id:19, edicion:100, restantes:100, precio:139, pago:'https://buy.stripe.com/8x23cp4ribnSb8u8a35os1p', gran:false },
  { id:'dimension-10', nombre:'Vertedera', coleccion:'dimension', img:'assets/art-dimension-10.jpg', img2:'assets/print-dimension-10.jpg', tamano:'165 × 120 cm', size_id:30, edicion:100, restantes:100, precio:199, pago:'https://buy.stripe.com/4gM4gt5vm8bG4K68a35os1h', gran:false },
];

const euros = n => n.toLocaleString('es-ES') + ' €';
/* envío asegurado por tamaño (céntimos) — mismo mapa que /api/checkout */
const RATE = { 32:800, 39:800, 19:3999, 44:4999, 22:4999, 30:4999, 8:4999 };

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
  const obrasEl = document.getElementById('cartObras'), envioEl = document.getElementById('cartEnvio');
  if(!body) return;
  count.textContent = cart.length;
  if(cart.length === 0){
    body.innerHTML = '<p class="cesta-vacia">Tu cesta está vacía.<br>Explora las colecciones y encuentra tu cuadro.</p>';
    totalEl.textContent = '0 €'; if(obrasEl) obrasEl.textContent='0 €'; if(envioEl) envioEl.textContent='— €'; return;
  }
  let total = 0, envio = 0;
  body.innerHTML = cart.map((id,i)=>{
    const p = productos.find(x=>x.id===id); if(!p) return '';
    total += p.precio; envio += (RATE[p.size_id] || 0);
    return `<div class="cart-item"><img src="${RAIZ}${p.img}" alt="${p.nombre}"><div><b>${p.nombre}</b><small>${COLECCIONES[p.coleccion].nombre} · ${p.tamano}</small><div class="cart-acciones"><button class="remove" data-remove="${i}">Quitar</button></div></div><b>${euros(p.precio)}</b></div>`;
  }).join('');
  totalEl.textContent = euros(total + envio / 100);
  if(obrasEl) obrasEl.textContent = euros(total);
  if(envioEl) envioEl.textContent = euros(envio / 100);
  const btn = document.getElementById('checkoutBtn');
  if(btn) btn.textContent = cart.length > 1 ? `Tramitar pago seguro · ${cart.length} obras` : 'Tramitar pago seguro';
  body.querySelectorAll('[data-remove]').forEach(b=>b.addEventListener('click',()=>{ cart.splice(Number(b.dataset.remove),1); saveCart(); }));
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
  /* al volver de Stripe (gracias?obra=Nombre) se retira la obra comprada de la cesta */
  if(location.pathname.replace(/\/$/,'').endsWith('/gracias')){
    const qs=new URLSearchParams(location.search);
    if(qs.get('pedido')){ if(cart.length){ cart=[]; saveCart(); } } /* pago multi-obra completado: vaciar cesta */
    const q=qs.get('obra');
    if(q){ const antes=cart.length; cart=cart.filter(id=>{const p=productos.find(x=>x.id===id); return !p || p.nombre!==q;}); if(cart.length<antes) saveCart(); }
  }
  document.addEventListener('click', e=>{
    const btn = e.target.closest('[data-comprar]'); if(!btn) return;
    const p = productos.find(x=>x.id===btn.dataset.comprar);
    if(!p || !p.pago){ showToast('El pago no está disponible ahora mismo. Escríbenos y reservamos tu ejemplar.'); return; }
    if(!cart.includes(p.id)){ cart.push(p.id); saveCart(); showToast('«'+p.nombre+'» añadida a tu cesta.'); }
    else { showToast('«'+p.nombre+'» ya está en tu cesta.'); }
    openCart();
  });
  document.querySelectorAll('.desplegable-btn').forEach(btn=>{
    btn.addEventListener('click', e=>{
      e.stopPropagation();
      const dd=btn.closest('.nav-desplegable');
      const abierto=dd.classList.contains('abierto');
      document.querySelectorAll('.nav-desplegable.abierto').forEach(x=>{x.classList.remove('abierto'); const b=x.querySelector('.desplegable-btn'); if(b) b.setAttribute('aria-expanded','false');});
      if(!abierto){ dd.classList.add('abierto'); btn.setAttribute('aria-expanded','true'); }
    });
  });
  document.addEventListener('click', e=>{
    if(!e.target.closest('.nav-desplegable')) document.querySelectorAll('.nav-desplegable.abierto').forEach(x=>{x.classList.remove('abierto'); const b=x.querySelector('.desplegable-btn'); if(b) b.setAttribute('aria-expanded','false');});
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
  document.getElementById('checkoutBtn')?.addEventListener('click', async ()=>{
    if(cart.length === 0){ showToast('La cesta está vacía. Cuando elijas un cuadro, lo verás aquí.'); return; }
    if(cart.length > 20){ showToast('Máximo 20 obras por pedido. Deja alguna en la cesta para el siguiente.'); return; }
    const btn = document.getElementById('checkoutBtn');
    btn.disabled = true; const txt = btn.textContent; btn.textContent = 'Abriendo pago seguro…';
    try{
      const r = await fetch(RAIZ + 'api/checkout', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ ids: cart }) });
      const d = await r.json();
      if(!d.url) throw new Error(d.error || 'sin url');
      location.href = d.url; /* un solo pago, un solo envío */
    }catch(e){
      showToast('No hemos podido abrir el pago. Reinténtalo en un minuto o escríbenos.');
      btn.disabled = false; btn.textContent = txt;
    }
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
