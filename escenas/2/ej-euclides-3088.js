// Ejemplo de la conferencia: Euclides con 3088 y 456, una fila por paso.
import { escenaPorCapas, rotulo, por, ANCHO } from '../comun.js';
import { carrilesEuclides, altoEuclides } from '../piezas/euclides.js';
import { euclides, euclidesExtendido } from '../../motor/aritmetica.js';
import { validarEuclides } from './teo-euclides.js';

const Y0 = 40, DY = 46, FILAS_TEXTO = 7;

export default escenaPorCapas({
  entradas: [
    { id: 'a', etiqueta: 'a', valor: 3088, min: 1, max: 5000 },
    { id: 'b', etiqueta: 'b', valor: 456, min: 1, max: 5000 },
  ],
  validar: validarEuclides,
  preparar({ a, b }) {
    const { mcd } = euclides(a, b), filas = euclidesExtendido(a, b);
    // cada resto lleva escrita su expresión r = a·s + b·t: la siguiente sale con una sola resta
    const etiquetaResto = (i, f) => `r = ${f.r} = ${por(a, f.s)} + ${por(b, f.t)}`;
    const dibujar = (hasta, extra = {}) => carrilesEuclides('e', filas, { y0: Y0, dy: DY, hasta, etiquetaResto, ...extra });
    return { filas, mcd, dibujar, yRes: Y0 + altoEuclides(filas.length, DY) + 16 };
  },
  alto: ({ yRes }) => yRes + 30,
  capas: [
    ...Array.from({ length: FILAS_TEXTO }, (_, i) => ({ filas, dibujar }) => {
      const hasta = i === FILAS_TEXTO - 1 ? filas.length : Math.min(i + 1, filas.length);
      // la fila nueva usa los restos de las dos anteriores: se reiluminan sus etiquetas
      const usados = new Set([`e${hasta - 2}:rt`, `e${hasta - 3}:rt`]);
      return dibujar(hasta).map((n) => (usados.has(n.k) ? { ...n, ref: true } : n));
    }),
    ({ a, b, mcd, yRes, dibujar, filas }) => [
      ...dibujar(filas.length, { verdeFinal: true }),
      rotulo('res', ANCHO / 2, yRes, `${mcd} es el último resto distinto de 0:  mcd(${a}, ${b}) = ${mcd}`, 'verde', 'middle'),
    ],
  ],
});
