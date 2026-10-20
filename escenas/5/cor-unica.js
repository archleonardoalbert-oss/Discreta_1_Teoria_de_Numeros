// mcd(a, n) = 1: una sola columna resuelve ax ≡ b. Una supuesta segunda solución x₁ (punteada) se cancela sobre x₀.
import { escenaPorCapas, rotulo, nota, flecha, num } from '../comun.js';
import { geoFilas, filasFlechas, mod } from '../piezas/modular.js';
import { mcd } from '../../motor/aritmetica.js';

const Y1 = 190, Y2 = 320;

export default escenaPorCapas({
  entradas: [
    { id: 'a', etiqueta: 'a', valor: 3, min: 1, max: 30 }, { id: 'b', etiqueta: 'b', valor: 5, min: 0, max: 30 },
    { id: 'n', etiqueta: 'n', valor: 7, min: 2, max: 12 },
  ],
  validar: ({ a, n }) => (mcd(a, n) !== 1 ? `mcd(${a}, ${n}) = ${mcd(a, n)}: el corolario pide 1` : null),
  preparar({ a, b, n }) {
    const g = geoFilas(n, { x: 40, ancho: 600, y1: Y1, y2: Y2 }), rb = mod(b, n);
    let x0 = 0; while (mod(a * x0, n) !== rb) x0++;
    return { g, rb, x0, x1: (x0 + Math.max(1, Math.floor(n / 2))) % n };
  },
  alto: Y2 + 70,
  base: ({ a }) => [rotulo('la', 24, Y1 - 6, 'x', 'texto'), rotulo('lb', 24, Y2 + 22, `${a}x`, 'texto')],
  capas: [
    ({ a, b, n }) => [nota('n0', 0, `d = mcd(${a}, ${n}) = 1 y 1 divide a todo: 1 | ${b}`, 'texto')],
    ({ g, a, b, n, x0, rb }) => [
      ...filasFlechas('F', g, (x) => a * x, { colorFlecha: (x) => (x === x0 ? 'verde' : 'muy-tenue'), colorAbajo: (y) => (y === rb ? 'ambar' : 'texto') }).nodos,
      nota('n1', 1, `soluble: x₀ = ${x0}, ${a}·${x0} = ${a * x0} ≡ ${num(b)} (mod ${n})`, 'verde'),
    ],
    ({ g, a }) => [
      ...filasFlechas('F', g, (x) => a * x, { contar: true }).nodos.filter((m) => /^F:n\d+$/.test(m.k)),
      nota('n2', 2, 'el teorema anterior con d = 1: exactamente una columna', 'texto'),
    ],
    ({ g, x1, rb }) => [
      { ...flecha('sup', g.px(x1), Y1 + 8, g.px(rb), Y2 - 9, 'ambar'), supuesto: true },
      { k: 'supa', t: 'circle', a: { cx: g.px(x1), cy: Y1, r: 10 }, c: 'ambar', hueco: true, supuesto: true },
      nota('n3', 3, 'si x₁ fuera otra solución: a·x₁ ≡ b ≡ a·x₀', 'ambar'),
    ],
    ({ g, x0, n, a }) => [
      { k: 'sup', quitar: true },
      { k: 'supa', t: 'circle', a: { cx: g.px(x0), cy: Y1, r: 10 }, c: 'verde', hueco: true },
      nota('n4', 4, `mcd(${a}, ${n}) = 1: se cancela a, x₁ ≡ x₀ (mod ${n}). Única.`, 'verde'),
    ],
  ],
});
