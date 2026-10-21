// Si a es solución, toda su columna lo es: en la tabla enrollada, cada b ≡ a cumple f(b) ≡ f(a) ≡ 0.
import { escenaPorCapas, conPuentes, rotulo, nota, num, elegir, ANCHO } from '../comun.js';
import { geoTabla, tabla, columna, aro, mod } from '../piezas/modular.js';
import { poli, evaluar } from './def-solucion.js';

const ALTO0 = ({ g }) => g.abajo + 90;

export default escenaPorCapas({
  entradas: [
    { id: 'n', etiqueta: 'n', valor: 7, min: 2, max: 9 },
    { id: 'cs', etiqueta: 'c₀, c₁, …', valor: [-2, 0, 1], min: -9, max: 9, lista: { min: 2, max: 4 } },
    { id: 'a', etiqueta: 'a', valor: 3, min: -20, max: 30 },
  ],
  validar: ({ n, cs, a }) => (mod(evaluar(cs, a), n) !== 0 ? `${num(a)} no es solución: f(${num(a)}) = ${evaluar(cs, a)} ≢ 0 (mod ${n})` : null),
  preparar({ n, a }) {
    const g = geoTabla(n, Math.min(-n, a), Math.max(2 * n, a), { x: 40, y: 80, altoMax: 240, ancho: 380 });
    const col = Array.from({ length: g.filas }, (_, i) => g.desde + i * n + mod(a, n));
    return { g, col };
  },
  alto: (c) => ALTO0(c) + 26,
  base: ({ g, a, n, cs }) => [...tabla('T', g, { colores: { [a]: 'ciruela' } }), aro('aa', g, a, 'ciruela'), nota('n0', 0, `f(x) = ${poli(cs)},  f(${num(a)}) = ${evaluar(cs, a)} ≡ 0 (mod ${n})`, 'texto')],
  capas: conPuentes([
    ({ g, col, a, cs, n }) => [
      ...col.filter((v) => v !== a).map((v, i) => ({ ...aro(`b${v}`, g, v, 'cian'), orden: i })),
      rotulo('t1', 24, g.abajo + 36, elegir([`f(b) ≡ f(a): ${col.map((v) => `f(${num(v)}) = ${evaluar(cs, v)}`).join(',  ')}`, 'para cada b de la columna, f(b) ≡ f(a)'], ANCHO - 48), 'texto'),
    ],
    ({ g, col, a, n }) => [
      columna('col', g, mod(a, n), 'verde'),
      ...col.map((v) => aro(`b${v}`, g, v, 'verde')),
      rotulo('t2', 24, g.abajo + 58, `f(b) ≡ f(a) ≡ 0: toda la columna ${mod(a, n)} son soluciones`, 'verde'),
    ],
  ], {
    0: () => ['es la propiedad fuerte 4, porque a ≡ b (mod n)', 'texto'],
  }, (c) => ALTO0(c) + 8),
});
