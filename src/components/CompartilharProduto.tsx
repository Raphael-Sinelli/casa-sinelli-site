'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, Share2 } from 'lucide-react';

interface Props {
  nomeProduto: string;
}

// Pensado para a venda assistida: a vendedora abre o produto na loja e envia
// o link ao cliente. Mobile/tablet: folha de compartilhar do sistema (com
// WhatsApp). Desktop sem Web Share: abre o "compartilhar no WhatsApp"
// (Web/app) já com nome + link — wa.me SEM número de propósito: o destino é
// o cliente que a vendedora escolhe, não a loja. Pop-up bloqueado: copia.
export default function CompartilharProduto({ nomeProduto }: Props) {
  const [copiado, setCopiado] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  const compartilhar = async () => {
    const texto = `${nomeProduto} — Casa Sinelli`;
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: texto, text: texto, url });
      } catch {
        // cancelado pelo usuário — sem feedback
      }
      return;
    }
    const aba = window.open(
      `https://wa.me/?text=${encodeURIComponent(`${texto}\n${url}`)}`,
      '_blank',
      'noopener,noreferrer'
    );
    if (aba) return;
    try {
      await navigator.clipboard.writeText(`${texto}\n${url}`);
      setCopiado(true);
      if (timerRef.current) window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => setCopiado(false), 2500);
    } catch {
      // clipboard indisponível (http antigo): seleção manual da URL resolve
    }
  };

  return (
    <button
      onClick={compartilhar}
      className="w-full inline-flex items-center justify-center gap-2 border-[1.5px] border-grafite/25 hover:border-grafite text-grafite font-semibold text-sm px-5 py-3 pointer-coarse:min-h-11 rounded-xl bg-transparent hover:bg-white transition-[border-color,background-color,transform] duration-[var(--dur-short)] touch-manipulation active:scale-[var(--motion-scale-active)] motion-reduce:transition-none motion-reduce:active:scale-100 focus-visible:outline-2 focus-visible:outline-musgo"
    >
      {copiado ? (
        <Check className="w-4 h-4 text-musgo-escuro" aria-hidden="true" />
      ) : (
        <Share2 className="w-4 h-4" aria-hidden="true" />
      )}
      <span aria-live="polite">{copiado ? 'Link copiado' : 'Enviar este produto'}</span>
    </button>
  );
}
