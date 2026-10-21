// Tests concretos de las escenas del Libro V.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { rodante } from '../escenas/comun.js';

const cargar = async (id) => (await import(`../escenas/5/${id}.js`)).default;
const hay = (ns, s, c) => ns.some((n) => n.t === 'text' && n.txt.includes(s) && (!c || n.c === c));

test('rodante: solo se ven las últimas notas y la actual va en su color', () => {
  const notas = [['a', 'texto'], ['b', 'ambar'], ['c', 'verde'], ['d', 'ambar']];
  const ns = rodante(notas, 3, { filas: 2 });
  assert.deepEqual(ns.filter((n) => n.t === 'text').map((n) => n.txt), ['c', 'd']);
  assert.ok(ns.some((n) => n.k === 'nr0' && n.quitar) && ns.some((n) => n.k === 'nr1' && n.quitar));
  assert.equal(ns.find((n) => n.txt === 'd').c, 'ambar');
});

test('def-src y teo-src-k: un número por cajón y flechas ×1', async () => {
  const src = await cargar('def-src');
  assert.ok(src.validar({ n: 5, as: [1, 6, 2, 3, 4] }), 'dos en la misma columna');
  assert.equal(src.estado({ n: 5, as: [10, 21, -3, 8, 4] }, 2).filter((n) => /^x\d$/.test(n.k)).length, 5);
  const k = (await cargar('teo-src-k')).estado({ n: 5, k: 3, as: [10, 21, -3, 8, 4] }, 7);
  assert.ok(!k.some((n) => n.supuesto), 'el mundo supuesto desaparece');
  assert.equal(k.filter((n) => /^F:n\d$/.test(n.k) && n.txt === '×1').length, 5);
});

test('teo-soluble: 6x ≡ 4 (10) tiene la órbita de los pares y x₀ = 4', async () => {
  const ns = (await cargar('teo-soluble')).estado({ a: 6, b: 4, n: 10 }, 7);
  assert.equal(ns.filter((n) => /^orb\d$/.test(n.k)).length, 5);
  assert.ok(hay(ns, 'x₀ = 4'));
  assert.ok((await cargar('teo-soluble')).validar({ a: 6, b: 3, n: 10 }));
});

test('teo-d-soluciones: 9x ≡ 6 (15) da 4, 9, 14', async () => {
  assert.ok(hay((await cargar('teo-d-soluciones')).estado({ a: 9, b: 6, n: 15 }, 2), '4, 9, 14', 'verde'));
});

test('teo-chino: la matriz de restos es la identidad y A = 233', async () => {
  const ns = (await cargar('teo-chino')).estado({ ns: [3, 5, 7], as: [2, 3, 2] }, 7);
  for (let j = 0; j < 3; j++) for (let i = 0; i < 3; i++) assert.equal(ns.find((n) => n.k === `r${j}-${i}`).txt, i === j ? '1' : '0');
  assert.equal(ns.find((n) => n.k === 'Av').txt, '233');
});
