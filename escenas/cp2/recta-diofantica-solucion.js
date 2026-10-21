// CP-02, ejercicio 6 (solución): las soluciones son (x₀ + kb, y₀ − ka); dos consecutivas están a distancia
// √(a² + b²). Parametrizando la recta con t, un segmento de esa longitud abarca un intervalo de t de longitud
// ≥ 1, que contiene un entero k: la solución k está dentro.
import { escenaPorCapas, rotulo, flecha, num } from '../comun.js';
import { ENTRADAS, validarRecta, geometria, solucionesVisibles, fondo, puntoSol, segmento, altoRecta, raiz } from './recta-diofantica.js';

export { solucionesVisibles };
const par = (p) => `(${num(p.x)}, ${num(p.y)})`;

export default escenaPorCapas({
  entradas: ENTRADAS,
  validar: validarRecta,
  preparar: (e) => ({ g: geometria(e) }),
  alto: ({ g }) => altoRecta(g),
  base: (ctx) => fondo(ctx, ctx.g),
  capas: [
    ({ g }) => [
      puntoSol('s0', g, g.P(0)),
      rotulo('s0t', g.X(g.P(0).x) + 9, g.Y(g.P(0).y) - 9, `k = 0: ${par(g.P(0))}`, 'verde'),
      rotulo('t0', 24, 50, '(a, b) = 1 divide a c: hay una solución (x₀, y₀)', 'verde'),
    ],
    (ctx) => [
      ...solucionesVisibles(ctx).filter((p) => p.t !== 0).map((p, i) => ({ ...puntoSol(`s${p.t}`, ctx.g, p), orden: i * 0.2 })),
      ...[-1, 1].map((t) => rotulo(`s${t}t`, ctx.g.X(ctx.g.P(t).x) + 9, ctx.g.Y(ctx.g.P(t).y) - 9, `k = ${num(t)}`, 'verde')),
      rotulo('t0', 24, 50, 'todas: (x₀ + kb, y₀ − ka), k entero', 'verde'),
    ],
    ({ a, b, g }) => [
      flecha('vec', g.X(g.P(0).x), g.Y(g.P(0).y), g.X(g.P(1).x), g.Y(g.P(1).y), 'violeta'),
      rotulo('t0', 24, 50, `de una a la siguiente: el vector (b, −a) = (${num(b)}, ${num(-a)}), longitud ${raiz(a, b)}`, 'violeta'),
    ],
    ({ g }) => [
      ...[0.25, 0.5, 0.75].map((t) => ({ k: `tk${t}`, t: 'circle', a: { cx: g.X(g.P(t).x), cy: g.Y(g.P(t).y), r: 2.5 }, c: 'violeta' })),
      rotulo('t0', 24, 50, 'cada punto de la recta es P(t) = (x₀ + tb, y₀ − ta), t real', 'violeta'),
    ],
    ({ a, b, g }) => [
      segmento('seg', g, 0.4, 1.4),
      rotulo('t0', 24, 50, `segmento de longitud ${raiz(a, b)}: abarca t de 0,4 a 1,4`, 'ambar'),
    ],
    ({ g }) => [
      { ...puntoSol('s1', g, g.P(1)), ref: true },
      { k: 'aro', t: 'circle', a: { cx: g.X(g.P(1).x), cy: g.Y(g.P(1).y), r: 10 }, c: 'verde', hueco: true },
      rotulo('t0', 24, 50, 'el entero k = 1 está entre 0,4 y 1,4: la solución P(1) está dentro', 'verde'),
    ],
  ],
});
