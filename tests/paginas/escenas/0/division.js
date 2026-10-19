// Escena de prueba: algoritmo de la división en la recta.
import { planRecta } from '../../../../motor/escala.js';
import { recta, saltos, punto, llave } from '../../../../escenas/primitivas.js';
import { division } from '../../../../motor/aritmetica.js';

const vista = () => ({ ancho: 640, alto: 200 });
export default {
  entradas: [
    { id: 'a', etiqueta: 'a', valor: 17, min: -200, max: 200 },
    { id: 'b', etiqueta: 'b', valor: 5, min: 1, max: 50 },
  ],
  validar: () => null,
  vista,
  estado({ a, b }, paso) {
    const { q, r } = division(a, b);
    const p = planRecta({ min: Math.min(0, a) - b, max: Math.max(0, a) + b, ancho: vista().ancho });
    const ns = [...recta('r', p, 130), ...punto('a', p, a, 130, { c: 'ciruela', etiqueta: `a = ${a}` })];
    if (paso >= 1) ns.push(...saltos('s', p, { desde: 0, salto: b, n: q, y: 130, c: 'cian' }));
    if (paso >= 2) ns.push(...llave('r', p, b * q, a, 140, `r = ${r}`, 'ambar'));
    return ns;
  },
};
