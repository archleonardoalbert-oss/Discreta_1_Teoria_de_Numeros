// a ≡ b (n) ⇔ n | a − b sobre la recta enrollada. ⇒: a = kn + r, b = qn + r; los dos «caen» a r; de b a a hay
// k − q filas, o sea k − q saltos de n. ⇐: los restos r₁, r₂ viven en la fila 0…n−1, a menos de n uno del otro;
// su diferencia es múltiplo de n solo si es 0.
import { escenaPorCapas, conPuentes, rotulo, num, por, flecha, ANCHO } from '../comun.js';
import { geoTabla, tabla, columna, aro, saltoVertical, mod } from '../piezas/modular.js';
import { r1 } from '../../motor/escala.js';

const ALTO0 = ({ g }) => g.abajo + 120;

export default escenaPorCapas({
  entradas: [
    { id: 'n', etiqueta: 'n', valor: 5, min: 3, max: 9 },
    { id: 'a', etiqueta: 'a', valor: 17, min: -20, max: 40 },
    { id: 'b', etiqueta: 'b', valor: -8, min: -20, max: 40 },
  ],
  validar: ({ n, a, b }) => (mod(a, n) !== mod(b, n) ? `${num(a)} y ${num(b)} no son congruentes módulo ${n}: elige otro b (el teorema dice que entonces n ∤ a − b)` : null),
  preparar({ n, a, b }) {
    const g = geoTabla(n, Math.min(0, a, b), Math.max(a, b, n - 1), { x: 40, y: 110, altoMax: 290, ancho: 330 });
    const r = mod(a, n), k = (a - r) / n, q = (b - r) / n;
    return { g, r, k, q, XL: 40 + n * g.dx + 24 };
  },
  alto: (c) => ALTO0(c) + 26,
  base: ({ g, a, b }) => tabla('T', g, { colores: { [a]: 'ciruela', [b]: 'cian' } }),
  capas: conPuentes([
    ({ g, a, b, n }) => [
      aro('aa', g, a, 'ciruela'), aro('ab', g, b, 'cian'),
      rotulo('h', 24, 26, `⇒  supongamos ${num(a)} ≡ ${num(b)} (mod ${n})`, 'texto'),
    ],
    ({ g, a, b, n, r, k, q, XL }) => [
      columna('col', g, r, 'ambar'),
      rotulo('la', XL, g.pos(a).y + 4, `a = kn + r = ${por(k, n)} + ${r}`, 'ciruela'),
      rotulo('lb', XL, g.pos(b).y + 4, `b = qn + r = ${por(q, n)} + ${r}`, 'cian'),
    ],
    ({ g, a, b, r, k, q }) => [
      ...(a === r ? [] : [{ ...saltoVertical('fa', g, a, r, 'ciruela', -14) }]),
      ...(b === r ? [] : [{ ...saltoVertical('fb', g, b, r, 'cian', 14) }]),
      aro('ar', g, r, 'ambar'),
      rotulo('n2', 24, g.abajo + 40, `a − kn = b − qn = r = ${r}`, 'ambar'),
    ],
    ({ g, a, b, n, k, q }) => [
      ...['fa', 'fb', 'ar'].map((kk) => ({ k: kk, quitar: true })),
      ...(a === b ? [] : [saltoVertical('fba', g, b, a, 'verde', 22)]),
      rotulo('n3', 24, g.abajo + 62, `a − b = kn − qn = ${num(k * n)} − ${q < 0 ? `(${num(q * n)})` : q * n}`, 'texto'),
    ],
    ({ a, b, n, k, q, g }) => [
      rotulo('n4', 24, g.abajo + 84, `a − b = (k − q)n = ${por(k - q, n)}: ${k - q === 0 ? 'cero' : Math.abs(k - q)} filas, ${n} | ${num(a - b)}`, 'verde'),
    ],
    ({ a, b, n }) => [
      ...['n2', 'n3', 'col', 'la', 'lb'].map((kk) => ({ k: kk, quitar: true })),
      rotulo('h', 24, 26, `⇐  ahora solo se sabe que ${n} | ${num(a - b)}`, 'texto'),
      rotulo('n2', 24, 48, 'a = nq₁ + r₁ y b = nq₂ + r₂, con 0 ≤ r₁, r₂ < n en la fila de 0 … n − 1', 'texto'),
    ],
    ({ g, n }) => [
      { k: 'fila0', t: 'rect', a: { x: g.x + 2, y: r1(g.pos(0).y - g.dy / 2 + 2), width: r1(n * g.dx - 4), height: r1(g.dy - 4), rx: 6 }, c: 'violeta', hueco: true },
      rotulo('n3', 24, g.abajo + 40, 'a − b = n(q₁ − q₂) + r₁ − r₂', 'texto'),
    ],
    ({ g }) => [
      rotulo('n4', 24, g.abajo + 62, 'n | a − b y n | n(q₁ − q₂)  ⇒  n | r₁ − r₂', 'texto'),
    ],
    ({ g, r, a, b, n }) => [
      flecha('ancho', g.x + 6, g.pos(0).y - g.dy / 2 - 4, g.x + n * g.dx - 6, g.pos(0).y - g.dy / 2 - 4, 'violeta'),
      rotulo('anchot', g.x + n * g.dx + 2, g.pos(0).y - g.dy / 2, 'ancho n', 'violeta'),
      aro('ar', g, r, 'verde'),
      rotulo('n5', 24, g.abajo + 84, `|r₁ − r₂| < n: el único múltiplo de n posible es 0, r₁ = r₂ = ${r}`, 'verde'),
    ],
  ], {
    1: ({ k, q }) => [`mismo resto r (definición); k = ${k} y q = ${q} son los cocientes`, 'texto'],
    7: () => ['n divide a dos números ⇒ divide a su diferencia: r₁ − r₂ = (a − b) − n(q₁ − q₂)', 'texto'],
    8: () => ['dos restos de 0 … n − 1 distan a lo sumo n − 1; un múltiplo de n tan pequeño es 0', 'verde'],
  }, (c) => ALTO0(c) + 8),
});
