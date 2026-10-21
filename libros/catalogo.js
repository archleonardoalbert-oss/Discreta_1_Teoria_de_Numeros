// Los libros de la biblioteca: uno por conferencia. `practica: true` si el libro tiene su clase práctica (libros/N/practica.js).
// `ilustracion`: SVG pequeño con la idea central del libro (viewBox 0 0 120 50).
export const catalogo = [
  {
    numero: 1, romano: 'I', titulo: 'Principios · Divisibilidad', color: 'cian', disponible: true, practica: true,
    ilustracion: '<line x1="2" y1="40" x2="118" y2="40" class="i-eje"/><path d="M5 40Q20 12 35 40M35 40Q50 12 65 40M65 40Q80 12 95 40" class="i-cian"/><circle cx="95" cy="40" r="4" class="i-ciruela-r"/>',
  },
  {
    numero: 2, romano: 'II', titulo: 'mcd · Diofánticas · mcm', color: 'ciruela', disponible: true, practica: true,
    ilustracion: '<line x1="2" y1="22" x2="118" y2="22" class="i-eje"/><g class="i-ciruela-r"><circle cx="10" cy="22" r="3"/><circle cx="40" cy="22" r="3"/><circle cx="70" cy="22" r="3"/><circle cx="100" cy="22" r="3"/></g><rect x="5" y="32" width="75" height="5" class="i-cian-r"/><rect x="5" y="41" width="105" height="5" class="i-ambar-r"/>',
  },
  {
    numero: 3, romano: 'III', titulo: 'Primos · Teorema Fundamental', color: 'ambar', disponible: true, practica: true,
    ilustracion: '<g class="i-ambar-r"><rect x="5" y="10" width="14" height="14"/><rect x="21" y="10" width="14" height="14"/><rect x="37" y="10" width="22" height="14"/></g><rect x="5" y="28" width="54" height="14" class="i-eje-r"/><text x="66" y="38" class="i-texto">=2·2·3</text>',
  },
  {
    numero: 4, romano: 'IV', titulo: 'Congruencia', color: 'verde', disponible: true, practica: true,
    ilustracion: '<circle cx="60" cy="25" r="20" class="i-verde"/><g class="i-verde-r"><circle cx="60" cy="5" r="3"/><circle cx="79" cy="31" r="3"/><circle cx="41" cy="31" r="3"/></g>',
  },
  {
    numero: 5, romano: 'V', titulo: 'Sistemas residuales · TCR', color: 'violeta', disponible: true, practica: true,
    ilustracion: '<circle cx="35" cy="25" r="14" class="i-violeta"/><circle cx="60" cy="25" r="14" class="i-cian"/><circle cx="85" cy="25" r="14" class="i-ciruela"/>',
  },
];
