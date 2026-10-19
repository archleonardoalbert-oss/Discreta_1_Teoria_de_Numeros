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

solo('cor-mcd-resto', 'con (40, 12) concluye mcd(40, 12) = mcd(12, 4) = 4', async () => {
  assert.ok(textoVerde(ultimo(await cargar('cor-mcd-resto'), { a: 40, b: 12 }, 5), 'mcd(12, 4) = 4'));
});

solo('def-diofantica', 'encuentra una solución o dice que no la hay', async () => {
  const esc = await cargar('def-diofantica');
  assert.ok(textoVerde(ultimo(esc, { a: 3, b: 5, c: 7 }, 4), '= 7'));
  assert.ok(textos(ultimo(esc, { a: 4, b: 6, c: 7 }, 4)).includes('no hay solución'));
});

solo('teo-diofantica-solucion', 'con (6, 10, 8) llega a c = 8 multiplicando por k = 4', async () => {
  const ns = ultimo(await cargar('teo-diofantica-solucion'), { a: 6, b: 10, c: 8 }, 6);
  assert.ok(textoVerde(ns, '= 8') && textos(ns).includes('k = 4'));
});

solo('teo-euclides', 'con 2 filas no falla en ningún paso y concluye el mcd', async () => {
  const esc = await cargar('teo-euclides');
  assert.ok(esc.validar({ a: 10, b: 20 }), 'debe exigir a > b');
  for (let i = 0; i < 7; i++) esc.estado({ a: 21, b: 6 }, i);
  assert.ok(textoVerde(ultimo(esc, { a: 21, b: 6 }, 7), '= 3'));
});

solo('ej-euclides-3088', 'reproduce las 7 filas y concluye 8', async () => {
  const ns = ultimo(await cargar('ej-euclides-3088'), { a: 3088, b: 456 }, 8);
  const t = textos(ns);
  for (const f of ['3088 = 6·456 + 352', '24 = 1·16 + 8', '16 = 2·8 + 0']) assert.ok(t.includes(f), f);
  assert.ok(textoVerde(ns, '= 8'));
});

solo('teo-coeficientes', 'con (150, 42) comprueba a·A_k + b·B_k = 6', async () => {
  assert.ok(textoVerde(ultimo(await cargar('teo-coeficientes'), { a: 150, b: 42 }, 5), '= 6'));
});

solo('ej-coeficientes-3088', 'rellena la tabla de la conferencia y aterriza en 8', async () => {
  const ns = ultimo(await cargar('ej-coeficientes-3088'), { a: 3088, b: 456 }, 7);
  const t = textos(ns);
  for (const f of ['B₂ = 1 − 1·(−1) = 2', 'B₆ = 17 − 6·(−22) = 149']) assert.ok(t.includes(f), f);
  assert.ok(ns.some((n) => n.k === 'fin:p'), 'falta el punto de llegada');
  assert.ok(textoVerde(ns, '8 = mcd(3088, 456) = 3088·(−22) + 456·149'));
});

solo('teo-solucion-general', 'con (6, 10, 8) muestra el intercambio b/d saltos de a = a/d saltos de b = 30', async () => {
  const esc = await cargar('teo-solucion-general');
  assert.ok(esc.validar({ a: 6, b: 10, c: 7 }), 'sin solución debe avisar');
  const ns = ultimo(esc, { a: 6, b: 10, c: 8 }, 9);
  assert.ok(textos(ns).includes('= 30'), textos(ns));
  assert.ok(textoVerde(ns, 'x = '));
});

solo('def-mcm', 'con (4, 6) termina en 12 y rechaza a = 0', async () => {
  const esc = await cargar('def-mcm');
  assert.ok(esc.validar({ a: 0, b: 6 }));
  assert.ok(textoVerde(ultimo(esc, { a: 4, b: 6 }, 4), '= 12'));
});

solo('teo-multiplos-comunes', 'con (4, 6) concluye m = k·ab/d con ab/d = 12', async () => {
  assert.ok(textoVerde(ultimo(await cargar('teo-multiplos-comunes'), { a: 4, b: 6 }, 5), '12'));
});

solo('cor-mcm-mcd', 'con (4, 6) rotula 12 × 2 = 24', async () => {
  const ns = ultimo(await cargar('cor-mcm-mcd'), { a: 4, b: 6 }, 4);
  assert.ok(textos(ns).includes('12 × 2 = 24'), textos(ns));
});

solo('cor-multiplo-mcm', 'con (4, 6) los múltiplos comunes son saltos de 12', async () => {
  assert.ok(textoVerde(ultimo(await cargar('cor-multiplo-mcm'), { a: 4, b: 6 }, 3), '12, 24, 36'));
});

solo('teo-menor-combinacion', 'los cuadrados de negativos van entre paréntesis', async () => {
  assert.ok(textos((await cargar('teo-menor-combinacion')).estado({ ns: [-5, 10] }, 1)).includes('(−5)²'));
});

solo('teo-coeficientes', 'cada paso cambia algo con los valores por defecto y no solapa textos cuando b | a', async () => {
  const esc = await cargar('teo-coeficientes');
  const def = { a: 150, b: 42 };
  for (let i = 1; i < 5; i++) assert.notDeepEqual(esc.estado(def, i), esc.estado(def, i - 1), `el paso ${i + 1} no cambia nada`);
  const ns = esc.estado({ a: 10, b: 5 }, 4).filter((n) => n.t === 'text');
  for (const x of ns) for (const y of ns) if (x !== y) assert.ok(Math.abs(x.a.y - y.a.y) >= 16 || Math.abs(x.a.x - y.a.x) > 200, `${x.k} y ${y.k} se solapan`);
});
