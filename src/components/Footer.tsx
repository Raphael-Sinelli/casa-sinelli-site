import Link from 'next/link';
import { MapPin, Clock, Phone, Mail } from 'lucide-react';
import { todasCategorias } from '@/lib/catalogo-server';
import { WHATSAPP_TELEFONE_FORMATADO, WHATSAPP_URL } from '@/lib/whatsapp';
import BotaoWhatsApp from './BotaoWhatsApp';
import LogoPoltrona from './LogoPoltrona';

const LINKS_SITE = [
  ['Início', '/'],
  ['Catálogo completo', '/catalogo'],
] as const;

const CATEGORIAS_FOOTER: ReadonlyArray<readonly [slug: string, rotulo: string]> = [
  ['sofa', 'Sofás'],
  ['guarda-roupa', 'Guarda-Roupas'],
  ['cama', 'Camas'],
  ['colchao', 'Colchões'],
  ['cozinha', 'Cozinhas'],
  ['comoda', 'Cômodas'],
];

export default function Footer() {
  const slugsExistentes = new Set(todasCategorias().map((c) => c.slug));
  const categoriasFooter = CATEGORIAS_FOOTER.filter(([slug]) => slugsExistentes.has(slug));

  return (
    <footer className="bg-grafite text-cru/75">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-[1.2fr_0.8fr_1fr] gap-10 md:gap-0 md:divide-x md:divide-cru/12">
          {/* Marca — crest: a poltrona do logo dentro do arco-assinatura.
              O arco é SVG (mesma geometria do rounded-t-[999px] anterior)
              para o stroke draw do GSAP; sem JS/reduced fica o contorno
              completo, idêntico ao visual antigo. */}
          <div className="md:pr-10">
            <div className="flex items-center gap-5 mb-5">
              <span className="relative shrink-0 inline-flex items-end justify-center w-[76px] h-[88px] pb-3">
                <svg
                  viewBox="0 0 76 88"
                  fill="none"
                  aria-hidden="true"
                  className="absolute inset-0 w-full h-full text-cru/25"
                >
                  <path
                    data-motion-arco="crest"
                    d="M0.5,87.5 V38 A37.5,37.5 0 0 1 75.5,38 V87.5 Z"
                    stroke="currentColor"
                    strokeWidth="1"
                    pathLength="1"
                  />
                </svg>
                <span data-motion-arco="poltrona" className="inline-flex">
                  <LogoPoltrona tamanho={44} />
                </span>
              </span>
              <span className="flex flex-col leading-none">
                <span className="font-serif text-[26px] font-semibold text-cru tracking-tight">
                  Casa Sinelli
                </span>
                <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-cru/70 mt-1">
                  Móveis &amp; Colchões
                </span>
              </span>
            </div>
            {/* Tagline com máscara de linha: o span sobe por trás do
                overflow do <p> quando o footer entra (areas/arco.ts) */}
            <p className="font-serif italic text-lg text-cru/90 leading-snug mb-3 overflow-hidden">
              <span data-motion-arco="tagline" className="block">
                Móveis que fazem da sua casa a sua casa.
              </span>
            </p>
            <p className="text-sm text-cru/60 leading-relaxed max-w-[38ch]">
              Loja de móveis e colchões em Ribeirão Pires. Sofás, guarda-roupas, cozinhas, camas e colchões com entrega e montagem em todo o ABC Paulista.
            </p>
            <BotaoWhatsApp fundoEscuro className="mt-6" />
          </div>

          {/* Categorias */}
          <nav aria-label="Categorias no rodapé" className="md:px-10">
            <h2 className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-cru/70 mb-4">
              Catálogo
            </h2>
            <ul className="space-y-2.5 text-sm">
              {LINKS_SITE.map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="text-cru/70 hover:text-cru transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
              {categoriasFooter.map(([slug, rotulo]) => (
                <li key={slug}>
                  <Link
                    href={`/categoria/${slug}`}
                    className="text-cru/70 hover:text-cru transition-colors"
                  >
                    {rotulo}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contato */}
          <div className="md:pl-10">
            <h2 className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-cru/70 mb-4">
              Loja física
            </h2>
            <ul className="space-y-3.5 text-sm text-cru/70">
              <li className="flex gap-2.5 items-start">
                <MapPin className="w-4 h-4 text-areia mt-0.5 shrink-0" strokeWidth={1.8} aria-hidden="true" />
                <span>
                  Av. Francisco Monteiro, 1320 — Vila Fiorentino, Ribeirão Pires - SP
                  <br />
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=Av.+Francisco+Monteiro,+1320+-+Vila+Fiorentino,+Ribeir%C3%A3o+Pires+-+SP"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-1 text-areia font-semibold hover:text-cru underline underline-offset-4 decoration-areia/40 transition-colors"
                  >
                    Como chegar
                  </a>
                </span>
              </li>
              <li className="flex gap-2.5 items-start">
                <Clock className="w-4 h-4 text-areia mt-0.5 shrink-0" strokeWidth={1.8} aria-hidden="true" />
                <span>Seg–Sex: 9h às 19h · Sáb: 9h às 17h</span>
              </li>
              <li className="flex gap-2.5 items-center">
                <Phone className="w-4 h-4 text-areia shrink-0" strokeWidth={1.8} aria-hidden="true" />
                <a href={WHATSAPP_URL} className="hover:text-cru transition-colors">
                  {WHATSAPP_TELEFONE_FORMATADO}
                </a>
              </li>
              <li className="flex gap-2.5 items-center">
                <Mail className="w-4 h-4 text-areia shrink-0" strokeWidth={1.8} aria-hidden="true" />
                <a href="mailto:contato@casasinelli.com.br" className="hover:text-cru transition-colors">
                  contato@casasinelli.com.br
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-cru/12 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-cru/65">
          <p>© {new Date().getFullYear()} Casa Sinelli — Móveis &amp; Colchões. Todos os direitos reservados.</p>
          <p>Ribeirão Pires · Mauá · Santo André · São Bernardo e região</p>
        </div>
      </div>

      {/* Wordmark monumental — par do fantasma do hero (2.1): lá o CONCEITO
          ("casa", grafite/7 sobre cru); aqui a ASSINATURA (marca completa,
          cru/7 sobre grafite). Mesmo DNA: Newsreader itálico minúsculo,
          tracking -0.03em, assentado no chão da página (translate-y estático
          afunda os descenders na borda — propriedade `translate` do v4, canal
          separado do transform que o GSAP usa no rise). Desktop: sobe em
          scrub curto conforme o fim da página chega (areas/arco.ts). */}
      <div aria-hidden="true" className="overflow-hidden select-none pointer-events-none px-2">
        <p
          data-motion-arco="wordmark"
          className="text-center font-serif italic font-medium whitespace-nowrap leading-none tracking-[-0.03em] text-cru/[0.07] text-[clamp(52px,13.8vw,204px)] translate-y-[0.2em]"
        >
          casa sinelli
        </p>
      </div>
    </footer>
  );
}
