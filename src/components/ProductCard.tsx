import { memo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { ProdutoResumo } from '@/lib/tipos';
import { mensagemProduto } from '@/lib/whatsapp';
import BotaoWhatsApp from './BotaoWhatsApp';
import LogoPoltrona from './LogoPoltrona';

// grade do catálogo: 1 col / sm:2 / xl:3
const SIZES_PADRAO = '(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw';

interface Props {
  produto: ProdutoResumo;
  mostrarCategoria?: boolean;
  /** Atributo sizes da capa — ajustar quando a grade do contexto for outra. */
  sizes?: string;
  /** Vitrine editorial (célula larga): foto em cover com faixa grafite. */
  vitrine?: boolean;
}

// alt vazio de propósito: o nome do produto está no h3 adjacente dentro do
// mesmo link — repetir no alt faz o leitor de tela anunciar 2×.
function FotoCard({ src, sizes, cover = false }: { src: string | null; sizes: string; cover?: boolean }) {
  if (!src) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center p-4">
          <LogoPoltrona tamanho={44} className="mx-auto mb-2 opacity-70" />
          <p className="text-xs text-grafite/50 font-medium">Foto em breve</p>
        </div>
      </div>
    );
  }
  return (
    <Image
      src={src}
      alt=""
      fill
      sizes={sizes}
      className={`${cover ? 'object-cover' : 'object-contain p-3'} transition-transform duration-[var(--dur-short)] motion-reduce:transition-none group-hover:scale-[var(--motion-scale-subtle)]`}
    />
  );
}

// Ficha de showroom: raio de impresso (4px), meta-linha "CATEGORIA · N.º id",
// foto sobre degradê de papel (integra estúdio e ambientada), ação em linha
// com hairline — o verde sólido fica para o CTA primário de cada tela.
function ProductCard({ produto, mostrarCategoria = true, sizes = SIZES_PADRAO, vitrine = false }: Props) {
  if (vitrine) {
    return (
      <article className="group relative rounded-[4px] overflow-hidden border border-grafite/15 bg-grafite flex flex-col transition-[border-color,transform] duration-[var(--dur-short)] motion-reduce:transition-none hover:border-marca focus-within:border-marca active:scale-[0.99] motion-reduce:active:scale-100 [content-visibility:auto] [contain-intrinsic-size:auto_420px] h-full">
        <Link
          href={`/produto/${produto.id}`}
          className="flex flex-col flex-1 focus-visible:outline-2 focus-visible:outline-areia focus-visible:-outline-offset-2"
        >
          <div className="relative flex-1 min-h-[260px] bg-gradient-to-b from-white to-areia/40 overflow-hidden">
            <FotoCard src={produto.capaUrl} sizes={sizes} cover />
          </div>
          <div className="flex items-baseline justify-between gap-3 px-4 sm:px-5 py-3.5 bg-grafite">
            <div className="min-w-0">
              {mostrarCategoria && (
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-areia mb-0.5">
                  {produto.categoria}
                </p>
              )}
              <h3 className="font-serif text-xl sm:text-2xl font-medium text-cru leading-snug truncate">
                {produto.nome}
              </h3>
            </div>
            <span className="font-mono text-[10.5px] text-cru/60 shrink-0">
              N.º {produto.id}
            </span>
          </div>
        </Link>
        <BotaoWhatsApp
          variante="linha"
          mensagem={mensagemProduto(produto.nome)}
          rotuloAcessivel={`Consultar preço de ${produto.nome} no WhatsApp`}
          className="bg-cru border-t-0"
        />
      </article>
    );
  }

  return (
    <article className="group bg-white rounded-[4px] overflow-hidden border border-grafite/15 flex flex-col transition-[border-color,background-color,transform] duration-[var(--dur-short)] motion-reduce:transition-none hover:border-marca focus-within:border-marca active:scale-[0.99] motion-reduce:active:scale-100 [content-visibility:auto] [contain-intrinsic-size:auto_420px] h-full">
      <Link
        href={`/produto/${produto.id}`}
        className="flex flex-col flex-1 focus-visible:outline-2 focus-visible:outline-musgo focus-visible:-outline-offset-2"
      >
        {/* foto absorve a altura extra em linhas mistas (vitrine ao lado):
            aspect 4/3 é o mínimo; com sobra, o produto cresce — não o vazio */}
        <div className="relative flex-1 min-h-0 [aspect-ratio:4/3] bg-gradient-to-b from-white to-areia/35 border-b border-grafite/10 overflow-hidden">
          <FotoCard src={produto.capaUrl} sizes={sizes} />
          {/* passe-partout: filete interno de moldura, como foto de catálogo impresso */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-2 rounded-[2px] ring-1 ring-inset ring-grafite/8"
          />
        </div>
        <div className="px-4 pt-3 pb-3">
          <p className="flex items-baseline justify-between gap-2 font-mono text-[10px] uppercase tracking-[0.16em] mb-1.5">
            <span className="text-marca truncate">
              {mostrarCategoria ? produto.categoria : ' '}
            </span>
            <span className="text-grafite/45 shrink-0 normal-case tracking-normal">N.º {produto.id}</span>
          </p>
          <h3 className="font-serif text-[21px] font-medium text-grafite leading-snug line-clamp-2 group-hover:text-musgo-escuro transition-colors">
            {produto.nome}
          </h3>
          {produto.totalCores >= 2 && (
            <p className="font-mono text-[11px] text-grafite/60 mt-1.5">
              {produto.totalCores} cores
            </p>
          )}
        </div>
      </Link>

      <BotaoWhatsApp
        variante="linha"
        mensagem={mensagemProduto(produto.nome)}
        rotuloAcessivel={`Consultar preço de ${produto.nome} no WhatsApp`}
      />
    </article>
  );
}

// memo: a lista do catálogo re-renderiza a cada tecla da busca — os cards
// que permanecem no resultado não devem re-renderizar.
export default memo(ProductCard);
