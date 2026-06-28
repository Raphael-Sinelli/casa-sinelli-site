const fs = require('fs');
const path = require('path');

const CATALOGO_ROOT = path.resolve('C:\\Imagens\\Catalogo');
const OUTPUT_FILE = path.resolve(__dirname, '../src/data/produtos.json');

const PASTAS_IGNORAR = new Set([
  '_catalogo', '_SiteCasaSinelli', '_lixeira_duplicatas',
  '.claude', '.agents', 'node_modules', '.git',
]);

const EXTENSOES_IMAGEM = new Set(['.jpg', '.jpeg', '.png', '.webp', '.heic']);

function isImagem(f) {
  return EXTENSOES_IMAGEM.has(path.extname(f).toLowerCase());
}

function lerArquivoTexto(filePath) {
  if (!fs.existsSync(filePath)) return null;
  try { return fs.readFileSync(filePath, 'utf8').trim() || null; }
  catch { try { return fs.readFileSync(filePath, 'latin1').trim() || null; } catch { return null; } }
}

function listDirs(dir) {
  try {
    return fs.readdirSync(dir).filter(e => {
      try { return fs.statSync(path.join(dir, e)).isDirectory(); } catch { return false; }
    });
  } catch { return []; }
}

// Imagens DIRETAMENTE em dir (não em subpastas)
function listImagesDirect(dir) {
  try {
    return fs.readdirSync(dir)
      .filter(f => { try { return fs.statSync(path.join(dir, f)).isFile() && isImagem(f); } catch { return false; } })
      .map(f => path.join(dir, f).replace(/\\/g, '/'));
  } catch { return []; }
}

// TODAS as imagens em dir e TODAS as subpastas, qualquer profundidade
function collectImagesRecursive(dir) {
  const result = [];
  const stack = [dir];
  while (stack.length) {
    const cur = stack.pop();
    result.push(...listImagesDirect(cur));
    for (const sub of listDirs(cur)) stack.push(path.join(cur, sub));
  }
  return result;
}

function caminhoRelativo(absPath) {
  return absPath.replace(/\\/g, '/').replace(CATALOGO_ROOT.replace(/\\/g, '/'), '');
}

let idCounter = 1;

function lerMeta(dir, linkFallback) {
  const medidas = lerArquivoTexto(path.join(dir, 'medidas.txt'));
  let informacoes = null;
  for (const n of ['medidasEinformacoes.txt','medidasEinformaçoes.txt','medidasEinformações.txt',
                    'informacoes.txt','informaçoes.txt','informações.txt']) {
    informacoes = lerArquivoTexto(path.join(dir, n));
    if (informacoes) break;
  }
  const link = lerArquivoTexto(path.join(dir, 'LINK-DO-SITE-REFERENCIAS-E-PRODUTOS.txt')) || linkFallback;
  return { medidas, informacoes, link };
}

/**
 * Cria produto em dir.
 * imagensRaiz = imagens DIRETAS em dir.
 * variacoes   = subpastas que têm imagens diretas → coleta RECURSIVA de cada subpasta.
 * Subpastas sem imagens diretas NÃO entram como variação aqui (serão sub-produtos).
 */
function criarProduto(dir, marca, subpastasAcima, linkFallback) {
  const meta = lerMeta(dir, linkFallback);
  const nomeModelo = path.basename(dir);

  const imagensRaiz = listImagesDirect(dir).map(caminhoRelativo);
  const subDirs = listDirs(dir);

  const variacoes = [];
  for (const sub of subDirs) {
    const subPath = path.join(dir, sub);
    // Variação só se tiver imagens DIRETAS (distingue de sub-produtos)
    const imgsDiretas = listImagesDirect(subPath);
    if (imgsDiretas.length > 0) {
      // Mas coleta RECURSIVAMENTE para pegar convertidas/, FI/, sub-cores, etc.
      const todasImgsVar = collectImagesRecursive(subPath).map(caminhoRelativo);
      variacoes.push({ cor: sub, imagens: todasImgsVar });
    }
  }

  const todasImagens = [...imagensRaiz, ...variacoes.flatMap(v => v.imagens)];
  if (todasImagens.length === 0) return null;

  return {
    id: String(idCounter++),
    nome: nomeModelo,
    marca,
    categoria: 'Outros',
    caminho: caminhoRelativo(dir),
    subpastas: subpastasAcima,
    medidas: meta.medidas,
    informacoes: meta.informacoes,
    linkReferencia: meta.link || null,
    imagens: imagensRaiz,
    variacoes,
    todasImagens,
  };
}

/**
 * Percorre dir recursivamente.
 *
 * Regra: um dir é PRODUTO se tiver imagens diretas OU tiver subpastas com imagens diretas.
 * (Igual à lógica original, mas agora a coleta de imagens das variações é recursiva.)
 *
 * Subpastas SEM imagens diretas podem ser sub-produtos → recursamos nelas.
 * Subpastas COM imagens diretas → são variações do produto atual.
 *
 * Se dir não tem imagens diretas E nenhuma subpasta tem imagens diretas →
 *   dir é agrupador, recursamos em todas as subpastas.
 */
function processarDir(dir, marca, subpastasAcima, linkFallback) {
  const produtos = [];
  const imagensAqui = listImagesDirect(dir);
  const subDirs = listDirs(dir);

  // Subpastas com imagens DIRETAS (tornam-se variações)
  const subComImgsDiretas = subDirs.filter(s => listImagesDirect(path.join(dir, s)).length > 0);
  // Subpastas SEM imagens diretas (podem ser sub-produtos ou agrupadores)
  const subSemImgsDiretas = subDirs.filter(s => !subComImgsDiretas.includes(s));

  const ehProduto = imagensAqui.length > 0 || subComImgsDiretas.length > 0;

  if (ehProduto) {
    const p = criarProduto(dir, marca, subpastasAcima, linkFallback);
    if (p) {
      produtos.push(p);
      console.log(`  [${marca}] ${p.caminho} → ${p.todasImagens.length} imgs (${p.variacoes.length} var)`);
    }

    // Subpastas sem imagens diretas podem conter seus próprios sub-produtos
    for (const sub of subSemImgsDiretas) {
      const subPath = path.join(dir, sub);
      const novosSubpastas = [...subpastasAcima, path.basename(dir)];
      produtos.push(...processarDir(subPath, marca, novosSubpastas, linkFallback));
    }
  } else {
    // Agrupador: nenhuma imagem direta aqui nem em subpastas diretas → recursamos tudo
    for (const sub of subDirs) {
      const subPath = path.join(dir, sub);
      const novosSubpastas = [...subpastasAcima, path.basename(dir)];
      produtos.push(...processarDir(subPath, marca, novosSubpastas, linkFallback));
    }
  }

  return produtos;
}

function main() {
  const marcaDirs = fs.readdirSync(CATALOGO_ROOT).filter(nome => {
    if (PASTAS_IGNORAR.has(nome)) return false;
    try { return fs.statSync(path.join(CATALOGO_ROOT, nome)).isDirectory(); } catch { return false; }
  }).sort();

  const todos = [];
  const porMarca = {};

  for (const marca of marcaDirs) {
    const marcaPath = path.join(CATALOGO_ROOT, marca);
    const linkMarca = lerArquivoTexto(path.join(marcaPath, 'LINK-DO-SITE-REFERENCIAS-E-PRODUTOS.txt'));

    const subDirs = listDirs(marcaPath);
    const imagensDiretos = listImagesDirect(marcaPath);

    let produtosMarca = [];

    if (imagensDiretos.length > 0 && subDirs.length === 0) {
      const p = criarProduto(marcaPath, marca, [], linkMarca);
      if (p) { produtosMarca.push(p); console.log(`  [${marca}] ${p.caminho} → ${p.todasImagens.length} imgs`); }
    } else {
      for (const sub of subDirs) {
        const subPath = path.join(marcaPath, sub);
        produtosMarca.push(...processarDir(subPath, marca, [sub], linkMarca));
      }
    }

    porMarca[marca] = produtosMarca.length;
    if (produtosMarca.length > 0) {
      console.log(`→ ${marca}: ${produtosMarca.length} produto(s)\n`);
    }
    todos.push(...produtosMarca);
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(todos, null, 2), 'utf8');

  const totalImgs = todos.reduce((s, p) => s + p.todasImagens.length, 0);
  console.log(`\n✅ TOTAL: ${todos.length} produtos | ${totalImgs} imagens`);

  const semProdutos = Object.entries(porMarca).filter(([, n]) => n === 0).map(([m]) => m);
  if (semProdutos.length) console.log(`⚠️  Sem produtos: ${semProdutos.join(', ')}`);

  // Distribuição por marca
  console.log('\nPor marca:');
  for (const [m, n] of Object.entries(porMarca).sort()) {
    if (n > 0) console.log(`  ${m}: ${n}`);
  }
}

main();
