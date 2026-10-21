// CP-01, ejercicio 7 (solución): el tablero 2^k × 2^k sin una casilla se cubre con piezas en L por inducción.
// Se corta en cuatro cuadrantes; la casilla quitada está en uno; una L en el centro «quita» una casilla a cada
// uno de los otros tres, y los cuatro quedan como el caso k − 1. Al final, la teselación completa.
import { escenaPorCapas, rotulo, ANCHO } from '../comun.js';
import { r1 } from '../../motor/escala.js';

export const ENTRADAS = [
  { id: 'k', etiqueta: 'k', valor: 3, min: 1, max: 4 },
  { id: 'fila', etiqueta: 'fila', valor: 2, min: 0, max: 15 },
  { id: 'col', etiqueta: 'columna', valor: 5, min: 0, max: 15 },
];
export const validarCasilla = ({ k, fila, col }) => {
  const n = 2 ** k;
  return fila >= n || col >= n ? `con k = ${k} el tablero es ${n} × ${n}: fila y columna van de 0 a ${n - 1}` : null;
};

/** Piezas L (listas de 3 casillas [fila, col]) que cubren el tablero 2^k sin la casilla (f, c). */
export function teselar(k, f, c) {
  const piezas = [];
  const rec = (k, f0, c0, hf, hc) => {
    if (k === 0) return;
    const m = 2 ** (k - 1), centro = [[f0 + m - 1, c0 + m - 1], [f0 + m - 1, c0 + m], [f0 + m, c0 + m - 1], [f0 + m, c0 + m]];
    const cuad = (ff, cc) => (ff >= f0 + m ? 2 : 0) + (cc >= c0 + m ? 1 : 0);
    const q = cuad(hf, hc), L = [];
    const huecos = centro.map(([ff, cc], i) => (i === q ? [hf, hc] : (L.push([ff, cc]), [ff, cc])));
    piezas.push(L);
    [[f0, c0], [f0, c0 + m], [f0 + m, c0], [f0 + m, c0 + m]].forEach(([ff, cc], i) => rec(k - 1, ff, cc, huecos[i][0], huecos[i][1]));
  };
  rec(k, 0, 0, f, c);
  return piezas;
}

const X = 24, Y = 52, LADO = 300;
const COLORES = ['cian', 'violeta', 'verde', 'ciruela', 'texto'];

/** Casillas del tablero (tenues) y la casilla quitada. */
export function tablero({ n, lado }, { f, c }) {
  const ns = [];
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++)
    if (!(i === f && j === c)) ns.push({ k: `t${i},${j}`, t: 'rect', a: { x: r1(X + j * lado + 1), y: r1(Y + i * lado + 1), width: r1(lado - 2), height: r1(lado - 2), rx: 2 }, c: 'muy-tenue' });
  ns.push({ k: 'hueco', t: 'rect', a: { x: r1(X + c * lado + 1), y: r1(Y + f * lado + 1), width: r1(lado - 2), height: r1(lado - 2), rx: 2 }, c: 'ambar', hueco: true });
  return ns;
}
/** Las 3 casillas de una pieza dibujadas como una sola L: sin hueco entre casillas de la misma pieza. */
function pieza(id, lado, p, c, extra = {}) {
  const dentro = (i, j) => p.some(([a, b]) => a === i && b === j);
  return p.map(([i, j], n) => {
    const iz = dentro(i, j - 1) ? 0 : 2, de = dentro(i, j + 1) ? 0 : 2, ar = dentro(i - 1, j) ? 0 : 2, ab = dentro(i + 1, j) ? 0 : 2;
    return { k: `${id}:${n}`, t: 'rect', a: { x: r1(X + j * lado + iz), y: r1(Y + i * lado + ar), width: r1(lado - iz - de), height: r1(lado - ar - ab) }, c, ...extra };
  });
}

/** Colores para las piezas de modo que dos piezas que se tocan nunca compartan color (la central va en ámbar). */
export function colorear(piezas) {
  const de = new Map();
  piezas.forEach((p, i) => p.forEach(([a, b]) => de.set(`${a},${b}`, i)));
  const colores = [];
  piezas.forEach((p, i) => {
    if (i === 0) { colores.push('ambar'); return; }
    const vecinos = new Set();
    for (const [a, b] of p) for (const [da, db] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const v = de.get(`${a + da},${b + db}`);
      if (v !== undefined && v !== i && v < i) vecinos.add(colores[v]);
    }
    colores.push(COLORES.find((c) => !vecinos.has(c)) ?? 'texto');
  });
  return colores;
}

export default escenaPorCapas({
  entradas: ENTRADAS,
  validar: validarCasilla,
  preparar({ k, fila, col }) {
    const n = 2 ** k, lado = LADO / n, m = n / 2;
    const piezas = teselar(k, fila, col);
    return { n, lado, m, piezas, central: piezas[0], colores: colorear(piezas) };
  },
  alto: Y + LADO + 64,
  capas: [
    (ctx) => [
      ...tablero(ctx, { f: ctx.fila, c: ctx.col }),
      rotulo('tit', X, 28, `P(k): 2^k × 2^k sin una casilla se cubre con piezas L · k = ${ctx.k}`, 'texto'),
    ],
    () => {
      // el caso base, a la derecha: 2 × 2 sin una casilla es exactamente una L
      const x0 = 350, y0 = 80, l = 36;
      return [
        rotulo('b:t', x0, y0 - 14, 'base k = 1: 2 × 2 sin una casilla', 'texto'),
        ...[[0, 0], [0, 1], [1, 0]].map(([i, j]) => ({ k: `b${i}${j}`, t: 'rect', a: { x: x0 + j * l + 2, y: y0 + i * l + 2, width: l - 4, height: l - 4, rx: 3 }, c: 'verde' })),
        { k: 'b11', t: 'rect', a: { x: x0 + l + 2, y: y0 + l + 2, width: l - 4, height: l - 4, rx: 3 }, c: 'ambar', hueco: true },
        rotulo('b:r', x0, y0 + 2 * l + 22, '= una pieza L ✓', 'verde'),
      ];
    },
    ({ m, lado }) => [
      { k: 'corteV', t: 'line', a: { x1: r1(X + m * lado), y1: Y - 6, x2: r1(X + m * lado), y2: Y + LADO + 6 }, c: 'violeta' },
      { k: 'corteH', t: 'line', a: { x1: X - 6, y1: r1(Y + m * lado), x2: X + LADO + 6, y2: r1(Y + m * lado) }, c: 'violeta' },
      rotulo('c:t', 350, 236, `cuatro cuadrantes de ${m} × ${m}`, 'violeta'),
    ],
    ({ m, lado, fila, col }) => {
      const qf = fila >= m ? 1 : 0, qc = col >= m ? 1 : 0;
      return [
        { k: 'q:hueco', t: 'rect', a: { x: r1(X + qc * m * lado + 3), y: r1(Y + qf * m * lado + 3), width: r1(m * lado - 6), height: r1(m * lado - 6), rx: 6 }, c: 'ambar', hueco: true },
        rotulo('q:t', 350, 260, 'el de la casilla quitada: caso k − 1', 'ambar'),
      ];
    },
    ({ central, lado }) => [
      ...pieza('L0', lado, central, 'ambar'),
      rotulo('L:t', 350, 284, 'L central: una casilla de cada completo', 'ambar'),
    ],
    ({ m, lado, fila, col }) => {
      const qf = fila >= m ? 1 : 0, qc = col >= m ? 1 : 0;
      return [
        ...[[0, 0], [0, 1], [1, 0], [1, 1]].filter(([a, b]) => a !== qf || b !== qc).map(([a, b]) =>
          ({ k: `q${a}${b}`, t: 'rect', a: { x: r1(X + b * m * lado + 3), y: r1(Y + a * m * lado + 3), width: r1(m * lado - 6), height: r1(m * lado - 6), rx: 6 }, c: 'violeta', hueco: true })),
        rotulo('q:t2', 350, 308, 'los cuatro: 2^(k−1) sin una casilla', 'violeta'),
      ];
    },
    ({ piezas, lado, colores }) => [
      ...['q00', 'q01', 'q10', 'q11', 'q:hueco'].map((k) => ({ k, quitar: true })),
      ...piezas.slice(1).flatMap((p, i) => pieza(`L${i + 1}`, lado, p, colores[i + 1], { orden: Math.min(i, 30) * 0.1 })),
      rotulo('fin', 350, 332, `cubierto: ${piezas.length} piezas L ✓`, 'verde'),
    ],
  ],
});
