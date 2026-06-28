import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { todosOsProdutos, produtoPorId, mensagemWhatsApp, slugify } from '@/lib/produtos';
import ProductDetailClient from '@/components/ProductDetailClient';

type Props = { params: Promise<{ id: string }> };

export async function generateStaticParams() {
  return todosOsProdutos().map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const produto = produtoPorId(id);
  if (!produto) return { title: 'Produto não encontrado' };

  const descricao = [
    produto.medidas,
    produto.informacoes?.slice(0, 120),
  ]
    .filter(Boolean)
    .join(' — ')
    .slice(0, 155);

  return {
    title: produto.nome,
    description: descricao || `${produto.nome} da marca ${produto.marca}. Consulte disponibilidade e cores pelo WhatsApp.`,
    openGraph: {
      title: produto.nome,
      description: descricao,
      type: 'website',
    },
  };
}

export default async function ProdutoPage({ params }: Props) {
  const { id } = await params;
  const produto = produtoPorId(id);
  if (!produto) notFound();

  const whatsappUrl = mensagemWhatsApp(produto.nome);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: produto.nome,
    brand: { '@type': 'Brand', name: produto.marca },
    category: produto.categoria,
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-marrom transition-colors">Início</Link>
          <span>/</span>
          <Link href="/catalogo" className="hover:text-marrom transition-colors">Catálogo</Link>
          <span>/</span>
          <Link href={`/categoria/${slugify(produto.categoria)}`} className="hover:text-marrom transition-colors">
            {produto.categoria}
          </Link>
          <span>/</span>
          <span className="text-marrom font-medium line-clamp-1">{produto.nome}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* Coluna esquerda: galeria + seletor de cor */}
          <div className="lg:sticky lg:top-24">
            <ProductDetailClient produto={produto} />
          </div>

          {/* Coluna direita: informações */}
          <div className="flex flex-col gap-6">
            <div>
              <p className="text-sm text-marrom-claro font-semibold uppercase tracking-wider mb-1">
                {produto.marca}
              </p>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-marrom leading-tight">
                {produto.nome}
              </h1>
              <p className="mt-2 text-marrom/60 font-medium">{produto.categoria}</p>
            </div>

            {produto.variacoes.length > 1 && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="w-2 h-2 rounded-full bg-oliva inline-block" />
                {produto.variacoes.length} variações disponíveis
              </div>
            )}

            {/* Medidas */}
            {produto.medidas && (
              <div className="bg-marrom-palido/50 rounded-2xl p-5">
                <h2 className="font-semibold text-marrom mb-3 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
                  </svg>
                  Medidas
                </h2>
                <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">
                  {produto.medidas}
                </pre>
              </div>
            )}

            {/* Informações */}
            {produto.informacoes && (
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <h2 className="font-semibold text-marrom mb-3 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Informações Técnicas
                </h2>
                <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">
                  {produto.informacoes}
                </pre>
              </div>
            )}

            {/* Referência do fabricante */}
            {produto.linkReferencia && (
              <p className="text-xs text-gray-400">
                Fabricante:{' '}
                <a
                  href={produto.linkReferencia}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-marrom hover:underline"
                >
                  {new URL(produto.linkReferencia).hostname.replace('www.', '')}
                </a>
              </p>
            )}

            {/* CTA WhatsApp — visível desktop */}
            <div className="hidden lg:block">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold text-lg py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Enviar pelo WhatsApp
              </a>
              <p className="text-xs text-center text-gray-500 mt-2">
                Clique para enviar uma mensagem sobre este produto diretamente
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
