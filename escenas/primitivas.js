// Primitivas del idioma visual: recta con saltos, puntos, llaves, cuadraditos con unidad y reglas dobles.
// Cada una devuelve Nodo[] con claves prefijadas por `id`.
import { agrupar, r1 } from '../motor/escala.js';

export const TOPE_SALTOS = 400;   // arcos máximos (ya agrupados) que una escena puede pedir

const texto = (k, x, y, txt, c, extra = {}) => ({ k, t: 'text', a: { x: r1(x), y: r1(y), ...extra }, txt, c });

/** Eje con sus marcas numeradas (fijo: nunca cuenta como «nuevo»). */
export function recta(id, plan, y) {
  const ns = [{ k: `${id}:eje`, t: 'line', a: { x1: plan.x(plan.min), y1: y, x2: plan.x(plan.max), y2: y }, c: 'tenue', fijo: true }];
  for (const m of plan.marcas) {
    ns.push({ k: `${id}:m${m}`, t: 'line', a: { x1: plan.x(m), y1: y - 4, x2: plan.x(m), y2: y + 4 }, c: 'tenue', fijo: true });
    ns.push({ ...texto(`${id}:n${m}`, plan.x(m), y + 20, String(m), 'tenue', { 'text-anchor': 'middle' }), fijo: true });
  }
  return ns;
}

/** n saltos de longitud `salto` desde `desde`; n o salto negativos ⇒ hacia la izquierda. */
export function saltos(id, plan, { desde, salto, n, y, c = 'cian', alturaMax = 40, numerar = true, rotularGrupos = true }) {
  const paso = Math.abs(salto) * Math.sign(salto * n || 1), total = Math.abs(n);
  const g = agrupar(Math.abs(salto) * plan.escala, total);
  const ns = [];
  for (let j = 0, i = 0; i < total; j++, i += g) {
    const cuantos = Math.min(g, total - i);
    const x0 = plan.x(desde + paso * i), x1 = plan.x(desde + paso * (i + cuantos));
    const ancho = Math.abs(x1 - x0), h = Math.min(alturaMax, Math.max(Math.min(10, alturaMax), ancho * 0.45));
    ns.push({ k: `${id}:a${j}`, t: 'path', a: { d: `M ${x0} ${y} Q ${r1((x0 + x1) / 2)} ${r1(y - 2 * h)} ${x1} ${y}` }, c });
    const etiqueta = g > 1 ? (rotularGrupos ? `×${cuantos}` : null) : numerar && ancho >= 16 ? String(i + 1) : null;
    if (etiqueta) ns.push(texto(`${id}:t${j}`, (x0 + x1) / 2, y - h - 6, etiqueta, c, { 'text-anchor': 'middle' }));
  }
  return ns;
}

/** Punto destacado sobre la recta con su rótulo encima. */
export function punto(id, plan, v, y, { c = 'ciruela', etiqueta } = {}) {
  const ns = [{ k: `${id}:p`, t: 'circle', a: { cx: plan.x(v), cy: y, r: 5 }, c }];
  if (etiqueta) ns.push(texto(`${id}:e`, plan.x(v), y - 14, etiqueta, c, { 'text-anchor': 'middle' }));
  return ns;
}

/** Llave bajo el tramo [v1, v2] con un texto debajo. */
export function llave(id, plan, v1, v2, y, txt, c = 'ambar') {
  const x1 = plan.x(Math.min(v1, v2)), x2 = plan.x(Math.max(v1, v2)), xm = r1((x1 + x2) / 2);
  return [
    { k: `${id}:ll`, t: 'path', a: { d: `M ${x1} ${y} L ${x1} ${y + 6} L ${x2} ${y + 6} L ${x2} ${y} M ${xm} ${y + 6} L ${xm} ${y + 11}` }, c },
    texto(`${id}:tx`, xm, y + 26, txt, c, { 'text-anchor': 'middle' }),
  ];
}

/** Rectángulo de filas × cols cuadraditos de `lado` px, con la unidad rotulada al lado. */
export function cuadricula(id, { x, y, filas, cols, lado, c = 'cian', unidad = '1' }) {
  const ns = [];
  for (let f = 0; f < filas; f++)
    for (let k = 0; k < cols; k++)
      ns.push({ k: `${id}:c${f}-${k}`, t: 'rect', a: { x: r1(x + k * lado), y: r1(y + f * lado), width: lado - 1, height: lado - 1 }, c });
  const ux = x + cols * lado + 16;
  ns.push({ k: `${id}:u`, t: 'rect', a: { x: r1(ux), y: r1(y), width: lado - 1, height: lado - 1 }, c });
  ns.push(texto(`${id}:ut`, ux + lado + 6, y + lado - 2, `= ${unidad}`, c));
  return ns;
}

/** Dos reglas: abajo en unidades; arriba una marca cada b, numeradas 0…k (cambio de escala explícito).
 *  Con muchas marcas se numeran (y se guían) solo las que caben, siempre la última.
 *  `abajo: false` omite la regla inferior cuando la recta principal ya está en `y`. */
export function reglasDobles(id, plan, { b, k, y, abajo = true }) {
  const arriba = y - 44, px = Math.abs(b) * plan.escala;
  const cadaEtiqueta = Math.max(1, Math.ceil(28 / px)), cadaMarca = Math.max(1, Math.ceil(4 / px));
  const ns = [
    ...(abajo ? [{ k: `${id}:ab`, t: 'line', a: { x1: plan.x(0), y1: y, x2: plan.x(b * k), y2: y }, c: 'tenue' }] : []),
    { k: `${id}:ar`, t: 'line', a: { x1: plan.x(0), y1: arriba, x2: plan.x(b * k), y2: arriba }, c: 'violeta' },
  ];
  for (let i = 0; i <= k; i++) {
    const etiqueta = i % cadaEtiqueta === 0 || i === k;
    if (!etiqueta && i % cadaMarca !== 0) continue;
    const xi = plan.x(b * i);
    ns.push({ k: `${id}:m${i}`, t: 'line', a: { x1: xi, y1: arriba - 5, x2: xi, y2: arriba + 5 }, c: 'violeta' });
    if (!etiqueta) continue;
    ns.push(texto(`${id}:n${i}`, xi, arriba - 10, String(i), 'violeta', { 'text-anchor': 'middle' }));
    ns.push({ k: `${id}:g${i}`, t: 'line', a: { x1: xi, y1: arriba + 5, x2: xi, y2: y }, c: 'muy-tenue' });
    if (abajo) ns.push(texto(`${id}:v${i}`, xi, y + 18, String(b * i), 'tenue', { 'text-anchor': 'middle' }));
  }
  return ns;
}
