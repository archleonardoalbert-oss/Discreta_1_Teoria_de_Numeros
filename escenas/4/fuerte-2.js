// Propiedad fuerte 2: a = kn + b. Los divisores comunes de (a, n) y de (n, b) son el mismo conjunto (números
// reales, ordenados); su máximo es el mismo.
import { escenaPorCapas, conPuentes, planPara, rotulo, nota, carril, num } from '../comun.js';
import { recta, punto, conjunto } from '../primitivas.js';
import { divisores, mcd } from '../../motor/aritmetica.js';

const YR = 380;

const ALTO0 = () => YR + 50;

export default escenaPorCapas({
  entradas: [{ id: 'n', etiqueta: 'n', valor: 12, min: 2, max: 40 }, { id: 'a', etiqueta: 'a', valor: 50, min: 1, max: 99 }, { id: 'b', etiqueta: 'b', valor: 14, min: 1, max: 99 }],
  validar: ({ n, a, b }) => ((a - b) % n ? `${a} ≢ ${b} (mod ${n})` : null),
  preparar({ n, a, b }) {
    const comunes = (x) => divisores(n).filter((d) => x % d === 0);
    return { plan: planPara([a, b]), k: (a - b) / n, Da: comunes(a), Db: comunes(b), g: mcd(a, n) };
  },
  alto: (c) => ALTO0(c) + 26,
  base: ({ plan, a, b }) => [...recta('R', plan, YR), ...punto('PA', plan, a, YR, { etiqueta: `a = ${a}` }), ...punto('PB', plan, b, YR, { c: 'cian', etiqueta: `b = ${b}` })],
  capas: conPuentes([
    ({ plan, a, b, n, k }) => [
      ...(k === 0 ? [] : carril('K', plan, YR - 70, { salto: Math.sign(k) * n, n: Math.abs(k), desde: b, c: 'violeta', etiqueta: `${Math.abs(k)} saltos de n = ${n}` })),
      nota('n0', 0, `a − b = ${num(a - b)} = ${num(k)}·${n}`, 'violeta'),
    ],
    ({ a, b, n, k, Da }) => [
      nota('n1', 1, `a = k·n + b = ${num(k)}·${n} + ${b}`, 'texto'),
      ...conjunto('A', { x: 24, y: 104, nombre: `divisores comunes de ${a} y ${n}`, elementos: Da.map(String), c: 'ciruela', señalado: Da.length - 1, etiquetaSeñalado: 'máximo' }),
    ],
    ({ a, b, n, Db, g }) => [
      ...conjunto('B', { x: 24, y: 176, nombre: `divisores comunes de ${n} y ${b}`, elementos: Db.map(String), c: 'cian', señalado: Db.length - 1, etiquetaSeñalado: 'máximo' }),
      nota('n2', 9, `el mismo conjunto: mcd(${a}, ${n}) = mcd(${n}, ${b}) = ${g}`, 'verde'),
    ],
  ], {
    1: () => ['divisor común de a y n ⇒ divide a b = a − kn;  de n y b ⇒ divide a a = kn + b', 'texto'],
  }, (c) => ALTO0(c) + 8),
});
