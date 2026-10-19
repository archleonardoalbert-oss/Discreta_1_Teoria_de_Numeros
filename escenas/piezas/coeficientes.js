// Pieza reutilizable: tabla de coeficientes Aᵢ, Bᵢ (Euclides al revés) junto a las filas de Euclides.
import { rotulo, num } from '../comun.js';
import { textoFila } from './euclides.js';

const sub = (i) => String(i).split('').map((c) => '₀₁₂₃₄₅₆₇₈₉'[c]).join('');
const par = (x) => (x < 0 ? `(${num(x)})` : `${x}`);

/** Texto de la fila i (1…k) de la tabla, como en la conferencia. */
export function textoCoeficiente(pasos, i, k) {
  const p = pasos[i - 1];
  if (i === 1) return `A₁ = 1   B₁ = −q${sub(k)} = ${num(p.B)}`;
  const ant = pasos[i - 2];
  return `A${sub(i)} = ${num(p.A)}   B${sub(i)} = ${num(ant.A)} − ${p.q}·${par(ant.B)} = ${num(p.B)}`;
}

/** Filas de Euclides a la izquierda y tabla Aᵢ, Bᵢ (filas 1…hasta) a la derecha, en la misma fila visual. */
export function tablaCoeficientes(id, filas, pasos, { y0, dy = 26, hasta, xTabla = 300, usada = -1 }) {
  const k = pasos.length;
  const ns = filas.map((f, j) => rotulo(`${id}e${j}`, 24, y0 + j * dy, textoFila(f), j === usada ? 'ambar' : 'tenue'));
  for (let i = 1; i <= Math.min(hasta, k); i++)
    ns.push({ ...rotulo(`${id}c${i}`, xTabla, y0 + (i - 1) * dy, textoCoeficiente(pasos, i, k), i === hasta ? 'ambar' : 'texto'),
      ...(i === hasta - 1 ? { ref: true } : {}) });     // la fila anterior se usa en este paso: se reilumina
  return ns;
}
