/**
 * merge-dados.js
 *
 * Enriquece src/data/produtos.json com metadados do _catalogo:
 *   - medidas (medidas_texto / medidas_rodape)
 *   - cores (lista estruturada)
 *   - descricao (ficha técnica)
 *
 * Matching: por sobreposição de caminho de imagem.
 * Cada entrada do _catalogo pode referenciar sub-pastas já contidas
 * num produto do JSON atual → agrega sem duplicar.
 */

const fs = require('fs');
const path = require('path');

const PATH_CATALOGO = 'C:\\Imagens\\Catalogo\\_catalogo\\dados\\produtos.json';
const PATH_ATUAL    = path.resolve(__dirname, '../src/data/produtos.json');
const CATALOGO_ROOT = 'C:/Imagens/Catalogo';

// ---------- helpers ----------

function norm(s) {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/\\/g, '/')
    .replace(/\/\//g, '/');
}

/** Extrai o caminho relativo de uma imagem do _catalogo (ex: /alpoim/sofa/...) */
function relFromCatalogoImg(imgPath) {
  const n = imgPath.replace(/\\/g, '/');
  const idx = n.toLowerCase().indexOf('/catalogo/');
  if (idx < 0) return null;
  return n.slice(idx + '/catalogo'.length); // mantém acento no original, norm é feito depois
}

// ---------- main ----------

const catAntigo = JSON.parse(fs.readFileSync(PATH_CATALOGO, 'utf8'));
const catAtual  = JSON.parse(fs.readFileSync(PATH_ATUAL,    'utf8'));

// Mapa: norm(caminho) → produto atual
const atualPorCaminho = new Map();
for (const p of catAtual) {
  atualPorCaminho.set(norm(p.caminho), p);
}

// Para cada entrada do _catalogo, tentamos encontrar o produto atual
// cujo caminho normalizado é um PREFIXO do caminho da imagem.
// Testamos todos os prefixos da mais longa para a mais curta para maximizar especificidade.

function encontrarProdutoAtual(imgs) {
  for (const img of imgs) {
    const rel = relFromCatalogoImg(img);
    if (!rel) continue;

    const normRel = norm(rel);
    const parts   = normRel.split('/').filter(Boolean);

    // Tenta do mais específico (profundo) para o mais geral
    for (let depth = parts.length - 1; depth >= 1; depth--) {
      const prefix = '/' + parts.slice(0, depth).join('/');
      if (atualPorCaminho.has(prefix)) {
        return atualPorCaminho.get(prefix);
      }
    }
  }
  return null;
}

// Agregar metadados por produto atual
// Map: id_produto → { medidas_txt: string[], cores: Set, descricoes: string[], rodapes: string[] }
const agregados = new Map();
for (const p of catAtual) {
  agregados.set(p.id, { medidas_txt: [], cores: new Set(), descricoes: [], rodapes: [] });
}

let matchCount  = 0;
let noMatch     = [];

for (const ao of catAntigo) {
  const imgs = ao.imagens || [];
  const prod = encontrarProdutoAtual(imgs);

  if (!prod) {
    noMatch.push(ao);
    continue;
  }

  matchCount++;
  const agg = agregados.get(prod.id);

  const mt = (ao.medidas_texto || '').trim();
  if (mt) agg.medidas_txt.push(mt);

  const mr = (ao.medidas_rodape || '').trim();
  if (mr) agg.rodapes.push(mr);

  for (const cor of (ao.cores || [])) {
    if (cor.trim()) agg.cores.add(cor.trim());
  }

  const desc = (ao.descricao || '').trim();
  if (desc) agg.descricoes.push(desc);
}

console.log(`Match: ${matchCount}/${catAntigo.length}  Sem match: ${noMatch.length}`);
if (noMatch.length) {
  console.log('Sem match:');
  for (const ao of noMatch) {
    console.log(`  id=${ao.id} "${ao.nome_exibicao}"  imgs[0]=${(ao.imagens||[])[0]?.slice(-50)}`);
  }
}

// Aplica enriquecimento no catAtual
let enriquecidos = 0;

for (const p of catAtual) {
  const agg = agregados.get(p.id);
  if (!agg) continue;

  // Medidas: se produto ainda não tem medidas, usa a mais longa do _catalogo
  if (!p.medidas && agg.medidas_txt.length > 0) {
    const melhor = agg.medidas_txt.reduce((a, b) => (b.length > a.length ? b : a));
    p.medidas = melhor;
    enriquecidos++;
  }

  // Medidas rodapé (formato resumido, útil para exibição futura)
  if (!p.medidasRodape && agg.rodapes.length > 0) {
    p.medidasRodape = agg.rodapes[0];
  }

  // Cores estruturadas
  if (agg.cores.size > 0) {
    const coresArr = [...agg.cores];
    if (!p.coresEstruturadas || p.coresEstruturadas.length === 0) {
      p.coresEstruturadas = coresArr;
    }
  }

  // Descrição
  if (!p.informacoes && agg.descricoes.length > 0) {
    const melhor = agg.descricoes.reduce((a, b) => (b.length > a.length ? b : a));
    p.informacoes = melhor;
  }
}

fs.writeFileSync(PATH_ATUAL, JSON.stringify(catAtual, null, 2), 'utf8');
console.log(`\nProdutos enriquecidos com medidas novas: ${enriquecidos}`);

// Relatório final
const totalImgs  = catAtual.reduce((s, p) => s + (p.todasImagens || []).length, 0);
const comMedidas = catAtual.filter(p => p.medidas).length;
const comCores   = catAtual.filter(p => (p.coresEstruturadas||[]).length > 0).length;
const comDesc    = catAtual.filter(p => p.informacoes).length;
const comVar     = catAtual.filter(p => (p.variacoes||[]).length > 0).length;

console.log('\n=== RESULTADO FINAL ===');
console.log(`Produtos:   ${catAtual.length}`);
console.log(`Imagens:    ${totalImgs}`);
console.log(`Medidas:    ${comMedidas}/${catAtual.length}`);
console.log(`Cores:      ${comCores}/${catAtual.length}  (estruturadas do _catalogo)`);
console.log(`Variações:  ${comVar}/${catAtual.length}  (fotos por cor/tamanho)`);
console.log(`Descrição:  ${comDesc}/${catAtual.length}`);
