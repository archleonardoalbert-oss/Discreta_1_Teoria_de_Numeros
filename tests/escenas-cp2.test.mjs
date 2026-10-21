// Escenas de la Clase práctica 2.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import plan from '../escenas/cp2/recta-diofantica.js';
import sol, { solucionesVisibles } from '../escenas/cp2/recta-diofantica-solucion.js';
import multiplos from '../escenas/cp2/multiplos.js';

test('cp2 recta: valida (a, b) = 1, coeficientes no nulos y que haya soluciones a la vista', () => {
  assert.equal(plan.validar({ a: 2, b: 3, c: 6 }), null);
  assert.ok(plan.validar({ a: 2, b: 4, c: 6 }));
  assert.ok(plan.validar({ a: 0, b: 1, c: 6 }));
});

test('cp2 recta: las soluciones dibujadas cumplen ax + by = c y son consecutivas', () => {
  for (const [a, b, c] of [[2, 3, 6], [3, -2, 1], [1, 1, 4], [-3, 5, 7]]) {
    const s = solucionesVisibles({ a, b, c });
    assert.ok(s.length >= 3, `${a},${b},${c}`);
    for (const { x, y } of s) assert.equal(a * x + b * y, c);
    for (let i = 1; i < s.length; i++) assert.deepEqual([s[i].x - s[i - 1].x, s[i].y - s[i - 1].y], [b, -a]);
  }
  assert.equal(sol.capas, 6);
});

test('cp2 múltiplos: marca a, 2a, …, ba y los múltiplos de b; coinciden (a, b) veces', () => {
  const nodos = multiplos.estado({ a: 6, b: 8 }, 1);
  assert.equal(nodos.filter((n) => n.k.startsWith('ka:') && n.t === 'circle').length, 8);
  assert.equal(nodos.filter((n) => n.k.startsWith('mb:') && n.t === 'line').length, 6);
});
