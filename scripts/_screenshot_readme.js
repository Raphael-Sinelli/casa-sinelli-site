// Script pontual pra gerar os screenshots do README (hero, catálogo, seletor
// de cor em ação). Roda contra produção por padrão.
// Uso: node scripts/_screenshot_readme.js [baseUrl]
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE = process.argv[2] || 'https://www.casasinelli.com.br';
const OUT = path.join(__dirname, '..', 'docs', 'screenshots');
fs.mkdirSync(OUT, { recursive: true });

const alvos = [
  { file: 'hero.png', url: `${BASE}/`, seletor: null },
  { file: 'catalogo.png', url: `${BASE}/catalogo`, seletor: null },
  { file: 'seletor-cor.png', url: `${BASE}/produto/25`, seletor: '#cores' },
];

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  for (const alvo of alvos) {
    await page.goto(alvo.url, { waitUntil: 'networkidle' });
    if (alvo.seletor) {
      await page.evaluate((sel) => {
        document.querySelector(sel)?.scrollIntoView({ block: 'center' });
      }, alvo.seletor);
      await page.waitForTimeout(300);
    }
    await page.waitForTimeout(500); // assenta transições/imagens
    await page.screenshot({ path: path.join(OUT, alvo.file) });
    console.log('ok', alvo.file);
  }

  await browser.close();
})();
