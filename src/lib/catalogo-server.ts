// Acesso aos dados do catálogo (produtos.json) — exclusivo do servidor.
// `server-only` faz o build falhar se um client component importar este módulo.
import 'server-only';

import produtosData from '@/data/produtos.json';
import type { Produto, ProdutoResumo } from './tipos';
import { capaProduto, contarCores, slugify } from './catalogo-utils';
import { imagemUrl } from './imagens';

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

// DTO do card: capa resolvida em URL, sem variações/medidas/informações —
// derruba o payload RSC do catálogo (127× Produto completo ≈ 1 MB de HTML).
export function resumoProduto(p: Produto): ProdutoResumo {
  const capa = capaProduto(p);
  return {
    id: p.id,
    nome: p.nome,
    categoria: p.categoria,
    capaUrl: capa ? imagemUrl(capa) : null,
    totalCores: contarCores(p),
  };
}

// Vitrine de alternativas na PDP: próximos produtos da mesma categoria em
// ordem circular a partir do atual — cada página mostra um conjunto diferente.
export function relacionadosDoProduto(produto: Produto, max = 4): ProdutoResumo[] {
  const lista = produtosPorCategoria(produto.categoria).filter((p) => p.id !== produto.id);
  if (lista.length === 0) return [];
  const i = produtosPorCategoria(produto.categoria).findIndex((p) => p.id === produto.id);
  const inicio = i === -1 ? 0 : i % lista.length;
  const roda = [...lista.slice(inicio), ...lista.slice(0, inicio)];
  return roda.slice(0, max).map(resumoProduto);
}

// Anterior/próximo dentro da mesma categoria, na ordem da listagem.
export function vizinhosNaCategoria(produto: Produto): {
  anterior: Produto | null;
  proximo: Produto | null;
} {
  const lista = produtosPorCategoria(produto.categoria);
  const i = lista.findIndex((p) => p.id === produto.id);
  if (i === -1) return { anterior: null, proximo: null };
  return {
    anterior: i > 0 ? lista[i - 1] : null,
    proximo: i < lista.length - 1 ? lista[i + 1] : null,
  };
}
