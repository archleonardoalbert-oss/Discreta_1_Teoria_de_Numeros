// Pequeño Teorema de Fermat con congruencias: la aplicación i ↦ a·i (mod p) sobre 1…p−1. A cada casilla de abajo
// llega exactamente una flecha (y ninguna al 0): es una permutación. Multiplicando las dos filas sale
// (p−1)!·aᵖ⁻¹ ≡ (p−1)!, y se cancela (p−1)! porque p no lo divide.
import { escenaPorCapas, conPuentes, rotulo, nota, elegir, sup, ANCHO } from '../comun.js';
import { geoFilas, filasFlechas, mod } from '../piezas/modular.js';
import { esPrimo, factorialBig } from '../../motor/primos.js';

const Y1 = 214, Y2 = 354;

const ALTO0 = () => Y2 + 70;

export default escenaPorCapas({
  entradas: [{ id: 'p', etiqueta: 'p', valor: 7, min: 2, max: 13 }, { id: 'a', etiqueta: 'a', valor: 3, min: 1, max: 40 }],
  validar: ({ p, a }) => (!esPrimo(p) ? `${p} no es primo` : a % p === 0 ? `${p} | ${a}: el teorema pide p ∤ a` : null),
  preparar({ p, a }) {
    const g = geoFilas(p, { x: 40, ancho: 600, y1: Y1, y2: Y2 }), xs = Array.from({ length: p - 1 }, (_, i) => i + 1);
    const etiquetas = Object.fromEntries(xs.map((i) => [i, String(i * a)]));
    const ap = BigInt(a) ** BigInt(p - 1);
    return { g, xs, etiquetas, F: factorialBig(p - 1), ap };
  },
  alto: (c) => ALTO0(c) + 26,
  capas: conPuentes([
    ({ g, xs, etiquetas, a }) => [
      ...xs.map((i) => ({ ...rotulo(`F:a${i}`, g.px(i), Y1 - 10, etiquetas[i], 'ciruela', 'middle'), orden: i * 0.4 })),
      ...xs.map((i) => ({ ...rotulo(`i${i}`, g.px(i), Y1 - 32, `${i}a`, 'tenue', 'middle'), orden: i * 0.4 })),
      rotulo('la', 24, Y1 - 10, 'ia', 'tenue'),
    ],
    ({ g, xs, etiquetas, a, p }) => [
      ...filasFlechas('F', g, (x) => a * x, { xs, etiquetas, colorArriba: () => 'ciruela', colorFlecha: () => 'violeta', colorAbajo: (y) => (y === 0 ? 'muy-tenue' : 'texto'), contar: true }).nodos,
      rotulo('lr', 24, Y2 + 18, 'resto', 'texto'),
      nota('n0', 0, `si ra ≡ sa con 1 ≤ r < s ≤ ${p - 1}, cancelando a: r ≡ s, imposible`, 'texto'),
    ],
    ({ g, p }) => [
      { k: 'marco', t: 'rect', a: { x: g.px(1) - g.dx / 2 + 2, y: Y2 - 14, width: (p - 1) * g.dx - 4, height: 60, rx: 8 }, c: 'verde', hueco: true },
      nota('n1', 1, `1, 2, …, ${p - 1} reciben una flecha cada uno: el mismo conjunto, reordenado`, 'verde'),
    ],
    ({ xs, a, p }) => [nota('n2', 2, elegir([`${xs.map((i) => i * a).join('·')} ≡ ${xs.join('·')} (mod ${p})`, `a·2a·…·${p - 1}a ≡ 1·2·…·${p - 1} (mod ${p})`], ANCHO - 48), 'texto')],
    ({ a, p, F }) => [nota('n3', 3, `(p − 1)!·a${sup(p - 1)} ≡ (p − 1)!:  ${F}·${a}${sup(p - 1)} ≡ ${F} (mod ${p})`, 'texto')],
    ({ p, F }) => [nota('n4', 4, `${p} ∤ ${F} = ${p - 1}! (sus factores son menores que ${p}): se cancela`, 'ambar')],
    ({ a, p, ap }) => [nota('n5', 5, elegir([`${a}${sup(p - 1)} = ${ap} = ${p}·${(ap - 1n) / BigInt(p)} + 1:  a${sup(p - 1)} ≡ 1 (mod ${p})`, `a${sup(p - 1)} ≡ 1 (mod ${p})`], ANCHO - 48), 'verde')],
  ], {
    1: ({ p }) => [`ra ≡ sa ⇒ r ≡ s (se cancela a, ${p} ∤ a); pero 0 < s − r < ${p}`, 'texto'],
    2: ({ p }) => [`ninguno es ≡ 0 (lema de Euclides): ${p - 1} restos distintos en 1 … ${p - 1}, son todos`, 'texto'],
  }, (c) => ALTO0(c) + 8),
});
