// Busca textos de escena que se salen de la vista probando muchas entradas aleatorias válidas.
// Uso: node herramientas/fuzz-textos.mjs [libro=2] [casos por escena=1500]
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const [libroN = '2', casos = '1500'] = process.argv.slice(2);
const { default: libro } = await import(`${RAIZ}/libros/${libroN}/contenido.js`);
let s = 12345; const r = () => ((s = (s * 1103515245 + 12345) % 2147483648) / 2147483648);
const malos = new Map();
for (const el of libro.elementos) {
  const { default: esc } = await import(`${RAIZ}/escenas/${el.escena}.js`);
  for (let c = 0, v = 0; c < 4 * casos && v < casos; c++) {
    const e = {};
    for (const ent of esc.entradas) {
      const uno = () => ent.min + Math.floor(r() * (ent.max - ent.min + 1));
      e[ent.id] = ent.lista ? Array.from({ length: ent.lista.min + Math.floor(r() * (ent.lista.max - ent.lista.min + 1)) }, uno) : uno();
    }
    if (esc.validar(e) !== null) continue; v++;
    const { ancho } = esc.vista(e);
    for (let i = 0; i < el.pasos.length; i++) for (const n of esc.estado(e, i)) {
      if (n.t !== 'text') continue;
      const w = [...n.txt].length * 7.8, x = n.a.x, a = n.a['text-anchor'] ?? 'start';
      const [x0, x1] = a === 'middle' ? [x - w / 2, x + w / 2] : a === 'end' ? [x - w, x] : [x, x + w];
      if (x0 < -4 || x1 > ancho + 4) { const k = `${el.id} ${n.k.replace(/\d+/g, '#')}`; if (!malos.has(k)) malos.set(k, `${n.txt.slice(0, 90)} ${JSON.stringify(e)}`); }
    }
  }
}
for (const [k, v] of malos) console.log(k, '→', v);
console.log('textos fuera de la vista:', malos.size);
process.exit(malos.size ? 1 : 0);
