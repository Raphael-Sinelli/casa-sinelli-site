'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { imagemUrl } from '@/lib/produtos';
import LogoPoltrona from './LogoPoltrona';

interface Props {
  imagens: string[];
  nomeProduto: string;
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

export default function ProductGallery({ imagens, nomeProduto }: Props) {
  const [idx, setIdx] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);
  const toqueX = useRef<number | null>(null);

  const total = imagens.length;
  const atual = Math.min(idx, total - 1);

  const anterior = useCallback(
    () => setIdx((p) => (p - 1 + total) % total),
    [total]
  );
  const proxima = useCallback(() => setIdx((p) => (p + 1) % total), [total]);

  const fecharLightbox = useCallback(() => {
    setLightbox(false);
    setZoom(null);
  }, []);

  // teclado + trava de scroll enquanto o lightbox está aberto
  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') fecharLightbox();
      if (e.key === 'ArrowLeft') { setZoom(null); anterior(); }
      if (e.key === 'ArrowRight') { setZoom(null); proxima(); }
    };
    document.addEventListener('keydown', onKey);
    const overflowAntes = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = overflowAntes;
    };
  }, [lightbox, anterior, proxima, fecharLightbox]);

  if (total === 0) {
    return (
      <div className="aspect-square rounded-t-[72px] rounded-b-2xl bg-white border border-grafite/10 flex items-center justify-center">
        <div className="text-center p-8">
          <LogoPoltrona tamanho={64} className="mx-auto mb-4 opacity-70" />
          <p className="text-grafite/60 font-medium">{nomeProduto}</p>
          <p className="text-grafite/40 text-sm mt-1">Foto em breve — consulte pelo WhatsApp</p>
        </div>
      </div>
    );
  }

  const posicaoZoom = (e: React.MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    return {
      x: ((e.clientX - r.left) / r.width) * 100,
      y: ((e.clientY - r.top) / r.height) * 100,
    };
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Foto principal — moldura portal */}
      <div className="relative aspect-square rounded-t-[72px] rounded-b-2xl overflow-hidden bg-white border border-grafite/10">
        <button
          onClick={() => setLightbox(true)}
          className="absolute inset-0 w-full h-full cursor-zoom-in focus-visible:outline-2 focus-visible:outline-musgo focus-visible:-outline-offset-4"
          aria-label={`Ampliar foto ${atual + 1} de ${nomeProduto}`}
        >
          <Image
            key={imagens[atual]}
            src={imagemUrl(imagens[atual])}
            alt={`${nomeProduto} — foto ${atual + 1} de ${total}`}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-contain p-6 sm:p-8"
            loading="eager"
            fetchPriority="high"
          />
        </button>

        {total > 1 && (
          <>
            <button
              onClick={anterior}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center bg-grafite/70 hover:bg-grafite text-cru rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-musgo"
              aria-label="Foto anterior"
            >
              {setaEsq}
            </button>
            <button
              onClick={proxima}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center bg-grafite/70 hover:bg-grafite text-cru rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-musgo"
              aria-label="Próxima foto"
            >
              {setaDir}
            </button>
          </>
        )}

        <span className="absolute bottom-3 right-3 bg-grafite/75 text-cru text-xs font-mono px-2.5 py-1 rounded-md pointer-events-none">
          {atual + 1}/{total}
        </span>
        <span className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-grafite/75 text-cru text-xs px-2.5 py-1 rounded-md pointer-events-none">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0zM11 8v6M8 11h6" />
          </svg>
          Ampliar
        </span>
      </div>

      {/* Miniaturas */}
      {total > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 snap-x" role="listbox" aria-label="Miniaturas das fotos">
          {imagens.map((img, i) => (
            <button
              key={img}
              onClick={() => setIdx(i)}
              role="option"
              aria-selected={i === atual}
              aria-label={`Foto ${i + 1}`}
              className={`relative shrink-0 snap-start w-16 h-16 rounded-xl overflow-hidden bg-white border-2 transition-colors ${
                i === atual ? 'border-musgo' : 'border-grafite/10 hover:border-grafite/40'
              }`}
            >
              <Image
                src={imagemUrl(img)}
                alt=""
                fill
                sizes="64px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox com zoom — portal escapa do stacking context da coluna sticky */}
      {lightbox && createPortal(
        <div
          className="fixed inset-0 z-[100] bg-grafite/95 flex flex-col"
          role="dialog"
          aria-modal="true"
          aria-label={`Fotos de ${nomeProduto}`}
        >
          <div className="flex items-center justify-between px-4 py-3 text-cru">
            <span className="font-mono text-sm">{atual + 1}/{total} — {nomeProduto}</span>
            <button
              onClick={fecharLightbox}
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
            <div
              className={`absolute inset-0 transition-transform duration-200 motion-reduce:transition-none ${zoom ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}
              style={
                zoom
                  ? { transform: 'scale(2.5)', transformOrigin: `${zoom.x}% ${zoom.y}%` }
                  : undefined
              }
              onClick={(e) => setZoom(zoom ? null : posicaoZoom(e))}
              onMouseMove={(e) => { if (zoom) setZoom(posicaoZoom(e)); }}
            >
              <Image
                key={imagens[atual]}
                src={imagemUrl(imagens[atual])}
                alt={`${nomeProduto} — foto ${atual + 1} ampliada`}
                fill
                sizes="100vw"
                quality={85}
                className="object-contain"
              />
            </div>

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
            {zoom ? 'Mova o mouse para percorrer o detalhe — clique para reduzir' : 'Clique na foto para dar zoom no acabamento'}
          </p>
        </div>,
        document.body
      )}
    </div>
  );
}
