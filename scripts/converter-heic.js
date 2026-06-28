const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ALPOIM_DIR = 'C:\\Imagens\\Catalogo\\alpoim';

function findHeicFiles(dir) {
  const result = [];
  const stack = [dir];
  while (stack.length) {
    const cur = stack.pop();
    let entries;
    try { entries = fs.readdirSync(cur, { withFileTypes: true }); } catch { continue; }
    for (const e of entries) {
      const full = path.join(cur, e.name);
      if (e.isDirectory()) {
        stack.push(full);
      } else if (e.isFile() && path.extname(e.name).toLowerCase() === '.heic') {
        result.push(full);
      }
    }
  }
  return result;
}

async function main() {
  const heicFiles = findHeicFiles(ALPOIM_DIR);
  console.log(`Encontrados: ${heicFiles.length} arquivos HEIC\n`);

  let convertidos = 0;
  let pulados = 0;
  let erros = 0;

  for (const heicPath of heicFiles) {
    const jpgPath = heicPath.replace(/\.heic$/i, '.jpg');

    if (fs.existsSync(jpgPath)) {
      pulados++;
      continue;
    }

    try {
      await sharp(heicPath)
        .jpeg({ quality: 85, mozjpeg: true })
        .toFile(jpgPath);
      convertidos++;
      const rel = heicPath.replace(ALPOIM_DIR, '').replace(/\\/g, '/');
      console.log(`  ✓ ${rel}`);
    } catch (err) {
      erros++;
      console.error(`  ✗ ${path.basename(heicPath)}: ${err.message}`);
    }
  }

  console.log(`\n✅ Convertidos: ${convertidos} | Já existiam: ${pulados} | Erros: ${erros}`);
}

main().catch(console.error);
