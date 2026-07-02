'use client';

interface Categoria {
  nome: string;
  slug: string;
  total: number;
}

interface Props {
  categorias: Categoria[];
  selecionada: string | null;
  onSelect: (slug: string | null) => void;
}

export default function CategoryFilter({ categorias, selecionada, onSelect }: Props) {
  return (
    <div className="flex flex-col min-h-0">
      <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3 shrink-0">Categorias</h2>
      <div className="flex flex-col gap-1 overflow-y-auto min-h-0">
        <button
          onClick={() => onSelect(null)}
          className={`text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-between ${
            selecionada === null
              ? 'bg-marrom text-white'
              : 'text-gray-700 hover:bg-marrom-palido hover:text-marrom'
          }`}
        >
          <span>Todos os Produtos</span>
          <span className={`text-xs ${selecionada === null ? 'text-white/70' : 'text-gray-400'}`}>
            {categorias.reduce((s, c) => s + c.total, 0)}
          </span>
        </button>
        {categorias.map((cat) => (
          <button
            key={cat.slug}
            onClick={() => onSelect(cat.slug)}
            className={`text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-between ${
              selecionada === cat.slug
                ? 'bg-marrom text-white'
                : 'text-gray-700 hover:bg-marrom-palido hover:text-marrom'
            }`}
          >
            <span>{cat.nome}</span>
            <span className={`text-xs ${selecionada === cat.slug ? 'text-white/70' : 'text-gray-400'}`}>
              {cat.total}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
