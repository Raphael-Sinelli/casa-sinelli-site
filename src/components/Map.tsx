export default function Map() {
  return (
    <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-200">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3654.123!2d-46.4131!3d-23.7152!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce7ce4c4c4c4c4%3A0x0!2sAv.+Francisco+Monteiro%2C+1320+-+Vila+Fiorentino%2C+Ribeir%C3%A3o+Pires+-+SP!5e0!3m2!1spt-BR!2sbr!4v1234567890"
        width="100%"
        height="350"
        style={{ border: 0, display: 'block' }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Localização Casa Sinelli — Av. Francisco Monteiro, 1320, Ribeirão Pires"
      />
    </div>
  );
}
