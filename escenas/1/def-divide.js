// a | b: desde 0, saltos de a; tras q saltos se cae exactamente en b. El mismo hecho como rectángulo |a| × |q|
// (apoyo a la traducción entre idiomas). Contraste: hacia b + 1 ningún salto cae.
import { escenaPorCapas, planPara, rotulo, nota, num, por } from '../comun.js';
import { recta, saltos, punto, rectangulo } from '../primitivas.js';

const YR = 150, YQ = 250;

export default escenaPorCapas({
  entradas: [
    { id: 'a', etiqueta: 'a', valor: 3, min: -12, max: 12 },
    { id: 'b', etiqueta: 'b', valor: 21, min: -60, max: 60 },
  ],
  validar: ({ a, b }) => (a === 0 ? 'la definición pide a ≠ 0' : b % a !== 0 ? `${num(a)} no divide a ${num(b)}: elige b múltiplo de a` : null),
  preparar({ a, b }) {
    const q = b / a, plan = planPara([b, b + Math.abs(a), a]);
    const lado = Math.min(22, 470 / Math.max(1, Math.abs(q)), 150 / Math.abs(a));
    return { q, plan, lado };
  },
  alto: ({ a, lado }) => Math.max(YQ + Math.abs(a) * lado + 40, 330),
  base: ({ plan, b }) => [...recta('R', plan, YR), ...punto('B', plan, b, YR, { etiqueta: `b = ${num(b)}` })],
  capas: [
    ({ a, q, plan }) => [
      ...saltos('S', plan, { desde: 0, salto: a, n: q === 0 ? 1 : Math.sign(q), y: YR }),
      rotulo('ta', plan.x(a / 2), YR - 64, `a = ${num(a)}`, 'cian', 'middle'),
      nota('n0', 0, `desde 0, saltos de a = ${num(a)}${a < 0 ? ' (hacia la izquierda)' : ''}`, 'cian'),
    ],
    ({ a, b, q, plan }) => [
      ...(q === 0 ? [{ k: 'S:a0', quitar: true }, { k: 'ta', quitar: true }] : saltos('S', plan, { desde: 0, salto: a, n: q, y: YR })),
      { k: 'aroB', t: 'circle', a: { cx: plan.x(b), cy: YR, r: 11 }, c: 'verde', hueco: true },
      nota('n1', 1, q === 0 ? `b = 0: cero saltos, ya se está en b;  0 = ${por(a, 0)}` : [`tras ${Math.abs(q)} saltos de longitud ${Math.abs(a)}${b < 0 ? ' (hacia la izquierda)' : ''} se cae en b:  ${num(b)} = ${por(a, q)},  ${num(a)} | ${num(b)}`, `tras ${Math.abs(q)} saltos se cae en b:  ${num(b)} = ${por(a, q)},  ${num(a)} | ${num(b)}`], 'verde'),
    ],
    ({ a, q, lado }) => (q === 0
      ? [rotulo('rv', 24, YQ, 'b = 0: el rectángulo no tiene columnas (0 cuadraditos)', 'cian')]
      : rectangulo('Q', { x: 120, y: YQ, filas: Math.abs(a), cols: Math.abs(q), lado, etiquetaFilas: `|a| = ${Math.abs(a)}`, etiquetaCols: `|q| = ${Math.abs(q)}` })),
    ({ a, b, q, plan }) => {
      if (Math.abs(a) === 1) return [nota('n2', 2, `con a = ${num(a)} se cae en todos los enteros: ±1 divide a todo`, 'ambar')];
      return [
        // el salto siguiente pasa por encima de b + 1 sin pisarlo
        { ...saltos('X', plan, { desde: b, salto: Math.abs(a), n: 1, y: YR })[0], c: 'ambar', supuesto: true },
        { k: 'B1', t: 'circle', a: { cx: plan.x(b + 1), cy: YR, r: 4 }, c: 'ambar' },
        rotulo('B1t', plan.x(b + 1), YR + 40, 'b + 1', 'ambar', 'middle'),
        nota('n2', 2, `b + 1 = ${num(b + 1)}: ningún salto cae ahí, ${num(a)} ∤ ${num(b + 1)}`, 'ambar'),
      ];
    },
  ],
});
