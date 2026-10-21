// Escenas de la Clase práctica 5.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import huevos from '../escenas/cp5/huevos.js';

test('cp5 huevos: grupos de 2 a 6 con un huevo suelto en ámbar y grupos de 7 sin sobrante', () => {
  const nodos = huevos.estado({}, 3);
  for (const m of [2, 3, 4, 5, 6]) assert.equal(nodos.filter((n) => n.k.startsWith(`g${m}:suelto`) && n.t === 'circle').length, 1, `m = ${m}`);
  assert.equal(nodos.filter((n) => n.k.startsWith('g7:suelto')).length, 0);
  assert.equal(huevos.capas, 4);
});
