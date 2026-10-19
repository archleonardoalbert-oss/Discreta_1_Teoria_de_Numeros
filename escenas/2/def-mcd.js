// Máximo común divisor: saltos que caen en a y en b; el más largo es el mcd.
import { escenaPorCapas, planPara, carril, rotulo, linea, ANCHO } from '../comun.js';
import { recta, punto } from '../primitivas.js';
import { divisores, mcd } from '../../motor/aritmetica.js';

const MAX_COMUNES = 4, DY = 46, Y0 = 60;

export default escenaPorCapas({
  entradas: [
    { id: 'a', etiqueta: 'a', valor: 12, min: 1, max: 120 },
    { id: 'b', etiqueta: 'b', valor: 18, min: 1, max: 120 },
  ],
  preparar({ a, b }) {
    const d = mcd(a, b), comunes = divisores(d);
    const mostrados = comunes.slice(-MAX_COMUNES);
    const soloA = divisores(a).filter((x) => b % x !== 0).at(-1) ?? null;
    const carriles = 1 + mostrados.length;
    return { d, comunes, mostrados, soloA, M: Math.max(a, b), p: planPara([a, b]), ejeY: Y0 + carriles * DY + 10 };
  },
  alto: ({ ejeY }) => ejeY + 64,
  base: ({ p, ejeY }) => recta('eje', p, ejeY),
  capas: [
    ({ a, b, p, ejeY }) => [
      linea('ga', p.x(a), Y0 - 18, p.x(a), ejeY),
      linea('gb', p.x(b), Y0 - 18, p.x(b), ejeY),
      ...punto('pa', p, a, ejeY, { c: 'ciruela', etiqueta: `a = ${a}` }),
      ...punto('pb', p, b, ejeY, { c: 'ciruela', etiqueta: `b = ${b}` }),
    ],
    ({ a, soloA, p }) => soloA
      ? carril('sa', p, Y0, { salto: soloA, n: a / soloA, c: 'violeta', etiqueta: `d = ${soloA}: cae en a, no en b` })
      : [rotulo('sa:et', p.x(p.min), Y0, 'todos los divisores de a caen también en b', 'violeta')],
    ({ M, mostrados, comunes, p, ejeY }) => [
      ...mostrados.flatMap((d, i) => carril(`cd${d}`, p, Y0 + (i + 1) * DY, { salto: d, n: Math.floor(M / d), c: 'cian', etiqueta: `d = ${d}` })),
      ...(comunes.length > mostrados.length
        ? [rotulo('mas', p.x(p.max), Y0 + DY - 4, `(y ${comunes.length - mostrados.length} saltos comunes más pequeños)`, 'tenue', 'end')] : []),
    ],
    ({ a, b, d, M, mostrados, p, ejeY }) => [
      ...carril(`cd${d}`, p, Y0 + mostrados.length * DY, { salto: d, n: Math.floor(M / d), c: 'verde', etiqueta: `d = ${d} = mcd` }),
      rotulo('res', ANCHO / 2, ejeY + 50, `mcd(${a}, ${b}) = ${d}`, 'verde', 'middle'),
    ],
  ],
});
