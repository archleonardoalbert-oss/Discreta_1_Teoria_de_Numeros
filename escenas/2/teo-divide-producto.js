// a | b₁·b₂⋯bₙ y a primo relativo con b₁ … bₙ₋₁ ⇒ a | bₙ. El producto como rectángulo de b₁ filas × (b₂⋯bₙ) columnas.
import { escenaPorCapas, rotulo, nota, por, ANCHO } from '../comun.js';
import { cuadricula, rectangulo } from '../primitivas.js';
import { mcd, coeficientes } from '../../motor/aritmetica.js';

const X = 110, Y = 168, ANCHO_MAX = ANCHO - 190, ALTO_MAX = 150;
const producto = (xs) => xs.reduce((s, v) => s * v, 1);

export default escenaPorCapas({
  entradas: [
    { id: 'a', etiqueta: 'a', valor: 4, min: 1, max: 60 },
    { id: 'bs', etiqueta: 'b₁…bₙ', valor: [3, 5, 8], min: 1, max: 60, lista: { min: 2, max: 4 } },
  ],
  validar({ a, bs }) {
    const j = bs.slice(0, -1).findIndex((v) => mcd(a, v) !== 1);
    if (j >= 0) return `el teorema pide mcd(a, b${'₁₂₃'[j]}) = 1 y mcd(${a}, ${bs[j]}) = ${mcd(a, bs[j])}`;
    if (producto(bs) % a !== 0) return `el teorema pide que a divida al producto: ${a} ∤ ${producto(bs)}`;
    const P = producto(bs.slice(1));
    if (bs[0] * P > 900 || P > 150 || bs[0] > 30) return 'demasiado grande para dibujarlo con cuadraditos: prueba números más pequeños';
    return null;
  },
  preparar({ a, bs }) {
    const P = producto(bs.slice(1)), lado = Math.max(4, Math.min(16, Math.floor(ANCHO_MAX / P), Math.floor(ALTO_MAX / bs[0])));
    return { P, lado, ...coeficientes(a, bs[0]) };
  },
  alto: ({ bs, lado }) => Y + bs[0] * lado + 48,
  capas: [
    ({ a, bs, P, lado, x, y }) => [
      ...rectangulo('q', { x: X, y: Y, filas: bs[0], cols: P, lado, c: 'tenue', etiquetaFilas: `b₁ = ${bs[0]}`, etiquetaCols: `${bs.slice(1).join('·')} = ${P}` }),
      rotulo('dim', 24, Y - 30, `${bs[0]} filas × ${P} columnas = ${bs[0] * P}`, 'texto'),
      nota('n0', 0, `${a} | ${bs[0]}·${P};  (${a}, ${bs[0]}) = 1:  ${por(a, x)} + ${por(bs[0], y)} = 1`),
    ],
    ({ a, bs, P, x, y }) => [nota('n1', 1, `· ${P}:  ${a}·${P}·${x < 0 ? `(${x})` : x} + ${bs[0]}·${P}·${y < 0 ? `(${y})` : y} = ${P}`)],
    ({ a, bs, P, lado }) => [
      ...Array.from({ length: P }, (_, k) => cuadricula(`q`, { x: X, y: Y, filas: bs[0], cols: P, lado, c: 'tenue', unidad: '1' })
        .filter((n) => n.k.endsWith(`-${k}`)).map((n) => ({ ...n, c: Math.floor(k / a) % 2 ? 'violeta' : 'cian' }))).flat(),
      nota('n2', 2, `${a} divide a los dos sumandos ⇒ ${a} | ${P}  (las columnas se agrupan de ${a} en ${a})`),
    ],
    ({ a, bs, P }) => [nota('n3', 3, `caso general: ${a} | ${bs[0]}·(${bs.slice(1).join('·')}) y (${a}, ${bs[0]}) = 1 ⇒ ${a} | ${P}`)],
    ({ a, bs }) => [rotulo('res', ANCHO / 2, 28 + 4 * 22, `quitando b₂ … bₙ₋₁ uno a uno:  ${a} | ${bs.at(-1)}`, 'verde', 'middle')],
  ],
});
