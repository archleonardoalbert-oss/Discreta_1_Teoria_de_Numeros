// n compuesto ⇔ n = a·b con 1 < a ≤ b < n. Los n cuadraditos forman un rectángulo que no es una fila: primero con
// el divisor grande como número de filas; luego el rectángulo gira (cada cuadradito viaja a su sitio traspuesto)
// para que el lado corto sea a. Al final, todos los rectángulos posibles de n.
import { escenaPorCapas, rotulo, nota, ANCHO } from '../comun.js';
import { conjunto } from '../primitivas.js';
import { esPrimo } from '../../motor/primos.js';
import { divisores } from '../../motor/aritmetica.js';
import { r1 } from '../../motor/escala.js';

const X = 120, Y = 176;

export default escenaPorCapas({
  entradas: [{ id: 'n', etiqueta: 'n', valor: 18, min: 4, max: 60 }],
  validar: ({ n }) => (esPrimo(n) ? `${n} es primo: elige un compuesto` : null),
  preparar({ n }) {
    const D = divisores(n), chico = D[1], grande = n / chico;          // chico = menor divisor > 1
    const lado = Math.min(24, 300 / grande, (ANCHO - X - 80) / grande);
    const pares = D.filter((d) => d > 1 && d * d <= n).map((d) => `${d}·${n / d}`);
    // celda i en un rectángulo de f filas y c columnas (se llena por filas)
    const celdas = (f, c, color, traspuesto) => Array.from({ length: n }, (_, i) => {
      const fi = Math.floor(i / grande), co = i % grande;         // posición en la forma grande × chico
      const [r, k] = traspuesto ? [fi, co] : [co, fi];
      return { k: `c${i}`, t: 'rect', a: { x: r1(X + k * lado), y: r1(Y + r * lado), width: r1(lado - 2), height: r1(lado - 2), rx: 2 }, c: color };
    });
    return { D, chico, grande, lado, pares, celdas };
  },
  alto: ({ grande, lado }) => Y + grande * lado + 50,
  base: ({ n, D }) => conjunto('D', { x: 24, y: 34, nombre: `D(${n})`, elementos: D.map(String), c: 'cian' }),
  capas: [
    ({ n, grande, chico, lado, celdas }) => [
      ...celdas(grande, chico, 'cian', false),
      rotulo('lf', X - 10, Y + (grande * lado) / 2 + 4, `${grande} filas`, 'ambar', 'end'),
      nota('n0', 2, `${n} compuesto: tiene un divisor ${grande} con 1 < ${grande} < ${n}`, 'ambar'),
    ],
    ({ n, grande, chico, lado }) => [
      rotulo('lc', X + (chico * lado) / 2, Y - 10, `${chico}`, 'cian', 'middle'),
      nota('n1', 3, `${n} = ${grande}·${chico}: el otro lado, ${chico}, tampoco es 1 ni ${n}`, 'texto'),
    ],
    ({ n, grande, chico, lado, celdas }) => [
      // el rectángulo gira: el lado corto pasa a ser el de las filas
      ...celdas(chico, grande, 'cian', true),
      rotulo('lf', X - 10, Y + (chico * lado) / 2 + 4, `a = ${chico}`, 'verde', 'end'),
      rotulo('lc', X + (grande * lado) / 2, Y - 10, `b = ${grande}`, 'verde', 'middle'),
      nota('n2', 4, `girando: ${n} = a·b con 1 < a = ${chico} ≤ b = ${grande} < ${n}`, 'verde'),
    ],
    ({ n, pares }) => [
      nota('n3', 2, `todos los rectángulos que no son fila: ${n} = ${pares.join(' = ')}`, 'texto'),
      nota('n4', 3, 'recíproco: un lado a con 1 < a < n es un divisor ≠ 1, n', 'texto'),
      nota('n5', 4, 'luego n no es primo: es compuesto', 'verde'),
    ].concat([{ k: 'n0', quitar: true }, { k: 'n1', quitar: true }, { k: 'n2', quitar: true }]),
  ],
});
