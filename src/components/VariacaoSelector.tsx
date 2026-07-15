'use client';

import type { Variacao } from '@/lib/tipos';
import type { GrupoCor } from '@/lib/catalogo-utils';
import { resolverSwatch, rotuloNivel1, rotuloVariacao } from '@/lib/catalogo-utils';

interface Props {
  variacoes: Variacao[];
  variacaoAtiva: string;
  onVariacao: (cor: string) => void;
  grupos: GrupoCor[];
  grupoAtivo: string | null;
  onGrupo: (cor: string | null) => void;
}

function Chip({
  ativo,
  onClick,
  children,
}: {
  ativo: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={ativo}
      className={`px-3.5 py-2 pointer-coarse:min-h-11 rounded-lg text-sm font-medium border transition-colors focus-visible:outline-2 focus-visible:outline-musgo focus-visible:outline-offset-2 ${
        ativo
          ? 'bg-grafite text-cru border-grafite'
          : 'bg-white text-grafite border-grafite/25 hover:border-grafite'
      }`}
    >
      {children}
    </button>
  );
}

// Padrão diagonal (sem cor real reconhecida) — nunca esconde o rótulo, só
// avisa visualmente que a amostra é aproximada.
const FALLBACK_STYLE: React.CSSProperties = {
  backgroundColor: 'var(--color-cru)',
  backgroundImage:
    'repeating-linear-gradient(135deg, var(--color-grafite) 0, var(--color-grafite) 1px, transparent 1px, transparent 6px)',
  opacity: 0.55,
};

// Faixas diagonais iguais, uma por acabamento ("Naturalle Freijo Caramelo" = 3).
function gradienteMulti(cores: string[]): string {
  const passo = 100 / cores.length;
  const paradas = cores
    .map((c, i) => `${c} ${i * passo}%, ${c} ${(i + 1) * passo}%`)
    .join(', ');
  return `linear-gradient(135deg, ${paradas})`;
}

function CorSwatch({
  cor,
  ativo,
  onClick,
}: {
  cor: string;
  ativo: boolean;
  onClick: () => void;
}) {
  const swatch = resolverSwatch(cor);
  const estiloFill: React.CSSProperties =
    swatch.tipo === 'solido'
      ? { backgroundColor: swatch.cor }
      : swatch.tipo === 'multi'
        ? { background: gradienteMulti(swatch.cores) }
        : FALLBACK_STYLE;

  return (
    <button
      onClick={onClick}
      aria-pressed={ativo}
      className="group/swatch flex items-center gap-2 py-1.5 pl-1.5 pr-3 pointer-coarse:min-h-11 rounded-[4px] focus-visible:outline-2 focus-visible:outline-musgo focus-visible:outline-offset-2"
    >
      <span
        aria-hidden="true"
        style={estiloFill}
        className={`h-7 w-7 shrink-0 rounded-[4px] border transition-[transform,opacity,border-color,box-shadow] duration-[var(--dur-short)] [transition-timing-function:var(--ease-assentar)] ${
          ativo
            ? 'border-musgo ring-2 ring-musgo/25 ring-offset-1 ring-offset-white scale-[var(--motion-scale-subtle)] opacity-100'
            : 'border-grafite/20 opacity-90 group-hover/swatch:border-marca group-hover/swatch:opacity-100'
        }`}
      />
      <span
        className={`text-sm transition-colors duration-[var(--dur-short)] ${
          ativo ? 'font-semibold text-grafite' : 'font-medium text-grafite/75 group-hover/swatch:text-grafite'
        }`}
      >
        {rotuloVariacao(cor)}
      </span>
    </button>
  );
}

export default function VariacaoSelector({
  variacoes,
  variacaoAtiva,
  onVariacao,
  grupos,
  grupoAtivo,
  onGrupo,
}: Props) {
  const gruposComCor = grupos.filter((g) => g.cor !== null);
  const rotulo = rotuloNivel1(variacoes);

  return (
    <div className="flex flex-col gap-4">
      {variacoes.length > 1 && (
        <div role="group" aria-label={`Escolher ${rotulo.toLowerCase()}`}>
          <p className="text-xs font-mono uppercase tracking-widest text-marca mb-2">
            {rotulo}
            <span className="text-grafite font-sans normal-case tracking-normal text-sm font-semibold ml-2">
              {rotuloVariacao(variacaoAtiva)}
            </span>
          </p>
          <div className="flex flex-wrap gap-1">
            {variacoes.map((v) =>
              rotulo === 'Cor' ? (
                <CorSwatch
                  key={v.cor}
                  cor={v.cor}
                  ativo={v.cor === variacaoAtiva}
                  onClick={() => onVariacao(v.cor)}
                />
              ) : (
                <Chip key={v.cor} ativo={v.cor === variacaoAtiva} onClick={() => onVariacao(v.cor)}>
                  {rotuloVariacao(v.cor)}
                </Chip>
              )
            )}
          </div>
        </div>
      )}

      {gruposComCor.length > 1 && (
        <div role="group" aria-label="Escolher cor">
          <p className="text-xs font-mono uppercase tracking-widest text-marca mb-2">
            Cor
            {grupoAtivo && (
              <span className="text-grafite font-sans normal-case tracking-normal text-sm font-semibold ml-2">
                {rotuloVariacao(grupoAtivo)}
              </span>
            )}
          </p>
          <div className="flex flex-wrap gap-1">
            {gruposComCor.map((g) => (
              <CorSwatch
                key={g.cor}
                cor={g.cor!}
                ativo={g.cor === grupoAtivo}
                onClick={() => onGrupo(g.cor)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
