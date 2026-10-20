// Pequeño Teorema de Fermat: los múltiplos a, 2a, …, (p−1)a dejan restos distintos y no nulos; las propias cajas
// de los restos se reordenan hasta quedar 1, 2, …, p−1 (se ve que es una permutación; queda la huella del orden
// original). Comparando productos sale aᵖ⁻¹ con resto 1.
import { escenaPorCapas, conPuentes, rotulo, elegir, sup, ANCHO } from '../comun.js';
import { cajas } from '../piezas/cajas.js';
import { factorialBig } from '../../motor/primos.js';
import { validarPrimo } from './lema-p-no-divide.js';

const X = 24, YM = 64, YR = 176, YS = 286, HUECO = 10;

const ALTO0 = () => YS + 110;

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
    return { is, mult, restos, ap, F: factorialBig(p - 1) };
  },
  alto: (c) => ALTO0(c) + 26,
  capas: conPuentes([
    ({ mult, restos, a }) => [
      rotulo('tm', X, YM - 34, `múltiplos de a = ${a}:`, 'texto'),
      ...cajas('M', { x: X, y: YM, valores: mult, hueco: HUECO }),
      rotulo('tr', X, YR - 34, 'sus restos al dividir entre p:', 'texto'),
      ...cajas('R', { x: X, y: YR, valores: restos, hueco: HUECO, desde: mult.map((_, i) => `M:v${i}`), c: 'ambar' }),
    ],
    () => [rotulo('n1', X, YM + 40, 'ninguno es 0 y no se repiten: si ia y ja dejaran el mismo resto, p | (j − i)a', 'texto')],
    ({ is, restos }) => {
      // cada caja de resto viaja a la casilla de su valor (fila de abajo, ordenada)
      const destino = cajas('Rt', { x: X, y: YS, valores: is, hueco: HUECO, c: 'verde' });
      const mover = restos.flatMap((r, i) => ['b', 'v'].map((t) => ({ ...destino.find((n) => n.k === `Rt:${t}${r - 1}`), k: `R:${t}${i}` })));
      return [
        ...cajas('R0', { x: X, y: YR, valores: restos, hueco: HUECO, c: 'tenue' }).filter((n) => !/:x\d+$/.test(n.k)),
        ...restos.slice(0, -1).map((_, i) => ({ k: `R:x${i}`, quitar: true })),
        ...mover,
        ...destino.filter((n) => /:x\d+$/.test(n.k)),
        rotulo('ts', X, YS - 34, 'las mismas cajas, reordenadas: son 1, 2, …, p − 1', 'texto'),
      ];
    },
    ({ p, a, F, ap }) => [rotulo('n3', X, YS + 40, elegir([`a·2a·…·(p−1)a = ${p - 1}!·${a}${sup(p - 1)} deja el mismo resto que ${p - 1}! = ${F}`, `${p - 1}!·${a}${sup(p - 1)} deja el mismo resto que ${p - 1}!`], ANCHO - 48), 'texto')],
    ({ p, a, ap }) => [rotulo('res', ANCHO / 2, YS + 76, `p ∤ ${p - 1}!  ⇒  ${a}${sup(p - 1)} = ${ap} = ${p}·${(ap - 1n) / BigInt(p)} + 1`, 'verde', 'middle')],
  ], {
    1: () => ['ninguno es 0: p ∤ i y p ∤ a ⇒ p ∤ ia (Euclides); y 0 < j − i < p', 'texto'],
    3: () => ['mismo resto ⇒ la diferencia (p − 1)!(aᵖ⁻¹ − 1) es múltiplo de p', 'texto'],
  }, (c) => ALTO0(c) + 8),
});
