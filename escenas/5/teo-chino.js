// Teorema Chino del Resto. Una tabla con una fila por módulo nⱼ: pⱼ = p/nⱼ, su inverso sⱼ y el «vector base» pⱼsⱼ,
// con sus restos entre cada nᵢ: 1 en la diagonal y 0 fuera (una matriz identidad). A = Σ aᵢpᵢsᵢ hereda los restos
// aᵢ. Unicidad: abajo, las series de saltos de cada nᵢ (y la de p) que van de x a otra solución y.
import { escenaPorCapas, planPara, rotulo, carril, rodante } from '../comun.js';
import { recta } from '../primitivas.js';
import { mcd } from '../../motor/aritmetica.js';
import { inversoMod } from '../../motor/primos.js';
import { mod } from '../piezas/modular.js';

const Y0 = 150, DY = 26, XC = { n: 40, p: 100, mcd: 170, s: 240, ps: 310 }, XR = 400, DXR = 78;
const sub = (i) => '₁₂₃'[i];

const NOTAS = ({ ns, p, pj }) => [
  [`p = ${ns.join('·')} = ${p};  pⱼ = p/nⱼ: ${pj.join(', ')}`, 'texto'],
  ['(nⱼ, pⱼ) = 1 para cada j', 'texto'],
  ['un primo común a nⱼ y pⱼ dividiría a otro nᵢ (lema de Euclides)', 'tenue'],
  ['sⱼ = inverso de pⱼ módulo nⱼ:  pⱼsⱼ ≡ 1 (nⱼ)  (diagonal de unos)', 'verde'],
  ['pⱼsⱼ ≡ 0 (nᵢ) si i ≠ j  (ceros fuera de la diagonal)', 'texto'],
  ['porque nᵢ es uno de los factores de pⱼ', 'tenue'],
  ['A = Σ aᵢpᵢsᵢ: cada fila pesa aᵢ', 'ciruela'],
  ['módulo nᵢ solo sobrevive la fila i: A ≡ aᵢ·1 = aᵢ', 'verde'],
  ['unicidad: si y fuera otra solución…', 'ambar'],
  ['x − y ≡ 0 (nᵢ): los saltos de cada nᵢ llevan de x a y', 'ambar'],
  ['nᵢ | x − y para todos ⇒ mcm(n₁, …) = p | x − y (propiedad fuerte 1)', 'texto'],
  ['x ≡ y (mod p): una única solución módulo p', 'verde'],
];

export default escenaPorCapas({
  entradas: [
    { id: 'ns', etiqueta: 'nᵢ', valor: [3, 5, 7], min: 2, max: 15, lista: { min: 2, max: 3 } },
    { id: 'as', etiqueta: 'aᵢ', valor: [2, 3, 2], min: 0, max: 20, lista: { min: 2, max: 3 } },
  ],
  validar: ({ ns, as }) => {
    if (ns.length !== as.length) return 'tantos restos aᵢ como módulos nᵢ';
    for (let i = 0; i < ns.length; i++) for (let j = i + 1; j < ns.length; j++) if (mcd(ns[i], ns[j]) !== 1) return `(${ns[i]}, ${ns[j]}) ≠ 1: deben ser primos relativos 2 a 2`;
    return ns.reduce((s, v) => s * v, 1) > 400 ? 'el producto debe ser ≤ 400 para el dibujo' : null;
  },
  preparar({ ns, as }) {
    const p = ns.reduce((s, v) => s * v, 1), pj = ns.map((n) => p / n), sj = pj.map((v, j) => inversoMod(v % ns[j], ns[j]) ?? 1);
    const base = pj.map((v, j) => v * sj[j]), A = as.reduce((s, a, i) => s + a * base[i], 0), x = mod(A, p);
    const YA = Y0 + ns.length * DY + 6, YL = YA + 74;
    return { p, pj, sj, base, A, x, YA, YL, plan: planPara([x, x + p]) };
  },
  alto: ({ YL, ns }) => YL + (ns.length + 1) * 42 + 40,
  base: ({ ns }) => [
    ...Object.entries({ n: 'nⱼ', p: 'pⱼ', mcd: '(nⱼ,pⱼ)', s: 'sⱼ', ps: 'pⱼsⱼ' }).map(([k, t]) => rotulo(`h${k}`, XC[k], Y0 - 26, t, 'tenue', 'middle')),
    ...ns.map((n, i) => rotulo(`hr${i}`, XR + i * DXR, Y0 - 26, `mod ${n}`, 'tenue', 'middle')),
  ],
  capas: [
    (c) => [...c.ns.flatMap((n, j) => [rotulo(`n${j}`, XC.n, Y0 + j * DY, String(n), 'texto', 'middle'), rotulo(`p${j}`, XC.p, Y0 + j * DY, String(c.pj[j]), 'texto', 'middle')]), ...rodante(NOTAS(c), 0, { filas: 4 })],
    (c) => [...c.ns.map((_, j) => ({ ...rotulo(`m${j}`, XC.mcd, Y0 + j * DY, '1', 'verde', 'middle'), orden: j })), ...rodante(NOTAS(c), 1, { filas: 4 })],
    (c) => rodante(NOTAS(c), 2, { filas: 4 }),
    (c) => [
      ...c.ns.flatMap((n, j) => [
        { ...rotulo(`s${j}`, XC.s, Y0 + j * DY, String(c.sj[j]), 'cian', 'middle'), orden: j },
        { ...rotulo(`ps${j}`, XC.ps, Y0 + j * DY, String(c.base[j]), 'cian', 'middle'), orden: j },
        { ...rotulo(`r${j}-${j}`, XR + j * DXR, Y0 + j * DY, '1', 'verde', 'middle'), desde: `ps${j}`, orden: j },
      ]),
      ...rodante(NOTAS(c), 3, { filas: 4 }),
    ],
    (c) => [...c.ns.flatMap((_, j) => c.ns.map((__, i) => (i === j ? null : { ...rotulo(`r${j}-${i}`, XR + i * DXR, Y0 + j * DY, '0', 'texto', 'middle'), desde: `ps${j}`, orden: j }))).filter(Boolean), ...rodante(NOTAS(c), 4, { filas: 4 })],
    (c) => [...c.ns.flatMap((_, j) => c.ns.map((__, i) => (i === j ? null : { ...rotulo(`r${j}-${i}`, XR + i * DXR, Y0 + j * DY, '0', 'texto', 'middle'), ref: true }))).filter(Boolean), ...rodante(NOTAS(c), 5, { filas: 4 })],
    (c) => [
      rotulo('Al', XC.n, c.YA + 10, 'A', 'ciruela', 'middle'),
      rotulo('Av', XC.ps, c.YA + 10, String(c.A), 'ciruela', 'middle'),
      rotulo('Af', XC.p - 20, c.YA + 10, c.as.map((a, i) => `${a}·${c.base[i]}`).join(' + '), 'ciruela'),
      ...rodante(NOTAS(c), 6, { filas: 4 }),
    ].map((n) => (n.k === 'Af' ? { ...n, a: { ...n.a, x: XC.mcd - 30 } } : n)),
    (c) => [...c.as.map((a, i) => ({ ...rotulo(`ra${i}`, XR + i * DXR, c.YA + 10, String(mod(a, c.ns[i])), 'verde', 'middle'), orden: i })), ...rodante(NOTAS(c), 7, { filas: 4 })],
    (c) => [
      ...recta('R', c.plan, c.YL + (c.ns.length + 1) * 42),
      { k: 'px', t: 'circle', a: { cx: c.plan.x(c.x), cy: c.YL + (c.ns.length + 1) * 42, r: 5 }, c: 'verde' },
      rotulo('pxt', c.plan.x(c.x), c.YL + (c.ns.length + 1) * 42 - 12, `x = ${c.x}`, 'verde', 'middle'),
      { k: 'py', t: 'circle', a: { cx: c.plan.x(c.x + c.p), cy: c.YL + (c.ns.length + 1) * 42, r: 5 }, c: 'ambar', supuesto: true },
      { ...rotulo('pyt', c.plan.x(c.x + c.p), c.YL + (c.ns.length + 1) * 42 - 12, 'y', 'ambar', 'middle'), supuesto: true },
      ...rodante(NOTAS(c), 8, { filas: 4 }),
    ],
    (c) => [...c.ns.flatMap((n, i) => carril(`L${i}`, c.plan, c.YL + i * 42, { salto: n, n: c.p / n, desde: c.x, c: 'cian', etiqueta: `saltos de ${n}` }).map((m) => ({ ...m, orden: i }))), ...rodante(NOTAS(c), 9, { filas: 4 })],
    (c) => [...carril('LP', c.plan, c.YL + c.ns.length * 42, { salto: c.p, n: 1, desde: c.x, c: 'verde', etiqueta: `un salto de p = ${c.p}` }), ...rodante(NOTAS(c), 10, { filas: 4 })],
    (c) => [{ k: 'py', t: 'circle', a: { cx: c.plan.x(c.x + c.p), cy: c.YL + (c.ns.length + 1) * 42, r: 5 }, c: 'verde' }, rotulo('pyt', c.plan.x(c.x + c.p), c.YL + (c.ns.length + 1) * 42 - 12, `y = x + ${c.p}`, 'verde', 'middle'), ...rodante(NOTAS(c), 11, { filas: 4 })],
  ],
});
