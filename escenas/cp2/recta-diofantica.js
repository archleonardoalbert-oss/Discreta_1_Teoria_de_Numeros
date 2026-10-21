// CP-02, ejercicio 6 (planteamiento): la recta ax + by = c sobre la cuadrícula de puntos enteros; sus puntos
// enteros son las soluciones. Un segmento de longitud √(a² + b²) puesto sobre la recta: ¿siempre toca alguno?
import { escenaPorCapas, rotulo, num } from '../comun.js';
import { mcd, diofantica } from '../../motor/aritmetica.js';
import { r1 } from '../../motor/escala.js';

export const ENTRADAS = [
  { id: 'a', etiqueta: 'a', valor: 2, min: -6, max: 6 },
  { id: 'b', etiqueta: 'b', valor: 3, min: -6, max: 6 },
  { id: 'c', etiqueta: 'c', valor: 6, min: -20, max: 20 },
];
export const validarRecta = ({ a, b }) =>
  (a === 0 || b === 0 ? 'a y b deben ser distintos de 0' : mcd(a, b) !== 1 ? `(a, b) = ${mcd(a, b)}: el ejercicio pide (a, b) = 1` : null);

const Y0 = 76, ANCHO_UTIL = 600, ALTO_UTIL = 300;

/** Tres soluciones consecutivas (k = −1, 0, 1) alrededor de la más cercana al origen, y la ventana que las contiene. */
export function geometria({ a, b, c }) {
  const s = diofantica(a, b, c);
  // la solución más cercana al origen: k que minimiza |(x0 + kb, y0 − ka)|
  const k0 = Math.round(-(s.x0 * b - s.y0 * a) / (a * a + b * b));
  const P = (t) => ({ x: s.x0 + (k0 + t) * b, y: s.y0 - (k0 + t) * a });
  const pts = [-1, 0, 1].map(P);
  const xs = pts.map((p) => p.x), ys = pts.map((p) => p.y);
  const xmin = Math.floor(Math.min(...xs)) - 2, xmax = Math.ceil(Math.max(...xs)) + 2;
  const ymin = Math.floor(Math.min(...ys)) - 2, ymax = Math.ceil(Math.max(...ys)) + 2;
  const u = Math.min(40, ANCHO_UTIL / (xmax - xmin), ALTO_UTIL / (ymax - ymin));
  const X = (x) => r1(40 + (x - xmin) * u), Y = (y) => r1(Y0 + (ymax - y) * u);
  return { P, xmin, xmax, ymin, ymax, u, X, Y, L: Math.sqrt(a * a + b * b) };
}

/** Soluciones enteras dentro de la ventana, en orden de k. */
export function solucionesVisibles(e) {
  const g = geometria(e), res = [];
  for (let t = -20; t <= 20; t++) {
    const p = g.P(t);
    if (p.x >= g.xmin && p.x <= g.xmax && p.y >= g.ymin && p.y <= g.ymax) res.push({ ...p, t });
  }
  return res;
}

/** Cuadrícula de puntos enteros, ejes y la recta recortada a la ventana. */
export function fondo({ a, b, c }, g) {
  const ns = [];
  for (let x = g.xmin; x <= g.xmax; x++) for (let y = g.ymin; y <= g.ymax; y++)
    ns.push({ k: `g${x},${y}`, t: 'circle', a: { cx: g.X(x), cy: g.Y(y), r: 1.6 }, c: 'muy-tenue', fijo: true });
  if (g.xmin <= 0 && g.xmax >= 0) ns.push({ k: 'ejeY', t: 'line', a: { x1: g.X(0), y1: g.Y(g.ymax), x2: g.X(0), y2: g.Y(g.ymin) }, c: 'muy-tenue', fijo: true });
  if (g.ymin <= 0 && g.ymax >= 0) ns.push({ k: 'ejeX', t: 'line', a: { x1: g.X(g.xmin), y1: g.Y(0), x2: g.X(g.xmax), y2: g.Y(0) }, c: 'muy-tenue', fijo: true });
  // la recta: los parámetros t en los que sale de la ventana
  const ts = [];
  for (const [lim, coord] of [[g.xmin, 'x'], [g.xmax, 'x'], [g.ymin, 'y'], [g.ymax, 'y']]) {
    const p0 = g.P(0), d = coord === 'x' ? b : -a;
    if (d !== 0) { const t = (lim - p0[coord]) / d, p = g.P(t); if (p.x >= g.xmin - 1e-9 && p.x <= g.xmax + 1e-9 && p.y >= g.ymin - 1e-9 && p.y <= g.ymax + 1e-9) ts.push(t); }
  }
  const [t1, t2] = [Math.min(...ts), Math.max(...ts)], A = g.P(t1), B = g.P(t2);
  ns.push({ k: 'recta', t: 'line', a: { x1: g.X(A.x), y1: g.Y(A.y), x2: g.X(B.x), y2: g.Y(B.y) }, c: 'cian' });
  ns.push(rotulo('ecu', 24, 26, `${num(a)}x ${b < 0 ? '−' : '+'} ${Math.abs(b)}y = ${num(c)}`, 'cian'));
  return ns;
}
export const puntoSol = (k, g, p, c = 'verde', extra = {}) => ({ k, t: 'circle', a: { cx: g.X(p.x), cy: g.Y(p.y), r: 5 }, c, ...extra });
/** El segmento P(t1)…P(t2) dibujado como una regla paralela a la recta (desplazada 10 px) con topes en los extremos. */
export const segmento = (k, g, t1, t2, c = 'ambar') => {
  const A = g.P(t1), B = g.P(t2), ax = g.X(A.x), ay = g.Y(A.y), bx = g.X(B.x), by = g.Y(B.y);
  const l = Math.hypot(bx - ax, by - ay), nx = (-(by - ay) / l) * 10, ny = ((bx - ax) / l) * 10;
  const p = (x, y, f) => `${r1(x + nx * f)} ${r1(y + ny * f)}`;
  return { k, t: 'path', a: { d: `M ${p(ax, ay, 0)} L ${p(ax, ay, 1.6)} M ${p(ax, ay, 1)} L ${p(bx, by, 1)} M ${p(bx, by, 0)} L ${p(bx, by, 1.6)}` }, c };
};
export const altoRecta = (g) => r1(Y0 + (g.ymax - g.ymin) * g.u + 30);
const raiz = (a, b) => `√${a * a + b * b} ≈ ${Math.sqrt(a * a + b * b).toFixed(2).replace('.', ',')}`;
export { raiz };

export default escenaPorCapas({
  entradas: ENTRADAS,
  validar: validarRecta,
  preparar: (e) => ({ g: geometria(e) }),
  alto: ({ g }) => altoRecta(g),
  base: (ctx) => fondo(ctx, ctx.g),
  capas: [
    () => [rotulo('t0', 24, 50, 'la recta y la cuadrícula de puntos con coordenadas enteras', 'texto')],
    (ctx) => [
      ...solucionesVisibles(ctx).map((p, i) => ({ ...puntoSol(`s${p.t}`, ctx.g, p), orden: i * 0.2 })),
      rotulo('t0', 24, 50, 'verde: los puntos enteros de la recta = las soluciones', 'verde'),
    ],
    ({ a, b, g }) => [
      { ...segmento('seg', g, -0.65, 0.35), supuesto: false },
      rotulo('t0', 24, 50, `un segmento sobre la recta de longitud ${raiz(a, b)}`, 'ambar'),
    ],
    () => [rotulo('t0', 24, 50, '¿lo pongas donde lo pongas, contiene siempre un punto verde?', 'ciruela')],
  ],
});
