// Pieza reutilizable: un producto como fila de cajas de factores (a₁)·(a₂)·…·(aₙ), cada una con su valor y,
// debajo, su etiqueta de divisibilidad «p | aᵢ» (verde) o «p ∤ aᵢ» (tenue). Opcional: una llave sobre un grupo.
import { rotulo } from '../comun.js';
import { r1 } from '../../motor/escala.js';

const LETRA = 7.8, ALTO = 30, HUECO = 22;
export const anchoCaja = (txt) => Math.max(38, [...String(txt)].length * LETRA + 18);

/**
 * valores: textos o números de cada factor; marcas: por caja '|' | '∤' | null; p: el primo de las etiquetas.
 * grupo: { desde, hasta, texto } dibuja una llave sobre las cajas desde…hasta (inclusive).
 * Devuelve también `ancho` total (propiedad no enumerable) para centrar.
 */
export function cajas(id, { x, y, valores, marcas = [], p = 'p', c = 'cian', grupo, colores = [] }) {
  const ns = [];
  let cx = x;
  const xs = [];
  valores.forEach((v, i) => {
    const marca = marcas[i] ? `${p} ${marcas[i]} ${v}` : '';
    const w = Math.max(anchoCaja(v), [...marca].length * LETRA + 6), col = colores[i] ?? (marcas[i] === '|' ? 'verde' : c);   // la etiqueta cabe bajo su caja
    xs.push([cx, w]);
    ns.push({ k: `${id}:b${i}`, t: 'rect', a: { x: r1(cx), y: r1(y - ALTO + 8), width: r1(w), height: ALTO, rx: 6 }, c: col, hueco: true });
    ns.push(rotulo(`${id}:v${i}`, cx + w / 2, y, String(v), col, 'middle'));
    if (marcas[i]) ns.push(rotulo(`${id}:m${i}`, cx + w / 2, y + 26, marca, marcas[i] === '|' ? 'verde' : 'tenue', 'middle'));
    cx += w;
    if (i < valores.length - 1) { ns.push(rotulo(`${id}:x${i}`, cx + HUECO / 2, y, '·', 'texto', 'middle')); cx += HUECO; }
  });
  if (grupo) {
    const [x0] = xs[grupo.desde], [x1, w1] = xs[grupo.hasta], top = y - ALTO + 2;
    ns.push({ k: `${id}:g`, t: 'path', a: { d: `M ${r1(x0)} ${top} L ${r1(x0)} ${top - 8} L ${r1(x1 + w1)} ${top - 8} L ${r1(x1 + w1)} ${top}` }, c: 'violeta' });
    ns.push(rotulo(`${id}:gt`, (x0 + x1 + w1) / 2, top - 14, grupo.texto, 'violeta', 'middle'));
  }
  Object.defineProperty(ns, 'ancho', { value: cx - x });
  return ns;
}
