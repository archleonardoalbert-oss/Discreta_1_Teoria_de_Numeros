// Transitividad: q₁ saltos de a llegan a b; q₂ saltos de b llegan a c; cada salto de b se despliega en q₁ saltos
// de a (nacen de él), así que q₁·q₂ saltos de a llegan a c.
import { escenaPorCapas, conPuentes, planPara, rotulo, nota, carril, sub } from '../comun.js';
import { recta, punto } from '../primitivas.js';
import { agrupar } from '../../motor/escala.js';

const YA = 190, YB = 250, YC = 310, YR = 370;

export default escenaPorCapas({
  entradas: [
    { id: 'a', etiqueta: 'a', valor: 2, min: 1, max: 20 },
    { id: 'b', etiqueta: 'b', valor: 6, min: 1, max: 60 },
    { id: 'c', etiqueta: 'c', valor: 30, min: 1, max: 120 },
  ],
  validar: ({ a, b, c }) => (b % a ? `${a} no divide a ${b}` : c % b ? `${b} no divide a ${c}` : null),
  preparar({ a, b, c }) {
    const plan = planPara([c]);
    return { plan, q1: b / a, q2: c / b };
  },
  alto: YR + 60,
  base: ({ plan, a, b, c }) => [
    ...recta('R', plan, YR),
    ...punto('PB', plan, b, YR, { etiqueta: 'b' }), ...punto('PC', plan, c, YR, { etiqueta: 'c' }),
  ],
  capas: conPuentes([
    ({ a, b, c }) => [
      nota('n0', 0, `hipótesis: ${a} | ${b} y ${b} | ${c}`, 'texto'),
      rotulo('meta', 680 - 24, 28, `¿${a} | ${c}?`, 'ambar', 'end'),
    ],
    ({ a, b, q1, plan }) => [
      ...carril('A', plan, YA - 10, { salto: a, n: q1, etiqueta: `q${sub(1)} = ${q1} saltos de a = ${a}` }),
      nota('n1', 1, `b = a·q${sub(1)}:  ${b} = ${a}·${q1}`, 'cian'),
    ],
    ({ b, c, q2, plan }) => [
      ...carril('B', plan, YB - 10, { salto: b, n: q2, c: 'violeta', etiqueta: `q${sub(2)} = ${q2} saltos de b = ${b}` }),
      nota('n2', 2, `c = b·q${sub(2)}:  ${c} = ${b}·${q2}`, 'violeta'),
    ],
    ({ a, b, c, q1, q2, plan }) => {
      // cada salto de b se despliega en q₁ saltos de a; si los arcos se agrupan, cada grupo nace del salto de b que le toca
      const ns = carril('C', plan, YC - 10, { salto: a, n: q1 * q2, etiqueta: `q${sub(1)}·q${sub(2)} = ${q1 * q2} saltos de a` });
      const g = agrupar(a * plan.escala, q1 * q2);
      return [
        ...ns.map((n) => {
          const j = /^C:a(\d+)$/.exec(n.k);
          if (!j) return n;
          const salto = Math.min(q2 - 1, Math.floor((Number(j[1]) * g) / q1));
          return { ...n, desde: agrupar(b * plan.escala, q2) === 1 ? `B:a${salto}` : undefined, orden: salto };
        }),
        nota('n3', 3, `c = b·q${sub(2)} = a·q${sub(1)}·q${sub(2)}:  ${c} = ${a}·${q1}·${q2}`, 'texto'),
      ];
    },
    ({ a, c, q1, q2, plan }) => [
      ...carril('C', plan, YC - 10, { salto: a, n: q1 * q2, c: 'verde', etiqueta: `q = q${sub(1)}q${sub(2)} = ${q1 * q2} saltos de a` }),
      nota('n4', 4, `c = a·q con q = ${q1 * q2}:  ${a} | ${c}`, 'verde'),
      rotulo('meta', 680 - 24, 28, `${a} | ${c} ✓`, 'verde', 'end'),
    ],
  ], {
    3: ({ a, q1, q2 }) => [`b = a·q₁ dentro de c = b·q₂:  (a·q₁)·q₂ = a·(q₁q₂) = ${a}·${q1 * q2}`, 'texto'],
  }, YR + 46),
});
