// Teorema de Wilson: en el reloj de p posiciones, cada x se une con su inverso (x·y deja resto 1). 1 y p − 1
// son su propio inverso. En (p−1)! cada cuerda vale 1 y queda 1·(p−1): resto p − 1, es decir −1.
import { escenaPorCapas, rotulo, elegir, ANCHO } from '../comun.js';
import { reloj, posReloj } from '../piezas/reloj.js';
import { esPrimo, inversoMod, factorialBig } from '../../motor/primos.js';
import { r1 } from '../../motor/escala.js';

const GEO = { cx: 180, cy: 220, R: 136 }, XL = 380;

export default escenaPorCapas({
  entradas: [{ id: 'p', etiqueta: 'p', valor: 13, min: 2, max: 23 }],
  validar: ({ p }) => (esPrimo(p) ? null : `elige p primo (el caso compuesto está en el último paso)`),
  preparar({ p }) {
    const pares = [];
    for (let x = 2; x < p - 1; x++) { const y = inversoMod(x, p); if (x < y) pares.push([x, y]); }
    let c = p + 1; while (esPrimo(c)) c++;                       // el compuesto más pequeño mayor que p
    let a = 2; while (c % a) a++;
    return { pares, F: factorialBig(p - 1), comp: c, a, Fc: factorialBig(c - 1) };
  },
  alto: 470,
  capas: [
    ({ p }) => [
      ...reloj('W', p, GEO, { apagados: [0] }),
      rotulo('tp', GEO.cx, GEO.cy + 4, `p = ${p}`, 'texto', 'middle'),
    ],
    ({ p, pares }) => [
      ...pares.map(([x, y]) => {
        const u = posReloj(x, p, GEO), v = posReloj(y, p, GEO);
        return { k: `cuerda${x}`, t: 'line', a: { x1: r1(u.x), y1: r1(u.y), x2: r1(v.x), y2: r1(v.y) }, c: 'violeta' };   // rectas: no se apelotonan en el centro
      }),
      rotulo('lt', XL, 40, pares.length ? 'parejas x · y que dejan resto 1:' : `con p = ${p} no hay parejas`, 'texto'),
      ...pares.map(([x, y], i) => rotulo(`par${x}`, XL, 64 + i * 20, `${x}·${y} = ${x * y} = ${p}·${(x * y - 1) / p} + 1`, 'violeta')),
    ],
    ({ p }) => {
      const q = posReloj(p - 1, p, GEO);
      return [
        { k: 'solo1', t: 'circle', a: { cx: r1(posReloj(1, p, GEO).x), cy: r1(posReloj(1, p, GEO).y), r: 11 }, c: 'ambar', hueco: true },
        ...(p > 2 ? [{ k: 'soloN', t: 'circle', a: { cx: r1(q.x), cy: r1(q.y), r: 11 }, c: 'ambar', hueco: true }] : []),
        rotulo('menos1rel', q.x + (q.x < GEO.cx ? -22 : 22), q.y + 22, '= −1', 'ambar', q.x < GEO.cx ? 'end' : 'start'),
        rotulo('menos1', 24, 400, p === 2 ? 'con p = 2 solo está el 1, que es p − 1 = «−1»' : `solo 1 y ${p - 1} son su propio inverso;  ${p - 1} es «−1»`, 'ambar'),
      ];
    },
    ({ p, pares }) => [
      ...pares.map(([x], i) => ({ ...rotulo(`uno${x}`, GEO.cx - (pares.length - 1) * 10 + i * 20, GEO.cy + 34, '1', 'verde', 'middle'), desde: `cuerda${x}` })),
      rotulo('prod', 24, 422, p === 2 ? '1! = 1  →  resto 1 = p − 1' : !pares.length ? `${p - 1}! = 1·${p - 1}  →  resto ${p - 1}`
        : elegir([`${p - 1}! = 1·${p - 1}·${pares.map(([x, y]) => `(${x}·${y})`).join('·')}  →  resto ${p - 1}`, `${p - 1}! = 1·${p - 1}·(parejas que valen 1)  →  resto ${p - 1}`], ANCHO - 48), 'texto'),
    ],
    ({ p, F }) => [rotulo('res', ANCHO / 2, 22, `${p - 1}! + 1 = ${F + 1n}:  ${p} | ${F + 1n}`, 'verde', 'middle')],
    ({ comp, a, Fc }) => [rotulo('rec', ANCHO / 2, 452, elegir([`recíproco, n = ${comp} = ${a}·${comp / a}:  ${a} | ${comp - 1}!,  ${a} ∤ ${comp - 1}! + 1  ⇒  ${comp} ∤ ${Fc + 1n}`, `recíproco, n = ${comp}:  ${a} | ${comp - 1}! y ${a} ∤ ${comp - 1}! + 1  ⇒  ${comp} ∤ ${comp - 1}! + 1`], ANCHO - 8), 'ambar', 'middle')],
  ],
});
