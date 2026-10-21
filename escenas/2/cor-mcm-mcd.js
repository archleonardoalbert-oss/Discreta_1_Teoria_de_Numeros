// [a,b]·(a,b) = |ab|: dos rectángulos con el mismo número de cuadraditos.
import { escenaPorCapas, conPuentes, rotulo, nota, ANCHO } from '../comun.js';
import { rectangulo } from '../primitivas.js';
import { mcd, mcm } from '../../motor/aritmetica.js';

const X = 110, Y1 = 128, HUECO = 64, ANCHO_MAX = ANCHO - 200;

const ALTO0 = ({ y2, d, lado }) => y2 + d * lado + 60;

export default escenaPorCapas({
  entradas: [
    { id: 'a', etiqueta: 'a', valor: 4, min: -30, max: 30 },
    { id: 'b', etiqueta: 'b', valor: 6, min: -30, max: 30 },
  ],
  validar({ a, b }) {
    if (a === 0 || b === 0) return 'a y b deben ser distintos de 0';
    if (mcm(a, b) > 150) return 'demasiado grande para dibujarlo con cuadraditos: prueba números más pequeños';
    return null;
  },
  preparar({ a, b }) {
    const A = Math.abs(a), B = Math.abs(b), d = mcd(a, b), L = mcm(a, b);
    const lado = Math.max(3, Math.min(16, Math.floor(ANCHO_MAX / Math.max(B, L)), Math.floor(160 / Math.max(A, d))));
    return { A, B, d, L, lado, y2: Y1 + A * lado + HUECO };
  },
  alto: (c) => ALTO0(c) + 26,
  capas: conPuentes([
    ({ A, B, lado }) => [
      ...rectangulo('r1', { x: X, y: Y1, filas: A, cols: B, lado, c: 'cian', etiquetaFilas: `|a| = ${A}`, etiquetaCols: `|b| = ${B}` }),
      rotulo('t1', 24, Y1 - 30, `|a| × |b| = ${A} × ${B} = ${A * B}`, 'cian'),
      nota('n0', 0, 'múltiplos comunes (a, b > 0):  k·ab/(a,b)'),
    ],
    ({ A, B, d, L }) => [nota('n1', 1, `k = 1:  [a,b] = ab/(a,b) = ${A * B}/${d} = ${L}`)],
    ({ a, b }) => [nota('n2', 2, `el signo no cambia ni múltiplos ni mcd:  [${a}, ${b}] = |${a}·${b}|/(${a}, ${b})`)],
    ({ A, B, d, L, lado, y2 }) => [
      ...rectangulo('r2', { x: X, y: y2, filas: d, cols: L, lado, c: 'violeta', etiquetaFilas: `(a,b) = ${d}`, etiquetaCols: `[a,b] = ${L}` }),
      rotulo('t2', 24, y2 - 30, `[a,b] × (a,b) = ${L} × ${d} = ${L * d}`, 'violeta'),
      rotulo('res', ANCHO / 2, y2 + d * lado + 40, `[a,b]·(a,b) = ${L}·${d} = ${A * B} = |a·b|`, 'verde', 'middle'),
    ],
  ], {
    0: () => ['para k ≥ 1 los múltiplos crecen con k; con k ≤ 0 no son positivos', 'texto'],
  }, (c) => ALTO0(c) + 8),
});
