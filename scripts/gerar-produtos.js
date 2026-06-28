const fs = require('fs');
const path = require('path');

const CATALOGO_ROOT = path.resolve('C:\\Imagens\\Catalogo');
const OUTPUT_FILE = path.resolve(__dirname, '../src/data/produtos.json');

const PASTAS_IGNORAR = new Set([
  '_catalogo',
  '_SiteCasaSinelli',
  '_lixeira_duplicatas',
  '.claude',
  '.agents',
]);

const EXTENSOES_IMAGEM = new Set(['.jpg', '.jpeg', '.png', '.webp', '.heic']);

// Mapeamento de palavras-chave para categoria
const CATEGORIAS_KEYWORDS = [
  { cat: 'Guarda-Roupa', palavras: ['guarda roupa', 'guardaroupa', 'roupeiro', 'closet', 'modulado'] },
  { cat: 'Cama', palavras: ['cama casal', 'cama solteiro', 'cama queen', 'cama king', 'beliche', 'triliche', 'bicama', 'cama box'] },
  { cat: 'Colchão', palavras: ['colchao', 'colchão'] },
  { cat: 'Sofá', palavras: ['sofa', 'sofá', 'retratil', 'retrátil', 'loveseat', '2 lugares', '3 lugares', '2e3lugares', 'sofacama', 'sofa cama'] },
  { cat: 'Mesa', palavras: ['mesa', 'mesa de jantar', 'mesa de centro', 'mesa lateral', 'mesa cabeceira', 'mesa computador'] },
  { cat: 'Cadeira', palavras: ['cadeira', 'banqueta', 'poltrona'] },
  { cat: 'Aparador', palavras: ['aparador'] },
  { cat: 'Rack / Painel', palavras: ['rack', 'painel', 'painel tv'] },
  { cat: 'Cômoda', palavras: ['comoda', 'cômoda', 'comodo'] },
  { cat: 'Criado-Mudo', palavras: ['criado', 'mesa de cabeceira', 'cabeceira'] },
  { cat: 'Armário', palavras: ['armario', 'armário', 'roupeiro', 'multiuso'] },
  { cat: 'Estante', palavras: ['estante', 'livreiro', 'biblioteca'] },
  { cat: 'Cristaleira', palavras: ['cristaleira', 'vitrine'] },
  { cat: 'Home / Rack', palavras: ['home', 'home office'] },
  { cat: 'Cozinha', palavras: ['cozinha', 'fogao', 'fogão', 'cooktop', 'kit cozinha', 'kit de cozinha'] },
  { cat: 'Fogão', palavras: ['fogao', 'fogão', 'cooktop'] },
  { cat: 'Colchonete', palavras: ['colchonete'] },
  { cat: 'Lavanderia', palavras: ['lava', 'tanque', 'lavanderia'] },
];

function detectarCategoria(marca, subpastas, nomeModelo) {
  const textoCompleto = `${marca} ${subpastas.join(' ')} ${nomeModelo}`.toLowerCase();

  for (const { cat, palavras } of CATEGORIAS_KEYWORDS) {
    if (palavras.some(p => textoCompleto.includes(p))) {
      return cat;
    }
  }
  return 'Outros';
}

function isImagem(filename) {
  return EXTENSOES_IMAGEM.has(path.extname(filename).toLowerCase());
}

function lerArquivoTexto(filePath) {
  if (!fs.existsSync(filePath)) return null;
  // Tenta UTF-8 primeiro; se falhar (BOM inválido), tenta latin1
  try {
    return fs.readFileSync(filePath, 'utf8').trim();
  } catch {
    return fs.readFileSync(filePath, 'latin1').trim();
  }
}

function listarImagensDiretorio(dirPath) {
  try {
    return fs.readdirSync(dirPath)
      .filter(f => {
        const stat = fs.statSync(path.join(dirPath, f));
        return stat.isFile() && isImagem(f);
      })
      .map(f => path.join(dirPath, f).replace(/\\/g, '/'));
  } catch {
    return [];
  }
}

// Converte caminho absoluto para path relativo ao Catálogo (para uso no JSON)
function caminhoRelativo(absPath) {
  return absPath.replace(/\\/g, '/').replace(CATALOGO_ROOT.replace(/\\/g, '/'), '');
}

/**
 * Processa um diretório de "modelo" (produto).
 * Pode conter imagens diretamente, subpastas de cores, e arquivos .txt.
 * Retorna um objeto produto ou null se não tiver imagens.
 */
function processarModelo(modeloPath, marca, subpastasAcima, nomeModelo) {
  if (!fs.existsSync(modeloPath)) return null;

  const entries = fs.readdirSync(modeloPath);
  const medidas = lerArquivoTexto(path.join(modeloPath, 'medidas.txt'));

  // Tenta variações de nome para medidasEinformacoes
  const nomesInfo = [
    'medidasEinformacoes.txt',
    'medidasEinformaçoes.txt',
    'medidasEinformações.txt',
    'informacoes.txt',
    'informaçoes.txt',
    'informações.txt',
  ];
  let informacoes = null;
  for (const nome of nomesInfo) {
    informacoes = lerArquivoTexto(path.join(modeloPath, nome));
    if (informacoes) break;
  }

  const linkFile = lerArquivoTexto(path.join(modeloPath, 'LINK-DO-SITE-REFERENCIAS-E-PRODUTOS.txt'));

  // Imagens diretamente na pasta do modelo
  const imagensRaiz = listarImagensDiretorio(modeloPath).map(caminhoRelativo);

  // Subpastas (variações de cor ou sub-modelos)
  const subDirs = entries.filter(e => {
    const fullPath = path.join(modeloPath, e);
    try {
      return fs.statSync(fullPath).isDirectory();
    } catch {
      return false;
    }
  });

  const variacoes = [];
  for (const subDir of subDirs) {
    const subPath = path.join(modeloPath, subDir);
    const imgs = listarImagensDiretorio(subPath).map(caminhoRelativo);
    if (imgs.length > 0) {
      variacoes.push({ cor: subDir, imagens: imgs });
    }
  }

  // Todas as imagens (raiz + variações)
  const todasImagens = [
    ...imagensRaiz,
    ...variacoes.flatMap(v => v.imagens),
  ];

  if (todasImagens.length === 0 && variacoes.length === 0) return null;

  const categoria = detectarCategoria(marca, subpastasAcima, nomeModelo);

  return {
    id: gerarId(marca, subpastasAcima, nomeModelo),
    nome: nomeModelo,
    marca,
    categoria,
    caminho: caminhoRelativo(modeloPath),
    subpastas: subpastasAcima,
    medidas: medidas || null,
    informacoes: informacoes || null,
    linkReferencia: linkFile || null,
    imagens: imagensRaiz,
    variacoes: variacoes.length > 0 ? variacoes : [],
    todasImagens,
  };
}

let idCounter = 1;
function gerarId(marca, subpastas, nome) {
  return `${idCounter++}`;
}

/**
 * Percorre recursivamente uma pasta de marca.
 * Detecta se uma pasta é um "modelo" (tem imagens diretas ou subpastas com imagens)
 * ou é uma pasta de agrupamento (ex: "cama", "rack").
 */
function processarPasta(dirPath, marca, subpastasAcima) {
  const produtos = [];
  if (!fs.existsSync(dirPath)) return produtos;

  const entries = fs.readdirSync(dirPath);
  const subDirs = entries.filter(e => {
    try {
      return fs.statSync(path.join(dirPath, e)).isDirectory();
    } catch {
      return false;
    }
  });

  const imagensAqui = listarImagensDiretorio(dirPath);

  // Se tem imagens diretas OU subpastas com imagens → é um modelo
  const subDirsComImagens = subDirs.filter(sub => {
    const imgs = listarImagensDiretorio(path.join(dirPath, sub));
    return imgs.length > 0;
  });

  const ehModelo = imagensAqui.length > 0 || subDirsComImagens.length > 0;

  if (ehModelo) {
    const nomeModelo = path.basename(dirPath);
    const produto = processarModelo(dirPath, marca, subpastasAcima, nomeModelo);
    if (produto) produtos.push(produto);

    // Sub-pastas que NÃO têm imagens próprias podem ser sub-modelos; processar recursivamente
    const subDirsSemImagens = subDirs.filter(sub => !subDirsComImagens.includes(sub));
    for (const sub of subDirsSemImagens) {
      const subPath = path.join(dirPath, sub);
      const novosSubpastas = [...subpastasAcima, path.basename(dirPath)];
      produtos.push(...processarPasta(subPath, marca, novosSubpastas));
    }
  } else {
    // Pasta de agrupamento — recursar nos filhos
    for (const sub of subDirs) {
      const subPath = path.join(dirPath, sub);
      const novosSubpastas = [...subpastasAcima, path.basename(dirPath)];
      produtos.push(...processarPasta(subPath, marca, novosSubpastas));
    }
  }

  return produtos;
}

function main() {
  const marcaDirs = fs.readdirSync(CATALOGO_ROOT).filter(nome => {
    if (PASTAS_IGNORAR.has(nome)) return false;
    try {
      return fs.statSync(path.join(CATALOGO_ROOT, nome)).isDirectory();
    } catch {
      return false;
    }
  });

  const todos = [];

  for (const marca of marcaDirs) {
    const marcaPath = path.join(CATALOGO_ROOT, marca);

    // Link de referência da marca (nível raiz)
    const linkMarca = lerArquivoTexto(path.join(marcaPath, 'LINK-DO-SITE-REFERENCIAS-E-PRODUTOS.txt'));

    const subDirs = fs.readdirSync(marcaPath).filter(e => {
      try {
        return fs.statSync(path.join(marcaPath, e)).isDirectory();
      } catch {
        return false;
      }
    });

    for (const sub of subDirs) {
      const subPath = path.join(marcaPath, sub);
      const produtos = processarPasta(subPath, marca, [sub]);

      // Propaga link da marca para produtos que não têm link próprio
      if (linkMarca) {
        for (const p of produtos) {
          if (!p.linkReferencia) p.linkReferencia = linkMarca;
        }
      }

      todos.push(...produtos);
    }

    // Verifica se a própria pasta de marca tem imagens (sem subcategorias)
    const imagensMarca = listarImagensDiretorio(marcaPath);
    if (imagensMarca.length > 0 && subDirs.length === 0) {
      todos.push({
        id: gerarId(marca, [], marca),
        nome: marca,
        marca,
        categoria: detectarCategoria(marca, [], marca),
        caminho: caminhoRelativo(marcaPath),
        subpastas: [],
        medidas: lerArquivoTexto(path.join(marcaPath, 'medidas.txt')),
        informacoes: null,
        linkReferencia: linkMarca || null,
        imagens: imagensMarca.map(caminhoRelativo),
        variacoes: [],
        todasImagens: imagensMarca.map(caminhoRelativo),
      });
    }
  }

  const outputDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(todos, null, 2), 'utf8');

  console.log(`✅ ${todos.length} produtos gerados em ${OUTPUT_FILE}`);

  // Resumo por marca
  const porMarca = {};
  for (const p of todos) {
    porMarca[p.marca] = (porMarca[p.marca] || 0) + 1;
  }
  for (const [marca, count] of Object.entries(porMarca).sort()) {
    console.log(`   ${marca}: ${count} produto(s)`);
  }

  // Resumo por categoria
  const porCat = {};
  for (const p of todos) {
    porCat[p.categoria] = (porCat[p.categoria] || 0) + 1;
  }
  console.log('\n📦 Por categoria:');
  for (const [cat, count] of Object.entries(porCat).sort()) {
    console.log(`   ${cat}: ${count}`);
  }
}

main();
