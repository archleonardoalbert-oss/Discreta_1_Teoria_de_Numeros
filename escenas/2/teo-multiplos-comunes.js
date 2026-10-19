// Todo múltiplo común es k·ab/(a,b): m = k₁a = k₂b, se divide por d y la coprimalidad obliga a b/d | k₁.
import { escenaPorCapas, carril, rotulo, nota, ANCHO } from '../comun.js';
import { planRecta } from '../../motor/escala.js';
import { recta, punto, rectangulo } from '../primitivas.js';
import { dosSaltadores } from '../piezas/multiplos.js';
import { mcd } from '../../motor/aritmetica.js';

const YA = 150, YB = 198, YL = 246, EJE = 304, K = 2, RX = 110, RY = EJE + 74;

export default escenaPorCapas({
  entradas: [
    { id: 'a', etiqueta: 'a', valor: 4, min: 1, max: 40 },
    { id: 'b', etiqueta: 'b', valor: 6, min: 1, max: 40 },
  ],
  preparar({ a, b }) {
    const d = mcd(a, b), L = (a * b) / d, m = K * L;
    const lado = Math.max(3, Math.min(14, Math.floor(420 / b), Math.floor(160 / a)));
    return { d, L, m, k1: m / a, k2: m / b, lado, p: planRecta({ min: -m * 0.04, max: m * 1.06, ancho: ANCHO }) };
  },
  alto: ({ a, lado }) => RY + a * lado + 76,
  base: ({ p }) => recta('eje', p, EJE),
  capas: [
    ({ a, b, m, k1, k2, p }) => [
      ...dosSaltadores(p, { a, b, hasta: m, yA: YA, yB: YB }),
      ...punto('pm', p, m, EJE, { c: 'ciruela', etiqueta: `m = ${m}` }),
      nota('n0', 0, `m = k₁·a = k₂·b:  ${m} = ${k1}·${a} = ${k2}·${b}`),
    ],
    ({ a, b, d, k1, k2 }) => [nota('n1', 1, `÷ d = ${d}:  k₁·(a/d) = k₂·(b/d):  ${k1}·${a / d} = ${k2}·${b / d}`)],
    ({ a, b, d, k1 }) => [nota('n2', 2, `b/d = ${b / d} | k₁·(a/d) = ${k1}·${a / d}  y  (${a / d}, ${b / d}) = 1`)],
    ({ a, b, d, k1, L, lado }) => {
      const tira = b / d;     // las b columnas en d tiras de b/d columnas: una tira tiene a·(b/d) = ab/d cuadraditos
      const celdas = rectangulo('R', { x: RX, y: RY, filas: a, cols: b, lado, c: 'tenue', etiquetaFilas: `a = ${a}`, etiquetaCols: `b = ${b}` })
        .map((n) => { const k = /^R:c\d+-(\d+)$/.exec(n.k); if (!k) return n; const j = Math.floor(k[1] / tira); return { ...n, c: j === 0 ? 'verde' : j % 2 ? 'violeta' : 'tenue' }; });
      return [
        nota('n3', 3, `⇒ b/d | k₁:  k₁ = k·(b/d) = ${k1 / tira}·${tira},  y m = k₁·a = k·a·(b/d)`),
        ...celdas,
        rotulo('Rt', RX, RY + a * lado + 22, `${d} ${d === 1 ? 'tira' : 'tiras'} de b/d = ${tira} columnas; una tira: a·(b/d) = ${a}·${tira} = ab/d = ${L}`, 'verde'),
      ];
    },
    ({ a, b, d, L, m, lado, p }) => [
      ...carril('ll', p, YL, { salto: L, n: K, c: 'verde', etiqueta: `saltos de ab/d = ${a}·${b}/${d} = ${L}` }),
      rotulo('res', ANCHO / 2, RY + a * lado + 54, `m = k·ab/(a,b) = ${K}·${L} = ${m}`, 'verde', 'middle'),
    ],
  ],
});
