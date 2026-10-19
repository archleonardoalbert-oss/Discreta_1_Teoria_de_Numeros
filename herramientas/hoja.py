"""Une recortes de la escena de varias capturas en una hoja de contacto. Uso: hoja.py salida.png captura1.png ..."""
import sys
from PIL import Image
salida, *entradas = sys.argv[1:]
ims = []
for f in entradas:
    im = Image.open(f)
    # recorta la columna de la escena (derecha) desde su borde superior hasta el final de la imagen
    ims.append(im.crop((548, 380, 1256, min(im.height, 1000))))
W = max(i.width for i in ims); H = sum(i.height for i in ims)
o = Image.new('RGB', (W, H)); y = 0
for i in ims: o.paste(i, (0, y)); y += i.height
o.save(salida)
