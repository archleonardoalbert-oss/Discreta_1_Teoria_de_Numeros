// Primos relativos: el único divisor positivo que comparten es el 1.
import { escenaPorCapas, planPara, carril, rotulo, ANCHO } from '../comun.js';
import { recta, punto } from '../primitivas.js';
import { divisores, mcd } from '../../motor/aritmetica.js';

const YA = 34, YB = 64, YL = 112, EJE = 170, X0 = 190, DX = 38;
const fila = (id, n, y, comunes) => [
  rotulo(`${id}:t`, 24, y, `divisores de ${n}:`, 'texto'),
  ...divisores(n).map((d, i) => rotulo(`${id}:${d}`, X0 + i * DX, y, String(d), comunes?.includes(d) ? 'verde' : 'cian', 'middle')),
];

export default escenaPorCapas({
  entradas: [
    { id: 'a', etiqueta: 'a', valor: 8, min: 1, max: 60 },
    { id: 'b', etiqueta: 'b', valor: 15, min: 1, max: 60 },
  ],
  preparar: ({ a, b }) => ({ d: mcd(a, b), p: planPara([a, b]) }),
  alto: EJE + 54,
  base: ({ p }) => recta('eje', p, EJE),
  capas: [
    ({ a, b, p }) => [
      ...punto('pa', p, a, EJE, { c: 'ciruela', etiqueta: `a = ${a}` }),
      ...punto('pb', p, b, EJE, { c: 'ciruela', etiqueta: `b = ${b}` }),
    ],
    ({ a }) => fila('da', a, YA),
    ({ b }) => fila('db', b, YB),
    ({ a, b, d, p }) => {
      const comunes = divisores(d);
      return [
        ...fila('da', a, YA, comunes), ...fila('db', b, YB, comunes),
        ...carril('lc', p, YL, { salto: d, n: Math.floor(Math.max(a, b) / d), c: d === 1 ? 'verde' : 'ambar', etiqueta: `salto común más largo: ${d}` }),
        d === 1
          ? rotulo('res', ANCHO / 2, EJE + 46, `mcd = 1: ${a} y ${b} son primos relativos`, 'verde', 'middle')
          : rotulo('res', ANCHO / 2, EJE + 46, `mcd = ${d} ≠ 1: ${a} y ${b} no son primos relativos`, 'ambar', 'middle'),
      ];
    },
  ],
});
