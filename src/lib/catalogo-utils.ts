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

export function ehTamanho(cor: string): boolean {
  return /^\d[\d,.]*\s*[mMcC]?$/i.test(cor.trim());
}

export function variacoesDisplay(produto: Produto): Variacao[] {
  return produto.variacoes.filter((v) => v.imagens.some(isImagemDisplay));
}

// "2,10M" -> "2,10 m" | "2,70" -> "2,70 m" | "JatobaAreia" -> "Jatoba Areia"
export function rotuloVariacao(cor: string): string {
  const t = cor.trim();
  const tamanho = t.match(/^(\d[\d,.]*)\s*m?$/i);
  if (tamanho) return `${tamanho[1]} m`;
  return t
    .replace(/[-_]+/g, ' ')
    .replace(/([a-zà-ú])([A-ZÀ-Ú])/g, '$1 $2')
    .replace(/\s+/g, ' ')
    .trim();
}

export interface GrupoCor {
  cor: string | null; // null = fotos soltas, sem subpasta de cor
  imagens: string[];
}

// Dentro de uma variação (pasta de 1º nível, geralmente tamanho), agrupa as
// imagens pela subpasta de 2º nível quando ela existir (geralmente cor).
export function gruposDeCor(produto: Produto, corVariacao: string): GrupoCor[] {
  const variacao = produto.variacoes.find((v) => v.cor === corVariacao);
  const imagens = (variacao?.imagens ?? []).filter(isImagemDisplay);
  const prefixo = `${produto.caminho}/${corVariacao}/`;
  const grupos = new Map<string | null, string[]>();
  for (const img of imagens) {
    const rel = img.startsWith(prefixo) ? img.slice(prefixo.length) : '';
    const partes = rel.split('/');
    // subpasta só conta como cor se não for pasta técnica (ex.: "convertidas")
    const bruta = partes.length > 1 ? partes[0] : null;
    const chave = bruta && !/^convertidas?$/i.test(bruta) ? bruta : null;
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
