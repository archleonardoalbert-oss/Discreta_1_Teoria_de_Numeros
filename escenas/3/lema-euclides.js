// Lema de Euclides: (p, a) = 1 da ax + py = 1 (carriles de saltos). Multiplicar por b lleva a b; como ab = p·r,
// los saltos de a se pueden contar como saltos de p, y b queda alcanzado solo con saltos de p: p | b.
import { escenaPorCapas, conPuentes, planPara, carril, rotulo, linea, nota, por, num, nSaltos, ANCHO } from '../comun.js';
import { recta, punto, rectangulo } from '../primitivas.js';
import { combinacionMcd, mcd } from '../../motor/aritmetica.js';
import { validarPrimo } from './lema-p-no-divide.js';

const Y1 = 196, Y2 = 246, EJE = 304, RY = EJE + 70;

const ALTO0 = ({ a, lado }) => RY + a * lado + 40;

export default escenaPorCapas({
  entradas: [
    { id: 'p', etiqueta: 'p', valor: 3, min: 2, max: 13 },
    { id: 'a', etiqueta: 'a', valor: 4, min: 1, max: 20 },
    { id: 'b', etiqueta: 'b', valor: 6, min: 1, max: 20 },
  ],
  validar: ({ p, a, b }) => validarPrimo(p) ?? (mcd(p, a) !== 1 ? `el lema supone (p, a) = 1, y ${p} | ${a}` : (a * b) % p !== 0 ? `el lema supone p | ab, y ${p} ∤ ${a * b}` : null),
  preparar({ p, a, b }) {
    const { coefs: [x, y] } = combinacionMcd([a, p]);
    const r = (a * b) / p, lado = Math.max(4, Math.min(14, Math.floor(420 / b), Math.floor(130 / a)));
    return { x, y, r, lado, p1: planPara([a * x, 1, a * x * b, b, 0]) };
  },
  alto: (c) => ALTO0(c) + 26,
  base: ({ p1 }) => recta('eje', p1, EJE),
  capas: conPuentes([
    ({ p, a, x, y, p1 }) => [
      ...carril('l1', p1, Y1, { salto: a, n: x, c: 'cian', etiqueta: `x = ${num(x)}: ${nSaltos(x, a)}` }),
      ...carril('l2', p1, Y2, { salto: p, n: y, desde: a * x, c: 'violeta', etiqueta: `y = ${num(y)}: ${nSaltos(y, p)}` }),
      linea('g1', p1.x(a * x), Y1, p1.x(a * x), Y2), linea('g2', p1.x(1), Y2, p1.x(1), EJE),
      ...punto('uno', p1, 1, EJE, { c: 'verde', etiqueta: '1' }),
      nota('n0', 0, `(p, a) = 1:  ax + py = ${por(a, x)} + ${por(p, y)} = 1`),
    ],
    ({ p, a, b, x, y, p1 }) => [
      ...carril('l1', p1, Y1, { salto: a, n: b * x, c: 'cian', etiqueta: `b·x = ${num(b * x)}: ${nSaltos(b * x, a)}` }),
      ...carril('l2', p1, Y2, { salto: p, n: b * y, desde: a * x * b, c: 'violeta', etiqueta: `b·y = ${num(b * y)}: ${nSaltos(b * y, p)}` }),
      linea('g1', p1.x(a * x * b), Y1, p1.x(a * x * b), Y2), linea('g2', p1.x(b), Y2, p1.x(b), EJE),
      { k: 'uno', quitar: true }, { k: 'uno:e', quitar: true }, { k: 'uno:p', quitar: true },
      ...punto('pb', p1, b, EJE, { c: 'ciruela', etiqueta: `b = ${b}` }),
      nota('n1', 1, `× b:  b(ax + py) = b`),
    ],
    ({ p, a, b, x, y }) => [nota('n2', 2, `bax + bpy = ${a}·${b}·${x < 0 ? `(${num(x)})` : x} + ${b}·${p}·${y < 0 ? `(${num(y)})` : y} = ${b}`)],
    ({ p, a, b, r, lado }) => [
      ...rectangulo('R', { x: 110, y: RY, filas: a, cols: b, lado, c: 'tenue', etiquetaFilas: `a = ${a}`, etiquetaCols: `b = ${b}` })
        .map((n) => { const m = /^R:c(\d+)-(\d+)$/.exec(n.k); if (!m) return n; const i = Number(m[1]) * b + Number(m[2]); return { ...n, c: Math.floor(i / p) % 2 ? 'violeta' : 'cian' }; }),
      nota('n3', 3, `p | ab:  ab = ${a * b} = ${p}·${r}  (r = ${r} grupos de ${p} cuadraditos)`),
    ],
    ({ p, a, b, x, r, p1 }) => [
      ...carril('l1', p1, Y1, { salto: p, n: r * x, c: 'violeta', etiqueta: `los mismos ${num(a * b * x)}: r·x = ${num(r * x)} saltos de p = ${p}` }),
      nota('n4', 4, [`abx = prx:  ${nSaltos(b * x, a)} miden lo mismo que ${nSaltos(r * x, p)}`, `abx = prx:  ${num(b * x)} saltos de ${a} = ${num(r * x)} saltos de ${p}`]),
    ],
    ({ p, b, x, y, r }) => [rotulo('res', ANCHO / 2, 28 + 5 * 22, `b = p(rx + by) = ${p}·(${num(r * x)} + ${y * b < 0 ? `(${num(b * y)})` : b * y}) = ${b}:  solo saltos de ${p}  ⇒  ${p} | ${b}`, 'verde', 'middle')],
  ], {
    0: ({ p, a }) => [`si p | a ya está; si no, (${p}, ${a}) = 1 (lema anterior) y Bézout da ax + py = 1`, 'texto'],
    4: () => ['se cambió ab por pr: ahora los dos sumandos llevan el factor p', 'texto'],
  }, (c) => ALTO0(c) + 8),
});
