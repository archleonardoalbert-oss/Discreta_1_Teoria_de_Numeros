// Teorema Fundamental de la Aritmética. Existencia: el árbol de factores crece nivel a nivel (inducción fuerte;
// cada hijo nace de su padre). Unicidad: un segundo árbol con otra forma; las hojas de ambos bajan volando a dos
// filas ordenadas p₁ ≤ … ≤ p_R y q₁ ≤ … ≤ q_S, y los pares iguales se cancelan uno a uno (p₁ = q₁, luego n/p₁).
import { escenaPorCapas, conPuentes, rotulo, linea, ANCHO } from '../comun.js';
import { cajas, anchoCaja } from '../piezas/cajas.js';
import { construirArbol, otroArbol, arbolFactores, hojas } from '../piezas/arbol.js';

const YA = 108, CAJA_A = { x: 24, ancho: 300 }, CAJA_B = { x: 356, ancho: 300 }, XF = 150;

const ALTO0 = ({ YQ }) => YQ + 104;

export default escenaPorCapas({
  entradas: [{ id: 'n', etiqueta: 'n', valor: 180, min: 2, max: 9999 }],
  preparar({ n }) {
    const raizB = otroArbol(n);
    const A = arbolFactores('A', construirArbol(n, 'menor'), { x: CAJA_A.x, y: YA, ancho: CAJA_A.ancho, alto: 200 });
    const B = arbolFactores('B', raizB, { x: CAJA_B.x, y: YA, ancho: CAJA_B.ancho, alto: 200 });
    const ordenar = (hs) => [...hs].sort((u, v) => u.v - v.v || u.x - v.x);
    const P = ordenar(A.posHojas), Q = ordenar(B.posHojas), L = P.length;
    // filas de cajas que caben: con muchos factores, cajas y huecos más estrechos
    const minAncho = L > 9 ? 28 : 38;
    const total = P.reduce((s, h) => s + anchoCaja(h.v, minAncho), 0);
    const hueco = L > 1 ? Math.max(6, Math.min(22, (ANCHO - 28 - XF - total) / (L - 1))) : 22;
    const xs = []; let cx = XF;
    P.forEach((h) => { const w = anchoCaja(h.v, minAncho); xs.push(cx + w / 2); cx += w + hueco; });
    const YP = YA + Math.max(A.altoUsado, B.altoUsado) + 44, YQ = YP + 72;
    const fila = (id, hs, y, colores = {}) => cajas(id, { x: XF, y, hueco, minAncho, valores: hs.map((h) => h.v), desde: hs.map((h) => h.k), colores: hs.map((_, i) => colores[i] ?? 'cian') });
    return { A, B, P, Q, xs, fila, YP, YQ, primo: L === 1, unaForma: hojas(raizB).length <= 2 };
  },
  alto: (c) => ALTO0(c) + 26,
  capas: conPuentes([
    () => [rotulo('tA', CAJA_A.x, 30, 'existencia', 'tenue'), rotulo('tB', CAJA_B.x, 30, 'unicidad', 'tenue')],
    ({ n }) => [{ ...rotulo('tA', CAJA_A.x, 30, 'existencia', 'cian'), ref: true }, rotulo('A:nr', CAJA_A.x + CAJA_A.ancho / 2, YA, String(n), 'cian', 'middle')],
    () => [rotulo('baseA', CAJA_A.x + 110, 30, 'n = 2: ya es primo', 'ambar')],
    () => [{ ...rotulo('hipA', 24, 56, 'hipótesis: todo m con 2 ≤ m < n es producto de primos', 'violeta'), supuesto: true }],
    ({ A, n, primo }) => [...A, ...(primo ? [rotulo('A:primo', CAJA_A.x + CAJA_A.ancho / 2, YA + 40, `${n} es primo: ya está`, 'ambar', 'middle')] : [])],
    ({ B, unaForma, primo }) => [
      { ...rotulo('tB', CAJA_B.x, 30, 'unicidad', 'cian'), ref: true }, ...B,
      ...(unaForma && !primo ? [rotulo('B:una', ANCHO - 24, YA + 70, 'dos primos: solo cambia el orden', 'tenue', 'end')] : []),
    ],
    () => [rotulo('baseB', CAJA_B.x + 90, 30, 'n = 2: única', 'ambar')],
    () => [{ ...rotulo('hipB', 24, 78, 'hipótesis: todo m < n se factoriza de una sola forma', 'violeta'), supuesto: true }],
    ({ P, Q, fila, YP, YQ }) => {
      const j = Q.findIndex((q) => q.v === P[0].v);
      return [
        rotulo('tP', 24, YP, 'p₁ ≤ p₂ ≤ …', 'cian'), rotulo('tQ', 24, YQ, 'q₁ ≤ q₂ ≤ …', 'cian'),
        ...fila('P', P, YP, { 0: 'ambar' }), ...fila('Q', Q, YQ, { [j]: 'ambar' }),
        rotulo('n8', 24, YQ + 44, `p₁ = ${P[0].v} divide a q₁⋯qₛ  ⇒  p₁ = qⱼ  ⇒  p₁ ≥ q₁`, 'texto'),
      ];
    },
    ({ P, Q, xs, fila, YP, YQ }) => [
      linea('par0', xs[0], YP + 12, xs[0], YQ - 24, 'verde'),
      ...fila('P', P, YP, { 0: 'verde' }).filter((n) => /:(b|v)0$/.test(n.k)),
      ...fila('Q', Q, YQ, { 0: 'verde' }).filter((n) => /:(b|v)0$/.test(n.k)),
      rotulo('n9', 24, YQ + 66, `y del mismo modo q₁ ≥ p₁:  p₁ = q₁ = ${P[0].v}, se cancelan`, 'verde'),
    ],
    ({ P, Q, xs, fila, YP, YQ, primo, n }) => [
      // el resto de pares se cancela uno tras otro: es la hipótesis aplicada a n/p₁ < n
      ...xs.slice(1).map((x, i) => ({ ...linea(`par${i + 1}`, x, YP + 12, x, YQ - 24, 'verde'), orden: i + 1 })),
      ...[...fila('P', P, YP, Object.fromEntries(P.map((_, i) => [i, 'verde']))), ...fila('Q', Q, YQ, Object.fromEntries(Q.map((_, i) => [i, 'verde'])))]
        .filter((m) => /:(b|v)\d+$/.test(m.k) && !/:(b|v)0$/.test(m.k)).map((m) => ({ ...m, orden: Number(m.k.match(/\d+$/)[0]) })),
      rotulo('n10', 24, YQ + 88, primo ? `${n} es primo: n/p₁ = 1 y no queda nada más que comparar` : 'quitando p₁ = q₁ queda n/p₁ < n, que es única:  R = S y pᵢ = qᵢ', 'verde'),
    ],
  ], {
    8: () => ['p₁ | qⱼ ⇒ p₁ = qⱼ (corolario de los primos); qⱼ ≥ q₁ por el orden', 'texto'],
  }, (c) => ALTO0(c) + 8),
});
