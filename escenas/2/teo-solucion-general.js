// Solución general: desde (x₀, y₀) se puede añadir b/d saltos de a y quitar a/d saltos de b (miden lo mismo, ab/d).
import { escenaPorCapas, planPara, carril, rotulo, rotuloDentro, linea, nota, por, num, nSaltos, elegir, ANCHO } from '../comun.js';
import { recta, punto } from '../primitivas.js';
import { diofantica } from '../../motor/aritmetica.js';

const Y = [236, 284, 340, 388], EJE = 450;

export default escenaPorCapas({
  entradas: [
    { id: 'a', etiqueta: 'a', valor: 6, min: -40, max: 40 },
    { id: 'b', etiqueta: 'b', valor: 10, min: -40, max: 40 },
    { id: 'c', etiqueta: 'c', valor: 8, min: -200, max: 200 },
  ],
  validar({ a, b, c }) {
    if (a === 0 || b === 0) return 'a y b deben ser distintos de 0';
    return diofantica(a, b, c) ? null : 'esta ecuación no tiene solución: c debe ser múltiplo de mcd(a, b)';
  },
  preparar({ a, b, c }) {
    const { x0, y0, d, pasoX, pasoY } = diofantica(a, b, c);
    const x1 = x0 + pasoX, y1 = y0 - pasoY, L = a * pasoX;
    return { x0, y0, d, pasoX, pasoY, x1, y1, L, p: planPara([c, a * x0, L, a * x1]) };
  },
  alto: EJE + 60,
  base: ({ p }) => recta('eje', p, EJE),
  capas: [
    ({ a, b, c, x0, y0, p }) => [
      ...carril('s1', p, Y[0], { salto: a, n: x0, c: 'cian', etiqueta: `x₀ = ${num(x0)}: ${nSaltos(x0, a)}` }),
      ...carril('s2', p, Y[1], { salto: b, n: y0, desde: a * x0, c: 'cian', etiqueta: `y₀ = ${num(y0)}: ${nSaltos(y0, b)}` }),
      linea('g1', p.x(a * x0), Y[0], p.x(a * x0), Y[1]), linea('g2', p.x(c), Y[1], p.x(c), EJE),
      ...punto('pc', p, c, EJE, { c: 'ciruela', etiqueta: `c = ${num(c)}` }),
      nota('n0', 0, `${num(a)}x + ${num(b)}y = ${num(c)}:  una solución (x₀, y₀) = (${num(x0)}, ${num(y0)})`),
    ],
    ({ a, b, d, pasoX, pasoY, L, p }) => [
      ...carril('t1', p, Y[2], { salto: a, n: pasoX, c: 'violeta', etiqueta: `b/d = ${num(pasoX)}: ${nSaltos(pasoX, a)}` }),
      ...carril('t2', p, Y[3], { salto: b, n: pasoY, c: 'violeta', etiqueta: `a/d = ${num(pasoY)}: ${nSaltos(pasoY, b)}` }),
      rotuloDentro('tl', p.x(L) + 8, Y[2] + 28, L < 0 ? `= −mcm(a, b) = ${num(L)}` : `= mcm(a, b) = ${L}`, 'violeta'),
      nota('n1', 1, [`b/d saltos de a = a/d saltos de b = ab/d = ${num(L)}: dos bloques de longitud mcm(a, b) que se cancelan`, `b/d saltos de a = a/d saltos de b = ab/d = ${num(L)}: se cancelan`]),
    ],
    ({ a, b, x0, y0, x1, y1 }) => [nota('n2', 2, [`otra solución (x₁, y₁) = (${num(x1)}, ${num(y1)}):  ${por(a, x0)} + ${por(b, y0)} = ${por(a, x1)} + ${por(b, y1)}`, `otra solución (x₁, y₁) = (${num(x1)}, ${num(y1)}):  ax₀ + by₀ = ax₁ + by₁`])],
    ({ a, b, x0, x1, y0, y1 }) => [nota('n3', 3, [`a(x₀ − x₁) = b(y₁ − y₀):  ${por(a, x0 - x1)} = ${por(b, y1 - y0)}`, 'a(x₀ − x₁) = b(y₁ − y₀)'])],
    ({ a, b, d, x0, x1, y0, y1 }) => [nota('n4', 4, [`÷ d = ${d}:  ${por(a / d, x0 - x1)} = ${por(b / d, y1 - y0)}`, `÷ d = ${d}:  (a/d)(x₀ − x₁) = (b/d)(y₁ − y₀)`])],
    ({ a, b, d }) => [nota('n5', 5, `b/d = ${num(b / d)} divide a (a/d)(x₀ − x₁)`)],
    ({ a, b, d }) => [nota('n6', 6, `(${num(a / d)}, ${num(b / d)}) = 1  ⇒  b/d | x₀ − x₁`)],
    ({ pasoX, pasoY }) => [nota('n7', 7, `x₁ = x₀ + k·${num(pasoX)},  y₁ = y₀ − k·${num(pasoY)}`)],
    ({ x0, y0, pasoX, pasoY }) => {
      const general = `x = ${num(x0)} + k·${num(pasoX)},  y = ${num(y0)} − k·${num(pasoY)}`;
      const pares = (ks) => ks.map((k) => `(${num(x0 + k * pasoX)}, ${num(y0 - k * pasoY)})`).join(' ');
      return [rotulo('res', ANCHO / 2, EJE + 50, elegir([`${general}:  ${pares([-1, 0, 1, 2])} …`, `${general}:  ${pares([0, 1])} …`, general], ANCHO - 8), 'verde', 'middle')];
    },
  ],
});
