import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Clock, Phone, Mail } from 'lucide-react';
import { todasCategorias } from '@/lib/produtos';
import WhatsAppIcon from './WhatsAppIcon';

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
          {/* Marca — logo oficial num cartão cru (o contorno grafite some no fundo escuro) */}
          <div>
            <div className="inline-block bg-cru rounded-2xl px-6 py-5 mb-5">
              <Image
                src="/logo-casa-sinelli.png"
                alt="Casa Sinelli — Móveis & Colchões"
                width={168}
                height={155}
                unoptimized
              />
            </div>
            <p className="text-sm text-cru/60 leading-relaxed max-w-[38ch]">
              Loja de móveis e colchões em Ribeirão Pires. Sofás, guarda-roupas, cozinhas, camas e colchões com entrega e montagem em todo o ABC Paulista.
            </p>
            <a
              href="https://wa.me/5511971776165"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2.5 bg-wa hover:bg-wa-escuro text-white text-sm font-semibold px-5 py-3 rounded-xl transition-colors focus-visible:outline-2 focus-visible:outline-areia focus-visible:outline-offset-2"
            >
              <WhatsAppIcon className="w-4.5 h-4.5" />
              Consultar preço
            </a>
          </div>

          {/* Categorias */}
          <nav aria-label="Categorias no rodapé">
            <h3 className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-cru/45 mb-4">
              Catálogo
            </h3>
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
            <h3 className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-cru/45 mb-4">
              Loja física
            </h3>
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
                <a href="https://wa.me/5511971776165" className="hover:text-cru transition-colors">
                  (11) 97177-6165
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

        <div className="mt-12 pt-6 border-t border-cru/12 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-cru/40">
          <p>© {new Date().getFullYear()} Casa Sinelli — Móveis &amp; Colchões. Todos os direitos reservados.</p>
          <p>Ribeirão Pires · Mauá · Santo André · São Bernardo e região</p>
        </div>
      </div>
    </footer>
  );
}
