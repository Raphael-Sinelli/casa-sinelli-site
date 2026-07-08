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
}

// alt vazio de propósito: o nome do produto está no h3 adjacente dentro do
// mesmo link — repetir no alt faz o leitor de tela anunciar 2×.
function FotoCard({ src, sizes }: { src: string | null; sizes: string }) {
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
      className="object-contain p-2 transition-transform duration-[var(--dur-short)] motion-reduce:transition-none group-hover:scale-[var(--motion-scale-subtle)]"
    />
  );
}

function ProductCard({ produto, mostrarCategoria = true, sizes = SIZES_PADRAO }: Props) {
  return (
    <article className="group bg-white rounded-2xl overflow-hidden border border-grafite/10 flex flex-col transition-[border-color,background-color,transform] duration-[var(--dur-short)] motion-reduce:transition-none hover:border-marca/70 hover:bg-areia/25 focus-within:border-marca/70 focus-within:bg-areia/25 active:scale-[0.99] motion-reduce:active:scale-100 [content-visibility:auto] [contain-intrinsic-size:auto_420px]">
      <Link
        href={`/produto/${produto.id}`}
        className="flex flex-col flex-1 focus-visible:outline-2 focus-visible:outline-musgo focus-visible:-outline-offset-2"
      >
        <div className="relative aspect-[4/3] bg-white border-b border-grafite/8 overflow-hidden">
          <FotoCard src={produto.capaUrl} sizes={sizes} />
          {/* passe-partout: filete interno de moldura, como foto de catálogo impresso */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-2 rounded-lg ring-1 ring-inset ring-grafite/8"
          />
        </div>
        <div className="flex-1 px-4 pt-3.5 pb-2">
          {mostrarCategoria && (
            <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-marca mb-1">
              {produto.categoria}
            </p>
          )}
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

      <div className="px-4 pb-4 pt-1">
        <BotaoWhatsApp
          mensagem={mensagemProduto(produto.nome)}
          larguraTotal
          rotuloAcessivel={`Consultar preço de ${produto.nome} no WhatsApp`}
        />
      </div>
    </article>
  );
}

// memo: a lista do catálogo re-renderiza a cada tecla da busca — os cards
// que permanecem no resultado não devem re-renderizar.
export default memo(ProductCard);
