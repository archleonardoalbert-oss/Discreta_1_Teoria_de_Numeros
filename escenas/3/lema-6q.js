// Todo primo > 3 es 6q ± 1: la recta enrollada en filas de 6 (cada columna es un resto r). Las columnas 0, 2, 4
// (pares) y 3 (múltiplos de 3) se apagan; los primos mayores que 3 solo quedan en las columnas 1 y 5.
import { escenaPorCapas, conPuentes, rotulo, ANCHO } from '../comun.js';
import { esPrimo } from '../../motor/primos.js';
import { r1 } from '../../motor/escala.js';

const X0 = 150, DX = 84, Y0 = 92;
const xCol = (r) => X0 + r * DX;
const encabezado = (r, txt, c = 'tenue') => rotulo(`h${r}`, xCol(r), 56, txt, c, 'middle');

const ALTO0 = ({ alto }) => alto;

export default escenaPorCapas({
  entradas: [{ id: 'N', etiqueta: 'hasta', valor: 60, min: 36, max: 120 }],
  preparar({ N }) {
    const filas = Math.floor(N / 6) + 1, dy = Math.min(26, 360 / filas);
    const pos = (n) => ({ x: xCol(n % 6), y: Y0 + Math.floor(n / 6) * dy });
    const numeros = Array.from({ length: N }, (_, i) => i + 1);
    const columna = (r) => ({ k: `tacha${r}`, t: 'rect', a: { x: r1(xCol(r) - 30), y: r1(Y0 - dy + 4), width: 60, height: r1(filas * dy + 4), rx: 8 }, c: 'muy-tenue' });
    const aro = (k, n, c, extra = {}) => ({ k, t: 'circle', a: { cx: r1(pos(n).x), cy: r1(pos(n).y - 4), r: r1(Math.min(13, dy / 2 - 0.5)) }, c, hueco: true, ...extra });
    return { filas, dy, pos, numeros, columna, aro, alto: Y0 + filas * dy + 70 };
  },
  alto: (c) => ALTO0(c) + 26,
  capas: conPuentes([
    ({ numeros, pos }) => [
      ...[0, 1, 2, 3, 4, 5].map((r) => encabezado(r, `6q + ${r}`)),
      // la recta se enrolla: cada número nace del anterior y llegan uno tras otro
      ...numeros.map((n) => ({ ...rotulo(`num${n}`, pos(n).x, pos(n).y, String(n), 'texto', 'middle'), ...(n > 1 ? { desde: `num${n - 1}` } : {}), orden: Math.min(n * 0.25, 15) })),
    ],
    ({ numeros, pos, columna, aro }) => [
      ...[0, 2, 4].map(columna),
      ...numeros.filter((n) => n % 2 === 0 && n !== 2).map((n) => rotulo(`num${n}`, pos(n).x, pos(n).y, String(n), 'muy-tenue', 'middle')),
      aro('exc2', 2, 'ambar'),
      ...[0, 2, 4].map((r) => encabezado(r, 'par', 'muy-tenue')),
    ],
    ({ numeros, pos, columna, aro, filas, dy }) => [
      columna(3),
      ...numeros.filter((n) => n % 6 === 3 && n !== 3).map((n) => rotulo(`num${n}`, pos(n).x, pos(n).y, String(n), 'muy-tenue', 'middle')),
      encabezado(3, 'múlt. de 3', 'muy-tenue'),
      aro('exc3', 3, 'ambar'),
      ...[1, 5].map((r) => ({ k: `col${r}`, t: 'rect', a: { x: r1(xCol(r) - 30), y: r1(Y0 - dy + 4), width: 60, height: r1(filas * dy + 4), rx: 8 }, c: 'cian', hueco: true })),
      rotulo('exc', 24, Y0 + filas * dy + 30, '2 y 3 son los únicos primos fuera de las columnas 1 y 5', 'ambar'),
    ],
    ({ numeros, aro }) => [
      encabezado(1, '6q + 1', 'verde'),
      ...numeros.filter((n) => n > 3 && n % 6 === 1 && esPrimo(n)).map((n) => aro(`aro${n}`, n, 'verde')),
    ],
    ({ numeros, aro }) => [
      encabezado(5, '6k − 1', 'verde'),
      rotulo('k', xCol(5), 36, 'q = k − 1', 'tenue', 'middle'),
      ...numeros.filter((n) => n > 3 && n % 6 === 5 && esPrimo(n)).map((n) => aro(`aro${n}`, n, 'verde')),
    ],
    ({ numeros, aro, filas, dy }) => {
      const falsos = numeros.filter((n) => n > 3 && (n % 6 === 1 || n % 6 === 5) && !esPrimo(n));
      return [
        ...falsos.map((n) => aro(`falso${n}`, n, 'ambar', { supuesto: true })),
        rotulo('rec', 24, Y0 + filas * dy + 52, `recíproco falso: ${falsos.slice(0, 4).join(', ')} están en las columnas 1 y 5 y no son primos`, 'ambar'),
      ];
    },
  ], {
    1: () => ['r par: 6q + r = 2(3q + r/2) es múltiplo de 2 (y mayor que 2)', 'texto'],
    2: () => ['6q + 3 = 3(2q + 1): múltiplo de 3 y mayor que 3', 'texto'],
  }, (c) => ALTO0(c) + 8),
});
