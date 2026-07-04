'use client';

interface Props {
  valor: string;
  onChange: (v: string) => void;
  placeholder?: string;
}

export default function SearchBar({ valor, onChange, placeholder = 'Buscar produto, marca ou categoria…' }: Props) {
  return (
    <div className="relative">
      <input
        type="search"
        value={valor}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Buscar produtos"
        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-grafite/20 bg-white text-sm text-grafite focus:outline-none focus:ring-2 focus:ring-vinho/35 focus:border-vinho transition-all placeholder:text-grafite/40"
      />
      <svg
        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-grafite/40"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
      </svg>
      {valor && (
        <button
          onClick={() => onChange('')}
          aria-label="Limpar busca"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-grafite/40 hover:text-grafite transition-colors focus-visible:outline-2 focus-visible:outline-vinho rounded-sm"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}
