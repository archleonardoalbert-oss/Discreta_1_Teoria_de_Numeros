// Propiedad 3: k filas de b a a y l filas de c a b son k + l filas de c a a.
import { escenaPorCapas, conPuentes, rotulo, num, por } from '../comun.js';
import { geoTabla, tabla, aro, saltoVertical, mod } from '../piezas/modular.js';

const ALTO0 = ({ g }) => g.abajo + 70;

export default escenaPorCapas({
  entradas: [
    { id: 'n', etiqueta: 'n', valor: 4, min: 2, max: 9 }, { id: 'a', etiqueta: 'a', valor: 23, min: -20, max: 40 },
    { id: 'b', etiqueta: 'b', valor: 11, min: -20, max: 40 }, { id: 'c', etiqueta: 'c', valor: -1, min: -20, max: 40 },
  ],
  validar: ({ n, a, b, c }) => (mod(a, n) !== mod(b, n) ? `${num(a)} ≢ ${num(b)} (mod ${n})` : mod(b, n) !== mod(c, n) ? `${num(b)} ≢ ${num(c)} (mod ${n})` : null),
  preparar: ({ n, a, b, c }) => ({ g: geoTabla(n, Math.min(0, a, b, c), Math.max(a, b, c, n - 1), { x: 40, y: 90, altoMax: 240, ancho: 360 }) }),
  alto: (c) => ALTO0(c) + 26,
  base: ({ g, a, b, c }) => [...tabla('T', g, { colores: { [a]: 'ciruela', [b]: 'cian', [c]: 'violeta' } }), aro('aa', g, a, 'ciruela'), aro('ab', g, b, 'cian'), aro('ac', g, c, 'violeta')],
  capas: conPuentes([
    ({ g, a, b, c, n }) => [
      ...(a === b ? [] : [saltoVertical('ba', g, b, a, 'cian', -12)]), ...(b === c ? [] : [saltoVertical('cb', g, c, b, 'violeta', -12)]),
      rotulo('t', 24, g.abajo + 36, `a − b = ${por((a - b) / n, n)} (k = ${num((a - b) / n)}),  b − c = ${por((b - c) / n, n)} (l = ${num((b - c) / n)})`, 'texto'),
    ],
    ({ g, a, c, n }) => [
      ...(a === c ? [] : [saltoVertical('ca', g, c, a, 'verde', 14)]),
      rotulo('r', 24, g.abajo + 58, `a − c = (k + l)n = ${por((a - c) / n, n)}:  ${num(a)} ≡ ${num(c)} (mod ${n})`, 'verde'),
    ],
  ], {
    0: () => ['se suman: (a − b) + (b − c) = a − c, el b se cancela', 'texto'],
  }, (c) => ALTO0(c) + 8),
});
