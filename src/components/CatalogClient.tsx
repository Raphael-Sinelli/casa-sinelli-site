'use client';

import { useMemo, useState } from 'react';
import type { Produto } from '@/lib/tipos';
import { buscarProdutos, slugify } from '@/lib/produtos';
import ProductCard from './ProductCard';
import CategoryFilter from './CategoryFilter';
import SearchBar from './SearchBar';
import WhatsAppIcon from './WhatsAppIcon';

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
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
        {/* Cabeçalho da listagem */}
        <header className="mb-7 lg:mb-9 pb-6 border-b border-grafite/12">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-jatoba mb-1.5">
            {produtosFiltrados.length} produto{produtosFiltrados.length !== 1 ? 's' : ''}
            {busca && ` para “${busca}”`}
          </p>
          <h1 className="font-serif text-4xl sm:text-[44px] font-medium text-grafite leading-tight">
            {nomeCategoria ?? 'Catálogo completo'}
          </h1>
        </header>

        {/* Busca + filtro mobile */}
        <div className="mb-6 flex flex-col gap-3 lg:hidden">
          <SearchBar valor={busca} onChange={setBusca} />
          <button
            onClick={() => setSidebarAberta(!sidebarAberta)}
            aria-expanded={sidebarAberta}
            className="self-start flex items-center gap-2 text-sm font-semibold text-grafite border border-grafite/25 bg-white px-4 py-2.5 rounded-xl hover:border-grafite transition-colors focus-visible:outline-2 focus-visible:outline-vinho"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h18M6 12h12M10 19h4" />
            </svg>
            {categoriaSelecionada ? nomeCategoria : 'Filtrar por categoria'}
          </button>
        </div>

        <div className="flex gap-8 items-start">
          {/* Sidebar */}
          <aside className={`w-60 shrink-0 ${sidebarAberta ? 'block' : 'hidden'} lg:block`}>
            <div className="lg:sticky lg:top-24 bg-white rounded-2xl border border-grafite/10 p-4 flex flex-col min-h-0 lg:max-h-[calc(100vh-7.5rem)]">
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
              <div className="max-w-md mx-auto text-center py-16 sm:py-24">
                <span className="mx-auto mb-5 flex w-14 h-14 items-center justify-center rounded-full rounded-bl-sm bg-jatoba text-cru font-serif italic font-semibold text-xl">
                  CS
                </span>
                <h2 className="font-serif text-2xl font-medium text-grafite">
                  Nenhum produto encontrado
                </h2>
                <p className="text-sm text-grafite/60 mt-2 leading-relaxed">
                  {busca
                    ? <>Nada por aqui para <strong>“{busca}”</strong>. Confira a grafia ou explore as categorias ao lado.</>
                    : 'Nada por aqui com esses filtros. Explore as categorias ou veja o catálogo completo.'}
                </p>
                <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={() => { setBusca(''); setCategoriaSelecionada(null); }}
                    className="px-5 py-2.5 rounded-xl border border-grafite/30 text-sm font-semibold text-grafite hover:border-grafite hover:bg-white transition-colors focus-visible:outline-2 focus-visible:outline-vinho"
                  >
                    Limpar busca e filtros
                  </button>
                  <a
                    href="https://wa.me/5511971776165?text=Ol%C3%A1!%20N%C3%A3o%20encontrei%20o%20que%20procurava%20no%20cat%C3%A1logo.%20Podem%20me%20ajudar%3F"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-wa hover:bg-wa-escuro text-white text-sm font-semibold transition-colors"
                  >
                    <WhatsAppIcon className="w-4 h-4" />
                    Perguntar à loja
                  </a>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {produtosFiltrados.map((p) => (
                  <ProductCard
                    key={p.id}
                    produto={p}
                    mostrarCategoria={!categoriaSelecionada}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
