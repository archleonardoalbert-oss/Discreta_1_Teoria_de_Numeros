// El mcd es la menor combinación lineal positiva: S son los puntos positivos alcanzables; su mínimo s cae en todos los aᵢ.
import { escenaPorCapas, planPara, carril, rotulo, linea, nota, por, ANCHO } from '../comun.js';
import { recta, punto, llave } from '../primitivas.js';
import { combinacionMcd, division } from '../../motor/aritmetica.js';

const YS = 222, SY = 258, EJE = 300, MAX_S = 40;
const nombre = (i) => `a${'₁₂₃₄'[i]}`;

export default escenaPorCapas({
  entradas: [{ id: 'ns', etiqueta: 'a₁…aₙ', valor: [12, 18, 30], min: -60, max: 60, lista: { min: 2, max: 4 } }],
  validar: ({ ns }) => (ns.every((v) => v === 0) ? 'no pueden ser todos 0' : null),
  preparar({ ns }) {
    const { d, coefs } = combinacionMcd(ns);
    const M = Math.max(...ns.map(Math.abs));
    const p = planPara([...ns, -M, M]);
    const multiplos = [];
    for (let k = d; k <= p.max && multiplos.length < MAX_S; k += d) multiplos.push(k);
    return { d, coefs, p, multiplos, suma: ns.reduce((s, v) => s + v * v, 0), ...division(ns[0], d) };
  },
  alto: EJE + 84,
  base: ({ p }) => recta('eje', p, EJE),
  capas: [
    ({ ns, p }) => [
      ...ns.flatMap((v, i) => punto(`a${i}`, p, v, EJE, { c: 'ciruela', etiqueta: `${nombre(i)} = ${v}` })),
      nota('n0', 0, `a₁x₁ + … + aₙxₙ con a = (${ns.join(', ')})`),
    ],
    ({ ns, suma }) => [nota('n1', 1, `xᵢ = aᵢ:  ${ns.map((v) => `${v}²`).join(' + ')} = ${suma} ≥ 0`)],
    ({ suma }) => [nota('n2', 2, `algún aᵢ ≠ 0 ⇒ ${suma} > 0: existe una combinación positiva`)],
    ({ p, multiplos }) => [
      ...multiplos.map((m) => ({ k: `s${m}`, t: 'circle', a: { cx: p.x(m), cy: SY, r: 3.5 }, c: 'violeta' })),
      rotulo('s:et', p.x(p.min), SY + 4, 'S (combinaciones positivas):', 'violeta'),
    ],
    ({ ns, d, coefs, p }) => [
      { k: 'smin', t: 'circle', a: { cx: p.x(d), cy: SY, r: 7 }, c: 'ambar' },
      nota('n3', 3, `PBO: s = ${ns.map((v, i) => por(v, coefs[i])).join(' + ')} = ${d}`, 'ambar'),
    ],
    ({ ns, d, q, p }) => [
      ...carril('ls', p, YS, { salto: d, n: q, c: 'cian', etiqueta: `${nombre(0)} = s·q + r:  ${ns[0]} = ${por(d, q)} + ${ns[0] - d * q}` }),
    ],
    () => [nota('n4', 4, 'si r > 0:  r = a₁(1 − s₁q) + a₂(−s₂q) + … sería combinación positiva', 'texto')],
    ({ p, d }) => [
      nota('n5', 5, 'y r < s, pero s era la menor de S: ¡contradicción!', 'ambar'),
      ...llave('r', p, 0, d, EJE + 26, 'aquí no hay ningún punto de S', 'ambar'),
    ],
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
