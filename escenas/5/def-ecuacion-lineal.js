// ax ≡ b (n): cada x = 0…n−1 manda una flecha a ax; las que llegan a b son soluciones. Una solución es una
// columna entera: x₀, x₀ + n, x₀ + 2n, … cuentan como una.
import { escenaPorCapas, rotulo, nota, num } from '../comun.js';
import { geoFilas, filasFlechas, mod } from '../piezas/modular.js';

const Y1 = 130, Y2 = 270;

export default escenaPorCapas({
  entradas: [
    { id: 'a', etiqueta: 'a', valor: 4, min: -20, max: 30 }, { id: 'b', etiqueta: 'b', valor: 2, min: -20, max: 30 },
    { id: 'n', etiqueta: 'n', valor: 6, min: 2, max: 12 },
  ],
  preparar({ a, b, n }) {
    const g = geoFilas(n, { x: 40, ancho: 600, y1: Y1, y2: Y2 }), sol = Array.from({ length: n }, (_, x) => x).filter((x) => mod(a * x, n) === mod(b, n));
    return { g, sol, rb: mod(b, n) };
  },
  alto: Y2 + 90,
  capas: [
    ({ g, a, n }) => [
      ...filasFlechas('F', g, (x) => a * x, { colorFlecha: () => 'violeta' }).nodos,
      rotulo('la', 24, Y1 - 6, 'x', 'texto'), rotulo('lb', 24, Y2 + 22, `${num(a)}x`, 'texto'),
      nota('n0', 0, `${num(a)}x ≡ b (mod ${n}): cada x manda una flecha a la columna de ${num(a)}x`, 'texto'),
    ],
    ({ g, a, b, n, sol, rb }) => [
      ...filasFlechas('F', g, (x) => a * x, { colorFlecha: (x) => (sol.includes(x) ? 'verde' : 'muy-tenue'), colorAbajo: (y) => (y === rb ? 'ambar' : 'texto') }).nodos,
      ...sol.map((x) => ({ k: `s${x}`, t: 'circle', a: { cx: g.px(x), cy: Y1, r: 10 }, c: 'verde', hueco: true })),
      nota('n1', 1, sol.length ? `b = ${num(b)} está en la columna ${rb}: soluciones x = ${sol.join(', ')}` : `b = ${num(b)} (columna ${rb}): no le llega ninguna flecha, sin solución`, sol.length ? 'verde' : 'ambar'),
    ],
    ({ sol, n }) => [nota('n2', 2, sol.length ? `x = ${sol[0]}, ${sol[0] + n}, ${sol[0] + 2 * n}, … son la misma solución: la columna ${sol[0]} (mod ${n})` : 'no hay columnas solución', 'texto')],
  ],
});
