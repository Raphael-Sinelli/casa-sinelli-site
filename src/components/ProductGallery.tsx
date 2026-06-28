'use client';

import { useState } from 'react';
import { isImagemDisplay, imagemUrl } from '@/lib/produtos';

interface Props {
  imagens: string[];
  nomeProduto: string;
}

export default function ProductGallery({ imagens, nomeProduto }: Props) {
  const displayaveis = imagens.filter(isImagemDisplay);
  const [selecionada, setSelecionada] = useState(0);

  if (displayaveis.length === 0) {
    return (
      <div className="aspect-square rounded-2xl bg-marrom-palido flex items-center justify-center">
        <div className="text-center p-8">
          <div className="text-6xl mb-4">🛋️</div>
          <p className="text-marrom/60 font-medium">{nomeProduto}</p>
        </div>
      </div>
    );
  }

  const idx = Math.min(selecionada, displayaveis.length - 1);

  return (
    <div className="flex flex-col gap-3">
      {/* Imagem principal */}
      <div className="relative aspect-square md:min-h-[500px] rounded-2xl overflow-hidden bg-marrom-palido/30 shadow-md">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={displayaveis[idx]}
          src={imagemUrl(displayaveis[idx])}
          alt={`${nomeProduto} — foto ${idx + 1}`}
          className="w-full h-full object-contain"
        />

        {/* Navegação por setas */}
        {displayaveis.length > 1 && (
          <>
            <button
              onClick={() => setSelecionada((prev) => (prev - 1 + displayaveis.length) % displayaveis.length)}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 transition-colors"
              aria-label="Foto anterior"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => setSelecionada((prev) => (prev + 1) % displayaveis.length)}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 transition-colors"
              aria-label="Próxima foto"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Contador */}
        <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
          {idx + 1}/{displayaveis.length}
        </div>
      </div>

      {/* Miniaturas */}
      {displayaveis.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 snap-x">
          {displayaveis.map((img, i) => (
            <button
              key={img}
              onClick={() => setSelecionada(i)}
              aria-label={`Ver foto ${i + 1}`}
              className={`shrink-0 snap-start w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                i === idx
                  ? 'border-marrom shadow-md scale-105'
                  : 'border-transparent hover:border-marrom/50'
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imagemUrl(img)}
                alt={`Miniatura ${i + 1}`}
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
