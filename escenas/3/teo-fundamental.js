// Teorema Fundamental de la Aritmética. Existencia: el árbol de factores crece por inducción fuerte (cada hijo
// nace de su padre). Unicidad: un segundo árbol con otra forma; sus hojas y las del primero bajan volando a dos
// filas ordenadas p₁ ≤ … ≤ p_R y q₁ ≤ … ≤ q_S, que se emparejan una a una (p₁ = q₁, y por inducción el resto).
import { escenaPorCapas, rotulo, linea, sub, ANCHO } from '../comun.js';
import { cajas, anchoCaja } from '../piezas/cajas.js';
import { construirArbol, arbolFactores } from '../piezas/arbol.js';
import { r1 } from '../../motor/escala.js';

const YA = 104, ALTO_ARBOL = 200, CAJA_A = { x: 24, ancho: 300 }, CAJA_B = { x: 356, ancho: 300 };
const YP = 368, YQ = 440, XF = 150;

export default escenaPorCapas({
  entradas: [{ id: 'n', etiqueta: 'n', valor: 180, min: 2, max: 9999 }],
  preparar({ n }) {
    const A = arbolFactores('A', construirArbol(n, 'menor'), { x: CAJA_A.x, y: YA, ancho: CAJA_A.ancho, alto: ALTO_ARBOL });
    const B = arbolFactores('B', construirArbol(n, 'raiz'), { x: CAJA_B.x, y: YA, ancho: CAJA_B.ancho, alto: ALTO_ARBOL });
    const ordenar = (hs) => [...hs].sort((u, v) => u.v - v.v || u.x - v.x);
    const P = ordenar(A.posHojas), Q = ordenar(B.posHojas);
    // centros de las cajas de las filas (las dos filas son iguales: mismas hojas ordenadas)
    // hueco entre cajas: el que quepa (con muchos factores las cajas se juntan)
    const total = P.reduce((s, h) => s + anchoCaja(h.v), 0);
    const hueco = P.length > 1 ? Math.max(4, Math.min(22, (ANCHO - 24 - XF - total) / (P.length - 1))) : 22;
    const xs = []; let cx = XF;
    P.forEach((h) => { const w = anchoCaja(h.v); xs.push(cx + w / 2); cx += w + hueco; });
    return { A, B, P, Q, xs, hueco, primo: P.length === 1 };
  },
  alto: YQ + 104,
  capas: [
    () => [rotulo('tA', CAJA_A.x, 30, 'existencia', 'tenue'), rotulo('tB', CAJA_B.x, 30, 'unicidad', 'tenue')],
    ({ n }) => [{ ...rotulo('tA', CAJA_A.x, 30, 'existencia', 'cian'), ref: true }, rotulo('A:nr', CAJA_A.x + CAJA_A.ancho / 2, YA, String(n), 'cian', 'middle')],
    () => [rotulo('baseA', CAJA_A.x + 110, 30, 'n = 2: ya es primo', 'ambar')],
    () => [rotulo('hipA', CAJA_A.x, 54, 'hipótesis: todo m con 2 ≤ m < n es producto de primos', 'violeta')],
    ({ A, n, primo }) => [...A, ...(primo ? [rotulo('A:primo', CAJA_A.x + CAJA_A.ancho / 2, YA + 40, `${n} es primo: ya está`, 'ambar', 'middle')] : [])],
    ({ B }) => [{ ...rotulo('tB', CAJA_B.x, 30, 'unicidad', 'cian'), ref: true }, ...B],
    () => [rotulo('baseB', CAJA_B.x + 90, 30, 'n = 2: única', 'ambar')],
    () => [rotulo('hipB', 24, 76, 'hipótesis: todo m < n se factoriza de una sola forma', 'violeta')],
    ({ P, Q, xs, hueco }) => [
      rotulo('tP', 24, YP, 'p₁ ≤ p₂ ≤ …', 'cian'), rotulo('tQ', 24, YQ, 'q₁ ≤ q₂ ≤ …', 'cian'),
      ...cajas('P', { x: XF, y: YP, hueco, valores: P.map((h) => h.v), desde: P.map((h) => h.k), colores: P.map((_, i) => (i === 0 ? 'ambar' : 'cian')) }),
      ...cajas('Q', { x: XF, y: YQ, hueco, valores: Q.map((h) => h.v), desde: Q.map((h) => h.k), colores: Q.map((h, i) => (h.v === P[0].v && i === Q.findIndex((q) => q.v === P[0].v) ? 'ambar' : 'cian')) }),
      rotulo('n8', 24, YQ + 44, `p₁ = ${P[0].v} divide a q₁⋯q_S  ⇒  p₁ = q_j  ⇒  p₁ ≥ q₁`, 'texto'),
    ],
    ({ xs, P }) => [
      linea('par0', xs[0], YP + 12, xs[0], YQ - 24, 'verde'),
      rotulo('n9', 24, YQ + 66, `y del mismo modo q₁ ≥ p₁:  p₁ = q₁ = ${P[0].v}`, 'verde'),
    ],
    ({ xs }) => [
      ...xs.slice(1).map((x, i) => linea(`par${i + 1}`, x, YP + 12, x, YQ - 24, 'verde')),
      rotulo('n10', 24, YQ + 88, 'quitando p₁ = q₁ queda n/p₁ < n, que es única:  R = S y pᵢ = qᵢ', 'verde'),
    ],
  ],
});
