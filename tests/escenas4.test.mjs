// Tests concretos de las escenas del Libro IV.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { geoTabla, filasFlechas, geoFilas, mod } from '../escenas/piezas/modular.js';

const cargar = async (id) => (await import(`../escenas/4/${id}.js`)).default;
const hay = (ns, s, c) => ns.some((n) => n.t === 'text' && n.txt.includes(s) && (!c || n.c === c));

test('modular: la tabla pone a los congruentes en la misma columna y los negativos arriba', () => {
  const g = geoTabla(5, -8, 17);
  assert.equal(g.pos(17).x, g.pos(-8).x);
  assert.ok(g.pos(-8).y < g.pos(0).y && g.pos(0).y < g.pos(17).y);
  assert.equal(mod(-8, 5), 2);
});

test('modular: x ↦ 4x (mod 10) pliega 2 a 1 y x ↦ 3x (mod 10) es biyectiva', () => {
  const g = geoFilas(10);
  assert.deepEqual(filasFlechas('F', g, (x) => 4 * x).llegadas, [2, 0, 2, 0, 2, 0, 2, 0, 2, 0]);
  assert.ok(filasFlechas('F', g, (x) => 3 * x).llegadas.every((k) => k === 1));
});

test('def-congruencia: las cuentas vuelan de la recta a la tabla y a, b comparten columna', async () => {
  const esc = await cargar('def-congruencia'), e = { n: 5, a: 17, b: -8 };
  const antes = esc.estado(e, 0).find((n) => n.k === 'd17'), despues = esc.estado(e, 1).find((n) => n.k === 'd17');
  assert.notEqual(antes.a.cy, despues.a.cy, 'la cuenta 17 cambia de sitio');
  assert.ok(hay(esc.estado(e, 2), '17 ≡ −8 (mod 5)', 'verde'));
  assert.ok(hay(esc.estado({ n: 5, a: 17, b: -7 }, 2), 'no son congruentes', 'ambar'));
});

test('teo-congruencia-divide: a − b = (k − q)n con los valores', async () => {
  const ns = (await cargar('teo-congruencia-divide')).estado({ n: 5, a: 17, b: -8 }, 5);
  assert.ok(hay(ns, '5 | 25', 'verde'));
});

test('prop-6: la escuadra ac − bd es múltiplo de n', async () => {
  const ns = (await cargar('prop-6')).estado({ n: 3, a: 7, b: 4, c: 8, d: 2 }, 4);
  assert.equal(ns.filter((n) => /^c\d+-\d+$/.test(n.k)).length, 56);
  assert.ok(hay(ns, '48 = 3·16', 'verde'));
});

test('teo-cancelacion: con c = 4, n = 10 la fibra de 2 es {3, 8} y n/d = 5', async () => {
  const ns = (await cargar('teo-cancelacion')).estado({ c: 4, n: 10, a: 3, b: 8 }, 6);
  assert.ok(hay(ns, '3, 8 van todos a 2', 'verde'));
});

test('fuerte-1: el mcm de 4 y 6 es 12 y 29 ≡ 5 (mod 12)', async () => {
  const ns = (await cargar('fuerte-1')).estado({ m: 4, n: 6, a: 29, b: 5 }, 6);
  assert.ok(hay(ns, '29 ≡ 5 (mod 12)', 'verde'));
  assert.equal(ns.filter((n) => /^bc2-\d$/.test(n.k)).length, 3, 'a − b = 24 = 2³·3');
});

test('fuerte-3: la tira (a − b)·d queda en verde', async () => {
  const ns = (await cargar('fuerte-3')).estado({ n: 5, a: 7, b: 2, c: 8, d: 3 }, 7);
  assert.ok(hay(ns, '(a − b)·d = 15', 'verde'));
  assert.ok(hay(ns, '7 ≡ 2 (mod 5)', 'verde'));
});

test('def-solucion y teo-fermat: soluciones de x² − 2 (mod 7) y permutación de 3·i (mod 7)', async () => {
  assert.ok(hay((await cargar('def-solucion')).estado({ n: 7, cs: [-2, 0, 1] }, 2), 'x ≡ 3, 4 (mod 7)', 'verde'));
  const f = (await cargar('teo-fermat')).estado({ p: 7, a: 3 }, 8);
  assert.ok(hay(f, '729 = 7·104 + 1', 'verde'));
  assert.equal(f.filter((n) => /^F:n\d+$/.test(n.k)).length, 6, 'seis casillas con ×1');
});
