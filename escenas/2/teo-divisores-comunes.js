// Divisores comunes = divisores del mcd: los saltos comunes caen en d, y los que caen en d caen en a y b.
import { escenaPorCapas, planPara, carril, rotulo, linea, nota, por, ANCHO } from '../comun.js';
import { recta, punto, conjunto } from '../primitivas.js';
import { divisores, combinacionMcd } from '../../motor/aritmetica.js';

const MAX = 4, DY = 46, Y0 = 92;

export default escenaPorCapas({
  entradas: [
    { id: 'a', etiqueta: 'a', valor: 12, min: 1, max: 120 },
    { id: 'b', etiqueta: 'b', valor: 18, min: 1, max: 120 },
  ],
  preparar({ a, b }) {
    const { d, coefs } = combinacionMcd([a, b]);
    const todos = divisores(d), mostrados = todos.slice(-MAX);
    return { d, coefs, todos, mostrados, p: planPara([a, b]), ejeY: Y0 + mostrados.length * DY };
  },
  alto: ({ ejeY }) => ejeY + 120,
  base: ({ p, ejeY }) => recta('eje', p, ejeY),
  capas: [
    ({ a, b, d, coefs, p, ejeY }) => [
      ...punto('pa', p, a, ejeY, { c: 'ciruela', etiqueta: `a = ${a}` }),
      ...punto('pb', p, b, ejeY, { c: 'ciruela', etiqueta: `b = ${b}` }),
      ...punto('pd', p, d, ejeY, { c: 'verde', etiqueta: `d = ${d}` }),
      linea('gd', p.x(d), Y0 - 30, p.x(d), ejeY),
      nota('n0', 0, `d = mcd(${a}, ${b}) = ${por(a, coefs[0])} + ${por(b, coefs[1])} = ${d}`),
    ],
    ({ a, b, d, mostrados, ejeY, p }) => [
      ...mostrados.flatMap((c, i) => carril(`c${c}`, p, Y0 + i * DY, { salto: c, n: d / c, c: 'cian', etiqueta: `c = ${c}: c | a y c | b  ⇒  c | d` })),
      nota('n1', 1, 'cada salto común cae en d (d es combinación de a y b)'),
      ...conjunto('Di', { x: 24, y: ejeY + 48, nombre: `D(${a}) ∩ D(${b})`, elementos: divisores(a).filter((x) => b % x === 0).map(String), c: 'cian' }),
    ],
    ({ a, b, d, mostrados, ejeY, p }) => [
      ...mostrados.flatMap((c, i) => carril(`c${c}`, p, Y0 + i * DY, { salto: c, n: Math.max(a, b) / c, c: 'cian', etiqueta: `c = ${c}: c | d  ⇒  c | a y c | b` })),
      linea('ga', p.x(a), Y0 - 30, p.x(a), Y0 + mostrados.length * DY),
      linea('gb', p.x(b), Y0 - 30, p.x(b), Y0 + mostrados.length * DY),
      ...conjunto('Dd', { x: 24, y: ejeY + 74, nombre: `D(${d})`, elementos: divisores(d).map(String), c: 'cian' }),
    ],
    ({ a, b, d, todos, ejeY }) => [
      ...conjunto('Dd', { x: 24, y: ejeY + 74, nombre: `D(${d})`, elementos: todos.map(String), c: 'verde' }),
      rotulo('res', ANCHO / 2, ejeY + 108, `D(${a}) ∩ D(${b}) = D(${d}): son el mismo conjunto`, 'verde', 'middle'),
    ],
  ],
});
