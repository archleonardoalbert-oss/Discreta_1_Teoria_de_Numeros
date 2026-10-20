// Pieza reutilizable: vector de exponentes como columnas apiladas. Cada primo p de la factorización es un bloque;
// los bloques iguales se apilan, así que la altura de la columna es el exponente α (pᵅ). Los bloques pueden
// nacer de las hojas de un árbol de factores (`desde`).
import { rotulo, sup } from '../comun.js';
import { r1 } from '../../motor/escala.js';

/**
 * hojas: [{ v, k }] (valor del primo y clave de la pieza de la que nace cada bloque), en cualquier orden.
 * Columnas ordenadas de menor a mayor primo, con base en y (crecen hacia arriba) dentro de [x, x + ancho].
 */
export function columnasExponentes(id, hojas, { x, y, ancho, altoMax = 170, c = 'ambar' }) {
  const grupos = new Map();
  for (const h of [...hojas].sort((u, v) => u.v - v.v)) grupos.set(h.v, [...(grupos.get(h.v) ?? []), h]);
  const primos = [...grupos.keys()], maxA = Math.max(...[...grupos.values()].map((g) => g.length));
  const paso = ancho / primos.length, lado = Math.min(30, paso - 12, altoMax / maxA);
  const ns = [];
  primos.forEach((p, j) => {
    const cx = x + paso * (j + 0.5), g = grupos.get(p);
    g.forEach((h, i) => {
      const yb = y - (i + 1) * lado;
      ns.push({ k: `${id}:b${p}-${i}`, t: 'rect', a: { x: r1(cx - lado / 2), y: r1(yb), width: r1(lado - 2), height: r1(lado - 2), rx: 3 }, c, ...(h.k ? { desde: h.k } : {}) });
      if (lado >= 18) ns.push({ ...rotulo(`${id}:t${p}-${i}`, cx - 1, yb + lado / 2 + 4, String(p), c, 'middle'), ...(h.k ? { desde: h.k } : {}) });
    });
    ns.push(rotulo(`${id}:p${p}`, cx, y + 20, `${p}${sup(g.length)}`, 'texto', 'middle'));
  });
  Object.defineProperty(ns, 'formula', { value: primos.map((p) => `${p}${sup(grupos.get(p).length)}`).join(' · ') });
  return ns;
}
