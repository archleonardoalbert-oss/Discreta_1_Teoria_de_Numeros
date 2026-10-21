// CP-01, ejercicio 3 (planteamiento): qué cuenta como descomposición válida. Cada sumando es una fila de
// cuadraditos; válida si dos filas cualesquiera difieren a lo sumo en 1. Ejemplos y un no-ejemplo, sin contar.
import { escenaPorCapas, rotulo } from '../comun.js';
import { r1 } from '../../motor/escala.js';

const L = 16, Y0 = 70;

/** Filas de cuadraditos (una por sumando) a partir de (x, y). */
function filas(id, sumandos, x, y, c, orden = 0) {
  const ns = [];
  sumandos.forEach((s, f) => {
    for (let i = 0; i < s; i++) ns.push({ k: `${id}:${f}:${i}`, t: 'rect', a: { x: r1(x + i * L), y: r1(y + f * (L + 4)), width: L - 3, height: L - 3, rx: 2 }, c, orden: orden + f * 0.2 });
  });
  return ns;
}
const reparto = (n, m) => { const q = Math.floor(n / m), r = n % m; return [...Array(m - r).fill(q), ...Array(r).fill(q + 1)]; };

export default escenaPorCapas({
  entradas: [{ id: 'n', etiqueta: 'n', valor: 7, min: 4, max: 13 }],
  preparar: ({ n }) => ({ dos: reparto(n, 2), tres: reparto(n, 3), mala: [1, n - 1] }),
  alto: 300,
  capas: [
    ({ n }) => [
      ...filas('n', [n], 24, Y0, 'cian'),
      rotulo('n:t', 24, Y0 - 14, `n = ${n} cuadraditos`, 'cian'),
    ],
    ({ dos }) => [
      ...filas('d', dos, 24, 140, 'verde'),
      rotulo('d:t', 24, 126, `${dos.join(' + ')}  ✓  (difieren en ${dos[1] - dos[0]})`, 'verde'),
    ],
    ({ tres, n }) => [
      ...filas('t', tres, 260, 140, 'verde'),
      rotulo('t:t', 260, 126, `${tres.join(' + ')}  ✓`, 'verde'),
    ],
    ({ mala, n }) => [
      ...filas('m', mala, 24, 222, 'ambar'),
      rotulo('m:t', 24, 208, `${mala.join(' + ')}  ✗  (${mala[1]} − ${mala[0]} = ${mala[1] - mala[0]} > 1)`, 'ambar'),
    ],
    ({ n, dos }) => [
      rotulo('q', 24, 290, `${dos[1]} + ${dos[0]} es la misma que ${dos[0]} + ${dos[1]}. ¿Cuántas válidas tiene n?`, 'ciruela'),
    ],
  ],
});
