// Principio del Buen Ordenamiento: los puntos de A bajan del conjunto a la recta; un cursor sale del 1 (el suelo de
// los positivos) y barre de uno en uno hasta el primer punto de A, que queda marcado como mínimo. Contraste: en ℤ
// la recta no tiene suelo y los negativos no tienen primer elemento.
import { escenaPorCapas, planPara, rotulo, marcador, flecha, ANCHO } from '../comun.js';
import { recta, conjunto } from '../primitivas.js';
import { planRecta } from '../../motor/escala.js';

const YR = 190, YZ = 360;

export default escenaPorCapas({
  entradas: [{ id: 'A', etiqueta: 'A', valor: [17, 9, 30, 12], min: 1, max: 40, lista: { min: 1, max: 6 } }],
  preparar({ A }) {
    const elems = [...new Set(A)].sort((u, v) => u - v), m = elems[0];
    const plan = planPara([...elems, 1], ANCHO);
    const planZ = planRecta({ min: -9.5, max: 2.5, ancho: ANCHO });
    return { elems, m, plan, planZ };
  },
  alto: YZ + 70,
  base: ({ plan }) => recta('R', plan, YR),
  capas: [
    ({ elems, plan }) => [
      ...conjunto('A', { x: 24, y: 44, nombre: 'A', elementos: elems.map(String), c: 'ciruela' }),
      ...elems.map((v, i) => ({ k: `pA${v}`, t: 'circle', a: { cx: plan.x(v), cy: YR, r: 5 }, c: 'ciruela', desde: `A:e${i}` })),
      rotulo('pos', plan.x(0), YR + 44, 'A ⊂ ℤ₊: todos sus puntos a la derecha del 0', 'tenue'),
    ],
    ({ plan }) => [
      marcador('cur', plan.x(1), YR - 13),
      rotulo('curt', plan.x(0.5) - 4, YR - 34, 'suelo: sale del 1', 'ambar'),
      { k: 'suelo', t: 'line', a: { x1: plan.x(0.5), y1: YR - 30, x2: plan.x(0.5), y2: YR + 12 }, c: 'ambar' },
    ],
    ({ plan, m, elems }) => [
      marcador('cur', plan.x(m), YR - 13),
      // el rastro: cada entero recorrido antes de m no está en A
      ...Array.from({ length: m - 1 }, (_, i) => ({ k: `ras${i + 1}`, t: 'circle', a: { cx: plan.x(i + 1), cy: YR, r: 2.5 }, c: 'muy-tenue', orden: Math.min(i * 0.4, 10) })),
      { k: 'curt', quitar: true },
      { k: 'aroM', t: 'circle', a: { cx: plan.x(m), cy: YR, r: 11 }, c: 'ambar', hueco: true },
      { k: `pA${m}`, t: 'circle', a: { cx: plan.x(m), cy: YR, r: 5 }, c: 'ambar' },
      rotulo('mt', plan.x(m), YR - 32, `m = ${m}`, 'ambar', 'middle'),
      ...conjunto('A', { x: 24, y: 44, nombre: 'A', elementos: elems.map(String), c: 'ciruela', señalado: 0, etiquetaSeñalado: 'mínimo' }),
    ],
    ({ plan, m, elems }) => [
      ...elems.slice(1).map((v, i) => ({ ...flecha(`le${v}`, plan.x(m), YR + 30, plan.x(v), YR + 30, 'verde', 14 + 6 * i), orden: i })),
      rotulo('pos', 24, YR + 72, elems.length > 1 ? elems.slice(1).map((v) => `${m} ≤ ${v}`).join(',  ') : `A = {${m}}: ${m} ≤ ${m}`, 'verde'),
    ],
    ({ planZ }) => [
      rotulo('zt', 24, YZ - 70, 'en ℤ no hay suelo:', 'texto'),
      ...recta('Z', planZ, YZ),
      ...Array.from({ length: 9 }, (_, i) => ({ k: `pz${i}`, t: 'circle', a: { cx: planZ.x(-1 - i), cy: YZ, r: 4.5 }, c: 'ciruela', orden: i * 0.5 })),
      rotulo('zpt', 12, YZ + 4, '…', 'ciruela', 'start'),
      { ...flecha('zflecha', planZ.x(-3), YZ - 24, 10, YZ - 24, 'ambar'), supuesto: true },
      rotulo('zq', planZ.x(-6), YZ - 34, '¿desde dónde barrer?', 'ambar', 'middle'),
      rotulo('zc', ANCHO - 24, YZ + 46, '{…, −3, −2, −1} no tiene mínimo', 'ambar', 'end'),
    ],
  ],
});
