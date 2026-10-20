// Ayudantes reutilizables para escribir escenas de cualquier libro.
import { planRecta, agrupar, r1 } from '../motor/escala.js';
import { saltos } from './primitivas.js';

export const ANCHO = 680;   // ancho estándar de las escenas (viewBox)

/** Nodo de texto. */
export const rotulo = (k, x, y, txt, c = 'texto', anchor = 'start') =>
  ({ k, t: 'text', a: { x: r1(x), y: r1(y), 'text-anchor': anchor }, txt, c });

/** Línea recta entre dos puntos (guías, conectores). */
export const linea = (k, x1, y1, x2, y2, c = 'muy-tenue') =>
  ({ k, t: 'line', a: { x1: r1(x1), y1: r1(y1), x2: r1(x2), y2: r1(y2) }, c });

/**
 * Escena hecha de capas: el paso i muestra base + capas 0…i (lo anterior se queda dibujado).
 * Si una capa posterior emite una clave ya existente, la sustituye en su sitio (sirve para recolorear).
 * `ref: true` reilumina una pieza anterior solo en el paso de esa capa; `{ k, quitar: true }` la elimina;
 * `{ reemplaza: 'prefijo' }` borra todas las piezas con ese prefijo (un carril vuelto a emitir sustituye al viejo).
 * `preparar(e)` calcula una vez lo que necesitan las capas; reciben {...e, ...preparar(e)}.
 */
export function escenaPorCapas({ entradas, validar = () => null, alto, ancho = ANCHO, preparar = () => ({}), base = () => [], capas, leyenda, camara }) {
  return {
    entradas, validar, capas: capas.length, leyenda,
    // camara(ctx, paso) → [x, y, ancho, alto] o null (vista completa)
    ...(camara ? { camara: (e, paso) => camara({ ...e, ...preparar(e) }, paso) } : {}),
    vista: (e) => ({ ancho, alto: typeof alto === 'function' ? alto({ ...e, ...preparar(e) }) : alto }),
    estado(e, paso) {
      const ctx = { ...e, ...preparar(e) };
      const nodos = new Map();
      for (const n of base(ctx)) nodos.set(n.k, n);
      const ultima = Math.min(paso, capas.length - 1);
      capas.slice(0, ultima + 1).forEach((capa, i) => {
        for (const n of capa(ctx)) {
          if (n.reemplaza) { for (const k of [...nodos.keys()]) if (k.startsWith(n.reemplaza)) nodos.delete(k); continue; }
          if (n.quitar) nodos.delete(n.k);              // { k, quitar: true }: esa pieza deja de dibujarse
          else nodos.set(n.k, n.ref && i !== ultima ? { ...n, ref: undefined } : n);   // ref: solo se reilumina en su propio paso
        }
      });
      return [...nodos.values()];
    },
  };
}

/** Plan de recta que contiene el 0 y todos los valores, con un margen del 6 %. */
export function planPara(valores, ancho = ANCHO) {
  const min = Math.min(0, ...valores), max = Math.max(0, ...valores);
  const pad = Math.max(1, (max - min) * 0.06);
  return planRecta({ min: min - pad, max: max + pad, ancho });
}

/** Carril: una línea base propia con n saltos de `salto` desde `desde` y su etiqueta a la izquierda. */
export function carril(id, plan, y, { salto, n, c = 'cian', etiqueta, desde = 0 }) {
  const ns = [{ k: `${id}:*`, reemplaza: `${id}:` },          // si el carril se vuelve a emitir, sustituye al anterior entero
    linea(`${id}:base`, plan.x(plan.min), y, plan.x(plan.max), y, 'muy-tenue')];
  ns.push(...saltos(id, plan, { desde, salto, n, y, c, alturaMax: 12, numerar: false, rotularGrupos: false }));
  const g = agrupar(Math.abs(salto) * plan.escala, n);
  if (etiqueta) ns.push(rotulo(`${id}:et`, plan.x(plan.min), y - 17, g > 1 ? `${etiqueta}  (cada arco = ${g} saltos)` : etiqueta, c));
  return ns;
}

/** Filas de texto (tablas tipo Euclides); la fila `actual` va en ámbar, `hechas` en texto normal. */
export function filas(id, lineas, { x, y, dy = 22, actual = -1, anchor = 'start' }) {
  return lineas.map((txt, i) => rotulo(`${id}:${i}`, x, y + i * dy, txt, i === actual ? 'ambar' : 'texto', anchor));
}

/** Ancho aproximado de un texto de la escena (JetBrains Mono a 13 px). */
export const ANCHO_LETRA = 7.8;
export const cabe = (txt, px) => [...txt].length * ANCHO_LETRA <= px;
/** De varias redacciones (de la más completa a la más corta), la primera que cabe en `px`. */
export const elegir = (opciones, px) => [].concat(opciones).find((t) => cabe(t, px)) ?? [].concat(opciones).at(-1);

/** Rótulo que, si no cabe a la derecha de x, se ancla a la izquierda o contra el borde. */
export function rotuloDentro(k, x, y, txt, c = 'texto', ancho = ANCHO) {
  const w = [...txt].length * ANCHO_LETRA;
  if (x + w <= ancho - 4) return rotulo(k, x, y, txt, c);
  if (x - w >= 4) return rotulo(k, x, y, txt, c, 'end');
  return rotulo(k, ancho - 4, y, txt, c, 'end');
}

/** Línea de la «pizarra» de la escena (arriba a la izquierda): los resultados de cada paso quedan escritos.
 *  `txt` puede ser una lista de redacciones: se usa la más completa que cabe. */
export const nota = (k, fila, txt, c = 'texto') => rotulo(k, 24, 28 + fila * 22, elegir(txt, ANCHO - 48), c);

/** Cadena «x₁ = x₂ = … = xₙ», abreviada con «…» si no cabe en px. */
export function cadena(partes, px = ANCHO - 48) {
  const larga = partes.join(' = ');
  return cabe(larga, px) || partes.length <= 3 ? larga : `${partes[0]} = ${partes[1]} = … = ${partes.at(-1)}`;
}

/** Entero con signo menos tipográfico (−). */
export const num = (x) => (x < 0 ? `−${-x}` : `${x}`);

/** a·(x) con paréntesis si x es negativo. */
export const por = (a, x) => `${num(a)}·${x < 0 ? `(${num(x)})` : x}`;

/** «n saltos de s», aclarando el sentido cuando n es negativo. */
export const nSaltos = (n, s) => (n < 0 ? `${-n} saltos de ${num(s)} hacia la izquierda` : `${n} saltos de ${num(s)}`);

const DIG_SUB = '₀₁₂₃₄₅₆₇₈₉', DIG_SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹';
/** Índices tipográficos: sub(12) → '₁₂', sup(3) → '³'. */
export const sub = (n) => String(n).split('').map((c) => DIG_SUB[c] ?? c).join('');
export const sup = (n) => String(n).split('').map((c) => DIG_SUP[c] ?? c).join('');

/** Flecha recta de (x1, y1) a (x2, y2) con punta; `curva` > 0 la arquea hacia la izquierda del sentido de avance. */
export function flecha(k, x1, y1, x2, y2, c = 'texto', curva = 0) {
  const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy) || 1, ux = dx / L, uy = dy / L;
  const cx = (x1 + x2) / 2 - uy * curva, cy = (y1 + y2) / 2 + ux * curva;
  // la punta sigue la tangente final (de control a destino)
  const tx = x2 - cx, ty = y2 - cy, T = Math.hypot(tx, ty) || 1, vx = tx / T, vy = ty / T, P = 7;
  const p1 = [x2 - P * vx + P * 0.5 * vy, y2 - P * vy - P * 0.5 * vx], p2 = [x2 - P * vx - P * 0.5 * vy, y2 - P * vy + P * 0.5 * vx];
  const cuerpo = curva ? `M ${r1(x1)} ${r1(y1)} Q ${r1(cx)} ${r1(cy)} ${r1(x2)} ${r1(y2)}` : `M ${r1(x1)} ${r1(y1)} L ${r1(x2)} ${r1(y2)}`;
  return { k, t: 'path', a: { d: `${cuerpo} M ${r1(p1[0])} ${r1(p1[1])} L ${r1(x2)} ${r1(y2)} L ${r1(p2[0])} ${r1(p2[1])}` }, c };
}

/** Marcador triangular que apunta hacia abajo, con la punta en (x, y). */
export const marcador = (k, x, y, c = 'ambar') =>
  ({ k, t: 'path', a: { d: `M ${r1(x - 7)} ${r1(y - 12)} L ${r1(x + 7)} ${r1(y - 12)} L ${r1(x)} ${r1(y)} Z` }, c, relleno: true });

/**
 * Pizarra rodante para demostraciones largas: en el paso i se ven las notas i−filas+1 … i (la nueva abajo); las
 * anteriores suben y la más vieja se va. `notas`: lista de [texto | redacciones, color] (una por paso; null = nada).
 */
export function rodante(notas, i, { filas = 5, x = 24, y = 28, dy = 22, id = 'nr', ancho = ANCHO - 48 } = {}) {
  const hechas = notas.slice(0, i + 1).map((n, j) => [n, j]).filter(([n]) => n);
  const vivas = hechas.slice(-filas), fuera = hechas.slice(0, -filas);
  return [
    ...fuera.map(([, j]) => ({ k: `${id}${j}`, quitar: true })),
    ...vivas.map(([[txt, c], j], f) => rotulo(`${id}${j}`, x, y + f * dy, elegir(txt, ancho), j === i ? c : (c === 'verde' ? 'verde' : 'tenue'))),
  ];
}

/**
 * Inserta pasos «puente» (justificaciones añadidas) en una lista de capas. `puentes[i](ctx)` → [texto, color] crea una
 * capa nueva justo DESPUÉS de la capa original i, que escribe la justificación en la línea reservada `y`; la capa
 * siguiente la borra. El índice i es el de la lista ORIGINAL.
 */
export function conPuentes(capas, puentes, y) {
  const fila = (c) => (typeof y === 'function' ? y(c) : y);
  return capas.flatMap((capa, i) => [
    (c) => [{ k: 'puente', quitar: true }, ...capa(c)],
    ...(puentes[i] ? [(c) => { const [t, col = 'texto'] = puentes[i](c); return [rotulo('puente', 24, fila(c), elegir(t, ANCHO - 48), col)]; }] : []),
  ]);
}
