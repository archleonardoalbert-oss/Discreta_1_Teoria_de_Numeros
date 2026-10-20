// Propiedad fuerte 4: término a término. Una columna por k: aᵏ y bᵏ (mismo resto), luego c_k·aᵏ y c_k·bᵏ (mismo
// resto), y al final las sumas f(a) y f(b), que también comparten resto.
import { escenaPorCapas, rotulo, nota, num, ANCHO } from '../comun.js';
import { mod } from '../piezas/modular.js';
import { poli } from './def-solucion.js';

const Y = { pa: 130, pb: 200, ca: 280, cb: 350, f: 430 }, X0 = 120;

export default escenaPorCapas({
  entradas: [
    { id: 'n', etiqueta: 'n', valor: 5, min: 2, max: 12 }, { id: 'a', etiqueta: 'a', valor: 7, min: -9, max: 12 },
    { id: 'b', etiqueta: 'b', valor: 2, min: -9, max: 12 },
    { id: 'cs', etiqueta: 'c₀, c₁, …', valor: [3, 0, 2], min: -9, max: 9, lista: { min: 2, max: 4 } },
  ],
  validar: ({ n, a, b }) => (mod(a, n) !== mod(b, n) ? `${num(a)} ≢ ${num(b)} (mod ${n})` : null),
  preparar({ a, b, cs }) {
    const dx = Math.min(130, (ANCHO - X0 - 20) / cs.length), xk = (k) => X0 + (k + 0.5) * dx;
    const pot = (x, k) => x ** k;
    return { dx, xk, pa: cs.map((_, k) => pot(a, k)), pb: cs.map((_, k) => pot(b, k)), fa: cs.reduce((s, c, k) => s + c * pot(a, k), 0), fb: cs.reduce((s, c, k) => s + c * pot(b, k), 0) };
  },
  alto: Y.f + 46,
  capas: [
    ({ cs, xk }) => [
      nota('n0', 0, `f(x) = ${poli(cs)}`, 'texto'),
      ...cs.map((c, k) => rotulo(`h${k}`, xk(k), 84, `k = ${k}, c${'₀₁₂₃'[k]} = ${num(c)}`, 'tenue', 'middle')),
    ],
    ({ pa, pb, xk, n, a, b }) => [
      rotulo('la', 24, Y.pa, `${num(a)}ᵏ`, 'ciruela'), rotulo('lb', 24, Y.pb, `${num(b)}ᵏ`, 'cian'),
      ...pa.flatMap((v, k) => [
        { ...rotulo(`pa${k}`, xk(k), Y.pa, num(v), 'ciruela', 'middle'), orden: k }, { ...rotulo(`ra${k}`, xk(k), Y.pa + 20, `resto ${mod(v, n)}`, 'ambar', 'middle'), orden: k },
        { ...rotulo(`pb${k}`, xk(k), Y.pb, num(pb[k]), 'cian', 'middle'), orden: k }, { ...rotulo(`rb${k}`, xk(k), Y.pb + 20, `resto ${mod(pb[k], n)}`, 'ambar', 'middle'), orden: k },
      ]),
    ],
    ({ pa, pb, cs, xk, n }) => [
      rotulo('lca', 24, Y.ca, 'cₖ·aᵏ', 'ciruela'), rotulo('lcb', 24, Y.cb, 'cₖ·bᵏ', 'cian'),
      ...cs.flatMap((c, k) => [
        { ...rotulo(`ca${k}`, xk(k), Y.ca, num(c * pa[k]), 'ciruela', 'middle'), desde: `pa${k}`, orden: k }, { ...rotulo(`rca${k}`, xk(k), Y.ca + 20, `resto ${mod(c * pa[k], n)}`, 'ambar', 'middle'), orden: k },
        { ...rotulo(`cb${k}`, xk(k), Y.cb, num(c * pb[k]), 'cian', 'middle'), desde: `pb${k}`, orden: k }, { ...rotulo(`rcb${k}`, xk(k), Y.cb + 20, `resto ${mod(c * pb[k], n)}`, 'ambar', 'middle'), orden: k },
      ]),
    ],
    ({ fa, fb, n, a, b }) => [
      rotulo('sa', 24, Y.f, `f(${num(a)}) = suma de la fila = ${num(fa)}  →  resto ${mod(fa, n)}`, 'ciruela'),
      rotulo('sb', 24, Y.f + 22, `f(${num(b)}) = suma de la fila = ${num(fb)}  →  resto ${mod(fb, n)}`, 'cian'),
    ],
    ({ fa, fb, n, a, b }) => [nota('n1', 1, `f(${num(a)}) = ${num(fa)} ≡ ${num(fb)} = f(${num(b)}) (mod ${n})`, 'verde')],
  ],
});
