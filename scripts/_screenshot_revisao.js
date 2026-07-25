// Script pontual pra gerar prints de revisão do redesign do seletor de cor.
// Uso: node scripts/_screenshot_revisao.js
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE = 'http://localhost:3000';
const OUT = path.join(__dirname, '..', '_prints-revisao');
fs.mkdirSync(OUT, { recursive: true });

const alvos = [
  { file: '01-belgica.png', url: `${BASE}/produto/132` },
  { file: '02-dubai.png', url: `${BASE}/produto/133` },
  { file: '03-sofa-cores-reais.png', url: `${BASE}/produto/25` },
  { file: '04-comoda-grecia-cinamomo-grafite.png', url: `${BASE}/produto/131` },
];

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 1400 } });

  for (const alvo of alvos) {
    await page.goto(alvo.url, { waitUntil: 'networkidle' });
    const seletor = page.locator('#cores');
    await seletor.scrollIntoViewIfNeeded();
    // garante folga abaixo do bloco de cores (linhas de swatch podem quebrar em 2)
    await page.evaluate(() => window.scrollBy(0, -160));
    await page.waitForTimeout(400); // assenta transições/imagens
    await page.screenshot({ path: path.join(OUT, alvo.file) });
    console.log('ok', alvo.file);
  }

  await browser.close();
})();
