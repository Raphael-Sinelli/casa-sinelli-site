'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { useEscapeETravaScroll } from '@/hooks/useEscapeETravaScroll';

interface Foto {
  url: string;
  alt: string;
}

interface Props {
  fotos: Foto[];
  indice: number;
  nomeProduto: string;
  aoFechar: () => void;
  aoNavegar: (indice: number) => void;
}

const setaEsq = (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);
const setaDir = (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

// Overlay full-screen com zoom 2.5×. Portal para o body: a coluna sticky da
// página de produto cria stacking context que engoliria um fixed local.
export default function Lightbox({ fotos, indice, nomeProduto, aoFechar, aoNavegar }: Props) {
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);
  const toqueX = useRef<number | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  const total = fotos.length;
  const atual = Math.min(indice, total - 1);

  const anterior = useCallback(() => {
    setZoom(null);
    aoNavegar((atual - 1 + total) % total);
  }, [aoNavegar, atual, total]);
  const proxima = useCallback(() => {
    setZoom(null);
    aoNavegar((atual + 1) % total);
  }, [aoNavegar, atual, total]);

  // Esc: primeiro sai do zoom; sem zoom, fecha. Scroll do body travado.
  const aoEscape = useCallback(() => {
    setZoom((z) => {
      if (z) return null;
      aoFechar();
      return z;
    });
  }, [aoFechar]);
  useEscapeETravaScroll(true, aoEscape);

  // navegação por teclado
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') anterior();
      if (e.key === 'ArrowRight') proxima();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [anterior, proxima]);

  // focus trap: Tab circula apenas pelos controles do dialog
  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const focaveis = Array.from(
        el.querySelectorAll<HTMLElement>('button, [href], [tabindex]:not([tabindex="-1"])')
      );
      if (focaveis.length === 0) return;
      const primeiro = focaveis[0];
      const ultimo = focaveis[focaveis.length - 1];
      if (e.shiftKey && document.activeElement === primeiro) {
        e.preventDefault();
        ultimo.focus();
      } else if (!e.shiftKey && document.activeElement === ultimo) {
        e.preventDefault();
        primeiro.focus();
      }
    };
    el.addEventListener('keydown', onKey);
    return () => el.removeEventListener('keydown', onKey);
  }, []);

  const posicaoZoom = (e: React.MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    return {
      x: ((e.clientX - r.left) / r.width) * 100,
      y: ((e.clientY - r.top) / r.height) * 100,
    };
  };

  return createPortal(
    <div
      ref={dialogRef}
      className="lightbox-entrar fixed inset-0 z-[100] bg-grafite/95 flex flex-col overscroll-contain"
      role="dialog"
      aria-modal="true"
      aria-label={`Fotos de ${nomeProduto}`}
    >
      <div className="flex items-center justify-between px-4 py-3 text-cru">
        <span className="font-mono text-sm">{atual + 1}/{total} — {nomeProduto}</span>
        <button
          onClick={aoFechar}
          className="w-11 h-11 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors focus-visible:outline-2 focus-visible:outline-areia"
          aria-label="Fechar"
          autoFocus
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div
        className="relative flex-1 overflow-hidden"
        onPointerDown={(e) => { toqueX.current = e.clientX; }}
        onPointerUp={(e) => {
          if (toqueX.current === null || zoom) return;
          const delta = e.clientX - toqueX.current;
          if (delta > 60) { anterior(); }
          if (delta < -60) { proxima(); }
          toqueX.current = null;
        }}
      >
        <button
          className={`absolute inset-0 w-full transition-transform duration-200 motion-reduce:transition-none ${zoom ? 'cursor-zoom-out' : 'cursor-zoom-in'} focus-visible:outline-2 focus-visible:outline-areia -outline-offset-4`}
          style={
            zoom
              ? { transform: 'scale(2.5)', transformOrigin: `${zoom.x}% ${zoom.y}%` }
              : undefined
          }
          onClick={(e) => {
            // e.detail === 0: acionado por teclado (Enter/Espaço) — zoom no centro
            const porTeclado = e.detail === 0;
            setZoom(zoom ? null : porTeclado ? { x: 50, y: 50 } : posicaoZoom(e));
          }}
          onMouseMove={(e) => { if (zoom) setZoom(posicaoZoom(e)); }}
          aria-label={zoom ? 'Reduzir a foto' : 'Dar zoom na foto'}
          aria-pressed={Boolean(zoom)}
        >
          <Image
            key={fotos[atual].url}
            src={fotos[atual].url}
            alt={fotos[atual].alt}
            fill
            sizes="100vw"
            className="foto-entrar object-contain"
          />
        </button>

        {total > 1 && !zoom && (
          <>
            <button
              onClick={anterior}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/25 text-cru rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-areia"
              aria-label="Foto anterior"
            >
              {setaEsq}
            </button>
            <button
              onClick={proxima}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/25 text-cru rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-areia"
              aria-label="Próxima foto"
            >
              {setaDir}
            </button>
          </>
        )}
      </div>

      <p className="px-4 py-3 text-center text-cru/60 text-xs">
        {zoom
          ? 'Mova o mouse para percorrer o detalhe — clique para reduzir'
          : 'Clique na foto para dar zoom no acabamento'}
      </p>
    </div>,
    document.body
  );
}
