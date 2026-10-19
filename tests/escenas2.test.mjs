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

const elementos = (ns, id) => ns.filter((n) => new RegExp(`^${id}:e\\d+$`).test(n.k)).map((n) => n.txt);

solo('teo-divisores-comunes', 'con (12, 18) muestra D(12) ∩ D(18) y D(6) como el mismo conjunto', async () => {
  const ns = ultimo(await cargar('teo-divisores-comunes'), { a: 12, b: 18 }, 4);
  assert.deepEqual(elementos(ns, 'Di'), ['1', '2', '3', '6']);
  assert.deepEqual(elementos(ns, 'Dd'), ['1', '2', '3', '6']);
  assert.ok(textoVerde(ns, 'D(12) ∩ D(18) = D(6)'));
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

solo('teo-menor-combinacion', 'S es un conjunto de símbolos y el PBO señala c₁', async () => {
  const esc = await cargar('teo-menor-combinacion'), e = { ns: [12, 18, 30] };
  const p4 = esc.estado(e, 3);
  assert.equal(p4.find((n) => n.k === 'S:e0')?.txt, 'c₁');
  assert.ok(!p4.some((n) => /^s\d+$/.test(n.k)), 'siguen los puntos de S en la recta');
  const p5 = esc.estado(e, 4);
  assert.ok(p5.some((n) => n.k === 'S:aro') && p5.find((n) => n.k === 'S:e0').c === 'ambar');
  const p8 = esc.estado(e, 7), r = p8.find((n) => n.k === 'S:r');
  assert.ok(r && r.c === 'ambar' && r.a.x < p8.find((n) => n.k === 'S:e0').a.x, 'r no aparece a la izquierda de s₁');
});

solo('def-primos-relativos', 'los divisores son conjuntos con sus números y la intersección es {1}', async () => {
  const esc = await cargar('def-primos-relativos');
  assert.deepEqual(elementos(esc.estado({ a: 8, b: 15 }, 1), 'Da'), ['1', '2', '4', '8']);
  const ns = ultimo(esc, { a: 8, b: 15 }, 4);
  assert.deepEqual(elementos(ns, 'Dab'), ['1']);
  assert.ok(ns.filter((n) => /^Da:e\d+$/.test(n.k) && n.c === 'verde').map((n) => n.txt).join() === '1');
});

solo('prop-signos', 'D(a) = D(−a) como conjunto con los divisores', async () => {
  const ns = (await cargar('prop-signos')).estado({ a: 12, b: 18 }, 1);
  assert.deepEqual(elementos(ns, 'Da'), ['1', '2', '3', '4', '6', '12']);
  assert.ok(ns.some((n) => n.k === 'Da:n' && n.txt.includes('D(12) = D(−12)')));
});

solo('teo-multiplos-comunes', 'el producto ab es un rectángulo a × b y una de sus d tiras mide ab/d', async () => {
  const ns = ultimo(await cargar('teo-multiplos-comunes'), { a: 4, b: 6 }, 5);
  assert.equal(ns.filter((n) => /^R:c\d+-\d+$/.test(n.k)).length, 24);
  assert.equal(ns.filter((n) => /^R:c\d+-\d+$/.test(n.k) && n.c === 'verde').length, 12);
  assert.ok(textos(ns).includes('ab/d = 12'), textos(ns));
});

solo('cor-mcm-mcd', 'los rectángulos rotulan sus lados', async () => {
  const t = textos(ultimo(await cargar('cor-mcm-mcd'), { a: 4, b: 6 }, 4));
  for (const s of ['|a| = 4', '|b| = 6', '(a,b) = 2', '[a,b] = 12']) assert.ok(t.includes(s), s);
});

solo('teo-menor-combinacion', 'el orden de S se ve escrito: c₁ < c₂ < c₃ < …', async () => {
  assert.ok(textos((await cargar('teo-menor-combinacion')).estado({ ns: [12, 18, 30] }, 3)).includes('c₁ < c₂ < c₃ < …'));
});

const nuevasClaves = (esc, e, i) => { const antes = new Set(esc.estado(e, i - 1).map((n) => n.k)); return esc.estado(e, i).filter((n) => !antes.has(n.k)).map((n) => n.k); };

solo('teo-multiplos-comunes', 'el rectángulo llega en su propio paso (k₁ = k·b/d) y el último solo añade el salto ab/d y la conclusión', async () => {
  const esc = await cargar('teo-multiplos-comunes'), e = { a: 4, b: 6 };
  assert.ok(nuevasClaves(esc, e, 3).some((k) => k.startsWith('R:c')), 'el rectángulo no aparece en el paso 4');
  assert.ok(!nuevasClaves(esc, e, 4).some((k) => k.startsWith('R:')), 'el último paso vuelve a meter el rectángulo');
  assert.ok(textos(esc.estado({ a: 3, b: 5 }, 4)).includes('1 tira de'), 'singular con d = 1');
});

solo('teo-divisores-comunes', 'D(a) ∩ D(b) aparece al decir «c | a y c | b» y D(d) al decir «c | d»', async () => {
  const esc = await cargar('teo-divisores-comunes'), e = { a: 12, b: 18 };
  assert.ok(nuevasClaves(esc, e, 1).some((k) => k.startsWith('Di:')) && !nuevasClaves(esc, e, 1).some((k) => k.startsWith('Dd:')));
  assert.ok(nuevasClaves(esc, e, 2).some((k) => k.startsWith('Dd:')));
});

solo('def-primos-relativos', 'el último paso solo añade la intersección y la conclusión', async () => {
  const k = nuevasClaves(await cargar('def-primos-relativos'), { a: 8, b: 15 }, 3);
  assert.ok(!k.some((x) => x.startsWith('lc')), `añade también el carril: ${k}`);
});

solo('teo-euclides', 'rectángulo cortado en cuadrados con lupa del resto actual', async () => {
  const esc = await cargar('teo-euclides'), e = { a: 150, b: 42 };
  const p0 = esc.estado(e, 0);
  assert.equal(p0.filter((n) => /^E0:s\d+$/.test(n.k)).length, 3, 'la fila 1 corta 3 cuadrados de 42');
  assert.ok(p0.some((n) => n.k.startsWith('L')), 'falta la lupa');
  const p3 = esc.estado(e, 3);
  assert.ok(p3.some((n) => /^E3:s\d+$/.test(n.k) && n.c === 'verde'), 'el último cuadrado (lado = mcd) va en verde');
});

solo('teo-euclides', 'la lupa solo muestra el corte actual (sin piezas de lupas anteriores)', async () => {
  const esc = await cargar('teo-euclides'), e = { a: 150, b: 42 };
  const filas = [[3, 24], [1, 18], [1, 6], [3, 0]];          // 150=3·42+24, 42=1·24+18, 24=1·18+6, 18=3·6+0
  [0, 1, 2, 3].forEach((paso) => {
    const h = [1, 2, 3, 4][paso], [q, r] = filas[h - 1];
    const lupa = esc.estado(e, paso).filter((n) => n.t === 'rect' && /^L/.test(n.k));
    assert.equal(lupa.length, q + (r > 0 ? 1 : 0), `paso ${paso + 1}: ${lupa.map((n) => n.k)}`);
  });
});

solo('ej-euclides-3088', 'cada resto lleva su expresión y el paso reilumina los dos restos que usa', async () => {
  const esc = await cargar('ej-euclides-3088'), e = { a: 3088, b: 456 };
  assert.ok(textos(esc.estado(e, 0)).includes('352 = 3088·1 + 456·(−6)'));
  assert.ok(textos(esc.estado(e, 7)).includes('8 = 3088·(−22) + 456·149'));
  const p3 = esc.estado(e, 2);
  assert.ok(p3.filter((n) => n.ref).length >= 2, 'no reilumina los restos anteriores');
});

solo('ej-coeficientes-3088', 'cada paso reilumina la fila anterior de la tabla y resalta la fila de Euclides cuyo cociente usa', async () => {
  const ns = (await cargar('ej-coeficientes-3088')).estado({ a: 3088, b: 456 }, 2);
  assert.ok(ns.find((n) => n.k === 'tc2')?.ref, 'tc2 no se reilumina');
  assert.equal(ns.find((n) => n.k === 'te3')?.c, 'ambar');
});

solo('teo-menor-combinacion', 'el resto supuesto se dibuja punteado con su etiqueta de combinación y desaparece al cerrar la contradicción', async () => {
  const esc = await cargar('teo-menor-combinacion'), e = { ns: [12, 18, 30] };
  const p7 = esc.estado(e, 6);
  assert.ok(p7.some((n) => n.supuesto && n.txt?.includes('12·(1 − (−1)·2)')), textos(p7));
  assert.ok(esc.estado(e, 7).some((n) => n.k === 'S:r' && n.supuesto));
  assert.ok(!esc.estado(e, 8).some((n) => n.k === 'S:r'), 'el r supuesto sigue tras cerrar la contradicción');
});

solo('teo-solucion-general', 'los dos bloques del intercambio se rotulan con mcm(a, b)', async () => {
  assert.ok(textos((await cargar('teo-solucion-general')).estado({ a: 6, b: 10, c: 8 }, 1)).includes('mcm(a, b) = 30'));
});

solo('teo-euclides', 'al terminar no queda contorno de resto y los pasos nunca retroceden', async () => {
  const esc = await cargar('teo-euclides');
  assert.ok(!esc.estado({ a: 150, b: 42 }, 3).some((n) => n.k === 'E:resto'), 'sigue el contorno del resto');
  const filasLupa = (i) => esc.estado({ a: 5, b: 2 }, i).find((n) => n.k === 'Lt').txt;
  assert.notEqual(filasLupa(2), filasLupa(0), 'con 2 filas el paso 3 vuelve a la lupa del paso 1');
  const ambar = esc.estado({ a: 5, b: 2 }, 2).filter((n) => /^F:\d+$/.test(n.k) && n.c === 'ambar');
  assert.equal(ambar.length, 1, 'más de una fila marcada como actual');
});

solo('teo-menor-combinacion', 'al cerrar la contradicción no queda nada supuesto y se avisa de que con estos números vale 0', async () => {
  const esc = await cargar('teo-menor-combinacion'), e = { ns: [12, 18, 30] };
  assert.ok(!esc.estado(e, 8).some((n) => n.supuesto), 'queda algo supuesto en «r = 0»');
  assert.ok(esc.estado(e, 6).find((n) => n.k === 'hr').txt.includes('vale 0'));
});

solo('ej-coeficientes-3088', 'al final solo hay una fila actual en la tabla', async () => {
  const ns = (await cargar('ej-coeficientes-3088')).estado({ a: 3088, b: 456 }, 6);
  assert.equal(ns.filter((n) => /^tc\d+$/.test(n.k) && n.c === 'ambar').length, 1);
});
