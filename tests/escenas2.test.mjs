// Tests concretos de las escenas del Libro II.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';

const cargar = async (id) => (await import(`../escenas/2/${id}.js`)).default;
const ultimo = (esc, e, n) => esc.estado(e, n - 1);
const textoVerde = (ns, s) => ns.some((n) => n.t === 'text' && n.c === 'verde' && n.txt.includes(s));
const solo = (id, nombre, fn) => test(`${id}: ${nombre}`, { skip: !process.env.TODAS && !existsSync(new URL(`../escenas/2/${id}.js`, import.meta.url)) }, fn);

solo('def-mcd', 'con (12, 18) termina con el mcd 6 en verde', async () => {
  assert.ok(textoVerde(ultimo(await cargar('def-mcd'), { a: 12, b: 18 }, 4), '6'));
});

solo('def-combinacion-lineal', 'con a₁ = 3088 y b₁ = −22 los saltos van a la izquierda de 0', async () => {
  const esc = await cargar('def-combinacion-lineal');
  const ns = esc.estado({ a1: 3088, b1: -22, a2: 456, b2: 149 }, 1);
  const x0 = ns.find((n) => n.k === 'eje:n0')?.a.x ?? ns.find((n) => n.k === 'cero:p').a.cx;
  const finales = ns.filter((n) => n.k.startsWith('c1:a')).map((n) => Number(n.a.d.trim().split(/\s+/).at(-2)));
  assert.ok(finales.length && finales.every((x) => x < x0));
});

solo('prop-signos', 'con (−12, 18) termina con mcd 6 en verde', async () => {
  assert.ok(textoVerde(ultimo(await cargar('prop-signos'), { a: -12, b: 18 }, 4), '6'));
});

solo('teo-divide-mcd', 'rechaza a ∤ b y con (6, 18) concluye 6', async () => {
  const esc = await cargar('teo-divide-mcd');
  assert.ok(esc.validar({ a: 5, b: 18 }));
  assert.ok(textoVerde(ultimo(esc, { a: 6, b: 18 }, 3), '6'));
});

solo('def-primos-relativos', 'distingue primos relativos de los que no lo son', async () => {
  const esc = await cargar('def-primos-relativos');
  assert.ok(textoVerde(ultimo(esc, { a: 8, b: 15 }, 4), 'primos relativos'));
  assert.ok(!textoVerde(ultimo(esc, { a: 8, b: 12 }, 4), 'son primos relativos'));
});

const textos = (ns) => ns.filter((n) => n.t === 'text').map((n) => n.txt).join(' | ');

solo('teo-menor-combinacion', 'con [12, 18, 30] el último paso concluye s = d = 6', async () => {
  assert.ok(textoVerde(ultimo(await cargar('teo-menor-combinacion'), { ns: [12, 18, 30] }, 12), 's = d = 6'));
});

solo('teo-divisores-comunes', 'con (12, 18) lista los divisores de 6', async () => {
  assert.ok(textoVerde(ultimo(await cargar('teo-divisores-comunes'), { a: 12, b: 18 }, 4), '1, 2, 3, 6'));
});

solo('cor-mcd-n', 'con [12, 18, 30] muestra mcd(12, mcd(18, 30)) = 6', async () => {
  assert.ok(textoVerde(ultimo(await cargar('cor-mcd-n'), { ns: [12, 18, 30] }, 4), '= 6'));
});

solo('cor-cocientes-coprimos', 'con (3088, 456) rotula 386 y 57', async () => {
  const t = textos(ultimo(await cargar('cor-cocientes-coprimos'), { a: 3088, b: 456 }, 4));
  assert.ok(t.includes('386') && t.includes('57'), t);
});

solo('teo-divide-producto', 'valida las hipótesis y concluye a | bₙ', async () => {
  const esc = await cargar('teo-divide-producto');
  assert.ok(esc.validar({ a: 4, bs: [2, 5, 8] }), 'mcd(4, 2) ≠ 1 debería rechazarse');
  assert.ok(esc.validar({ a: 7, bs: [3, 5, 8] }), '7 no divide a 120');
  assert.ok(textoVerde(ultimo(esc, { a: 4, bs: [3, 5, 8] }, 5), '4 | 8'));
});
