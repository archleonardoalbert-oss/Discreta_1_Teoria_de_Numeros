// Principio de Inducción: una fila de casillas P(n₀), P(n₀+1), …; la base se enciende; el paso inductivo es una
// plantilla «n → n+1» (violeta) que no está aplicada a nada; luego se desliza sobre la fila y cada aplicación
// enciende la casilla siguiente. Una implicación que vale en todas partes, no un empujón en el tiempo.
import { escenaPorCapas, rotulo, flecha, sub, ANCHO } from '../comun.js';
import { r1 } from '../../motor/escala.js';

const N = 9, W = 58, G = 8, X0 = 24, YC = 220, H = 40;
const xc = (i) => X0 + i * (W + G);                  // borde izquierdo de la casilla i
const nombre = (n0, i) => `P(${n0 + i})`;
const casilla = (k, i, c, extra = {}) => ({ k, t: 'rect', a: { x: r1(xc(i)), y: YC, width: W, height: H, rx: 7 }, c, ...extra });

// La plantilla: dos casillas «n» y «n+1» unidas por la flecha ⇒; `x` es el borde izquierdo de su primera casilla.
function plantilla(x, y, orden) {
  const o = orden === undefined ? {} : { orden };
  return [
    { k: 'T:a', t: 'rect', a: { x: r1(x), y, width: W, height: H, rx: 7 }, c: 'violeta', hueco: true, ...o },
    { k: 'T:b', t: 'rect', a: { x: r1(x + W + G), y, width: W, height: H, rx: 7 }, c: 'violeta', hueco: true, ...o },
    { ...rotulo('T:ta', x + W / 2, y + H / 2 + 5, 'P(n)', 'violeta', 'middle'), ...o },
    { ...rotulo('T:tb', x + W + G + W / 2, y + H / 2 + 5, 'P(n+1)', 'violeta', 'middle'), ...o },
    { ...flecha('T:f', x + W / 2, y - 4, x + W + G + W / 2, y - 4, 'violeta', 14), ...o },
  ];
}

export default escenaPorCapas({
  entradas: [{ id: 'n0', etiqueta: 'n₀', valor: 3, min: 1, max: 20 }],
  alto: 340,
  base: ({ n0 }) => [
    ...Array.from({ length: N }, (_, i) => casilla(`c${i}`, i, 'muy-tenue', { hueco: true })),
    ...Array.from({ length: N }, (_, i) => rotulo(`t${i}`, xc(i) + W / 2, YC + H / 2 + 5, nombre(n0, i), 'tenue', 'middle')),
    rotulo('mas', xc(N) + 6, YC + H / 2 + 5, '…', 'tenue'),
  ],
  capas: [
    ({ n0 }) => [
      casilla('c0', 0, 'verde'),
      rotulo('t0', xc(0) + W / 2, YC + H / 2 + 5, nombre(n0, 0), 'verde', 'middle'),
      rotulo('base', xc(0) + W / 2, YC + H + 24, 'base', 'verde', 'middle'),
    ],
    () => [
      ...plantilla(ANCHO / 2 - W - G / 2, 50),
      rotulo('Tt', ANCHO / 2, 116, `la plantilla vale para cualquier n ≥ n${sub(0)}`, 'violeta', 'middle'),
    ],
    ({ n0 }) => [
      // la plantilla baja y se apoya sobre n₀ y n₀ + 1: la segunda casilla se enciende
      ...plantilla(xc(0), YC - 84),
      { k: 'Tt', quitar: true },
      casilla('c1', 1, 'verde'),
      rotulo('t1', xc(1) + W / 2, YC + H / 2 + 5, nombre(n0, 1), 'verde', 'middle'),
      rotulo('ap', 24, 96, `n = ${n0}:  P(${n0}) ⇒ P(${n0 + 1})`, 'violeta'),
    ],
    ({ n0 }) => [
      // la plantilla se desliza hasta el final; detrás va dejando cada casilla encendida
      ...plantilla(xc(N - 2), YC - 84, N - 2),
      ...Array.from({ length: N - 2 }, (_, j) => j + 2).flatMap((i) => [
        { ...casilla(`c${i}`, i, 'verde'), orden: i - 1 },
        { ...rotulo(`t${i}`, xc(i) + W / 2, YC + H / 2 + 5, nombre(n0, i), 'verde', 'middle'), orden: i - 1 },
        { ...flecha(`f${i}`, xc(i - 1) + W / 2, YC - 4, xc(i) + W / 2, YC - 4, 'verde', 14), orden: i - 1 },
      ]),
      { ...flecha('f1', xc(0) + W / 2, YC - 4, xc(1) + W / 2, YC - 4, 'verde', 14) },
      rotulo('ap', 24, 96, `n = ${n0}, ${n0 + 1}, ${n0 + 2}, …:  cada casilla encendida enciende la siguiente`, 'violeta'),
    ],
    ({ n0 }) => [
      ...['T:a', 'T:b', 'T:ta', 'T:tb', 'T:f'].map((k) => ({ k, quitar: true })),
      rotulo('mas', xc(N) + 6, YC + H / 2 + 5, '…', 'verde'),
      rotulo('fin', 24, YC + H + 60, `P(n) se cumple para todo n ≥ ${n0}: no queda ninguna casilla apagada`, 'verde'),
    ],
  ],
});
