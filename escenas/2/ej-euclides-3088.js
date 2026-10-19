// Ejemplo de la conferencia: Euclides con 3088 y 456, una fila por paso.
import { escenaPorCapas, rotulo, ANCHO } from '../comun.js';
import { carrilesEuclides, altoEuclides } from '../piezas/euclides.js';
import { euclides } from '../../motor/aritmetica.js';
import { validarEuclides } from './teo-euclides.js';

const Y0 = 40, DY = 46, FILAS_TEXTO = 7;

export default escenaPorCapas({
  entradas: [
    { id: 'a', etiqueta: 'a', valor: 3088, min: 1, max: 5000 },
    { id: 'b', etiqueta: 'b', valor: 456, min: 1, max: 5000 },
  ],
  validar: validarEuclides,
  preparar({ a, b }) {
    const { filas, mcd } = euclides(a, b);
    return { filas, mcd, yRes: Y0 + altoEuclides(filas.length, DY) + 16 };
  },
  alto: ({ yRes }) => yRes + 30,
  capas: [
    ...Array.from({ length: FILAS_TEXTO }, (_, i) => ({ filas }) =>
      carrilesEuclides('e', filas, { y0: Y0, dy: DY, hasta: i === FILAS_TEXTO - 1 ? filas.length : i + 1 })),
    ({ filas, a, b, mcd, yRes }) => [
      ...carrilesEuclides('e', filas, { y0: Y0, dy: DY, verdeFinal: true }),
      rotulo('res', ANCHO / 2, yRes, `${mcd} es el último resto distinto de 0:  mcd(${a}, ${b}) = ${mcd}`, 'verde', 'middle'),
    ],
  ],
});
