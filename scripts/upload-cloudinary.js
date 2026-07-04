// Sobe imagens de produção para o Cloudinary preservando a estrutura de
// pastas/nomes do produtos.json como public_id (facilita mapear de volta).
//
// Uso:
//   node scripts/upload-cloudinary.js --amostra=25,1,14,60,66   (só estes ids)
//   node scripts/upload-cloudinary.js --todos                  (os 1.095 arquivos)
//   node scripts/upload-cloudinary.js --colisoes                (só arquivos com
//     nome-base duplicado em mais de uma extensão na mesma pasta — ver paraPublicId)
//
// Lê credenciais de .env.local (nunca hardcoded). Não apaga nem migra nada
// além de subir para o Cloudinary; disco local (produção 2048 e original)
// permanece intocado.

const fs = require('fs');
const path = require('path');
const { v2: cloudinary } = require('cloudinary');

// carrega .env.local manualmente (sem depender de next/dotenv fora do app)
for (const linha of fs.readFileSync(path.join(__dirname, '..', '.env.local'), 'utf-8').split('\n')) {
  const m = linha.match(/^([A-Z_]+)=(.*)$/);
  if (m) process.env[m[1]] = m[2].trim();
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const ORIGEM = 'C:\\Imagens\\Catalogo_producao_2048';
const PREFIXO_PASTA = 'casa-sinelli'; // pasta raiz no Cloudinary
const CONCORRENCIA = 4;

const produtos = require('../src/data/produtos.json');

function todasAsRefs() {
  const refs = new Set();
  for (const p of produtos) {
    const listas = [p.capa ? [p.capa] : [], p.imagens ?? [], p.todasImagens ?? [], ...(p.variacoes ?? []).map((v) => v.imagens ?? [])];
    for (const l of listas) for (const img of l) refs.add(img);
  }
  return refs;
}

function refsDosProdutos(ids) {
  const alvo = ids ? new Set(ids) : null;
  const lista = alvo ? produtos.filter((p) => alvo.has(p.id)) : produtos;
  const refs = new Set();
  for (const p of lista) {
    const listas = [p.capa ? [p.capa] : [], p.imagens ?? [], p.todasImagens ?? [], ...(p.variacoes ?? []).map((v) => v.imagens ?? [])];
    for (const l of listas) for (const img of l) refs.add(img);
  }
  return [...refs];
}

// Arquivos cujo nome-base (sem extensão) se repete na mesma pasta em outro
// formato — ex.: "Roupeiro Dubai - Ipe.jpg" e "Roupeiro Dubai - Ipe.png".
// Sem a extensão no public_id esses dois colidiriam no Cloudinary.
function refsColididas() {
  const refs = [...todasAsRefs()];
  const semExt = (p) => p.replace(/\.[^./]+$/, '');
  const grupos = new Map();
  for (const r of refs) {
    const base = semExt(r);
    grupos.set(base, [...(grupos.get(base) ?? []), r]);
  }
  return [...grupos.values()].filter((lista) => lista.length > 1).flat();
}

// caminho relativo tipo "/alpoim/sofa/Sofá Agar/2,30M/Azul/foto.jpeg"
// -> public_id "casa-sinelli/alpoim/sofa/Sofá Agar/2,30M/Azul/foto__jpeg"
//
// A extensão vai no public_id (separada por "__", não como sufixo real de
// extensão) porque o Cloudinary identifica o recurso só pelo public_id —
// dois arquivos-fonte com o mesmo nome-base e extensões diferentes (comum
// nos assets da marca lanza: .jpg ambientada + .png recorte de estúdio)
// colidiriam no mesmo public_id e um sobrescreveria o outro (overwrite:true).
function paraPublicId(relPath) {
  const ext = relPath.split('.').pop().toLowerCase();
  const semExt = relPath.replace(/\.[^./]+$/, '');
  return `${PREFIXO_PASTA}${semExt}__${ext}`.replace(/\\/g, '/');
}

async function uploadUm(relPath) {
  const arquivoLocal = path.join(ORIGEM, relPath);
  const publicId = paraPublicId(relPath);
  const res = await cloudinary.uploader.upload(arquivoLocal, {
    public_id: publicId,
    overwrite: true,
    resource_type: 'image',
  });
  return res.secure_url;
}

(async () => {
  const args = process.argv.slice(2);
  const amostraArg = args.find((a) => a.startsWith('--amostra='));
  const ids = amostraArg ? amostraArg.split('=')[1].split(',') : null;
  const modoColisoes = args.includes('--colisoes');

  if (!ids && !args.includes('--todos') && !modoColisoes) {
    console.error('Uso: --amostra=25,1,14,60,66  ou  --todos  ou  --colisoes');
    process.exit(1);
  }

  const refs = modoColisoes ? refsColididas() : refsDosProdutos(ids);
  const rotulo = modoColisoes ? 'Correção de colisões' : ids ? `Amostra (${ids.length} produtos)` : 'TODOS os produtos';
  console.log(`${rotulo}: ${refs.length} arquivos a enviar.`);

  let ok = 0, falhas = [];
  const fila = [...refs];
  const mapa = {}; // relPath -> secure_url

  const workers = Array.from({ length: CONCORRENCIA }, async () => {
    while (fila.length) {
      const rel = fila.shift();
      try {
        const url = await uploadUm(rel);
        mapa[rel] = url;
        ok++;
        if (ok % 20 === 0) console.log(`  ${ok}/${refs.length}…`);
      } catch (e) {
        falhas.push({ rel, erro: e.message });
      }
    }
  });
  await Promise.all(workers);

  const destino = path.join(
    __dirname,
    modoColisoes ? 'mapa-cloudinary-correcao.json' : ids ? 'mapa-cloudinary-amostra.json' : 'mapa-cloudinary.json'
  );
  fs.writeFileSync(destino, JSON.stringify(mapa, null, 2), 'utf-8');

  console.log(`\nOK: ${ok} | falhas: ${falhas.length}`);
  falhas.slice(0, 10).forEach((f) => console.log('  ERRO', f.rel, '->', f.erro));
  console.log(`Mapa salvo em: ${destino}`);
})();
