// Propiedad fuerte 3 en rectángulos. a × c con c = qn + d: el trozo a × qn (columnas en bloques de n) se separa
// y se apaga por ser múltiplo de n; lo que queda, a × d, se compara con b × d: la diferencia es la tira
// (a − b) × d, múltiplo de n; como mcd(d, n) = 1, n | a − b.
import { escenaPorCapas, rotulo, nota, linea, num } from '../comun.js';
import { mcd } from '../../motor/aritmetica.js';
import { r1 } from '../../motor/escala.js';

const X = 90, Y = 190;

export default escenaPorCapas({
  entradas: [
    { id: 'n', etiqueta: 'n', valor: 5, min: 2, max: 7 }, { id: 'a', etiqueta: 'a', valor: 7, min: 1, max: 10 },
    { id: 'b', etiqueta: 'b', valor: 2, min: 1, max: 10 }, { id: 'c', etiqueta: 'c', valor: 8, min: 1, max: 16 },
    { id: 'd', etiqueta: 'd', valor: 3, min: 1, max: 16 },
  ],
  validar: ({ n, a, b, c, d }) => (c < d || a <= b ? 'para el dibujo: c ≥ d y a > b'
    : (c - d) % n ? `${c} ≢ ${d} (mod ${n})` : mcd(c, n) !== 1 ? `mcd(${c}, ${n}) ≠ 1` : (a * c - b * d) % n ? `${a}·${c} ≢ ${b}·${d} (mod ${n})` : null),
  preparar({ n, a, b, c, d }) {
    const q = (c - d) / n, lado = Math.min(22, 440 / (c + 1), 130 / a), gap = q ? 22 : 0;
    // celda (i, j) del rectángulo a × c: columna i (0…c−1), fila j (0…a−1); `separar` aparta el bloque qn
    const celda = (i, j, col, separar = 0) => ({ k: `A${i}-${j}`, t: 'rect', a: { x: r1(X + i * lado - (i < q * n ? separar : 0)), y: r1(Y + j * lado), width: r1(lado - 2), height: r1(lado - 2), rx: 2 }, c: col });
    const xd = X + q * n * lado;                                        // donde empieza el trozo a × d
    return { q, lado, gap, celda, xd, YB: Y + a * lado + 30 };
  },
  alto: ({ YB, b, lado }) => YB + b * lado + 50,
  capas: [
    ({ a, b, c, d, n, lado, celda, xd, YB }) => [
      ...Array.from({ length: a * c }, (_, t) => celda(t % c, Math.floor(t / c), 'cian')),
      rotulo('la', X - 10, Y + (a * lado) / 2 + 4, `a = ${a}`, 'cian', 'end'),
      rotulo('lc', X + (c * lado) / 2, Y - 10, `c = ${c}`, 'cian', 'middle'),
      ...Array.from({ length: b * d }, (_, t) => ({ k: `B${t}`, t: 'rect', a: { x: r1(xd + (t % d) * lado), y: r1(YB + Math.floor(t / d) * lado), width: r1(lado - 2), height: r1(lado - 2), rx: 2 }, c: 'violeta' })),
      rotulo('lb', xd - 10, YB + (b * lado) / 2 + 4, `b = ${b}`, 'violeta', 'end'),
      rotulo('ld', xd + (d * lado) / 2, YB + b * lado + 18, `d = ${d}`, 'violeta', 'middle'),
      nota('n0', 0, `c ≡ d (mod ${n}) ⇒ mcd(${d}, ${n}) = mcd(${c}, ${n}) = 1`, 'texto'),
    ],
    ({ a, c, n, q, d, lado, celda, xd }) => [
      ...Array.from({ length: a * c }, (_, t) => { const i = t % c; return celda(i, Math.floor(t / c), i < q * n ? 'cian' : 'ambar'); }),
      ...Array.from({ length: q }, (_, j) => ({ ...linea(`cn${j}`, X + (j + 1) * n * lado - 1, Y - 3, X + (j + 1) * n * lado - 1, Y + a * lado + 1, 'verde'), ancho: 3 })),
      { k: 'lc', quitar: true },
      ...(q ? [rotulo('lqn', X + (q * n * lado) / 2, Y - 10, `qn = ${q}·${n}`, 'cian', 'middle')] : []),
      rotulo('ldd', xd + (d * lado) / 2, Y - 10, `d = ${d}`, 'ambar', 'middle'),
      nota('n1', 1, `c − d = qn:  c = ${q}·${n} + ${d}`, 'texto'),
    ],
    ({ a, b, c, d, n }) => [nota('n2', 2, `ac − bd = ${a * c} − ${b * d} = ${a * c - b * d} = kn;  a(qn + d) − bd = kn`, 'texto')],
    ({ a, c, n, q, gap, celda }) => [
      ...Array.from({ length: a * c }, (_, t) => { const i = t % c; return i < q * n ? celda(i, Math.floor(t / c), 'cian', gap) : null; }).filter(Boolean),
      ...Array.from({ length: q }, (_, j) => ({ ...linea(`cn${j}`, X + (j + 1) * n * (celda(0, 0, '').a.width + 2) - 1 - (j === q - 1 ? 0 : gap), Y - 3, X + (j + 1) * n * (celda(0, 0, '').a.width + 2) - 1 - (j === q - 1 ? 0 : gap), Y + a * (celda(0, 0, '').a.width + 2) + 1, 'verde'), ancho: 3 })),
      nota('n3', 3, 'aqn + ad − bd = kn:  el trozo a × qn se separa', 'texto'),
    ],
    ({ a, c, n, q, gap, celda, lado }) => [
      ...(q ? [{ k: 'lqn', quitar: true }] : []),
      ...Array.from({ length: a * c }, (_, t) => { const i = t % c; return i < q * n ? celda(i, Math.floor(t / c), 'muy-tenue', gap) : null; }).filter(Boolean),
      ...(q ? [rotulo('lqn', X - gap, Y + a * lado + 18, `a·qn: múltiplo de ${n}`, 'tenue')] : []),
      nota('n4', 4, 'ad − bd = kn − aqn', 'texto'),
    ],
    ({ a, b, d, lado, xd, YB, k }) => [
      // b × d sube y se superpone a las b filas de abajo de a × d: lo que sobra arriba es (a − b) × d
      ...Array.from({ length: b * d }, (_, t) => ({ k: `B${t}`, t: 'rect', a: { x: r1(xd + (t % d) * lado), y: r1(Y + (a - b + Math.floor(t / d)) * lado), width: r1(lado - 2), height: r1(lado - 2), rx: 2 }, c: 'violeta' })),
      { k: 'lb', quitar: true }, { k: 'ld', quitar: true },
      { k: 'tira', t: 'rect', a: { x: r1(xd - 3), y: Y - 3, width: r1(d * lado + 4), height: r1((a - b) * lado + 4), rx: 4 }, c: 'verde', hueco: true },
      rotulo('ltira', xd + d * lado + 10, Y + ((a - b) * lado) / 2 + 4, `(a − b)·d = ${(a - b) * d}`, 'verde'),
      nota('n5', 5, `ad − bd = d(a − b) = ${d}·${a - b} = (k − aq)n`, 'verde'),
    ],
    ({ a, b, n, d }) => [nota('n6', 6, `da ≡ db (mod ${n}) y mcd(${d}, ${n}) = 1  ⇒  ${a} ≡ ${b} (mod ${n})`, 'verde')],
  ],
});
