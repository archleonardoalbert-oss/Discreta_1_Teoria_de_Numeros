// Primo: n cuadraditos siempre forman la fila 1 × n. Se intenta repartirlos en filas de 2, de 3, …: cada intento
// es una «ficha» que completa un rectángulo (verde) o deja una fila incompleta (ámbar). Un primo solo admite la fila.
import { escenaPorCapas, rotulo, ANCHO } from '../comun.js';
import { esPrimo } from '../../motor/primos.js';
import { divisores } from '../../motor/aritmetica.js';
import { r1 } from '../../motor/escala.js';

const Y1 = 60, Y2 = 150, L = 9;

// Ficha del intento «filas de a»: ⌈n/a⌉ filas de a cuadraditos (la última incompleta si a ∤ n).
function ficha(n, a, x, y, orden) {
  const ok = n % a === 0, ns = [];
  for (let i = 0; i < n; i++) {
    const f = Math.floor(i / a), c = i % a, sobra = !ok && f === Math.floor((n - 1) / a);
    ns.push({ k: `f${a}:${i}`, t: 'rect', a: { x: r1(x + c * L), y: r1(y + f * L), width: L - 1, height: L - 1 }, c: sobra ? 'ambar' : 'cian', orden });
  }
  ns.push({ ...rotulo(`f${a}:t`, x, y - 6, ok ? `de ${a}: ✓` : `de ${a}: sobran ${n % a}`, ok ? 'verde' : 'ambar'), orden });
  return ns;
}

export default escenaPorCapas({
  entradas: [{ id: 'n', etiqueta: 'n', valor: 13, min: 2, max: 30 }],
  preparar({ n }) {
    const lado = Math.min(26, (ANCHO - 140) / n);
    // fichas en filas que no se salen de la vista
    const pos = [];
    let x = 24, y = Y2 + 14, alto = 0;
    for (let a = 2; a <= Math.floor(n / 2); a++) {
      const w = Math.max(a * L, (`de ${a}: sobran ${n % a}`.length) * 7.8) + 18, h = Math.ceil(n / a) * L;
      if (x + w > ANCHO - 8) { x = 24; y += alto + 34; alto = 0; }
      pos.push([a, x, y]); x += w; alto = Math.max(alto, h);
    }
    return { lado, pos, fin: y + alto, primo: esPrimo(n) };
  },
  alto: ({ fin }) => fin + 70,
  capas: [
    ({ n, lado }) => [
      ...Array.from({ length: n }, (_, i) => ({ k: `u${i}`, t: 'rect', a: { x: r1(70 + i * lado), y: Y1, width: r1(lado - 2), height: r1(lado - 2), rx: 2 }, c: 'cian' })),
      rotulo('u1t', 60, Y1 + lado / 2 + 4, '1', 'cian', 'end'),
      rotulo('un', 70 + (n * lado) / 2, Y1 - 10, `n = ${n}`, 'cian', 'middle'),
    ],
    ({ n, pos }) => [
      rotulo('it', 24, Y2 - 12, n < 4 ? `con n = ${n} no hay otros repartos posibles (más de n/2 no caben dos filas)` : `filas de 2, 3, …, ${Math.floor(n / 2)} (con más de n/2 no caben dos filas):`, 'texto'),
      ...pos.flatMap(([a, x, y], i) => ficha(n, a, x, y, i)),
    ],
    ({ n, primo, fin, lado }) => [
      rotulo('fin', 24, fin + 40, primo ? `solo la fila 1 × ${n}: divisores positivos 1 y ${n}, ${n} es primo` : `D(${n}) = {${divisores(n).join(', ')}}: más que 1 y ${n}, ${n} es compuesto`, primo ? 'verde' : 'ambar'),
      { k: 'aroU', t: 'rect', a: { x: 64, y: Y1 - 4, width: r1(n * lado + 8), height: r1(lado + 6), rx: 6 }, c: primo ? 'verde' : 'tenue', hueco: true },
    ],
  ],
});
