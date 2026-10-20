// Propiedad 10: si c | n, cada salto de n está hecho de q saltos de c; los k saltos de n que van de b a a
// son kq saltos de c (nacen de ellos).
import { escenaPorCapas, planPara, rotulo, nota, carril, num } from '../comun.js';
import { recta, punto } from '../primitivas.js';
import { agrupar } from '../../motor/escala.js';

const YN = 150, YC = 220, YR = 280;

export default escenaPorCapas({
  entradas: [
    { id: 'n', etiqueta: 'n', valor: 12, min: 2, max: 30 }, { id: 'c', etiqueta: 'c', valor: 4, min: 1, max: 30 },
    { id: 'a', etiqueta: 'a', valor: 41, min: -40, max: 90 }, { id: 'b', etiqueta: 'b', valor: 5, min: -40, max: 90 },
  ],
  validar: ({ n, c, a, b }) => (n % c ? `${c} no divide a ${n}` : (a - b) % n ? `${num(a)} ≢ ${num(b)} (mod ${n})` : a === b ? 'elige a ≠ b para ver los saltos' : null),
  preparar: ({ n, c, a, b }) => ({ plan: planPara([a, b]), q: n / c, k: (a - b) / n }),
  alto: YR + 50,
  base: ({ plan, a, b }) => [...recta('R', plan, YR), ...punto('PA', plan, a, YR, { etiqueta: `a = ${num(a)}` }), ...punto('PB', plan, b, YR, { c: 'cian', etiqueta: `b = ${num(b)}` })],
  capas: [
    ({ n, c, q }) => [nota('n0', 0, `c | n:  n = q·c = ${q}·${c}`, 'texto')],
    ({ plan, a, b, n, k }) => [
      ...carril('N', plan, YN, { salto: Math.sign(k) * n, n: Math.abs(k), desde: b, c: 'violeta', etiqueta: `k = ${num(k)}: ${Math.abs(k)} saltos de n = ${n}` }),
      nota('n1', 1, `a − b = kn = ${num(a - b)}`, 'violeta'),
    ],
    ({ plan, a, b, c, q, k, n }) => {
      const g = agrupar(c * plan.escala, Math.abs(k * q)), gn = agrupar(n * plan.escala, Math.abs(k));
      return [
        ...carril('C', plan, YC, { salto: Math.sign(k) * c, n: Math.abs(k * q), desde: b, c: 'verde', etiqueta: `kq = ${num(k * q)}: ${Math.abs(k * q)} saltos de c = ${c}` }).map((m) => {
          const j = /^C:a(\d+)$/.exec(m.k);
          if (!j || gn > 1) return m;
          const de = Math.min(Math.abs(k) - 1, Math.floor((Number(j[1]) * g) / q));
          return { ...m, desde: `N:a${de}`, orden: de };
        }),
        nota('n2', 2, `a − b = kqc = ${num(k * q)}·${c}:  ${num(a)} ≡ ${num(b)} (mod ${c})`, 'verde'),
      ];
    },
  ],
});
