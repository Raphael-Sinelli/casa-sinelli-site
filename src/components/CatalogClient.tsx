'use client';

import { useDeferredValue, useEffect, useMemo, useRef, useState } from 'react';
import type { ProdutoResumo } from '@/lib/tipos';
import { buscarProdutos, slugify } from '@/lib/catalogo-utils';
import { MENSAGENS_WHATSAPP } from '@/lib/whatsapp';
import { useEscapeETravaScroll } from '@/hooks/useEscapeETravaScroll';
import BotaoWhatsApp from './BotaoWhatsApp';
import ProductCard from './ProductCard';
import LogoPoltrona from './LogoPoltrona';
import CategoryFilter from './CategoryFilter';
import SearchBar from './SearchBar';

interface CategoriaInfo {
  nome: string;
  slug: string;
  total: number;
}

interface Props {
  produtos: ProdutoResumo[];
  categorias: CategoriaInfo[];
  categoriaInicial?: string | null;
}

// Destaque 2×1 no desktop (xl, grade de 3 colunas): a cada 14 itens o card
// ocupa 2 colunas. 14 mantém as linhas sempre completas: cada destaque soma
// 1 célula extra, então a posição 15k é sempre início de linha (15k % 3 = 0).
const CADENCIA_DESTAQUE = 14;

export default function CatalogClient({ produtos, categorias, categoriaInicial = null }: Props) {
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<string | null>(categoriaInicial);
  const [busca, setBusca] = useState('');
  const [sheetAberto, setSheetAberto] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);
  const botaoFiltroRef = useRef<HTMLButtonElement>(null);
  const sheetJaAbriu = useRef(false);
  // o input responde na hora; a grade (127 cards) re-filtra em prioridade baixa
  const buscaDeferida = useDeferredValue(busca);

  // URL state: ?busca= é lido no mount (deep-link) e mantido via replaceState —
  // sem useSearchParams para não derrubar o HTML estático da rota (bailout CSR).
  // O setState pós-hidratação é intencional: inicializar direto do window no
  // useState causaria mismatch com o HTML estático (renderizado sem busca).
  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get('busca');
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (q) setBusca(q);
  }, []);

  useEscapeETravaScroll(sheetAberto, () => setSheetAberto(false));

  // Foco: entra no sheet ao abrir, volta ao botão ao fechar (nunca no mount)
  useEffect(() => {
    if (sheetAberto) {
      sheetJaAbriu.current = true;
      sheetRef.current?.focus();
    } else if (sheetJaAbriu.current) {
      botaoFiltroRef.current?.focus();
    }
  }, [sheetAberto]);

  const aoBuscar = (valor: string) => {
    setBusca(valor);
    const url = new URL(window.location.href);
    if (valor) url.searchParams.set('busca', valor);
    else url.searchParams.delete('busca');
    window.history.replaceState(null, '', url);
  };

  const produtosFiltrados = useMemo(() => {
    let lista = produtos;
    if (categoriaSelecionada) {
      lista = lista.filter((p) => slugify(p.categoria) === categoriaSelecionada);
    }
    return buscarProdutos(lista, buscaDeferida);
  }, [produtos, categoriaSelecionada, buscaDeferida]);

  const nomeCategoria = categorias.find((c) => c.slug === categoriaSelecionada)?.nome;

  const selecionarCategoria = (slug: string | null) => {
    setCategoriaSelecionada(slug);
    setSheetAberto(false);
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
        {/* Cabeçalho da listagem */}
        <header className="hero-entrar mb-7 lg:mb-9 pb-6 border-b border-grafite/12">
          <p className="etiqueta mb-4">
            {produtosFiltrados.length} produto{produtosFiltrados.length !== 1 ? 's' : ''}
            {busca && ` para “${busca}”`}
          </p>
          <h1 className="font-serif text-[clamp(38px,5vw,56px)] font-medium text-grafite leading-tight text-balance">
            {nomeCategoria ?? 'Catálogo completo'}
          </h1>
        </header>

        {/* Busca + filtro mobile */}
        <div className="mb-6 flex flex-col gap-3 lg:hidden">
          <SearchBar valor={busca} onChange={aoBuscar} />
          <button
            ref={botaoFiltroRef}
            onClick={() => setSheetAberto(true)}
            aria-expanded={sheetAberto}
            aria-controls="sheet-filtros"
            className="self-start flex items-center gap-2 text-sm font-semibold text-grafite border border-grafite/25 bg-white px-4 py-2.5 pointer-coarse:min-h-11 rounded-xl hover:border-grafite transition-colors focus-visible:outline-2 focus-visible:outline-musgo"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h18M6 12h12M10 19h4" />
            </svg>
            {categoriaSelecionada ? nomeCategoria : 'Filtrar por categoria'}
          </button>
        </div>

        <div className="flex gap-10 items-start">
          {/* Sidebar desktop — integrada ao fundo, sem cartão */}
          <aside className="hidden lg:block w-60 shrink-0">
            <div className="lg:sticky lg:top-24 flex flex-col min-h-0 lg:max-h-[calc(100vh-7.5rem)]">
              <div className="mb-5 shrink-0">
                <SearchBar valor={busca} onChange={aoBuscar} />
              </div>
              <CategoryFilter
                categorias={categorias}
                selecionada={categoriaSelecionada}
                onSelect={selecionarCategoria}
              />
            </div>
          </aside>

          {/* Grade de produtos */}
          <div className="flex-1 min-w-0">
            <h2 className="sr-only">Produtos</h2>
            {produtosFiltrados.length === 0 ? (
              <div className="max-w-md mx-auto text-center py-16 sm:py-24">
                <LogoPoltrona tamanho={64} className="mx-auto mb-5" />
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
                    onClick={() => { aoBuscar(''); setCategoriaSelecionada(null); }}
                    className="px-5 py-2.5 rounded-xl border border-grafite/30 text-sm font-semibold text-grafite hover:border-grafite hover:bg-white transition-colors focus-visible:outline-2 focus-visible:outline-musgo"
                  >
                    Limpar busca e filtros
                  </button>
                  <BotaoWhatsApp mensagem={MENSAGENS_WHATSAPP.catalogoVazio}>
                    Perguntar à loja
                  </BotaoWhatsApp>
                </div>
              </div>
            ) : (
              // key na categoria (nunca na busca): remonta com crossfade só em
              // ação discreta de filtro — digitação continua sem animação
              <div
                key={categoriaSelecionada ?? 'tudo'}
                className="grade-trocar grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5"
              >
                {produtosFiltrados.map((p, i) => {
                  const destaque =
                    produtosFiltrados.length > 8 && i % CADENCIA_DESTAQUE === 0;
                  return (
                    <div key={p.id} className={destaque ? 'xl:col-span-2' : undefined}>
                      <ProductCard
                        produto={p}
                        mostrarCategoria={!categoriaSelecionada}
                        sizes={
                          destaque
                            ? '(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 66vw'
                            : undefined
                        }
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom sheet de filtros (mobile) — montado sempre para o
          aria-controls resolver; visibilidade via hidden */}
      <div className="lg:hidden" hidden={!sheetAberto}>
        <div
          className="backdrop-entrar fixed inset-0 z-[75] bg-grafite/45"
          onClick={() => setSheetAberto(false)}
          aria-hidden="true"
        />
        <div
          ref={sheetRef}
          id="sheet-filtros"
          role="dialog"
          aria-modal="true"
          aria-label="Filtrar por categoria"
          tabIndex={-1}
          className="sheet-entrar fixed inset-x-0 bottom-0 z-[80] bg-cru rounded-t-2xl border-t border-grafite/12 max-h-[75dvh] overflow-y-auto overscroll-contain px-4 pt-3 pb-[max(1.25rem,env(safe-area-inset-bottom))] focus-visible:outline-none"
        >
          <div aria-hidden="true" className="mx-auto mb-3 h-1 w-10 rounded-full bg-grafite/20" />
          <CategoryFilter
            categorias={categorias}
            selecionada={categoriaSelecionada}
            onSelect={selecionarCategoria}
          />
        </div>
      </div>
    </div>
  );
}
