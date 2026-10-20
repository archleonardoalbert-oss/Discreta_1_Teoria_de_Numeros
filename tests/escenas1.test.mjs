// Tests concretos de las escenas del Libro I.
import { test } from 'node:test';
import assert from 'node:assert/strict';

const cargar = async (id) => (await import(`../escenas/1/${id}.js`)).default;
const textos = (ns) => ns.filter((n) => n.t === 'text').map((n) => n.txt).join(' | ');
const hay = (ns, s, c) => ns.some((n) => n.t === 'text' && n.txt.includes(s) && (!c || n.c === c));

test('pbo: el barrido se detiene en el menor elemento y el conjunto lo señala', async () => {
  const esc = await cargar('pbo'), ns = esc.estado({ A: [17, 9, 30, 12] }, 2);
  assert.ok(hay(ns, 'm = 9', 'ambar'));
  assert.equal(ns.find((n) => n.k === 'A:e0').txt, '9');
  assert.equal(ns.filter((n) => /^ras/.test(n.k)).length, 8, 'rastro 1…8');
});

test('pim: al final todas las casillas están encendidas y la plantilla se retira', async () => {
  const ns = (await cargar('pim')).estado({ n0: 3 }, 4);
  assert.ok(ns.filter((n) => /^c\d$/.test(n.k)).every((n) => n.c === 'verde'));
  assert.ok(!ns.some((n) => n.k.startsWith('T:')));
});

test('teo-pbo-pim: C es supuesto y desaparece al cerrar la contradicción', async () => {
  const esc = await cargar('teo-pbo-pim');
  assert.ok(esc.estado({}, 1).filter((n) => n.k.startsWith('C:')).every((n) => n.supuesto));
  assert.ok(!esc.estado({}, 5).some((n) => n.k.startsWith('C:') || /^x\d/.test(n.k)));
  assert.ok(hay(esc.estado({}, 10), 'A = ∅', 'verde'));
});

test('ej-suma-impares: el cuadrado final tiene m² cuadraditos y la escuadra 2m − 1', async () => {
  const ns = (await cargar('ej-suma-impares')).estado({ m: 5 }, 8);
  assert.equal(ns.filter((n) => /^g\d+-\d+$/.test(n.k)).length, 25);
  assert.equal(ns.filter((n) => /^g5-/.test(n.k)).length, 9);
  assert.ok(hay(ns, '= m² = 25', 'verde'));
});

test('def-divide: q saltos caen en b; el rectángulo tiene |b| cuadraditos', async () => {
  const esc = await cargar('def-divide');
  assert.ok(esc.validar({ a: 4, b: 21 }));
  const ns = esc.estado({ a: -4, b: 20 }, 2);
  assert.ok(hay(ns, '20 = −4·(−5)', 'verde'), textos(ns));
  assert.equal(ns.filter((n) => /^Q:c/.test(n.k)).length, 20);
});

test('teo-transitiva: q₁·q₂ saltos de a llegan a c y nacen de los saltos de b', async () => {
  const ns = (await cargar('teo-transitiva')).estado({ a: 2, b: 6, c: 30 }, 3);
  const arcos = ns.filter((n) => /^C:a\d+$/.test(n.k));
  assert.equal(arcos.length, 15);
  assert.equal(arcos[4].desde, 'B:a1');
});

test('teo-division: resto correcto también con a negativo, y r₁ acaba sobre r', async () => {
  const esc = await cargar('teo-division');
  assert.ok(esc.validar({ a: 20, b: 5 }), 'b | a se rechaza');
  assert.ok(hay(esc.estado({ a: -23, b: 5 }, 5), '−23 = 5·(−5) + 2', 'ambar'));
  const fin = esc.estado({ a: 23, b: 5 }, 13);
  assert.equal(fin.find((n) => n.k === 'pr1').a.cx, fin.find((n) => n.k === 'pr').a.cx);
  assert.ok(!fin.some((n) => n.k === 'fantasma'));
});

test('def-primo y cor-compuesto: fichas de intento y el rectángulo que gira', async () => {
  const p = (await cargar('def-primo')).estado({ n: 12 }, 2);
  assert.equal(p.find((n) => n.k === 'f3:t').txt, 'de 3: ✓');
  assert.equal(p.find((n) => n.k === 'f5:t').txt, 'de 5: sobran 2');
  const esc = await cargar('cor-compuesto');
  const antes = esc.estado({ n: 18 }, 0).find((n) => n.k === 'c1'), despues = esc.estado({ n: 18 }, 2).find((n) => n.k === 'c1');
  assert.notDeepEqual(antes.a, despues.a, 'la celda 1 viaja al girar');
});

test('lema-divisor-primo: la escalera de 100 baja a 10 y termina en 2', async () => {
  const ns = (await cargar('lema-divisor-primo')).estado({ n: 100 }, 3);
  assert.deepEqual(['v0', 'v1', 'v2'].map((k) => ns.find((n) => n.k === k).txt), ['100', '10', '2']);
  assert.ok(hay(ns, '2 | 10 | 100', 'verde'));
});

test('teo-infinitos-primos: con 6 primos, m = 30031 y q = 59', async () => {
  const ns = (await cargar('teo-infinitos-primos')).estado({ k: 6 }, 3);
  assert.ok(hay(ns, 'q = 59', 'verde'));
  assert.ok(hay(ns, '59·509', 'ambar'));
});
