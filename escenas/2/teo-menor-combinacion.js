// El mcd es la menor combinación lineal positiva. S es un conjunto de símbolos ordenados (c₁ < c₂ < …; s₁, s₂ son
// los coeficientes de la conferencia): el PBO señala c₁ = s; un resto r > 0 tendría que ir a su izquierda (contradicción); y s cae en todos los aᵢ.
import { escenaPorCapas, conPuentes, planPara, carril, rotulo, linea, nota, por, num, ANCHO } from '../comun.js';
import { recta, punto, conjunto, simbolos } from '../primitivas.js';
import { combinacionMcd, division } from '../../motor/aritmetica.js';

const SY = 238, YS = 328, EJE = 388, SX = 24;
const DEF_S = 'd > 0  y  d = a₁x₁ + a₂x₂ + … + aₙxₙ  con xᵢ enteros;   c₁ < c₂ < c₃ < …';
const S = (señalado = -1) => conjunto('S', { x: SX, y: SY, nombre: 'S', elementos: simbolos('c', 3), definicion: DEF_S, señalado });
const nombre = (i) => `a${'₁₂₃₄'[i]}`;

const ALTO0 = () => EJE + 84;

export default escenaPorCapas({
  entradas: [{ id: 'ns', etiqueta: 'a₁…aₙ', valor: [12, 18, 30], min: -60, max: 60, lista: { min: 2, max: 4 } }],
  validar: ({ ns }) => (ns.every((v) => v === 0) ? 'no pueden ser todos 0' : null),
  preparar({ ns }) {
    const { d, coefs } = combinacionMcd(ns);
    const M = Math.max(...ns.map(Math.abs));
    const p = planPara([...ns, -M, M]);
    return { d, coefs, p, suma: ns.reduce((s, v) => s + v * v, 0), ...division(ns[0], d) };
  },
  alto: (c) => ALTO0(c) + 26,
  base: ({ p }) => recta('eje', p, EJE),
  capas: conPuentes([
    ({ ns, p }) => [
      ...ns.flatMap((v, i) => punto(`a${i}`, p, v, EJE, { c: 'ciruela', etiqueta: `${nombre(i)} = ${v}` })),
      nota('n0', 0, `a₁x₁ + … + aₙxₙ con a = (${ns.join(', ')})`),
    ],
    ({ ns, suma }) => [nota('n1', 1, `xᵢ = aᵢ:  ${ns.map((v) => (v < 0 ? `(${num(v)})²` : `${v}²`)).join(' + ')} = ${suma} ≥ 0`)],
    ({ suma }) => [nota('n2', 2, `algún aᵢ ≠ 0 ⇒ ${suma} > 0: existe una combinación positiva`)],
    () => S(),
    ({ ns, d, coefs }) => [
      ...S(0),
      nota('n3', 3, `PBO: s = c₁ = ${ns.map((v, i) => por(v, coefs[i])).join(' + ')} = ${d}`, 'ambar'),
    ],
    ({ ns, d, q, p }) => [
      ...carril('ls', p, YS, { salto: d, n: q, c: 'cian', etiqueta: `${nombre(0)} = s·q + r:  ${ns[0]} = ${por(d, q)} + ${ns[0] - d * q}` }),
    ],
    ({ ns, coefs, q }) => {
      // lo supuesto (r > 0) va punteado y en cursiva: desaparece al cerrar la contradicción
      const par = (x) => (x < 0 ? `(${num(x)})` : `${x}`);
      const terminos = ns.map((v, i) => (i === 0 ? `${num(v)}·(1 − ${par(coefs[0])}·${q})` : `${num(v)}·(−${par(coefs[i])}·${q})`));
      return [
        { ...nota('n4', 4, 'si r > 0:  r = a₁(1 − s₁q) + a₂(−s₂q) + … sería combinación positiva'), supuesto: true },
        { ...nota('hr', 5, [`   r = ${terminos.join(' + ')}  (con estos números vale 0)`, `   r = ${terminos.join(' + ')}  (aquí vale 0)`, '   r heredaría la forma a₁x₁ + … + aₙxₙ (aquí vale 0)'], 'ambar'), supuesto: true },
      ];
    },
    () => {
      const xPrimero = S().find((n) => n.k === 'S:e0').a.x;   // donde conjunto() escribe s₁
      return [
      nota('n5', 6, 'y r < s = c₁, pero c₁ es el menor de S: ¡contradicción!', 'ambar'),
      { ...rotulo('S:r', xPrimero - 18, SY - 22, 'r', 'ambar'), supuesto: true },
      { ...linea('S:rl', xPrimero - 8, SY - 20, xPrimero - 2, SY - 12, 'ambar'), supuesto: true },
      { ...rotulo('S:rt', xPrimero + 4, SY - 22, '← tendría que ir antes de c₁, el mínimo: imposible', 'ambar'), supuesto: true },
      ];
    },
    ({ ns, d, p }) => [
      ...['S:r', 'S:rl', 'S:rt', 'n4', 'hr'].map((k) => ({ k, quitar: true })),   // se cierra la contradicción: fuera lo supuesto
      ...carril('ls', p, YS, { salto: d, n: Math.floor(p.max / d), c: 'cian', etiqueta: `r = 0: los saltos de s = ${d} caen en todos los aᵢ` }),
      ...carril('ls-', p, YS, { salto: d, n: -Math.floor(-p.min / d), c: 'cian' }).filter((n) => n.t === 'path'),
      ...ns.map((v, i) => linea(`g${i}`, p.x(v), YS, p.x(v), EJE)),
    ],
    ({ ns }) => [nota('n6', 7, `d = mayor divisor común de (${ns.join(', ')})  ⇒  s ≤ d`)],
    () => [nota('n7', 8, 'd divide a toda combinación lineal ⇒ d | s ⇒ d ≤ s')],
    ({ ns, d }) => [rotulo('res', ANCHO / 2, EJE + 78, `d ≤ s ≤ d:  s = d = ${d} = mcd(${ns.join(', ')})`, 'verde', 'middle')],
  ], {
    2: () => ['cada aᵢ² ≥ 0 y aₖ² > 0: la suma es al menos aₖ² > 0', 'texto'],
    6: () => ['se agrupa por aᵢ: los coeficientes 1 − s₁q, −s₂q, … son enteros', 'texto'],
    10: () => ['d | aᵢ ⇒ d | aᵢxᵢ ⇒ d divide a la suma, y s es una suma así', 'texto'],
  }, (c) => ALTO0(c) + 8),
});
