'use client';

import { useEffect, useRef } from 'react';

interface Props {
  className?: string;
  children: React.ReactNode;
}

// Marca o container com .visivel na primeira vez que ele entra na viewport —
// o CSS (globals: .selecao-grade) cuida da animação com stagger. Com
// prefers-reduced-motion o conteúdo já fica visível direto pelo CSS.
export default function RevelarAoEntrar({ className, children }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.classList.add('visivel');
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('visivel');
          io.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
