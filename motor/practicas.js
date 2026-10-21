// Dónde hay clases prácticas: en la biblioteca real, los libros del catálogo marcados con `practica: true`;
// en las páginas de prueba (`base`), el libro que se está viendo.
import { catalogo } from '../libros/catalogo.js';

export async function cargarPracticas(base, l) {
  const numeros = base ? [Number(l)] : catalogo.filter((x) => x.disponible && x.practica).map((x) => x.numero);
  const res = [];
  for (const n of numeros) {
    try { res.push({ l: n, practica: (await import(`../${base}libros/${n}/practica.js`)).default }); }
    catch { /* libro sin clase práctica */ }
  }
  return res;
}

/** Ejercicios cuya pista-concepto cita el elemento `e` del libro `l`: [{href, texto}]. */
export function ejerciciosQueCitan(practicas, l, e, base) {
  const pre = base ? `base=${base}&` : '';
  return practicas.flatMap(({ l: lp, practica }) => practica.ejercicios
    .filter((x) => x.partes.some((p) => p.pistas[0]?.enlaces?.some((q) => String(q.l) === String(l) && q.e === e)))
    .map((x) => ({ href: `ejercicio.html?${pre}l=${lp}&x=${x.id}`, texto: `CP ${practica.numero} · ejercicio ${x.numero}`, nombre: x.nombre })));
}
