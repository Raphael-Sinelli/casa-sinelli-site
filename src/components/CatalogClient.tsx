'use client';

import { useState, useMemo } from 'react';
import type { Produto } from '@/lib/tipos';
import { buscarProdutos, slugify } from '@/lib/produtos';
import ProductCard from './ProductCard';
import CategoryFilter from './CategoryFilter';
import SearchBar from './SearchBar';
import SkeletonCard from './SkeletonCard';

interface CategoriaInfo {
  nome: string;
  slug: string;
  total: number;
}

interface Props {
  produtos: Produto[];
  categorias: CategoriaInfo[];
  categoriaInicial?: string | null;
}

export default function CatalogClient({ produtos, categorias, categoriaInicial = null }: Props) {
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<string | null>(categoriaInicial);
  const [busca, setBusca] = useState('');
  const [sidebarAberta, setSidebarAberta] = useState(false);

  const produtosFiltrados = useMemo(() => {
    let lista = produtos;
    if (categoriaSelecionada) {
      lista = lista.filter((p) => slugify(p.categoria) === categoriaSelecionada);
    }
    return buscarProdutos(lista, busca);
  }, [produtos, categoriaSelecionada, busca]);

  const nomeCategoria = categorias.find((c) => c.slug === categoriaSelecionada)?.nome;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cabeçalho do catálogo */}
      <div className="bg-marrom text-white py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold mb-2">
            {nomeCategoria ?? 'Catálogo Completo'}
          </h1>
          <p className="text-white/70">
            {produtosFiltrados.length} produto{produtosFiltrados.length !== 1 ? 's' : ''} disponíve{produtosFiltrados.length !== 1 ? 'is' : 'l'}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Barra de busca */}
        <div className="mb-6 lg:hidden">
          <SearchBar valor={busca} onChange={setBusca} />
        </div>

        {/* Botão de filtro mobile */}
        <button
          onClick={() => setSidebarAberta(!sidebarAberta)}
          className="mb-4 flex items-center gap-2 text-sm font-semibold text-marrom border border-marrom/30 px-4 py-2 rounded-lg hover:bg-marrom-palido transition-colors lg:hidden"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h18M7 12h10M11 20h2" />
          </svg>
          {categoriaSelecionada ? nomeCategoria : 'Filtrar por categoria'}
        </button>

        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className={`w-56 shrink-0 ${sidebarAberta ? 'block' : 'hidden'} lg:block`}>
            <div className="lg:sticky lg:top-24 bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-col min-h-0 lg:max-h-[calc(100vh-7rem)]">
              <div className="hidden lg:block mb-4 shrink-0">
                <SearchBar valor={busca} onChange={setBusca} />
              </div>
              <CategoryFilter
                categorias={categorias}
                selecionada={categoriaSelecionada}
                onSelect={(slug) => {
                  setCategoriaSelecionada(slug);
                  setSidebarAberta(false);
                }}
              />
            </div>
          </aside>

          {/* Grade de produtos */}
          <div className="flex-1 min-w-0">
            {produtosFiltrados.length === 0 ? (
              <div className="text-center py-20 text-gray-500">
                <div className="text-6xl mb-4">🔍</div>
                <p className="text-lg font-medium">Nenhum produto encontrado</p>
                <p className="text-sm mt-1">Tente buscar por outro termo ou remova o filtro</p>
                <button
                  onClick={() => { setBusca(''); setCategoriaSelecionada(null); }}
                  className="mt-4 text-marrom hover:underline text-sm font-medium"
                >
                  Limpar filtros
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {produtosFiltrados.map((p) => (
                  <ProductCard key={p.id} produto={p} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
