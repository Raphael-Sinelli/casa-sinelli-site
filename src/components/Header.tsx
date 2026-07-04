'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import WhatsAppIcon from './WhatsAppIcon';


interface CategoriaLink {
  nome: string;
  slug: string;
  total: number;
}

interface Props {
  categoriasTop: CategoriaLink[];
  todasCategorias: CategoriaLink[];
}

const WHATSAPP_URL = 'https://wa.me/5511971776165';

export default function Header({ categoriasTop, todasCategorias }: Props) {
  const [menuAberto, setMenuAberto] = useState(false);
  const pathname = usePathname();
  const fecharMenu = () => setMenuAberto(false);

  // trava o scroll e liga o Esc enquanto o menu está aberto
  useEffect(() => {
    if (!menuAberto) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuAberto(false);
    };
    document.addEventListener('keydown', onKey);
    const overflowAntes = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = overflowAntes;
    };
  }, [menuAberto]);

  const linkAtivo = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  const navPrincipal = [
    { href: '/catalogo', label: 'Catálogo' },
    ...categoriasTop.map((c) => ({
      href: `/categoria/${c.slug}`,
      label: c.nome,
    })),
  ];

  return (
    <header className="sticky top-0 z-[60] bg-cru/92 backdrop-blur border-b border-grafite/12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-[68px]">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 group focus-visible:outline-2 focus-visible:outline-vinho focus-visible:outline-offset-4 rounded-sm"
            aria-label="Casa Sinelli — página inicial"
          >
            <span className="flex w-10 h-10 shrink-0 items-center justify-center rounded-full rounded-bl-sm bg-jatoba text-cru font-serif italic font-semibold text-[17px] transition-colors group-hover:bg-vinho">
              CS
            </span>
            <span className="flex flex-col leading-none">
              <span className="font-serif text-[21px] font-semibold text-grafite tracking-tight">
                Casa Sinelli
              </span>
              <span className="font-mono text-[9.5px] tracking-[0.22em] uppercase text-jatoba mt-0.5">
                Móveis &amp; Colchões
              </span>
            </span>
          </Link>

          {/* Nav desktop */}
          <nav className="hidden lg:flex items-center gap-7" aria-label="Navegação principal">
            {navPrincipal.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                aria-current={linkAtivo(l.href) ? 'page' : undefined}
                className={`text-[14.5px] font-medium transition-colors underline-offset-8 decoration-2 focus-visible:outline-2 focus-visible:outline-vinho focus-visible:outline-offset-4 rounded-sm ${
                  linkAtivo(l.href)
                    ? 'text-vinho underline'
                    : 'text-grafite hover:text-vinho'
                }`}
              >
                {l.label}
              </Link>
            ))}
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-1 inline-flex items-center gap-2 bg-wa hover:bg-wa-escuro text-white text-sm font-semibold px-4.5 py-2.5 rounded-xl transition-colors focus-visible:outline-2 focus-visible:outline-vinho focus-visible:outline-offset-2"
            >
              <WhatsAppIcon className="w-4.5 h-4.5" />
              Consultar preço
            </a>
          </nav>

          {/* Botão menu mobile */}
          <button
            onClick={() => setMenuAberto(!menuAberto)}
            className="lg:hidden w-11 h-11 flex items-center justify-center text-grafite rounded-xl hover:bg-grafite/6 transition-colors focus-visible:outline-2 focus-visible:outline-vinho"
            aria-label={menuAberto ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={menuAberto}
            aria-controls="menu-mobile"
          >
            {menuAberto ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Menu mobile — painel colapsável com todas as categorias */}
      {menuAberto && (
        <nav
          id="menu-mobile"
          aria-label="Menu"
          className="menu-mobile-entrar lg:hidden absolute inset-x-0 top-full h-[calc(100dvh-4rem)] overflow-y-auto bg-cru border-t border-grafite/12"
        >
          <div className="px-4 py-5 flex flex-col gap-6">
            <div className="flex flex-col">
              <Link
                href="/"
                onClick={fecharMenu}
                className="font-serif text-2xl font-medium text-grafite py-2.5 hover:text-vinho transition-colors"
              >
                Início
              </Link>
              <Link
                href="/catalogo"
                onClick={fecharMenu}
                className="font-serif text-2xl font-medium text-grafite py-2.5 hover:text-vinho transition-colors"
              >
                Catálogo completo
              </Link>
            </div>

            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-jatoba mb-3">
                Categorias
              </p>
              <div className="grid grid-cols-2 gap-x-4">
                {todasCategorias.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/categoria/${c.slug}`}
                    onClick={fecharMenu}
                    className="flex items-baseline justify-between gap-2 py-2 border-b border-grafite/8 text-[15px] font-medium text-grafite hover:text-vinho transition-colors"
                  >
                    <span className="truncate">{c.nome}</span>
                    <span className="font-mono text-xs text-grafite/45 shrink-0">{c.total}</span>
                  </Link>
                ))}
              </div>
            </div>

            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2.5 bg-wa hover:bg-wa-escuro text-white font-bold text-base py-4 rounded-xl transition-colors"
            >
              <WhatsAppIcon className="w-5.5 h-5.5" />
              Consultar preço
            </a>

            <p className="text-center text-xs text-grafite/50 pb-4">
              Av. Francisco Monteiro, 1320 — Ribeirão Pires · Seg–Sex 9h–19h · Sáb 9h–17h
            </p>
          </div>
        </nav>
      )}
    </header>
  );
}
