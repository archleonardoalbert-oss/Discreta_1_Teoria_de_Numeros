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

solo('lema-6q', 'tabla de 6 columnas: se tachan 0, 2, 4 y 3; los primos > 3 solo en 1 y 5; el recíproco falla con 25 y 35', async () => {
  const esc = await cargar('lema-6q'), e = { N: 60 };
  const p3 = esc.estado(e, 2);
  for (const r of [0, 2, 3, 4]) assert.ok(p3.some((n) => n.k === `tacha${r}` ), `columna ${r} sin tachar`);
  const primos = esc.estado(e, 4).filter((n) => /^aro\d+$/.test(n.k)).map((n) => Number(n.k.slice(3)) % 6);
  assert.ok(primos.length && primos.every((r) => r === 1 || r === 5));
  const fin = ultimo(esc, e, 6);
  assert.ok(fin.some((n) => n.k === 'falso25') && fin.some((n) => n.k === 'falso35'));
});

solo('lema-compuestos', 'con n = 5: 722…726, cada uno con su divisor k que sale del factorial', async () => {
  const ns = ultimo(await cargar('lema-compuestos'), { n: 5 }, 3);
  assert.ok(textos(ns).includes('720 + 2 = 722'));
  const k3 = ns.find((n) => n.k === 'div3');
  assert.ok(k3 && k3.desde === 'F:v2' && k3.txt.includes('3 |'), 'el 3 sale de su caja en 1·2·3·4·5·6');
});

solo('teo-wilson', 'p = 13: cuerdas entre inversos, 1 y 12 solos, y 13 | 12! + 1', async () => {
  const esc = await cargar('teo-wilson'), e = { p: 13 };
  assert.ok(esc.validar({ p: 12 }), 'p debe ser primo');
  const cuerdas = esc.estado(e, 1).filter((n) => /^cuerda/.test(n.k));
  assert.equal(cuerdas.length, 5, '(13 − 3)/2 = 5 parejas');
  assert.ok(textoVerde(esc.estado(e, 4), '13 | 479001601'));
  assert.ok(textos(ultimo(esc, e, 6)).includes('14 ∤'), 'recíproco con n = 14');
});

solo('teo-fermat', 'p = 7, a = 3: los restos 3, 6, 2, 5, 1, 4 vuelan a 1…6 y 3⁶ deja resto 1', async () => {
  const esc = await cargar('teo-fermat'), e = { p: 7, a: 3 };
  assert.deepEqual(esc.estado(e, 1).filter((n) => /^R:v\d$/.test(n.k)).map((n) => n.txt), ['3', '6', '2', '5', '1', '4']);
  const p3 = esc.estado(e, 2);
  assert.equal(p3.find((n) => n.k === 'R:v4').txt, '1', 'el resto de 5·3 = 15 es 1');
  assert.ok(textoVerde(ultimo(esc, e, 5), '3⁶ = 729 = 7·104 + 1'));
  assert.ok(esc.validar({ p: 7, a: 14 }), 'p | a debe avisar');
});

solo('cor-fermat', 'a(a^{p−1} − 1) con los dos casos', async () => {
  const esc = await cargar('cor-fermat');
  assert.ok(textoVerde(ultimo(esc, { p: 5, a: 10 }, 3), '5 | 10'));
  assert.ok(textoVerde(ultimo(esc, { p: 5, a: 3 }, 3), '5 | 80'));
});

solo('lema-euclides', 'tras recontar, el carril solo tiene saltos de p (sin arcos viejos de a)', async () => {
  const ns = (await cargar('lema-euclides')).estado({ p: 5, a: 2, b: 5 }, 4);
  assert.ok(ns.filter((n) => /^l1:a\d+$/.test(n.k)).every((n) => n.c === 'violeta'));
});

solo('teo-fundamental', 'los dos árboles nunca son idénticos y los árboles profundos tienen ramas hacia abajo', async () => {
  const { construirArbol } = await import('../escenas/piezas/arbol.js');
  const esc = await cargar('teo-fundamental');
  const forma = (ns, pre) => ns.filter((n) => n.k.startsWith(pre) && n.t === 'text').map((n) => `${n.k.slice(pre.length)}=${n.txt}`).sort().join();
  const p6 = esc.estado({ n: 8 }, 5);
  assert.notEqual(forma(p6, 'A:'), forma(p6, 'B:'), 'con n = 8 los dos árboles coinciden');
  const hondo = esc.estado({ n: 8192 }, 5);
  for (const l of hondo.filter((n) => /^[AB]:l/.test(n.k))) assert.ok(l.a.y2 > l.a.y1, `rama ${l.k} hacia arriba`);
  const fila = esc.estado({ n: 8192 }, 8).filter((n) => /^P:b\d+$/.test(n.k));
  assert.ok(fila.every((n) => n.a.x + n.a.width <= 676), 'la fila se sale');
});

solo('teo-fermat', 'las cajas de restos se reordenan ellas mismas hasta 1…p−1', async () => {
  const esc = await cargar('teo-fermat'), e = { p: 7, a: 3 };
  const antes = esc.estado(e, 1).find((n) => n.k === 'R:b4'), despues = esc.estado(e, 2).find((n) => n.k === 'R:b4');
  assert.ok(despues.a.x < antes.a.x, 'el resto 1 (de 15) se mueve a la primera casilla');
  assert.ok(esc.estado(e, 2).some((n) => n.k === 'R0:b4'), 'queda la huella del orden original');
});

solo('teo-wilson', 'p = 2 y p = 3 tienen textos propios y −1 se rotula en el reloj', async () => {
  const esc = await cargar('teo-wilson');
  for (const p of [2, 3]) { const t = textos(ultimo(esc, { p }, 6)); assert.ok(!/·\s*→|·\s*$|solo 1 y 1/.test(t), `p = ${p}: ${t}`); }
  assert.ok(esc.estado({ p: 13 }, 2).some((n) => n.k === 'menos1rel' && n.txt === '= −1'));
});

solo('lema-6q', 'los números se enrollan: cada uno nace del anterior', async () => {
  const ns = (await cargar('lema-6q')).estado({ N: 60 }, 0);
  assert.equal(ns.find((n) => n.k === 'num7').desde, 'num6');
});
