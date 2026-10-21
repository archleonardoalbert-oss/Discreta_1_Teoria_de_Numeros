// Cancelación: la aplicación x ↦ cx (mod n) entre dos filas 0…n−1. Con d = mcd(c, n) > 1 pliega: a cada imagen
// llegan d flechas, desde números separados s = n/d. Por eso de ca ≡ cb solo se recupera a ≡ b (mod n/d).
import { escenaPorCapas, conPuentes, rotulo, nota } from '../comun.js';
import { geoFilas, filasFlechas, mod } from '../piezas/modular.js';
import { mcd } from '../../motor/aritmetica.js';
import { r1 } from '../../motor/escala.js';

const Y1 = 190, Y2 = 330;

export const aplicacion = (id, n, c, { a, b, fibra = [], xs } = {}) => {
  const g = geoFilas(n, { x: 40, ancho: 600, y1: Y1, y2: Y2 });
  const color = (x) => (x === a ? 'ciruela' : x === b ? 'cian' : fibra.includes(x) ? 'verde' : 'muy-tenue');
  return { g, ...filasFlechas(id, g, (x) => c * x, { xs, colorFlecha: color, colorArriba: (x) => (color(x) === 'muy-tenue' ? 'texto' : color(x)) }) };
};

const ALTO0 = () => Y2 + 90;

export default escenaPorCapas({
  entradas: [
    { id: 'c', etiqueta: 'c', valor: 4, min: 1, max: 20 }, { id: 'n', etiqueta: 'n', valor: 10, min: 2, max: 12 },
    { id: 'a', etiqueta: 'a', valor: 3, min: 0, max: 11 }, { id: 'b', etiqueta: 'b', valor: 8, min: 0, max: 11 },
  ],
  validar: ({ c, n, a, b }) => (a >= n || b >= n ? `a y b entre 0 y n − 1 = ${n - 1}` : mod(c * a, n) !== mod(c * b, n) ? `${c}·${a} ≢ ${c}·${b} (mod ${n}): las flechas de a y b no llegan al mismo sitio` : null),
  preparar({ c, n, a, b }) {
    const d = mcd(c, n), s = n / d, img = mod(c * a, n);
    const fibra = Array.from({ length: n }, (_, x) => x).filter((x) => mod(c * x, n) === img);
    return { d, s, r: c / d, img, fibra };
  },
  alto: (c) => ALTO0(c) + 26,
  capas: conPuentes([
    ({ c, n, a, b, img }) => {
      const { g, nodos } = aplicacion('F', n, c, { a, b });
      return [
        ...nodos,
        rotulo('arr', 24, Y1 - 6, 'x', 'texto'), rotulo('abj', 24, Y2 + 22, `${c}x`, 'texto'),
        { k: 'aimg', t: 'circle', a: { cx: g.px(img), cy: Y2, r: 11 }, c: 'ambar', hueco: true },
        nota('n0', 0, `${c}·${a} ≡ ${c}·${b} (mod ${n}): las dos flechas llegan a ${img};  c(a − b) = ${c * (a - b)} = kn`, 'texto'),
      ];
    },
    ({ c, n, d, s, r }) => {
      const { nodos } = aplicacion('F', n, c, {});
      return [
        ...nodos.filter((m) => /^F:n\d+$/.test(m.k)),
        ...filasFlechas('F', geoFilas(n, { x: 40, ancho: 600, y1: Y1, y2: Y2 }), (x) => c * x, { contar: true }).nodos.filter((m) => /^F:n\d+$/.test(m.k)),
        nota('n1', 1, `d = mcd(${c}, ${n}) = ${d}:  c = d·r = ${d}·${r},  n = d·s = ${d}·${s},  (r, s) = 1`, 'violeta'),
      ];
    },
    ({ d, s, r, a, b }) => [nota('n2', 2, `d·r(a − b) = k·d·s  ⇒  r(a − b) = ks:  ${r}·(${a - b}) = k·${s}`, 'texto')],
    ({ a, b, s, n }) => {
      const g = geoFilas(n, { x: 40, ancho: 600, y1: Y1, y2: Y2 }), lo = Math.min(a, b), hi = Math.max(a, b);
      return [
        ...(s && hi > lo ? Array.from({ length: (hi - lo) / s }, (_, i) => ({ k: `ss${i}`, t: 'path', a: { d: `M ${g.px(lo + i * s)} ${Y1 - 22} Q ${r1((g.px(lo + i * s) + g.px(lo + (i + 1) * s)) / 2)} ${Y1 - 22 - 36} ${g.px(lo + (i + 1) * s)} ${Y1 - 22}` }, c: 'verde', orden: i })) : []),
        nota('n3', 3, `s | r(a − b) y (r, s) = 1  ⇒  s = ${s} divide a a − b = ${a - b}`, 'verde'),
      ];
    },
    ({ c, n, a, b, fibra, s, d, img }) => {
      const { nodos } = aplicacion('F', n, c, { a, b, fibra });
      return [
        ...nodos.filter((m) => !/^F:(b|pb)\d+$/.test(m.k)),
        nota('n4', 4, [`a ≡ b (mod n/d = ${s}): ${fibra.join(', ')} van todos a ${img}, separados ${s}`, `a ≡ b (mod n/d = ${s}): las ${d} flechas que llegan a ${img} salen cada ${s}`], 'verde'),
      ];
    },
  ], {
    1: () => ['(r, s) = 1: si e > 1 dividiera a ambos, d·e dividiría a c y a n', 'texto'],
    3: () => ['Conferencia 2: s | r·x y (s, r) = 1 ⇒ s | x', 'texto'],
  }, (c) => ALTO0(c) + 8),
});
