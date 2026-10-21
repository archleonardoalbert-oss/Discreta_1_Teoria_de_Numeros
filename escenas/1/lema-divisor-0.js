// a | 0: el saltador ya está en 0 antes de saltar (cero saltos). Luego varias series de saltos (de 2, de 3, de 5
// y de a), cada una hacia ambos lados: todas pasan por el 0.
import { escenaPorCapas, planPara, rotulo, nota, carril, linea, marcador as marca, num } from '../comun.js';
import { recta, saltos } from '../primitivas.js';

const YR = 130;

export default escenaPorCapas({
  entradas: [{ id: 'a', etiqueta: 'a', valor: 4, min: -12, max: 12 }],
  validar: ({ a }) => (a === 0 ? 'el lema pide a ≠ 0' : null),
  preparar({ a }) {
    const A = Math.abs(a), plan = planPara([-3 * A, 3 * A]);
    const series = [...new Set([2, 3, 5, A])].sort((u, v) => u - v);
    const planS = planPara([-3 * series.at(-1), 3 * series.at(-1)]);
    return { A, plan, series, planS };
  },
  alto: ({ series }) => 250 + series.length * 46,
  base: ({ plan }) => recta('R', plan, YR),
  capas: [
    ({ a, plan }) => [
      marca('cur', plan.x(0), YR - 13),
      nota('n0', 0, `a | 0 pide: a ≠ 0 y un entero q con 0 = ${num(a)}·q`, 'texto'),
    ],
    ({ a, plan }) => [
      ...saltos('S', plan, { desde: 0, salto: a, n: 3, y: YR, numerar: false }).map((n) => ({ ...n, c: 'muy-tenue' })),
      ...saltos('T', plan, { desde: 0, salto: -a, n: 3, y: YR, numerar: false }).map((n) => ({ ...n, c: 'muy-tenue' })),
      nota('n1', 1, `a = ${num(a)} ≠ 0 (hipótesis): los saltos de a sí avanzan`, 'texto'),
    ],
    () => [nota('n2', 2, 'se prueba q = 0, que es un entero', 'ambar')],
    ({ a, plan }) => [
      { k: 'aro0', t: 'circle', a: { cx: plan.x(0), cy: YR, r: 11 }, c: 'verde', hueco: true },
      rotulo('q0', plan.x(0), YR + 42, 'q = 0: cero saltos', 'verde', 'middle'),
      nota('n3', 3, `${num(a)}·0 = 0: cero saltos desde 0 se quedan en 0, luego ${num(a)} | 0`, 'verde'),
    ],
    ({ series, planS, A }) => [
      ...series.flatMap((s, i) => [
        ...carril(`D${s}`, planS, 230 + i * 46, { salto: s, n: 6, desde: -3 * s, c: s === A ? 'ciruela' : 'cian', etiqueta: `de ${s} en ${s}` }),
      ]),
      { ...linea('cero', planS.x(0), 200, planS.x(0), 240 + (series.length - 1) * 46, 'verde'), ancho: 2.5 },
      rotulo('ct', planS.x(0) + 8, 240 + (series.length - 1) * 46 + 18, 'todas pasan por 0: 0 es múltiplo de todos', 'verde'),
    ],
  ],
});
