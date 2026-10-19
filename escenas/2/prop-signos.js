// El signo no cambia el mcd: los saltos de d caen en a y en −a (hacia la izquierda), y en b y −b.
import { escenaPorCapas, carril, rotulo, ANCHO } from '../comun.js';
import { recta, punto, saltos } from '../primitivas.js';
import { planRecta } from '../../motor/escala.js';
import { divisores, mcd } from '../../motor/aritmetica.js';

const YA = 70, YB = 120, EJE = 175;
const lista = (n) => { const ds = divisores(n); return ds.length > 10 ? `${ds.slice(0, 9).join(', ')}, …, ${n}` : ds.join(', '); };
const ambosLados = (id, p, y, d, v, c) => [
  ...carril(id, p, y, { salto: d, n: Math.abs(v) / d, c, etiqueta: `d = ${d}` }),
  ...saltos(`${id}-`, p, { desde: 0, salto: d, n: -Math.abs(v) / d, y, c, alturaMax: 12, numerar: false }),
];

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
  alto: EJE + 50,
  base: ({ p }) => recta('eje', p, EJE),
  capas: [
    ({ a, d, p }) => [
      ...punto('pa', p, Math.abs(a), EJE, { c: 'ciruela', etiqueta: a >= 0 ? `a = ${a}` : `−a = ${-a}` }),
      ...punto('pna', p, -Math.abs(a), EJE, { c: 'ciruela', etiqueta: a >= 0 ? `−a = ${-a}` : `a = ${a}` }),
      ...ambosLados('la', p, YA, d, a, 'cian'),
    ],
    ({ a }) => [rotulo('lista', 24, 24, `divisores de a = divisores de −a: ${a === 0 ? 'todos' : lista(a)}`, 'texto')],
    ({ b, d, p }) => [
      ...punto('pb', p, Math.abs(b), EJE, { c: 'ciruela', etiqueta: b >= 0 ? `b = ${b}` : `−b = ${-b}` }),
      ...punto('pnb', p, -Math.abs(b), EJE, { c: 'ciruela', etiqueta: b >= 0 ? `−b = ${-b}` : `b = ${b}` }),
      ...ambosLados('lb', p, YB, d, b, 'cian'),
    ],
    ({ d }) => [rotulo('res', ANCHO / 2, 46, `mcd(a,b) = mcd(−a,b) = mcd(a,−b) = mcd(−a,−b) = ${d}`, 'verde', 'middle')],
  ],
});
