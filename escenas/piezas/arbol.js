// Pieza reutilizable: árbol de factores. Cada compuesto se parte en dos factores (sus hijos nacen de él);
// las hojas son primos (ámbar, con aro). Dos modos de partir dan formas distintas con las mismas hojas.
import { r1 } from '../../motor/escala.js';
import { esPrimo } from '../../motor/primos.js';

/** modo 'menor': n = (menor primo)·resto;  modo 'raiz': n = (divisor más cercano a √n)·resto. */
export function construirArbol(n, modo = 'menor') {
  if (esPrimo(n)) return { v: n };
  let a = 2;
  if (modo === 'menor') while (n % a) a++;
  else for (let d = Math.floor(Math.sqrt(n)); d >= 2; d--) if (n % d === 0) { a = d; break; }
  return { v: n, hijos: [construirArbol(a, modo), construirArbol(n / a, modo)] };
}

/** Hojas (primos) de izquierda a derecha. */
export const hojas = (nodo) => (nodo.hijos ? nodo.hijos.flatMap(hojas) : [nodo.v]);
const profundidad = (nodo) => (nodo.hijos ? 1 + Math.max(...nodo.hijos.map(profundidad)) : 0);

/**
 * Nodos SVG del árbol dentro de la caja (x, y, ancho, alto). Claves: `${id}:n${ruta}` (texto), `${id}:a${ruta}`
 * (aro de las hojas) y `${id}:l${ruta}` (rama al padre); la ruta es 'r', 'r0', 'r01'… Devuelve, en `posHojas`
 * (propiedad no enumerable), [{ v, k, x, y }] de cada hoja para que otras piezas puedan nacer de ellas.
 */
export function arbolFactores(id, raiz, { x, y, ancho, alto }) {
  const L = hojas(raiz).length, prof = profundidad(raiz);
  const dy = prof ? Math.min(46, (alto - 20) / prof) : 0, dx = ancho / L;
  const ns = [], posHojas = [];
  let indiceHoja = 0;
  const colocar = (nodo, ruta, nivel) => {
    if (!nodo.hijos) { const px = x + dx * (indiceHoja++ + 0.5); return { px, py: y + nivel * dy }; }
    const hijos = nodo.hijos.map((h, i) => colocar(h, ruta + i, nivel + 1));
    return { px: hijos.reduce((s, h) => s + h.px, 0) / hijos.length, py: y + nivel * dy, hijos };
  };
  const pintar = (nodo, ruta, pos, padre) => {
    const k = `${id}:n${ruta}`, hoja = !nodo.hijos;
    if (padre) ns.push({ k: `${id}:l${ruta}`, t: 'line', a: { x1: r1(padre.px), y1: r1(padre.py + 6), x2: r1(pos.px), y2: r1(pos.py - 15) }, c: 'muy-tenue', desde: padre.k });
    ns.push({ k, t: 'text', a: { x: r1(pos.px), y: r1(pos.py), 'text-anchor': 'middle' }, txt: String(nodo.v), c: hoja ? 'ambar' : 'cian', ...(padre ? { desde: padre.k } : {}) });
    if (hoja) {
      ns.push({ k: `${id}:a${ruta}`, t: 'circle', a: { cx: r1(pos.px), cy: r1(pos.py - 4), r: r1(Math.max(11, String(nodo.v).length * 4 + 6)) }, c: 'ambar', hueco: true, ...(padre ? { desde: padre.k } : {}) });
      posHojas.push({ v: nodo.v, k, x: pos.px, y: pos.py });
    }
    nodo.hijos?.forEach((h, i) => pintar(h, ruta + i, pos.hijos[i], { ...pos, k }));
  };
  pintar(raiz, 'r', colocar(raiz, 'r', 0), null);
  Object.defineProperty(ns, 'posHojas', { value: posHojas });
  return ns;
}
