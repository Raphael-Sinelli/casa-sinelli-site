import WhatsAppIcon from './WhatsAppIcon';
import { linkWhatsApp } from '@/lib/whatsapp';

type Tamanho = 'sm' | 'md' | 'lg' | 'xl';

const TAMANHOS: Record<Tamanho, { botao: string; icone: string }> = {
  sm: { botao: 'gap-2 text-sm font-semibold px-4.5 py-2.5', icone: 'w-4.5 h-4.5' },
  md: { botao: 'gap-2.5 font-semibold px-6 py-3.5', icone: 'w-5 h-5' },
  lg: { botao: 'gap-2.5 text-base font-bold px-7 py-4', icone: 'w-5 h-5' },
  xl: { botao: 'gap-3 text-lg font-bold px-6 py-4', icone: 'w-6 h-6' },
};

interface Props {
  /** Texto pré-preenchido da conversa; sem ele o link abre o chat vazio. */
  mensagem?: string;
  tamanho?: Tamanho;
  /** Em seções de fundo grafite o anel de foco vira areia (contraste). */
  fundoEscuro?: boolean;
  larguraTotal?: boolean;
  /**
   * 'solido' = pílula verde (1 por tela: hero, PDP, CTA final).
   * 'linha'  = linha de ação da ficha de catálogo (grade de cards): texto
   * grafite, ícone verde, hairline superior — some o mar de verde da listagem.
   */
  variante?: 'solido' | 'linha';
  className?: string;
  rotuloAcessivel?: string;
  children?: React.ReactNode;
}

export default function BotaoWhatsApp({
  mensagem,
  tamanho = 'sm',
  fundoEscuro = false,
  larguraTotal = false,
  variante = 'solido',
  className,
  rotuloAcessivel,
  children = 'Consultar preço',
}: Props) {
  const t = TAMANHOS[tamanho];

  if (variante === 'linha') {
    const classesLinha = [
      'group/wa flex w-full items-center justify-between gap-3 px-4 py-3 pointer-coarse:min-h-11',
      'border-t border-grafite/10 text-sm font-bold text-grafite',
      'transition-[background-color,color] duration-[var(--dur-micro)] touch-manipulation',
      'hover:bg-wa/12 active:bg-wa/20 motion-reduce:transition-none',
      'focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-musgo',
      className,
    ]
      .filter(Boolean)
      .join(' ');
    return (
      <a
        href={linkWhatsApp(mensagem)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={rotuloAcessivel}
        className={classesLinha}
      >
        {children}
        <WhatsAppIcon className="w-5 h-5 shrink-0 text-wa-escuro transition-transform duration-[var(--dur-micro)] group-hover/wa:scale-110 motion-reduce:transition-none motion-reduce:group-hover/wa:scale-100" />
      </a>
    );
  }
  const classes = [
    larguraTotal ? 'flex w-full' : 'inline-flex',
    'items-center justify-center',
    t.botao,
    'bg-wa hover:bg-wa-escuro text-grafite rounded-xl',
    // scale (propriedade própria no Tailwind v4) transiciona; transform fica
    // fora da lista — é o canal do magnético GSAP (areas/whatsapp.ts)
    'transition-[background-color,scale] duration-[var(--dur-micro)] touch-manipulation active:scale-[var(--motion-scale-active)]',
    'motion-reduce:transition-none motion-reduce:active:scale-100',
    'focus-visible:outline-2 focus-visible:outline-offset-2',
    fundoEscuro ? 'focus-visible:outline-areia' : 'focus-visible:outline-musgo',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <a
      href={linkWhatsApp(mensagem)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={rotuloAcessivel}
      data-motion-magnetico
      className={classes}
    >
      <WhatsAppIcon className={`${t.icone} shrink-0`} />
      {children}
    </a>
  );
}
