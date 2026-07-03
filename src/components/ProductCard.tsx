import Link from 'next/link';
import Image from 'next/image';
import type { Produto } from '@/lib/tipos';
import { capaProduto, mensagemWhatsApp, imagemUrl } from '@/lib/produtos';
import WhatsAppIcon from './WhatsAppIcon';

interface Props {
  produto: Produto;
}

function ImagemProduto({ src, alt }: { src: string | null; alt: string }) {
  if (!src) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-marrom-palido">
        <div className="text-center p-4">
          <span className="mx-auto mb-2 flex w-10 h-10 items-center justify-center rounded-full rounded-bl-sm bg-jatoba text-cru font-serif italic font-semibold text-sm">
            CS
          </span>
          <p className="text-xs text-marrom/60 font-medium">{alt}</p>
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
      className="object-contain p-2 group-hover:scale-105 transition-transform duration-500 motion-reduce:transition-none"
    />
  );
}

export default function ProductCard({ produto }: Props) {
  const imagem = capaProduto(produto);
  const whatsappUrl = mensagemWhatsApp(produto.nome);

  return (
    <article className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow border border-gray-100 flex flex-col group">
      {/* Imagem */}
      <Link href={`/produto/${produto.id}`} className="block relative overflow-hidden aspect-[4/3] bg-marrom-palido">
        <ImagemProduto src={imagem} alt={produto.nome} />
        {/* Badge categoria */}
        <span className="absolute top-2 left-2 bg-marrom/80 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
          {produto.categoria}
        </span>
      </Link>

      {/* Conteúdo */}
      <div className="flex flex-col flex-1 p-4 gap-3">
        <div className="flex-1">
          <Link href={`/produto/${produto.id}`}>
            <h3 className="font-serif text-marrom font-semibold text-base leading-snug hover:text-marrom-escuro transition-colors line-clamp-2">
              {produto.nome}
            </h3>
          </Link>
          <p className="text-sm text-marrom/60 mt-1 font-medium">Consulte o preço</p>
        </div>

        {/* Botões */}
        <div className="flex gap-2 mt-auto">
          <Link
            href={`/produto/${produto.id}`}
            className="flex-1 text-center text-sm font-semibold bg-marrom-palido text-marrom hover:bg-marrom hover:text-white py-2 rounded-lg transition-colors"
          >
            Ver produto
          </Link>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Perguntar sobre ${produto.nome} no WhatsApp`}
            className="flex items-center justify-center w-10 h-10 bg-wa hover:bg-wa-escuro text-white rounded-lg transition-colors shrink-0"
          >
            <WhatsAppIcon />
          </a>
        </div>
      </div>
    </article>
  );
}
