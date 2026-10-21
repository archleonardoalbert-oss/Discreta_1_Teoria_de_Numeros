// Índice de un libro: sus elementos en el orden de la conferencia.
import { TIPOS, katex } from './elemento.js';
import { cargarPracticas } from './practicas.js';

export async function arrancarLibro() {
  const q = new URLSearchParams(location.search);
  const base = q.get('base') || '';
  const raiz = document.getElementById('raiz');
  const libro = (await import(`../${base}libros/${q.get('l')}/contenido.js`)).default;
  document.title = `Libro ${libro.romano} · ${libro.titulo}`;
  const pre = base ? `base=${base}&` : '';
  raiz.innerHTML = `
    <nav class="migas mono"><a href="index.html">Biblioteca</a></nav>
    <header class="libro-cabecera c-${libro.color}">
      <span class="numero mono">LIBRO ${libro.romano}${libro.conferencia ? ` · ${libro.conferencia}` : ''}</span>
      <h1>${libro.titulo}</h1>
    </header>
    <ol class="indice-libro">
      ${libro.elementos.map((x) => `
        <li><a href="elemento.html?${pre}l=${libro.numero}&e=${x.id}">
          <span class="tipo tipo-${x.tipo}">${TIPOS[x.tipo]}</span><span class="nombre">${x.nombre}</span></a></li>`).join('')}
    </ol>`;
  // la clase práctica del libro, si la hay
  const cp = (await cargarPracticas(base, libro.numero)).find((x) => x.l === libro.numero)?.practica;
  if (cp) raiz.insertAdjacentHTML('beforeend', `
    <section id="practica" class="practica-indice">
      <h2>Clase práctica ${cp.numero} <span class="mono">· ${cp.fecha}</span></h2>
      <p class="subtitulo">Para resolver tú: pistas a petición (la primera, siempre el concepto de la conferencia) y la solución cuando la quieras.</p>
      <ol class="indice-libro">
        ${cp.ejercicios.map((x) => `
          <li><a href="ejercicio.html?${pre}l=${libro.numero}&x=${x.id}">
            <span class="tipo tipo-CP">ejercicio ${x.numero}</span><span class="nombre">${x.nombre}</span></a></li>`).join('')}
      </ol>
    </section>`);
  katex(raiz);
}
