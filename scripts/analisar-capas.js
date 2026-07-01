/**
 * analisar-capas.js
 *
 * Analisa TODAS as imagens candidatas a capa de cada produto com sharp:
 *   - desvio padrao de cor (media dos stdev dos canais R,G,B)
 *   - entropia
 *   - tamanho de arquivo (bytes) e dimensoes
 * Cacheia resultados em scratchpad p/ nao reprocessar.
 *
 * Modos:
 *   node scripts/analisar-capas.js            -> constroi cache + imprime DISTRIBUICAO (calibracao)
 *   node scripts/analisar-capas.js --escolher -> usa THRESHOLD p/ escolher capa, imprime amostra 15 (NAO grava)
 *   node scripts/analisar-capas.js --escolher --write -> grava capa em produtos.json
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const CATALOGO_ROOT = path.resolve('C:\\Imagens\\Catalogo');
const PRODUTOS = path.resolve(__dirname, '../src/data/produtos.json');
// fixo (nao amarrado a sessao) p/ sobreviver entre sessoes de trabalho
const CACHE = path.resolve(require('os').tmpdir(), 'casa-sinelli-capas-cache.json');

// limiar de stdev de cor p/ classificar "ambientada" (calibrado abaixo)
const THRESHOLD = Number(process.env.THRESHOLD || 62);

const ESCOLHER = process.argv.includes('--escolher');
const WRITE = process.argv.includes('--write');

const absOf = p => path.join(CATALOGO_ROOT, ...p.replace(/^\//, '').split('/'));
const baseOf = p => (p ? p.split('/').pop() || '' : '(sem imagem)');
const fold = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

// substrings que NUNCA podem ser capa (busca no nome inteiro, sem separadores)
const BAD_SUB = ['detalhe', 'close', 'zoom', 'abert', 'interno', 'interna', 'pessoa',
                 'tabela', 'pesosuportado', 'medida', 'ficha', 'grafico', 'diagrama'];
// tokens exatos (separados por nao-alfanumerico) que indicam ficha/medida/aux -> nunca capa
const BAD_TOK = new Set(['med', 'meds', 'cota', 'cotas', 'dimensao', 'dimensoes',
                         'mao', 'maos', 'desenho', 'tecnico', 'tecnica']);
function nomeRuim(p) {
  const nome = fold(baseOf(p).replace(/\.[^.]+$/, '')); // sem extensao
  const semSep = nome.replace(/[^a-z0-9]/g, '');
  if (BAD_SUB.some(t => semSep.includes(t))) return true;
  const toks = nome.split(/[^a-z0-9]+/).filter(Boolean);
  return toks.some(t => BAD_TOK.has(t));
}

// ---------- cache de stats ----------
let cache = {};
if (fs.existsSync(CACHE)) {
  try { cache = JSON.parse(fs.readFileSync(CACHE, 'utf8')); } catch { cache = {}; }
}
let cacheDirty = false;

const CACHE_VER = 4; // bump p/ invalidar cache antigo

async function cornerStats(abs, W, H) {
  // analisa 4 cantos (~16% lado). Conta quantos sao "fundo branco" (claro+liso).
  const pw = Math.max(8, Math.floor(W * 0.16));
  const ph = Math.max(8, Math.floor(H * 0.16));
  const corners = [
    { left: 0, top: 0 },
    { left: W - pw, top: 0 },
    { left: 0, top: H - ph },
    { left: W - pw, top: H - ph },
  ];
  let brSum = 0, sdSum = 0, ok = 0, whiteCorners = 0;
  for (const c of corners) {
    try {
      // .stats() opera na imagem de ENTRADA -> materializa o recorte em buffer antes
      const buf = await sharp(abs, { failOn: 'none' })
        .extract({ left: c.left, top: c.top, width: pw, height: ph })
        .toBuffer();
      const st = await sharp(buf).stats();
      const ch = st.channels.slice(0, 3);
      const br = ch.reduce((a, x) => a + x.mean, 0) / ch.length;
      const sd = ch.reduce((a, x) => a + x.stdev, 0) / ch.length;
      brSum += br; sdSum += sd; ok++;
      if (br >= 232 && sd <= 16) whiteCorners++; // canto = fundo branco/liso
    } catch {}
  }
  if (!ok) return { cornerBright: 0, cornerStdev: 999, whiteCorners: 0 };
  return {
    cornerBright: Math.round((brSum / ok) * 100) / 100, // brilho medio dos cantos (0-255)
    cornerStdev: Math.round((sdSum / ok) * 100) / 100,  // uniformidade media (baixo=liso)
    whiteCorners,                                        // 0-4 cantos com fundo branco
  };
}

async function statsDe(webPath) {
  if (cache[webPath] && cache[webPath].v === CACHE_VER) return cache[webPath];
  const abs = absOf(webPath);
  let r;
  try {
    const img = sharp(abs, { failOn: 'none' });
    const meta = await img.metadata();
    const W = meta.width || 0, H = meta.height || 0;
    const st = await img.stats();
    const ch = st.channels.slice(0, 3); // R,G,B
    const stdevMean = ch.reduce((a, c) => a + c.stdev, 0) / ch.length;
    const meanMean = ch.reduce((a, c) => a + c.mean, 0) / ch.length;
    const cs = (W && H) ? await cornerStats(abs, W, H) : { cornerBright: 0, cornerStdev: 999, whiteCorners: 0 };
    let size = 0;
    try { size = fs.statSync(abs).size; } catch {}
    r = {
      v: CACHE_VER,
      stdevMean: Math.round(stdevMean * 100) / 100,
      meanMean: Math.round(meanMean * 100) / 100,
      entropy: Math.round((st.entropy || 0) * 1000) / 1000,
      cornerBright: cs.cornerBright,
      cornerStdev: cs.cornerStdev,
      whiteCorners: cs.whiteCorners,
      width: W, height: H, size, ok: true,
    };
  } catch (e) {
    r = { v: CACHE_VER, ok: false, err: String(e.message || e), size: 0, stdevMean: 0, entropy: 0, cornerBright: 0, cornerStdev: 999, whiteCorners: 0, width: 0, height: 0 };
  }
  cache[webPath] = r;
  cacheDirty = true;
  return r;
}

// PRIORIDADE 1 — ambientada (cena no entorno: parede/piso/cortina/decor).
// Assinaturas (validadas visualmente):
//   cena real:        wc=0, cBright moderado (~160-175), cStdev moderado
//   frontal isolada:  produto preenche o quadro -> cBright alto (~215) + cStdev alto
//   estudio branco:   wc>=1 (fundo branco), cStdev baixo
function ehAmbientada(s) {
  if (s.whiteCorners >= 1) return false;                         // fundo branco -> isolada
  if (s.cornerStdev <= 14) return false;                         // fundo liso/uniforme -> isolada
  if (s.cornerBright >= 198 && s.cornerStdev >= 40) return false; // produto preenche quadro -> isolada
  return true;                                                    // cena ao redor
}

function candidatas(prod) {
  // candidatas = todasImagens menos nomes ruins
  const todas = prod.todasImagens || prod.imagens || [];
  const validas = todas.filter(p => !nomeRuim(p));
  return validas.length ? validas : todas; // se filtro zerar, mantem todas
}

(async () => {
  const produtos = JSON.parse(fs.readFileSync(PRODUTOS, 'utf8'));

  // computa stats de todas as candidatas
  let n = 0;
  for (const prod of produtos) {
    for (const c of candidatas(prod)) { await statsDe(c); n++; }
  }
  if (cacheDirty) {
    fs.mkdirSync(path.dirname(CACHE), { recursive: true });
    fs.writeFileSync(CACHE, JSON.stringify(cache), 'utf8');
  }

  if (!ESCOLHER) {
    // ---- CALIBRACAO: distribuicao das metricas ----
    const all = [];
    for (const prod of produtos)
      for (const c of candidatas(prod)) { const s = cache[c]; if (s && s.ok) all.push(s); }
    const dist = (label, key) => {
      const vals = all.map(s => s[key]).sort((a, b) => a - b);
      const pct = q => vals[Math.min(vals.length - 1, Math.floor(q * vals.length))];
      console.log(`\n--- ${label} ---`);
      console.log(`  min ${vals[0]}  max ${vals[vals.length - 1]}`);
      console.log('  ' + [0.1, 0.25, 0.5, 0.6, 0.7, 0.75, 0.8, 0.9].map(q => `p${q * 100}=${pct(q)}`).join('  '));
    };
    console.log('\n===== CALIBRACAO (' + all.length + ' imagens) =====');
    dist('stdevMean (cor geral)', 'stdevMean');
    dist('cornerStdev (uniformidade cantos; baixo=fundo liso/estudio)', 'cornerStdev');
    dist('cornerBright (brilho cantos; alto=fundo claro/branco)', 'cornerBright');
    const wc = {};
    for (const s of all) wc[s.whiteCorners] = (wc[s.whiteCorners] || 0) + 1;
    console.log('\nwhiteCorners (qtd cantos fundo branco):', JSON.stringify(wc));
    const nAmb = all.filter(ehAmbientada).length;
    console.log(`classificacao por imagem: ambientada=${nAmb}  estudio/isolada=${all.length - nAmb}`);
    console.log('\n(rode com --escolher p/ aplicar regra e ver amostra)');
    return;
  }

  // ---- ESCOLHA DE CAPA ----
  function escolher(prod) {
    const cands = candidatas(prod).map(p => ({ p, s: cache[p] })).filter(x => x.s && x.s.ok);
    if (!cands.length) {
      // sem stats -> primeira imagem qualquer
      const todas = prod.todasImagens || prod.imagens || [];
      return { capa: todas[0] || null, grupo: 'sem-analise' };
    }
    const ambient = cands.filter(x => ehAmbientada(x.s));
    const studio = cands.filter(x => !ehAmbientada(x.s));
    // melhor ambientada = maior arquivo (melhor resolucao entre as cenas)
    const melhorAmb = arr => arr.slice().sort((a, b) => b.s.size - a.s.size)[0];
    // melhor estudio = mais cantos brancos (isolado limpo) e desempate por tamanho
    const melhorStudio = arr => arr.slice().sort((a, b) =>
      (b.s.whiteCorners - a.s.whiteCorners) || (b.s.size - a.s.size))[0];
    if (ambient.length) return { capa: melhorAmb(ambient).p, grupo: 'ambientada', stat: melhorAmb(ambient).s };
    if (studio.length) return { capa: melhorStudio(studio).p, grupo: 'estudio/isolada (fallback)', stat: melhorStudio(studio).s };
    return { capa: cands[0].p, grupo: 'fallback-1a', stat: cands[0].s };
  }

  const escolhas = produtos.map(prod => ({ prod, ...escolher(prod) }));

  // dump p/ montagem/auditoria
  const dumpPath = path.join(path.dirname(CACHE), 'escolhas.json');
  fs.writeFileSync(dumpPath, JSON.stringify(escolhas.map(e => ({
    id: e.prod.id, categoria: e.prod.categoria, marca: e.prod.marca,
    nomePasta: e.prod.nomePasta, capa: e.capa, grupo: e.grupo, stat: e.stat || null,
  })), null, 2), 'utf8');

  // contagem por grupo
  const cont = {};
  for (const e of escolhas) cont[e.grupo] = (cont[e.grupo] || 0) + 1;
  console.log('\n===== RESULTADO (THRESHOLD=' + THRESHOLD + ') =====');
  console.log('produtos:', escolhas.length);
  for (const [g, c] of Object.entries(cont)) console.log(`  ${g}: ${c}`);

  // amostra de 15 aleatorios
  const idxs = [...escolhas.keys()];
  for (let i = idxs.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [idxs[i], idxs[j]] = [idxs[j], idxs[i]]; }
  const amostra = idxs.slice(0, 15).sort((a, b) => a - b);
  console.log('\n===== AMOSTRA 15 PRODUTOS =====');
  for (const i of amostra) {
    const e = escolhas[i];
    const s = e.stat;
    const stat = s ? ` [wc=${s.whiteCorners} cBright=${s.cornerBright} cStdev=${s.cornerStdev} ${s.width}x${s.height}]` : '';
    console.log(`\n#${e.prod.id} ${e.prod.categoria} — ${e.prod.marca}/${e.prod.nomePasta}`);
    console.log(`   capa: ${baseOf(e.capa)}`);
    console.log(`   grupo: ${e.grupo}${stat}`);
  }

  if (WRITE) {
    for (const e of escolhas) if (e.capa) e.prod.capa = e.capa;
    fs.writeFileSync(PRODUTOS, JSON.stringify(produtos, null, 2), 'utf8');
    console.log(`\nGravado: ${PRODUTOS}`);
  } else {
    console.log('\n(nada gravado — rode com --write apos aprovar)');
  }
})();
