// ax ≡ b (n) soluble ⇔ d = (a, n) | b. La aplicación x ↦ ax: sus imágenes forman una sola órbita de casillas
// separadas d (los múltiplos de d); b se alcanza si y solo si está en ella. Y una solución x₀ arrastra a x₀ + n/d.
import { escenaPorCapas, rotulo, nota, num, por } from '../comun.js';
import { geoFilas, filasFlechas, mod } from '../piezas/modular.js';
import { mcd } from '../../motor/aritmetica.js';
import { r1 } from '../../motor/escala.js';

const Y1 = 274, Y2 = 404;

export default escenaPorCapas({
  entradas: [
    { id: 'a', etiqueta: 'a', valor: 6, min: 1, max: 30 }, { id: 'b', etiqueta: 'b', valor: 4, min: 0, max: 30 },
    { id: 'n', etiqueta: 'n', valor: 10, min: 2, max: 12 },
  ],
  validar: ({ a, b, n }) => (b % mcd(a, n) ? `(${a}, ${n}) = ${mcd(a, n)} no divide a ${b}: ninguna flecha llega a ${mod(b, n)} (es el «solo si»); elige b múltiplo de ${mcd(a, n)}` : null),
  preparar({ a, b, n }) {
    const g = geoFilas(n, { x: 40, ancho: 600, y1: Y1, y2: Y2 }), d = mcd(a, n), rb = mod(b, n);
    const sol = Array.from({ length: n }, (_, x) => x).filter((x) => mod(a * x, n) === rb), x0 = sol[0];
    return { g, d, rb, sol, x0, y0: (a * x0 - b) / n };
  },
  alto: Y2 + 70,
  base: ({ g, a }) => [rotulo('la', 24, Y1 - 6, 'x', 'texto'), rotulo('lb', 24, Y2 + 22, `${a}x`, 'texto')],
  capas: [
    ({ g, a, b, n, x0, rb }) => [
      ...filasFlechas('F', g, (x) => a * x, { colorFlecha: (x) => (x === x0 ? 'verde' : 'muy-tenue'), colorAbajo: (y) => (y === rb ? 'ambar' : 'texto') }).nodos,
      nota('n0', 0, `x₀ = ${x0}: ${a}·${x0} = ${a * x0} ≡ ${b} (mod ${n})`, 'verde'),
    ],
    ({ a, b, n, x0, y0 }) => [nota('n1', 1, `${n} | ${a}·${x0} − ${b} = ${a * x0 - b}:  y₀ = ${num(y0)}`, 'texto')],
    ({ a, b, n, x0, y0 }) => [nota('n2', 2, `a·x₀ − n·y₀ = ${a}·${x0} − ${por(n, y0)} = ${b}`, 'texto')],
    () => [nota('n3', 3, 'resolver la congruencia = resolver la diofántica ax − ny = b', 'violeta')],
    ({ g, a, n, d }) => [
      ...filasFlechas('F', g, (x) => a * x, { contar: true }).nodos.filter((m) => /^F:n\d+$/.test(m.k)),
      ...Array.from({ length: n / d }, (_, i) => ({ k: `orb${i}`, t: 'circle', a: { cx: g.px(i * d), cy: Y2, r: 10 }, c: 'cian', hueco: true, orden: i })),
      nota('n4', 4, `las flechas solo llegan a los múltiplos de d = (${a}, ${n}) = ${d}: soluble ⇔ ${d} | b`, 'cian'),
    ],
    ({ a, n, d }) => [nota('n5', 5, `(Conferencia 2: ax − ny = b tiene solución ⇔ mcd(${a}, ${n}) = ${d} divide a b)`, 'tenue')],
    ({ g, n, d, x0 }) => [
      ...(d > 1 ? [{ k: 'salto', t: 'path', a: { d: `M ${g.px(x0)} ${Y1 - 26} Q ${r1((g.px(x0) + g.px(x0 + n / d)) / 2)} ${Y1 - 66} ${g.px(x0 + n / d)} ${Y1 - 26}` }, c: 'verde' },
        rotulo('saltot', (g.px(x0) + g.px(x0 + n / d)) / 2, Y1 - 52, `+ n/d = ${n / d}`, 'verde', 'middle')] : []),
      nota('n6', 6, d > 1 ? `x₁ = x₀ + n/d = ${x0 + n / d} también es solución` : 'con d = 1, n/d = n: x₁ ≡ x₀ (mod n)', 'verde'),
    ],
    ({ g, a, n, d, sol, rb }) => [
      ...filasFlechas('F', g, (x) => a * x, { colorFlecha: (x) => (sol.includes(x) ? 'verde' : 'muy-tenue'), colorAbajo: (y) => (y === rb ? 'ambar' : 'texto') }).nodos.filter((m) => /^F:f\d+$/.test(m.k)),
      nota('n7', 7, `a·(x₀ + n/d) = a·x₀ + (a/d)·n = a·x₀ + ${a / d}·${n} ≡ a·x₀`, 'verde'),
    ],
  ],
});
