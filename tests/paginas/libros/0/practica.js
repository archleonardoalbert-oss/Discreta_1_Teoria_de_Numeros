// Clase práctica de prueba para los tests de navegador.
export default {
  numero: 0, fecha: '1 de enero de 2025',
  ejercicios: [
    {
      id: 'cp0-1', numero: 1, nombre: 'Ejercicio de prueba con dos partes',
      enunciado: 'Demuestre que $a = bq + r$ con $0 \\le r \\lt b$.',
      nota: 'Una aclaración del enunciado.',
      planteamiento: { texto: 'Lo que se pide, en la recta.', pasos: [{ texto: 'P1' }, { texto: 'P2' }, { texto: 'P3' }], escena: '0/division' },
      partes: [
        {
          id: 'a', etiqueta: '(a)', enunciado: 'Primera parte.',
          pistas: [
            { tipo: 'concepto', texto: 'Se aplica el algoritmo de la división.', enlaces: [{ l: 0, e: 'division' }] },
            { tipo: 'estrategia', texto: 'Estrategia A.' },
            { tipo: 'arranque', texto: 'Arranque A.' },
          ],
          solucion: { pasos: [{ texto: 'Sa1 $q$' }, { texto: 'Sa2' }, { texto: 'Sa3' }] },
          aprendes: { resultado: 'Resultado A.', ideas: [{ idea: 'Idea A1', texto: 'T' }, { idea: 'Idea A2', texto: 'T' }] },
        },
        {
          id: 'b', etiqueta: '(b)', enunciado: 'Segunda parte.',
          pistas: [
            { tipo: 'concepto', texto: 'Otra vez la división.', enlaces: [{ l: 0, e: 'division' }] },
            { tipo: 'estrategia', texto: 'Estrategia B.' },
            { tipo: 'arranque', texto: 'Arranque B.' },
            { tipo: 'desbloqueo', texto: 'Desbloqueo B.' },
          ],
          solucion: { pasos: [{ texto: 'Sb1' }, { texto: 'Sb2' }, { texto: 'Sb3' }], escena: '0/division' },
          aprendes: { resultado: 'Resultado B.', ideas: [{ idea: 'Idea B1', texto: 'T' }, { idea: 'Idea B2', texto: 'T' }] },
        },
      ],
    },
    {
      id: 'cp0-2', numero: 2, nombre: 'Segundo ejercicio',
      enunciado: 'Calcule $2 + 2$.',
      partes: [{
        id: 'x',
        pistas: [{ tipo: 'concepto', texto: 'Suma.', enlaces: [{ l: 0, e: 'division' }] }, { tipo: 'estrategia', texto: 'E.' }, { tipo: 'arranque', texto: 'A.' }],
        solucion: { pasos: [{ texto: '1' }, { texto: '2' }, { texto: '4' }] },
        aprendes: { resultado: 'Es $4$.', ideas: [{ idea: 'I', texto: 'T' }, { idea: 'J', texto: 'T' }] },
      }],
    },
  ],
};
