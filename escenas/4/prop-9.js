// Propiedad 9: un cambio de unidad. Una regla violeta marca la recta cada c (la nueva unidad): a, b y n son
// múltiplos de c, así que en la regla nueva valen a₁, b₁ y n₁. Los mismos k saltos que llevan de b a a miden kn₁.
import { escenaPorCapas, planPara, rotulo, nota, carril, num } from '../comun.js';
import { recta, punto, reglasDobles } from '../primitivas.js';

const YR = 250;

export default escenaPorCapas({
  entradas: [
    { id: 'n', etiqueta: 'n', valor: 12, min: 2, max: 30 }, { id: 'c', etiqueta: 'c', valor: 3, min: 2, max: 10 },
    { id: 'a', etiqueta: 'a', valor: 27, min: 0, max: 90 }, { id: 'b', etiqueta: 'b', valor: 3, min: 0, max: 90 },
  ],
  validar: ({ n, c, a, b }) => (n % c || a % c || b % c ? `c = ${c} debe dividir a a, b y n` : (a - b) % n ? `${a} ≢ ${b} (mod ${n})` : null),
  preparar: ({ n, c, a, b }) => ({ plan: planPara([a, b, n]), k: (a - b) / n }),
  alto: YR + 50,
  base: ({ plan, a, b }) => [...recta('R', plan, YR), ...punto('PA', plan, a, YR, { etiqueta: `a = ${a}` }), ...punto('PB', plan, b, YR, { c: 'cian', etiqueta: `b = ${b}` })],
  capas: [
    ({ plan, c, a, b, n }) => [
      ...reglasDobles('U', plan, { b: c, k: Math.floor(plan.max / c), y: YR, abajo: false }),
      rotulo('ut', 24, YR - 72, `regla nueva: la unidad es c = ${c}`, 'violeta'),
      nota('n0', 0, `a = c·a₁ = ${c}·${a / c},  b = c·b₁ = ${c}·${b / c},  n = c·n₁ = ${c}·${n / c}`, 'violeta'),
    ],
    ({ plan, a, b, n, k, c }) => [
      ...(k === 0 ? [] : carril('K', plan, YR - 120, { salto: Math.sign(k) * n, n: Math.abs(k), desde: b, etiqueta: `${Math.abs(k)} saltos de n = ${n}` })),
      nota('n1', 1, `ca₁ − cb₁ = ${a} − ${b} = ${num(a - b)} = k·c·n₁ con k = ${num(k)}`, 'cian'),
    ],
    ({ plan, a, b, n, k, c }) => [
      ...(k === 0 ? [] : carril('K', plan, YR - 120, { salto: Math.sign(k) * n, n: Math.abs(k), desde: b, c: 'verde', etiqueta: `${Math.abs(k)} saltos de n₁ = ${n / c} (en la regla nueva)` })),
      nota('n2', 2, `en la regla nueva: ${a / c} − ${b / c} = ${num(k)}·${n / c},  ${a / c} ≡ ${b / c} (mod ${n / c})`, 'verde'),
    ],
  ],
});
