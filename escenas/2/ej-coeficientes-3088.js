// Ejemplo de la conferencia: la tabla de 3088 y 456 y, en la recta, 22 saltos de 3088 a la izquierda y 149 de 456 a la derecha.
import { escenaPorCapas, planPara, carril, rotulo, linea, por, nSaltos, ANCHO } from '../comun.js';
import { recta, punto } from '../primitivas.js';
import { tablaCoeficientes } from '../piezas/coeficientes.js';
import { euclides, coeficientes } from '../../motor/aritmetica.js';
import { validarEuclides } from './teo-euclides.js';

const Y0 = 36, DY = 26, FILAS_TABLA = 6;

export default escenaPorCapas({
  entradas: [
    { id: 'a', etiqueta: 'a', valor: 3088, min: 1, max: 5000 },
    { id: 'b', etiqueta: 'b', valor: 456, min: 1, max: 5000 },
  ],
  validar: validarEuclides,
  preparar({ a, b }) {
    const { filas, mcd } = euclides(a, b), c = coeficientes(a, b), k = c.pasos.length;
    const yRecta = Y0 + filas.length * DY + 40;
    return { filas, mcd, c, k, yRecta, eje: yRecta + 112, p: planPara([a * c.x, mcd]) };
  },
  alto: ({ eje }) => eje + 64,
  capas: [
    ...Array.from({ length: FILAS_TABLA }, (_, i) => ({ filas, c, k }) =>
      tablaCoeficientes('t', filas, c.pasos, { y0: Y0, dy: DY, hasta: i === FILAS_TABLA - 1 ? k : Math.min(i + 1, k), usada: -1 })),
    ({ a, b, c, mcd, yRecta, eje, p }) => [
      ...recta('eje', p, eje),
      ...carril('l1', p, yRecta, { salto: a, n: c.x, c: 'cian', etiqueta: nSaltos(c.x, a) }),
      ...carril('l2', p, yRecta + 52, { salto: b, n: c.y, desde: a * c.x, c: 'violeta', etiqueta: nSaltos(c.y, b) }),
      linea('g1', p.x(a * c.x), yRecta, p.x(a * c.x), yRecta + 52),
      linea('g2', p.x(mcd), yRecta + 52, p.x(mcd), eje),
      ...punto('fin', p, mcd, eje, { c: 'verde', etiqueta: String(mcd) }),
      rotulo('res', ANCHO / 2, eje + 52, `${mcd} = mcd(${a}, ${b}) = ${por(a, c.x)} + ${por(b, c.y)}`, 'verde', 'middle'),
    ],
  ],
});
