// Macros de KaTeX comunes a toda la biblioteca.
// Las de color (\cResto{…}, …) pintan un símbolo con el mismo color que su pieza en el dibujo.
export const MACROS = {
  '\\mcd': '\\operatorname{mcd}',
  '\\mcm': '\\operatorname{mcm}',
  '\\Z': '\\mathbb{Z}',
  '\\N': '\\mathbb{N}',
  '\\cResto': '\\htmlClass{k-ambar}{#1}',
  '\\cSalto': '\\htmlClass{k-cian}{#1}',
  '\\cDado': '\\htmlClass{k-ciruela}{#1}',
  '\\cAux': '\\htmlClass{k-violeta}{#1}',
  '\\cRes': '\\htmlClass{k-verde}{#1}',
};

/** Solo se confía en \htmlClass (para los colores); nada de enlaces ni HTML arbitrario. */
export const TRUST = (ctx) => ctx.command === '\\htmlClass';
