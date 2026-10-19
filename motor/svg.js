// Pinta un estado (Nodo[]) en un <svg>, reconciliando por clave con lo que ya hay:
// lo que sigue se mueve con transición CSS, lo nuevo entra con fundido y lo que sobra se desvanece.
import { marcarNuevos } from './nodos.js';

const NS = 'http://www.w3.org/2000/svg';
const COMO_CSS = new Set(['cx', 'cy', 'r', 'x', 'y', 'width', 'height', 'd']);   // geometría animable por CSS
const salientes = new WeakMap();   // elemento → temporizador de borrado

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
  el.setAttribute('class', [`c-${n.c || 'texto'}`, n.fijo ? 'fijo' : nuevo ? 'nuevo' : 'hecho', ...(n.hueco ? ['hueco'] : [])].join(' '));
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

  let anterior = null;
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
        el.classList.add('entra');
        el.getBoundingClientRect();
        requestAnimationFrame(() => el.classList.remove('entra'));
      }
    }
    anterior = el;
  }

  for (const [k, el] of vivos) {
    if (quedan.has(k) || el.classList.contains('sale')) continue;
    if (!ms) { el.remove(); continue; }
    el.classList.add('sale');
    salientes.set(el, setTimeout(() => el.remove(), ms));
  }
}
