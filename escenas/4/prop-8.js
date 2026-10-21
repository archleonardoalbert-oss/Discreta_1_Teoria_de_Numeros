// Propiedad 8: desplazar a y b la misma distancia c. En la tabla enrollada las dos flechas son copias exactas
// (misma forma, mismo largo): llegan a la misma columna.
import { escenaPorCapas, conPuentes, rotulo, num, flecha } from '../comun.js';
import { geoTabla, tabla, aro, columna, mod } from '../piezas/modular.js';

const ALTO0 = ({ g }) => g.abajo + 80;

export default escenaPorCapas({
  entradas: [
    { id: 'n', etiqueta: 'n', valor: 5, min: 3, max: 9 }, { id: 'a', etiqueta: 'a', valor: 3, min: -12, max: 20 },
    { id: 'b', etiqueta: 'b', valor: 13, min: -12, max: 20 }, { id: 'c', etiqueta: 'c', valor: 4, min: -12, max: 12 },
  ],
  validar: ({ n, a, b }) => (mod(a, n) !== mod(b, n) ? `${num(a)} ≢ ${num(b)} (mod ${n})` : null),
  preparar({ n, a, b, c }) {
    const vs = [0, n - 1, a, b, a + c, b + c];
    return { g: geoTabla(n, Math.min(...vs), Math.max(...vs), { x: 40, y: 60, altoMax: 300, ancho: 380 }) };
  },
  alto: (c) => ALTO0(c) + 26,
  base: ({ g, a, b }) => [...tabla('T', g, { colores: { [a]: 'ciruela', [b]: 'ciruela' } }), aro('aa', g, a, 'ciruela'), aro('ab', g, b, 'ciruela')],
  capas: conPuentes([
    ({ g, a, b, c, n }) => [rotulo('t0', 24, g.abajo + 36, `${num(a)} ≡ ${num(b)} (mod ${n}) y también ${num(c)} ≡ ${num(c)}`, 'texto')],
    ({ g, a, b, c, n }) => {
      const p = g.pos(a), q = g.pos(a + c), p2 = g.pos(b), q2 = g.pos(b + c);
      return [
        ...(c === 0 ? [] : [flecha('fa', p.x, p.y - 4, q.x, q.y - 4, 'cian', 14), flecha('fb', p2.x, p2.y - 4, q2.x, q2.y - 4, 'cian', 14)]),
        aro('ac', g, a + c, 'verde'), aro('bc', g, b + c, 'verde'), columna('col', g, mod(a + c, n), 'verde'),
        rotulo('t1', 24, g.abajo + 58, `+${num(c)} a los dos: ${num(a + c)} ≡ ${num(b + c)} (mod ${n})`, 'verde'),
      ];
    },
  ], {
    0: () => ['c ≡ c es la propiedad 1; con la propiedad 4 (d = c) sale la suma', 'texto'],
  }, (c) => ALTO0(c) + 8),
});
