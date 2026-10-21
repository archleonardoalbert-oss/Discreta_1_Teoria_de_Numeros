// 3x ≡ 9 (7): el 9 se cambia por su columna (2); x ↦ 3x es biyectiva (mcd = 1) y solo x = 3 llega al 2.
import { escenaPorCapas, rotulo, nota } from '../comun.js';
import { geoTabla, tabla, aro, geoFilas, filasFlechas } from '../piezas/modular.js';

const Y1 = 270, Y2 = 400;

export default escenaPorCapas({
  entradas: [],
  preparar: () => ({ t: geoTabla(7, 0, 13, { x: 330, y: 190, altoMax: 60, ancho: 320 }), g: geoFilas(7, { x: 40, ancho: 600, y1: Y1, y2: Y2 }) }),
  alto: Y2 + 60,
  capas: [
    () => [nota('n0', 0, '3x ≡ 9 (mod 7)', 'texto')],
    ({ t }) => [...tabla('T', t, { colores: { 9: 'ciruela', 2: 'ciruela' } }), aro('a9', t, 9, 'ciruela'), aro('a2', t, 2, 'ambar'), nota('n1', 1, '9 = 7 + 2: el 9 está en la columna del 2', 'ambar')],
    () => [nota('n2', 2, '3x ≡ 2 (mod 7)', 'texto')],
    () => [nota('n3', 3, 'mcd(3, 7) = 1 y 1 | 2: hay solución (y una sola columna)', 'texto')],
    ({ g }) => [
      ...filasFlechas('F', g, (x) => 3 * x, { colorFlecha: (x) => (x === 3 ? 'verde' : 'muy-tenue'), colorAbajo: (y) => (y === 2 ? 'ambar' : 'texto') }).nodos,
      rotulo('la', 24, Y1 - 6, 'x', 'texto'), rotulo('lb', 24, Y2 + 22, '3x', 'texto'),
      nota('n4', 4, '3x − 7q = 2 con x = 3, q = 1', 'texto'),
    ],
    () => [nota('n5', 5, '3·3 − 7·1 = 9 − 7 = 2 ✓', 'texto')],
    ({ g }) => [{ k: 'sol', t: 'circle', a: { cx: g.px(3), cy: Y1, r: 11 }, c: 'verde', hueco: true }, nota('n6', 6, 'x ≡ 3 (mod 7): 3, 10, 17, … y −4, −11, …', 'verde')],
  ],
});
