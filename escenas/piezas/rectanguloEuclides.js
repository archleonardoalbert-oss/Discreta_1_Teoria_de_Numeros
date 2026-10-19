// Pieza reutilizable: el algoritmo de Euclides como un rectángulo a × b cortado en los mayores cuadrados posibles.
// Cada fila a = q·b + r corta q cuadrados de lado b; queda un rectángulo b × r (girado) para la fila siguiente.
// El lado del último cuadrado es el mcd. Con q grande, los q cuadrados se dibujan como un bloque rotulado.
import { r1 } from '../../motor/escala.js';

const MAX_CUADRADOS = 12;
const COLORES = ['cian', 'violeta'];

/**
 * Nodos de las filas 0…hasta−1 de `filas` (euclides(a, b).filas) dentro de la caja (x, y, ancho, alto).
 * Devuelve también, como último nodo, el contorno del rectángulo-resto pendiente (si queda).
 */
export function rectanguloEuclides(id, filas, { x, y, ancho, alto, hasta = filas.length, rotular = true, verdeUltima = true }) {
  const { a, b } = filas[0];
  const esc = Math.min(ancho / a, alto / b);
  const ns = [];
  let cx = x, cy = y, horizontal = true;               // el lado largo del rectángulo actual va en horizontal
  filas.slice(0, hasta).forEach((f, i) => {
    const lado = f.b * esc, final = verdeUltima && i === filas.length - 1;
    const c = final ? 'verde' : COLORES[i % 2];
    const pieza = (k, px, py, w, h) => ({ k, t: 'rect', a: { x: r1(px), y: r1(py), width: r1(Math.max(w - 1, 0.5)), height: r1(Math.max(h - 1, 0.5)) }, c });
    if (f.q > MAX_CUADRADOS) {
      ns.push(horizontal ? pieza(`${id}${i}:s0`, cx, cy, f.q * lado, lado) : pieza(`${id}${i}:s0`, cx, cy, lado, f.q * lado));
      if (rotular && lado >= 14) ns.push({ k: `${id}${i}:t`, t: 'text', a: { x: r1(cx + 4), y: r1(cy + Math.min(lado, 16) - 3) }, txt: `${f.q} × ${f.b}`, c });
    } else {
      for (let j = 0; j < f.q; j++)
        ns.push(horizontal ? pieza(`${id}${i}:s${j}`, cx + j * lado, cy, lado, lado) : pieza(`${id}${i}:s${j}`, cx, cy + j * lado, lado, lado));
      if (rotular && lado >= 22) ns.push({ k: `${id}${i}:t`, t: 'text', a: { x: r1(cx + lado / 2), y: r1(cy + lado / 2 + 4), 'text-anchor': 'middle' }, txt: String(f.b), c });
    }
    if (horizontal) cx += f.q * lado; else cy += f.q * lado;
    horizontal = !horizontal;
  });
  const f = filas[hasta - 1];
  if (f && f.r > 0) {                                   // lo que queda por cortar: r × b
    const [w, h] = horizontal ? [f.b * esc, f.r * esc] : [f.r * esc, f.b * esc];
    ns.push({ k: `${id}:resto`, t: 'rect', a: { x: r1(cx), y: r1(cy), width: r1(Math.max(w - 1, 0.5)), height: r1(Math.max(h - 1, 0.5)) }, c: 'ambar', hueco: true });
  }
  return ns;
}
