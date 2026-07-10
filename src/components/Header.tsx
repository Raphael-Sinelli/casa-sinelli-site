'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useState, type CSSProperties } from 'react';
import { useEscapeETravaScroll } from '@/hooks/useEscapeETravaScroll';
import { WHATSAPP_TELEFONE_FORMATADO } from '@/lib/whatsapp';
import BotaoWhatsApp from './BotaoWhatsApp';
import LogoPoltrona from './LogoPoltrona';


interface CategoriaLink {
  nome: string;
  slug: string;
  total: number;
}

interface Props {
  categoriasTop: CategoriaLink[];
  todasCategorias: CategoriaLink[];
}

export default function Header({ categoriasTop, todasCategorias }: Props) {
  const [menuAberto, setMenuAberto] = useState(false);
  const pathname = usePathname();
  const fecharMenu = useCallback(() => setMenuAberto(false), []);

  useEscapeETravaScroll(menuAberto, fecharMenu);

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
    <>
      {/* Faixa da loja física — endereço e horário reais, some ao rolar
          (só o header principal é sticky). Desktop: no mobile o menu já traz. */}
      <div className="hidden lg:block bg-grafite text-cru/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-9 flex items-center justify-between gap-6 font-mono text-[11px] tracking-[0.04em]">
          <p className="truncate">
            Av. Francisco Monteiro, 1320 — Vila Fiorentino, Ribeirão Pires - SP
          </p>
          <p className="shrink-0">
            Seg–Sex 9h–19h · Sáb 9h–17h · WhatsApp {WHATSAPP_TELEFONE_FORMATADO}
          </p>
        </div>
      </div>
    <header className="sticky top-0 z-[60] bg-cru/92 backdrop-blur border-b border-grafite/12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-[68px]">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 group focus-visible:outline-2 focus-visible:outline-musgo focus-visible:outline-offset-4 rounded-sm"
            aria-label="Casa Sinelli Móveis & Colchões — página inicial"
          >
            <LogoPoltrona tamanho={42} className="logo-assentar shrink-0" />
            <span className="flex flex-col leading-none">
              <span className="font-serif text-[21px] font-semibold text-grafite tracking-tight">
                Casa Sinelli
              </span>
              <span className="font-mono text-[9.5px] tracking-[0.22em] uppercase text-marca mt-0.5">
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
                className={`relative text-[14.5px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-musgo focus-visible:outline-offset-4 rounded-sm after:absolute after:inset-x-0 after:-bottom-1.5 after:h-0.5 after:bg-musgo-escuro after:origin-right hover:after:origin-left after:transition-transform after:duration-[var(--dur-short)] motion-reduce:after:transition-none hover:after:scale-x-100 ${
                  linkAtivo(l.href)
                    ? 'text-musgo-escuro after:scale-x-100'
                    : 'text-grafite hover:text-musgo-escuro after:scale-x-0'
                }`}
              >
                {l.label}
              </Link>
            ))}
            <BotaoWhatsApp className="ml-1" />
          </nav>

          {/* Mobile: atalho direto ao catálogo (1 toque, sem abrir o menu —
              fluxo da vendedora no balcão) + botão do menu */}
          <div className="lg:hidden flex items-center gap-1">
          <Link
            href="/catalogo"
            aria-current={linkAtivo('/catalogo') ? 'page' : undefined}
            className={`h-11 px-2.5 flex items-center font-mono text-[11px] uppercase tracking-[0.16em] rounded-xl transition-colors focus-visible:outline-2 focus-visible:outline-musgo ${
              linkAtivo('/catalogo') ? 'text-musgo-escuro' : 'text-grafite hover:text-musgo-escuro'
            }`}
          >
            Catálogo
          </Link>
          <button
            onClick={() => setMenuAberto(!menuAberto)}
            className="w-11 h-11 flex items-center justify-center text-grafite rounded-xl hover:bg-grafite/6 transition-colors focus-visible:outline-2 focus-visible:outline-musgo"
            aria-label={menuAberto ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={menuAberto}
            aria-controls="menu-mobile"
          >
            {/* Hamburger → X com morph (3 barras, transform-only) */}
            <span className="relative block w-6 h-6" aria-hidden="true">
              <span
                className={`absolute left-0 top-[5px] h-0.5 w-6 rounded-full bg-current transition-transform duration-[var(--dur-short)] motion-reduce:transition-none ${
                  menuAberto ? 'translate-y-[6px] rotate-45' : ''
                }`}
              />
              <span
                className={`absolute left-0 top-[11px] h-0.5 w-6 rounded-full bg-current transition-opacity duration-[var(--dur-micro)] motion-reduce:transition-none ${
                  menuAberto ? 'opacity-0' : 'opacity-100'
                }`}
              />
              <span
                className={`absolute left-0 top-[17px] h-0.5 w-6 rounded-full bg-current transition-transform duration-[var(--dur-short)] motion-reduce:transition-none ${
                  menuAberto ? '-translate-y-[6px] -rotate-45' : ''
                }`}
              />
            </span>
          </button>
          </div>
        </div>
      </div>

      {/* Menu mobile — painel colapsável com todas as categorias */}
      {menuAberto && (
        <nav
          id="menu-mobile"
          aria-label="Menu"
          className="menu-mobile-entrar lg:hidden absolute inset-x-0 top-full h-[calc(100dvh-4rem)] overflow-y-auto overscroll-contain bg-cru border-t border-grafite/12"
        >
          <div className="menu-stagger px-4 py-5 flex flex-col gap-6">
            <div className="flex flex-col">
              <Link
                href="/"
                onClick={fecharMenu}
                className="font-serif text-2xl font-medium text-grafite py-2.5 hover:text-musgo transition-colors"
              >
                Início
              </Link>
              <Link
                href="/catalogo"
                onClick={fecharMenu}
                className="font-serif text-2xl font-medium text-grafite py-2.5 hover:text-musgo transition-colors"
              >
                Catálogo completo
              </Link>
            </div>

            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-marca mb-3">
                Categorias
              </p>
              <div className="grid grid-cols-2 gap-x-4">
                {todasCategorias.map((c, i) => (
                  <Link
                    key={c.slug}
                    href={`/categoria/${c.slug}`}
                    onClick={fecharMenu}
                    className="menu-onda flex items-baseline justify-between gap-2 py-2 border-b border-grafite/8 text-[15px] font-medium text-grafite hover:text-musgo-escuro transition-colors"
                    // índice diagonal (linha + coluna): itens da mesma
                    // antidiagonal entram juntos — onda varre a grade
                    style={{ '--onda-i': Math.floor(i / 2) + (i % 2) } as CSSProperties}
                  >
                    <span className="truncate">{c.nome}</span>
                    <span className="menu-onda-carimbo font-mono text-xs text-grafite/45 shrink-0">{c.total}</span>
                  </Link>
                ))}
              </div>
            </div>

            <BotaoWhatsApp tamanho="lg" larguraTotal />

            <p className="text-center text-xs text-grafite/50 pb-4">
              Av. Francisco Monteiro, 1320 — Ribeirão Pires · Seg–Sex 9h–19h · Sáb 9h–17h
            </p>
          </div>
        </nav>
      )}
    </header>
    </>
  );
}
