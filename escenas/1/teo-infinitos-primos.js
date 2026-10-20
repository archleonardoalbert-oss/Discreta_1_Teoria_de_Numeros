// Infinitud de los primos. A = {p₁, …, p_k} supuesta (punteada) con P = p₁⋯p_k y m = P + 1. Una ventana de la recta
// alrededor de P: cada pᵢ tiene su serie de saltos que cae exactamente en P, y a m le sobra 1 en todas (resto 1).
// Un divisor primo q de m no está en A. Contraste: m no tiene por qué ser primo (30031 = 59·509).
import { escenaPorCapas, rotulo, carril, linea, elegir, ANCHO } from '../comun.js';
import { recta, conjunto } from '../primitivas.js';
import { factorizar, esPrimo } from '../../motor/primos.js';
import { planRecta } from '../../motor/escala.js';

const PRIMOS = [2, 3, 5, 7, 11, 13, 17];
const Y0 = 150, DY = 40;

export default escenaPorCapas({
  entradas: [{ id: 'k', etiqueta: 'k (cuántos primos)', valor: 6, min: 1, max: 7 }],
  preparar({ k }) {
    const A = PRIMOS.slice(0, k), P = A.reduce((s, p) => s * p, 1), m = P + 1;
    const W = 2 * A.at(-1) + 4, plan = planRecta({ min: Math.max(0, P - W) - 0.5, max: P + 2.5, ancho: ANCHO, margen: 110 });
    const YR = Y0 + A.length * DY + 10, q = factorizar(m)[0];
    return { A, P, m, plan, YR, q, fm: factorizar(m) };
  },
  alto: ({ YR }) => YR + 110,
  capas: [
    ({ A, P, m, plan, YR }) => [
      ...conjunto('A', { x: 24, y: 34, nombre: 'A', elementos: A.map(String), c: 'cian', definicion: 'todos los primos (supuesto)' }).map((n) => ({ ...n, supuesto: true })),
      rotulo('Pm', 24, 92, elegir([`P = ${A.join('·')} = ${P},  m = P + 1 = ${m}`, `P = ${P},  m = P + 1 = ${m}`], ANCHO - 48), 'texto'),
      ...recta('R', plan, YR),
      { k: 'pP', t: 'circle', a: { cx: plan.x(P), cy: YR, r: 5 }, c: 'cian' },
      rotulo('pPt', plan.x(P) - 6, YR + 40, 'P', 'cian', 'end'),
      { k: 'pm', t: 'circle', a: { cx: plan.x(m), cy: YR, r: 5 }, c: 'ciruela' },
      rotulo('pmt', plan.x(m) + 6, YR + 40, 'm', 'ciruela'),
      rotulo('dots', 24, YR + 4, '0 ⋯', 'tenue'),
    ],
    ({ A, P, plan, YR }) => [
      // una serie de saltos por cada pᵢ: todas caen exactamente en P
      ...A.flatMap((p, i) => {
        const n = Math.floor((P - plan.min) / p), desde = P - n * p;
        return carril(`C${p}`, plan, Y0 + i * DY, { salto: p, n, desde, etiqueta: `de ${p} en ${p}` })
          .map((nd) => (nd.k.endsWith(':et') ? { ...nd, a: { ...nd.a, x: 24, y: Y0 + i * DY + 4 } } : { ...nd, orden: i }));
      }),
      { ...linea('vP', plan.x(P), Y0 - 26, plan.x(P), YR, 'cian'), supuesto: true },
      ...A.map((p, i) => ({ k: `mas${p}`, t: 'path', a: { d: `M ${plan.x(P)} ${Y0 + i * DY} L ${plan.x(P + 1)} ${Y0 + i * DY}` }, c: 'ambar', ancho: 4, orden: A.length + 1 })),
      rotulo('r1', 24, YR + 64, 'todas caen en P y a m le sobra 1: resto 1, ningún pᵢ divide a m', 'ambar'),
    ],
    ({ m, q, fm, YR }) => [
      rotulo('q', 24, YR + 88, esPrimo(m) ? `m = ${m} es primo: q = ${m} ∉ A` : `q = ${q} divide a m = ${fm.join('·')}, y ${q} ∉ A`, 'verde'),
    ],
    ({ A, m, fm }) => [
      ...['A:n', ...A.flatMap((_, i) => [`A:e${i}`, `A:c${i}`]), 'A:cierra', 'A:def'].map((k) => ({ k, quitar: true })),
      rotulo('Afalso', 24, 34, 'A no tenía todos los primos', 'verde'),
      rotulo('ojo', 24, 58, esPrimo(m) ? 'ojo: m no siempre es primo (2·3·5·7·11·13 + 1 = 30031 = 59·509)' : `ojo: m = ${m} = ${fm.join('·')} no es primo; lo nuevo es q`, 'ambar'),
    ],
  ],
});
