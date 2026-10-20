// PBO ⇔ PIM. Arriba (PBO ⇒ PIM): el patrón del contraejemplo mínimo sobre una cinta simbólica n₀, n₀+1, …, m−1, m.
// C = {c₁, c₂, …} es supuesto (punteado); el PBO señala c₁ = m; P(m−1) se cumple y la plantilla enciende m, que
// choca con la marca de C: C se desvanece. Abajo (PIM ⇒ PBO, añadida): un muro «ninguno de 1…n está en A» avanza.
import { escenaPorCapas, rotulo, flecha, ANCHO } from '../comun.js';
import { conjunto, simbolos } from '../primitivas.js';
import { r1 } from '../../motor/escala.js';

const W = 56, G = 8, X0 = 24, N = 9;
const xc = (i) => X0 + i * (W + G);
const YA = 150, YB = 440, H = 36;
const ETIQ = ['n₀', 'n₀+1', '⋯', 'm−1', 'm', '⋯', '⋯', '⋯', '⋯'];
const EN_C = [4, 6, 8];                                  // casillas donde caerían c₁, c₂, c₃
const celda = (k, i, y, c, extra = {}) => ({ k, t: 'rect', a: { x: r1(xc(i)), y, width: W, height: H, rx: 7 }, c, ...extra });
const texto = (k, i, y, txt, c) => rotulo(k, xc(i) + W / 2, y + H / 2 + 5, txt, c, 'middle');
const cruz = (k, i, y, extra = {}) => ({ k, t: 'path', a: { d: `M ${r1(xc(i) + 8)} ${y + 6} L ${r1(xc(i) + W - 8)} ${y + H - 6} M ${r1(xc(i) + W - 8)} ${y + 6} L ${r1(xc(i) + 8)} ${y + H - 6}` }, c: 'ambar', ...extra });

export default escenaPorCapas({
  entradas: [],
  alto: YB + 100,
  base: () => [
    rotulo('h1', 24, 22, 'PBO ⇒ PIM', 'tenue'),
    ...ETIQ.map((_, i) => celda(`a${i}`, i, YA, 'muy-tenue', { hueco: true })),
    ...ETIQ.map((t, i) => texto(`at${i}`, i, YA, t, 'tenue')),
  ],
  capas: [
    () => [
      ...conjunto('C', { x: 24, y: 56, nombre: 'C', elementos: simbolos('c', 3), c: 'ambar', definicion: 'C: los n ≥ n₀ que no cumplen P' })
        .map((n) => ({ ...n, supuesto: true })),
    ],
    () => [
      // los elementos de C bajan a la cinta como marcas punteadas
      ...EN_C.map((i, j) => cruz(`x${i}`, i, YA, { supuesto: true, desde: `C:e${j}`, orden: j })),
      rotulo('noVacio', ANCHO - 24, 56, 'C ≠ ∅ (supuesto)', 'ambar', 'end'),
    ],
    () => [
      ...conjunto('C', { x: 24, y: 56, nombre: 'C', elementos: simbolos('c', 3), c: 'ambar', señalado: 0, etiquetaSeñalado: 'mínimo = m', definicion: 'C: los n ≥ n₀ que no cumplen P' })
        .map((n) => ({ ...n, supuesto: true })),
      { k: 'aroM', t: 'rect', a: { x: r1(xc(4) - 4), y: YA - 4, width: W + 8, height: H + 8, rx: 9 }, c: 'ambar', hueco: true },
    ],
    () => [
      celda('a0', 0, YA, 'verde'), texto('at0', 0, YA, 'n₀', 'verde'),
      rotulo('b0', xc(0) + W / 2, YA + H + 22, 'P(n₀) ✓', 'verde', 'middle'),
      rotulo('d1', xc(1), YA + H + 46, 'm ≠ n₀, luego m − 1 ≥ n₀', 'texto'),
    ],
    () => [
      celda('a3', 3, YA, 'verde'), texto('at3', 3, YA, 'm−1', 'verde'),
      rotulo('b3', xc(3) + W / 2, YA + H + 22, 'm−1 ∉ C', 'verde', 'middle'),
    ],
    () => [
      { ...flecha('fm', xc(3) + W / 2, YA - 6, xc(4) + W / 2, YA - 6, 'verde', 16), ref: true },
      celda('a4', 4, YA, 'verde'), texto('at4', 4, YA, 'm', 'verde'),
      rotulo('b4', xc(4) + W / 2 + 26, YA + H + 22, 'P(m) ✓ ¡pero m ∈ C!', 'ambar'),
      // C se desvanece: la contradicción lo vacía
      ...EN_C.map((i) => ({ k: `x${i}`, quitar: true })),
      ...['C:n', 'C:e0', 'C:e1', 'C:e2', 'C:e3', 'C:c0', 'C:c1', 'C:c2', 'C:cierra', 'C:def', 'C:aro', 'C:min', 'noVacio', 'aroM'].map((k) => ({ k, quitar: true })),
      ...ETIQ.flatMap((t, i) => (i === 0 || i === 3 || i === 4 ? [] : [{ ...celda(`a${i}`, i, YA, 'verde'), orden: 3 + i }, { ...texto(`at${i}`, i, YA, t, 'verde'), orden: 3 + i }])),
      rotulo('vacio', 24, 56, 'C = ∅: P se cumple para todo n ≥ n₀', 'verde'),
    ],
    () => [
      rotulo('h2', 24, YB - 150, 'PIM ⇒ PBO', 'tenue'),
      ...Array.from({ length: N }, (_, i) => celda(`z${i}`, i, YB, 'muy-tenue', { hueco: true })),
      ...Array.from({ length: N }, (_, i) => texto(`zt${i}`, i, YB, String(i + 1), 'tenue')),
    ],
    () => [
      ...conjunto('A', { x: 24, y: YB - 110, nombre: 'A', elementos: simbolos('a', 3), c: 'ciruela', definicion: 'A ⊆ ℤ₊ sin elemento mínimo (supuesto)' })
        .map((n) => ({ ...n, supuesto: true })),
      rotulo('Pn', 24, YB - 22, 'P(n): ninguno de 1, 2, …, n está en A', 'violeta'),
    ],
    () => [
      { k: 'muro', t: 'rect', a: { x: r1(xc(0) - 3), y: YB - 3, width: W + 6, height: H + 6, rx: 8 }, c: 'verde' },
      rotulo('m1', xc(0) + W / 2, YB + H + 22, '1 ∉ A', 'verde', 'middle'),
    ],
    () => [
      { k: 'muro', t: 'rect', a: { x: r1(xc(0) - 3), y: YB - 3, width: r1(xc(3) - xc(0) + W + 6), height: H + 6, rx: 8 }, c: 'verde' },
      { ...flecha('fz', xc(2) + W / 2, YB - 6, xc(3) + W / 2, YB - 6, 'violeta', 16) },
      rotulo('m1', xc(0), YB + H + 22, 'si n+1 estuviera en A, sería su mínimo', 'verde'),
    ],
    () => [
      { k: 'muro', t: 'rect', a: { x: r1(xc(0) - 3), y: YB - 3, width: r1(xc(N - 1) - xc(0) + W + 6), height: H + 6, rx: 8 }, c: 'verde' },
      { k: 'fz', quitar: true },
      ...['A:n', 'A:e0', 'A:e1', 'A:e2', 'A:e3', 'A:c0', 'A:c1', 'A:c2', 'A:cierra', 'A:def'].map((k) => ({ k, quitar: true })),
      rotulo('Avacio', 24, YB - 110, 'A = ∅: todo A no vacío tiene mínimo', 'verde'),
    ],
  ],
});
