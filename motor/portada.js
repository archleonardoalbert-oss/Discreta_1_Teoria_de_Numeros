// Portada «Biblioteca»: una fila de libros de frente, uno por conferencia.
import { catalogo } from '../libros/catalogo.js';

const portada = (l) => `
  <${l.disponible ? `a href="libro.html?l=${l.numero}"` : 'div aria-disabled="true"'} class="portada c-${l.color}${l.disponible ? '' : ' cerrada'}">
    <span class="numero mono">LIBRO ${l.romano}</span>
    <span class="titulo">${l.titulo}</span>
    ${l.disponible ? '' : '<span class="pronto mono">en preparación</span>'}
    <svg viewBox="0 0 120 50" aria-hidden="true">${l.ilustracion}</svg>
  </${l.disponible ? 'a' : 'div'}>`;

export function montarPortada(raiz) {
  raiz.innerHTML = `
    <header class="portada-cabecera">
      <p class="mono antetitulo">Matemática Discreta I</p>
      <h1>Biblioteca de Teoría de Números</h1>
      <p class="subtitulo">Cada libro es una conferencia. Ábrelo y recorre cada definición, lema y teorema con su animación.</p>
    </header>
    <section class="estante" aria-label="Libros">
      ${catalogo.map(portada).join('')}
      <div class="hueco" aria-hidden="true"><span class="mono">próximos libros</span></div>
    </section>`;
}
