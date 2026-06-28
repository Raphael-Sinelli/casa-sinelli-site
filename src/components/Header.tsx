'use client';

import Link from 'next/link';
import { useState } from 'react';

const navLinks = [
  { href: '/', label: 'Início' },
  { href: '/catalogo', label: 'Catálogo' },
  { href: '/categoria/sofa', label: 'Sofás' },
  { href: '/categoria/cama', label: 'Camas' },
  { href: '/categoria/guarda-roupa', label: 'Guarda-Roupas' },
  { href: '/categoria/colchao', label: 'Colchões' },
];

export default function Header() {
  const [menuAberto, setMenuAberto] = useState(false);

  return (
    <header className="bg-marrom shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex flex-col leading-none group">
            <span className="font-serif text-xl font-bold text-white tracking-wide group-hover:text-marrom-palido transition-colors">
              Casa Sinelli
            </span>
            <span className="text-xs text-marrom-palido/80 tracking-widest uppercase">
              Móveis &amp; Colchões
            </span>
          </Link>

          {/* Nav desktop */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-sm text-white/90 hover:text-white font-medium transition-colors"
              >
                {l.label}
              </Link>
            ))}
            <a
              href="https://wa.me/5511971776165"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 bg-oliva hover:bg-oliva-escuro text-white text-sm font-semibold px-4 py-2 rounded-full transition-colors"
            >
              WhatsApp
            </a>
          </nav>

          {/* Botão menu mobile */}
          <button
            onClick={() => setMenuAberto(!menuAberto)}
            className="md:hidden text-white p-2 rounded-lg hover:bg-marrom-escuro transition-colors"
            aria-label={menuAberto ? 'Fechar menu' : 'Abrir menu'}
          >
            {menuAberto ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Menu mobile */}
      {menuAberto && (
        <nav className="md:hidden bg-marrom-escuro border-t border-marrom-claro/30">
          <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col gap-1">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMenuAberto(false)}
                className="text-white/90 hover:text-white py-2 px-3 rounded-lg hover:bg-marrom/50 font-medium transition-colors"
              >
                {l.label}
              </Link>
            ))}
            <a
              href="https://wa.me/5511971776165"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 bg-oliva text-white text-center font-semibold py-3 rounded-full"
            >
              📱 WhatsApp
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
