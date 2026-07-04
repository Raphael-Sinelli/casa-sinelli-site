export default function Map() {
  return (
    <div className="rounded-2xl overflow-hidden border border-grafite/12 bg-white">
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
