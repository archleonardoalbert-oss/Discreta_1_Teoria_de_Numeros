// [a,b]·(a,b) = |ab|: dos rectángulos con el mismo número de cuadraditos.
import { escenaPorCapas, rotulo, nota, ANCHO } from '../comun.js';
import { cuadricula } from '../primitivas.js';
import { mcd, mcm } from '../../motor/aritmetica.js';

const X = 24, Y1 = 128, HUECO = 40, ANCHO_MAX = ANCHO - 120;

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
    const lado = Math.max(4, Math.min(16, Math.floor(ANCHO_MAX / Math.max(B, L)), Math.floor(160 / Math.max(A, d))));
    return { A, B, d, L, lado, y2: Y1 + A * lado + HUECO };
  },
  alto: ({ y2, d, lado }) => y2 + d * lado + 60,
  capas: [
    ({ A, B, lado }) => [
      ...cuadricula('r1', { x: X, y: Y1, filas: A, cols: B, lado, c: 'cian', unidad: '1' }),
      rotulo('t1', X, Y1 - 10, `|a| × |b| = ${A} × ${B} = ${A * B}`, 'cian'),
      nota('n0', 0, 'múltiplos comunes (a, b > 0):  k·ab/(a,b)'),
    ],
    ({ A, B, d, L }) => [nota('n1', 1, `k = 1:  [a,b] = ab/(a,b) = ${A * B}/${d} = ${L}`)],
    ({ a, b }) => [nota('n2', 2, `el signo no cambia ni múltiplos ni mcd:  [${a}, ${b}] = |${a}·${b}|/(${a}, ${b})`)],
    ({ A, B, d, L, lado, y2 }) => [
      ...cuadricula('r2', { x: X, y: y2, filas: d, cols: L, lado, c: 'violeta', unidad: '1' }),
      rotulo('t2', X, y2 - 10, `[a,b] × (a,b) = ${L} × ${d} = ${L * d}`, 'violeta'),
      rotulo('res', ANCHO / 2, y2 + d * lado + 40, `[a,b]·(a,b) = ${L}·${d} = ${A * B} = |a·b|`, 'verde', 'middle'),
    ],
  ],
});
