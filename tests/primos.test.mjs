import { test } from 'node:test';
import assert from 'node:assert/strict';
import { esPrimo, factorizar, canonica, inversoMod, factorialBig, restoPotencia } from '../motor/primos.js';

test('esPrimo', () => {
  assert.deepEqual([1, 2, 3, 4, 25, 29, 91, 97].map(esPrimo), [false, true, true, false, false, true, false, true]);
});

test('factorizar devuelve el multiconjunto ordenado de primos', () => {
  assert.deepEqual(factorizar(360), [2, 2, 2, 3, 3, 5]);
  assert.deepEqual(factorizar(97), [97]);
});

test('canonica agrupa en primo^exponente', () => {
  assert.deepEqual(canonica(360), [[2, 3], [3, 2], [5, 1]]);
});

test('inversoMod', () => {
  assert.equal(inversoMod(3, 7), 5);
  assert.equal(inversoMod(6, 7), 6);
  assert.equal(inversoMod(2, 4), null);
});

test('factorialBig y restoPotencia sin perder precisión', () => {
  assert.equal(factorialBig(20), 2432902008176640000n);
  assert.equal(restoPotencia(12, 12, 13), 1);
  assert.equal(restoPotencia(3, 6, 7), 1);
});
