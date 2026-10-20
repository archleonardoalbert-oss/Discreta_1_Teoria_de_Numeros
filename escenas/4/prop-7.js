// Propiedad 7: aᵏ = a·a⋯a. Dos filas de cajas, a, a², …, aᵏ y b, b², …, bᵏ: cada potencia nace de la anterior
// (se multiplica una vez más) y debajo lleva su resto; los restos coinciden columna a columna.
import { escenaPorCapas, rotulo, num, sup } from '../comun.js';
import { cajas } from '../piezas/cajas.js';
import { mod } from '../piezas/modular.js';

const X = 70, YA = 70, YB = 190;
const potencia = (x, i) => (BigInt(x) ** BigInt(i));
const resto = (v, n) => Number(((v % BigInt(n)) + BigInt(n)) % BigInt(n));

export default escenaPorCapas({
  entradas: [
    { id: 'n', etiqueta: 'n', valor: 5, min: 2, max: 12 }, { id: 'a', etiqueta: 'a', valor: 7, min: -9, max: 20 },
    { id: 'b', etiqueta: 'b', valor: 2, min: -9, max: 20 }, { id: 'k', etiqueta: 'k', valor: 4, min: 1, max: 6 },
  ],
  validar: ({ n, a, b }) => (mod(a, n) !== mod(b, n) ? `${num(a)} ≢ ${num(b)} (mod ${n})` : null),
  preparar({ a, b, k }) {
    const pa = Array.from({ length: k }, (_, i) => potencia(a, i + 1)), pb = Array.from({ length: k }, (_, i) => potencia(b, i + 1));
    // ancho común de columna: el de la potencia más larga
    const minAncho = Math.max(...[...pa, ...pb].map((v) => [...num(Number(v))].length * 7.8 + 18), 66);
    return { pa, pb, minAncho };
  },
  alto: YB + 100,
  capas: [
    ({ pa, pb, minAncho, n }) => {
      const A = cajas('A', { x: X, y: YA, valores: pa.map((v) => num(Number(v))), minAncho, hueco: 14, c: 'ciruela' });
      const B = cajas('B', { x: X, y: YB, valores: pb.map((v) => num(Number(v))), minAncho, hueco: 14, c: 'cian' });
      const xs = A.filter((m) => /^A:v\d+$/.test(m.k)).map((m) => m.a.x);
      return [
        ...A.map((m) => { const i = Number(m.k.match(/\d+$/)?.[0] ?? 0); return { ...m, orden: i, ...(i && /:(b|v)\d+$/.test(m.k) ? { desde: `A:v${i - 1}` } : {}) }; }),
        ...B.map((m) => { const i = Number(m.k.match(/\d+$/)?.[0] ?? 0); return { ...m, orden: i, ...(i && /:(b|v)\d+$/.test(m.k) ? { desde: `B:v${i - 1}` } : {}) }; }),
        rotulo('la', X - 12, YA, 'aⁱ', 'ciruela', 'end'), rotulo('lb', X - 12, YB, 'bⁱ', 'cian', 'end'),
        ...xs.flatMap((x, i) => [
          { ...rotulo(`e${i}`, x, YA - 34, `i = ${i + 1}`, 'tenue', 'middle'), orden: i },
          { ...rotulo(`ra${i}`, x, YA + 30, `resto ${resto(pa[i], n)}`, 'ambar', 'middle'), orden: i },
          { ...rotulo(`rb${i}`, x, YB + 30, `resto ${resto(pb[i], n)}`, 'ambar', 'middle'), orden: i },
        ]),
      ];
    },
    ({ pa, minAncho, n, k }) => {
      const xs = cajas('A', { x: X, y: YA, valores: pa.map((v) => num(Number(v))), minAncho, hueco: 14 }).filter((m) => /^A:v\d+$/.test(m.k)).map((m) => m.a.x);
      return [
        ...xs.map((x, i) => ({ k: `iq${i}`, t: 'rect', a: { x: x - minAncho / 2 - 4, y: YA + 14, width: minAncho + 8, height: YB - YA + 28, rx: 8 }, c: 'verde', hueco: true, orden: i })),
        ...xs.map((x, i) => ({ ...rotulo(`eq${i}`, x, (YA + YB) / 2 + 8, '≡', 'verde', 'middle'), orden: i })),
        rotulo('fin', 24, YB + 80, `cada vez que se multiplica, los restos siguen iguales: a${sup(k)} ≡ b${sup(k)} (mod ${n})`, 'verde'),
      ];
    },
  ],
});
