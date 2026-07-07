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
        <div className="grid grid-cols-1 md:grid-cols-[1.2fr_0.8fr_1fr] gap-10">
          {/* Marca — poltrona do logo + wordmark em cru (lockup do header, versão fundo escuro) */}
          <div>
            <div className="flex items-center gap-4 mb-5">
              <LogoPoltrona tamanho={56} className="shrink-0" />
              <span className="flex flex-col leading-none">
                <span className="font-serif text-[26px] font-semibold text-cru tracking-tight">
                  Casa Sinelli
                </span>
                <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-cru/70 mt-1">
                  Móveis &amp; Colchões
                </span>
              </span>
            </div>
            <p className="text-sm text-cru/60 leading-relaxed max-w-[38ch]">
              Loja de móveis e colchões em Ribeirão Pires. Sofás, guarda-roupas, cozinhas, camas e colchões com entrega e montagem em todo o ABC Paulista.
            </p>
            <BotaoWhatsApp fundoEscuro className="mt-6" />
          </div>

          {/* Categorias */}
          <nav aria-label="Categorias no rodapé">
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
          <div>
            <h2 className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-cru/70 mb-4">
              Loja física
            </h2>
            <ul className="space-y-3.5 text-sm text-cru/70">
              <li className="flex gap-2.5 items-start">
                <MapPin className="w-4 h-4 text-areia mt-0.5 shrink-0" strokeWidth={1.8} aria-hidden="true" />
                <span>Av. Francisco Monteiro, 1320 — Vila Fiorentino, Ribeirão Pires - SP</span>
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
    </footer>
  );
}
