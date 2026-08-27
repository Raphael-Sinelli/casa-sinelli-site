import { useSyncExternalStore } from 'react';

export type ConsentoCookies = 'aceito' | 'recusado';

const CHAVE_CONSENTIMENTO = 'cs_cookie_consent';
const EVENTO_CONSENTIMENTO = 'cs-cookie-consent-change';

function lerConsentimento(): ConsentoCookies | null {
  if (typeof window === 'undefined') return null;
  const valor = window.localStorage.getItem(CHAVE_CONSENTIMENTO);
  return valor === 'aceito' || valor === 'recusado' ? valor : null;
}

export function salvarConsentimento(valor: ConsentoCookies) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(CHAVE_CONSENTIMENTO, valor);
  window.dispatchEvent(new Event(EVENTO_CONSENTIMENTO));
}

function inscrever(retorno: () => void) {
  window.addEventListener(EVENTO_CONSENTIMENTO, retorno);
  window.addEventListener('storage', retorno);
  return () => {
    window.removeEventListener(EVENTO_CONSENTIMENTO, retorno);
    window.removeEventListener('storage', retorno);
  };
}

function obterSnapshotServidor(): ConsentoCookies | null {
  return null;
}

/** Lê o consentimento de cookies e reage a mudanças (banner, outra aba etc). */
export function useConsentimento(): ConsentoCookies | null {
  return useSyncExternalStore(inscrever, lerConsentimento, obterSnapshotServidor);
}
