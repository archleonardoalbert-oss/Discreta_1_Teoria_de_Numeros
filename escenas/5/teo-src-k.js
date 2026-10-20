// k·SRC es SRC: arriba los aᵢ en su columna, abajo los kaᵢ. Primero el mundo supuesto (punteado): dos flechas que
// chocan abajo obligarían a dos aᵢ en la misma columna arriba, y arriba se ve que no. Al cerrar el contrarrecíproco
// aparecen las flechas reales x ↦ kx: cada columna de abajo recibe exactamente una.
import { escenaPorCapas, rotulo, nota, flecha, num } from '../comun.js';
import { geoFilas, filasFlechas, mod } from '../piezas/modular.js';
import { validarSRC } from './def-src.js';
import { mcd } from '../../motor/aritmetica.js';
import { r1 } from '../../motor/escala.js';

const Y1 = 280, Y2 = 410;

export default escenaPorCapas({
  entradas: [
    { id: 'n', etiqueta: 'n', valor: 5, min: 2, max: 8 }, { id: 'k', etiqueta: 'k', valor: 3, min: -20, max: 30 },
    { id: 'as', etiqueta: 'aᵢ', valor: [10, 21, -3, 8, 4], min: -40, max: 60, lista: { min: 2, max: 8 } },
  ],
  validar: ({ n, k, as }) => validarSRC(n, as) ?? (mcd(k, n) !== 1 ? `mcd(${k}, ${n}) = ${mcd(k, n)}: el teorema pide (k, n) = 1` : null),
  preparar({ n, as }) {
    const g = geoFilas(n, { x: 40, ancho: 600, y1: Y1, y2: Y2 }), et = Object.fromEntries(as.map((v) => [v, num(v)]));
    const [i, j] = [0, 1], ci = mod(as[i], n), cj = mod(as[j], n);
    return { g, et, ci, cj };
  },
  alto: Y2 + 70,
  base: ({ g, n, as, et }) => [
    ...filasFlechas('F', g, (x) => x, { xs: as, etiquetas: et, colorArriba: () => 'ciruela' }).nodos.filter((m) => /^F:(a|pa|b|pb)\d+$/.test(m.k)),
    rotulo('la', 24, Y1 - 6, 'aᵢ', 'ciruela'), rotulo('lb', 24, Y2 + 22, 'kaᵢ', 'texto'),
  ],
  capas: [
    ({ g, ci, cj, n }) => {
      const dest = Math.floor(n / 2);
      return [
        { ...flecha('s1', g.px(ci), Y1 + 8, g.px(dest), Y2 - 9, 'ambar'), supuesto: true },
        { ...flecha('s2', g.px(cj), Y1 + 8, g.px(dest), Y2 - 9, 'ambar'), supuesto: true },
        nota('n0', 0, 'supongamos que {kaᵢ} no es un SRC (punteado: es un mundo supuesto)', 'ambar'),
      ];
    },
    ({ n }) => [nota('n1', 1, `entonces hay i ≠ j con kaᵢ ≡ kaⱼ (mod ${n})`, 'ambar')],
    ({ g, n }) => [
      { k: 'choque', t: 'circle', a: { cx: g.px(Math.floor(n / 2)), cy: Y2, r: 11 }, c: 'ambar', hueco: true, supuesto: true },
      nota('n2', 2, 'dos flechas caen en la misma columna de abajo', 'ambar'),
    ],
    ({ g, ci, cj, k, n }) => [
      { k: 'arr', t: 'path', a: { d: `M ${g.px(ci)} ${Y1 - 30} Q ${r1((g.px(ci) + g.px(cj)) / 2)} ${Y1 - 70} ${g.px(cj)} ${Y1 - 30}` }, c: 'ambar', supuesto: true },
      rotulo('arrt', (g.px(ci) + g.px(cj)) / 2, Y1 - 58, 'aᵢ ≡ aⱼ ?', 'ambar', 'middle'),
      nota('n3', 3, `como (${k}, ${n}) = 1, se cancela k: aᵢ ≡ aⱼ (mod ${n})`, 'texto'),
    ],
    ({ k, n }) => [nota('n4', 4, `(corolario de cancelación: mcd(${k}, ${n}) = 1)`, 'tenue')],
    () => [nota('n5', 5, 'pero arriba cada aᵢ está en una columna distinta: {aᵢ} no sería SRC', 'ambar')],
    () => [nota('n6', 6, '«no SRC abajo ⇒ no SRC arriba» equivale a «SRC arriba ⇒ SRC abajo»', 'texto')],
    ({ g, as, k, et, n }) => [
      ...['s1', 's2', 'choque', 'arr', 'arrt'].map((kk) => ({ k: kk, quitar: true })),
      ...filasFlechas('F', g, (x) => k * x, { xs: as, etiquetas: et, colorArriba: () => 'ciruela', colorFlecha: () => 'verde', contar: true }).nodos.filter((m) => /^F:(f|n)\d+$/.test(m.k)),
      nota('n7', 7, `las flechas reales x ↦ ${k}x: una por columna, {kaᵢ} es un SRC(${n})`, 'verde'),
    ],
  ],
});
