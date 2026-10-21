// Pinta un estado (Nodo[]) en un <svg>, reconciliando por clave con lo que ya hay:
// lo que sigue se mueve con transición CSS, lo nuevo entra con fundido y lo que sobra se desvanece.
// Cinemática (estilo 3Blue1Brown): lo nuevo entra escalonado; si trae `desde: 'clave'`, nace en la posición
// de esa pieza y viaja a la suya (como TransformFromCopy); lo reiluminado (`ref`) late una vez.
import { marcarNuevos } from './nodos.js';

const NS = 'http://www.w3.org/2000/svg';
const COMO_CSS = new Set(['cx', 'cy', 'r', 'x', 'y', 'width', 'height', 'd']);   // geometría animable por CSS
const salientes = new WeakMap();   // elemento → temporizador de borrado
const ESCALON = 28, ESCALON_MAX = 650, GRUPO = 130;   // ms entre piezas nuevas, retraso máximo y entre grupos de `orden`

const duracion = (svg) => {
  const v = getComputedStyle(svg).getPropertyValue('--t-paso').trim();
  return v.endsWith('ms') ? parseFloat(v) : parseFloat(v || '0') * 1000;
};

function aplicar(el, n) {
  for (const [k, v] of Object.entries(n.a)) {
    if (COMO_CSS.has(k) && n.t !== 'text') el.style.setProperty(k, k === 'd' ? `path("${v}")` : `${v}px`);
    else el.setAttribute(k, v);
  }
  if (n.t === 'text' && el.textContent !== n.txt) el.textContent = n.txt;
  el.style.strokeWidth = n.ancho ? `${n.ancho}px` : '';
}

function clases(el, n, nuevo) {
  el.setAttribute('class', [`c-${n.c || 'texto'}`, n.fijo ? 'fijo' : nuevo ? 'nuevo' : n.ref ? 'ref' : 'hecho', ...(n.hueco ? ['hueco'] : []), ...(n.supuesto ? ['supuesto'] : []), ...(n.relleno ? ['relleno'] : [])].join(' '));
}

// Primer hermano tras `nodo` (o el primero del svg) que no se esté desvaneciendo.
function siguienteVivo(nodo, svg) {
  let s = nodo ? nodo.nextSibling : svg.firstChild;
  while (s && s.classList?.contains('sale')) s = s.nextSibling;
  return s;
}

/**
 * Pinta `actual` sobre `svg`; `previo` es el estado pintado antes (o null).
 * `referencia`: estado contra el que se decide qué es «nuevo» (por defecto, `previo`).
 */
export function pintar(svg, previo, actual, { animar = true, referencia = previo } = {}) {
  svg.classList.toggle('sin-anim', !animar);
  const nuevos = marcarNuevos(referencia, actual);
  const vivos = new Map([...svg.querySelectorAll(':scope > [data-k]')].map((el) => [el.dataset.k, el]));
  const quedan = new Set(actual.map((n) => n.k));
  const ms = animar ? duracion(svg) : 0;

  let anterior = null, entrantes = 0;
  const viajes = [];
  for (const n of actual) {
    let el = vivos.get(n.k);
    if (el && el.tagName !== n.t) { el.remove(); el = null; }
    if (el) {
      clearTimeout(salientes.get(el)); salientes.delete(el);
      el.classList.remove('sale');
    } else {
      el = document.createElementNS(NS, n.t);
      el.dataset.k = n.k;
      if (n.t === 'path' || n.t === 'line') el.setAttribute('pathLength', '1');
    }
    aplicar(el, n);
    clases(el, n, nuevos.has(n.k));
    const enSitio = siguienteVivo(anterior, svg) === el;
    if (!enSitio) {
      const recien = !el.isConnected;
      svg.insertBefore(el, anterior ? anterior.nextSibling : svg.firstChild);
      if (recien && ms) {                  // entrada: parte invisible / sin trazar y transiciona al estado final
        // `orden` agrupa por significado (p. ej. un nivel del árbol); si no, entran una tras otra
        const retraso = n.orden !== undefined ? Math.min(n.orden * GRUPO, 2000) : Math.min(entrantes++ * ESCALON, ESCALON_MAX);
        el.style.transitionDelay = `${retraso}ms`;
        setTimeout(() => { el.style.transitionDelay = ''; }, ms + retraso + 50);
        el.classList.add('entra');
        if (n.desde) viajes.push([el, n.desde]);
      }
    }
    anterior = el;
  }

  // Las piezas que nacen de otra: se colocan (sin transición) sobre su origen, encogidas, y luego viajan.
  for (const [el, desde] of viajes) {
    const origen = svg.querySelector(`:scope > [data-k="${CSS.escape(desde)}"]`);
    if (!origen) continue;
    const a = el.getBBox(), o = origen.getBBox();
    const dx = o.x + o.width / 2 - (a.x + a.width / 2), dy = o.y + o.height / 2 - (a.y + a.height / 2);
    el.style.transitionProperty = 'none';   // (no el atajo `transition`: borraría el retraso escalonado)
    el.style.transform = `translate(${dx}px, ${dy}px) scale(.35)`;
  }
  const recien = svg.querySelectorAll(':scope > .entra');
  if (recien.length) {
    svg.getBoundingClientRect();
    requestAnimationFrame(() => requestAnimationFrame(() => recien.forEach((el) => {
      el.style.transitionProperty = '';
      el.style.transform = '';
      el.classList.remove('entra');
    })));
  }

  for (const [k, el] of vivos) {
    if (quedan.has(k) || el.classList.contains('sale')) continue;
    if (!ms) { el.remove(); continue; }
    el.classList.add('sale');
    salientes.set(el, setTimeout(() => el.remove(), ms));
  }
}
