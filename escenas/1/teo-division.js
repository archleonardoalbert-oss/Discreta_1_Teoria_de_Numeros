// Algoritmo de la División. Existencia: S = {a − sb > 0} son puntos de la recta espaciados b (sus elementos se
// escriben c₁, c₂, … en el conjunto); desde a se salta de b en b hacia el 0 y el último punto positivo es r = mín S.
// Si fuera r > b, un salto más a la izquierda seguiría en S (punteado): contradicción. Unicidad: r₁ − r = b(q − q₁)
// cae en la franja (−b, b), donde el único múltiplo de b es el 0.
import { escenaPorCapas, planPara, rotulo, flecha, num, por, ANCHO } from '../comun.js';
import { recta, saltos, punto, conjunto, simbolos } from '../primitivas.js';
import { planRecta, r1 as red } from '../../motor/escala.js';

const YS = 34, YE = 132, YR = 214, YN = 274, YU = 366, YN2 = 414;
const msg = (txt, c = 'texto') => rotulo('nx', 24, YN, txt, c);
const msg2 = (txt, c = 'texto') => rotulo('nu', 24, YN2, txt, c);
const anillo = (k, plan, v, y, c, extra = {}) => ({ k, t: 'circle', a: { cx: plan.x(v), cy: y, r: 10 }, c, hueco: true, ...extra });

export default escenaPorCapas({
  entradas: [
    { id: 'a', etiqueta: 'a', valor: 23, min: -40, max: 99 },
    { id: 'b', etiqueta: 'b', valor: 5, min: 2, max: 15 },
  ],
  validar: ({ a, b }) => (a % b === 0 ? `con ${b} | ${num(a)} el resto es 0 (primer paso); elige b ∤ a para ver el caso general` : null),
  preparar({ a, b }) {
    const q = Math.floor(a / b), r = a - b * q, w = a * (1 - b) + b;
    const k = a > 0 ? Math.max(1, Math.floor(a / b)) : Math.min(-1, Math.ceil(a / b)), m0 = b * k;
    const plan = planPara([a, r + 2 * b, Math.max(a, 0) + b, b, m0]);
    const pts = [];
    for (let v = r; v <= plan.max - 0.3 * b; v += b) pts.push(v);
    const planU = planRecta({ min: -2.6 * b, max: 2.6 * b, ancho: ANCHO });
    return { q, r, w, plan, pts, k, m0, planU, r1: (r + 1) % b };
  },
  alto: YN2 + 24,
  base: ({ plan, a }) => [...recta('R', plan, YR), ...punto('A', plan, a, YR, { etiqueta: `a = ${num(a)}` })],
  capas: [
    ({ plan, b, k, m0 }) => [
      ...saltos('E', plan, { desde: 0, salto: b * Math.sign(k), n: Math.abs(k), y: YE, alturaMax: 12, numerar: false }),
      { k: 'E:p', t: 'circle', a: { cx: plan.x(m0), cy: YE, r: 4 }, c: 'cian' },
      rotulo('Et', 24, YE - 26, `si b | a (como ${num(m0)} = ${por(b, k)}): r = 0`, 'verde'),
    ],
    ({ plan, pts }) => [
      ...conjunto('S', { x: 24, y: YS, nombre: 'S', elementos: simbolos('c', 3), c: 'violeta', definicion: 'S = {a − sb : a − sb > 0}: los posibles r' }),
      ...pts.map((v, i) => ({ k: `s${i}`, t: 'circle', a: { cx: plan.x(v), cy: YR, r: 3.5 }, c: 'violeta', orden: i * 0.5 })),
      rotulo('smas', Math.min(plan.x(pts.at(-1)) + 14, ANCHO - 12), YR - 8, '…', 'violeta'),
      msg('los puntos de S están espaciados b y siguen hacia la derecha', 'violeta'),
    ],
    ({ a, plan }) => (a > 0
      ? [anillo('aA', plan, a, YR, 'violeta'), msg(`a > 0: con s = 0, a − 0·b = ${a} ∈ S`, 'violeta')]
      : [msg('a < 0: s = 0 no sirve (a no es positivo); ver el paso siguiente', 'tenue')]),
    ({ a, b, w, plan }) => {
      if (a > 0) return [msg('(a > 0: con s = 0 ya se vio que S ≠ ∅)', 'tenue')];
      const dentro = w <= plan.max;
      return [
        ...(dentro ? [anillo('aW', plan, w, YR, 'violeta')] : [flecha('aW', ANCHO - 70, YR - 30, ANCHO - 8, YR - 30, 'violeta'), rotulo('aWt', ANCHO - 70, YR - 38, `${w} →`, 'violeta')]),
        msg(`s = a − 1 = ${num(a - 1)}:  a − sb = ${num(a)} − ${por(a - 1, b)} = ${w}`, 'violeta'),
      ];
    },
    ({ a, b, w }) => (a > 0
      ? [msg('(a > 0: no hace falta este caso)', 'tenue')]
      : [msg(`a(1 − b) = ${por(a, 1 - b)} = ${a * (1 - b)} > 0, luego ${w} > 0 y S ≠ ∅`, 'verde')]),
    ({ a, b, q, r, plan }) => [
      // desde a, saltos de b hacia el 0; el último punto positivo es el mínimo de S
      ...saltos('J', plan, { desde: a, salto: a > r ? -b : b, n: Math.abs(a - r) / b, y: YR, alturaMax: 24 }),
      anillo('aR', plan, r, YR, 'ambar'),
      rotulo('rt', plan.x(r), YR + 42, `r = ${r}`, 'ambar', 'middle'),
      ...conjunto('S', { x: 24, y: YS, nombre: 'S', elementos: simbolos('c', 3), c: 'violeta', señalado: 0, etiquetaSeñalado: 'mínimo = r', definicion: 'S = {a − sb : a − sb > 0}: los posibles r' }),
      msg(`s = q = ${num(q)}:  a − bq = r`, 'texto'),
      rotulo('res', 24, YN + 22, `a = bq + r:  ${num(a)} = ${por(b, q)} + ${r}`, 'ambar'),
    ],
    ({ b, plan }) => [
      { k: 'franja', t: 'rect', a: { x: plan.x(0), y: YR + 27, width: red(plan.x(b) - plan.x(0)), height: 6, rx: 3 }, c: 'violeta' },
      rotulo('franjat', plan.x(b) + 6, YR + 35, '[0, b)', 'violeta'),
      msg('se sabe r = a − sb > 0; falta ver que r < b', 'texto'),
    ],
    ({ b, r, plan }) => [
      anillo('fantasma', plan, r + b, YR, 'ambar', { supuesto: true }),
      { ...rotulo('fant', Math.min(Math.max(plan.x(r + b), 96), ANCHO - 96), YR - 58, 'si el mínimo fuera > b', 'ambar', 'middle'), supuesto: true },
      { ...saltos('K', plan, { desde: r + b, salto: -b, n: 1, y: YR, alturaMax: 18, numerar: false })[0], c: 'ambar', supuesto: true },
      msg('supongamos r > b (r = b daría b | a): entonces r − b > 0', 'ambar'),
    ],
    ({ r, plan }) => [
      anillo('aR', plan, r, YR, 'ambar', { ref: true }),
      msg('r − b = a − b(q + 1) ∈ S y está a su izquierda: ¡no era el mínimo!', 'ambar'),
    ],
    ({ r, r1, b, planU }) => [
      ...['fantasma', 'fant', 'K:a0'].map((k) => ({ k, quitar: true })),
      msg(`luego 0 ≤ r < b: r = ${r} cae en la franja [0, ${b})`, 'verde'),
      ...recta('U', planU, YU),
      ...[-2, -1, 0, 1, 2].map((j) => ({ k: `mU${j}`, t: 'circle', a: { cx: planU.x(j * b), cy: YU, r: 4 }, c: 'cian' })),
      { k: 'pr', t: 'circle', a: { cx: planU.x(r), cy: YU, r: 5 }, c: 'ambar' },
      { k: 'pr1', t: 'circle', a: { cx: planU.x(r1), cy: YU, r: 5 }, c: 'violeta', hueco: true, supuesto: true },
      rotulo('pr1t', planU.x(r1), YU - 14, 'r₁', 'violeta', 'middle'),
      rotulo('prt', planU.x(r), YU - 14, 'r', 'ambar', 'middle'),
      msg2('a = bq₁ + r₁ = bq + r con q₁ ≠ q o r₁ ≠ r (supuesto)', 'violeta'),
    ],
    ({ r, r1, planU }) => [
      flecha('dif', planU.x(0), YU - 34, planU.x(r1 - r), YU - 34, 'violeta'),
      rotulo('dift', planU.x((r1 - r) / 2), YU - 42, 'r₁ − r', 'violeta', 'middle'),
      msg2('b(q − q₁) = r₁ − r: la diferencia es un múltiplo de b', 'violeta'),
    ],
    ({ b, planU }) => [
      { k: 'franjaU', t: 'rect', a: { x: planU.x(-b), y: YU + 26, width: red(planU.x(b) - planU.x(-b)), height: 6, rx: 3 }, c: 'ambar' },
      rotulo('franjaUt', planU.x(b) + 8, YU + 34, '(−b, b)', 'ambar'),
      msg2('0 ≤ r, r₁ < b  ⇒  −b < r₁ − r = b(q − q₁) < b', 'ambar'),
    ],
    ({ b, planU }) => [
      ...[-2, -1, 1, 2].map((j) => ({ k: `mU${j}`, t: 'circle', a: { cx: planU.x(j * b), cy: YU, r: 4 }, c: 'muy-tenue' })),
      anillo('cero', planU, 0, YU, 'verde'),
      msg2('−1 < q − q₁ < 1: el único múltiplo de b dentro de la franja es 0', 'verde'),
    ],
    ({ r, planU }) => [
      { k: 'pr1', t: 'circle', a: { cx: planU.x(r), cy: YU, r: 5 }, c: 'verde' },
      { k: 'pr1t', quitar: true }, { k: 'dif', quitar: true }, { k: 'dift', quitar: true },
      rotulo('prt', planU.x(r), YU - 14, 'r = r₁', 'verde', 'middle'),
      msg2('q − q₁ = 0: q = q₁ y r = r₁. Son únicos.', 'verde'),
    ],
  ],
});
