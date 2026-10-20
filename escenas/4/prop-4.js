// Propiedad 4: a ≡ b y c ≡ d. Las sumas a + c y b + d caen en una misma columna (y las restas a − c, b − d en otra):
// da igual qué representante de cada columna se elija.
import { escenaPorCapas, rotulo, num, por } from '../comun.js';
import { geoTabla, tabla, aro, columna, saltoVertical, mod } from '../piezas/modular.js';

export default escenaPorCapas({
  entradas: [
    { id: 'n', etiqueta: 'n', valor: 5, min: 3, max: 9 }, { id: 'a', etiqueta: 'a', valor: 7, min: -12, max: 20 },
    { id: 'b', etiqueta: 'b', valor: -3, min: -12, max: 20 }, { id: 'c', etiqueta: 'c', valor: 4, min: -12, max: 20 },
    { id: 'd', etiqueta: 'd', valor: 9, min: -12, max: 20 },
  ],
  validar: ({ n, a, b, c, d }) => (mod(a, n) !== mod(b, n) ? `${num(a)} ≢ ${num(b)} (mod ${n})` : mod(c, n) !== mod(d, n) ? `${num(c)} ≢ ${num(d)} (mod ${n})` : null),
  preparar({ n, a, b, c, d }) {
    const vs = [a, b, c, d, a + c, b + d, a - c, b - d, 0, n - 1];
    return { g: geoTabla(n, Math.min(...vs), Math.max(...vs), { x: 40, y: 60, altoMax: 300, ancho: 380 }) };
  },
  alto: ({ g }) => g.abajo + 110,
  base: ({ g }) => tabla('T', g),
  capas: [
    ({ g, a, b, c, d, n }) => [
      aro('aa', g, a, 'ciruela'), aro('ab', g, b, 'ciruela'), aro('ac', g, c, 'cian'), aro('ad', g, d, 'cian'),
      ...(a === b ? [] : [saltoVertical('fab', g, b, a, 'ciruela', -12)]), ...(c === d ? [] : [saltoVertical('fcd', g, d, c, 'cian', 12)]),
      rotulo('t0', 24, g.abajo + 36, `a − b = ${por((a - b) / n, n)} (k),  c − d = ${por((c - d) / n, n)} (l)`, 'texto'),
    ],
    ({ g, a, b, c, d, n }) => [
      columna('cs', g, mod(a + c, n), 'verde'), aro('s1', g, a + c, 'verde'), aro('s2', g, b + d, 'verde'),
      rotulo('t1', 24, g.abajo + 58, `a + c = ${num(a + c)},  b + d = ${num(b + d)}:  diferencia (k + l)n = ${por((a + c - b - d) / n, n)}`, 'verde'),
    ],
    ({ g, a, b, c, d, n }) => [
      columna('cr', g, mod(a - c, n), 'violeta'), aro('r1', g, a - c, 'violeta'), aro('r2', g, b - d, 'violeta'),
      rotulo('t2', 24, g.abajo + 80, `a − c = ${num(a - c)},  b − d = ${num(b - d)}:  diferencia (k − l)n = ${por((a - c - b + d) / n, n)}`, 'violeta'),
    ],
  ],
});
