// a/d y b/d son primos relativos: en una regla donde cada marca vale d, ya no queda salto común mayor que 1.
import { escenaPorCapas, planPara, carril, rotulo, nota, por, ANCHO } from '../comun.js';
import { recta, punto, reglasDobles } from '../primitivas.js';
import { combinacionMcd } from '../../motor/aritmetica.js';

const EJE = 236;

export default escenaPorCapas({
  entradas: [
    { id: 'a', etiqueta: 'a', valor: 12, min: 1, max: 5000 },
    { id: 'b', etiqueta: 'b', valor: 18, min: 1, max: 5000 },
  ],
  preparar({ a, b }) {
    const { d, coefs } = combinacionMcd([a, b]);
    return { d, coefs, A: a / d, B: b / d, k: Math.max(a, b) / d, p: planPara([a, b]) };
  },
  alto: EJE + 60,
  base: ({ p }) => recta('eje', p, EJE),
  capas: [
    ({ a, b, d, coefs, p }) => [
      ...punto('pa', p, a, EJE, { c: 'ciruela', etiqueta: `a = ${a}` }),
      ...punto('pb', p, b, EJE, { c: 'ciruela', etiqueta: `b = ${b}` }),
      nota('n0', 0, `d = (${a}, ${b}) = ${por(a, coefs[0])} + ${por(b, coefs[1])} = ${d}`),
    ],
    ({ a, b, d, A, B, k, coefs, p }) => [
      ...reglasDobles('rd', p, { b: d, k, y: EJE, abajo: false }),
      rotulo('ua', p.x(a), EJE - 74, `a/d = ${A}`, 'violeta', 'middle'),
      rotulo('ub', p.x(b), EJE - 74, `b/d = ${B}`, 'violeta', 'middle'),
      nota('n1', 1, `regla nueva: 1 marca = ${d} unidades.  ${por(A, coefs[0])} + ${por(B, coefs[1])} = 1`),
    ],
    ({ A, B }) => [nota('n2', 2, `todo divisor común de ${A} y ${B} divide a 1`)],
    ({ A, B }) => [rotulo('res', ANCHO / 2, EJE + 52, `mcd(a/d, b/d) = mcd(${A}, ${B}) = 1: son primos relativos`, 'verde', 'middle')],
  ],
});
