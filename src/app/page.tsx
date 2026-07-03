import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { todosOsProdutos, todasCategorias, capaProduto, imagemUrl } from '@/lib/produtos';
import ProductCard from '@/components/ProductCard';
import Map from '@/components/Map';
import WhatsAppIcon from '@/components/WhatsAppIcon';
import {
  DoorClosed, Sofa, Archive, Inbox, ChefHat, Tv, BedDouble, UtensilsCrossed,
  LayoutGrid, Bed, Armchair, PanelTop, Sparkles, Plug, PenTool, Baby, Box,
  Package2, Apple, Footprints, MonitorPlay, MonitorSmartphone, Lamp,
  type LucideIcon,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Casa Sinelli — Móveis & Colchões em Ribeirão Pires',
  description: 'Móveis e colchões com qualidade e elegância. Guarda-roupas, sofás, camas, colchões e muito mais. Visite nossa loja em Ribeirão Pires - SP ou fale pelo WhatsApp.',
};

const ICONES_CATEGORIA: Record<string, LucideIcon> = {
  'Guarda-Roupa': DoorClosed,
  'Sofá': Sofa,
  'Cômoda': Inbox,
  'Cozinha': ChefHat,
  'Colchão': BedDouble,
  'Mesa': UtensilsCrossed,
  'Mesa de Cabeceira': Lamp,
  'Multiuso': LayoutGrid,
  'Cama': Bed,
  'Poltrona': Armchair,
  'Beliche': Bed,
  'Cadeira': Armchair,
  'Cabeceira': PanelTop,
  'Penteadeira': Sparkles,
  'Eletrodoméstico': Plug,
  'Escrivaninha': PenTool,
  'Berço': Baby,
  'Balcão': Box,
  'Buffet': Archive,
  'Cristaleira': Package2,
  'Fruteira': Apple,
  'Sapateira': Footprints,
  'Rack': Tv,
  'Painel': MonitorPlay,
  'Home': MonitorSmartphone,
};

const DIFERENCIAIS = [
  {
    icone: '🚚',
    titulo: 'Entrega na Região',
    descricao: 'Entregamos em Ribeirão Pires e toda a região do Grande ABC com agilidade e cuidado.',
  },
  {
    icone: '🔧',
    titulo: 'Montagem Inclusa',
    descricao: 'Nossos profissionais montam os móveis no seu ambiente sem custo adicional.',
  },
  {
    icone: '💬',
    titulo: 'Atendimento Personalizado',
    descricao: 'Time especializado pronto para ajudar você a escolher o móvel ideal pelo WhatsApp.',
  },
  {
    icone: '✅',
    titulo: 'Qualidade Garantida',
    descricao: 'Trabalhamos com marcas reconhecidas e produtos com garantia de fábrica.',
  },
];

export default function HomePage() {
  const produtos = todosOsProdutos();
  const categorias = todasCategorias();
  const produtosDestaque = produtos.slice(0, 8);

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
      <section className="relative bg-marrom overflow-hidden">
        {/* Grade de imagens ao fundo */}
        <div className="absolute inset-0 grid grid-cols-4 gap-0.5 opacity-15 pointer-events-none">
          {produtos.slice(0, 8).map((p) => {
            const img = capaProduto(p);
            return img ? (
              <div key={p.id} className="relative">
                <Image
                  src={imagemUrl(img)}
                  alt=""
                  aria-hidden="true"
                  fill
                  sizes="25vw"
                  quality={60}
                  className="object-cover"
                />
              </div>
            ) : (
              <div key={p.id} className="bg-marrom-escuro" />
            );
          })}
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 flex flex-col items-center text-center">
          <p className="text-oliva-claro text-sm font-semibold uppercase tracking-widest mb-3">
            Móveis &amp; Colchões
          </p>
          <h1 className="font-serif text-4xl sm:text-6xl font-bold text-white leading-tight max-w-3xl">
            Transforme sua <span className="text-marrom-palido">casa</span> com elegância
          </h1>
          <p className="mt-6 text-white/70 text-lg max-w-xl leading-relaxed">
            Mais de {produtos.length} produtos de qualidade para todos os ambientes. Atendemos em Ribeirão Pires e toda a região.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 items-center">
            <Link
              href="/catalogo"
              className="bg-oliva hover:bg-oliva-escuro text-white font-bold px-8 py-4 rounded-full text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              Ver Catálogo
            </Link>
            <a
              href="https://wa.me/5511971776165"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold px-8 py-4 rounded-full text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center gap-2"
            >
              <WhatsAppIcon className="w-5 h-5" />
              Falar no WhatsApp
            </a>
          </div>

          {/* Info rápida */}
          <div className="mt-10 flex flex-wrap justify-center gap-6 text-white/60 text-sm">
            <span>📍 Ribeirão Pires - SP</span>
            <span>🕐 Seg–Sex 9h–19h | Sáb 9h–17h</span>
            <span>📱 (11) 97177-6165</span>
          </div>
        </div>
      </section>

      {/* ─── CATEGORIAS ─── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="font-serif text-3xl font-bold text-marrom">Navegue por Categoria</h2>
            <p className="text-gray-500 mt-2">Encontre exatamente o que você precisa</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {categorias.map((cat) => (
              <Link
                key={cat.slug}
                href={`/categoria/${cat.slug}`}
                className="group flex flex-col items-center gap-2 bg-marrom-palido/50 hover:bg-marrom-palido rounded-2xl p-4 transition-all hover:shadow-md hover:-translate-y-0.5 border border-transparent hover:border-marrom/20"
              >
                {(() => {
                  const Icone = ICONES_CATEGORIA[cat.nome] ?? Armchair;
                  return <Icone className="w-8 h-8 text-marrom" strokeWidth={1.5} aria-hidden="true" />;
                })()}
                <span className="text-sm font-semibold text-marrom text-center leading-tight group-hover:text-marrom-escuro">
                  {cat.nome}
                </span>
                <span className="text-xs text-gray-400">{cat.total} itens</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PRODUTOS EM DESTAQUE ─── */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="font-serif text-3xl font-bold text-marrom">Produtos em Destaque</h2>
              <p className="text-gray-500 mt-1">Seleção especial do nosso catálogo</p>
            </div>
            <Link
              href="/catalogo"
              className="hidden sm:flex items-center gap-1 text-sm font-semibold text-marrom hover:text-marrom-escuro transition-colors"
            >
              Ver todos
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {produtosDestaque.map((p) => (
              <ProductCard key={p.id} produto={p} />
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link
              href="/catalogo"
              className="inline-block bg-marrom hover:bg-marrom-escuro text-white font-bold px-8 py-3 rounded-full transition-all hover:scale-105 shadow"
            >
              Ver catálogo completo — {produtos.length} produtos
            </Link>
          </div>
        </div>
      </section>

      {/* ─── DIFERENCIAIS ─── */}
      <section className="py-16 bg-marrom">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="font-serif text-3xl font-bold text-white">Por que escolher a Casa Sinelli?</h2>
            <p className="text-white/60 mt-2">Comprometidos com a sua satisfação</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {DIFERENCIAIS.map((d) => (
              <div key={d.titulo} className="bg-marrom-escuro/50 rounded-2xl p-6 border border-white/10">
                <div className="text-4xl mb-3">{d.icone}</div>
                <h3 className="font-serif text-lg font-bold text-white mb-2">{d.titulo}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{d.descricao}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── LOCALIZAÇÃO ─── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="font-serif text-3xl font-bold text-marrom mb-6">Venha nos Visitar</h2>
              <ul className="space-y-4">
                <li className="flex gap-3 items-start">
                  <span className="text-2xl">📍</span>
                  <div>
                    <p className="font-semibold text-marrom">Endereço</p>
                    <p className="text-gray-600 text-sm mt-0.5">Av. Francisco Monteiro, 1320 — Vila Fiorentino<br />Ribeirão Pires - SP</p>
                  </div>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="text-2xl">🕐</span>
                  <div>
                    <p className="font-semibold text-marrom">Horário de Funcionamento</p>
                    <p className="text-gray-600 text-sm mt-0.5">Segunda à Sexta: 09h às 19h<br />Sábado: 09h às 17h</p>
                  </div>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="text-2xl">📱</span>
                  <div>
                    <p className="font-semibold text-marrom">WhatsApp</p>
                    <a href="https://wa.me/5511971776165" className="text-oliva hover:text-oliva-escuro text-sm font-medium transition-colors">
                      (11) 97177-6165
                    </a>
                  </div>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="text-2xl">✉️</span>
                  <div>
                    <p className="font-semibold text-marrom">E-mail</p>
                    <a href="mailto:contato@casasinelli.com.br" className="text-oliva hover:text-oliva-escuro text-sm font-medium transition-colors">
                      contato@casasinelli.com.br
                    </a>
                  </div>
                </li>
              </ul>
              <a
                href="https://wa.me/5511971776165?text=Ol%C3%A1!%20Gostaria%20de%20saber%20mais%20sobre%20os%20produtos%20da%20Casa%20Sinelli."
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold px-6 py-3 rounded-full transition-all hover:scale-105 shadow-md"
              >
                <WhatsAppIcon className="w-5 h-5" />
                Falar com Vendedor
              </a>
            </div>
            <Map />
          </div>
        </div>
      </section>

      {/* ─── CTA FINAL ─── */}
      <section className="py-16 bg-oliva">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-4">
            Pronto para renovar sua casa?
          </h2>
          <p className="text-white/80 text-lg mb-8">
            Fale com um de nossos especialistas agora mesmo e tire todas as suas dúvidas.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://wa.me/5511971776165?text=Ol%C3%A1!%20Gostaria%20de%20conhecer%20os%20produtos%20da%20Casa%20Sinelli."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold px-8 py-4 rounded-full text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              <WhatsAppIcon className="w-6 h-6" />
              Chamar no WhatsApp
            </a>
            <Link
              href="/catalogo"
              className="flex items-center justify-center bg-white hover:bg-marrom-palido text-oliva-escuro font-bold px-8 py-4 rounded-full text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              Ver Catálogo
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
