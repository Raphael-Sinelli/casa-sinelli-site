import os
import sys
from pathlib import Path

try:
    import pillow_heif
    from PIL import Image
    pillow_heif.register_heif_opener()
except ImportError:
    print("ERRO: pillow-heif nao instalado. Rode: pip install pillow-heif")
    sys.exit(1)

ALPOIM_DIR = Path("C:/Imagens/Catalogo/alpoim")
QUALIDADE = 85

def find_heic(base: Path):
    for root, _, files in os.walk(base):
        for f in files:
            if f.lower().endswith(".heic"):
                yield Path(root) / f

def main():
    heic_files = list(find_heic(ALPOIM_DIR))
    print(f"Encontrados: {len(heic_files)} arquivos HEIC\n")

    convertidos = 0
    pulados = 0
    erros = 0

    for heic_path in heic_files:
        jpg_path = heic_path.with_suffix(".jpg")

        if jpg_path.exists():
            pulados += 1
            continue

        try:
            img = Image.open(heic_path)
            if img.mode in ("RGBA", "P"):
                img = img.convert("RGB")
            img.save(jpg_path, "JPEG", quality=QUALIDADE, optimize=True)
            convertidos += 1
            rel = str(heic_path).replace(str(ALPOIM_DIR), "")
            print(f"  OK {rel}")
        except Exception as e:
            erros += 1
            print(f"  ERRO {heic_path.name}: {e}")

    print(f"\nConvertidos: {convertidos} | Ja existiam: {pulados} | Erros: {erros}")

if __name__ == "__main__":
    main()
