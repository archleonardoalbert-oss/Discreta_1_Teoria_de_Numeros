// Exactamente d soluciones: desde x₀, saltos de n/d. Marcas violetas cada n (vueltas). Las d primeras caen en una
// misma vuelta, en columnas distintas; cualquier otra (t = qd + r) es una de ellas más q vueltas.
import { escenaPorCapas, planPara, rotulo, carril, linea, rodante } from '../comun.js';
import { recta, llave } from '../primitivas.js';
import { mcd } from '../../motor/aritmetica.js';
import { mod } from '../piezas/modular.js';
import { r1 } from '../../motor/escala.js';

const YR = 400, YS = 330;

const NOTAS = ({ a, b, n, d, x0, s, pts }) => [
  [`${a}x ≡ ${b} (mod ${n}) ⇔ ${a}x − ${n}y = ${b};  d = (${a}, ${n}) = ${d} | ${b}`, 'texto'],
  [`x = x₀ + (n/d)t = ${x0} + ${s}t   (${a}·${x0} = ${a * x0} ≡ ${b})`, 'texto'],
  [`t = 0, …, ${d - 1}:  ${pts.slice(0, d).join(', ')}`, 'verde'],
  ['¿son distintas entre sí? ¿y no hay más?', 'texto'],
  [d < 2 ? 'con d = 1 hay una sola: nada que comparar' : 'supongamos x₀ + t₁n/d ≡ x₀ + t₂n/d, 0 ≤ t₁ < t₂ ≤ d − 1', 'ambar'],
  ['restando x₀:  t₁·n/d ≡ t₂·n/d (mod n)', 'ambar'],
  [`se cancela n/d = ${s} (su mcd con n es ${s}): t₁ ≡ t₂ (mod ${d})`, 'ambar'],
  [`(cancelación: el módulo pasa de n a n/(n/d) = ${n}/${s} = ${d})`, 'ambar'],
  [`pero 0 < t₂ − t₁ < ${d}: ${d} no puede dividirlo. Son distintas.`, 'verde'],
  ['cualquier otra: x₀ + (n/d)t con t ≥ d', 'texto'],
  [[`t = q·${d} + r con 0 ≤ r ≤ ${d - 1}: q bloques de ${d} saltos y r saltos sueltos`, `t = q·${d} + r, 0 ≤ r ≤ ${d - 1}`], 'texto'],
  [[`cada bloque de ${d} saltos de ${s} mide ${d}·${s} = ${n} = una vuelta:  x₀ + nq + (n/d)r`, `${d} saltos de ${s} = ${n} = una vuelta:  x₀ + nq + (n/d)r`], 'texto'],
  ['nq es un múltiplo de n: q vueltas que no cambian la columna', 'cian'],
  [`toda solución cae en una de las ${d} de referencia: exactamente ${d}`, 'verde'],
];

export default escenaPorCapas({
  entradas: [
    { id: 'a', etiqueta: 'a', valor: 9, min: 1, max: 40 }, { id: 'b', etiqueta: 'b', valor: 6, min: 0, max: 60 },
    { id: 'n', etiqueta: 'n', valor: 15, min: 2, max: 30 },
  ],
  validar: ({ a, b, n }) => (b % mcd(a, n) ? `(${a}, ${n}) = ${mcd(a, n)} ∤ ${b}: sin soluciones` : mcd(a, n) > 10 ? 'elige d = (a, n) ≤ 10 para el dibujo' : null),
  preparar({ a, b, n }) {
    const d = mcd(a, n), s = n / d;
    let x0 = 0; while (mod(a * x0 - b, n)) x0++;
    const plan = planPara([x0 + 2 * n, 0]);
    return { d, s, x0, plan, pts: Array.from({ length: 2 * d }, (_, t) => x0 + s * t) };
  },
  alto: YR + 50,
  base: ({ plan, n }) => [
    ...recta('R', plan, YR),
    ...[1, 2, 3].filter((v) => v * n <= plan.max).flatMap((v) => [
      { ...linea(`vu${v}`, plan.x(v * n), YR - 90, plan.x(v * n), YR + 6, 'violeta'), fijo: true },
      { ...rotulo(`vut${v}`, plan.x(v * n), YR - 96, `${v === 1 ? '' : v}n`, 'violeta', 'middle'), fijo: true },
    ]),
  ],
  capas: [
    (c) => rodante(NOTAS(c), 0),
    (c) => [
      { k: 'p0', t: 'circle', a: { cx: c.plan.x(c.x0), cy: YS, r: 5 }, c: 'verde' },
      rotulo('p0t', c.plan.x(c.x0), YS + 22, `x₀ = ${c.x0}`, 'verde', 'middle'),
      ...rodante(NOTAS(c), 1),
    ],
    (c) => [
      ...(c.d > 1 ? carril('S', c.plan, YS, { salto: c.s, n: c.d - 1, desde: c.x0, etiqueta: `saltos de n/d = ${c.s}` }) : []),
      ...c.pts.slice(1, c.d).map((v, t) => ({ k: `p${t + 1}`, t: 'circle', a: { cx: c.plan.x(v), cy: YS, r: 5 }, c: 'verde', orden: t })),
      ...rodante(NOTAS(c), 2),
    ],
    (c) => rodante(NOTAS(c), 3),
    (c) => [
      ...(c.d < 2 ? [] : [
        { k: 'sup', t: 'path', a: { d: `M ${c.plan.x(c.pts[0])} ${YS - 18} Q ${r1((c.plan.x(c.pts[0]) + c.plan.x(c.pts[1])) / 2)} ${YS - 60} ${c.plan.x(c.pts[1])} ${YS - 18}` }, c: 'ambar', supuesto: true },
        { ...rotulo('supt', (c.plan.x(c.pts[0]) + c.plan.x(c.pts[1])) / 2, YS - 50, '≡ ?', 'ambar', 'middle'), supuesto: true },
      ]),
      ...rodante(NOTAS(c), 4),
    ],
    (c) => rodante(NOTAS(c), 5),
    (c) => rodante(NOTAS(c), 6),
    (c) => rodante(NOTAS(c), 7),
    (c) => [
      { k: 'sup', quitar: true }, { k: 'supt', quitar: true },
      ...llave('V', c.plan, c.x0, c.x0 + c.n, YS + 30, 'una vuelta de n: d soluciones en columnas distintas', 'verde'),
      ...rodante(NOTAS(c), 8),
    ],
    (c) => [
      ...carril('S2', c.plan, YS - 80, { salto: c.s, n: c.d, desde: c.pts[c.d - 1], c: 'tenue', etiqueta: 'más saltos: t = d, d + 1, …' }),
      ...rodante(NOTAS(c), 9),
    ],
    (c) => rodante(NOTAS(c), 10),
    (c) => rodante(NOTAS(c), 11),
    (c) => [
      ...c.pts.slice(c.d).map((v, i) => ({ ...linea(`baja${i}`, c.plan.x(v), YS - 74, c.plan.x(v - c.n), YS - 4, 'cian'), orden: i, supuesto: true })),
      ...rodante(NOTAS(c), 12),
    ],
    (c) => rodante(NOTAS(c), 13),
  ],
});
