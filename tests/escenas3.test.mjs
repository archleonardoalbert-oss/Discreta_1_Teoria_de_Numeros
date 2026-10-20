// Tests concretos de las escenas del Libro III.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { cajas } from '../escenas/piezas/cajas.js';

const cargar = async (id) => (await import(`../escenas/3/${id}.js`)).default;
const ultimo = (esc, e, n) => esc.estado(e, n - 1);
const textos = (ns) => ns.filter((n) => n.t === 'text').map((n) => n.txt).join(' | ');
const textoVerde = (ns, s) => ns.some((n) => n.t === 'text' && n.c === 'verde' && n.txt.includes(s));
const solo = (id, nombre, fn) => test(`${id}: ${nombre}`, { skip: !process.env.TODAS && !existsSync(new URL(`../escenas/3/${id}.js`, import.meta.url)) }, fn);

test('cajas: una caja por factor, con su valor y su etiqueta de divisibilidad', () => {
  const ns = cajas('B', { x: 20, y: 40, valores: [6, 7, 10], marcas: ['∤', '∤', '|'], p: 5 });
  assert.deepEqual(ns.filter((n) => /^B:v\d$/.test(n.k)).map((n) => n.txt), ['6', '7', '10']);
  assert.equal(ns.find((n) => n.k === 'B:m2').txt, '5 | 10');
  assert.equal(ns.find((n) => n.k === 'B:m2').c, 'verde');
  assert.equal(ns.find((n) => n.k === 'B:m0').txt, '5 ∤ 6');
});

solo('lema-p-no-divide', 'D(7) = {1, 7}, D(12) y la intersección {1}', async () => {
  const esc = await cargar('lema-p-no-divide');
  assert.ok(esc.validar({ p: 6, a: 12 }), 'p debe ser primo');
  assert.ok(esc.validar({ p: 3, a: 12 }), 'el lema pide p ∤ a');
  assert.ok(textoVerde(ultimo(esc, { p: 7, a: 12 }, 3), '(7, 12) = 1'));
});

solo('lema-euclides', 'con p = 3, a = 4, b = 6 termina en b = 3·(8 + (−6))', async () => {
  const esc = await cargar('lema-euclides');
  assert.ok(esc.validar({ p: 3, a: 6, b: 4 }), 'p | a debe rechazarse');
  const ns = ultimo(esc, { p: 3, a: 4, b: 6 }, 6);
  assert.ok(textoVerde(ns, '3 | 6'), textos(ns));
  assert.equal(ns.filter((n) => /^R:c\d+-\d+$/.test(n.k)).length, 24, 'el rectángulo a × b');
});

solo('teo-primo-producto', 'plantilla con letras y ejemplo con números: 5 divide al tercer factor', async () => {
  const esc = await cargar('teo-primo-producto');
  const ns = ultimo(esc, { p: 5, as: [6, 7, 10, 3] }, 5);
  assert.ok(ns.some((n) => n.txt === 'a₁ ⋯ aₖ'), 'falta el bloque A de la plantilla');
  assert.equal(ns.find((n) => n.k === 'E:m2').c, 'verde');
  assert.ok(esc.validar({ p: 5, as: [6, 7] }), 'si p no divide al producto, avisa');
});

solo('cor-primos', 'p = q_k', async () => {
  const esc = await cargar('cor-primos');
  assert.ok(textoVerde(ultimo(esc, { p: 5, qs: [3, 5, 7] }, 3), '5 = q₂'));
  assert.ok(esc.validar({ p: 5, qs: [3, 6, 7] }), 'los q deben ser primos');
});

solo('cor-potencia', 'cada copia de a aporta un p: 1728 = 2³·6³', async () => {
  const ns = ultimo(await cargar('cor-potencia'), { a: 12, k: 3, p: 2 }, 4);
  assert.ok(textos(ns).includes('1728 = 2³ · 6³'), textos(ns));
});
