// Todo n > 1 tiene un divisor primo, tres veces. Franja 1 (descenso): una escalera n > a > a₁ > … que no puede bajar
// del suelo 1, así que termina en un primo. Franja 2 (inducción fuerte): todos los m de [2, n−1] tienen divisor primo
// (hipótesis, punteada); n = ab con a dentro. Franja 3 (PBO): D con números reales, su mínimo m, y un p punteado que
// tendría que estar a la izquierda de m.
import { escenaPorCapas, planPara, rotulo, flecha, ANCHO } from '../comun.js';
import { recta, punto, conjunto } from '../primitivas.js';
import { anchoCaja } from '../piezas/cajas.js';
import { esPrimo, factorizar } from '../../motor/primos.js';
import { divisores } from '../../motor/aritmetica.js';
import { r1 } from '../../motor/escala.js';

const Y1 = 76, Y2 = 262, Y3 = 410;

// Partir por el divisor más cercano a √v: v = a·b con a ≤ b.
const partir = (v) => { let a = Math.floor(Math.sqrt(v)); while (v % a) a--; return [a, v / a]; };

export default escenaPorCapas({
  entradas: [{ id: 'n', etiqueta: 'n', valor: 100, min: 2, max: 9999 }],
  preparar({ n }) {
    // la escalera: se baja por a mientras ni a ni b sean primos
    const esc = [{ v: n }];
    let v = n;
    while (!esPrimo(v)) {
      const [a, b] = partir(v);
      esc.at(-1).a = a; esc.at(-1).b = b;
      if (esPrimo(a) || esPrimo(b)) { esc.push({ v: esPrimo(a) ? a : b, fin: true }); break; }
      esc.push({ v: a }); v = a;
    }
    let x = 24;
    const cajas = esc.map((e) => { const w = anchoCaja(e.v); const c = { ...e, x, w }; x += w + 74; return c; });
    const [a] = esPrimo(n) ? [n] : partir(n), p = factorizar(a)[0];
    const D = divisores(n).filter((d) => d > 1 && d < n);
    return { esc: cajas, primo: esPrimo(n), plan: planPara([n]), a, b: n / a, p, D, finX: x };
  },
  alto: Y3 + 90,
  capas: [
    ({ esc, n, primo }) => [
      rotulo('h1', 24, 26, 'demostración 1: descenso', 'tenue'),
      { k: 'k0', t: 'rect', a: { x: esc[0].x, y: Y1 - 22, width: esc[0].w, height: 30, rx: 6 }, c: primo ? 'verde' : 'ciruela', hueco: true },
      rotulo('v0', esc[0].x + esc[0].w / 2, Y1, String(n), primo ? 'verde' : 'ciruela', 'middle'),
      rotulo('d1', 24, Y1 + 40, primo ? `${n} es primo: ya está` : `${n} no es primo: es compuesto`, primo ? 'verde' : 'texto'),
    ],
    ({ esc, primo }) => (primo ? [] : [
      flecha('f0', esc[0].x + esc[0].w + 6, Y1 - 7, esc[1].x - 6, Y1 - 7, 'cian'),
      rotulo('fa0', (esc[0].x + esc[0].w + esc[1].x) / 2, Y1 - 16, `${esc[0].a}·${esc[0].b}`, 'cian', 'middle'),
      { k: 'k1', t: 'rect', a: { x: esc[1].x, y: Y1 - 22, width: esc[1].w, height: 30, rx: 6 }, c: esc[1].fin ? 'verde' : 'cian', hueco: true },
      rotulo('v1', esc[1].x + esc[1].w / 2, Y1, String(esc[1].v), esc[1].fin ? 'verde' : 'cian', 'middle'),
      rotulo('d1', 24, Y1 + 40, esc[1].fin ? `n = ${esc[0].a}·${esc[0].b} y ${esc[1].v} es primo: ya queda demostrado` : `n = ${esc[0].a}·${esc[0].b}: ni ${esc[0].a} ni ${esc[0].b} es primo, se baja por a`, esc[1].fin ? 'verde' : 'texto'),
    ]),
    ({ esc, primo }) => (primo || esc.length < 3 ? [rotulo('d2', 24, Y1 + 62, primo || esc[1].fin ? '(aquí no hace falta bajar más)' : '', 'tenue')] : esc.slice(2).flatMap((e, j) => {
      const i = j + 2, prev = esc[i - 1];
      return [
        { ...flecha(`f${i - 1}`, prev.x + prev.w + 6, Y1 - 7, e.x - 6, Y1 - 7, 'cian'), orden: j },
        { ...rotulo(`fa${i - 1}`, (prev.x + prev.w + e.x) / 2, Y1 - 16, `${prev.a}·${prev.b}`, 'cian', 'middle'), orden: j },
        { k: `k${i}`, t: 'rect', a: { x: e.x, y: Y1 - 22, width: e.w, height: 30, rx: 6 }, c: e.fin ? 'verde' : 'cian', hueco: true, orden: j },
        { ...rotulo(`v${i}`, e.x + e.w / 2, Y1, String(e.v), e.fin ? 'verde' : 'cian', 'middle'), orden: j },
      ];
    }).concat([rotulo('d2', 24, Y1 + 62, 'a = a₁b₁, …: cada paso baja a un entero positivo más pequeño', 'texto')])),
    ({ esc, primo, finX }) => {
      const ult = esc.at(-1);
      return [
        { k: 'suelo', t: 'line', a: { x1: Math.min(finX - 30, ANCHO - 60), y1: Y1 - 30, x2: Math.min(finX - 30, ANCHO - 60), y2: Y1 + 14 }, c: 'ambar', ancho: 3 },
        rotulo('suelot', Math.min(finX - 22, ANCHO - 52), Y1, 'suelo: 1', 'ambar'),
        rotulo('d3', 24, Y1 + 84, primo ? 'n es primo: no hace falta bajar' : `no hay descenso infinito: termina en ${ult.v}, primo, y ${esc.slice().reverse().map((e) => e.v).join(' | ')}`, 'verde'),
      ];
    },
    ({ n, plan }) => [
      rotulo('h2', 24, Y2 - 64, 'demostración 2: inducción fuerte', 'tenue'),
      ...recta('R', plan, Y2),
      ...punto('N', plan, n, Y2, { etiqueta: 'n' }),
      { k: 'banda', t: 'rect', a: { x: plan.x(2), y: Y2 - 9, width: r1(Math.max(2, plan.x(n - 1) - plan.x(2))), height: 18, rx: 6 }, c: 'violeta', hueco: true, supuesto: true },
      rotulo('bandat', plan.x(2), Y2 - 16, 'hipótesis: 2, …, n − 1 tienen divisor primo', 'violeta'),
    ],
    ({ a, b, plan, primo, n }) => (primo ? [rotulo('d5', 24, Y2 + 44, `${n} es primo: ya está`, 'verde')] : [
      ...punto('PA', plan, a, Y2, { c: 'cian' }),
      rotulo('PAt', plan.x(a), Y2 + 36, `a = ${a}`, 'cian', 'middle'),
      rotulo('d5', ANCHO - 24, Y2 + 52, `n = a·b = ${a}·${b}, 1 < a, b < n`, 'texto', 'end'),
    ]),
    ({ a, p, plan, primo, n }) => (primo ? [] : [
      ...punto('PP', plan, p, Y2, { c: 'verde' }),
      ...(p === a ? [] : [flecha('fpa', plan.x(p), Y2 - 14, plan.x(a), Y2 - 14, 'verde', 10)]),
      rotulo('d6', 24, Y2 + 74, esPrimo(a) ? `a = ${a} es primo y divide a n = ${n}` : `a < n tiene un divisor primo, ${p}:  ${p} | ${a} | ${n}`, 'verde'),
    ]),
    ({ n, D, primo }) => (primo ? [rotulo('h3', 24, Y3 - 30, `demostración 3: ${n} es primo, ya está`, 'tenue')] : [
      rotulo('h3', 24, Y3 - 30, 'demostración 3: PBO sobre los divisores', 'tenue'),
      ...conjunto('D', { x: 24, y: Y3, nombre: 'D', elementos: D.map(String), c: 'cian', señalado: 0, etiquetaSeñalado: 'mínimo = m' }),
    ]),
    ({ D, primo }) => (primo ? [] : [
      { ...rotulo('pf', 24, Y3 + 60, `si m = ${D[0]} fuera compuesto: un p con 1 < p < m, p | m`, 'ambar'), supuesto: true },
    ]),
    ({ D, primo }) => (primo ? [] : [
      { k: 'pf', quitar: true },
      rotulo('pc', 24, Y3 + 60, `p | m | n ⇒ p ∈ D y p < m: ¡a la izquierda del mínimo! Luego m = ${D[0]} es primo`, 'verde'),
    ]),
  ],
});
