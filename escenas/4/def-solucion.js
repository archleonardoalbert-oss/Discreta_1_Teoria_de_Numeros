// Solución de f(x) ≡ 0 (n): se prueba un representante de cada columna, x = 0…n−1; cada x manda una flecha a la
// columna de f(x). Las que llegan al 0 son las soluciones.
import { escenaPorCapas, rotulo, nota, num, sup } from '../comun.js';
import { geoFilas, filasFlechas, mod } from '../piezas/modular.js';

const Y1 = 130, Y2 = 280;
export const poli = (cs) => cs.map((c, k) => (c === 0 ? null : `${k && Math.abs(c) === 1 ? (c < 0 ? '−' : '') : num(c)}${k ? `x${k > 1 ? sup(k) : ''}` : ''}`)).filter(Boolean).join(' + ').replace(/\+ −/g, '− ') || '0';
export const evaluar = (cs, x) => cs.reduce((s, c, k) => s + c * x ** k, 0);

export default escenaPorCapas({
  entradas: [
    { id: 'n', etiqueta: 'n', valor: 7, min: 2, max: 12 },
    { id: 'cs', etiqueta: 'c₀, c₁, …', valor: [-2, 0, 1], min: -9, max: 9, lista: { min: 2, max: 4 } },
  ],
  preparar({ n, cs }) {
    const g = geoFilas(n, { x: 40, ancho: 600, y1: Y1, y2: Y2 }), f = (x) => evaluar(cs, x);
    const sol = Array.from({ length: n }, (_, x) => x).filter((x) => mod(f(x), n) === 0);
    return { g, f, sol };
  },
  alto: Y2 + 80,
  capas: [
    ({ g, f, n, cs }) => [
      nota('n0', 0, `f(x) = ${poli(cs)},  n = ${n}`, 'texto'),
      ...Array.from({ length: n }, (_, x) => [
        { ...rotulo(`x${x}`, g.px(x), Y1 - 10, String(x), 'texto', 'middle'), orden: x * 0.3 },
        { ...rotulo(`fx${x}`, g.px(x), Y1 - 32, num(f(x)), 'tenue', 'middle'), orden: x * 0.3 },
      ]).flat(),
      rotulo('lx', 24, Y1 - 10, 'x', 'texto'), rotulo('lf', 24, Y1 - 32, 'f(x)', 'tenue'),
    ],
    ({ g, f, n }) => [
      ...filasFlechas('F', g, f, { colorFlecha: () => 'violeta' }).nodos.filter((m) => !/^F:a\d+$/.test(m.k)),
      rotulo('lr', 24, Y2 + 18, 'resto', 'texto'),
    ],
    ({ g, f, n, sol }) => [
      ...filasFlechas('F', g, f, { colorFlecha: (x) => (sol.includes(x) ? 'verde' : 'muy-tenue'), colorAbajo: (y) => (y === 0 ? 'verde' : 'texto') }).nodos.filter((m) => !/^F:a\d+$/.test(m.k)),
      ...sol.map((x) => ({ k: `aro${x}`, t: 'circle', a: { cx: g.px(x), cy: Y1, r: 10 }, c: 'verde', hueco: true })),
      nota('n1', 1, sol.length ? `soluciones: x ≡ ${sol.join(', ')} (mod ${n})` : `ningún x llega al 0: f(x) ≡ 0 (mod ${n}) no tiene solución`, sol.length ? 'verde' : 'ambar'),
    ],
  ],
});
