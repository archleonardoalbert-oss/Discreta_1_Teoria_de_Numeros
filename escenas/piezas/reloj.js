// Pieza reutilizable: reloj de n posiciones (0 arriba, sentido horario) con puntos rotulados.
import { rotulo } from '../comun.js';
import { r1 } from '../../motor/escala.js';

export const posReloj = (i, n, { cx, cy, R }) => {
  const ang = -Math.PI / 2 + (2 * Math.PI * i) / n;
  return { x: cx + R * Math.cos(ang), y: cy + R * Math.sin(ang), ang };
};

/** Puntos 0…n−1 (o los de `mostrar`), con el número fuera del círculo. Claves `${id}:p${i}` y `${id}:t${i}`. */
export function reloj(id, n, geo, { mostrar = [...Array(n).keys()], c = 'cian', apagados = [] } = {}) {
  const ns = [{ k: `${id}:aro`, t: 'circle', a: { cx: geo.cx, cy: geo.cy, r: geo.R }, c: 'muy-tenue', hueco: true }];
  for (const i of mostrar) {
    const { x, y, ang } = posReloj(i, n, geo), col = apagados.includes(i) ? 'muy-tenue' : c;
    ns.push({ k: `${id}:p${i}`, t: 'circle', a: { cx: r1(x), cy: r1(y), r: 4.5 }, c: col });
    ns.push(rotulo(`${id}:t${i}`, x + 20 * Math.cos(ang), y + 20 * Math.sin(ang) + 4, String(i), col, 'middle'));
  }
  return ns;
}
