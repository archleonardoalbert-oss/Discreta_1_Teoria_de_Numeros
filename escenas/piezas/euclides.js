// Pieza reutilizable: las divisiones del algoritmo de Euclides como carriles apilados.
// Cada fila a = q·b + r tiene su propio carril a escala de su a (todas ocupan el mismo ancho):
// q saltos de b (cian) y el resto r como tramo ámbar. El resto de una fila es el salto de la siguiente.
import { planRecta, r1 } from '../../motor/escala.js';
import { carril, rotulo, ANCHO } from '../comun.js';

export const MAX_FILAS = 8;
export const textoFila = (f) => `${f.a} = ${f.q}·${f.b} + ${f.r}`;

/** Índices de las filas que se dibujan (si hay demasiadas, las primeras y las dos últimas). */
export function filasVisibles(n) {
  if (n <= MAX_FILAS) return [...Array(n).keys()];
  return [0, 1, 2, 3, 4, 5, n - 2, n - 1];
}

/** Nodos de las filas 0…hasta−1 de `filas` (euclides(a, b).filas), empezando en y0, una cada dy. */
export function carrilesEuclides(id, filas, { y0, dy = 46, hasta = filas.length, ancho = ANCHO, verdeFinal = false, etiquetaResto = (i, f) => `r = ${f.r}` }) {
  const visibles = filasVisibles(filas.length);
  const ns = [];
  visibles.forEach((i, slot) => {
    if (i >= hasta) return;
    const f = filas[i], y = y0 + slot * dy;
    const p = planRecta({ min: 0, max: f.a, ancho, margen: 24 });
    const ultima = i === filas.length - 1;
    const c = ultima && verdeFinal ? 'verde' : 'cian';
    ns.push(...carril(`${id}${i}`, p, y, { salto: f.b, n: f.q, c, etiqueta: textoFila(f) }));
    if (f.r > 0) {
      ns.push({ k: `${id}${i}:r`, t: 'line', a: { x1: p.x(f.q * f.b), y1: y, x2: p.x(f.a), y2: y }, c: 'ambar', ancho: 4 });
      ns.push(rotulo(`${id}${i}:rt`, r1(p.x(f.a)), y - 17, etiquetaResto(i, f), 'ambar', 'end'));
    } else {
      ns.push(rotulo(`${id}${i}:rt`, r1(p.x(f.a)), y - 17, 'r = 0: cabe exacto', c === 'verde' ? 'verde' : 'tenue', 'end'));
    }
    if (filas.length > MAX_FILAS && slot === 5 && hasta > 6)
      ns.push(rotulo(`${id}:hueco`, ancho / 2, y + dy / 2 + 4, `⋮  (${filas.length - MAX_FILAS} filas más)`, 'tenue', 'middle'));
  });
  return ns;
}

/** Alto que ocupan las filas visibles. */
export const altoEuclides = (n, dy = 46) => Math.min(n, MAX_FILAS) * dy;
