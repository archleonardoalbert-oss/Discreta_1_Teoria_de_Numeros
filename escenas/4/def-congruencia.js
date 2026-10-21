// Congruencia: los enteros como cuentas sobre la recta; la recta se enrolla en filas de n (cada cuenta vuela a su
// casilla: columna = resto, fila = cociente) y a, b quedan en la misma columna si y solo si tienen el mismo resto.
import { escenaPorCapas, rotulo, num, ANCHO } from '../comun.js';
import { geoTabla, tabla, columna, aro, mod } from '../piezas/modular.js';
import { planRecta, r1 } from '../../motor/escala.js';

const YR = 54;

export default escenaPorCapas({
  entradas: [
    { id: 'n', etiqueta: 'n', valor: 5, min: 3, max: 12 },
    { id: 'a', etiqueta: 'a', valor: 17, min: -20, max: 40 },
    { id: 'b', etiqueta: 'b', valor: -8, min: -20, max: 40 },
  ],
  preparar({ n, a, b }) {
    const g = geoTabla(n, Math.min(0, a, b), Math.max(a, b, n), { y: 130, altoMax: 280 });
    const plan = planRecta({ min: g.desde - 0.5, max: g.hasta + 0.5, ancho: ANCHO });
    const vs = Array.from({ length: g.hasta - g.desde + 1 }, (_, i) => g.desde + i);
    const cuenta = (v, x, y, c) => ({ k: `d${v}`, t: 'circle', a: { cx: r1(x), cy: r1(y), r: 2.6 }, c });
    const color = (v) => (v === a ? 'ciruela' : v === b ? 'cian' : 'tenue');
    return { g, plan, vs, cuenta, color, ra: mod(a, n), rb: mod(b, n) };
  },
  alto: ({ g }) => g.abajo + 70,
  capas: [
    ({ plan, vs, cuenta, color, a, b }) => [
      { k: 'eje', t: 'line', a: { x1: plan.x(plan.min), y1: YR, x2: plan.x(plan.max), y2: YR }, c: 'muy-tenue' },
      ...vs.map((v) => cuenta(v, plan.x(v), YR, color(v))),
      rotulo('ta', plan.x(a), YR - 12, `a = ${num(a)}`, 'ciruela', 'middle'),
      rotulo('tb', plan.x(b), YR + 22, `b = ${num(b)}`, 'cian', 'middle'),
      rotulo('t0', plan.x(0), YR - 12, '0', 'tenue', 'middle'),
    ],
    ({ g, vs, cuenta, color, a, b, n }) => [
      ...['eje', 'ta', 'tb', 't0'].map((k) => ({ k, quitar: true })),
      // la recta se enrolla: cada cuenta vuela a su casilla, fila a fila
      ...vs.map((v) => ({ ...cuenta(v, g.pos(v).x - g.dx / 2 + 7, g.pos(v).y, color(v)), orden: (Math.floor(v / n) - g.f0) * 0.8 })),
      ...tabla('T', g, { colores: { [a]: 'ciruela', [b]: 'cian' } }).map((nd) => ({ ...nd, orden: nd.k.includes(':h') ? 0 : (Math.floor(Number(nd.k.split(':v')[1]) / n) - g.f0) * 0.8 + 1 })),
      rotulo('hr', g.x, g.y - g.dy - 26, `resto r al dividir entre n = ${n}  (columna) · cociente q (fila)`, 'tenue'),
    ],
    ({ g, a, b, ra, rb, n }) => (ra === rb
      ? [columna('col', g, ra, 'verde'), aro('aa', g, a, 'ciruela'), aro('ab', g, b, 'cian'),
        rotulo('res', 24, g.abajo + 44, `misma columna r = ${ra}:  ${num(a)} ≡ ${num(b)} (mod ${n})`, 'verde')]
      : [columna('cola', g, ra, 'ambar'), columna('colb', g, rb, 'ambar'), aro('aa', g, a, 'ciruela'), aro('ab', g, b, 'cian'),
        rotulo('res', 24, g.abajo + 44, `columnas distintas (restos ${ra} y ${rb}): ${num(a)} y ${num(b)} no son congruentes`, 'ambar')]),
  ],
});
