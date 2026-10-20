// p | aᵏ ⇒ p | a y pᵏ | aᵏ: aᵏ son k copias de a; p está en una copia, luego en todas.
import { escenaPorCapas, conPuentes, rotulo, sup, ANCHO } from '../comun.js';
import { cajas } from '../piezas/cajas.js';
import { validarPrimo } from './lema-p-no-divide.js';

const X = 24, Y = 80;

const ALTO0 = () => 210;

export default escenaPorCapas({
  entradas: [
    { id: 'a', etiqueta: 'a', valor: 12, min: 2, max: 60 },
    { id: 'k', etiqueta: 'k', valor: 3, min: 1, max: 6 },
    { id: 'p', etiqueta: 'p', valor: 2, min: 2, max: 59 },
  ],
  validar: ({ a, k, p }) => validarPrimo(p) ?? (a % p !== 0 ? `${p} ∤ ${a}${sup(k)}: elige p que divida a a` : null),
  preparar: ({ a, k, p }) => ({ copias: Array(k).fill(a), m: a / p, ak: a ** k }),
  alto: (c) => ALTO0(c) + 26,
  capas: conPuentes([
    ({ a, k, p, copias, ak }) => [
      rotulo('n0', X, 28, `${a}${sup(k)} = ${copias.join('·')} = ${ak}  y  ${p} | ${ak}`, 'texto'),
      ...cajas('A', { x: X, y: Y, valores: copias, p, reservar: true }),
    ],
    ({ p, copias }) => cajas('A', { x: X, y: Y, valores: copias, p, reservar: true, marcas: copias.map((_, i) => (i === 0 ? '|' : null)) }),
    ({ p, k, copias, a }) => [
      ...cajas('A', { x: X, y: Y, valores: copias, p, reservar: true, marcas: copias.map(() => '|') }),
      rotulo('n1', X, Y + 62, `todas las copias son iguales: ${p} está en cada una  ⇒  ${p}${sup(k)} | ${a}${sup(k)}`, 'texto'),
    ],
    ({ a, k, p, m, ak, copias }) => [
      ...cajas('A', { x: X, y: Y, valores: copias, p, reservar: true, marcas: copias.map(() => '|'), colores: copias.map(() => 'verde') })
        .map((n) => (/^A:v\d+$/.test(n.k) ? { ...n, txt: `${p}·${m}` } : n)),
      rotulo('res', ANCHO / 2, Y + 104, `${ak} = ${p}${sup(k)} · ${m}${sup(k)} = ${p ** k} · ${m ** k}`, 'verde', 'middle'),
    ],
  ], {
    1: () => ['el teorema con todos los factores iguales a a', 'texto'],
  }, (c) => ALTO0(c) + 8),
});
