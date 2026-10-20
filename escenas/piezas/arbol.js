// Pieza reutilizable: árbol de factores. Cada compuesto se parte en dos factores (sus hijos nacen de él);
// las hojas son primos (ámbar, con aro). Dos modos de partir dan formas distintas con las mismas hojas.
import { r1 } from '../../motor/escala.js';
import { esPrimo } from '../../motor/primos.js';

/**
 * modo 'menor': n = (menor primo)·resto;  'raiz': n = (divisor más cercano a √n)·resto;
 * 'mayor': n = (mayor divisor propio)·(menor primo), es decir, el árbol 'menor' en espejo.
 */
export function construirArbol(n, modo = 'menor') {
  if (esPrimo(n)) return { v: n };
  let a = 2;
  while (n % a) a++;                                       // menor primo
  if (modo === 'raiz') for (let d = Math.floor(Math.sqrt(n)); d >= 2; d--) if (n % d === 0) { a = d; break; }
  const hijos = modo === 'mayor' ? [n / a, a] : [a, n / a];
  return { v: n, hijos: hijos.map((h) => construirArbol(h, modo)) };
}

/** Forma del árbol como texto (para comparar dos árboles). */
export const forma = (nodo) => (nodo.hijos ? `${nodo.v}(${nodo.hijos.map(forma).join(',')})` : String(nodo.v));

/** Un segundo árbol del mismo n con otra forma (si existe): 'raiz', y si coincide con 'menor', 'mayor'. */
export function otroArbol(n) {
  const a = construirArbol(n, 'menor'), b = construirArbol(n, 'raiz');
  return forma(a) !== forma(b) ? b : construirArbol(n, 'mayor');
}

/** Hojas (primos) de izquierda a derecha. */
export const hojas = (nodo) => (nodo.hijos ? nodo.hijos.flatMap(hojas) : [nodo.v]);
const nivelDe = (ruta) => ruta.length - 1;
const profundidad = (nodo) => (nodo.hijos ? 1 + Math.max(...nodo.hijos.map(profundidad)) : 0);

/**
 * Nodos SVG del árbol dentro de la caja (x, y, ancho, alto). Claves: `${id}:n${ruta}` (texto), `${id}:a${ruta}`
 * (aro de las hojas) y `${id}:l${ruta}` (rama al padre); la ruta es 'r', 'r0', 'r01'… Devuelve, en `posHojas`
 * (propiedad no enumerable), [{ v, k, x, y }] de cada hoja para que otras piezas puedan nacer de ellas.
 */
export function arbolFactores(id, raiz, { x, y, ancho, alto }) {
  const L = hojas(raiz).length, prof = profundidad(raiz);
  const dy = prof ? Math.max(32, Math.min(46, (alto - 20) / prof)) : 0, dx = ancho / L;   // ramas siempre hacia abajo
  const radio = Math.max(7, Math.min(11, dx / 2 - 1));
  const ns = [], posHojas = [];
  let indiceHoja = 0;
  const colocar = (nodo, ruta, nivel) => {
    if (!nodo.hijos) { const px = x + dx * (indiceHoja++ + 0.5); return { px, py: y + nivel * dy }; }
    const hijos = nodo.hijos.map((h, i) => colocar(h, ruta + i, nivel + 1));
    return { px: hijos.reduce((s, h) => s + h.px, 0) / hijos.length, py: y + nivel * dy, hijos };
  };
  const pintar = (nodo, ruta, pos, padre) => {
    const k = `${id}:n${ruta}`, hoja = !nodo.hijos;
    const orden = nivelDe(ruta);                       // el árbol crece nivel a nivel (la inducción se ve)
    if (padre) ns.push({ k: `${id}:l${ruta}`, t: 'line', a: { x1: r1(padre.px), y1: r1(padre.py + 6), x2: r1(pos.px), y2: r1(pos.py - 15) }, c: 'muy-tenue', desde: padre.k, orden });
    ns.push({ k, t: 'text', a: { x: r1(pos.px), y: r1(pos.py), 'text-anchor': 'middle' }, txt: String(nodo.v), c: hoja ? 'ambar' : 'cian', ...(padre ? { desde: padre.k } : {}), orden });
    if (hoja) {
      ns.push({ k: `${id}:a${ruta}`, t: 'circle', a: { cx: r1(pos.px), cy: r1(pos.py - 4), r: r1(Math.max(radio, String(nodo.v).length * 4 + 4)) }, c: 'ambar', hueco: true, ...(padre ? { desde: padre.k } : {}), orden: orden + 0.5 });
      posHojas.push({ v: nodo.v, k, x: pos.px, y: pos.py });
    }
    nodo.hijos?.forEach((h, i) => pintar(h, ruta + i, pos.hijos[i], { ...pos, k }));
  };
  pintar(raiz, 'r', colocar(raiz, 'r', 0), null);
  Object.defineProperty(ns, 'posHojas', { value: posHojas });
  Object.defineProperty(ns, 'altoUsado', { value: prof * dy + 24 });
  return ns;
}
