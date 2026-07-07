'use client';

import { useEffect } from 'react';

// Enquanto `ativo`: Esc dispara `aoFechar` e o scroll do body fica travado.
// Usado pelo lightbox e pelo menu mobile (mesmo comportamento nos dois).
export function useEscapeETravaScroll(ativo: boolean, aoFechar: () => void) {
  useEffect(() => {
    if (!ativo) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') aoFechar();
    };
    document.addEventListener('keydown', onKey);
    const overflowAntes = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = overflowAntes;
    };
  }, [ativo, aoFechar]);
}
