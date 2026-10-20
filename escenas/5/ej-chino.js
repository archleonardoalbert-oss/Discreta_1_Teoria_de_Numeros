// x ≡ 2 (3), x ≡ 3 (5), x ≡ 2 (7) sobre una sola recta 0…240: tres filas de puntos (una serie por congruencia).
// Las tres coinciden en 23, 128 y 233: cada 105. La construcción da 233, y dos saltos de 105 hacia atrás, 23.
import { escenaPorCapas, rotulo, linea, rodante } from '../comun.js';
import { recta, saltos } from '../primitivas.js';
import { planRecta, r1 } from '../../motor/escala.js';

const FILAS = [[2, 3, 'cian', 210], [3, 5, 'violeta', 255], [2, 7, 'ambar', 300]], YR = 350;
const NOTAS = [
  ['x ≡ 2 (3),  x ≡ 3 (5),  x ≡ 2 (7): tres series de puntos', 'texto'],
  ['p = 3·5·7 = 105', 'texto'],
  ['3, 5 y 7 son primos distintos: primos relativos 2 a 2', 'texto'],
  ['p₁ = 105/3 = 35,  p₂ = 105/5 = 21,  p₃ = 105/7 = 15', 'texto'],
  ['35x₁ ≡ 1 (3): x₁ = 2 (70 = 69 + 1);  21x₂ ≡ 1 (5): x₂ = 1;  15x₃ ≡ 1 (7): x₃ = 1', 'texto'],
  ['A = 2·35·2 + 3·21·1 + 2·15·1 = 140 + 63 + 30 = 233', 'ciruela'],
  ['233 = 3·77 + 2 = 5·46 + 3 = 7·33 + 2: está en las tres filas', 'verde'],
  ['233 − 105 − 105 = 23:  A ≡ 23 (mod 105)', 'verde'],
  ['las tres filas coinciden cada 105: x = 23 + 105t', 'verde'],
];

export default escenaPorCapas({
  entradas: [],
  preparar: () => ({ plan: planRecta({ min: -3, max: 243, ancho: 680 }) }),
  alto: YR + 50,
  base: ({ plan }) => recta('R', plan, YR),
  capas: [
    ({ plan }) => [
      ...FILAS.flatMap(([r, m, c, y], f) => [
        rotulo(`ft${f}`, 24, y - 10, `≡ ${r} (mod ${m})`, c),
        ...Array.from({ length: Math.floor((240 - r) / m) + 1 }, (_, i) => ({ k: `d${f}-${i}`, t: 'circle', a: { cx: plan.x(r + i * m), cy: y, r: 2.6 }, c, orden: f })),
      ]),
      ...rodante(NOTAS, 0, { filas: 4 }),
    ],
    ({ plan }) => [
      ...[105, 210].map((v) => ({ ...linea(`p${v}`, plan.x(v), 190, plan.x(v), YR + 4, 'muy-tenue') })),
      ...rodante(NOTAS, 1, { filas: 4 }),
    ],
    () => rodante(NOTAS, 2, { filas: 4 }),
    () => rodante(NOTAS, 3, { filas: 4 }),
    () => rodante(NOTAS, 4, { filas: 4 }),
    ({ plan }) => [{ k: 'A', t: 'circle', a: { cx: plan.x(233), cy: YR, r: 6 }, c: 'ciruela' }, rotulo('At', plan.x(233), YR + 36, '233', 'ciruela', 'middle'), ...rodante(NOTAS, 5, { filas: 4 })],
    ({ plan }) => [
      ...FILAS.map(([, , , y], f) => ({ k: `aA${f}`, t: 'circle', a: { cx: plan.x(233), cy: y, r: 8 }, c: 'verde', hueco: true, orden: f })),
      ...rodante(NOTAS, 6, { filas: 4 }),
    ],
    ({ plan }) => [
      ...saltos('V', plan, { desde: 233, salto: -105, n: 2, y: YR, alturaMax: 30, numerar: false }).map((s) => ({ ...s, c: 'verde' })),
      { k: 'p23', t: 'circle', a: { cx: plan.x(23), cy: YR, r: 6 }, c: 'verde' }, rotulo('p23t', plan.x(23), YR + 36, '23', 'verde', 'middle'),
      ...rodante(NOTAS, 7, { filas: 4 }),
    ],
    ({ plan }) => [
      ...[23, 128, 233].map((v, i) => ({ ...linea(`col${v}`, plan.x(v), 196, plan.x(v), YR - 2, 'verde'), orden: i })),
      ...rodante(NOTAS, 8, { filas: 4 }),
    ],
  ],
});
