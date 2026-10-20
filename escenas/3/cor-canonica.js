// La forma canónica es única: dos árboles distintos del mismo n terminan en columnas idénticas.
import { escenaPorCapas, rotulo, ANCHO } from '../comun.js';
import { construirArbol, arbolFactores } from '../piezas/arbol.js';
import { columnasExponentes } from '../piezas/exponentes.js';

const YA = 60, BASE = 400;

export default escenaPorCapas({
  entradas: [{ id: 'n', etiqueta: 'n', valor: 180, min: 2, max: 9999 }],
  preparar({ n }) {
    const A = arbolFactores('A', construirArbol(n, 'menor'), { x: 24, y: YA, ancho: 300, alto: 190 });
    const B = arbolFactores('B', construirArbol(n, 'raiz'), { x: 356, y: YA, ancho: 300, alto: 190 });
    return {
      A, B,
      XA: columnasExponentes('XA', A.posHojas, { x: 24, y: BASE, ancho: 300, altoMax: 110 }),
      XB: columnasExponentes('XB', B.posHojas, { x: 356, y: BASE, ancho: 300, altoMax: 110 }),
    };
  },
  alto: BASE + 74,
  capas: [
    ({ A, B }) => [...A, ...B],
    ({ XA, XB }) => [...XA, ...XB],
    ({ n, XA }) => [rotulo('res', ANCHO / 2, BASE + 58, `mismas columnas, misma forma canónica:  ${n} = ${XA.formula}`, 'verde', 'middle')],
  ],
});
