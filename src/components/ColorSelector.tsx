'use client';

import type { Variacao } from '@/lib/tipos';

interface Props {
  variacoes: Variacao[];
  corSelecionada: string;
  onSelect: (cor: string) => void;
}

export default function ColorSelector({ variacoes, corSelecionada, onSelect }: Props) {
  if (variacoes.length <= 1) return null;

  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-700 mb-2">
        Variação:{' '}
        <span className="text-marrom font-bold">{corSelecionada}</span>
      </h3>
      <div className="flex flex-wrap gap-2">
        {variacoes.map((v) => (
          <button
            key={v.cor}
            onClick={() => onSelect(v.cor)}
            aria-pressed={v.cor === corSelecionada}
            className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
              v.cor === corSelecionada
                ? 'bg-marrom text-white border-marrom shadow-md'
                : 'bg-white text-marrom border-marrom/30 hover:border-marrom hover:bg-marrom-palido'
            }`}
          >
            {v.cor}
          </button>
        ))}
      </div>
    </div>
  );
}
