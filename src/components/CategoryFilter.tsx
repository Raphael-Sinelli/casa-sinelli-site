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

function ItemFiltro({
  ativo,
  onClick,
  nome,
  total,
}: {
  ativo: boolean;
  onClick: () => void;
  nome: string;
  total: number;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={ativo}
      className={`text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-between gap-2 focus-visible:outline-2 focus-visible:outline-vinho ${
        ativo
          ? 'bg-grafite text-cru'
          : 'text-grafite/85 hover:bg-cru hover:text-grafite'
      }`}
    >
      <span className="truncate">{nome}</span>
      <span className={`font-mono text-xs shrink-0 ${ativo ? 'text-cru/70' : 'text-grafite/40'}`}>
        {total}
      </span>
    </button>
  );
}

export default function CategoryFilter({ categorias, selecionada, onSelect }: Props) {
  return (
    <div className="flex flex-col min-h-0">
      <h2 className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-jatoba mb-3 shrink-0">
        Categorias
      </h2>
      <div className="flex flex-col gap-0.5 overflow-y-auto min-h-0">
        <ItemFiltro
          ativo={selecionada === null}
          onClick={() => onSelect(null)}
          nome="Todos os produtos"
          total={categorias.reduce((s, c) => s + c.total, 0)}
        />
        {categorias.map((cat) => (
          <ItemFiltro
            key={cat.slug}
            ativo={selecionada === cat.slug}
            onClick={() => onSelect(cat.slug)}
            nome={cat.nome}
            total={cat.total}
          />
        ))}
      </div>
    </div>
  );
}
