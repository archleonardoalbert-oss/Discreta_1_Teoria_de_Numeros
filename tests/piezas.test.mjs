import { test } from 'node:test';
import assert from 'node:assert/strict';
import { euclides } from '../motor/aritmetica.js';
import { rectanguloEuclides } from '../escenas/piezas/rectanguloEuclides.js';

const cuadrados = (ns, i) => ns.filter((n) => n.t === 'rect' && n.k.startsWith(`E${i}:s`));

test('45 × 16: bloques de 2, 1, 4 y 3 cuadrados; el último lado es el mcd', () => {
  const filas = euclides(45, 16).filas;
  const ns = rectanguloEuclides('E', filas, { x: 0, y: 0, ancho: 450, alto: 160 });
  assert.deepEqual([0, 1, 2, 3].map((i) => cuadrados(ns, i).length), [2, 1, 4, 3]);
  const ultimo = cuadrados(ns, 3)[0];
  assert.ok(Math.abs(ultimo.a.width - (450 / 45) * 1) < 1.5, 'el último cuadrado debería medir 1 (= mcd)');
});

test('cocientes enormes se dibujan como un solo bloque', () => {
  const ns = rectanguloEuclides('E', euclides(4999, 2).filas, { x: 0, y: 0, ancho: 600, alto: 200 });
  assert.ok(ns.filter((n) => n.t === 'rect').length <= 30);
});

test('hasta: solo las filas pedidas', () => {
  const ns = rectanguloEuclides('E', euclides(45, 16).filas, { x: 0, y: 0, ancho: 450, alto: 160, hasta: 2 });
  assert.equal(cuadrados(ns, 2).length, 0);
  assert.equal(cuadrados(ns, 1).length, 1);
});
