'use client';

import type { Variacao } from '@/lib/tipos';
import type { GrupoCor } from '@/lib/produtos';
import { ehTamanho, rotuloVariacao } from '@/lib/produtos';

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
      className={`px-3.5 py-2 rounded-lg text-sm font-medium border transition-colors focus-visible:outline-2 focus-visible:outline-musgo focus-visible:outline-offset-2 ${
        ativo
          ? 'bg-grafite text-cru border-grafite'
          : 'bg-white text-grafite border-grafite/25 hover:border-grafite'
      }`}
    >
      {children}
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
  const rotuloNivel1 =
    variacoes.length > 0 && ehTamanho(variacoes[0].cor) ? 'Tamanho' : 'Cor';

  return (
    <div className="flex flex-col gap-4">
      {variacoes.length > 1 && (
        <div role="group" aria-label={`Escolher ${rotuloNivel1.toLowerCase()}`}>
          <p className="text-xs font-mono uppercase tracking-widest text-marca mb-2">
            {rotuloNivel1}
            <span className="text-grafite font-sans normal-case tracking-normal text-sm font-semibold ml-2">
              {rotuloVariacao(variacaoAtiva)}
            </span>
          </p>
          <div className="flex flex-wrap gap-2">
            {variacoes.map((v) => (
              <Chip key={v.cor} ativo={v.cor === variacaoAtiva} onClick={() => onVariacao(v.cor)}>
                {rotuloVariacao(v.cor)}
              </Chip>
            ))}
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
          <div className="flex flex-wrap gap-2">
            {gruposComCor.map((g) => (
              <Chip key={g.cor} ativo={g.cor === grupoAtivo} onClick={() => onGrupo(g.cor)}>
                {rotuloVariacao(g.cor!)}
              </Chip>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
