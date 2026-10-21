// Página de un elemento (definición, lema, teorema…): enunciado, explicación y, en dos columnas,
// la demostración paso a paso (izquierda) y la escena animada con sus entradas (derecha).
import { MACROS, TRUST } from './macros.js';
import { crearEstudio, h, marca, LEYENDA } from './estudio.js';
import { cargarPracticas, ejerciciosQueCitan } from './practicas.js';

export const TIPOS = { DEF: 'Definición', LEMA: 'Lema', TEO: 'Teorema', COR: 'Corolario', PROP: 'Propiedad', EJ: 'Ejemplo', MET: 'Método', PRIN: 'Principio' };
export { LEYENDA };
export const katex = (raiz) => window.renderMathInElement?.(raiz, {
  delimiters: [{ left: '$$', right: '$$', display: true }, { left: '$', right: '$', display: false }],
  throwOnError: false,
  ignoredClasses: ['sin-tex'],   // texto con «$» que no es una fórmula (precios)
  macros: { ...MACROS },
  trust: TRUST,
  strict: (codigo) => (codigo === 'htmlExtension' ? 'ignore' : 'warn'),   // \htmlClass es intencionado (colores)
});

/** Rótulo de la columna de pasos: deja claro si los pasos son de la conferencia o añadidos. */
export function rotuloPasos(el) {
  if (el.pasosAñadidos === 'idea') return 'la idea, paso a paso · añadida';
  if (el.pasosAñadidos === 'demostracion') return 'demostración paso a paso · añadida, no está en la conferencia';
  return el.tipo === 'EJ' ? 'ejemplo de la conferencia, paso a paso' : 'demostración de la conferencia, paso a paso';
}

/** Monta la página. `anterior`/`siguiente`: {href, nombre} o null. */
export function montarElemento(raiz, { libro, elemento, escena, anterior, siguiente, hrefLibro, practicaEn = [] }) {
  const estudio = crearEstudio({
    pasos: elemento.pasos, escena, nombre: elemento.nombre,
    rotulo: rotuloPasos(elemento), rotuloAñadido: !!elemento.pasosAñadidos,
  });

  // los huecos opcionales llegan como null: replaceChildren los pintaría como el texto «null»
  raiz.replaceChildren(...[
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
    estudio.raiz,
    ...(elemento.claves?.length ? [h('section', { className: 'claves' },
      h('p', { className: 'rotulo mono', textContent: 'para tus demostraciones · ideas que te llevas' }),
      h('ul', {}, ...elemento.claves.map((c) => h('li', {}, h('b', { innerHTML: c.idea }), h('span', { innerHTML: c.texto })))))] : []),
    practicaEn.length ? h('section', { className: 'practica-en' },
      h('p', { className: 'rotulo mono', textContent: 'se practica en' }),
      h('ul', {}, ...practicaEn.map((x) => h('li', {}, h('a', { href: x.href, textContent: x.texto }), ' ', h('span', { innerHTML: x.nombre }))))) : null,
    h('nav', { className: 'vecinos' },
      anterior ? h('a', { href: anterior.href, className: 'ant', textContent: `← ${anterior.nombre}` }) : h('span'),
      siguiente ? h('a', { href: siguiente.href, className: 'sig', textContent: `${siguiente.nombre} →` }) : h('span'))].filter((x) => x != null));

  katex(raiz);
  estudio.iniciar();
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
    document.title = `${elemento.nombre.replace(/\$/g, '')} · Libro ${libro.romano}`;
    montarElemento(raiz, {
      libro, elemento, escena,
      anterior: enlace(libro.elementos[i - 1]), siguiente: enlace(libro.elementos[i + 1]),
      hrefLibro: `libro.html?${base ? `base=${base}&` : ''}l=${libro.numero}`,
      practicaEn: ejerciciosQueCitan(await cargarPracticas(base, libro.numero), libro.numero, elemento.id, base),
    });
  } catch (err) {
    raiz.replaceChildren(h('p', { className: 'aviso', textContent: `No se pudo abrir la página: ${err.message}` }));
    throw err;
  }
}
