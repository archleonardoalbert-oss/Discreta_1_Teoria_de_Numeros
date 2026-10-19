// Algoritmo de Euclides: cada fila usa como salto el resto de la anterior, hasta que un salto cabe exacto.
import { escenaPorCapas, rotulo, cadena, elegir, ANCHO } from '../comun.js';
import { carrilesEuclides, altoEuclides } from '../piezas/euclides.js';
import { euclides } from '../../motor/aritmetica.js';

const Y0 = 40, DY = 46;
const validarEuclides = ({ a, b }) => (b < 1 ? 'b debe ser positivo' : a <= b ? 'el teorema pide a > b' : null);

export default escenaPorCapas({
  entradas: [
    { id: 'a', etiqueta: 'a', valor: 150, min: 1, max: 5000 },
    { id: 'b', etiqueta: 'b', valor: 42, min: 1, max: 5000 },
  ],
  validar: validarEuclides,
  preparar({ a, b }) {
    const { filas, mcd } = euclides(a, b);
    const restos = [b, ...filas.map((f) => f.r)];
    return { filas, mcd, restos, yNotas: Y0 + altoEuclides(filas.length, DY) + 8 };
  },
  alto: ({ yNotas }) => yNotas + 3 * 24 + 16,
  capas: [
    ({ filas }) => carrilesEuclides('e', filas, { y0: Y0, dy: DY, hasta: 1 }),
    ({ filas }) => carrilesEuclides('e', filas, { y0: Y0, dy: DY, hasta: 2 }),
    ({ filas }) => carrilesEuclides('e', filas, { y0: Y0, dy: DY, hasta: filas.length - 1 }),
    ({ filas }) => carrilesEuclides('e', filas, { y0: Y0, dy: DY, verdeFinal: true }),
    ({ restos, yNotas }) => [rotulo('n0', 24, yNotas, elegir([`restos: ${restos.join(' > ')} — bajan y llegan a 0 (PBO)`, `restos: ${restos.join(' > ')}`, `restos: ${restos.slice(0, 3).join(' > ')} > … > ${restos.at(-1)} (PBO)`], ANCHO - 48), 'texto')],
    ({ filas, yNotas }) => [rotulo('n1', 24, yNotas + 24, cadena(filas.map((f) => `mcd(${f.a}, ${f.b})`)), 'texto')],
    ({ a, b, mcd, yNotas }) => [rotulo('res', ANCHO / 2, yNotas + 56, `último resto ≠ 0:  r_k = ${mcd} = mcd(${a}, ${b})`, 'verde', 'middle')],
  ],
});
export { validarEuclides };
