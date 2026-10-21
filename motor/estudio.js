// El bloque «pasos | escena»: a la izquierda la lista de pasos, a la derecha la escena SVG con su leyenda,
// los controles ◀ ▶, la vista de tira y las entradas editables. Lo usan los elementos de los libros y,
// en las clases prácticas, los planteamientos y las soluciones con dibujo.
import { pintar } from './svg.js';
import { crearEntradas } from './entradas.js';
import { moverCamara } from './camara.js';

// Significado fijo de cada color en todas las escenas (una escena puede precisarlo con `leyenda`).
export const LEYENDA = { cian: 'saltos / divisor', ciruela: 'número dado', ambar: 'resto · paso actual', violeta: 'auxiliar (conjuntos, reglas)', verde: 'resultado' };
const MARCAS = { corregido: 'corregido', añadido: 'añadido · no está en la conferencia' };

export const h = (tag, props = {}, ...hijos) => {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(props)) {
    if (k === 'dataset') Object.assign(el.dataset, v);
    else if (k in el && k !== 'list') el[k] = v;
    else el.setAttribute(k, v);
  }
  el.append(...hijos.filter((x) => x != null));
  return el;
};
export const marca = (m) => (m ? h('span', { className: `marca marca-${m}`, textContent: MARCAS[m] }) : null);
const valoresIniciales = (escena) => Object.fromEntries(escena.entradas.map((e) => [e.id, Array.isArray(e.valor) ? [...e.valor] : e.valor]));

/**
 * Crea el bloque y lo devuelve como elemento DOM (aún sin dibujar) junto con `iniciar()` para dibujarlo
 * una vez insertado y renderizado KaTeX.
 * `ocultarFuturos`: los pasos posteriores al actual no se ven (soluciones: intentar adivinar el siguiente).
 * `teclado`: ← → mueven el paso (solo un bloque por página debe tenerlo).
 * `alPaso(i, N)`: aviso tras cada cambio de paso.
 */
export function crearEstudio({ pasos, escena, nombre, rotulo, rotuloAñadido = false, ocultarFuturos = false, teclado = true, alPaso, pasoInicial = 0 }) {
  const N = pasos.length;
  let e = valoresIniciales(escena), paso = Math.max(0, Math.min(N - 1, pasoInicial)), previo = null;

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('role', 'img');
  const lista = h('ol', { className: `pasos${ocultarFuturos ? ' ocultar-futuros' : ''}` }, ...pasos.map((p, i) =>
    h('li', { dataset: { i } }, h('span', { className: 'texto', innerHTML: p.texto }), marca(p.marca))));
  const cuenta = h('span', { className: 'cuenta mono' });
  const aviso = h('p', { className: 'aviso', role: 'status', hidden: true });
  const caja = h('div', { className: 'entradas' });
  const tira = h('div', { className: 'tira', hidden: true, role: 'dialog', 'aria-label': 'todos los pasos' });
  const leyenda = h('ul', { className: 'leyenda mono', 'aria-label': 'leyenda de colores' });
  const boton = (a, txt, titulo) => h('button', { type: 'button', textContent: txt, title: titulo, dataset: { a } });

  const raiz = h('div', { className: 'estudio' },
    h('section', { className: 'columna-pasos' }, rotulo ? h('p', { className: `rotulo mono${rotuloAñadido ? ' rotulo-añadido' : ''}`, textContent: rotulo }) : null, lista),
    h('section', { className: 'columna-escena' },
      h('div', { className: 'escena' }, svg),
      leyenda,
      h('div', { className: 'controles' },
        boton('inicio', '⏮', 'al primer paso'), boton('atras', '◀', 'paso anterior (←)'),
        cuenta, boton('adelante', '▶', 'paso siguiente (→)'), boton('tira', '▦ tira', 'ver todos los pasos')),
      tira, caja, aviso));

  const dibujar = (animar) => {
    const { ancho, alto } = escena.vista(e);
    // la escena puede acercar la cámara a una zona en un paso (zoom); si no, se ve entera
    const ms = animar && !matchMedia('(prefers-reduced-motion: reduce)').matches ? 750 : 0;
    moverCamara(svg, escena.camara?.(e, paso) ?? [0, 0, ancho, alto], ms);
    svg.setAttribute('aria-label', `${nombre}, paso ${paso + 1} de ${N}`);
    const actual = escena.estado(e, paso);
    // lo «nuevo» es lo que introduce este paso respecto al anterior, venga de donde venga el usuario
    const referencia = paso > 0 ? escena.estado(e, paso - 1) : null;
    pintar(svg, previo, actual, { animar, referencia });
    previo = actual;
    const colores = Object.keys(LEYENDA).filter((c) => actual.some((n) => n.c === c));
    leyenda.replaceChildren(...colores.map((c) =>
      h('li', { dataset: { color: c } }, h('i', { className: `muestra c-${c}` }), (escena.leyenda?.[c]) ?? LEYENDA[c])));
    cuenta.textContent = `${paso + 1}/${N}`;
    [...lista.children].forEach((li, i) => { li.className = i < paso ? 'hecho' : i === paso ? 'actual' : 'futuro'; });
    alPaso?.(paso, N);
  };
  const ir = (i) => {
    const nuevo = Math.max(0, Math.min(N - 1, i));
    if (nuevo === paso && previo) return;
    paso = nuevo;
    dibujar(true);
  };

  crearEntradas(caja, escena.entradas, ({ valores, error }) => {
    const motivo = error ?? escena.validar(valores);
    aviso.hidden = !motivo;
    aviso.textContent = motivo || '';
    if (motivo) return;
    e = valores;
    dibujar(true);
  });

  raiz.querySelector('[data-a=inicio]').addEventListener('click', () => ir(0));
  raiz.querySelector('[data-a=atras]').addEventListener('click', () => ir(paso - 1));
  raiz.querySelector('[data-a=adelante]').addEventListener('click', () => ir(paso + 1));
  // con los futuros ocultos solo se puede volver a un paso ya visto
  lista.addEventListener('click', (ev) => { const li = ev.target.closest('li'); if (li && (!ocultarFuturos || Number(li.dataset.i) <= paso)) ir(Number(li.dataset.i)); });
  // Vista de tira: una miniatura estática por paso; pulsar una lleva a ese paso.
  const abrirTira = () => {
    const { ancho, alto } = escena.vista(e);
    const hasta = ocultarFuturos ? paso + 1 : N;
    tira.replaceChildren(...pasos.slice(0, hasta).map((_, i) => {
      const mini = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      mini.setAttribute('viewBox', `0 0 ${ancho} ${alto}`);
      pintar(mini, null, escena.estado(e, i), { animar: false, referencia: i > 0 ? escena.estado(e, i - 1) : null });
      const b = h('button', { type: 'button', className: `miniatura${i === paso ? ' actual' : ''}`, title: `paso ${i + 1}` },
        h('span', { className: 'mono', textContent: String(i + 1) }), h('div', { className: 'escena' }, mini));
      b.addEventListener('click', () => { tira.hidden = true; ir(i); });
      return b;
    }));
    tira.hidden = false;
  };
  raiz.querySelector('[data-a=tira]').addEventListener('click', () => (tira.hidden ? abrirTira() : (tira.hidden = true)));
  document.addEventListener('keydown', (ev) => { if (ev.key === 'Escape') tira.hidden = true; });
  if (teclado) document.addEventListener('keydown', (ev) => {
    if (ev.target.closest?.('input, textarea') || ev.altKey || ev.ctrlKey || ev.metaKey) return;
    if (ev.key === 'ArrowRight') { ev.preventDefault(); ir(paso + 1); }
    else if (ev.key === 'ArrowLeft') { ev.preventDefault(); ir(paso - 1); }
  });

  return { raiz, iniciar: () => dibujar(false), ir, paso: () => paso };
}
