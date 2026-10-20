// Propiedad 2: el mismo camino de saltos de n, recorrido al revés (k ↦ −k).
import { escenaPorCapas, rotulo, num, por } from '../comun.js';
import { geoTabla, tabla, aro, saltoVertical, mod } from '../piezas/modular.js';

export default escenaPorCapas({
  entradas: [{ id: 'n', etiqueta: 'n', valor: 4, min: 2, max: 9 }, { id: 'a', etiqueta: 'a', valor: 18, min: -20, max: 40 }, { id: 'b', etiqueta: 'b', valor: -2, min: -20, max: 40 }],
  validar: ({ n, a, b }) => (mod(a, n) !== mod(b, n) ? `${num(a)} ≢ ${num(b)} (mod ${n})` : null),
  preparar: ({ n, a, b }) => ({ g: geoTabla(n, Math.min(0, a, b), Math.max(a, b, n - 1), { x: 40, y: 90, altoMax: 240, ancho: 360 }), k: (a - b) / n }),
  alto: ({ g }) => g.abajo + 70,
  base: ({ g, a, b }) => [...tabla('T', g, { colores: { [a]: 'ciruela', [b]: 'cian' } }), aro('aa', g, a, 'ciruela'), aro('ab', g, b, 'cian')],
  capas: [
    ({ g, a, b, n, k }) => [...(a === b ? [] : [saltoVertical('ida', g, b, a, 'cian', -12)]), rotulo('t', 24, g.abajo + 36, `a − b = ${num(a - b)} = ${por(k, n)}: de b a a, k = ${num(k)}`, 'cian')],
    ({ g, a, b, n, k }) => [...(a === b ? [] : [saltoVertical('vuelta', g, a, b, 'verde', 12)]), rotulo('r', 24, g.abajo + 58, `b − a = ${num(b - a)} = ${por(-k, n)}: de a a b, −k = ${num(-k)}`, 'verde')],
  ],
});
