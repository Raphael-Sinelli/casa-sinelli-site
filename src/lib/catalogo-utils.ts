// Funções puras do catálogo — sem import de JSON de dados, seguras para
// client components (não arrastam produtos.json/cloudinary-map para o bundle).
import type { Produto, Variacao } from './tipos';

const EXTENSOES_DISPLAY = new Set(['jpg', 'jpeg', 'png', 'webp', 'gif']);

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function isImagemDisplay(caminho: string): boolean {
  const ext = caminho.split('.').pop()?.toLowerCase() ?? '';
  return EXTENSOES_DISPLAY.has(ext);
}

export function primeiraImagemDisplay(produto: Produto): string | null {
  for (const variacao of produto.variacoes) {
    for (const img of variacao.imagens) {
      if (isImagemDisplay(img)) return img;
    }
  }
  for (const img of produto.todasImagens) {
    if (isImagemDisplay(img)) return img;
  }
  return null;
}

// capa do card: usa capa pre-selecionada no script (P1), fallback 1a imagem display
export function capaProduto(produto: Produto): string | null {
  return produto.capa ?? primeiraImagemDisplay(produto);
}

// minúsculas + sem acentos: "sofa" encontra "Sofá"
function normalizarBusca(str: string): string {
  return str.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
}

export function buscarProdutos<T extends { nome: string; categoria: string }>(
  produtos: T[],
  query: string
): T[] {
  const q = normalizarBusca(query).trim();
  if (!q) return produtos;
  return produtos.filter(
    (p) =>
      normalizarBusca(p.nome).includes(q) ||
      normalizarBusca(p.categoria).includes(q)
  );
}

// Nem toda variação é cor: fornecedores usam a pasta de 1º nível para medida
// ("2,10M", "110cm", "120x90"), contagem de peças ("5peças", "4Bocas") ou
// tamanho de cama ("casal branco"). Sem reconhecer esses padrões o seletor
// rotula tudo como "Cor" e cai no swatch hachurado.
const PADROES_TAMANHO = [
  /^\d[\d,.]*\s*m?$/i, // 2,10M | 1,80m | 2,70
  /^\d[\d,.]*\s*(cm|mm)/i, // 110cm | 17cmDeAltura
  /^[a-zà-ú]*\s*\d+\s*x\s*\d+$/i, // 120x90 | 120x088 | Lisy160x090
  /^\d+\s*(e\s*\d+\s*)?(peças|pecas|lugares|bocas|portas|gavetas)$/i, // 5peças | 2e3Lugares | 4Bocas
  /^(solteiro|casal|queen|quenn|king|bicama)\b/i, // casal | queen branco | solteiro preto e cinza
];

export function ehTamanho(cor: string): boolean {
  const t = cor.trim();
  return PADROES_TAMANHO.some((re) => re.test(t));
}

// Linha/modelo do fornecedor no 1º nível ("Cozinha Malta" vem nas versões Malta
// e Barcelona): não é cor nem medida, então vira chip de texto.
// Lista explícita de propósito: nome de linha é nome próprio, não tem padrão que
// o distinga de um nome de cor. A regra genérica "não achei no dicionário = é
// linha" apagaria o swatch hachurado — que é justamente o alarme de cor faltando
// no dicionário.
const NOMES_DE_LINHA = new Set(['malta', 'barcelona']);

export function ehLinha(cor: string): boolean {
  return NOMES_DE_LINHA.has(cor.trim().toLowerCase());
}

export function variacoesDisplay(produto: Produto): Variacao[] {
  return produto.variacoes.filter((v) => v.imagens.some(isImagemDisplay));
}

// "2,10M" -> "2,10 m" | "2,70" -> "2,70 m" | "JatobaAreia" -> "Jatoba Areia"
export function rotuloVariacao(cor: string): string {
  const t = cor.trim();
  const tamanho = t.match(/^(\d[\d,.]*)\s*m?$/i);
  if (tamanho) return `${tamanho[1]} m`;
  return (
    t
      .replace(/[-_]+/g, ' ')
      .replace(/([a-zà-ú])([A-ZÀ-Ú])/g, '$1 $2')
      // Subpasta de cor com o tamanho repetido no nome ("Azul 2.30",
      // "Preto 2.30m"): a variação-pai já é o tamanho, aqui é ruído.
      .replace(/\s+\d+[.,]\d+\s*m?$/i, '')
      .replace(/\s+/g, ' ')
      .trim()
  );
}

export interface GrupoCor {
  cor: string | null; // null = fotos soltas, sem subpasta de cor
  imagens: string[];
}

// Swatch visual do seletor de cor — resolve o nome bruto da variação (pasta
// de origem, ex.: "JatobaGrafite", "Cinamomo Off White", "casal preto e cinza")
// para uma amostra real, sem depender de curadoria manual por produto.
// Madeiras/neutros ficam nos tokens da marca (jatobá≈marca, grafite, cru);
// tecidos (sofás/poltronas) usam a cor real — não faz sentido fingir um
// estofado azul de verde-oliva só pra "caber na paleta".
export type Swatch =
  | { tipo: 'solido'; cor: string }
  | { tipo: 'multi'; cores: string[] } // 2+ acabamentos na mesma variação
  | { tipo: 'desconhecida' };

// Tons de madeira conferidos contra a foto real do produto (amostragem do
// pixel dominante), não pelo que o nome sugere: "ipê" e "jequitibá" são
// escuros no catálogo, e "noce" seria marrom médio — não nogueira escura.
const CORES_SWATCH: Record<string, string> = {
  // neutros
  branco: '#FFFFFF',
  offwhite: 'var(--color-cru)',
  off: 'var(--color-cru)', // fornecedor abrevia: "JequitibaOff", "CINAMOMO OFF"
  creme: 'var(--color-cru)',
  cru: 'var(--color-cru)',
  gelo: 'var(--color-cru)',
  perola: '#D8D6C8',
  // madeira "escura" — cinamomo/jatobá ≈ tom da marca
  cinamomo: 'var(--color-marca)',
  jatoba: 'var(--color-marca)',
  caramelo: 'var(--color-marca)',
  ipe: '#483C30',
  jequitiba: '#7A6248',
  imbuia: '#805030',
  // grafite/preto
  grafite: 'var(--color-grafite)',
  chumbo: 'var(--color-grafite)',
  preto: 'var(--color-grafite)',
  preta: 'var(--color-grafite)',
  onix: '#3F3F44',
  // madeira média/clara
  cedro: '#9C6C48',
  freijo: '#C9A876',
  naturalle: '#C9A876',
  naturale: '#C9A876',
  nature: '#C9A876',
  teka: '#D9B583',
  amendoa: '#C0783C',
  mel: '#B08050',
  nogueira: '#8A6E52',
  cappuccino: '#8A6E52',
  bronze: '#8A6E52',
  // areia/bege
  areia: 'var(--color-areia)',
  bege: 'var(--color-areia)',
  linho: 'var(--color-areia)',
  arenas: '#B0AA9C',
  arena: '#B0AA9C',
  // cinza/prata
  cinza: '#9C9C96',
  prata: '#B7B7B0',
  prateado: '#B7B7B0',
  inox: '#B7B7B0',
  // cores reais de tecido — sem restrição de paleta, são a cor real do produto
  azul: '#3B5A7A',
  bordo: '#6B2333',
  vinho: '#6B2333',
  marrom: '#6B4A34',
  rose: '#C98FA0',
  rosa: '#C98FA0',
  verde: 'var(--color-musgo)',
  vermelha: '#8C2F2F',
  vermelho: '#8C2F2F',
  terracota: '#B85A28',
  tauri: '#B5673C',
  menta: '#93BFB0',
  turquesa: '#3E8E86',
  gold: '#B8964B',
  dourado: '#B8964B',
};

// "JatobaAreia" / "OFF-WHITE-FREIJO" / "casal preto e cinza" -> tokens
// reconhecíveis, ignorando qualificadores (tamanho de cama, conjunções) que
// não são cor. O camelCase precisa ser separado ANTES do lowercase: as pastas
// do fornecedor vêm grudadas ("JatobaAreia", "JequitibaOff") e sem isso a
// string vira um token único que não casa com nada e cai no hachurado.
function tokensDeCor(corBruta: string): string[] {
  const limpo = corBruta
    .replace(/([a-zà-ú])([A-ZÀ-Ú])/g, '$1 $2')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[-_/]+/g, ' ')
    .trim();
  const brutos = limpo.split(/\s+/).filter(Boolean);
  const tokens: string[] = [];
  for (let i = 0; i < brutos.length; i++) {
    if (brutos[i] === 'off' && brutos[i + 1] === 'white') {
      tokens.push('offwhite');
      i++;
      continue;
    }
    if (brutos[i] === 'e' || brutos[i] === 'de') continue; // conjunção/preposição
    tokens.push(brutos[i]);
  }
  return tokens;
}

export function resolverSwatch(corBruta: string): Swatch {
  const achadas = tokensDeCor(corBruta)
    .map((t) => CORES_SWATCH[t])
    .filter((c): c is string => Boolean(c));
  const unicas = Array.from(new Set(achadas));
  if (unicas.length === 0) return { tipo: 'desconhecida' };
  if (unicas.length === 1) return { tipo: 'solido', cor: unicas[0] };
  // Todos os acabamentos entram: cortar em 2 fazia "Naturalle Freijo Caramelo"
  // renderizar igual a "Naturalle Freijo" — duas variações, um swatch só.
  return { tipo: 'multi', cores: unicas };
}

// Subpastas que não são cor: pasta técnica, medida, ou tipo de base.
function ehSubpastaDeCor(bruta: string): boolean {
  if (/^convertidas?$/i.test(bruta)) return false;
  if (/^(bau|baú|normal)$/i.test(bruta)) return false; // Box: tipo de base
  if (ehTamanho(bruta)) return false; // "17cmDeAltura"
  return true;
}

// Fallback quando não há subpasta: alguns fornecedores põem a cor no nome do
// arquivo ("cinza.webp", "rosa claro-rose.png") em vez de agrupar em pasta.
// Sem isso o produto inteiro cai num grupo null e perde o seletor de cor.
// Qualificadores que acompanham cor sem serem cor ("rosa claro").
const QUALIFICADORES = new Set(['claro', 'clara', 'escuro', 'escura', 'fosco', 'fosca']);

function corDoNomeDoArquivo(caminho: string): string | null {
  const base = caminho.split('/').pop() ?? '';
  const semExt = base
    .replace(/\.[^.]+$/, '')
    // tamanho repetido no arquivo dentro da pasta do tamanho
    // ("casal/casal marrom.png"): no rótulo da cor é ruído.
    .replace(/^(solteir[oa]|casal|queen|quenn|king)\s+/i, '')
    .trim();
  if (!semExt) return null;
  // Só vale se o arquivo for SÓ cor ("cinza", "rosa claro-rose"). Nome de foto
  // que por acaso cita a cor ("COZINHA MONZA 5 PCS FREIJO CHUMBO RGB") não é
  // nome de cor — viraria uma cor fantasma no seletor.
  const tokens = tokensDeCor(semExt);
  if (!tokens.length) return null;
  const soCor = tokens.every((t) => t in CORES_SWATCH || QUALIFICADORES.has(t));
  return soCor ? semExt : null;
}

// Dentro de uma variação (pasta de 1º nível, geralmente tamanho), agrupa as
// imagens pela subpasta de 2º nível quando ela existir (geralmente cor), ou
// pelo nome do arquivo quando não existir.
export function gruposDeCor(produto: Produto, corVariacao: string): GrupoCor[] {
  const variacao = produto.variacoes.find((v) => v.cor === corVariacao);
  const imagens = (variacao?.imagens ?? []).filter(isImagemDisplay);
  const prefixo = `${produto.caminho}/${corVariacao}/`;
  // O fallback por nome de arquivo só vale quando a variação-pai é tamanho: aí
  // a cor ainda não foi escolhida. Se o 1º nível já É a cor (ex.: "Ipe"), o
  // nome do arquivo é só o nome da foto e viraria uma cor fantasma.
  const paiEhTamanho = ehTamanho(corVariacao);
  const grupos = new Map<string | null, string[]>();
  for (const img of imagens) {
    const rel = img.startsWith(prefixo) ? img.slice(prefixo.length) : '';
    const partes = rel.split('/');
    const bruta = partes.length > 1 ? partes[0] : null;
    const chave = bruta
      ? ehSubpastaDeCor(bruta)
        ? bruta
        : null
      : paiEhTamanho
        ? corDoNomeDoArquivo(img)
        : null;
    grupos.set(chave, [...(grupos.get(chave) ?? []), img]);
  }
  return Array.from(grupos.entries()).map(([cor, imgs]) => ({ cor, imagens: imgs }));
}

// Cores distintas realmente presentes nos dados (pastas de variação): nomes
// no 1º nível quando não são tamanho, ou subpastas de 2º nível (gruposDeCor).
// Rótulo normalizado deduplica grafias ("JatobaAreia" ≡ "Jatoba-Areia").
export function contarCores(produto: Produto): number {
  const cores = new Set<string>();
  for (const v of variacoesDisplay(produto)) {
    if (ehLinha(v.cor)) continue; // linha/modelo não é cor: não entra na contagem do card
    if (!ehTamanho(v.cor)) {
      cores.add(rotuloVariacao(v.cor).toLowerCase());
      continue;
    }
    for (const g of gruposDeCor(produto, v.cor)) {
      if (g.cor) cores.add(rotuloVariacao(g.cor).toLowerCase());
    }
  }
  return cores.size;
}

// Variação que contém a capa — a página abre na mesma foto do card.
export function variacaoInicial(produto: Produto): string {
  const visiveis = variacoesDisplay(produto);
  if (produto.capa) {
    const dona = visiveis.find((v) => v.imagens.includes(produto.capa!));
    if (dona) return dona.cor;
  }
  return visiveis[0]?.cor ?? '';
}
