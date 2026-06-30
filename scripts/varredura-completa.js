/**
 * varredura-completa.js
 *
 * Varredura recursiva, profundidade arbitraria, do catalogo de imagens.
 * GARANTIA: nenhuma imagem e nenhuma pasta-folha-com-imagem fica de fora.
 *
 * Uso:
 *   node scripts/varredura-completa.js          -> so VALIDA e imprime tabelas (NAO salva)
 *   node scripts/varredura-completa.js --write   -> valida E grava produtos.json (se cobertura 100%)
 */
const fs = require('fs');
const path = require('path');

const CATALOGO_ROOT = path.resolve('C:\\Imagens\\Catalogo');
const ROOT_FWD = CATALOGO_ROOT.replace(/\\/g, '/');
const OUTPUT_FILE = path.resolve(__dirname, '../src/data/produtos.json');
const WRITE = process.argv.includes('--write');

const PASTAS_IGNORAR = new Set([
  '_catalogo', '_SiteCasaSinelli', '_lixeira_duplicatas',
  '.claude', '.agents', 'node_modules', '.git',
]);

const EXT_IMG = new Set(['.jpg', '.jpeg', '.png', '.webp']);
const AUX_DIRS = new Set(['convertidas', 'fi']); // pastas auxiliares: imagens contam, mas nao viram produto/variacao propria

// ---------- helpers de FS ----------
const isImg = f => EXT_IMG.has(path.extname(f).toLowerCase());

function listDirs(dir) {
  try {
    return fs.readdirSync(dir, { withFileTypes: true })
      .filter(e => e.isDirectory() && !PASTAS_IGNORAR.has(e.name))
      .map(e => e.name);
  } catch { return []; }
}
function imgsDiretas(dir) {
  try {
    return fs.readdirSync(dir, { withFileTypes: true })
      .filter(e => e.isFile() && isImg(e.name))
      .map(e => path.join(dir, e.name));
  } catch { return []; }
}
// todas as imagens na subarvore de dir (qualquer profundidade)
function imgsSubarvore(dir) {
  const out = [];
  const stack = [dir];
  while (stack.length) {
    const cur = stack.pop();
    out.push(...imgsDiretas(cur));
    for (const s of listDirs(cur)) stack.push(path.join(cur, s));
  }
  return out;
}
const rel = p => p.replace(/\\/g, '/').replace(ROOT_FWD, '').replace(/^\//, '');
// caminho web esperado pelo frontend: barra inicial (/api/catalogo + /marca/...)
const web = p => '/' + p;
// caminho web -> absoluto no disco (p/ ler tamanho de arquivo)
const absOf = p => path.join(CATALOGO_ROOT, ...p.replace(/^\//, '').split('/'));
const sizeOf = p => { try { return fs.statSync(absOf(p)).size; } catch { return 0; } };
const baseOf = p => p.split('/').pop() || '';

// P1: nome indica grafico/tabela/medida -> NAO serve de capa
function ehNomeGrafico(p) {
  const f = baseOf(p).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  return ['tabela', 'peso', 'suportado', 'medida', 'ficha', 'grafico', 'diagrama'].some(t => f.includes(t));
}
// P2: tabela / peso-suportado / ficha-tecnica -> REMOVER da galeria (mantem arquivo no disco)
function ehTabelaGaleria(p) {
  const f = baseOf(p).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '');
  return f.includes('tabela') || f.includes('pesosuportado') || f.includes('fichatecnica');
}
// P1: escolhe capa -> exclui graficos, prefere maior arquivo, fallback 1a valida/1a
function escolherCapa(imgsWeb) {
  if (!imgsWeb.length) return null;
  const validas = imgsWeb.filter(p => !ehNomeGrafico(p));
  const pool = validas.length ? validas : imgsWeb;
  let best = pool[0], bestSize = sizeOf(pool[0]);
  for (const p of pool.slice(1)) { const s = sizeOf(p); if (s > bestSize) { best = p; bestSize = s; } }
  return best;
}
const imagensRemovidasGaleria = new Set();

function lerTexto(fp) {
  if (!fs.existsSync(fp)) return null;
  try { return fs.readFileSync(fp, 'utf8').trim() || null; }
  catch { try { return fs.readFileSync(fp, 'latin1').trim() || null; } catch { return null; } }
}

// ---------- deteccao de variacao (cor/tamanho) ----------
const fold = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

const CORES = [
  'azul','bege','bordo','caramelo','cinza','marrom','preta','preto','branca','branco',
  'rose','rosa','verde','vermelha','vermelho','prata','gold','dourado','nogueira','freijo',
  'off-white','offwhite','off ','naturale','natural','cinamomo','cappuccino','capuccino',
  'carvalho','imbuia','castanho','fendi','grafite','chocolate','tabaco','areia','fume','fume',
  'mel','nude','terracota','amadeirado','courino','linho','couro','tecido','suede',
];

function ehTamanho(nomeFold) {
  return (
    /^\d+[.,]?\d*\s*m?$/.test(nomeFold) ||           // 1,60  1,80m  2,00  2,90m
    /\d+\s*cm/.test(nomeFold) ||                      // 110cm 12cmdealtura
    /\d+\s*x\s*\d+/.test(nomeFold) ||                 // 120x088 160x80
    /\d+\s*(bocas|pe[cç]as?|pts|portas?|lugares?|pts)/.test(nomeFold) || // 4bocas 5pecas fit3pts
    /\b(casal|solteiro|queen|quenn|king|viuva|bibox|king\s?size)\b/.test(nomeFold) ||
    /\d+[.,]\d+\s*m/.test(nomeFold)                   // 2.30m
  );
}
function ehCor(nomeFold) {
  return CORES.some(c => nomeFold.includes(c));
}
const GENERIC_VAR = new Set(['fotos diversas','fotos','colors','normal']);

function ehVariacao(nome) {
  const f = fold(nome).trim();
  if (GENERIC_VAR.has(f)) return true;
  return ehCor(f) || ehTamanho(f);
}
function ehAux(nome) { return AUX_DIRS.has(fold(nome).trim()); }

// ---------- categoria ----------
// ordem = prioridade
const CATEGORIAS = [
  [['roupeiro','guarda roupa','guarda-roupa','guardaroupa'], 'Guarda-Roupa'],
  [['gr'], 'Guarda-Roupa'],            // segmento exato 'gr'
  [['colchao'], 'Colchão'],
  [['beliche'], 'Beliche'],
  [['bicama'], 'Bicama'],
  [['triliche'], 'Beliche'],
  [['criado'], 'Criado-Mudo'],
  [['comoda'], 'Cômoda'],
  [['poltrona'], 'Poltrona'],
  [['sofa'], 'Sofá'],
  [['balcao'], 'Balcão'],                                   // antes de eletro: balcaoCooktop -> Balcao
  [['cooktop','fogao','tanquinho','tanque','geladeira'], 'Eletrodoméstico'],
  [['rack','painel','home'], 'Rack/Painel'],
  [['mesa'], 'Mesa'],                                       // antes de cabeceira: "Mesa de Cabeceira" -> Mesa
  [['cabeceira'], 'Cabeceira'],
  [['penteadeira'], 'Penteadeira'],
  [['berco'], 'Berço'],
  [['cadeira'], 'Cadeira'],
  [['multiuso'], 'Multiuso'],
  [['cozinha','kit'], 'Cozinha'],
  [['cama'], 'Cama'],
  [['armario','buffet','cristaleira','aparador','fruteira','sapateira'], 'Armário'],
];

// overrides manuais por caminho relativo (decisao do usuario)
const OVERRIDES = {
  'Lukaliam/CantinhoDoCafé': 'Armário',
  'Lukaliam/vicenza': 'Escrivaninha',
  'batrol/conjunto': 'Multiuso',
  'kamabel/palmo': 'Beliche',
  'songes/box': 'Colchão',
  'valdemoveis/joãoPessoa': 'Multiuso',
};
// produtos a NAO criar (imagens intencionalmente excluidas)
const IGNORAR_PRODUTOS = new Set(['albatroz', 'laveMais', 'paropas']);
const imagensIgnoradas = new Set();

function detectarCategoria(relPath) {
  if (OVERRIDES[relPath]) return OVERRIDES[relPath];
  const segs = relPath.split('/').map(fold);
  const joined = segs.join(' ');
  for (const [keys, cat] of CATEGORIAS) {
    for (const k of keys) {
      if (k === 'gr') { if (segs.includes('gr')) return cat; }
      else if (joined.includes(k)) return cat;
    }
  }
  return 'Outros';
}

// ---------- meta ----------
function lerMeta(dir) {
  const medidas = lerTexto(path.join(dir, 'medidas.txt'));
  let informacoes = null;
  for (const n of ['medidasEinformacoes.txt','medidasEinformaçoes.txt','medidasEinformações.txt',
                   'medidasEInformações.txt','informacoes.txt','informaçoes.txt','informações.txt']) {
    informacoes = lerTexto(path.join(dir, n));
    if (informacoes) break;
  }
  const link = lerTexto(path.join(dir, 'LINK-DO-SITE-REFERENCIAS-E-PRODUTOS.txt'));
  return { medidas, informacoes, link };
}

// ---------- nucleo ----------
let idc = 1;
const foldersSemImagem = []; // {path, motivo}

/**
 * Processa F. Retorna lista de produtos.
 * marca = 1a pasta apos Catalogo. linkPai = link herdado.
 */
function processar(F, marca, linkPai) {
  const subdirs = listDirs(F);
  const diretas = imgsDiretas(F);

  const auxCh = subdirs.filter(ehAux);
  const naoAux = subdirs.filter(d => !ehAux(d));
  const varCh = naoAux.filter(ehVariacao);
  const modelCh = naoAux.filter(d => !ehVariacao(d));

  const meta = lerMeta(F);
  const link = meta.link || linkPai;

  const ehProduto = diretas.length > 0 || varCh.length > 0;
  const produtos = [];

  if (ehProduto) {
    // imagens reivindicadas pelas variacoes e pelos sub-modelos (recursadas a parte)
    const varSets = varCh.map(d => imgsSubarvore(path.join(F, d)).map(rel));
    const modelSet = new Set(modelCh.flatMap(d => imgsSubarvore(path.join(F, d)).map(rel)));
    const varSetFlat = new Set(varSets.flat());

    // raiz = tudo na subarvore de F que nao pertence a variacao nem a sub-modelo
    //        (= imagens diretas + auxiliares convertidas/FI + qualquer sobra)
    const raiz = imgsSubarvore(F).map(rel).filter(p => !varSetFlat.has(p) && !modelSet.has(p));

    const variacoes = varCh.map((d, i) => ({ nome: d, imagens: varSets[i] }));
    const todasImagens = [...raiz, ...variacoes.flatMap(v => v.imagens)];

    if (todasImagens.length > 0) {
      const relPath = rel(F);
      if (IGNORAR_PRODUTOS.has(relPath)) {
        todasImagens.forEach(p => imagensIgnoradas.add(p));
      } else {
      const categoria = detectarCategoria(relPath);
      const subpastas = relPath.split('/').slice(1, -1);
      // P2: remove tabelas/fichas/peso-suportado da galeria (arquivo fica no disco)
      const semTabela = arr => arr.filter(p => {
        if (ehTabelaGaleria(p)) { imagensRemovidasGaleria.add(p.replace(/^\//, '')); return false; }
        return true;
      });
      const imagensW = semTabela(raiz.map(web));
      const variacoesW = variacoes.map(v => ({ cor: v.nome, imagens: semTabela(v.imagens.map(web)) }));
      const todasW = semTabela(todasImagens.map(web));
      produtos.push({
        id: String(idc++),
        nome: categoria,
        nomePasta: path.basename(F),
        marca,
        categoria,
        caminho: web(relPath),
        subpastas,
        medidas: meta.medidas,
        informacoes: meta.informacoes,
        linkReferencia: link || null,
        capa: escolherCapa(todasW),                 // P1
        imagens: imagensW,
        variacoes: variacoesW,
        todasImagens: todasW,
      });
      }
    }

    // sub-modelos viram produtos proprios
    for (const d of modelCh) produtos.push(...processar(path.join(F, d), marca, link));
  } else {
    // agrupador: sem imagens diretas e sem variacoes -> desce em tudo
    // (varCh e vazio aqui por definicao)
    const claimed = new Set();
    for (const d of modelCh) {
      produtos.push(...processar(path.join(F, d), marca, link));
      for (const p of imgsSubarvore(path.join(F, d)).map(rel)) claimed.add(p);
    }
    // rede de seguranca: imagens auxiliares soltas sob agrupador (nao deveria ocorrer)
    const sobra = imgsSubarvore(F).map(rel).filter(p => !claimed.has(p));
    if (sobra.length > 0) {
      const relPath = rel(F);
      const categoria = detectarCategoria(relPath);
      const sobraW = sobra.map(web).filter(p => {
        if (ehTabelaGaleria(p)) { imagensRemovidasGaleria.add(p.replace(/^\//, '')); return false; }
        return true;
      });
      produtos.push({
        id: String(idc++), nome: categoria, nomePasta: path.basename(F), marca,
        categoria, caminho: web(relPath), subpastas: relPath.split('/').slice(1, -1),
        medidas: meta.medidas, informacoes: meta.informacoes, linkReferencia: link || null,
        capa: escolherCapa(sobraW), imagens: sobraW, variacoes: [], todasImagens: sobraW,
      });
    }
    if (subdirs.length === 0 && diretas.length === 0) {
      foldersSemImagem.push({ path: rel(F), motivo: 'pasta-folha sem nenhuma imagem' });
    }
  }
  return produtos;
}

// ---------- validacao ----------
function todasImagensDisco() {
  const set = new Set();
  for (const m of listDirs(CATALOGO_ROOT)) {
    for (const p of imgsSubarvore(path.join(CATALOGO_ROOT, m))) set.add(rel(p));
  }
  return set;
}
function folhasComImagemDisco() {
  // pastas sem subpastas (nao-ignoradas) que tem >=1 imagem direta
  const folhas = [];
  const stack = listDirs(CATALOGO_ROOT).map(m => path.join(CATALOGO_ROOT, m));
  while (stack.length) {
    const cur = stack.pop();
    const subs = listDirs(cur);
    if (subs.length === 0) {
      if (imgsDiretas(cur).length > 0) folhas.push(rel(cur));
    } else {
      for (const s of subs) stack.push(path.join(cur, s));
    }
  }
  return folhas;
}

function main() {
  const marcas = listDirs(CATALOGO_ROOT).sort();
  const todos = [];
  const porMarca = {};

  for (const marca of marcas) {
    const marcaPath = path.join(CATALOGO_ROOT, marca);
    const linkMarca = lerTexto(path.join(marcaPath, 'LINK-DO-SITE-REFERENCIAS-E-PRODUTOS.txt'));
    const ps = processar(marcaPath, marca, linkMarca);
    porMarca[marca] = ps.length;
    todos.push(...ps);
  }

  // ---- VALIDACAO ----
  const discoSet = todasImagensDisco();
  // todasImagens agora vem com barra inicial (formato web); normaliza p/ comparar com disco
  const capturadas = todos.flatMap(p => p.todasImagens).map(s => s.replace(/^\//, ''));
  const capturadasSet = new Set(capturadas);

  const faltando = [...discoSet].filter(p => !capturadasSet.has(p) && !imagensIgnoradas.has(p) && !imagensRemovidasGaleria.has(p));
  const contagem = {};
  for (const p of capturadas) contagem[p] = (contagem[p] || 0) + 1;
  const duplicadas = Object.entries(contagem).filter(([, n]) => n > 1).map(([p, n]) => `${p} (x${n})`);

  const folhas = folhasComImagemDisco();
  const folhasNaoCobertas = folhas.filter(folha => {
    // alguma imagem direta (nao-tabela) da folha tem que estar capturada (ou ignorada)
    const imgs = imgsDiretas(path.join(CATALOGO_ROOT, folha)).map(rel).filter(p => !ehTabelaGaleria('/' + p));
    const algumaImg = imgs[0];
    return algumaImg && !capturadasSet.has(algumaImg) && !imagensIgnoradas.has(algumaImg);
  });

  // ---- RELATORIO ----
  console.log('\n================ VALIDACAO ================\n');
  console.log('Produtos capturados:        ', todos.length);
  console.log('Marcas:                     ', marcas.length);
  console.log('');
  console.log('IMAGENS  (jpg/jpeg/png/webp)');
  console.log('  no disco:                 ', discoSet.size);
  console.log('  intencionalmente ignoradas:', imagensIgnoradas.size, `(${[...IGNORAR_PRODUTOS].join(', ')})`);
  console.log('  removidas galeria (tabela/ficha):', imagensRemovidasGaleria.size);
  console.log('  esperadas (disco-ignoradas-removidas):', discoSet.size - imagensIgnoradas.size - imagensRemovidasGaleria.size);
  console.log('  capturadas (unicas):      ', capturadasSet.size);
  console.log('  refs totais no JSON:      ', capturadas.length);
  console.log('  FALTANDO (disco sem JSON): ', faltando.length);
  console.log('  DUPLICADAS (>1x no JSON): ', duplicadas.length);
  console.log('');
  console.log('PASTAS-FOLHA com imagem');
  console.log('  no disco:                 ', folhas.length);
  console.log('  NAO cobertas:             ', folhasNaoCobertas.length);
  console.log('');
  console.log('Pastas SEM imagem (excluidas):', foldersSemImagem.length);

  if (faltando.length) {
    console.log('\n--- IMAGENS FALTANDO ---');
    faltando.slice(0, 50).forEach(p => console.log('  ', p));
    if (faltando.length > 50) console.log(`   ... +${faltando.length - 50}`);
  }
  if (duplicadas.length) {
    console.log('\n--- IMAGENS DUPLICADAS ---');
    duplicadas.slice(0, 50).forEach(p => console.log('  ', p));
  }
  if (folhasNaoCobertas.length) {
    console.log('\n--- PASTAS-FOLHA NAO COBERTAS ---');
    folhasNaoCobertas.forEach(p => console.log('  ', p));
  }
  if (foldersSemImagem.length) {
    console.log('\n--- PASTAS EXCLUIDAS (sem imagem) ---');
    foldersSemImagem.forEach(f => console.log('  ', f.path, '|', f.motivo));
  }

  console.log('\n--- PRODUTOS POR MARCA ---');
  for (const [m, n] of Object.entries(porMarca).sort()) console.log(`  ${m}: ${n}`);

  if (process.env.DUMP_CAT) {
    console.log(`\n--- PRODUTOS categoria="${process.env.DUMP_CAT}" ---`);
    todos.filter(p => p.categoria === process.env.DUMP_CAT)
      .forEach(p => console.log(`  [${p.marca}] ${p.caminho}  (${p.todasImagens.length} img, ${p.variacoes.length} var)`));
  }

  console.log('\n--- PRODUTOS POR CATEGORIA ---');
  const porCat = {};
  for (const p of todos) porCat[p.categoria] = (porCat[p.categoria] || 0) + 1;
  for (const [c, n] of Object.entries(porCat).sort((a, b) => b[1] - a[1])) console.log(`  ${c}: ${n}`);

  const ok = faltando.length === 0 && duplicadas.length === 0 && folhasNaoCobertas.length === 0;
  console.log('\n==========================================');
  console.log(ok ? '✅ COBERTURA 100% — nada perdido, nada duplicado.'
                 : '❌ COBERTURA INCOMPLETA — ver listas acima.');

  if (WRITE) {
    if (!ok) { console.log('\n⛔ --write IGNORADO: cobertura incompleta.'); return; }
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(todos, null, 2), 'utf8');
    console.log(`\n💾 Salvo: ${OUTPUT_FILE} (${todos.length} produtos)`);
  } else {
    console.log('\n(modo validacao — nada salvo. Rode com --write apos conferir.)');
  }
}

main();
