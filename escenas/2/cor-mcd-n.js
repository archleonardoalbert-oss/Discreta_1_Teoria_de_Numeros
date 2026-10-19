// mcd(a₁, …, aₙ) = mcd(a₁, mcd(a₂, …, aₙ)): primero el salto común del resto, luego con a₁.
import { escenaPorCapas, planPara, carril, rotulo, nota, ANCHO } from '../comun.js';
import { recta, punto } from '../primitivas.js';
import { mcd } from '../../motor/aritmetica.js';

const Y1 = 92, Y2 = 150, EJE = 214;
const nombre = (i) => `a${'₁₂₃₄'[i]}`;

export default escenaPorCapas({
  entradas: [{ id: 'ns', etiqueta: 'a₁…aₙ', valor: [12, 18, 30], min: 1, max: 120, lista: { min: 2, max: 4 } }],
  preparar({ ns }) {
    const e = mcd(...ns.slice(1)), g = mcd(ns[0], e), M = Math.max(...ns);
    return { e, g, M, p: planPara(ns) };
  },
  alto: EJE + 56,
  base: ({ p }) => recta('eje', p, EJE),
  capas: [
    ({ ns, e, M, p }) => [
      ...ns.slice(1).flatMap((v, i) => punto(`a${i + 1}`, p, v, EJE, { c: 'ciruela', etiqueta: `${nombre(i + 1)} = ${v}` })),
      ...carril('le', p, Y1, { salto: e, n: Math.floor(M / e), c: 'violeta', etiqueta: `e = mcd(${ns.slice(1).join(', ')}) = ${e}` }),
      nota('n0', 0, `divisores comunes de ${ns.slice(1).join(', ')} = divisores de e = ${e}`),
    ],
    ({ ns, e, p }) => [
      ...punto('a0', p, ns[0], EJE, { c: 'ciruela', etiqueta: `a₁ = ${ns[0]}` }),
      nota('n1', 1, `c divide a todos  ⇔  c | ${ns[0]} y c | ${e}`),
    ],
    ({ ns, e, g, M, p }) => [
      ...carril('lg', p, Y2, { salto: g, n: Math.floor(M / g), c: 'cian', etiqueta: `salto común de a₁ = ${ns[0]} y e = ${e}: ${g}` }),
    ],
    ({ ns, e, g }) => [rotulo('res', ANCHO / 2, EJE + 50, `mcd(${ns.join(', ')}) = mcd(${ns[0]}, mcd(${ns.slice(1).join(', ')})) = mcd(${ns[0]}, ${e}) = ${g}`, 'verde', 'middle')],
  ],
});
