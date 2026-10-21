// CP-01, ejercicio 6 (planteamiento): un polígono simple no convexo, qué es una diagonal interior (Nota 3)
// y una triangulación de ejemplo (Nota 2). La pregunta: ¿siempre n − 2 triángulos?
import { escenaPorCapas, rotulo, linea } from '../comun.js';

// heptágono con una muesca en V2 (vértice reentrante)
const V = [[100, 200], [220, 60], [300, 150], [400, 50], [520, 180], [420, 260], [230, 250]];
const DIAG = [[2, 0], [2, 6], [2, 5], [2, 4]];
const TRI = [[0, 1, 2], [2, 6, 0], [2, 5, 6], [2, 4, 5], [2, 3, 4]];
const centro = (t) => t.reduce(([x, y], i) => [x + V[i][0] / 3, y + V[i][1] / 3], [0, 0]);

export default escenaPorCapas({
  entradas: [],
  alto: 300,
  capas: [
    () => [
      { k: 'pol', t: 'path', a: { d: `M ${V.map((p) => p.join(' ')).join(' L ')} Z` }, c: 'cian' },
      ...V.map(([x, y], i) => ({ k: `v${i}`, t: 'circle', a: { cx: x, cy: y, r: 4 }, c: 'cian' })),
      rotulo('t', 24, 28, 'polígono simple de n = 7 lados (no convexo)', 'cian'),
    ],
    () => [
      { ...linea('dIn', ...V[2], ...V[5], 'verde'), orden: 0 },
      { ...linea('dOut', ...V[1], ...V[3], 'ambar'), supuesto: true, orden: 1 },
      rotulo('t1', 560, 120, 'interior ✓', 'verde', 'start'),
      rotulo('t2', 250, 40, 'no es interior: sale del polígono', 'ambar', 'start'),
    ],
    () => [
      { k: 'dOut', quitar: true }, { k: 't2', quitar: true }, { k: 'dIn', quitar: true },
      ...DIAG.map(([a, b], i) => ({ ...linea(`d${i}`, ...V[a], ...V[b], 'verde'), orden: i * 0.4 })),
      ...TRI.map((t, i) => ({ ...rotulo(`n${i}`, centro(t)[0], centro(t)[1] + 5, String(i + 1), 'violeta', 'middle'), orden: 2 + i * 0.3 })),
      { k: 't1', quitar: true },
      rotulo('t3', 24, 290, 'una triangulación: diagonales interiores que no se cortan → 5 triángulos', 'verde'),
    ],
    () => [
      rotulo('t4', 545, 60, '5 = 7 − 2', 'ciruela', 'start'),
      rotulo('t5', 545, 84, '¿siempre n − 2?', 'ciruela', 'start'),
    ],
  ],
});
