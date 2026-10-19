// mcm: dos saltadores desde 0; donde aterrizan los dos hay un múltiplo común; el primero positivo es el mcm.
import { escenaPorCapas, rotulo, nota } from '../comun.js';
import { planRecta } from '../../motor/escala.js';
import { recta } from '../primitivas.js';
import { dosSaltadores, coincidencias } from '../piezas/multiplos.js';
import { mcm } from '../../motor/aritmetica.js';

const YA = 70, YB = 122, EJE = 186;
export const validarNoCero = ({ a, b }) => (a === 0 || b === 0 ? 'a y b deben ser distintos de 0' : null);

export default escenaPorCapas({
  entradas: [
    { id: 'a', etiqueta: 'a', valor: 4, min: -60, max: 60 },
    { id: 'b', etiqueta: 'b', valor: 6, min: -60, max: 60 },
  ],
  validar: validarNoCero,
  preparar({ a, b }) {
    const m = mcm(a, b), hasta = Math.min(2 * m, Math.max(4 * Math.max(Math.abs(a), Math.abs(b)), m));
    return { m, hasta, p: planRecta({ min: -hasta * 0.04, max: hasta * 1.06, ancho: 680 }) };
  },
  alto: EJE + 56,
  base: ({ p }) => recta('eje', p, EJE),
  capas: [
    ({ a, b, hasta, p }) => dosSaltadores(p, { a, b, hasta, yA: YA, yB: YB }).filter((n) => n.k.startsWith('sa')),
    ({ a, b, hasta, p }) => dosSaltadores(p, { a, b, hasta, yA: YA, yB: YB }),
    ({ m, hasta, p }) => [...coincidencias(p, { m, hasta, yTop: YA, eje: EJE }), nota('n0', 0, 'donde aterrizan los dos: múltiplos comunes')],
    ({ a, b, m, p }) => [
      { k: `pc${m}`, t: 'circle', a: { cx: p.x(m), cy: EJE, r: 7 }, c: 'verde' },
      rotulo('res', 340, EJE + 48, `el primero positivo:  mcm(${a}, ${b}) = [${a}, ${b}] = ${m}`, 'verde', 'middle'),
    ],
  ],
});
