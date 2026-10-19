// Ayudantes reutilizables para escribir escenas de cualquier libro.
import { planRecta, r1 } from '../motor/escala.js';
import { saltos } from './primitivas.js';

export const ANCHO = 680;   // ancho estándar de las escenas (viewBox)

/** Nodo de texto. */
export const rotulo = (k, x, y, txt, c = 'texto', anchor = 'start') =>
  ({ k, t: 'text', a: { x: r1(x), y: r1(y), 'text-anchor': anchor }, txt, c });

/** Línea recta entre dos puntos (guías, conectores). */
export const linea = (k, x1, y1, x2, y2, c = 'muy-tenue') =>
  ({ k, t: 'line', a: { x1: r1(x1), y1: r1(y1), x2: r1(x2), y2: r1(y2) }, c });

/**
 * Escena hecha de capas: el paso i muestra base + capas 0…i (lo anterior se queda dibujado).
 * Si una capa posterior emite una clave ya existente, la sustituye en su sitio (sirve para recolorear).
 * `preparar(e)` calcula una vez lo que necesitan las capas; reciben {...e, ...preparar(e)}.
 */
export function escenaPorCapas({ entradas, validar = () => null, alto, ancho = ANCHO, preparar = () => ({}), base = () => [], capas }) {
  return {
    entradas, validar, capas: capas.length,
    vista: (e) => ({ ancho, alto: typeof alto === 'function' ? alto({ ...e, ...preparar(e) }) : alto }),
    estado(e, paso) {
      const ctx = { ...e, ...preparar(e) };
      const nodos = new Map();
      for (const n of base(ctx)) nodos.set(n.k, n);
      for (const capa of capas.slice(0, Math.min(paso, capas.length - 1) + 1))
        for (const n of capa(ctx)) nodos.set(n.k, n);
      return [...nodos.values()];
    },
  };
}

/** Plan de recta que contiene el 0 y todos los valores, con un margen del 6 %. */
export function planPara(valores, ancho = ANCHO) {
  const min = Math.min(0, ...valores), max = Math.max(0, ...valores);
  const pad = Math.max(1, (max - min) * 0.06);
  return planRecta({ min: min - pad, max: max + pad, ancho });
}

/** Carril: una línea base propia con n saltos de `salto` desde `desde` y su etiqueta a la izquierda. */
export function carril(id, plan, y, { salto, n, c = 'cian', etiqueta, desde = 0 }) {
  const ns = [linea(`${id}:base`, plan.x(plan.min), y, plan.x(plan.max), y, 'muy-tenue')];
  ns.push(...saltos(id, plan, { desde, salto, n, y, c, alturaMax: 12, numerar: false }));
  if (etiqueta) ns.push(rotulo(`${id}:et`, plan.x(plan.min), y - 17, etiqueta, c));
  return ns;
}

/** Filas de texto (tablas tipo Euclides); la fila `actual` va en ámbar, `hechas` en texto normal. */
export function filas(id, lineas, { x, y, dy = 22, actual = -1, anchor = 'start' }) {
  return lineas.map((txt, i) => rotulo(`${id}:${i}`, x, y + i * dy, txt, i === actual ? 'ambar' : 'texto', anchor));
}
