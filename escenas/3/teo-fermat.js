// Pequeño Teorema de Fermat: los múltiplos a, 2a, …, (p−1)a dejan restos distintos y no nulos; esos restos
// vuelan a sus casillas 1…p−1 (una permutación). Comparando productos sale aᵖ⁻¹ con resto 1.
import { escenaPorCapas, rotulo, linea, elegir, sup, ANCHO } from '../comun.js';
import { cajas, anchoCaja } from '../piezas/cajas.js';
import { factorialBig } from '../../motor/primos.js';
import { validarPrimo } from './lema-p-no-divide.js';

const X = 24, YM = 64, YR = 176, YS = 286, HUECO = 10;
const centros = (vals) => { const xs = []; let cx = X; vals.forEach((v) => { const w = anchoCaja(v); xs.push(cx + w / 2); cx += w + HUECO; }); return xs; };

export default escenaPorCapas({
  entradas: [
    { id: 'p', etiqueta: 'p', valor: 7, min: 2, max: 13 },
    { id: 'a', etiqueta: 'a', valor: 3, min: 1, max: 30 },
  ],
  validar: ({ p, a }) => validarPrimo(p) ?? (a % p === 0 ? `el teorema pide p ∤ a, y ${p} | ${a}` : null),
  preparar({ p, a }) {
    const is = Array.from({ length: p - 1 }, (_, i) => i + 1);
    const mult = is.map((i) => i * a), restos = mult.map((m) => m % p);
    const ap = BigInt(a) ** BigInt(p - 1);
    return { is, mult, restos, ap, F: factorialBig(p - 1), xr: centros(restos), xs: centros(is) };
  },
  alto: YS + 110,
  capas: [
    ({ mult, restos, a }) => [
      rotulo('tm', X, YM - 34, `múltiplos de a = ${a}:`, 'texto'),
      ...cajas('M', { x: X, y: YM, valores: mult, hueco: HUECO }),
      rotulo('tr', X, YR - 34, 'sus restos al dividir entre p:', 'texto'),
      ...cajas('R', { x: X, y: YR, valores: restos, hueco: HUECO, desde: mult.map((_, i) => `M:v${i}`), c: 'ambar' }),
    ],
    () => [rotulo('n1', X, YM + 40, 'ninguno es 0 y no se repiten: si ia y ja dejaran el mismo resto, p | (j − i)a', 'texto')],
    ({ is, restos, xr, xs }) => [
      rotulo('ts', X, YS - 34, 'son 1, 2, …, p − 1 en otro orden:', 'texto'),
      ...cajas('S', { x: X, y: YS, valores: is, hueco: HUECO, c: 'verde', desde: is.map((j) => `R:v${restos.indexOf(j)}`) }),
      ...is.map((j) => { const i = restos.indexOf(j); return linea(`fl${j}`, xr[i], YR + 10, xs[j - 1], YS - 24, 'muy-tenue'); }),
    ],
    ({ p, a, F, ap }) => [rotulo('n3', X, YS + 40, elegir([`a·2a·…·(p−1)a = ${p - 1}!·${a}${sup(p - 1)} deja el mismo resto que ${p - 1}! = ${F}`, `${p - 1}!·${a}${sup(p - 1)} deja el mismo resto que ${p - 1}!`], ANCHO - 48), 'texto')],
    ({ p, a, ap }) => [rotulo('res', ANCHO / 2, YS + 76, `p ∤ ${p - 1}!  ⇒  ${a}${sup(p - 1)} = ${ap} = ${p}·${(ap - 1n) / BigInt(p)} + 1`, 'verde', 'middle')],
  ],
});
