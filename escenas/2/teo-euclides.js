// Algoritmo de Euclides como rectángulo a × b cortado en los mayores cuadrados posibles: cada fila corta q cuadrados
// de lado b y deja un rectángulo b × r. El lado del último cuadrado es el mcd. La lupa reescala el corte actual.
import { escenaPorCapas, rotulo, cadena, elegir, filas as lineas, ANCHO } from '../comun.js';
import { rectanguloEuclides } from '../piezas/rectanguloEuclides.js';
import { textoFila, filasVisibles } from '../piezas/euclides.js';
import { euclides } from '../../motor/aritmetica.js';

const Y0 = 52, CAJA = { ancho: 300, alto: 170 }, XL = 360, DYF = 21;
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
    const visibles = filasVisibles(filas.length);
    const yFilas = Y0 + CAJA.alto + 30;
    // vista(h): rectángulo con las filas 0…h−1 cortadas, lupa de la fila h−1 y la lista de filas hechas
    const vista = (h) => {
      const f = filas[h - 1];
      return [
        rotulo('Et', 24, Y0 - 14, `rectángulo ${a} × ${b}`, 'texto'),
        ...rectanguloEuclides('E', filas, { x: 24, y: Y0, ...CAJA, hasta: h }),
        rotulo('Lt', XL, Y0 - 14, `lupa: ${textoFila(f)}`, 'ambar'),
        // cada fila tiene su propia lupa; las de otras filas se retiran (las capas se acumulan)
        ...filas.flatMap((g, j) => (j === h - 1 ? [] : rectanguloEuclides(`L${j}_`, [g], { x: XL, y: Y0, ...CAJA }).map((n) => ({ k: n.k, quitar: true })))),
        ...rectanguloEuclides(`L${h - 1}_`, [f], { x: XL, y: Y0, ...CAJA, verdeUltima: f.r === 0 }),
        ...lineas('F', visibles.filter((i) => i < h).map((i) => textoFila(filas[i])), { x: 24, y: yFilas, dy: DYF, actual: visibles.filter((i) => i < h).length - 1 }),
      ];
    };
    return { filas, mcd, restos, vista, yNotas: yFilas + Math.min(filas.length, 8) * DYF + 12 };
  },
  alto: ({ yNotas }) => yNotas + 3 * 24 + 16,
  capas: [
    ({ vista }) => vista(1),
    ({ filas, vista }) => vista(Math.min(2, filas.length)),
    ({ filas, vista }) => vista(Math.max(1, filas.length - 1)),
    ({ filas, vista }) => vista(filas.length),
    ({ restos, yNotas }) => [rotulo('n0', 24, yNotas, elegir([`restos: ${restos.join(' > ')} — bajan y llegan a 0 (PBO)`, `restos: ${restos.join(' > ')}`, `restos: ${restos.slice(0, 3).join(' > ')} > … > ${restos.at(-1)} (PBO)`], ANCHO - 48), 'texto')],
    ({ filas, yNotas }) => [rotulo('n1', 24, yNotas + 24, cadena(filas.map((f) => `mcd(${f.a}, ${f.b})`)), 'texto')],
    ({ a, b, mcd, yNotas }) => [rotulo('res', ANCHO / 2, yNotas + 56, `último resto ≠ 0:  r_k = ${mcd} = mcd(${a}, ${b})`, 'verde', 'middle')],
  ],
});
export { validarEuclides };
