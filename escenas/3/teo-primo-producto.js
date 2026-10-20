// p | a₁⋯aₙ ⇒ p | aⱼ. Arriba la plantilla con letras (base y paso k → k+1, no dominós); abajo el mismo
// razonamiento con números: cada caja lleva escrito si p la divide.
import { escenaPorCapas, rotulo, ANCHO } from '../comun.js';
import { cajas } from '../piezas/cajas.js';
import { validarPrimo } from './lema-p-no-divide.js';

const X = 24, YT = 84, YE = 232;

export default escenaPorCapas({
  entradas: [
    { id: 'p', etiqueta: 'p', valor: 5, min: 2, max: 31 },
    { id: 'as', etiqueta: 'a₁…aₙ', valor: [6, 7, 10, 3], min: 1, max: 99, lista: { min: 2, max: 4 } },
  ],
  validar: ({ p, as }) => validarPrimo(p) ?? (as.every((v) => v % p !== 0) ? `${p} ∤ ${as.join('·')}: el teorema no aplica (prueba con un factor múltiplo de ${p})` : null),
  preparar: ({ p, as }) => ({ marcas: as.map((v) => (v % p === 0 ? '|' : '∤')), producto: as.reduce((s, v) => s * v, 1) }),
  alto: YE + 60,
  base: ({ p, as, producto }) => [
    rotulo('Et', X, YE - 50, `ejemplo: p = ${p},  ${as.join('·')} = ${producto}`, 'texto'),
    ...cajas('E', { x: X, y: YE, valores: as }),
  ],
  capas: [
    () => [rotulo('Tt', X, YT - 52, 'plantilla (con letras)', 'tenue'), ...cajas('T', { x: X, y: YT, valores: ['a₁'], marcas: ['|'] })],
    () => [
      ...cajas('T', { x: X, y: YT, valores: ['a₁', 'a₂'], marcas: ['∤', '|'] }),
      rotulo('Tn', X, YT + 56, 'si p ∤ a₁, el Lema de Euclides da p | a₂', 'texto'),
    ],
    ({ p, as, marcas }) => [
      ...cajas('T', { x: X, y: YT, valores: ['a₁', '⋯', 'aₖ', 'aₖ₊₁'], marcas: [null, null, null, '|'] }),
      { k: 'T:m0', quitar: true },
      rotulo('Tn', X, YT + 56, 'caso fácil: p | aₖ₊₁', 'texto'),
      ...cajas('E', { x: X, y: YE, valores: as, p, marcas: as.map((_, i) => (i === as.length - 1 ? marcas[i] : null)) }),
    ],
    () => [
      ...cajas('T', { x: X, y: YT, valores: ['a₁ ⋯ aₖ', 'aₖ₊₁'], marcas: ['|', '∤'], grupo: { desde: 0, hasta: 0, texto: 'A' } }),
      { k: 'T:b2', quitar: true }, { k: 'T:v2', quitar: true }, { k: 'T:x1', quitar: true }, { k: 'T:b3', quitar: true }, { k: 'T:v3', quitar: true }, { k: 'T:m3', quitar: true }, { k: 'T:x2', quitar: true },
      rotulo('Tn', X, YT + 56, 'si p ∤ aₖ₊₁: Lema de Euclides con A y aₖ₊₁ ⇒ p | A', 'texto'),
    ],
    ({ p, as, marcas }) => {
      const j = marcas.indexOf('|');
      return [
        rotulo('Tn', X, YT + 56, 'y por la hipótesis (k factores) p divide a algún aⱼ', 'texto'),
        ...cajas('E', { x: X, y: YE, valores: as, p, marcas }),
        rotulo('res', ANCHO / 2, YE + 52, `${p} | a${'₁₂₃₄'[j]} = ${as[j]}`, 'verde', 'middle'),
      ];
    },
  ],
});
