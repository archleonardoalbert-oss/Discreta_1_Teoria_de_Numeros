// mcd(a, b) = mcd(b, r): un salto x que cae en a y en b también cae en r = a − q·b, y al revés.
import { escenaPorCapas, planPara, carril, rotulo, linea, nota, num, ANCHO } from '../comun.js';
import { recta, punto, llave } from '../primitivas.js';
import { division, mcd } from '../../motor/aritmetica.js';

const YX = 150, YQ = 204, EJE = 262;

export default escenaPorCapas({
  entradas: [
    { id: 'a', etiqueta: 'a', valor: 40, min: -200, max: 200 },
    { id: 'b', etiqueta: 'b', valor: 12, min: 1, max: 100 },
  ],
  preparar({ a, b }) {
    const { q, r } = division(a, b), x = mcd(a, b);
    return { q, r, x, g: mcd(b, r), p: planPara([a, b, r, q * b]) };
  },
  alto: EJE + 84,
  base: ({ p }) => recta('eje', p, EJE),
  capas: [
    ({ a, b, x, p }) => [
      ...punto('pa', p, a, EJE, { c: 'ciruela', etiqueta: `a = ${num(a)}` }),
      ...punto('pb', p, b, EJE, { c: 'ciruela', etiqueta: `b = ${b}` }),
      ...carril('lx', p, YX, { salto: x, n: Math.floor(p.max / x), c: 'cian', etiqueta: `x = ${x}:  a = ${x}·${num(a / x)},  b = ${x}·${b / x}` }),
      ...carril('lx-', p, YX, { salto: x, n: -Math.floor(-p.min / x), c: 'cian' }).filter((n) => n.t === 'path'),
      nota('n0', 0, `si x | a y x | b:  a = x·y₁ = ${x}·${num(a / x)},  b = x·y₂ = ${x}·${b / x}`),
    ],
    ({ a, b, q, r, x, p }) => [
      ...carril('lq', p, YQ, { salto: b, n: q, c: 'violeta', etiqueta: `a = q·b + r:  ${num(a)} = ${num(q)}·${b} + ${r}` }),
      ...llave('lr', p, q * b, a, YQ + 6, `r = ${r}`, 'ambar'),
      ...punto('pr', p, r, EJE, { c: 'ambar', etiqueta: `r = ${r}` }),
      linea('gr', p.x(r), YX, p.x(r), EJE),
      nota('n1', 1, `r = x(y₁ − q·y₂) = ${x}·(${num(a / x)} − ${num(q)}·${b / x}) = ${r}  ⇒  x | r`),
    ],
    ({ b, r, x }) => [nota('n2', 2, `si x | b y x | r:  b = x·y₂ = ${x}·${b / x},  r = x·y₃ = ${x}·${r / x}`)],
    ({ q, r, b, x, a }) => [nota('n3', 3, `a = x(q·y₂ + y₃) = ${x}·(${num(q)}·${b / x} + ${r / x}) = ${num(a)}  ⇒  x | a`)],
    ({ a, b, r, g }) => [rotulo('res', ANCHO / 2, EJE + 76, `mismos divisores comunes:  mcd(${num(a)}, ${b}) = mcd(${b}, ${r}) = ${g}`, 'verde', 'middle')],
  ],
});
