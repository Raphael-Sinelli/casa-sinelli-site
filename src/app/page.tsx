import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import {
  todosOsProdutos,
  todasCategorias,
  produtosPorCategoria,
  capaProduto,
  imagemUrl,
  produtoPorId,
} from '@/lib/produtos';
import ProductCard from '@/components/ProductCard';
import Map from '@/components/Map';
import WhatsAppIcon from '@/components/WhatsAppIcon';
import { Truck, Hammer, MessageCircle, Store, MapPin, Clock, Phone, Mail, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Casa Sinelli — Móveis & Colchões em Ribeirão Pires',
  description:
    'Loja de móveis e colchões em Ribeirão Pires: sofás, guarda-roupas, cozinhas, camas e colchões com entrega e montagem no ABC. Atendimento pelo WhatsApp.',
};

const WHATSAPP_URL =
  'https://wa.me/5511971776165?text=Ol%C3%A1!%20Gostaria%20de%20conhecer%20os%20produtos%20da%20Casa%20Sinelli.';

// Curadoria editorial: mix de categorias com foto forte (ordem = vitrine)
const DESTAQUE_IDS = ['25', '28', '14', '60', '3', '24', '101', '66'];

// Produto da foto do hero — o ambiente mais forte do acervo
const HERO_PRODUTO_ID = '28';

const DIFERENCIAIS = [
  {
    Icone: Truck,
    titulo: 'Entrega na região',
    descricao: 'Entregamos em Ribeirão Pires e em toda a região do Grande ABC.',
  },
  {
    Icone: Hammer,
    titulo: 'Montagem inclusa',
    descricao: 'Nossos profissionais montam os móveis no seu ambiente, sem custo adicional.',
  },
  {
    Icone: MessageCircle,
    titulo: 'Atendimento pelo WhatsApp',
    descricao: 'Você fala direto com a loja: tira dúvidas, confere disponibilidade e fecha por lá.',
  },
  {
    Icone: Store,
    titulo: 'Loja física',
    descricao: 'Showroom na Av. Francisco Monteiro, 1320 — venha ver e sentir os móveis de perto.',
  },
];

const CATEGORIAS_DESTAQUE_SLUGS = [
  'guarda-roupa',
  'sofa',
  'cozinha',
  'comoda',
  'cama',
  'colchao',
];

export default function HomePage() {
  const produtos = todosOsProdutos();
  const categorias = todasCategorias();

  const heroProduto = produtoPorId(HERO_PRODUTO_ID);
  const heroCapa = heroProduto ? capaProduto(heroProduto) : null;

  const destaques = DESTAQUE_IDS
    .map((id) => produtoPorId(id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  const categoriasDestaque = CATEGORIAS_DESTAQUE_SLUGS
    .map((slug) => {
      const cat = categorias.find((c) => c.slug === slug);
      if (!cat) return null;
      const capa = capaProduto(produtosPorCategoria(slug)[0]);
      return capa ? { ...cat, capa } : null;
    })
    .filter((c): c is NonNullable<typeof c> => Boolean(c));

  const localBusinessJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FurnitureStore',
    name: 'Casa Sinelli — Móveis & Colchões',
    url: 'https://casasinelli.com.br',
    telephone: '+55-11-97177-6165',
    email: 'contato@casasinelli.com.br',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Av. Francisco Monteiro, 1320',
      addressLocality: 'Ribeirão Pires',
      addressRegion: 'SP',
      addressCountry: 'BR',
    },
    openingHoursSpecification: [
      { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday'], opens: '09:00', closes: '19:00' },
      { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Saturday'], opens: '09:00', closes: '17:00' },
    ],
    geo: { '@type': 'GeoCoordinates', latitude: -23.7152, longitude: -46.4131 },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
      />

      {/* ─── HERO ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-14 sm:pt-14 sm:pb-16 lg:pt-16 lg:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-14 items-center">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-jatoba mb-4">
              Móveis &amp; Colchões · Ribeirão Pires
            </p>
            <h1 className="font-serif text-[42px] sm:text-[54px] lg:text-6xl font-medium text-grafite leading-[1.06] tracking-tight">
              Móveis que fazem da sua casa <em className="italic text-vinho">a sua casa</em>
            </h1>
            <p className="mt-6 text-lg text-grafite/75 leading-relaxed max-w-[46ch]">
              Sofás, quartos completos, cozinhas e colchões escolhidos peça a peça — {produtos.length} produtos no catálogo. Loja física em Ribeirão Pires, entrega e montagem em todo o ABC.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3.5">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 bg-wa hover:bg-wa-escuro text-white font-bold text-base px-7 py-4 rounded-xl transition-colors focus-visible:outline-2 focus-visible:outline-vinho focus-visible:outline-offset-2"
              >
                <WhatsAppIcon className="w-5 h-5" />
                Consultar preço
              </a>
              <Link
                href="/catalogo"
                className="inline-flex items-center justify-center gap-2 border-[1.5px] border-grafite/30 hover:border-grafite text-grafite font-semibold text-base px-7 py-4 rounded-xl transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-vinho"
              >
                Ver catálogo
              </Link>
            </div>

            <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-2.5 text-sm text-grafite/65">
              <li className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-jatoba" strokeWidth={1.8} aria-hidden="true" />
                Av. Francisco Monteiro, 1320
              </li>
              <li className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-jatoba" strokeWidth={1.8} aria-hidden="true" />
                Seg–Sex 9h–19h · Sáb 9h–17h
              </li>
              <li className="flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-jatoba" strokeWidth={1.8} aria-hidden="true" />
                (11) 97177-6165
              </li>
            </ul>
          </div>

          {heroProduto && heroCapa && (
            <Link
              href={`/produto/${heroProduto.id}`}
              className="relative block group focus-visible:outline-2 focus-visible:outline-vinho focus-visible:outline-offset-4 rounded-t-[999px] rounded-b-2xl"
              aria-label={`Ver ${heroProduto.nome}`}
            >
              <span className="relative block aspect-[4/5] overflow-hidden rounded-t-[999px] rounded-b-2xl bg-areia/40">
                <Image
                  src={imagemUrl(heroCapa)}
                  alt={`${heroProduto.nome} no showroom da Casa Sinelli`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  quality={85}
                  className="object-cover transition-transform duration-500 motion-reduce:transition-none group-hover:scale-[1.02]"
                  loading="eager"
                  fetchPriority="high"
                />
              </span>
              <span className="etiqueta absolute bottom-4 left-4 group-hover:bg-cru transition-colors">
                {heroProduto.nome} — veja de perto
              </span>
            </Link>
          )}
        </div>
      </section>

      {/* ─── CATEGORIAS PRINCIPAIS ─── */}
      <section className="bg-white border-y border-grafite/8 py-14 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-4 mb-8">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-jatoba mb-1.5">
                {categorias.length} categorias
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl font-medium text-grafite">
                O que sua casa precisa
              </h2>
            </div>
            <Link
              href="/catalogo"
              className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-vinho hover:underline underline-offset-4 shrink-0"
            >
              Todas as categorias
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {categoriasDestaque.map((cat) => (
              <Link
                key={cat.slug}
                href={`/categoria/${cat.slug}`}
                className="group bg-cru rounded-2xl overflow-hidden border border-grafite/10 transition-all duration-200 motion-reduce:transition-none hover:shadow-[0_12px_32px_-12px_rgba(51,46,41,0.28)] hover:-translate-y-0.5 motion-reduce:hover:translate-y-0 focus-visible:outline-2 focus-visible:outline-vinho"
              >
                <span className="relative block aspect-[4/3] bg-white overflow-hidden">
                  <Image
                    src={imagemUrl(cat.capa)}
                    alt={cat.nome}
                    fill
                    sizes="(max-width: 1024px) 50vw, 33vw"
                    className="object-contain p-4 transition-transform duration-300 motion-reduce:transition-none group-hover:scale-[1.03]"
                  />
                </span>
                <span className="flex items-baseline justify-between gap-2 px-4 sm:px-5 py-3.5 border-t border-grafite/8">
                  <span className="font-serif text-lg sm:text-xl font-medium text-grafite group-hover:text-vinho transition-colors">
                    {cat.nome}
                  </span>
                  <span className="font-mono text-xs text-grafite/45 shrink-0">
                    {cat.total} {cat.total === 1 ? 'item' : 'itens'}
                  </span>
                </span>
              </Link>
            ))}
          </div>

          <Link
            href="/catalogo"
            className="sm:hidden mt-5 flex items-center justify-center gap-1.5 text-sm font-semibold text-vinho"
          >
            Todas as categorias
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
      </section>

      {/* ─── SELEÇÃO DA LOJA ─── */}
      <section className="py-14 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-jatoba mb-1.5">
              Seleção da loja
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-medium text-grafite">
              Peças que contam a nossa história
            </h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
            {destaques.map((p) => (
              <ProductCard key={p.id} produto={p} />
            ))}
          </div>
          <div className="mt-9 text-center">
            <Link
              href="/catalogo"
              className="inline-flex items-center gap-2 border-[1.5px] border-grafite/30 hover:border-grafite text-grafite font-semibold px-7 py-3.5 rounded-xl transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-vinho"
            >
              Ver o catálogo completo — {produtos.length} produtos
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── DIFERENCIAIS ─── */}
      <section className="bg-white border-y border-grafite/8 py-14 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl sm:text-4xl font-medium text-grafite text-center mb-10">
            Comprar móvel é com quem entrega e monta
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {DIFERENCIAIS.map(({ Icone, titulo, descricao }) => (
              <div key={titulo} className="bg-cru rounded-2xl border border-grafite/10 p-6">
                <span className="flex w-11 h-11 items-center justify-center rounded-xl bg-jatoba/10 mb-4">
                  <Icone className="w-5.5 h-5.5 text-jatoba" strokeWidth={1.8} aria-hidden="true" />
                </span>
                <h3 className="font-serif text-xl font-medium text-grafite mb-1.5">{titulo}</h3>
                <p className="text-sm text-grafite/70 leading-relaxed">{descricao}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── VISITE A LOJA ─── */}
      <section className="py-14 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-jatoba mb-1.5">
                Loja física
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl font-medium text-grafite mb-7">
                Venha sentar no sofá antes de escolher
              </h2>
              <ul className="space-y-5">
                <li className="flex gap-3.5 items-start">
                  <MapPin className="w-5 h-5 text-jatoba mt-0.5 shrink-0" strokeWidth={1.8} aria-hidden="true" />
                  <div>
                    <p className="font-semibold text-grafite">Endereço</p>
                    <p className="text-sm text-grafite/70 mt-0.5">
                      Av. Francisco Monteiro, 1320 — Vila Fiorentino<br />Ribeirão Pires - SP
                    </p>
                  </div>
                </li>
                <li className="flex gap-3.5 items-start">
                  <Clock className="w-5 h-5 text-jatoba mt-0.5 shrink-0" strokeWidth={1.8} aria-hidden="true" />
                  <div>
                    <p className="font-semibold text-grafite">Horário</p>
                    <p className="text-sm text-grafite/70 mt-0.5">
                      Segunda a sexta: 9h às 19h<br />Sábado: 9h às 17h
                    </p>
                  </div>
                </li>
                <li className="flex gap-3.5 items-start">
                  <Phone className="w-5 h-5 text-jatoba mt-0.5 shrink-0" strokeWidth={1.8} aria-hidden="true" />
                  <div>
                    <p className="font-semibold text-grafite">WhatsApp</p>
                    <a
                      href="https://wa.me/5511971776165"
                      className="text-sm text-vinho font-medium hover:underline underline-offset-4 mt-0.5 inline-block"
                    >
                      (11) 97177-6165
                    </a>
                  </div>
                </li>
                <li className="flex gap-3.5 items-start">
                  <Mail className="w-5 h-5 text-jatoba mt-0.5 shrink-0" strokeWidth={1.8} aria-hidden="true" />
                  <div>
                    <p className="font-semibold text-grafite">E-mail</p>
                    <a
                      href="mailto:contato@casasinelli.com.br"
                      className="text-sm text-vinho font-medium hover:underline underline-offset-4 mt-0.5 inline-block"
                    >
                      contato@casasinelli.com.br
                    </a>
                  </div>
                </li>
              </ul>
            </div>
            <Map />
          </div>
        </div>
      </section>

      {/* ─── CHAMADA FINAL ─── */}
      <section className="bg-grafite py-16 sm:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <span className="mx-auto mb-6 flex w-14 h-14 items-center justify-center rounded-full rounded-bl-sm bg-vinho text-cru font-serif italic font-semibold text-xl">
            CS
          </span>
          <h2 className="font-serif text-3xl sm:text-[40px] font-medium text-cru leading-tight mb-4">
            Achou a peça certa? A conversa é rápida.
          </h2>
          <p className="text-cru/70 text-lg mb-9 leading-relaxed">
            Chame no WhatsApp para saber preço, disponibilidade e condições — ou visite o showroom em Ribeirão Pires.
          </p>
          <div className="flex flex-col sm:flex-row gap-3.5 justify-center">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 bg-wa hover:bg-wa-escuro text-white font-bold text-base px-7 py-4 rounded-xl transition-colors focus-visible:outline-2 focus-visible:outline-areia focus-visible:outline-offset-2"
            >
              <WhatsAppIcon className="w-5 h-5" />
              Consultar preço
            </a>
            <Link
              href="/catalogo"
              className="inline-flex items-center justify-center border-[1.5px] border-cru/35 hover:border-cru text-cru font-semibold text-base px-7 py-4 rounded-xl transition-colors hover:bg-cru/5 focus-visible:outline-2 focus-visible:outline-areia"
            >
              Ver catálogo
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
