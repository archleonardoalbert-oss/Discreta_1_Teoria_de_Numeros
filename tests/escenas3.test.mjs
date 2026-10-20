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

solo('teo-fundamental', 'dos árboles distintos de 180, sus hojas bajan a dos filas ordenadas y se emparejan', async () => {
  const esc = await cargar('teo-fundamental'), e = { n: 180 };
  const p5 = esc.estado(e, 4);
  assert.equal(p5.filter((n) => /^A:a/.test(n.k)).length, 5, 'el árbol A tiene 5 hojas');
  assert.ok(esc.estado(e, 5).some((n) => n.k === 'B:nr0' && n.txt === '12'), 'el árbol B parte 180 = 12·15');
  const p9 = esc.estado(e, 8);
  assert.deepEqual(p9.filter((n) => /^P:v\d$/.test(n.k)).map((n) => n.txt), ['2', '2', '3', '3', '5']);
  assert.ok(p9.find((n) => n.k === 'P:v0').desde, 'las hojas bajan volando desde el árbol');
  const fin = esc.estado(e, 10);
  assert.equal(fin.filter((n) => /^par\d$/.test(n.k) && n.c === 'verde').length, 5);
});

solo('def-canonica', 'las hojas de 360 se apilan en columnas 2³, 3², 5¹ y se escribe la forma canónica', async () => {
  const esc = await cargar('def-canonica');
  const p2 = esc.estado({ a: 360 }, 1);
  const bloques = p2.filter((n) => /^X:b/.test(n.k) && n.t === 'rect');
  assert.equal(bloques.length, 6);
  assert.ok(bloques.every((n) => n.desde), 'cada bloque nace de una hoja');
  assert.ok(textoVerde(esc.estado({ a: 360 }, 2), '360 = 2³ · 3² · 5'));
});

solo('cor-canonica', 'dos árboles distintos dan las mismas columnas', async () => {
  const ns = ultimo(await cargar('cor-canonica'), { n: 180 }, 3);
  const cuenta = (pre) => ns.filter((n) => n.k.startsWith(pre) && n.t === 'rect').length;
  assert.equal(cuenta('XA:b'), 5); assert.equal(cuenta('XB:b'), 5);
  assert.ok(textoVerde(ns, '180 = 2² · 3² · 5'));
});
