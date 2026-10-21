// El signo no cambia el mcd: los saltos de d caen en a y en −a (hacia la izquierda), y en b y −b.
import { escenaPorCapas, conPuentes, carril, rotulo, num, ANCHO } from '../comun.js';
import { recta, punto, saltos, conjunto } from '../primitivas.js';
import { planRecta } from '../../motor/escala.js';
import { divisores, mcd } from '../../motor/aritmetica.js';

const YA = 70, YB = 120, EJE = 175;
const ambosLados = (id, p, y, d, v, c) => [
  ...carril(id, p, y, { salto: d, n: Math.abs(v) / d, c, etiqueta: `d = ${d}` }),
  ...saltos(`${id}-`, p, { desde: 0, salto: d, n: -Math.abs(v) / d, y, c, alturaMax: 12, numerar: false }),
];

const ALTO0 = () => EJE + 56;

export default escenaPorCapas({
  entradas: [
    { id: 'a', etiqueta: 'a', valor: 12, min: -120, max: 120 },
    { id: 'b', etiqueta: 'b', valor: 18, min: -120, max: 120 },
  ],
  validar: ({ a, b }) => (a === 0 && b === 0 ? 'a y b no pueden ser los dos 0' : null),
  preparar({ a, b }) {
    const M = Math.max(Math.abs(a), Math.abs(b));
    return { d: mcd(a, b), p: planRecta({ min: -M * 1.08 - 1, max: M * 1.08 + 1, ancho: ANCHO }) };
  },
  alto: (c) => ALTO0(c) + 26,
  base: ({ p }) => recta('eje', p, EJE),
  capas: conPuentes([
    ({ a, d, p }) => [
      ...punto('pa', p, Math.abs(a), EJE, { c: 'ciruela', etiqueta: a >= 0 ? `a = ${a}` : `−a = ${-a}` }),
      ...punto('pna', p, -Math.abs(a), EJE, { c: 'ciruela', etiqueta: a >= 0 ? `−a = ${-a}` : `a = ${a}` }),
      ...ambosLados('la', p, YA, d, a, 'cian'),
    ],
    ({ a }) => (a === 0
      ? [rotulo('Da:n', 24, 24, 'a = 0: todo entero distinto de 0 divide a 0 = −0', 'texto')]
      : conjunto('Da', { x: 24, y: 24, nombre: `D(${Math.abs(a)}) = D(${num(-Math.abs(a))})`, elementos: divisores(a).map(String), c: 'cian' })),
    ({ b, d, p }) => [
      ...punto('pb', p, Math.abs(b), EJE, { c: 'ciruela', etiqueta: b >= 0 ? `b = ${b}` : `−b = ${-b}` }),
      ...punto('pnb', p, -Math.abs(b), EJE, { c: 'ciruela', etiqueta: b >= 0 ? `−b = ${-b}` : `b = ${b}` }),
      ...ambosLados('lb', p, YB, d, b, 'cian'),
    ],
    ({ d }) => [rotulo('res', ANCHO / 2, EJE + 44, `mcd(a,b) = mcd(−a,b) = mcd(a,−b) = mcd(−a,−b) = ${d}`, 'verde', 'middle')],
  ], {
    1: () => ['lo mismo aplicado a −a, porque −(−a) = a: D(a) = D(−a)', 'texto'],
    2: () => ['conjuntos iguales ⇒ máximos iguales', 'texto'],
  }, (c) => ALTO0(c) + 8),
});
