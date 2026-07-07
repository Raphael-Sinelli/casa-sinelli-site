'use client';

import { useCallback, useRef, useState } from 'react';
import Image from 'next/image';
import Lightbox from './Lightbox';
import LogoPoltrona from './LogoPoltrona';

interface Props {
  imagens: string[];
  /** caminho da imagem → URL final, resolvido no servidor (mapaUrlsProduto). */
  urls: Record<string, string>;
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

export default function ProductGallery({ imagens, urls, nomeProduto }: Props) {
  const urlDe = (img: string) => urls[img] ?? encodeURI(`/api/catalogo${img}`);
  const [idx, setIdx] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  // swipe na foto principal: distingue arrasto de clique (clique abre o lightbox)
  const toqueX = useRef<number | null>(null);
  const arrastou = useRef(false);
  const botaoAmpliarRef = useRef<HTMLButtonElement>(null);

  const total = imagens.length;
  const atual = Math.min(idx, total - 1);

  const anterior = useCallback(
    () => setIdx((p) => (p - 1 + total) % total),
    [total]
  );
  const proxima = useCallback(() => setIdx((p) => (p + 1) % total), [total]);

  const fecharLightbox = useCallback(() => {
    setLightbox(false);
    // retorno de foco: quem abriu o dialog recupera o foco ao fechá-lo
    botaoAmpliarRef.current?.focus();
  }, []);

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

  return (
    <div className="flex flex-col gap-3">
      {/* Foto principal — moldura portal */}
      <div
        className="relative aspect-square rounded-t-[72px] rounded-b-2xl overflow-hidden bg-white border border-grafite/10"
        onPointerDown={(e) => {
          toqueX.current = e.clientX;
          arrastou.current = false;
        }}
        onPointerUp={(e) => {
          if (toqueX.current === null) return;
          const delta = e.clientX - toqueX.current;
          toqueX.current = null;
          if (Math.abs(delta) > 60 && total > 1) {
            arrastou.current = true;
            if (delta > 0) anterior();
            else proxima();
          }
        }}
      >
        <button
          ref={botaoAmpliarRef}
          onClick={() => {
            if (arrastou.current) {
              arrastou.current = false;
              return;
            }
            setLightbox(true);
          }}
          className="absolute inset-0 w-full h-full cursor-zoom-in touch-pan-y focus-visible:outline-2 focus-visible:outline-musgo focus-visible:-outline-offset-4"
          aria-label={`Ampliar foto ${atual + 1} de ${nomeProduto}`}
        >
          <Image
            key={imagens[atual]}
            src={urlDe(imagens[atual])}
            alt={`${nomeProduto} — foto ${atual + 1} de ${total}`}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="foto-entrar object-contain p-6 sm:p-8"
            preload
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

      {/* Miniaturas — botões simples; a ativa é sinalizada com aria-current */}
      {total > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 snap-x" aria-label="Miniaturas das fotos">
          {imagens.map((img, i) => (
            <button
              key={img}
              onClick={() => setIdx(i)}
              aria-current={i === atual ? 'true' : undefined}
              aria-label={`Foto ${i + 1}`}
              className={`relative shrink-0 snap-start w-16 h-16 rounded-xl overflow-hidden bg-white border-2 transition-colors ${
                i === atual ? 'border-musgo' : 'border-grafite/10 hover:border-grafite/40'
              }`}
            >
              <Image
                src={urlDe(img)}
                alt=""
                fill
                sizes="64px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {lightbox && (
        <Lightbox
          fotos={imagens.map((img, i) => ({
            url: urlDe(img),
            alt: `${nomeProduto} — foto ${i + 1} ampliada`,
          }))}
          indice={atual}
          nomeProduto={nomeProduto}
          aoFechar={fecharLightbox}
          aoNavegar={setIdx}
        />
      )}
    </div>
  );
}
