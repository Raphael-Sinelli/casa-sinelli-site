'use client';

import { useEscolha } from './ProdutoEscolha';

/**
 * Mini-sumário sob o título. Só atalha para seções que existem NESTA página, no
 * estado ATUAL: o rótulo do bloco de seleção vem do mesmo cálculo que decide o
 * que o seletor desenha, então nunca promete uma cor que a tela não tem.
 */
export default function AtalhosPDP({
  temMedidas,
  temParecidos,
}: {
  temMedidas: boolean;
  temParecidos: boolean;
}) {
  const { rotulo } = useEscolha();

  const atalhos: ReadonlyArray<readonly [href: string, rotulo: string]> = [
    ...(rotulo ? [['#cores', rotulo] as const] : []),
    ...(temMedidas ? [['#medidas', 'Medidas'] as const] : []),
    ...(temParecidos ? [['#parecidos', 'Parecidos'] as const] : []),
  ];

  if (atalhos.length === 0) return null;

  return (
    <nav
      aria-label="Atalhos desta página"
      className="mt-3.5 flex flex-wrap items-center gap-y-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-grafite/60"
    >
      {atalhos.map(([href, texto], i) => (
        <span key={href} className="flex items-center">
          {i > 0 && <span aria-hidden="true" className="mx-2.5 text-grafite/30">·</span>}
          <a
            href={href}
            className="py-1 underline underline-offset-4 decoration-grafite/25 hover:text-musgo-escuro hover:decoration-musgo-escuro transition-colors focus-visible:outline-2 focus-visible:outline-musgo rounded-sm"
          >
            {texto}
          </a>
        </span>
      ))}
    </nav>
  );
}
