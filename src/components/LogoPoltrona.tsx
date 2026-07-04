import Image from 'next/image';

interface Props {
  tamanho?: number;
  className?: string;
}

// Ícone da marca: a poltrona do logo oficial (recorte transparente do PDF em alta)
export default function LogoPoltrona({ tamanho = 40, className = '' }: Props) {
  return (
    <Image
      src="/logo-poltrona.png"
      alt=""
      aria-hidden="true"
      width={tamanho}
      height={Math.round(tamanho * 0.957)}
      unoptimized
      className={className}
    />
  );
}
