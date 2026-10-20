// Propiedad 5: ka = a + a + … + a. Cada suma parcial (2a, 2b), (3a, 3b), … cae en una misma columna.
import { escenaPorCapas, rotulo, num } from '../comun.js';
import { geoTabla, tabla, aro, columna, mod } from '../piezas/modular.js';

export default escenaPorCapas({
  entradas: [
    { id: 'n', etiqueta: 'n', valor: 4, min: 3, max: 9 }, { id: 'a', etiqueta: 'a', valor: 7, min: -8, max: 12 },
    { id: 'b', etiqueta: 'b', valor: -1, min: -8, max: 12 }, { id: 'k', etiqueta: 'k', valor: 3, min: 1, max: 4 },
  ],
  validar: ({ n, a, b }) => (mod(a, n) !== mod(b, n) ? `${num(a)} ≢ ${num(b)} (mod ${n})` : null),
  preparar({ n, a, b, k }) {
    const vs = [0, n - 1, ...Array.from({ length: k }, (_, i) => [(i + 1) * a, (i + 1) * b]).flat()];
    return { g: geoTabla(n, Math.min(...vs), Math.max(...vs), { x: 40, y: 60, altoMax: 300, ancho: 380 }) };
  },
  alto: ({ g }) => g.abajo + 90,
  base: ({ g, a, b }) => [...tabla('T', g), aro('a1', g, a, 'ciruela'), aro('b1', g, b, 'cian')],
  capas: [
    ({ g, a, b, k }) => [
      ...Array.from({ length: k - 1 }, (_, j) => j + 2).flatMap((i) => [
        { ...aro(`a${i}`, g, i * a, 'ciruela'), desde: `a${i - 1}`, orden: i },
        { ...aro(`b${i}`, g, i * b, 'cian'), desde: `b${i - 1}`, orden: i },
      ]),
      rotulo('t0', 24, g.abajo + 36, Array.from({ length: k }, (_, i) => `${num((i + 1) * a)} ≡ ${num((i + 1) * b)}`).join(',  '), 'texto'),
    ],
    ({ g, a, b, k, n }) => [
      columna('col', g, mod(k * a, n), 'verde'),
      rotulo('t1', 24, g.abajo + 58, `${k}a = ${num(k * a)} ≡ ${num(k * b)} = ${k}b (mod ${n})`, 'verde'),
    ],
  ],
});
