// Si p ∤ a entonces (p, a) = 1: D(p) = {1, p}, p no está en D(a), y lo único común es el 1.
import { escenaPorCapas, rotulo, ANCHO } from '../comun.js';
import { conjunto } from '../primitivas.js';
import { divisores } from '../../motor/aritmetica.js';
import { esPrimo } from '../../motor/primos.js';

export const validarPrimo = (p, nombre = 'p') => (esPrimo(p) ? null : `${nombre} debe ser primo (${p} no lo es)`);

export default escenaPorCapas({
  entradas: [
    { id: 'p', etiqueta: 'p', valor: 7, min: 2, max: 97 },
    { id: 'a', etiqueta: 'a', valor: 12, min: 1, max: 200 },
  ],
  validar: ({ p, a }) => validarPrimo(p) ?? (a % p === 0 ? `el lema pide p ∤ a, y ${p} | ${a}` : null),
  alto: 190,
  capas: [
    ({ p }) => conjunto('Dp', { x: 24, y: 40, nombre: `D(${p})`, elementos: ['1', String(p)], c: 'cian' }),
    ({ p, a }) => [
      ...conjunto('Da', { x: 24, y: 84, nombre: `D(${a})`, elementos: divisores(a).map(String), c: 'cian' }),
      rotulo('fuera', 24, 118, `${p} ∉ D(${a}) porque ${p} ∤ ${a}`, 'ambar'),
    ],
    ({ p, a }) => [
      ...conjunto('Di', { x: 24, y: 152, nombre: `D(${p}) ∩ D(${a})`, elementos: ['1'], c: 'verde' }),
      rotulo('res', ANCHO - 24, 152, `(${p}, ${a}) = 1`, 'verde', 'end'),
    ],
  ],
});
