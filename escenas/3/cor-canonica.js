// La forma canónica es única: dos árboles distintos del mismo n terminan en columnas idénticas.
import { escenaPorCapas, rotulo, ANCHO } from '../comun.js';
import { construirArbol, otroArbol, arbolFactores } from '../piezas/arbol.js';
import { columnasExponentes } from '../piezas/exponentes.js';

const YA = 60, BASE = 400;

export default escenaPorCapas({
  entradas: [{ id: 'n', etiqueta: 'n', valor: 180, min: 2, max: 9999 }],
  preparar({ n }) {
    const A = arbolFactores('A', construirArbol(n, 'menor'), { x: 24, y: YA, ancho: 300, alto: 190 });
    const B = arbolFactores('B', otroArbol(n), { x: 356, y: YA, ancho: 300, alto: 190 });
    const base = Math.max(BASE, YA + Math.max(A.altoUsado, B.altoUsado) + 150);
    return {
      A, B, base,
      XA: columnasExponentes('XA', A.posHojas, { x: 24, y: base, ancho: 300, altoMax: 110 }),
      XB: columnasExponentes('XB', B.posHojas, { x: 356, y: base, ancho: 300, altoMax: 110 }),
    };
  },
  alto: ({ base }) => base + 96,
  capas: [
    ({ A, XA, base }) => [...A, ...XA, rotulo('t0', 24, base + 54, 'existencia: el árbol da los primos; agruparlos da la forma canónica', 'texto')],
    ({ B, base }) => [...B, rotulo('t0', 24, base + 54, 'dos formas posibles = dos factorizaciones en primos (otro árbol)', 'texto')],
    ({ XB, base }) => [...XB, rotulo('t0', 24, base + 54, 'TFA: mismos primos, cada uno el mismo número de veces', 'texto')],
    ({ XA, XB, base }) => [...XA.map((n) => ({ ...n, ref: true })), ...XB.map((n) => ({ ...n, ref: true })), rotulo('t0', 24, base + 54, 'la altura de cada columna es el exponente: coinciden', 'texto')],
    ({ n, XA, base }) => [rotulo('res', ANCHO / 2, base + 80, `y el orden está fijado: ${n} = ${XA.formula}, una sola forma`, 'verde', 'middle')],
  ],
});
