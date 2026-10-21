// SRC(n): n cajones, uno por resto. Cada número del conjunto vuela a su cajón; un SRC llena cada cajón exactamente
// una vez.
import { escenaPorCapas, rotulo, num, ANCHO } from '../comun.js';
import { conjunto } from '../primitivas.js';
import { mod } from '../piezas/modular.js';
import { r1 } from '../../motor/escala.js';

const YC = 170, H = 150;

export const validarSRC = (n, as) => (as.length !== n ? `un SRC(${n}) tiene ${n} números (hay ${as.length})`
  : new Set(as.map((v) => mod(v, n))).size !== n ? `hay dos números con el mismo resto módulo ${n}: no es un SRC` : null);

export default escenaPorCapas({
  entradas: [
    { id: 'n', etiqueta: 'n', valor: 5, min: 2, max: 8 },
    { id: 'as', etiqueta: 'conjunto', valor: [10, 21, -3, 8, 4], min: -40, max: 60, lista: { min: 2, max: 8 } },
  ],
  validar: ({ n, as }) => validarSRC(n, as),
  preparar: ({ n }) => { const w = Math.min(90, (ANCHO - 48) / n); return { w, xc: (r) => 24 + r * w } },
  alto: YC + H + 50,
  base: ({ as }) => conjunto('S', { x: 24, y: 40, nombre: 'S', elementos: as.map(num), c: 'ciruela' }),
  capas: [
    ({ n, w, xc }) => Array.from({ length: n }, (_, r) => [
      { k: `caj${r}`, t: 'rect', a: { x: r1(xc(r) + 4), y: YC, width: r1(w - 8), height: H, rx: 8 }, c: 'muy-tenue', hueco: true, orden: r * 0.5 },
      { ...rotulo(`cr${r}`, xc(r) + w / 2, YC - 10, `resto ${r}`, 'tenue', 'middle'), orden: r * 0.5 },
    ]).flat(),
    ({ n, as, w, xc }) => as.flatMap((v, i) => {
      const r = mod(v, n);
      return [{ ...rotulo(`v${i}`, xc(r) + w / 2, YC + H / 2 + 4, num(v), 'ciruela', 'middle'), desde: `S:e${i}`, orden: i }];
    }),
    ({ n, w, xc }) => [
      ...Array.from({ length: n }, (_, r) => ({ k: `caj${r}`, t: 'rect', a: { x: r1(xc(r) + 4), y: YC, width: r1(w - 8), height: H, rx: 8 }, c: 'verde', hueco: true })),
      ...Array.from({ length: n }, (_, r) => rotulo(`x${r}`, xc(r) + w / 2, YC + H + 22, '×1', 'verde', 'middle')),
      rotulo('fin', 24, YC + H + 44, `${n} números, ${n} cajones, uno en cada uno: es un SRC(${n})`, 'verde'),
    ],
  ],
});
