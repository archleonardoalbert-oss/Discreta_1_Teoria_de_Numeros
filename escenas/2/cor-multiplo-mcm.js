// Todo múltiplo común es múltiplo de [a,b]: los puntos donde coinciden los saltadores son los saltos de [a,b].
import { escenaPorCapas, carril, rotulo, nota, ANCHO } from '../comun.js';
import { planRecta } from '../../motor/escala.js';
import { recta } from '../primitivas.js';
import { dosSaltadores, coincidencias } from '../piezas/multiplos.js';
import { mcd, mcm } from '../../motor/aritmetica.js';
import { validarNoCero } from './def-mcm.js';

const YA = 104, YB = 152, YL = 200, EJE = 262, VECES = 3;

export default escenaPorCapas({
  entradas: [
    { id: 'a', etiqueta: 'a', valor: 4, min: -60, max: 60 },
    { id: 'b', etiqueta: 'b', valor: 6, min: -60, max: 60 },
  ],
  validar: validarNoCero,
  preparar({ a, b }) {
    const L = mcm(a, b), hasta = VECES * L;
    return { L, d: mcd(a, b), hasta, p: planRecta({ min: -hasta * 0.04, max: hasta * 1.06, ancho: ANCHO }) };
  },
  alto: EJE + 56,
  base: ({ p }) => recta('eje', p, EJE),
  capas: [
    ({ a, b, hasta, L, p }) => [
      ...dosSaltadores(p, { a, b, hasta, yA: YA, yB: YB }),
      ...coincidencias(p, { m: L, hasta, yTop: YA, eje: EJE }),
      nota('n0', 0, 'múltiplos comunes:  m = k·ab/(a,b)'),
    ],
    ({ a, b, d, L }) => [nota('n1', 1, `ab/(a,b) = ${Math.abs(a * b)}/${d} = ${L} = [a,b]`)],
    ({ L, p }) => [
      ...carril('ll', p, YL, { salto: L, n: VECES, c: 'verde', etiqueta: `saltos de [a,b] = ${L}` }),
      rotulo('res', ANCHO / 2, EJE + 48, `m = k·[a,b]:  ${Array.from({ length: VECES }, (_, i) => L * (i + 1)).join(', ')}, …`, 'verde', 'middle'),
    ],
  ],
});
