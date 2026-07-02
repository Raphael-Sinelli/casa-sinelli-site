import produtosData from '@/data/produtos.json';
import type { Produto } from './tipos';

const EXTENSOES_DISPLAY = new Set(['jpg', 'jpeg', 'png', 'webp', 'gif']);

export function todosOsProdutos(): Produto[] {
  return produtosData as Produto[];
}

export function produtoPorId(id: string): Produto | undefined {
  return (produtosData as Produto[]).find((p) => p.id === id);
}

export function produtosPorCategoria(categoria: string): Produto[] {
  return (produtosData as Produto[]).filter(
    (p) => slugify(p.categoria) === slugify(categoria)
  );
}

export function todasCategorias(): { nome: string; slug: string; total: number }[] {
  const contagem = new Map<string, number>();
  for (const p of produtosData as Produto[]) {
    contagem.set(p.categoria, (contagem.get(p.categoria) ?? 0) + 1);
  }
  return Array.from(contagem.entries())
    .map(([nome, total]) => ({ nome, slug: slugify(nome), total }))
    .sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
}

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

export function imagensDisplayDaVariacao(produto: Produto, cor: string): string[] {
  const variacao = produto.variacoes.find((v) => v.cor === cor);
  return (variacao?.imagens ?? []).filter(isImagemDisplay);
}

export function buscarProdutos(produtos: Produto[], query: string): Produto[] {
  const q = query.toLowerCase().trim();
  if (!q) return produtos;
  return produtos.filter(
    (p) =>
      p.nome.toLowerCase().includes(q) ||
      p.categoria.toLowerCase().includes(q)
  );
}

export function mensagemWhatsApp(nomeProduto: string): string {
  const msg = `Olá! Tenho interesse no ${nomeProduto} da Casa Sinelli.`;
  return `https://wa.me/5511971776165?text=${encodeURIComponent(msg)}`;
}

export function imagemUrl(caminho: string): string {
  return encodeURI(`/api/catalogo${caminho}`);
}

export function ehTamanho(cor: string): boolean {
  return /^\d[\d,.]*\s*[mMcC]/i.test(cor.trim());
}

export function variacoesDisplay(produto: Produto): import('./tipos').Variacao[] {
  return produto.variacoes.filter((v) => v.imagens.some(isImagemDisplay));
}
