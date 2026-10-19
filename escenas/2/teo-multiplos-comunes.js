// Todo múltiplo común es k·ab/(a,b): m = k₁a = k₂b, se divide por d y la coprimalidad obliga a b/d | k₁.
import { escenaPorCapas, carril, rotulo, nota, ANCHO } from '../comun.js';
import { planRecta } from '../../motor/escala.js';
import { recta, punto } from '../primitivas.js';
import { dosSaltadores } from '../piezas/multiplos.js';
import { mcd } from '../../motor/aritmetica.js';

const YA = 150, YB = 198, YL = 246, EJE = 304, K = 2;

export default escenaPorCapas({
  entradas: [
    { id: 'a', etiqueta: 'a', valor: 4, min: 1, max: 40 },
    { id: 'b', etiqueta: 'b', valor: 6, min: 1, max: 40 },
  ],
  preparar({ a, b }) {
    const d = mcd(a, b), L = (a * b) / d, m = K * L;
    return { d, L, m, k1: m / a, k2: m / b, p: planRecta({ min: -m * 0.04, max: m * 1.06, ancho: ANCHO }) };
  },
  alto: EJE + 56,
  base: ({ p }) => recta('eje', p, EJE),
  capas: [
    ({ a, b, m, k1, k2, p }) => [
      ...dosSaltadores(p, { a, b, hasta: m, yA: YA, yB: YB }),
      ...punto('pm', p, m, EJE, { c: 'ciruela', etiqueta: `m = ${m}` }),
      nota('n0', 0, `m = k₁·a = k₂·b:  ${m} = ${k1}·${a} = ${k2}·${b}`),
    ],
    ({ a, b, d, k1, k2 }) => [nota('n1', 1, `÷ d = ${d}:  k₁·(a/d) = k₂·(b/d):  ${k1}·${a / d} = ${k2}·${b / d}`)],
    ({ a, b, d, k1 }) => [nota('n2', 2, `b/d = ${b / d} | k₁·(a/d) = ${k1}·${a / d}  y  (${a / d}, ${b / d}) = 1`)],
    ({ b, d, k1 }) => [nota('n3', 3, `⇒ b/d | k₁:  k₁ = k·(b/d) = ${k1 / (b / d)}·${b / d}`)],
    ({ a, b, d, L, m, p }) => [
      ...carril('ll', p, YL, { salto: L, n: K, c: 'verde', etiqueta: `saltos de ab/d = ${a}·${b}/${d} = ${L}` }),
      rotulo('res', ANCHO / 2, EJE + 48, `m = k·ab/(a,b) = ${K}·${L} = ${m}`, 'verde', 'middle'),
    ],
  ],
});
