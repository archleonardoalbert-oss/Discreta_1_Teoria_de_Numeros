// Progreso de un ejercicio (pistas abiertas, solución vista) guardado por parte.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { progreso } from '../motor/progreso.js';

const memoria = () => {
  const m = new Map();
  return { getItem: (k) => m.get(k) ?? null, setItem: (k, v) => m.set(k, String(v)), removeItem: (k) => m.delete(k) };
};

test('progreso: lo guardado se lee igual y es independiente por clave', () => {
  globalThis.localStorage = memoria();
  progreso('cp1-1:k').guardar({ pistas: 2, solucion: false, paso: 0 });
  assert.deepEqual(progreso('cp1-1:k').leer(), { pistas: 2, solucion: false, paso: 0 });
  assert.deepEqual(progreso('cp1-1:a').leer(), { pistas: 0, solucion: false, paso: 0 });
  progreso('cp1-1:k').borrar();
  assert.deepEqual(progreso('cp1-1:k').leer(), { pistas: 0, solucion: false, paso: 0 });
});

test('progreso: si el almacenamiento lanza, funciona en memoria sin romper', () => {
  globalThis.localStorage = { getItem() { throw new Error('bloqueado'); }, setItem() { throw new Error('bloqueado'); }, removeItem() { throw new Error('bloqueado'); } };
  const p = progreso('x');
  assert.deepEqual(p.leer(), { pistas: 0, solucion: false, paso: 0 });
  assert.doesNotThrow(() => p.guardar({ pistas: 1, solucion: true, paso: 2 }));
  assert.deepEqual(p.leer(), { pistas: 1, solucion: true, paso: 2 });
});

test('progreso: datos corruptos se ignoran', () => {
  globalThis.localStorage = memoria();
  localStorage.setItem('tn:practica:y', '{no es json');
  assert.deepEqual(progreso('y').leer(), { pistas: 0, solucion: false, paso: 0 });
});
