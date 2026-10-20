// n compuesto ⇔ n = a·b con 1 < a ≤ b < n. Los n cuadraditos forman un rectángulo que no es una fila: primero con
// el divisor grande como número de filas; luego el rectángulo gira (cada cuadradito viaja a su sitio traspuesto)
// para que el lado corto sea a. Al final, todos los rectángulos posibles de n.
import { escenaPorCapas, rotulo, nota, ANCHO } from '../comun.js';
import { conjunto } from '../primitivas.js';
import { esPrimo } from '../../motor/primos.js';
import { divisores } from '../../motor/aritmetica.js';
import { r1 } from '../../motor/escala.js';

const X = 120, Y = 250;

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
    ({ n, grande, D }) => [
      nota('n0', 2, `${n} compuesto: tiene un divisor positivo distinto de 1 y de ${n}, por ejemplo a = ${grande}`, 'ambar'),
    ],
    ({ n, grande, chico, lado, celdas }) => [
      ...celdas(grande, chico, 'cian', false),
      rotulo('lf', X - 10, Y + (grande * lado) / 2 + 4, `${grande} filas`, 'ambar', 'end'),
      nota('n1', 3, `a | n ⇒ a ≤ n (teorema anterior); a ≠ 1, a ≠ n ⇒ 1 < ${grande} < ${n}`, 'texto'),
    ],
    ({ n, grande, chico, lado }) => [
      rotulo('lc', X + (chico * lado) / 2, Y - 10, `${chico}`, 'cian', 'middle'),
      nota('n2', 4, `n = a·b: b = ${chico} columnas, b > 0 y b | n ⇒ b ≤ n`, 'texto'),
    ],
    ({ n, chico }) => [nota('n3', 5, `b ≠ 1 (si no, a = n) y b ≠ n (si no, a = 1): 1 < ${chico} < ${n}`, 'texto')],
    ({ n, grande, chico, lado, celdas }) => [
      ...celdas(chico, grande, 'cian', true),
      rotulo('lf', X - 10, Y + (chico * lado) / 2 + 4, `a = ${chico}`, 'verde', 'end'),
      rotulo('lc', X + (grande * lado) / 2, Y - 10, `b = ${grande}`, 'verde', 'middle'),
      nota('n4', 6, `se giran (intercambian) los lados: ${n} = a·b con 1 < a = ${chico} ≤ b = ${grande} < ${n}`, 'verde'),
    ],
    ({ n, pares }) => [nota('n5', 7, `recíproco: ${n} = ${pares.join(' = ')} da un divisor a con 1 < a < n`, 'texto')],
    () => [nota('n6', 8, 'divisor distinto de 1 y de n ⇒ no es primo; como n > 1, es compuesto', 'verde')],
  ],
});
