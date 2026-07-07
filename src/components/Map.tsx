export default function Map() {
  return (
    // O card de endereço do Google fica DENTRO do iframe, no canto superior
    // esquerdo — a curva do arco o cortava. A faixa interna empurra o iframe
    // para baixo da curva (profundidade ≈ raio nas bordas do semicírculo),
    // então a máscara só recorta a faixa e o card fica sempre íntegro.
    // Altura da faixa ≥ profundidade da curva: sm:h-72 cobre o pior caso
    // (tablet, mapa em largura total → raio ≈ 352px, curva ≈ 277px em x=8).
    <div className="rounded-t-[999px] rounded-b-2xl overflow-hidden border border-grafite/12 bg-areia/30">
      <div className="h-40 sm:h-72 flex items-end justify-center pb-6">
        <p className="etiqueta">Estamos aqui</p>
      </div>
      <iframe
        src="https://www.google.com/maps?q=Av.+Francisco+Monteiro,+1320+-+Vila+Fiorentino,+Ribeir%C3%A3o+Pires+-+SP&hl=pt-BR&z=16&output=embed"
        width="100%"
        height="380"
        style={{ border: 0, display: 'block' }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Localização Casa Sinelli — Av. Francisco Monteiro, 1320, Ribeirão Pires"
      />
    </div>
  );
}
