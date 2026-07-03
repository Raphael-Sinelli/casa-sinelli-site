import WhatsAppIcon from './WhatsAppIcon';

export default function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/5511971776165"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Fale conosco pelo WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-wa hover:bg-wa-escuro text-white font-semibold px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 motion-reduce:transition-none motion-reduce:hover:scale-100 group"
    >
      <WhatsAppIcon className="w-6 h-6 shrink-0" />
      <span className="text-sm hidden sm:inline">Consultar preço</span>
    </a>
  );
}
