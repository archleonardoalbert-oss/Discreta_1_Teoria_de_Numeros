// mcd(c, n) = 1: x ↦ cx no pliega nada; a cada casilla llega exactamente una flecha (×1 en todas).
import { escenaPorCapas, conPuentes, rotulo, nota } from '../comun.js';
import { geoFilas, filasFlechas } from '../piezas/modular.js';
import { mcd } from '../../motor/aritmetica.js';

const Y1 = 110, Y2 = 250;

export function biyeccion(n, c, color = 'violeta') {
  const g = geoFilas(n, { x: 40, ancho: 600, y1: Y1, y2: Y2 });
  return filasFlechas('F', g, (x) => c * x, { colorFlecha: () => color, contar: true });
}

const ALTO0 = () => Y2 + 80;

export default escenaPorCapas({
  entradas: [{ id: 'c', etiqueta: 'c', valor: 3, min: 1, max: 30 }, { id: 'n', etiqueta: 'n', valor: 10, min: 2, max: 12 }],
  validar: ({ c, n }) => (mcd(c, n) !== 1 ? `mcd(${c}, ${n}) = ${mcd(c, n)}: el corolario pide mcd(c, n) = 1` : null),
  alto: (c) => ALTO0(c) + 26,
  capas: conPuentes([
    ({ c, n }) => [
      ...biyeccion(n, c).nodos.filter((m) => !/^F:n\d+$/.test(m.k)),
      rotulo('arr', 24, Y1 - 6, 'x', 'texto'), rotulo('abj', 24, Y2 + 22, `${c}x`, 'texto'),
      nota('n0', 0, `d = mcd(${c}, ${n}) = 1:  n/d = n`, 'texto'),
    ],
    ({ c, n }) => [
      ...biyeccion(n, c, 'verde').nodos,
      nota('n1', 1, 'a cada casilla llega una sola flecha: si ca ≡ cb, entonces a ≡ b (mod n)', 'verde'),
    ],
  ], {
    1: ({ n }) => [`n/1 = ${n}: no se pierde nada del módulo`, 'verde'],
  }, (c) => ALTO0(c) + 8),
});
