// CP-02, ejercicio 4 (planteamiento): los números a, 2a, …, ba sobre la recta y, como líneas, los múltiplos de b.
// Se ve cuáles coinciden; la pregunta es cuántos, en general.
import { escenaPorCapas, rotulo, ANCHO } from '../comun.js';
import { planRecta } from '../../motor/escala.js';
import { recta } from '../primitivas.js';

const Y = 150;

export default escenaPorCapas({
  entradas: [{ id: 'a', etiqueta: 'a', valor: 6, min: 1, max: 30 }, { id: 'b', etiqueta: 'b', valor: 8, min: 1, max: 30 }],
  preparar: ({ a, b }) => ({ plan: planRecta({ min: 0, max: a * b, ancho: ANCHO }) }),
  alto: 230,
  base: ({ plan }) => recta('r', plan, Y),
  capas: [
    ({ a, b, plan }) => [
      ...Array.from({ length: b }, (_, i) => ({ k: `ka:${i + 1}`, t: 'circle', a: { cx: plan.x((i + 1) * a), cy: Y, r: 4 }, c: 'ciruela', orden: i * 0.1 })),
      rotulo('t1', 24, 32, `ciruela: los b = ${b} números ${a}, ${2 * a}, …, ${b}·${a}`, 'ciruela'),
    ],
    ({ a, b, plan }) => [
      ...Array.from({ length: a }, (_, i) => ({ k: `mb:${i + 1}`, t: 'line', a: { x1: plan.x((i + 1) * b), y1: Y - 26, x2: plan.x((i + 1) * b), y2: Y + 8 }, c: 'cian', orden: i * 0.1 })),
      rotulo('t2', 24, 56, `cian: los múltiplos de b = ${b} hasta ${a * b}`, 'cian'),
    ],
    () => [rotulo('t3', 24, 80, '¿cuántos puntos ciruela caen sobre una línea cian, para a y b cualesquiera?', 'texto')],
  ],
});
