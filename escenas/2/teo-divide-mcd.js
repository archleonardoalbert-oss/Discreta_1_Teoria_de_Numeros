// Si a | b, los saltos de |a| ya caen en b: |a| es común, y ningún salto mayor cae en a.
import { escenaPorCapas, planPara, carril, rotulo, ANCHO } from '../comun.js';
import { recta, punto, saltos } from '../primitivas.js';
import { divisores } from '../../motor/aritmetica.js';

const Y1 = 64, Y2 = 112, EJE = 170;

export default escenaPorCapas({
  entradas: [
    { id: 'a', etiqueta: 'a', valor: 6, min: -60, max: 60 },
    { id: 'b', etiqueta: 'b', valor: 18, min: -240, max: 240 },
  ],
  validar: ({ a, b }) => (a === 0 ? 'a debe ser distinto de 0' : b % a !== 0 ? 'el teorema pide que a divida a b (prueba con b múltiplo de a)' : null),
  preparar({ a, b }) {
    const A = Math.abs(a);
    const s = (b !== 0 && divisores(b).find((x) => x > A)) || A + 1;
    return { A, s, p: planPara([a, b, A, s * Math.sign(a)]) };
  },
  alto: EJE + 50,
  base: ({ p }) => recta('eje', p, EJE),
  capas: [
    ({ a, b, A, p }) => [
      ...punto('pa', p, a, EJE, { c: 'ciruela', etiqueta: `a = ${a}` }),
      ...punto('pb', p, b, EJE, { c: 'ciruela', etiqueta: `b = ${b}` }),
      ...carril('l1', p, Y1, { salto: A, n: b / A, c: 'cian', etiqueta: `salto |a| = ${A}: cae en a y en b` }),
      ...saltos('l1a', p, { desde: 0, salto: A, n: Math.sign(a), y: Y1, c: 'cian', alturaMax: 12, numerar: false }),
    ],
    ({ a, A, s, p }) => [
      ...carril('l2', p, Y2, { salto: s, n: Math.sign(a), c: 'ambar', etiqueta: `salto ${s} > |a|: se pasa de a` }),
    ],
    ({ a, b, A }) => [rotulo('res', ANCHO / 2, 30, `mcd(${a}, ${b}) = |a| = ${A}`, 'verde', 'middle')],
    ({ a, A }) => [rotulo('cero', ANCHO / 2, EJE + 44, `y si b = 0: 0 = a·0, así que a | 0 y mcd(${a}, 0) = ${A}`, 'verde', 'middle')],
  ],
});
