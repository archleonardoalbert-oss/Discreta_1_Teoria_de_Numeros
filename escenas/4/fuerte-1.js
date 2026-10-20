// Propiedad fuerte 1: una fila por primo p con sus exponentes como barras de bloques: m_p, n_p, max(m_p, n_p)
// (el mcm) y c_p (los de a − b). Abajo, sobre la recta, los saltos de m, de n y de mcm(m, n) que van de b a a.
import { escenaPorCapas, planPara, rotulo, carril, num, sup } from '../comun.js';
import { recta, punto } from '../primitivas.js';
import { canonica } from '../../motor/primos.js';
import { mcm } from '../../motor/aritmetica.js';
import { r1 } from '../../motor/escala.js';

const Y0 = 72, DY = 28, COLS = { m: 96, n: 236, M: 376, c: 516 }, L = 14;
const exps = (v) => Object.fromEntries(canonica(Math.abs(v)));
const barra = (k, x, y, e, c, orden) => Array.from({ length: e }, (_, i) => ({ k: `${k}-${i}`, t: 'rect', a: { x: x + i * (L + 2), y: r1(y - L + 3), width: L, height: L, rx: 2 }, c, orden }));
const formula = (v) => canonica(Math.abs(v)).map(([p, e]) => `${p}${e > 1 ? sup(e) : ''}`).join('·') || '1';

export default escenaPorCapas({
  entradas: [
    { id: 'm', etiqueta: 'm', valor: 4, min: 2, max: 30 }, { id: 'n', etiqueta: 'n', valor: 6, min: 2, max: 30 },
    { id: 'a', etiqueta: 'a', valor: 29, min: -60, max: 99 }, { id: 'b', etiqueta: 'b', valor: 5, min: -60, max: 99 },
  ],
  validar: ({ m, n, a, b }) => (a === b ? 'elige a ≠ b' : (a - b) % m ? `${num(a)} ≢ ${num(b)} (mod ${m})` : (a - b) % n ? `${num(a)} ≢ ${num(b)} (mod ${n})` : null),
  preparar({ m, n, a, b }) {
    const M = mcm(m, n), em = exps(m), en = exps(n), ec = exps(a - b);
    const primos = [...new Set([...Object.keys(em), ...Object.keys(en)].map(Number))].sort((u, v) => u - v);
    const YB = Y0 + primos.length * DY + 96;
    return { M, em, en, ec, primos, YB, plan: planPara([a, b]) };
  },
  alto: ({ YB }) => YB + 214,
  capas: [
    ({ m, n, M, em, en, primos }) => [
      ...Object.entries(COLS).map(([k, x]) => rotulo(`h${k}`, x, Y0 - 34, { m: `m = ${formula(m)}`, n: `n = ${formula(n)}`, M: `mcm = ${formula(M)}`, c: '' }[k], { m: 'violeta', n: 'cian', M: 'ambar', c: 'verde' }[k])).filter((r) => r.txt),
      ...primos.flatMap((p, i) => [
        rotulo(`p${p}`, 24, Y0 + i * DY, `p = ${p}`, 'texto'),
        ...barra(`bm${p}`, COLS.m, Y0 + i * DY, em[p] ?? 0, 'violeta', i), ...barra(`bn${p}`, COLS.n, Y0 + i * DY, en[p] ?? 0, 'cian', i),
        ...barra(`bM${p}`, COLS.M, Y0 + i * DY, Math.max(em[p] ?? 0, en[p] ?? 0), 'ambar', i + 1),
      ]),
    ],
    ({ plan, a, b, m, n, YB }) => [
      ...recta('R', plan, YB + 150), ...punto('PA', plan, a, YB + 150, { etiqueta: `a = ${num(a)}` }), ...punto('PB', plan, b, YB + 150, { c: 'tenue', etiqueta: `b = ${num(b)}` }),
      ...carril('Lm', plan, YB, { salto: Math.sign(a - b) * m, n: Math.abs((a - b) / m), desde: b, c: 'violeta', etiqueta: `saltos de m = ${m}` }),
      ...carril('Ln', plan, YB + 46, { salto: Math.sign(a - b) * n, n: Math.abs((a - b) / n), desde: b, c: 'cian', etiqueta: `saltos de n = ${n}` }),
      rotulo('t1', 24, YB - 44, 'a − b es múltiplo de m y de n: pᵐᵖ | a − b y pⁿᵖ | a − b', 'texto'),
    ],
    ({ a, b, ec, primos }) => [
      rotulo('hc', COLS.c, Y0 - 34, `a − b = ${formula(a - b)}`, 'verde'),
      ...primos.flatMap((p, i) => barra(`bc${p}`, COLS.c, Y0 + i * DY, ec[p] ?? 0, 'verde', i)),
      rotulo('t2', 24, Y0 + primos.length * DY + 12, 'en cada fila, la barra verde es al menos tan larga como la ámbar', 'verde'),
    ],
    ({ plan, a, b, M, YB }) => [
      ...carril('LM', plan, YB + 92, { salto: Math.sign(a - b) * M, n: Math.abs((a - b) / M), desde: b, c: 'verde', etiqueta: `saltos de mcm = ${M}` }),
    ],
    ({ a, b, M, YB }) => [rotulo('t4', 24, YB + 196, `a ≡ b (mod mcm(m, n)):  ${num(a)} ≡ ${num(b)} (mod ${M})`, 'verde')],
  ],
});
