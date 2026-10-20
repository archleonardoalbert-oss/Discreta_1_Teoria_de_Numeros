// 18x ≡ 30 (42): un reloj de 42 posiciones. Desde la solución 4, saltos de 42/6 = 7: seis saltos dan justo una
// vuelta y las seis soluciones forman un hexágono regular.
import { escenaPorCapas, rotulo, nota } from '../comun.js';
import { posReloj } from '../piezas/reloj.js';
import { r1 } from '../../motor/escala.js';

const GEO = { cx: 470, cy: 250, R: 150 }, SOL = [4, 11, 18, 25, 32, 39];
const p = (i) => posReloj(i, 42, GEO);

export default escenaPorCapas({
  entradas: [],
  alto: 430,
  base: () => [
    { k: 'aro', t: 'circle', a: { cx: GEO.cx, cy: GEO.cy, r: GEO.R }, c: 'muy-tenue', hueco: true },
    ...Array.from({ length: 42 }, (_, i) => ({ k: `m${i}`, t: 'circle', a: { cx: r1(p(i).x), cy: r1(p(i).y), r: 2.2 }, c: 'tenue', fijo: true })),
    ...[0, 7, 14, 21, 28, 35].map((i) => ({ ...rotulo(`mt${i}`, p(i).x + 22 * Math.cos(p(i).ang) - 0, p(i).y + 22 * Math.sin(p(i).ang) + 4, String(i), 'muy-tenue', 'middle'), fijo: true })),
  ],
  capas: [
    () => [nota('n0', 0, '(18, 42) = 6 y 6 | 30: exactamente 6 soluciones', 'texto')],
    () => [
      { k: 's4', t: 'circle', a: { cx: r1(p(4).x), cy: r1(p(4).y), r: 6 }, c: 'verde' },
      rotulo('t4', p(4).x + 24 * Math.cos(p(4).ang), p(4).y + 24 * Math.sin(p(4).ang) + 4, '4', 'verde', 'middle'),
      nota('n1', 1, 'una solución: x₀ = 4', 'verde'),
    ],
    () => [nota('n2', 2, '18·4 = 72 = 42 + 30: deja resto 30 ✓', 'texto')],
    () => SOL.flatMap((v, i) => {
      const w = SOL[(i + 1) % 6];
      return [
        { k: `l${i}`, t: 'line', a: { x1: r1(p(v).x), y1: r1(p(v).y), x2: r1(p(w).x), y2: r1(p(w).y) }, c: 'verde', orden: i },
        ...(i ? [{ k: `s${v}`, t: 'circle', a: { cx: r1(p(v).x), cy: r1(p(v).y), r: 6 }, c: 'verde', orden: i }] : []),
      ];
    }).concat([nota('n3', 3, 'x ≡ 4 + 7t (mod 42): saltos de 42/6 = 7; seis saltos = una vuelta', 'texto')]),
    () => [
      ...SOL.slice(1).map((v) => rotulo(`t${v}`, p(v).x + 24 * Math.cos(p(v).ang), p(v).y + 24 * Math.sin(p(v).ang) + 4, String(v), 'verde', 'middle')),
      nota('n4', 4, 'x ≡ 4, 11, 18, 25, 32, 39 (mod 42)', 'verde'),
    ],
  ],
});
