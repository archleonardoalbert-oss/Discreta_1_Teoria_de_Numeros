// Relación de equivalencia en la recta enrollada: un lazo en a (reflexiva), la flecha de ida y vuelta entre a y b
// (simétrica), a → b → c ⇒ a → c (transitiva), y al final las n columnas como clases disjuntas [0], …, [n−1].
import { escenaPorCapas, rotulo, flecha, num } from '../comun.js';
import { geoTabla, tabla, columna, aro, saltoVertical } from '../piezas/modular.js';
import { r1 } from '../../motor/escala.js';

const lazo = (k, p, c) => ({ k, t: 'path', a: { d: `M ${r1(p.x + 9)} ${r1(p.y - 10)} C ${r1(p.x + 40)} ${r1(p.y - 34)} ${r1(p.x + 44)} ${r1(p.y + 18)} ${r1(p.x + 12)} ${r1(p.y + 2)}` }, c });

export default escenaPorCapas({
  entradas: [
    { id: 'n', etiqueta: 'n', valor: 5, min: 3, max: 9 },
    { id: 'r', etiqueta: 'r', valor: 2, min: 0, max: 8 },
  ],
  validar: ({ n, r }) => (r >= n ? 'r debe ser un resto: 0 ≤ r < n' : null),
  preparar({ n, r }) {
    const g = geoTabla(n, -n, 4 * n - 1, { x: 40, y: 60, altoMax: 220, ancho: 360 });
    return { g, a: r + 3 * n, b: r - n, c: r + n, XL: 40 + n * g.dx + 30 };
  },
  alto: ({ g }) => g.abajo + 120,
  base: ({ g }) => tabla('T', g),
  capas: [
    ({ g, a, n, XL }) => [
      aro('aa', g, a, 'ciruela'), lazo('lz', g.pos(a), 'ciruela'),
      rotulo('t1', 24, g.abajo + 36, `reflexiva: ${a} ≡ ${a}`, 'ciruela'),
    ],
    ({ g, a, b, XL }) => [
      aro('ab', g, b, 'cian'),
      saltoVertical('ba', g, b, a, 'cian', -12), saltoVertical('ab2', g, a, b, 'cian', 12),
      rotulo('t2', 24, g.abajo + 58, `simétrica: ${num(a)} ≡ ${num(b)} ⇔ ${num(b)} ≡ ${num(a)}`, 'cian'),
    ],
    ({ g, a, b, c, XL }) => [
      ...['ba', 'ab2', 'lz'].map((k) => ({ k, quitar: true })),
      aro('ac', g, c, 'violeta'),
      saltoVertical('cb', g, a, c, 'violeta', -12), saltoVertical('bc', g, c, b, 'violeta', -12),
      saltoVertical('ca', g, a, b, 'verde', 14),
      rotulo('t3', 24, g.abajo + 80, `transitiva: ${a} ≡ ${c} y ${c} ≡ ${num(b)} ⇒ ${a} ≡ ${num(b)}`, 'verde'),
    ],
    ({ g, n, XL }) => [
      ...['cb', 'bc', 'ca', 'aa', 'ab', 'ac'].map((k) => ({ k, quitar: true })),
      ...Array.from({ length: n }, (_, i) => ({ ...columna(`col${i}`, g, i, 'violeta'), orden: i })),
      ...Array.from({ length: n }, (_, i) => ({ ...rotulo(`T:h${i}`, g.x + (i + 0.5) * g.dx, g.y - g.dy - 6, `[${i}]`, 'verde', 'middle'), orden: i })),
      rotulo('t4', 24, g.abajo + 102, `${n} clases disjuntas, una por columna`, 'verde'),
    ],
  ],
});
