// Combinación lineal: b₁ saltos de a₁ y luego b₂ saltos de a₂; se termina en c.
import { escenaPorCapas, planPara, carril, rotulo, rotuloDentro, linea, ANCHO } from '../comun.js';
import { recta, punto } from '../primitivas.js';

const Y1 = 64, Y2 = 128, EJE = 184;

export default escenaPorCapas({
  entradas: [
    { id: 'a1', etiqueta: 'a₁', valor: 5, min: -5000, max: 5000 },
    { id: 'b1', etiqueta: 'b₁', valor: -2, min: -200, max: 200 },
    { id: 'a2', etiqueta: 'a₂', valor: 3, min: -5000, max: 5000 },
    { id: 'b2', etiqueta: 'b₂', valor: 6, min: -200, max: 200 },
  ],
  preparar({ a1, b1, a2, b2 }) {
    const p1 = a1 * b1, c = p1 + a2 * b2;
    return { p1, c, p: planPara([p1, c]) };
  },
  alto: EJE + 54,
  base: ({ p }) => recta('eje', p, EJE),
  capas: [
    ({ p }) => punto('cero', p, 0, EJE, { c: 'texto', etiqueta: 'inicio' }),
    ({ a1, b1, p1, p }) => [
      ...carril('c1', p, Y1, { salto: a1, n: b1, c: 'cian', etiqueta: `b₁ = ${b1} saltos de a₁ = ${a1}` }),
      linea('g1', p.x(p1), Y1, p.x(p1), Y2),
      rotuloDentro('r1', p.x(p1) + 6, Y1 + 16, `a₁·b₁ = ${p1}`, 'cian'),
    ],
    ({ a2, b2, p1, c, p }) => [
      ...carril('c2', p, Y2, { salto: a2, n: b2, desde: p1, c: 'violeta', etiqueta: `b₂ = ${b2} saltos de a₂ = ${a2}` }),
      linea('g2', p.x(c), Y2, p.x(c), EJE),
    ],
    ({ a1, b1, a2, b2, c, p }) => [
      ...punto('pc', p, c, EJE, { c: 'ciruela', etiqueta: `c = ${c}` }),
      rotulo('res', ANCHO / 2, 26, `c = ${a1}·${b1 < 0 ? `(${b1})` : b1} + ${a2}·${b2 < 0 ? `(${b2})` : b2} = ${c}`, 'verde', 'middle'),
    ],
  ],
});
