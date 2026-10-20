// Si un primo p divide a un producto de primos q₁⋯qₙ, es uno de ellos: p | q_k y D(q_k) = {1, q_k}.
import { escenaPorCapas, rotulo, sub, ANCHO } from '../comun.js';
import { conjunto } from '../primitivas.js';
import { cajas } from '../piezas/cajas.js';
import { esPrimo } from '../../motor/primos.js';
import { validarPrimo } from './lema-p-no-divide.js';

const X = 24, Y = 70;

export default escenaPorCapas({
  entradas: [
    { id: 'p', etiqueta: 'p', valor: 5, min: 2, max: 97 },
    { id: 'qs', etiqueta: 'q₁…qₙ', valor: [3, 5, 7], min: 2, max: 97, lista: { min: 2, max: 4 } },
  ],
  validar: ({ p, qs }) => validarPrimo(p) ?? (qs.find((q) => !esPrimo(q)) !== undefined ? `los q deben ser primos (${qs.find((q) => !esPrimo(q))} no lo es)` : !qs.includes(p) ? `${p} no divide a ${qs.join('·')}: el corolario no aplica` : null),
  preparar: ({ p, qs }) => ({ k: qs.indexOf(p), producto: qs.reduce((s, v) => s * v, 1) }),
  alto: 200,
  capas: [
    ({ p, qs, producto }) => [
      rotulo('n0', X, 24, `${p} | ${qs.join('·')} = ${producto}  ⇒  ${p} divide a algún factor`, 'texto'),
      ...cajas('Q', { x: X, y: Y, valores: qs, marcas: qs.map((q) => (q % p === 0 ? '|' : '∤')), p }),
    ],
    ({ qs, k }) => conjunto('D', { x: X, y: Y + 66, nombre: `D(q${sub(k + 1)}) = D(${qs[k]})`, elementos: ['1', String(qs[k])], c: 'cian' }),
    ({ p, k }) => [rotulo('res', ANCHO / 2, Y + 112, `p ≠ 1  ⇒  ${p} = q${sub(k + 1)}`, 'verde', 'middle')],
  ],
});
