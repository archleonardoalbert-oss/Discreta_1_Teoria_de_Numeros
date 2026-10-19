// Página de un elemento (definición, lema, teorema…): enunciado, explicación y, en dos columnas,
// la demostración paso a paso (izquierda) y la escena animada con sus entradas (derecha).
import { pintar } from './svg.js';
import { crearEntradas } from './entradas.js';

export const TIPOS = { DEF: 'Definición', LEMA: 'Lema', TEO: 'Teorema', COR: 'Corolario', PROP: 'Propiedades', EJ: 'Ejemplo' };
const MARCAS = { corregido: 'corregido', añadido: 'añadido · no está en la conferencia' };

const h = (tag, props = {}, ...hijos) => {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(props)) {
    if (k === 'dataset') Object.assign(el.dataset, v);
    else if (k in el && k !== 'list') el[k] = v;
    else el.setAttribute(k, v);
  }
  el.append(...hijos.filter((x) => x != null));
  return el;
};
const marca = (m) => (m ? h('span', { className: `marca marca-${m}`, textContent: MARCAS[m] }) : null);
const valoresIniciales = (escena) => Object.fromEntries(escena.entradas.map((e) => [e.id, Array.isArray(e.valor) ? [...e.valor] : e.valor]));

export const katex = (raiz) => window.renderMathInElement?.(raiz, {
  delimiters: [{ left: '$$', right: '$$', display: true }, { left: '$', right: '$', display: false }],
  throwOnError: false,
});

/** Monta la página. `anterior`/`siguiente`: {href, nombre} o null. */
export function montarElemento(raiz, { libro, elemento, escena, anterior, siguiente, hrefLibro }) {
  const N = elemento.pasos.length;
  let e = valoresIniciales(escena), paso = 0, previo = null;

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('role', 'img');
  const lista = h('ol', { className: 'pasos' }, ...elemento.pasos.map((p, i) =>
    h('li', { dataset: { i } }, h('span', { className: 'texto', innerHTML: p.texto }), marca(p.marca))));
  const cuenta = h('span', { className: 'cuenta mono' });
  const aviso = h('p', { className: 'aviso', role: 'status', hidden: true });
  const caja = h('div', { className: 'entradas' });
  const boton = (a, txt, titulo) => h('button', { type: 'button', textContent: txt, title: titulo, dataset: { a } });

  raiz.replaceChildren(
    h('nav', { className: 'migas mono' },
      h('a', { href: 'index.html', textContent: 'Biblioteca' }), ' / ',
      h('a', { href: hrefLibro, textContent: `Libro ${libro.romano}` })),
    h('header', { className: 'cabecera' },
      h('span', { className: `tipo tipo-${elemento.tipo}`, textContent: TIPOS[elemento.tipo] }),
      h('h1', { textContent: elemento.nombre })),
    h('section', { className: 'enunciado' }, h('div', { innerHTML: elemento.enunciado }), marca(elemento.marcaEnunciado)),
    h('section', { className: 'explicacion' },
      h('p', { className: 'rotulo mono', textContent: 'explicación (no es de la conferencia)' }),
      h('div', { innerHTML: elemento.explicacion })),
    h('div', { className: 'estudio' },
      h('section', { className: 'columna-pasos' }, h('p', { className: 'rotulo mono', textContent: N > 1 ? 'demostración paso a paso' : 'idea' }), lista),
      h('section', { className: 'columna-escena' },
        h('div', { className: 'escena' }, svg),
        h('div', { className: 'controles' },
          boton('inicio', '⏮', 'al primer paso'), boton('atras', '◀', 'paso anterior (←)'),
          cuenta, boton('adelante', '▶', 'paso siguiente (→)')),
        caja, aviso)),
    h('nav', { className: 'vecinos' },
      anterior ? h('a', { href: anterior.href, className: 'ant', textContent: `← ${anterior.nombre}` }) : h('span'),
      siguiente ? h('a', { href: siguiente.href, className: 'sig', textContent: `${siguiente.nombre} →` }) : h('span')));

  katex(raiz);

  const dibujar = (animar) => {
    const { ancho, alto } = escena.vista(e);
    svg.setAttribute('viewBox', `0 0 ${ancho} ${alto}`);
    svg.setAttribute('aria-label', `${elemento.nombre}, paso ${paso + 1} de ${N}`);
    const actual = escena.estado(e, paso);
    pintar(svg, previo, actual, { animar });
    previo = actual;
    cuenta.textContent = `${paso + 1}/${N}`;
    [...lista.children].forEach((li, i) => { li.className = i < paso ? 'hecho' : i === paso ? 'actual' : 'futuro'; });
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
  lista.addEventListener('click', (ev) => { const li = ev.target.closest('li'); if (li) ir(Number(li.dataset.i)); });
  document.addEventListener('keydown', (ev) => {
    if (ev.target.closest?.('input, textarea') || ev.altKey || ev.ctrlKey || ev.metaKey) return;
    if (ev.key === 'ArrowRight') { ev.preventDefault(); ir(paso + 1); }
    else if (ev.key === 'ArrowLeft') { ev.preventDefault(); ir(paso - 1); }
  });

  dibujar(false);
}

/** Arranque de elemento.html: lee ?l=&e=(&base=) y monta. */
export async function arrancar() {
  const q = new URLSearchParams(location.search);
  const base = q.get('base') || '';
  const raiz = document.getElementById('raiz');
  try {
    const libro = (await import(`../${base}libros/${q.get('l')}/contenido.js`)).default;
    const i = libro.elementos.findIndex((x) => x.id === q.get('e'));
    if (i < 0) throw new Error(`no existe el elemento «${q.get('e')}» en el libro ${q.get('l')}`);
    const elemento = libro.elementos[i];
    const escena = (await import(`../${base}escenas/${elemento.escena}.js`)).default;
    const enlace = (x) => x && { href: `elemento.html?${base ? `base=${base}&` : ''}l=${libro.numero}&e=${x.id}`, nombre: x.nombre };
    document.title = `${elemento.nombre} · Libro ${libro.romano}`;
    montarElemento(raiz, {
      libro, elemento, escena,
      anterior: enlace(libro.elementos[i - 1]), siguiente: enlace(libro.elementos[i + 1]),
      hrefLibro: `libro.html?${base ? `base=${base}&` : ''}l=${libro.numero}`,
    });
  } catch (err) {
    raiz.replaceChildren(h('p', { className: 'aviso', textContent: `No se pudo abrir la página: ${err.message}` }));
    throw err;
  }
}
