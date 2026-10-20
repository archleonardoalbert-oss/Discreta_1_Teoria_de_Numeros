// Σ (2k−1) = n² por el PBO. Los impares son escuadras (gnomones) de cuadraditos: el cuadrado (m−1)² está hecho de
// las escuadras 1, 3, 5, …; la escuadra 2m − 1 aparece primero estirada en una fila y luego se dobla alrededor del
// cuadrado, que pasa a ser m × m. C (los contraejemplos, supuesto) se desvanece al final.
import { escenaPorCapas, conPuentes, rotulo, elegir } from '../comun.js';
import { conjunto, simbolos } from '../primitivas.js';
import { r1 } from '../../motor/escala.js';

const X = 350, Y = 40, XT = 24, ANCHO_T = 316;

// Celdas de la escuadra k (1…m): columna derecha de arriba abajo y luego la fila de abajo hacia la izquierda.
const escuadra = (k) => [...Array.from({ length: k }, (_, r) => [r, k - 1]), ...Array.from({ length: k - 1 }, (_, j) => [k - 1, k - 2 - j])];

export default escenaPorCapas({
  entradas: [{ id: 'm', etiqueta: 'm (dibujo)', valor: 5, min: 2, max: 9 }],
  preparar({ m }) {
    const lado = Math.min(28, 250 / m), YF = Math.max(Y + m * lado + 44, 336);
    const celda = (k, i, [r, c], col, extra = {}) => ({ k: `g${k}-${i}`, t: 'rect', a: { x: r1(X + c * lado), y: r1(Y + r * lado), width: r1(lado - 2), height: r1(lado - 2), rx: 2 }, c: col, ...extra });
    const impares = Array.from({ length: m - 1 }, (_, i) => 2 * i + 1);
    const suma = elegir([`${impares.join(' + ')} = ${(m - 1) ** 2} = ${m - 1}²`, `1 + 3 + … + ${2 * m - 3} = ${m - 1}²`], ANCHO_T);
    return { lado, YF, celda, suma };
  },
  alto: ({ YF }) => YF + 56,
  capas: conPuentes([
    () => [...conjunto('C', { x: XT, y: 40, nombre: 'C', elementos: simbolos('c', 3), c: 'ambar', definicion: 'los n con 1 + 3 + … + (2n−1) ≠ n²' }).map((n) => ({ ...n, supuesto: true }))],
    () => [rotulo('n1', XT, 116, 'C ≠ ∅ (supuesto)', 'ambar')],
    ({ m }) => [
      ...conjunto('C', { x: XT, y: 40, nombre: 'C', elementos: simbolos('c', 3), c: 'ambar', señalado: 0, etiquetaSeñalado: 'mínimo = m', definicion: 'los n con 1 + 3 + … + (2n−1) ≠ n²' }).map((n) => ({ ...n, supuesto: true })),
      rotulo('n1', XT, 138, `C ≠ ∅ (supuesto); dibujamos m = ${m}`, 'ambar'),
    ],
    ({ celda }) => [
      celda(1, 0, [0, 0], 'cian'),
      rotulo('n2', XT, 162, '1 = 1²: P(1) ✓, luego m − 1 ≥ 1', 'texto'),
    ],
    ({ m, celda, suma, lado }) => [
      // el cuadrado (m−1)² se arma escuadra a escuadra: 1, 3, 5, …
      ...Array.from({ length: m - 2 }, (_, j) => j + 2).flatMap((k) => escuadra(k).map((rc, i) => ({ ...celda(k, i, rc, 'cian'), orden: k - 1 }))),
      ...Array.from({ length: m - 1 }, (_, j) => j + 1).filter(() => lado >= 22).map((k) => ({ ...rotulo(`e${k}`, X + (k - 0.5) * lado - 1, Y + (k - 0.5) * lado + 4, String(2 * k - 1), 'texto', 'middle'), orden: k })),
      rotulo('n3', XT, 186, `${suma}: P(m − 1) ✓`, 'texto'),
    ],
    ({ m, celda, lado, YF }) => [
      // la escuadra 2m − 1 aparece estirada en una fila, debajo
      ...escuadra(m).map((rc, i) => ({ ...celda(m, i, rc, 'ambar'), a: { x: r1(XT + i * lado), y: r1(YF - lado), width: r1(lado - 2), height: r1(lado - 2), rx: 2 } })),
      rotulo('fila', XT, YF + 14, `2m − 1 = ${2 * m - 1} cuadraditos`, 'ambar'),
      rotulo('n4', XT, 210, `suma hasta m = ${(m - 1) ** 2} + ${2 * m - 1}`, 'texto'),
    ],
    ({ m, celda, lado }) => [
      // se dobla alrededor del cuadrado
      ...escuadra(m).map((rc, i) => celda(m, i, rc, 'ambar')),
      { k: 'fila', quitar: true },
      ...(lado >= 22 ? [rotulo(`e${m}`, X + (m - 0.5) * lado - 1, Y + (m - 0.5) * lado + 4, String(2 * m - 1), 'texto', 'middle')] : []),
      rotulo('n5', XT, 234, '= (m − 1)² + (2m − 1)', 'texto'),
    ],
    ({ m, lado }) => [
      rotulo('bd', X + m * lado + 8, Y + ((m - 1) * lado) / 2 + 4, `m−1 = ${m - 1}`, 'ambar'),
      rotulo('bi', X + ((m - 1) * lado) / 2, Y + m * lado + 16, `m−1 = ${m - 1}`, 'ambar', 'middle'),
      rotulo('bc', X + (m - 0.5) * lado, Y + m * lado + 16, '+1', 'ambar', 'middle'),
      rotulo('n6', XT, 258, '= (m² − 2m + 1) + (2m − 1)', 'texto'),
    ],
    ({ m, lado }) => [
      ...['bd', 'bi', 'bc'].map((k) => ({ k, quitar: true })),
      { k: 'marco', t: 'rect', a: { x: X - 4, y: Y - 4, width: r1(m * lado + 6), height: r1(m * lado + 6), rx: 4 }, c: 'verde', hueco: true },
      rotulo('lm', X - 10, Y + (m * lado) / 2 + 4, `m = ${m}`, 'verde', 'end'),
      rotulo('n7', XT, 282, `= m² = ${m * m}`, 'verde'),
    ],
    () => [
      ...['C:n', 'C:e0', 'C:e1', 'C:e2', 'C:e3', 'C:c0', 'C:c1', 'C:c2', 'C:cierra', 'C:def', 'C:aro', 'C:min', 'n1'].map((k) => ({ k, quitar: true })),
      rotulo('vacio', XT, 40, 'P(m) ✓ ¡pero m ∈ C! Luego C = ∅', 'verde'),
    ],
  ], {
    5: () => ['se separa el último sumando (k = m): aparece la suma hasta m − 1', 'texto'],
    6: () => ['la suma hasta m − 1 vale (m − 1)²: es P(m − 1)', 'texto'],
    7: () => ['−2m con +2m y +1 con −1 se anulan', 'texto'],
  }, ({ YF }) => YF + 40),
});
