// Página de un ejercicio de la clase práctica: enunciado, planteamiento (si ayuda verlo) y, por cada parte,
// pistas que se piden una a una (la primera, siempre el concepto de la conferencia), la solución modelo
// revelada paso a paso y, al terminarla, «Qué te llevas».
import { crearEstudio, h, marca } from './estudio.js';
import { katex } from './elemento.js';
import { progreso } from './progreso.js';

export const TIPOS_PISTA = { concepto: 'concepto de la conferencia', estrategia: 'estrategia', arranque: 'arranque', desbloqueo: 'desbloqueo' };

const cargarEscena = async (base, ruta) => (await import(`../${base}escenas/${ruta}.js`)).default;

/** Una parte: pistas, solución y «Qué te llevas», con su progreso guardado. */
function montarParte({ ejercicio, parte, base, nombres }) {
  const memoria = progreso(`${ejercicio.id}:${parte.id}`);
  let estado = memoria.leer();
  const guardar = () => memoria.guardar(estado);
  const n = parte.pistas.length;

  const tarjetas = parte.pistas.map((p, i) => h('article', { className: `pista pista-${p.tipo}` },
    h('p', { className: 'rotulo mono', textContent: `pista ${i + 1} · ${TIPOS_PISTA[p.tipo]}` }),
    h('div', { innerHTML: p.texto }),
    p.enlaces?.length ? h('ul', { className: 'enlaces' }, ...p.enlaces.map(({ l, e }) => {
      const x = nombres.get(`${l}/${e}`);
      return h('li', {}, h('a', { href: x.href, innerHTML: x.nombre }), h('span', { className: 'mono donde', textContent: x.donde }));
    })) : null));
  const pedir = h('button', { type: 'button', className: 'pedir', dataset: { a: 'pista' } });
  const verSolucion = h('button', { type: 'button', className: 'ver-solucion', dataset: { a: 'solucion' }, textContent: 'Ver solución' });
  const reiniciar = h('button', { type: 'button', className: 'reiniciar mono', dataset: { a: 'reiniciar' }, textContent: 'empezar de cero', title: 'cierra las pistas y la solución de esta parte' });
  const aprendes = h('section', { className: 'aprendes', hidden: true },
    h('p', { className: 'rotulo mono', textContent: 'qué te llevas' }),
    h('p', { className: 'resultado', innerHTML: parte.aprendes.resultado }),
    h('ul', {}, ...parte.aprendes.ideas.map((c) => h('li', {}, h('b', { innerHTML: c.idea }), h('span', { innerHTML: c.texto })))));
  const solucion = h('div', { className: 'solucion', hidden: true },
    h('p', { className: 'rotulo mono', textContent: 'solución modelo, paso a paso' }));
  let solucionMontada = false;

  const terminar = (i, N) => { estado.paso = i; guardar(); if (i === N - 1) aprendes.hidden = false; };
  const montarSolucion = async () => {
    if (solucionMontada) return;
    solucionMontada = true;
    const { pasos, escena } = parte.solucion;
    if (escena) {
      const est = crearEstudio({ pasos, escena: await cargarEscena(base, escena), nombre: `solución de ${ejercicio.nombre}`, ocultarFuturos: true, teclado: false, pasoInicial: estado.paso, alPaso: terminar });
      solucion.append(est.raiz);
      katex(est.raiz);
      est.iniciar();
    } else {
      const lista = h('ol', { className: 'pasos pasos-solucion' }, ...pasos.map((p) => h('li', {}, h('span', { className: 'texto', innerHTML: p.texto }), marca(p.marca))));
      const siguiente = h('button', { type: 'button', dataset: { a: 'siguiente' }, textContent: 'siguiente paso ▶' });
      const todos = h('button', { type: 'button', dataset: { a: 'todos' }, textContent: 'mostrar todos' });
      const mostrar = (i) => {
        const N = pasos.length;
        [...lista.children].forEach((li, j) => { li.hidden = j > i; li.className = j === i ? 'actual' : 'hecho'; });
        siguiente.hidden = todos.hidden = i >= N - 1;
        terminar(i, N);
      };
      siguiente.addEventListener('click', () => mostrar(Math.min(estado.paso + 1, pasos.length - 1)));
      todos.addEventListener('click', () => mostrar(pasos.length - 1));
      solucion.append(lista, h('div', { className: 'controles' }, siguiente, todos));
      katex(lista);
      mostrar(Math.min(estado.paso, pasos.length - 1));
    }
  };

  const pintar = () => {
    tarjetas.forEach((t, i) => { t.hidden = i >= estado.pistas; });
    pedir.hidden = estado.pistas >= n;
    if (estado.pistas < n) pedir.textContent = `Pedir pista ${estado.pistas + 1} de ${n} · ${TIPOS_PISTA[parte.pistas[estado.pistas].tipo]}`;
    solucion.hidden = !estado.solucion;
    verSolucion.hidden = estado.solucion;
    if (estado.solucion) montarSolucion();
    else aprendes.hidden = true;
  };
  pedir.addEventListener('click', () => { estado.pistas = Math.min(n, estado.pistas + 1); guardar(); pintar(); tarjetas[estado.pistas - 1]?.scrollIntoView?.({ block: 'nearest' }); });
  verSolucion.addEventListener('click', () => { estado.solucion = true; estado.paso = 0; guardar(); pintar(); });
  reiniciar.addEventListener('click', () => {
    memoria.borrar(); estado = memoria.leer();
    solucion.replaceChildren(solucion.firstChild); solucionMontada = false;
    pintar();
  });

  const raiz = h('section', { className: 'parte', dataset: { p: parte.id } },
    parte.etiqueta || parte.enunciado ? h('header', { className: 'parte-cabecera' },
      parte.etiqueta ? h('span', { className: 'etiqueta mono', textContent: parte.etiqueta }) : null,
      parte.enunciado ? h('div', { innerHTML: parte.enunciado }) : null) : null,
    h('div', { className: 'pistas' }, ...tarjetas),
    h('div', { className: 'acciones' }, pedir, verSolucion, reiniciar),
    solucion, aprendes);
  return { raiz, iniciar: pintar };
}

/** Monta la página. `nombres`: Map 'l/e' → {nombre, href, donde}; `anterior`/`siguiente`: {href, nombre} o null. */
export async function montarEjercicio(raiz, { libro, practica, ejercicio, base, nombres, anterior, siguiente, hrefLibro }) {
  const plan = ejercicio.planteamiento;
  const estudioPlan = plan?.escena
    ? crearEstudio({ pasos: plan.pasos, escena: await cargarEscena(base, plan.escena), nombre: `planteamiento de ${ejercicio.nombre}`, teclado: false })
    : null;
  const partes = ejercicio.partes.map((parte) => montarParte({ ejercicio, parte, base, nombres }));

  raiz.replaceChildren(
    h('nav', { className: 'migas mono' },
      h('a', { href: 'index.html', textContent: 'Biblioteca' }), ' / ',
      h('a', { href: hrefLibro, textContent: `Libro ${libro.romano}` }), ' / ',
      h('a', { href: `${hrefLibro}#practica`, textContent: `Clase práctica ${practica.numero}` })),
    h('header', { className: 'cabecera' },
      h('span', { className: 'tipo tipo-CP', textContent: `CP ${practica.numero} · ejercicio ${ejercicio.numero}` }),
      h('h1', { innerHTML: ejercicio.nombre })),
    h('section', { className: 'enunciado' }, h('div', { innerHTML: ejercicio.enunciado }), marca(ejercicio.marcaEnunciado)),
    ejercicio.nota ? h('section', { className: 'nota' }, h('p', { className: 'rotulo mono', textContent: 'aclaración del enunciado' }), h('div', { innerHTML: ejercicio.nota })) : null,
    plan ? h('section', { className: 'planteamiento' },
      h('p', { className: 'rotulo mono', textContent: 'planteamiento · qué se pide, sin resolverlo' }),
      h('div', { className: 'plan-texto', innerHTML: plan.texto }),
      estudioPlan?.raiz) : null,
    ...partes.map((p) => p.raiz),
    h('nav', { className: 'vecinos' },
      anterior ? h('a', { href: anterior.href, className: 'ant', innerHTML: `← ${anterior.nombre}` }) : h('span'),
      siguiente ? h('a', { href: siguiente.href, className: 'sig', innerHTML: `${siguiente.nombre} →` }) : h('span')));

  katex(raiz);
  estudioPlan?.iniciar();
  partes.forEach((p) => p.iniciar());
}

/** Nombres y enlaces de los elementos citados por las pistas, leídos de cada libro. */
export async function nombresCitados(ejercicios, base) {
  const pares = ejercicios.flatMap((x) => x.partes.flatMap((p) => p.pistas.flatMap((q) => q.enlaces ?? [])));
  const libros = new Map();
  for (const l of new Set(pares.map((p) => p.l))) libros.set(l, (await import(`../${base}libros/${l}/contenido.js`)).default);
  const nombres = new Map();
  for (const { l, e } of pares) {
    const libro = libros.get(l), el = libro.elementos.find((x) => x.id === e);
    if (!el) throw new Error(`la pista cita «${e}», que no existe en el libro ${l}`);
    nombres.set(`${l}/${e}`, { nombre: el.nombre, href: `elemento.html?${base ? `base=${base}&` : ''}l=${l}&e=${e}`, donde: `Libro ${libro.romano}` });
  }
  return nombres;
}

/** Arranque de ejercicio.html: lee ?l=&x=(&base=) y monta. */
export async function arrancarEjercicio() {
  const q = new URLSearchParams(location.search);
  const base = q.get('base') || '';
  const raiz = document.getElementById('raiz');
  try {
    const l = q.get('l');
    const libro = (await import(`../${base}libros/${l}/contenido.js`)).default;
    const practica = (await import(`../${base}libros/${l}/practica.js`)).default;
    const i = practica.ejercicios.findIndex((x) => x.id === q.get('x'));
    if (i < 0) throw new Error(`no existe el ejercicio «${q.get('x')}» en la clase práctica ${l}`);
    const ejercicio = practica.ejercicios[i];
    const pre = base ? `base=${base}&` : '';
    const enlace = (x) => x && { href: `ejercicio.html?${pre}l=${l}&x=${x.id}`, nombre: `${x.numero}. ${x.nombre}` };
    document.title = `CP ${practica.numero} · ejercicio ${ejercicio.numero}`;
    await montarEjercicio(raiz, {
      libro, practica, ejercicio, base, nombres: await nombresCitados([ejercicio], base),
      anterior: enlace(practica.ejercicios[i - 1]), siguiente: enlace(practica.ejercicios[i + 1]),
      hrefLibro: `libro.html?${pre}l=${l}`,
    });
  } catch (err) {
    raiz.replaceChildren(h('p', { className: 'aviso', textContent: `No se pudo abrir el ejercicio: ${err.message}` }));
    throw err;
  }
}
