// Descomposición canónica: se factoriza (árbol), las hojas iguales vuelan a apilarse en una columna por primo
// (la altura es el exponente) y las columnas quedan ordenadas p₁ < p₂ < ….
import { escenaPorCapas, rotulo, sub, ANCHO } from '../comun.js';
import { construirArbol, arbolFactores } from '../piezas/arbol.js';
import { columnasExponentes } from '../piezas/exponentes.js';
import { canonica } from '../../motor/primos.js';

const YA = 64, BASE = 300, COL = { x: 380, ancho: 276 };

export default escenaPorCapas({
  entradas: [{ id: 'a', etiqueta: 'a', valor: 360, min: 2, max: 9999 }],
  preparar({ a }) {
    const arbol = arbolFactores('A', construirArbol(a, 'menor'), { x: 24, y: YA, ancho: 330, alto: 230 });
    const cols = columnasExponentes('X', arbol.posHojas, { x: COL.x, y: BASE, ancho: COL.ancho });
    return { arbol, cols, pares: canonica(a) };
  },
  alto: BASE + 80,
  capas: [
    ({ arbol }) => arbol,
    ({ cols }) => [...cols, rotulo('tc', ANCHO - 24, YA - 34, 'primos iguales apilados: la altura es el exponente', 'texto', 'end')],
    ({ a, cols, pares }) => [
      ...pares.map(([p], j) => rotulo(`ord${j}`, COL.x + (COL.ancho / pares.length) * (j + 0.5), BASE + 40, `p${sub(j + 1)}`, 'tenue', 'middle')),
      rotulo('res', ANCHO / 2, BASE + 68, `${a} = ${cols.formula}`, 'verde', 'middle'),
    ],
  ],
});
