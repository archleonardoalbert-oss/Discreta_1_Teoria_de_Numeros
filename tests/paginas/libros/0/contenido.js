// Libro de prueba para los tests de navegador.
export default {
  numero: 0, romano: '0', titulo: 'Libro de prueba', color: 'cian', conferencia: 'prueba',
  elementos: [
    {
      id: 'division', tipo: 'TEO', nombre: 'Algoritmo de la División (prueba)',
      enunciado: 'Sean $a, b \\in \\mathbb{Z}$, $b \\gt 0$; existen $q, r$ únicos con $a = bq + r$, $0 \\le r \\lt b$.',
      explicacion: 'Saltando de $b$ en $b$ desde 0, $q$ es el número de saltos y $r$ lo que falta para llegar a $a$.',
      pasos: [
        { texto: 'Se marca $a$ en la recta.' },
        { texto: 'Se dan $q$ saltos de longitud $b$ sin pasarse de $a$.', marca: 'añadido' },
        { texto: 'Lo que falta es el resto $r$.', marca: 'corregido' },
      ],
      escena: '0/division',
    },
  ],
};
