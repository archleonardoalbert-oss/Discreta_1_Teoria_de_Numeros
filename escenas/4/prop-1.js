// Propiedad 1: de a a a hay cero saltos de n.
import { escenaPorCapas, conPuentes, rotulo, num } from '../comun.js';
import { geoTabla, tabla, aro } from '../piezas/modular.js';

const ALTO0 = ({ g }) => g.abajo + 70;

export default escenaPorCapas({
  entradas: [{ id: 'n', etiqueta: 'n', valor: 5, min: 2, max: 9 }, { id: 'a', etiqueta: 'a', valor: 13, min: -20, max: 40 }],
  preparar: ({ n, a }) => ({ g: geoTabla(n, Math.min(0, a), Math.max(a, n - 1), { x: 40, y: 90, altoMax: 240, ancho: 360 }) }),
  alto: (c) => ALTO0(c) + 26,
  base: ({ g, a }) => tabla('T', g, { colores: { [a]: 'ciruela' } }),
  capas: conPuentes([
    ({ g, a, n }) => [aro('aa', g, a, 'ciruela'), rotulo('t', 24, g.abajo + 36, `${num(a)} − ${num(a)} = 0 = ${n}·0: cero saltos de n`, 'texto')],
    ({ g, a, n }) => [aro('aa', g, a, 'verde'), rotulo('r', 24, g.abajo + 58, `${n} | 0, luego ${num(a)} ≡ ${num(a)} (mod ${n})`, 'verde')],
  ], {
    0: () => ['0 = n·0 con 0 entero: 0 es múltiplo de n', 'texto'],
  }, (c) => ALTO0(c) + 8),
});
