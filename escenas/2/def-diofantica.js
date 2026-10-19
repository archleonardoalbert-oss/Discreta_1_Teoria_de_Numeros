// Ecuación diofantina: x saltos de a y luego y saltos de b, terminando exactamente en c (si se puede).
import { escenaPorCapas, planPara, carril, rotulo, linea, nota, por, num, nSaltos, ANCHO } from '../comun.js';
import { recta, punto } from '../primitivas.js';
import { diofantica, mcd } from '../../motor/aritmetica.js';

const Y1 = 104, Y2 = 160, EJE = 222;

export default escenaPorCapas({
  entradas: [
    { id: 'a', etiqueta: 'a', valor: 3, min: -50, max: 50 },
    { id: 'b', etiqueta: 'b', valor: 5, min: -50, max: 50 },
    { id: 'c', etiqueta: 'c', valor: 7, min: -200, max: 200 },
  ],
  validar: ({ a, b }) => (a === 0 || b === 0 ? 'a y b deben ser distintos de 0' : null),
  preparar({ a, b, c }) {
    const s = diofantica(a, b, c);
    return { s, d: mcd(a, b), p: planPara(s ? [c, a * s.x0] : [c]) };
  },
  alto: EJE + 60,
  base: ({ p }) => recta('eje', p, EJE),
  capas: [
    ({ a, b, c }) => [nota('n0', 0, `${num(a)}x + ${num(b)}y = ${num(c)}:  x saltos de ${num(a)} y luego y saltos de ${num(b)}`)],
    ({ c, p }) => punto('pc', p, c, EJE, { c: 'ciruela', etiqueta: `c = ${num(c)}` }),
    ({ a, s, d, c, p }) => s
      ? [...carril('l1', p, Y1, { salto: a, n: s.x0, c: 'cian', etiqueta: `x = ${num(s.x0)}: ${nSaltos(s.x0, a)}` }), linea('g1', p.x(a * s.x0), Y1, p.x(a * s.x0), Y2)]
      : [nota('n1', 1, `ningún par de enteros sirve: mcd = ${d} y ${num(c)} no es múltiplo de ${d}`, 'ambar')],
    ({ a, b, c, s, p }) => s
      ? [
        ...carril('l2', p, Y2, { salto: b, n: s.y0, desde: a * s.x0, c: 'violeta', etiqueta: `y = ${num(s.y0)}: ${nSaltos(s.y0, b)}` }),
        linea('g2', p.x(c), Y2, p.x(c), EJE),
        rotulo('res', ANCHO / 2, EJE + 52, `(x, y) = (${num(s.x0)}, ${num(s.y0)}):  ${por(a, s.x0)} + ${por(b, s.y0)} = ${num(c)}`, 'verde', 'middle'),
      ]
      : [rotulo('res', ANCHO / 2, EJE + 52, 'no hay solución entera', 'ambar', 'middle')],
  ],
});
