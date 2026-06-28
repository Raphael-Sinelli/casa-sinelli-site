import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-preto text-white/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Marca */}
          <div>
            <div className="font-serif text-2xl font-bold text-white mb-1">Casa Sinelli</div>
            <div className="text-xs tracking-widest text-white/50 uppercase mb-4">Móveis &amp; Colchões</div>
            <p className="text-sm text-white/60 leading-relaxed">
              Transformando ambientes com móveis de qualidade e atendimento personalizado em Ribeirão Pires.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Catálogo</h3>
            <ul className="space-y-2 text-sm">
              {[
                ['Sofás', '/categoria/sofa'],
                ['Camas', '/categoria/cama'],
                ['Guarda-Roupas', '/categoria/guarda-roupa'],
                ['Colchões', '/categoria/colchao'],
                ['Mesas', '/categoria/mesa'],
                ['Ver Tudo', '/catalogo'],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="text-white/60 hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Contato</h3>
            <ul className="space-y-3 text-sm text-white/60">
              <li className="flex gap-2">
                <span className="text-oliva-claro">📍</span>
                <span>Av. Francisco Monteiro, 1320 — Vila Fiorentino, Ribeirão Pires - SP</span>
              </li>
              <li className="flex gap-2">
                <span className="text-oliva-claro">📱</span>
                <a href="https://wa.me/5511971776165" className="hover:text-white transition-colors">
                  (11) 97177-6165
                </a>
              </li>
              <li className="flex gap-2">
                <span className="text-oliva-claro">✉️</span>
                <a href="mailto:contato@casasinelli.com.br" className="hover:text-white transition-colors">
                  contato@casasinelli.com.br
                </a>
              </li>
              <li className="flex gap-2">
                <span className="text-oliva-claro">🕐</span>
                <span>Seg–Sex: 09h às 18h | Sáb: 09h às 17h</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 text-center text-xs text-white/30">
          © {new Date().getFullYear()} Casa Sinelli — Móveis &amp; Colchões. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}
