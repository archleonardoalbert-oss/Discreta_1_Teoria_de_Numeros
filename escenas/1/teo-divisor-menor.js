// b | a, a ≠ 0 ⇒ |a| ≥ |b|: |q| saltos de longitud |b| cubren |a|; como a ≠ 0 hay al menos un salto, y ese
// primer salto ya mide |b|.
import { escenaPorCapas, planPara, rotulo, nota, num, por } from '../comun.js';
import { recta, saltos, llave, punto } from '../primitivas.js';

const YR = 170;

export default escenaPorCapas({
  entradas: [
    { id: 'a', etiqueta: 'a', valor: -20, min: -60, max: 60 },
    { id: 'b', etiqueta: 'b', valor: 4, min: -20, max: 20 },
  ],
  validar: ({ a, b }) => (a === 0 ? 'el teorema pide a ≠ 0' : b === 0 ? 'b = 0 no divide a nadie' : a % b !== 0 ? `${num(b)} no divide a ${num(a)}` : null),
  preparar({ a, b }) {
    const A = Math.abs(a), B = Math.abs(b), Q = A / B;
    return { A, B, Q, q: a / b, plan: planPara([A]) };
  },
  alto: 300,
  base: ({ plan, A }) => [...recta('R', plan, YR), ...punto('PA', plan, A, YR, { etiqueta: `|a| = ${A}` })],
  capas: [
    ({ a, b, q, B, Q, plan, A }) => [
      ...saltos('S', plan, { desde: 0, salto: B, n: Q, y: YR }),
      ...llave('LA', plan, 0, A, YR + 30, `|a| = |b|·|q| = ${B}·${Q}`, 'cian'),
      nota('n0', 0, `a = b·q:  ${num(a)} = ${por(b, q)}`, 'texto'),
    ],
    ({ B, Q, plan }) => [
      { ...saltos('S', plan, { desde: 0, salto: B, n: Q, y: YR })[0], ref: true },
      nota('n1', 1, `a ≠ 0 ⇒ q ≠ 0: hay al menos un salto, |q| = ${Q} ≥ 1`, 'ambar'),
    ],
    ({ B, Q, A, plan }) => [
      { ...saltos('S', plan, { desde: 0, salto: B, n: Q, y: YR })[0], c: 'ambar' },
      ...llave('LB', plan, 0, B, YR + 62, `|b| = ${B}`, 'ambar'),
      nota('n2', 2, `|a| = ${A} ≥ ${B} = |b|: el primer salto ya mide |b|`, 'verde'),
    ],
  ],
});
