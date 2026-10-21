// Piezas de la aritmética modular (Libros IV y V).
// · La recta enrollada: los enteros en filas de n; la columna es el resto y la fila el cociente (negativos arriba).
// · La aplicación x ↦ f(x) entre dos filas 0…n−1 con flechas y el contador de llegadas a cada casilla.
import { rotulo, flecha, num } from '../comun.js';
import { r1 } from '../../motor/escala.js';

export const mod = (v, n) => ((v % n) + n) % n;

/** Geometría de la tabla enrollada para los enteros de [lo, hi] (se amplía a filas completas). */
export function geoTabla(n, lo, hi, { x = 24, y = 70, ancho = 632, altoMax = 300, dyMax = 30 } = {}) {
  const f0 = Math.floor(lo / n), f1 = Math.floor(hi / n), filas = f1 - f0 + 1;
  const dx = Math.min(58, ancho / n), dy = Math.min(dyMax, altoMax / filas);
  const pos = (v) => ({ x: r1(x + (mod(v, n) + 0.5) * dx), y: r1(y + (Math.floor(v / n) - f0) * dy) });
  return { n, f0, f1, filas, dx, dy, pos, x, y, desde: f0 * n, hasta: (f1 + 1) * n - 1, abajo: y + (filas - 1) * dy };
}

/** Cabecera «r = 0 … n−1» y todos los enteros de la tabla (tenues); `colores`: {valor: color}. */
export function tabla(id, g, { colores = {}, cabecera = true, c = 'tenue' } = {}) {
  const ns = [];
  if (cabecera) for (let r = 0; r < g.n; r++) ns.push(rotulo(`${id}:h${r}`, g.x + (r + 0.5) * g.dx, g.y - g.dy - 6, String(r), 'muy-tenue', 'middle'));
  for (let v = g.desde; v <= g.hasta; v++) ns.push(rotulo(`${id}:v${v}`, g.pos(v).x, g.pos(v).y + 4, num(v), colores[v] ?? c, 'middle'));
  return ns;
}

/** Marco alrededor de la columna r de la tabla. */
export const columna = (k, g, r, c = 'verde', extra = {}) =>
  ({ k, t: 'rect', a: { x: r1(g.x + r * g.dx + 2), y: r1(g.y - g.dy * 0.75), width: r1(g.dx - 4), height: r1(g.filas * g.dy + 2), rx: 8 }, c, hueco: true, ...extra });

/** Aro alrededor del número v de la tabla. */
export const aro = (k, g, v, c = 'ambar', extra = {}) =>
  ({ k, t: 'circle', a: { cx: g.pos(v).x, cy: r1(g.pos(v).y), r: r1(Math.min(13, g.dy / 2 + 1, g.dx / 2 - 1)) }, c, hueco: true, ...extra });

/** Flecha vertical (saltos de n) del número `de` al número `a` de la misma columna, desplazada `lado` px. */
export function saltoVertical(k, g, de, a, c = 'cian', lado = 0) {
  const p = g.pos(de), q = g.pos(a), s = Math.sign(q.y - p.y) || 1, d = Math.min(9, g.dy / 2);
  return flecha(k, p.x + lado, p.y + s * d - 4, q.x + lado, q.y - s * d - 4, c);
}

/**
 * Aplicación x ↦ f(x) de {xs} en 0…n−1: fila de arriba con los x, fila de abajo con 0…n−1, una flecha por x.
 * Devuelve { nodos, llegadas } con llegadas[y] = cuántas flechas llegan a y.
 * `colorFlecha(x)` y `colorAbajo(y)` permiten resaltar; `contar` pinta «×k» bajo cada casilla.
 */
export function geoFilas(n, { x = 40, ancho = 600, y1 = 80, y2 = 230 } = {}) {
  const dx = ancho / n, px = (i) => r1(x + (i + 0.5) * dx);
  return { n, dx, px, y1, y2 };
}
export function filasFlechas(id, g, f, { xs = [...Array(g.n).keys()], colorFlecha = () => 'violeta', colorArriba = () => 'texto', colorAbajo = () => 'texto', contar = false, etiquetas = {} } = {}) {
  const ns = [], llegadas = Array(g.n).fill(0);
  for (let i = 0; i < g.n; i++) ns.push(rotulo(`${id}:b${i}`, g.px(i), g.y2 + 18, String(i), colorAbajo(i), 'middle'));
  for (let i = 0; i < g.n; i++) ns.push({ k: `${id}:pb${i}`, t: 'circle', a: { cx: g.px(i), cy: g.y2, r: 4 }, c: colorAbajo(i) === 'texto' ? 'tenue' : colorAbajo(i) });
  xs.forEach((v) => {
    const i = mod(v, g.n), y = mod(f(v), g.n);
    llegadas[y]++;
    ns.push(rotulo(`${id}:a${i}`, g.px(i), g.y1 - 10, etiquetas[v] ?? String(v), colorArriba(v), 'middle'));
    ns.push({ k: `${id}:pa${i}`, t: 'circle', a: { cx: g.px(i), cy: g.y1, r: 4 }, c: colorArriba(v) === 'texto' ? 'tenue' : colorArriba(v) });
    ns.push({ ...flecha(`${id}:f${i}`, g.px(i), g.y1 + 7, g.px(y), g.y2 - 8, colorFlecha(v)), orden: i * 0.3 });
  });
  if (contar) for (let i = 0; i < g.n; i++) if (llegadas[i]) ns.push(rotulo(`${id}:n${i}`, g.px(i), g.y2 + 38, `×${llegadas[i]}`, llegadas[i] > 1 ? 'ambar' : 'verde', 'middle'));
  return { nodos: ns, llegadas };
}
