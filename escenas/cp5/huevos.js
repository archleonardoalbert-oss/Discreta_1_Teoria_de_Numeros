// CP-05, ejercicio 3 (planteamiento): el mismo montón de N huevos agrupado de 2 en 2, de 3 en 3, …, de 6 en 6
// (siempre sobra uno, en ámbar) y de 7 en 7 (no sobra ninguno). No se sabe N: los grupos terminan en «…».
import { escenaPorCapas, rotulo } from '../comun.js';

const R = 5, X0 = 150, DY = 44;

/** Fila «grupos de m»: tres grupos de m huevos, «…» y, si sobra, el huevo suelto. */
function fila(m, y, sobra, c) {
  const ns = [rotulo(`g${m}:t`, 24, y + 4, `grupos de ${m}:`, 'texto')];
  let x = X0;
  for (let g = 0; g < 3; g++) {
    for (let i = 0; i < m; i++) ns.push({ k: `g${m}:${g}:${i}`, t: 'circle', a: { cx: x + i * (2 * R + 2), cy: y, r: R }, c, orden: g * 0.3 });
    x += m * (2 * R + 2) + 14;
  }
  ns.push({ ...rotulo(`g${m}:pp`, x, y + 4, '…', 'tenue'), orden: 1 });
  if (sobra) ns.push({ k: `g${m}:suelto`, t: 'circle', a: { cx: x + 40, cy: y, r: R + 1 }, c: 'ambar', orden: 1.4 }, { ...rotulo(`g${m}:suelto-t`, x + 54, y + 4, 'sobra 1', 'ambar'), orden: 1.4 });
  else ns.push({ ...rotulo(`g${m}:ok`, x + 34, y + 4, 'no sobra ninguno', 'verde'), orden: 1.4 });
  return ns;
}

export default escenaPorCapas({
  entradas: [],
  alto: 370,
  capas: [
    () => [rotulo('t', 24, 28, 'N huevos: no sabemos cuántos. Lo que recuerda la mujer:', 'texto')],
    () => [2, 3, 4].flatMap((m, i) => fila(m, 64 + i * DY, true, 'cian')),
    () => [5, 6].flatMap((m, i) => fila(m, 64 + (3 + i) * DY, true, 'cian')),
    () => [...fila(7, 64 + 5 * DY, false, 'violeta'),
      rotulo('q', 24, 64 + 6 * DY + 6, '¿cuál es el menor N posible?', 'ciruela')],
  ],
});
