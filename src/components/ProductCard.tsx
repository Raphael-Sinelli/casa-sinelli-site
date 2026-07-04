import Link from 'next/link';
import Image from 'next/image';
import type { Produto } from '@/lib/tipos';
import { capaProduto, mensagemWhatsApp, imagemUrl } from '@/lib/produtos';
import WhatsAppIcon from './WhatsAppIcon';
import LogoPoltrona from './LogoPoltrona';

interface Props {
  produto: Produto;
  mostrarCategoria?: boolean;
}

function FotoCard({ src, alt }: { src: string | null; alt: string }) {
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
      src={imagemUrl(src)}
      alt={alt}
      fill
      sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
      className="object-contain p-3 transition-transform duration-300 motion-reduce:transition-none group-hover:scale-[1.03]"
    />
  );
}

export default function ProductCard({ produto, mostrarCategoria = true }: Props) {
  const imagem = capaProduto(produto);
  const whatsappUrl = mensagemWhatsApp(produto.nome);

  return (
    <article className="group bg-white rounded-2xl overflow-hidden border border-grafite/10 flex flex-col transition-all duration-200 motion-reduce:transition-none hover:shadow-[0_12px_32px_-12px_rgba(51,46,41,0.28)] hover:-translate-y-0.5 motion-reduce:hover:translate-y-0">
      <Link
        href={`/produto/${produto.id}`}
        className="flex flex-col flex-1 focus-visible:outline-2 focus-visible:outline-musgo focus-visible:-outline-offset-2"
      >
        <div className="relative aspect-[4/3] bg-white border-b border-grafite/8 overflow-hidden">
          <FotoCard src={imagem} alt={produto.nome} />
        </div>
        <div className="flex-1 px-4 pt-3.5 pb-2">
          {mostrarCategoria && (
            <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-marca mb-1">
              {produto.categoria}
            </p>
          )}
          <h3 className="font-serif text-[19px] font-medium text-grafite leading-snug line-clamp-2 group-hover:text-musgo transition-colors">
            {produto.nome}
          </h3>
          <p className="text-sm text-grafite/55 mt-1">Consulte o preço</p>
        </div>
      </Link>

      <div className="px-4 pb-4 pt-1">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Consultar preço de ${produto.nome} no WhatsApp`}
          className="flex items-center justify-center gap-2 bg-wa hover:bg-wa-escuro text-white text-sm font-semibold py-2.5 rounded-xl transition-colors focus-visible:outline-2 focus-visible:outline-musgo focus-visible:outline-offset-2"
        >
          <WhatsAppIcon className="w-4.5 h-4.5" />
          Consultar preço
        </a>
      </div>
    </article>
  );
}
