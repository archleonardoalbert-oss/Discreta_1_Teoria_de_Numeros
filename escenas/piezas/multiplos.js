// Pieza reutilizable: dos saltadores (de |a| y de |b|) desde 0 y los puntos donde aterrizan los dos.
import { carril, linea, rotulo } from '../comun.js';

/** Carriles de saltos de |a| (cian) y de |b| (violeta) hasta `hasta`. */
export function dosSaltadores(p, { a, b, hasta, yA, yB }) {
  const A = Math.abs(a), B = Math.abs(b);
  return [
    ...carril('sa', p, yA, { salto: A, n: Math.floor(hasta / A), c: 'cian', etiqueta: `saltos de |a| = ${A}` }),
    ...carril('sb', p, yB, { salto: B, n: Math.floor(hasta / B), c: 'violeta', etiqueta: `saltos de |b| = ${B}` }),
  ];
}

/** Puntos en el eje donde coinciden los dos saltadores (múltiplos de `m`), con guías verticales desde yTop. */
export function coincidencias(p, { m, hasta, yTop, eje, c = 'ambar' }) {
  const ns = [];
  for (let v = m; v <= hasta; v += m) {
    ns.push(linea(`gc${v}`, p.x(v), yTop, p.x(v), eje, 'muy-tenue'));
    ns.push({ k: `pc${v}`, t: 'circle', a: { cx: p.x(v), cy: eje, r: 5 }, c });
    ns.push(rotulo(`tc${v}`, p.x(v), eje - 12, String(v), c, 'middle'));
  }
  return ns;
}
