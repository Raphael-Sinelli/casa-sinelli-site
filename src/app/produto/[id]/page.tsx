import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  todosOsProdutos,
  produtoPorId,
  relacionadosDoProduto,
  vizinhosNaCategoria,
} from '@/lib/catalogo-server';
import {
  capaProduto,
  contarCores,
  slugify,
  variacoesDisplay,
} from '@/lib/catalogo-utils';
import { imagemUrl, mapaUrlsProduto } from '@/lib/imagens';
import { mensagemProduto } from '@/lib/whatsapp';
import ProductDetailClient from '@/components/ProductDetailClient';
import BotaoWhatsApp from '@/components/BotaoWhatsApp';
import CompartilharProduto from '@/components/CompartilharProduto';
import ProductCard from '@/components/ProductCard';
import RevelarAoEntrar from '@/components/RevelarAoEntrar';

type Props = { params: Promise<{ id: string }> };

export async function generateStaticParams() {
  return todosOsProdutos().map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const produto = produtoPorId(id);
  if (!produto) notFound();

  const descricao = (
    produto.descricao ??
    [produto.medidas, produto.informacoes?.slice(0, 120)]
      .filter(Boolean)
      .join(' — ')
  ).slice(0, 155);

  return {
    title: produto.nome,
    description: descricao || `${produto.nome} — Casa Sinelli. Consulte disponibilidade e opções pelo WhatsApp.`,
    openGraph: {
      title: `${produto.nome} — Casa Sinelli`,
      description: descricao,
      type: 'website',
    },
  };
}

function LinhasMedidas({ medidas }: { medidas: string }) {
  const linhas = medidas
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);
  const curtas = linhas.filter((l) => l.length <= 60);
  const longas = linhas.filter((l) => l.length > 60);
  return (
    <div>
      <h2 className="text-xs font-mono uppercase tracking-widest text-marca mb-3">Medidas</h2>
      {curtas.length > 0 && (
        <div className="flex flex-col items-start gap-2">
          {curtas.map((linha) => (
            <span key={linha} className="etiqueta">{linha}</span>
          ))}
        </div>
      )}
      {longas.map((linha) => (
        <p key={linha} className="text-sm text-grafite/75 leading-relaxed mt-3">{linha}</p>
      ))}
    </div>
  );
}

function InfoTecnica({ informacoes }: { informacoes: string }) {
  const linhas = informacoes
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);
  return (
    <div className="border-t border-grafite/20 pt-4">
      <h2 className="text-xs font-mono uppercase tracking-widest text-marca mb-3">
        Informações técnicas
      </h2>
      <ul className="text-sm text-grafite/80 leading-relaxed divide-y divide-grafite/8">
        {linhas.map((linha) => (
          <li key={linha} className="py-1.5 first:pt-0 last:pb-0">{linha}</li>
        ))}
      </ul>
    </div>
  );
}

export default async function ProdutoPage({ params }: Props) {
  const { id } = await params;
  const produto = produtoPorId(id);
  if (!produto) notFound();

  const slugCategoria = slugify(produto.categoria);
  const { anterior, proximo } = vizinhosNaCategoria(produto);
  const relacionados = relacionadosDoProduto(produto);
  // há escolha visível na página (chips de cor/tamanho)? senão, linguagem segura
  const temEscolhaNosDados = variacoesDisplay(produto).length > 1 || contarCores(produto) >= 2;
  const capa = capaProduto(produto);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: produto.nome,
    category: produto.categoria,
    ...(capa ? { image: imagemUrl(capa) } : {}),
    offers: {
      '@type': 'Offer',
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'LocalBusiness',
        name: 'Casa Sinelli — Móveis & Colchões',
        telephone: '+55-11-97177-6165',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Av. Francisco Monteiro, 1320',
          addressLocality: 'Ribeirão Pires',
          addressRegion: 'SP',
          addressCountry: 'BR',
        },
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
        {/* Breadcrumb + navegação entre produtos */}
        <div className="flex items-center justify-between gap-4 mb-6 lg:mb-8">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-grafite/70 min-w-0">
            <Link href="/" className="hover:text-musgo-escuro transition-colors shrink-0">Início</Link>
            <span aria-hidden="true">/</span>
            <Link href={`/categoria/${slugCategoria}`} className="hover:text-musgo-escuro transition-colors shrink-0">
              {produto.categoria}
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-grafite font-medium truncate">{produto.nome}</span>
          </nav>

          <nav aria-label="Outros produtos da categoria" className="flex items-center gap-1 shrink-0">
            {anterior ? (
              <Link
                href={`/produto/${anterior.id}`}
                className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-grafite hover:bg-white border border-transparent hover:border-grafite/15 transition-colors"
                title={anterior.nome}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="hidden sm:inline">Anterior</span>
              </Link>
            ) : (
              <span className="invisible px-3 py-2 text-sm flex items-center gap-1" aria-hidden="true">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="hidden sm:inline">Anterior</span>
              </span>
            )}
            {proximo ? (
              <Link
                href={`/produto/${proximo.id}`}
                className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-grafite hover:bg-white border border-transparent hover:border-grafite/15 transition-colors"
                title={proximo.nome}
              >
                <span className="hidden sm:inline">Próximo</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ) : (
              <span className="invisible px-3 py-2 text-sm flex items-center gap-1" aria-hidden="true">
                <span className="hidden sm:inline">Próximo</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            )}
          </nav>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-6">
          {/* Título — primeiro no mobile, coluna direita no desktop */}
          <header className="hero-entrar [animation-delay:var(--hero-d1)] lg:col-start-2">
            <p className="font-mono text-xs uppercase tracking-widest text-marca mb-2">
              {produto.categoria}
            </p>
            <h1 className="font-serif text-3xl sm:text-4xl font-medium text-grafite leading-tight text-balance">
              {produto.nome}
            </h1>
          </header>

          {/* Galeria + variações */}
          <div className="hero-entrar lg:col-start-1 lg:row-start-1 lg:row-span-2 lg:sticky lg:top-24 self-start">
            <ProductDetailClient produto={produto} urls={mapaUrlsProduto(produto)} />
          </div>

          {/* Informações + CTA */}
          <div className="hero-entrar [animation-delay:var(--hero-d2)] lg:col-start-2 flex flex-col gap-6">
            <div>
              <BotaoWhatsApp tamanho="xl" larguraTotal mensagem={mensagemProduto(produto.nome)} />
              <p className="text-xs text-center text-grafite/70 mt-2">
                A mensagem já sai com o nome deste produto — fale direto com a loja.
              </p>
              <div className="mt-3">
                <CompartilharProduto nomeProduto={produto.nome} />
              </div>
              {!temEscolhaNosDados && (
                <p className="etiqueta mt-4">Outras cores e medidas: sob consulta na loja</p>
              )}
            </div>

            {produto.descricao && (
              <p className="text-base text-grafite/85 leading-relaxed">
                {produto.descricao}
              </p>
            )}

            {produto.medidas && <LinhasMedidas medidas={produto.medidas} />}

            {produto.informacoes && <InfoTecnica informacoes={produto.informacoes} />}
          </div>
        </div>

        {/* Parecidos — alternativas da mesma categoria para comparar na hora,
            sem voltar ao catálogo (uso direto na venda assistida) */}
        {relacionados.length > 0 && (
          <section
            aria-labelledby="titulo-parecidos"
            className="mt-14 lg:mt-20 pt-10 border-t border-grafite/12"
          >
            <div className="flex items-end justify-between gap-4 mb-7">
              <h2
                id="titulo-parecidos"
                className="font-serif text-3xl sm:text-4xl font-medium text-grafite"
              >
                Parecidos com este
              </h2>
              <Link
                href={`/categoria/${slugCategoria}`}
                className="group hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-musgo-escuro hover:underline underline-offset-4 shrink-0"
              >
                Ver todos em {produto.categoria}
                <svg className="w-4 h-4 transition-transform duration-[var(--dur-short)] group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            <RevelarAoEntrar className="selecao-grade flex gap-3 overflow-x-auto snap-x snap-mandatory scroll-px-4 -mx-4 px-4 pb-2 sm:pb-0 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-5 sm:overflow-visible">
              {relacionados.map((p) => (
                <div
                  key={p.id}
                  className="snap-start shrink-0 w-[72%] min-[421px]:w-[52%] sm:w-auto sm:shrink"
                >
                  <ProductCard
                    produto={p}
                    mostrarCategoria={false}
                    sizes="(max-width: 640px) 72vw, (max-width: 1024px) 50vw, 25vw"
                  />
                </div>
              ))}
            </RevelarAoEntrar>
            <Link
              href={`/categoria/${slugCategoria}`}
              className="sm:hidden mt-5 flex items-center justify-center gap-1.5 text-sm font-semibold text-musgo-escuro"
            >
              Ver todos em {produto.categoria}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </section>
        )}
      </div>
    </>
  );
}
