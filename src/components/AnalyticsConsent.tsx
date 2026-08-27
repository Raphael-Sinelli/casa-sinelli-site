'use client';

import { Analytics } from '@vercel/analytics/next';
import { useConsentimento } from '@/lib/cookie-consent';

export default function AnalyticsConsent() {
  const consentimento = useConsentimento();

  if (consentimento !== 'aceito') return null;
  return <Analytics />;
}
