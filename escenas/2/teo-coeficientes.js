// Combinación lineal desde Euclides: la tabla Aᵢ, Bᵢ usa los cocientes de abajo arriba (q_k primero, q₁ al final).
import { escenaPorCapas, conPuentes, rotulo, por, ANCHO } from '../comun.js';
import { tablaCoeficientes } from '../piezas/coeficientes.js';
import { euclides, coeficientes } from '../../motor/aritmetica.js';
import { validarEuclides } from './teo-euclides.js';

const Y0 = 36, DY = 26;

const ALTO0 = ({ yRes }) => yRes + 30;

export default escenaPorCapas({
  entradas: [
    { id: 'a', etiqueta: 'a', valor: 150, min: 1, max: 5000 },
    { id: 'b', etiqueta: 'b', valor: 42, min: 1, max: 5000 },
  ],
  validar: validarEuclides,
  preparar({ a, b }) {
    const { filas, mcd } = euclides(a, b), c = coeficientes(a, b), k = c.pasos.length;
    // fila de Euclides cuyo cociente usa la fila i de la tabla: q_{k−i+1} está en la fila k−i (0-based)
    const tabla = (hasta) => tablaCoeficientes('t', filas, c.pasos, { y0: Y0, dy: DY, hasta, usada: hasta >= 1 && hasta <= k ? k - hasta : -1 });
    return { filas, mcd, c, k, tabla, yRes: Y0 + Math.max(filas.length, 1) * DY + 20 };
  },
  alto: (c) => ALTO0(c) + 26,
  capas: conPuentes([
    ({ tabla, k, yRes, b }) => k ? tabla(1) : [rotulo('n0', 24, yRes - 24, `b | a: el mcd es b = ${b} = a·0 + b·1`, 'texto')],
    ({ tabla, k }) => (k ? tabla(Math.min(2, k)) : []),
    ({ tabla, k, yRes }) => (!k ? [] : k <= 3
      ? [...tabla(Math.max(1, k - 1)), rotulo('nm', 24, yRes - 24, `(con estos números no hay filas intermedias: k = ${k})`, 'tenue')]
      : tabla(k - 1)),
    ({ tabla, k }) => (k ? tabla(k) : []),
    ({ a, b, c, mcd, yRes }) => [rotulo('res', ANCHO / 2, yRes, `r_k = a·A_k + b·B_k = ${por(a, c.x)} + ${por(b, c.y)} = ${mcd}`, 'verde', 'middle')],
  ], {
    0: () => ['de la penúltima división: r_k = 1·r_{k−2} + (−q_k)·r_{k−1}', 'texto'],
    2: () => ['se sustituye el resto más reciente por su despeje r_j = r_{j−2} − q_j·r_{j−1}', 'texto'],
  }, (c) => ALTO0(c) + 8),
});
