// Primos relativos: los conjuntos de divisores D(a) y D(b) solo comparten el 1.
import { escenaPorCapas, planPara, rotulo, ANCHO } from '../comun.js';
import { recta, punto, conjunto } from '../primitivas.js';
import { divisores, mcd } from '../../motor/aritmetica.js';

const YA = 34, YB = 64, YI = 98, EJE = 168, X = 24;
const D = (id, nombre, ns, c, comunes = []) => {
  const nodos = conjunto(id, { x: X, y: id === 'Da' ? YA : YB, nombre, elementos: ns.map(String), c });
  return nodos.map((n) => (/:e\d+$/.test(n.k) && comunes.includes(Number(n.txt)) ? { ...n, c: 'verde' } : n));
};

export default escenaPorCapas({
  entradas: [
    { id: 'a', etiqueta: 'a', valor: 8, min: 1, max: 60 },
    { id: 'b', etiqueta: 'b', valor: 15, min: 1, max: 60 },
  ],
  preparar: ({ a, b }) => { const d = mcd(a, b); return { d, comunes: divisores(d), p: planPara([a, b]) }; },
  alto: EJE + 54,
  base: ({ p }) => recta('eje', p, EJE),
  capas: [
    ({ a, b, p }) => [
      ...punto('pa', p, a, EJE, { c: 'ciruela', etiqueta: `a = ${a}` }),
      ...punto('pb', p, b, EJE, { c: 'ciruela', etiqueta: `b = ${b}` }),
    ],
    ({ a }) => D('Da', `D(${a})`, divisores(a), 'cian'),
    ({ b }) => D('Db', `D(${b})`, divisores(b), 'cian'),
    ({ a, b, d, comunes, p }) => [
      ...D('Da', `D(${a})`, divisores(a), 'cian', comunes), ...D('Db', `D(${b})`, divisores(b), 'cian', comunes),
      ...conjunto('Dab', { x: X, y: YI, nombre: `D(${a}) ∩ D(${b})`, elementos: comunes.map(String), c: d === 1 ? 'verde' : 'ambar' }),
      d === 1
        ? rotulo('res', ANCHO / 2, EJE + 46, `mcd = 1: ${a} y ${b} son primos relativos`, 'verde', 'middle')
        : rotulo('res', ANCHO / 2, EJE + 46, `mcd = ${d} ≠ 1: ${a} y ${b} no son primos relativos`, 'ambar', 'middle'),
    ],
  ],
});
