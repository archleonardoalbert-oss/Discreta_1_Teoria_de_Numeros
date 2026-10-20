// Propiedad 6: ac − bd como escuadra. El rectángulo a × c (a columnas, c filas) contiene al b × d (abajo a la
// izquierda); lo que sobra se parte en una tira (a − b) × c y otra b × (c − d). Sus anchuras a − b y c − d son
// múltiplos de n: las tiras se cortan en bloques de n.
import { escenaPorCapas, rotulo, linea, num } from '../comun.js';
import { r1 } from '../../motor/escala.js';

const X = 120, Y = 70;

export default escenaPorCapas({
  entradas: [
    { id: 'n', etiqueta: 'n', valor: 3, min: 2, max: 6 }, { id: 'a', etiqueta: 'a', valor: 7, min: 2, max: 14 },
    { id: 'b', etiqueta: 'b', valor: 4, min: 1, max: 13 }, { id: 'c', etiqueta: 'c', valor: 8, min: 2, max: 14 },
    { id: 'd', etiqueta: 'd', valor: 2, min: 1, max: 13 },
  ],
  validar: ({ n, a, b, c, d }) => (a <= b || c <= d ? 'para el dibujo: a > b > 0 y c > d > 0'
    : (a - b) % n ? `${a} ≢ ${b} (mod ${n})` : (c - d) % n ? `${c} ≢ ${d} (mod ${n})` : null),
  preparar({ a, c }) {
    const lado = Math.min(22, 300 / c, 300 / a);
    const celda = (i, j, col) => ({ k: `c${i}-${j}`, t: 'rect', a: { x: r1(X + i * lado), y: r1(Y + j * lado), width: r1(lado - 2), height: r1(lado - 2), rx: 2 }, c: col });
    return { lado, celda };
  },
  alto: ({ c, lado }) => Math.max(Y + c * lado + 120, 300),
  capas: [
    ({ a, b, c, d, lado, celda }) => {
      // celda (i, j): columna i de 0…a−1, fila j de 0…c−1 (la fila 0 arriba); b × d ocupa abajo a la izquierda
      const enBD = (i, j) => i < b && j >= c - d;
      return [
        ...Array.from({ length: a * c }, (_, t) => { const i = t % a, j = Math.floor(t / a); return celda(i, j, enBD(i, j) ? 'violeta' : 'ambar'); }),
        rotulo('la', X + (a * lado) / 2, Y - 30, `a = ${a}`, 'texto', 'middle'),
        rotulo('lc', X + a * lado + 10, Y + (c * lado) / 2 + 4, `c = ${c}`, 'texto'),
        rotulo('lbd', X + (b * lado) / 2, Y + c * lado + 18, `b·d = ${b}·${d}`, 'violeta', 'middle'),
        rotulo('n0', 24, Y + c * lado + 50, `ac − bd = ${a * c} − ${b * d} = ${a * c - b * d}: la escuadra ámbar`, 'ambar'),
      ];
    },
    ({ a, b, c, d, lado, celda }) => [
      ...Array.from({ length: a * c }, (_, t) => { const i = t % a, j = Math.floor(t / a); return i >= b ? celda(i, j, 'ambar') : j < c - d ? celda(i, j, 'cian') : null; }).filter(Boolean),
      rotulo('t1', X + ((a + b) * lado) / 2, Y - 10, `a − b = ${a - b}`, 'ambar', 'middle'),
      rotulo('t2', X - 10, Y + ((c - d) * lado) / 2 + 4, `c − d = ${c - d}`, 'cian', 'end'),
      rotulo('n1', 24, Y + c * lado + 72, `= c(a − b) + b(c − d) = ${c}·${a - b} + ${b}·${c - d}`, 'texto'),
    ],
    ({ a, b, c, d, n, lado }) => [
      // cortes cada n: columnas en la tira derecha, filas en la tira de arriba
      ...Array.from({ length: (a - b) / n - 1 }, (_, i) => ({ ...linea(`v${i}`, X + (b + (i + 1) * n) * lado - 1, Y - 3, X + (b + (i + 1) * n) * lado - 1, Y + c * lado + 1, 'verde'), ancho: 3 })),
      ...Array.from({ length: (c - d) / n - 1 }, (_, j) => ({ ...linea(`h${j}`, X - 3, Y + (j + 1) * n * lado - 1, X + b * lado - 1, Y + (j + 1) * n * lado - 1, 'verde'), ancho: 3 })),
      { ...linea('vb', X + b * lado - 1, Y - 3, X + b * lado - 1, Y + c * lado + 1, 'verde'), ancho: 3 },
      { ...linea('hb', X - 3, Y + (c - d) * lado - 1, X + b * lado - 1, Y + (c - d) * lado - 1, 'verde'), ancho: 3 },
      rotulo('n2', 24, Y + c * lado + 94, `bloques de anchura n = ${n}:  ac − bd = ${num(a * c - b * d)} = ${n}·${(a * c - b * d) / n}`, 'verde'),
    ],
  ],
});
