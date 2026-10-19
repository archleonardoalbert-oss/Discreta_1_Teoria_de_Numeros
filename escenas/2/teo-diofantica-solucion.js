// ax + by = c tiene solución ⇔ (a,b) | c. Con saltos de a y b solo se aterriza en múltiplos de d;
// y a c = k·d se llega repitiendo k veces la combinación que da d.
import { escenaPorCapas, planPara, carril, rotulo, linea, nota, por, num, nSaltos, ANCHO } from '../comun.js';
import { recta, punto, llave } from '../primitivas.js';
import { combinacionMcd } from '../../motor/aritmetica.js';

const Y1 = 166, Y2 = 214, EJE = 276, MAX_PUNTOS = 60;

export default escenaPorCapas({
  entradas: [
    { id: 'a', etiqueta: 'a', valor: 6, min: -60, max: 60 },
    { id: 'b', etiqueta: 'b', valor: 10, min: -60, max: 60 },
    { id: 'c', etiqueta: 'c', valor: 8, min: -300, max: 300 },
  ],
  validar: ({ a, b }) => (a === 0 || b === 0 ? 'a y b deben ser distintos de 0' : null),
  preparar({ a, b, c }) {
    const { d, coefs: [x0, y0] } = combinacionMcd([a, b]);
    const k = c % d === 0 ? c / d : null;
    const ext = k === null ? [c] : [c, a * x0, a * x0 * k, d];
    return { d, x0, y0, k, p: planPara(ext) };
  },
  alto: EJE + 92,
  base: ({ p }) => recta('eje', p, EJE),
  capas: [
    ({ c, d, p }) => {
      const puntos = [];
      for (let m = Math.ceil(p.min / d) * d; m <= p.max && puntos.length < MAX_PUNTOS; m += d)
        puntos.push({ k: `m${m}`, t: 'circle', a: { cx: p.x(m), cy: EJE - 40, r: 3 }, c: 'violeta' });
      return [
        ...puntos, rotulo('m:et', p.x(p.min), EJE - 50, `alcanzables con saltos de a y b: múltiplos de d = ${d}`, 'violeta'),
        ...punto('pc', p, c, EJE, { c: 'ciruela', etiqueta: `c = ${num(c)}` }),
        nota('n0', 0, '⇒) si ax + by = c tiene solución:'),
      ];
    },
    ({ a, b, c, d, k }) => [nota('n1', 1, `d = (${num(a)}, ${num(b)}) = ${d} divide a ax + by  ⇒  ${k === null ? `pero ${d} ∤ ${num(c)}: no hay solución` : `${d} | ${num(c)}`}`, k === null ? 'ambar' : 'texto')],
    ({ c, d, k, p }) => k === null
      ? [nota('n2', 2, `⇐) no aplica: ${num(c)} no es múltiplo de ${d}`, 'tenue')]
      : [...llave('kd', p, 0, k * d, EJE + 28, `k = ${num(k)} pasos de d = ${d}`, 'violeta'), nota('n2', 2, `⇐) c = k·(a,b):  ${num(c)} = k·${d},  k = ${num(k)}`)],
    ({ a, b, d, x0, y0, k, p }) => k === null ? [] : [
      ...carril('l1', p, Y1, { salto: a, n: x0, c: 'cian', etiqueta: `x₀ = ${num(x0)}: ${nSaltos(x0, a)}` }),
      ...carril('l2', p, Y2, { salto: b, n: y0, desde: a * x0, c: 'cian', etiqueta: `y₀ = ${num(y0)}: ${nSaltos(y0, b)}` }),
      linea('g1', p.x(a * x0), Y1, p.x(a * x0), Y2),
      nota('n3', 3, `a·x₀ + b·y₀ = ${por(a, x0)} + ${por(b, y0)} = ${d}`),
    ],
    ({ a, b, d, x0, y0, k }) => k === null ? [] : [nota('n4', 4, `·k:  a·k·x₀ + b·k·y₀ = ${num(a)}·${num(k)}·${x0 < 0 ? `(${num(x0)})` : x0} + ${num(b)}·${num(k)}·${y0 < 0 ? `(${num(y0)})` : y0} = ${num(k * d)}`)],
    ({ a, b, c, x0, y0, k, p }) => k === null
      ? [rotulo('res', ANCHO / 2, EJE + 84, 'sin solución entera', 'ambar', 'middle')]
      : [
        ...carril('l1', p, Y1, { salto: a, n: x0 * k, c: 'verde', etiqueta: `x = k·x₀ = ${num(x0 * k)}: ${nSaltos(x0 * k, a)}` }),
        ...carril('l2', p, Y2, { salto: b, n: y0 * k, desde: a * x0 * k, c: 'verde', etiqueta: `y = k·y₀ = ${num(y0 * k)}: ${nSaltos(y0 * k, b)}` }),
        linea('g1', p.x(a * x0 * k), Y1, p.x(a * x0 * k), Y2),
        linea('g2', p.x(c), Y2, p.x(c), EJE),
        rotulo('res', ANCHO / 2, EJE + 84, `k = ${num(k)}:  ${por(a, x0 * k)} + ${por(b, y0 * k)} = ${num(c)}`, 'verde', 'middle'),
      ],
  ],
});
