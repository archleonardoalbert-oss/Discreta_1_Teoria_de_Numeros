// CP-01, ejercicio 7 (planteamiento): el tablero sin una casilla y la pieza en L. Solo lo que se pide.
import { escenaPorCapas, rotulo } from '../comun.js';
import { ENTRADAS, validarCasilla, tablero } from './tablero-solucion.js';

const X = 24, Y = 52, LADO = 300;

export default escenaPorCapas({
  entradas: ENTRADAS,
  validar: validarCasilla,
  preparar: ({ k }) => ({ n: 2 ** k, lado: LADO / 2 ** k }),
  alto: Y + LADO + 40,
  capas: [
    (ctx) => [
      ...tablero(ctx, { f: ctx.fila, c: ctx.col }),
      rotulo('tit', X, 28, `tablero ${ctx.n} × ${ctx.n} (= 2^${ctx.k} × 2^${ctx.k}) con una casilla quitada`, 'texto'),
    ],
    () => {
      const x0 = 360, y0 = 100, l = 34;
      return [
        rotulo('p:t', x0, y0 - 16, 'la pieza L: 3 casillas', 'texto'),
        ...[[0, 0], [1, 0], [1, 1]].map(([i, j]) => ({ k: `p${i}${j}`, t: 'rect', a: { x: x0 + j * l + 2, y: y0 + i * l + 2, width: l - 4, height: l - 4, rx: 3 }, c: 'cian' })),
        rotulo('p:g', x0, y0 + 2 * l + 24, 'se puede girar (4 posiciones)', 'tenue'),
      ];
    },
    ({ n }) => [
      rotulo('q1', 360, 250, '¿se cubre todo sin solapes', 'ambar'),
      rotulo('q2', 360, 272, 'ni huecos, esté donde esté', 'ambar'),
      rotulo('q3', 360, 294, `la casilla quitada?  (${n * n - 1} casillas)`, 'ambar'),
    ],
  ],
});
