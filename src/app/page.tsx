import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import {
  todosOsProdutos,
  todasCategorias,
  produtosPorCategoria,
  produtoPorId,
  resumoProduto,
} from '@/lib/catalogo-server';
import { capaProduto } from '@/lib/catalogo-utils';
import { imagemUrl } from '@/lib/imagens';
import {
  MENSAGENS_WHATSAPP,
  WHATSAPP_TELEFONE_FORMATADO,
  WHATSAPP_URL,
} from '@/lib/whatsapp';
import BotaoWhatsApp from '@/components/BotaoWhatsApp';
import ProductCard from '@/components/ProductCard';
import LogoPoltrona from '@/components/LogoPoltrona';
import Map from '@/components/Map';
import RevelarAoEntrar from '@/components/RevelarAoEntrar';
import { Truck, Hammer, MessageCircle, Store, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Casa Sinelli — Móveis & Colchões em Ribeirão Pires',
  description:
    'Loja de móveis e colchões em Ribeirão Pires: sofás, guarda-roupas, cozinhas, camas e colchões com entrega e montagem no ABC. Atendimento pelo WhatsApp.',
};

// Curadoria editorial: mix de categorias com foto forte (ordem = vitrine)
const DESTAQUE_IDS = ['25', '28', '14', '60', '3', '24', '101', '66'];

// Produto da foto do hero — o ambiente mais forte do acervo
const HERO_PRODUTO_ID = '80';

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
    .filter((p): p is NonNullable<typeof p> => Boolean(p))
    .map(resumoProduto);

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

      {/* ─── HERO — composição em camadas sobre a linha de piso do showroom ─── */}
      <section
        data-motion-hero="secao"
        className="relative overflow-hidden max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-14 sm:pt-10 sm:pb-16 lg:pt-12 lg:pb-20"
      >
        <div className="relative grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-8 lg:gap-12 items-end">
          {/* Tipo fantasma monumental: "casa" assentada na linha de piso, a
              cauda atravessa por trás da foto-arco (camada mais funda do
              portal — o parallax do GSAP move este plano mais devagar).
              Só na composição de 2 colunas (lg+): no stack mobile não há
              interplay com a foto e a palavra vira ruído atrás do texto. */}
          <span
            aria-hidden="true"
            data-motion-hero="fantasma"
            className="fantasma-hero hidden lg:block pointer-events-none select-none absolute bottom-0 left-0 z-0 font-serif italic font-medium whitespace-nowrap leading-[0.72] tracking-[-0.03em] text-grafite/[0.07] text-[clamp(84px,23vw,330px)]"
          >
            casa
          </span>
          <div className="flex flex-col lg:block lg:pb-6">
            {/* máscara do título: o pb/-mb compensa o sublinhado caligráfico
                que desenha abaixo da caixa do texto (senão a máscara o corta) */}
            <div className="overflow-hidden pb-3 -mb-3 lg:relative lg:z-10 lg:-mr-44">
            <h1 className="titulo-erguer [animation-delay:var(--hero-d1)] font-serif text-[clamp(44px,7vw,84px)] font-medium text-grafite leading-[1.02] tracking-[-0.02em] text-balance">
              Móveis que fazem da sua casa{' '}
              <em className="italic text-musgo relative inline-block">
                a sua casa
                {/* traço caligráfico — desenhado depois que o título assenta */}
                <svg
                  viewBox="0 0 220 14"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                  className="sublinhado-hero absolute left-0 right-0 -bottom-1.5 sm:-bottom-2.5 w-full h-2 sm:h-2.5 text-marca/60"
                >
                  <path
                    d="M5 10 C 60 3, 150 2, 215 8"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="5"
                    strokeLinecap="round"
                    pathLength="1"
                  />
                </svg>
              </em>
            </h1>
            </div>
            <p className="hero-entrar [animation-delay:var(--hero-d2)] order-3 mt-6 text-lg text-grafite/75 leading-relaxed max-w-[46ch]">
              Sofás, quartos completos, cozinhas e colchões escolhidos peça a peça — {produtos.length} produtos no catálogo. Loja física em Ribeirão Pires, entrega e montagem em todo o ABC.
            </p>
            <div className="hero-entrar [animation-delay:var(--hero-d3)] order-2 mt-6 lg:mt-8 flex flex-col sm:flex-row gap-3.5">
              <BotaoWhatsApp tamanho="lg" mensagem={MENSAGENS_WHATSAPP.padrao} />
              <Link
                href="/catalogo"
                className="group inline-flex items-center justify-center gap-2 border-[1.5px] border-grafite/30 hover:border-grafite text-grafite font-semibold text-base px-7 py-4 rounded-xl transition-[border-color,background-color,transform] duration-[var(--dur-short)] touch-manipulation active:scale-[var(--motion-scale-active)] motion-reduce:transition-none motion-reduce:active:scale-100 hover:bg-white focus-visible:outline-2 focus-visible:outline-musgo"
              >
                Ver catálogo
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0" aria-hidden="true" />
              </Link>
            </div>

            <p className="etiqueta-pousar [animation-delay:var(--hero-d4)] etiqueta order-4 mt-8 lg:mt-10 max-w-full">
              <span>
                Av. Francisco Monteiro, 1320 — Ribeirão Pires
                <br />
                Seg–Sex 9h–19h · Sáb 9h–17h · (11) 97177-6165
              </span>
            </p>
          </div>

          {heroProduto && heroCapa && (
            <Link
              href={`/produto/${heroProduto.id}`}
              data-motion-hero="foto"
              className="order-first lg:order-none relative block group focus-visible:outline-2 focus-visible:outline-musgo focus-visible:outline-offset-4 rounded-t-[999px] rounded-b-2xl"
              aria-label={`${heroProduto.nome} — veja de perto`}
            >
              {/* sombra de assentamento — o arco pousa no chão do ambiente */}
              <span
                aria-hidden="true"
                className="hero-entrar [animation-delay:var(--hero-d3)] absolute -bottom-4 left-1/2 -translate-x-1/2 w-[74%] h-7 rounded-[100%] bg-grafite/25 blur-xl"
              />
              <span className="portal-abrir relative block aspect-[4/5] max-h-[58vh] w-full lg:max-h-none overflow-hidden rounded-t-[999px] rounded-b-2xl bg-areia/40">
                <Image
                  src={imagemUrl(heroCapa)}
                  alt={`${heroProduto.nome} no showroom da Casa Sinelli`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  className="portal-settle object-cover transition-transform duration-[var(--dur-long)] motion-reduce:transition-none group-hover:scale-[var(--motion-scale-subtle)]"
                  preload
                  fetchPriority="high"
                />
                {/* passe-partout: filete claro interno, moldura de catálogo */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-3 sm:inset-4 rounded-t-[999px] rounded-b-xl ring-1 ring-cru/60"
                />
              </span>
              <span className="etiqueta etiqueta-pousar [animation-delay:var(--hero-d4)] absolute bottom-4 left-4 group-hover:bg-cru transition-colors">
                {heroProduto.nome} — veja de perto
              </span>
            </Link>
          )}
        </div>
        {/* linha de piso: o traço em que a composição assenta, desenhado ao final */}
        <div aria-hidden="true" className="hero-piso mt-[2px] h-px bg-grafite/20" />
      </section>

      {/* ─── CATEGORIAS PRINCIPAIS ─── */}
      <section className="bg-white border-y border-grafite/8 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6 mb-9">
            <h2 className="font-serif text-4xl sm:text-5xl font-medium text-grafite shrink-0">
              O que sua casa precisa
            </h2>
            {/* régua editorial: corre do título até a ação */}
            <span aria-hidden="true" className="hidden sm:block flex-1 h-px bg-grafite/20" />
            <Link
              href="/catalogo"
              className="group hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-musgo-escuro hover:underline underline-offset-4 shrink-0"
            >
              Todas as categorias
              <ArrowRight className="w-4 h-4 transition-transform duration-[var(--dur-short)] group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0" aria-hidden="true" />
            </Link>
          </div>

          {/* Mosaico: Sofá e Guarda-roupa âncoras (span 2), demais em célula
              padrão. Onda de entrada agora é do GSAP (areas/cards.ts) — sem
              JS/pré-GSAP as células ficam visíveis direto */}
          <div data-motion-grade className="grid grid-cols-2 lg:grid-cols-12 gap-4 sm:gap-5">
            {categoriasDestaque.map((cat) => {
              const ancora = cat.slug === 'sofa' || cat.slug === 'guarda-roupa';
              return (
                <Link
                  key={cat.slug}
                  href={`/categoria/${cat.slug}`}
                  data-motion-card
                  className={`group relative rounded-[4px] overflow-hidden bg-areia/30 border border-grafite/10 transition-colors duration-[var(--dur-short)] motion-reduce:transition-none hover:border-marca/70 focus-visible:outline-2 focus-visible:outline-musgo ${
                    ancora ? 'col-span-2 lg:col-span-6 aspect-[16/9]' : 'col-span-1 lg:col-span-3 aspect-[4/3]'
                  }`}
                >
                  <Image
                    src={imagemUrl(cat.capa)}
                    alt={cat.nome}
                    fill
                    sizes={ancora ? '(max-width: 1024px) 100vw, 50vw' : '(max-width: 1024px) 50vw, 25vw'}
                    className="object-cover transition-transform duration-[var(--dur-long)] motion-reduce:transition-none group-hover:scale-[var(--motion-scale-subtle)]"
                  />
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-grafite/85 via-grafite/25 to-transparent"
                  />
                  <span className="absolute inset-x-0 bottom-0 flex items-baseline justify-between gap-2 px-4 sm:px-5 pb-3.5 sm:pb-4">
                    <span className={`font-serif font-medium text-cru ${ancora ? 'text-2xl sm:text-3xl' : 'text-lg sm:text-2xl'}`}>
                      {cat.nome}
                    </span>
                    <span className={`font-mono text-xs text-cru/75 shrink-0 ${ancora ? '' : 'hidden sm:inline'}`}>
                      {cat.total} {cat.total === 1 ? 'item' : 'itens'}
                    </span>
                  </span>
                </Link>
              );
            })}
          </div>

          <Link
            href="/catalogo"
            className="sm:hidden mt-5 flex items-center justify-center gap-1.5 text-sm font-semibold text-musgo-escuro"
          >
            Todas as categorias
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
      </section>

      {/* ─── SELEÇÃO DA LOJA — bloco grafite: showroom com as peças na luz ─── */}
      <section className="bg-grafite py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <p className="etiqueta mb-5">Seleção da loja</p>
            <h2 className="font-serif text-4xl sm:text-6xl font-medium text-cru text-balance max-w-[24ch]">
              Peças que contam a <em className="italic text-areia">nossa história</em>
            </h2>
          </div>
          {/* Mobile: vitrine horizontal com scroll-snap nativo; sm+: grade com
              âncora larga. Onda de entrada é do GSAP (areas/cards.ts) */}
          <div data-motion-grade className="flex gap-3 overflow-x-auto snap-x snap-mandatory scroll-px-4 -mx-4 px-4 pb-2 sm:pb-0 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-5 sm:overflow-visible">
            {destaques.map((p, i) => (
              <div
                key={p.id}
                className={`snap-start shrink-0 w-[78%] min-[421px]:w-[58%] sm:w-auto sm:shrink ${
                  i === 0 ? 'lg:col-span-2' : ''
                }`}
              >
                <ProductCard
                  produto={p}
                  sizes={
                    i === 0
                      ? '(max-width: 640px) 78vw, (max-width: 1024px) 50vw, 66vw'
                      : '(max-width: 640px) 78vw, (max-width: 1024px) 50vw, 33vw'
                  }
                />
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              href="/catalogo"
              className="group inline-flex items-center gap-2 border-[1.5px] border-cru/35 hover:border-cru text-cru font-semibold px-7 py-3.5 rounded-xl transition-[border-color,background-color,transform] duration-[var(--dur-short)] touch-manipulation active:scale-[var(--motion-scale-active)] motion-reduce:transition-none motion-reduce:active:scale-100 hover:bg-cru/5 focus-visible:outline-2 focus-visible:outline-areia"
            >
              Ver o catálogo completo — {produtos.length} produtos
              <ArrowRight className="w-4 h-4 transition-transform duration-[var(--dur-short)] group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── DIFERENCIAIS — faixa areia: compromissos da loja ─── */}
      <section className="bg-areia py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl sm:text-4xl font-medium text-grafite mb-9 text-balance max-w-[26ch]">
            Comprar móvel é com quem <em className="italic">entrega e monta</em>
          </h2>
          <RevelarAoEntrar className="revelar-bloco">
          <ul className="grid grid-cols-2 lg:grid-cols-4 gap-y-8 gap-x-6 lg:gap-x-0 lg:divide-x lg:divide-grafite/20 border-t border-grafite/20 pt-8">
            {DIFERENCIAIS.map(({ Icone, titulo, descricao }) => (
              <li key={titulo} className="lg:px-7 first:lg:pl-0 last:lg:pr-0">
                <span className="flex items-center gap-2.5 mb-1.5">
                  <Icone className="w-5 h-5 text-grafite shrink-0" strokeWidth={1.8} aria-hidden="true" />
                  <h3 className="font-serif text-lg sm:text-xl font-medium text-grafite">{titulo}</h3>
                </span>
                <p className="text-sm text-grafite/75 leading-relaxed">{descricao}</p>
              </li>
            ))}
          </ul>
          </RevelarAoEntrar>
        </div>
      </section>

      {/* ─── VISITE A LOJA ─── */}
      <section className="py-14 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="font-serif text-4xl sm:text-5xl font-medium text-grafite mb-8 text-balance">
                Venha sentar no sofá antes de escolher
              </h2>
              <div className="flex flex-col gap-4 items-start">
                <p className="etiqueta">
                  <span>
                    Av. Francisco Monteiro, 1320 — Vila Fiorentino, Ribeirão Pires - SP
                    <br />
                    Seg–Sex 9h às 19h · Sáb 9h às 17h
                  </span>
                </p>
                <p className="etiqueta">
                  <span>
                    WhatsApp{' '}
                    <a
                      href={WHATSAPP_URL}
                      className="text-musgo-escuro font-semibold hover:underline underline-offset-4"
                    >
                      {WHATSAPP_TELEFONE_FORMATADO}
                    </a>
                    <br />
                    E-mail{' '}
                    <a
                      href="mailto:contato@casasinelli.com.br"
                      className="text-musgo-escuro font-semibold hover:underline underline-offset-4"
                    >
                      contato@casasinelli.com.br
                    </a>
                  </span>
                </p>
              </div>
            </div>
            <Map />
          </div>
        </div>
      </section>

      {/* ─── CHAMADA FINAL ─── */}
      <section className="bg-grafite">
        {/* Recorte curvo: transição cru → grafite. O markup carrega o arco
            CHEIO (estado final/sem-JS); no desktop o GSAP interpola o `d`
            de uma curva rasa até esta — o arco "abre" conforme a chamada
            final se aproxima (areas/arco.ts). */}
        <svg
          viewBox="0 0 1440 72"
          preserveAspectRatio="none"
          aria-hidden="true"
          className="block w-full h-10 sm:h-[72px]"
        >
          <path data-motion-arco="recorte" d="M0,0 H1440 V16 C1080,72 360,72 0,16 Z" fill="#F6F2EB" />
        </svg>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center py-16 sm:py-24">
          <LogoPoltrona tamanho={64} className="mx-auto mb-6" />
          <h2 className="font-serif text-[clamp(32px,4.5vw,56px)] font-medium text-cru leading-tight mb-4 text-balance">
            Achou a peça certa? A conversa é rápida.
          </h2>
          <p className="text-cru/70 text-lg mb-9 leading-relaxed">
            Chame no WhatsApp para saber preço, disponibilidade e condições — ou visite o showroom em Ribeirão Pires.
          </p>
          <div className="flex flex-col sm:flex-row gap-3.5 justify-center">
            <BotaoWhatsApp tamanho="lg" fundoEscuro mensagem={MENSAGENS_WHATSAPP.padrao} />
            <Link
              href="/catalogo"
              className="inline-flex items-center justify-center border-[1.5px] border-cru/35 hover:border-cru text-cru font-semibold text-base px-7 py-4 rounded-xl transition-[border-color,background-color,transform] duration-[var(--dur-short)] touch-manipulation active:scale-[var(--motion-scale-active)] motion-reduce:transition-none motion-reduce:active:scale-100 hover:bg-cru/5 focus-visible:outline-2 focus-visible:outline-areia"
            >
              Ver catálogo
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
