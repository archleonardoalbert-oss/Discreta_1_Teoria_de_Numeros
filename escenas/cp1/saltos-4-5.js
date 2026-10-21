// CP-01, ejercicio 5 (planteamiento): qué números se alcanzan desde 0 con saltos de 4 y de 5 (n = 4p + 5q),
// cuáles no, y lo que se pide: que desde 12 se alcanzan todos.
import { escenaPorCapas, rotulo, ANCHO } from '../comun.js';
import { planRecta } from '../../motor/escala.js';
import { recta, saltos, llave } from '../primitivas.js';

const MAX = 24, Y = 150;
const alcanzable = (n) => { for (let p = 0; 4 * p <= n; p++) if ((n - 4 * p) % 5 === 0) return true; return false; };

export default escenaPorCapas({
  entradas: [],
  preparar: () => ({ plan: planRecta({ min: 0, max: MAX, ancho: ANCHO }) }),
  alto: 250,
  base: ({ plan }) => recta('r', plan, Y),
  capas: [
    ({ plan }) => [
      ...saltos('s4', plan, { desde: 0, salto: 4, n: 2, y: Y, c: 'cian', alturaMax: 26, numerar: false }),
      ...saltos('s5', plan, { desde: 8, salto: 5, n: 1, y: Y, c: 'violeta', alturaMax: 26, numerar: false }),
      rotulo('t', 24, 34, 'saltos de 4 (cian) y de 5 (violeta) desde el 0: 13 = 4 + 4 + 5', 'texto'),
    ],
    ({ plan }) => [
      ...Array.from({ length: MAX + 1 }, (_, n) => n).filter(alcanzable).map((n) => ({ k: `si:${n}`, t: 'circle', a: { cx: plan.x(n), cy: Y, r: 4.5 }, c: 'verde', orden: n * 0.05 })),
      rotulo('t2', 24, 58, 'verde: se alcanza, n = 4p + 5q con p, q ≥ 0', 'verde'),
    ],
    ({ plan }) => [
      ...Array.from({ length: MAX + 1 }, (_, n) => n).filter((n) => !alcanzable(n)).map((n) => ({ k: `no:${n}`, t: 'circle', a: { cx: plan.x(n), cy: Y, r: 4.5 }, c: 'ambar', hueco: true })),
      rotulo('t3', 24, 82, 'ámbar: no se alcanza (1, 2, 3, 6, 7 y 11)', 'ambar'),
    ],
    ({ plan }) => [
      ...llave('ll', plan, 12, MAX, Y + 34, 'se pide: todos desde 12', 'ciruela'),
    ],
  ],
});
