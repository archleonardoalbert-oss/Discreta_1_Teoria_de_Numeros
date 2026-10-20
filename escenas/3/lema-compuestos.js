// n compuestos consecutivos: (n+1)! = 1·2·…·(n+1); cada k de 2 a n+1 sale de su caja del factorial y divide
// a (n+1)! + k.
import { escenaPorCapas, rotulo, ANCHO } from '../comun.js';
import { cajas } from '../piezas/cajas.js';
import { factorialBig } from '../../motor/primos.js';

const X = 24, YF = 64, Y0 = 136, DY = 32;

export default escenaPorCapas({
  entradas: [{ id: 'n', etiqueta: 'n', valor: 5, min: 1, max: 7 }],
  preparar({ n }) {
    const F = factorialBig(n + 1), ks = Array.from({ length: n }, (_, i) => i + 2);
    const prod = cajas('F', { x: X, y: YF, valores: Array.from({ length: n + 1 }, (_, i) => i + 1), hueco: 16 });
    return { F, ks, prod };
  },
  alto: ({ n }) => Y0 + n * DY + 30,
  capas: [
    ({ n, F, ks, prod }) => [
      ...prod, rotulo('Ft', X + prod.ancho + 14, YF, `= ${n + 1}! = ${F}`, 'cian'),
      ...ks.map((k, i) => rotulo(`fila${k}`, X, Y0 + i * DY, `${F} + ${k} = ${F + BigInt(k)}`, 'texto')),
    ],
    ({ F, ks }) => ks.map((k, i) => ({ ...rotulo(`div${k}`, 330, Y0 + i * DY, `${k} | ${F + BigInt(k)}`, 'verde'), desde: `F:v${k - 1}` })),
    ({ F, ks }) => ks.map((k, i) => rotulo(`comp${k}`, 470, Y0 + i * DY, `compuesto (1 < ${k} < ${F + BigInt(k)})`, 'verde')),
  ],
});
