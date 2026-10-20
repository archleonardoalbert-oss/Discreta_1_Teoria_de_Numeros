// p | aᵖ − a: el producto a·(aᵖ⁻¹ − 1); o p está en el primer factor, o Fermat lo pone en el segundo.
import { escenaPorCapas, rotulo, sup, ANCHO } from '../comun.js';
import { cajas } from '../piezas/cajas.js';
import { validarPrimo } from './lema-p-no-divide.js';

const X = 24, Y = 96;

export default escenaPorCapas({
  entradas: [
    { id: 'p', etiqueta: 'p', valor: 5, min: 2, max: 13 },
    { id: 'a', etiqueta: 'a', valor: 3, min: 1, max: 20 },
  ],
  validar: ({ p }) => validarPrimo(p),
  preparar({ p, a }) {
    const v = BigInt(a) ** BigInt(p - 1) - 1n;
    return { v, total: BigInt(a) * v, divideA: a % p === 0 };
  },
  alto: 220,
  capas: [
    ({ p, a, v, total }) => [
      rotulo('t', X, 36, `${a}${sup(p)} − ${a} = ${total} = a · (a${sup(p - 1)} − 1):`, 'texto'),
      ...cajas('C', { x: X, y: Y, p, reservar: true, valores: [String(a), `${a}${sup(p - 1)} − 1 = ${v}`] }),
    ],
    ({ p, a, v, divideA }) => (divideA
      ? [...cajas('C', { x: X, y: Y, valores: [String(a), `${a}${sup(p - 1)} − 1 = ${v}`], p, reservar: true, marcas: ['|', null] }).filter((n) => /:(b|v|m)0$/.test(n.k)), rotulo('c1', X, 160, `caso p | a:  ${p} | ${a}, así que divide al producto`, 'verde')]
      : [rotulo('c1', X, 160, `caso p | a: aquí ${p} ∤ ${a}, no aplica`, 'tenue')]),
    ({ p, a, v, divideA }) => (divideA
      ? [rotulo('c2', X, 186, 'caso p ∤ a: no aplica (ya está el primero)', 'tenue')]
      : [rotulo('c2', X, 186, `caso p ∤ a:  Fermat da ${p} | ${v}, así que divide al producto`, 'verde'),
        rotulo('m1', X + 60, Y + 26, `${p} | ${v}`, 'verde')]),
  ],
});
