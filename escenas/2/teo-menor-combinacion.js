// El mcd es la menor combinación lineal positiva. S es un conjunto de símbolos ordenados (s₁ < s₂ < …): el PBO
// señala s₁ = s; un resto r > 0 tendría que ir a su izquierda (contradicción); y s cae en todos los aᵢ.
import { escenaPorCapas, planPara, carril, rotulo, linea, nota, por, num, ANCHO } from '../comun.js';
import { recta, punto, conjunto, simbolos } from '../primitivas.js';
import { combinacionMcd, division } from '../../motor/aritmetica.js';

const SY = 220, YS = 312, EJE = 372, SX = 24;
const DEF_S = 'd > 0  y  d = a₁x₁ + a₂x₂ + … + aₙxₙ  con xᵢ enteros;   s₁ < s₂ < s₃ < …';
const S = (señalado = -1) => conjunto('S', { x: SX, y: SY, nombre: 'S', elementos: simbolos('s', 3), definicion: DEF_S, señalado });
const nombre = (i) => `a${'₁₂₃₄'[i]}`;

export default escenaPorCapas({
  entradas: [{ id: 'ns', etiqueta: 'a₁…aₙ', valor: [12, 18, 30], min: -60, max: 60, lista: { min: 2, max: 4 } }],
  validar: ({ ns }) => (ns.every((v) => v === 0) ? 'no pueden ser todos 0' : null),
  preparar({ ns }) {
    const { d, coefs } = combinacionMcd(ns);
    const M = Math.max(...ns.map(Math.abs));
    const p = planPara([...ns, -M, M]);
    return { d, coefs, p, suma: ns.reduce((s, v) => s + v * v, 0), ...division(ns[0], d) };
  },
  alto: EJE + 84,
  base: ({ p }) => recta('eje', p, EJE),
  capas: [
    ({ ns, p }) => [
      ...ns.flatMap((v, i) => punto(`a${i}`, p, v, EJE, { c: 'ciruela', etiqueta: `${nombre(i)} = ${v}` })),
      nota('n0', 0, `a₁x₁ + … + aₙxₙ con a = (${ns.join(', ')})`),
    ],
    ({ ns, suma }) => [nota('n1', 1, `xᵢ = aᵢ:  ${ns.map((v) => (v < 0 ? `(${num(v)})²` : `${v}²`)).join(' + ')} = ${suma} ≥ 0`)],
    ({ suma }) => [nota('n2', 2, `algún aᵢ ≠ 0 ⇒ ${suma} > 0: existe una combinación positiva`)],
    () => S(),
    ({ ns, d, coefs }) => [
      ...S(0),
      nota('n3', 3, `PBO: s = s₁ = ${ns.map((v, i) => por(v, coefs[i])).join(' + ')} = ${d}`, 'ambar'),
    ],
    ({ ns, d, q, p }) => [
      ...carril('ls', p, YS, { salto: d, n: q, c: 'cian', etiqueta: `${nombre(0)} = s·q + r:  ${ns[0]} = ${por(d, q)} + ${ns[0] - d * q}` }),
    ],
    () => [nota('n4', 4, 'si r > 0:  r = a₁(1 − s₁q) + a₂(−s₂q) + … sería combinación positiva', 'texto')],
    () => {
      const xPrimero = S().find((n) => n.k === 'S:e0').a.x;   // donde conjunto() escribe s₁
      return [
      nota('n5', 5, 'y r < s = s₁, pero s₁ es el menor de S: ¡contradicción!', 'ambar'),
      rotulo('S:r', xPrimero - 18, SY - 22, 'r', 'ambar'),
      linea('S:rl', xPrimero - 8, SY - 20, xPrimero - 2, SY - 12, 'ambar'),
      rotulo('S:rt', xPrimero + 4, SY - 22, '← tendría que ir antes de s₁, el mínimo: imposible', 'ambar'),
      ];
    },
    ({ ns, d, p }) => [
      ...carril('ls', p, YS, { salto: d, n: Math.floor(p.max / d), c: 'cian', etiqueta: `r = 0: los saltos de s = ${d} caen en todos los aᵢ` }),
      ...carril('ls-', p, YS, { salto: d, n: -Math.floor(-p.min / d), c: 'cian' }).filter((n) => n.t === 'path'),
      ...ns.map((v, i) => linea(`g${i}`, p.x(v), YS, p.x(v), EJE)),
    ],
    ({ ns }) => [nota('n6', 6, `d = mayor divisor común de (${ns.join(', ')})  ⇒  s ≤ d`)],
    () => [nota('n7', 7, 'd divide a toda combinación lineal ⇒ d | s ⇒ d ≤ s')],
    ({ ns, d }) => [rotulo('res', ANCHO / 2, EJE + 78, `d ≤ s ≤ d:  s = d = ${d} = mcd(${ns.join(', ')})`, 'verde', 'middle')],
  ],
});
