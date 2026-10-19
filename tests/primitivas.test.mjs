import { test } from 'node:test';
import assert from 'node:assert/strict';
import { marcarNuevos } from '../motor/nodos.js';
import { planRecta, agrupar } from '../motor/escala.js';
import { recta, saltos, punto, llave, cuadricula, reglasDobles, TOPE_SALTOS } from '../escenas/primitivas.js';

const finArco = (n) => Number(n.a.d.trim().split(/[ ,]+/).at(-2));   // x final de «M x y Q cx cy x y»
const claves = (ns) => ns.map((n) => n.k);
const unicas = (ns) => assert.equal(new Set(claves(ns)).size, ns.length, 'claves repetidas');

test('la recta crece hacia la derecha e incluye el 0 entre sus marcas', () => {
  const p = planRecta({ min: -20, max: 20, ancho: 600 });
  assert.ok(p.x(-5) < p.x(0) && p.x(0) < p.x(5));
  assert.ok(p.marcas.includes(0));
  const gaps = p.marcas.slice(1).map((m, i) => p.x(m) - p.x(p.marcas[i]));
  assert.ok(gaps.every((g) => g >= 40), 'marcas a menos de 40 px');
});

test('saltos negativos van hacia la izquierda de 0', () => {
  const p = planRecta({ min: -20, max: 20, ancho: 600 });
  const arcos = saltos('s', p, { desde: 0, salto: 5, n: -3, y: 100, c: 'cian' }).filter((n) => n.t === 'path');
  assert.deepEqual(arcos.map(finArco), [p.x(-5), p.x(-10), p.x(-15)].map((v) => Math.round(v * 10) / 10));
});

test('saltos muy pequeños en pantalla se agrupan con etiqueta ×g', () => {
  const g = saltos('g', planRecta({ min: -70000, max: 70000, ancho: 600 }), { desde: 0, salto: 3088, n: -22, y: 100 });
  assert.ok(g.some((n) => n.txt?.startsWith('×')));
  assert.ok(g.filter((n) => n.t === 'path').length < 22);
});

test('agrupar elige el grupo mínimo que llega a minPx', () => {
  assert.equal(agrupar(30, 10), 1);
  assert.equal(agrupar(5, 10), 4);
  assert.equal(agrupar(1, 3), 3);          // nunca más grupo que saltos
});

test('marcarNuevos: los fijos nunca son nuevos y un texto cambiado sí', () => {
  assert.equal(marcarNuevos(null, [{ k: 'a', t: 'line', a: {}, fijo: true }, { k: 'b', t: 'line', a: {} }]).has('a'), false);
  assert.deepEqual([...marcarNuevos([{ k: 'b', t: 'text', a: { x: 1 }, txt: '3' }], [{ k: 'b', t: 'text', a: { x: 1 }, txt: '4' }])], ['b']);
  assert.equal(marcarNuevos([{ k: 'c', t: 'circle', a: { cx: 1 } }], [{ k: 'c', t: 'circle', a: { cx: 1 } }]).size, 0);
});

test('todas las primitivas: claves únicas y deterministas', () => {
  const p = planRecta({ min: -10, max: 40, ancho: 640 });
  const hacer = () => [
    ...recta('r', p, 120),
    ...saltos('s', p, { desde: 0, salto: 6, n: 5, y: 120, c: 'cian' }),
    ...punto('p', p, 17, 120, { c: 'ciruela', etiqueta: 'a = 17' }),
    ...llave('l', p, 15, 17, 140, 'r = 2', 'ambar'),
    ...cuadricula('q', { x: 10, y: 10, filas: 3, cols: 4, lado: 14, c: 'cian', unidad: '1' }),
    ...reglasDobles('d', p, { b: 5, k: 6, y: 200 }),
  ];
  const a = hacer();
  unicas(a);
  assert.deepEqual(a, hacer());
});

test('la cuadrícula rotula su unidad y las reglas dobles numeran 0…k', () => {
  const q = cuadricula('q', { x: 0, y: 0, filas: 2, cols: 3, lado: 10, c: 'cian', unidad: 'd' });
  assert.equal(q.filter((n) => n.k.startsWith('q:c')).length, 6);
  assert.ok(q.some((n) => n.txt?.includes('= d')));
  const r = reglasDobles('d', planRecta({ min: 0, max: 30, ancho: 600 }), { b: 5, k: 6, y: 200 });
  for (let i = 0; i <= 6; i++) assert.ok(r.some((n) => n.txt === String(i)), `falta la marca ${i}`);
});

test('TOPE_SALTOS es 400', () => assert.equal(TOPE_SALTOS, 400));

test('las marcas de la recta dejan sitio a números largos', () => {
  const p = planRecta({ min: -72000, max: 2000, ancho: 680 });
  const ancho = (m) => String(m).length * 8 + 12;
  for (let i = 1; i < p.marcas.length; i++)
    assert.ok(p.x(p.marcas[i]) - p.x(p.marcas[i - 1]) >= ancho(p.marcas[i]), `marcas ${p.marcas[i - 1]} y ${p.marcas[i]} demasiado juntas`);
});

test('un carril con saltos agrupados no rotula cada arco y lo dice en su etiqueta', async () => {
  const { carril, planPara } = await import('../escenas/comun.js');
  const ns = carril('c', planPara([0, 456 * 149]), 100, { salto: 456, n: 149, etiqueta: '149 saltos de 456' });
  assert.ok(!ns.some((n) => n.txt?.startsWith('×')));
  assert.ok(ns.find((n) => n.k === 'c:et').txt.includes('cada arco'));
});

test('conjunto: elementos en orden, definición escrita y el señalado con su aro', async () => {
  const { conjunto, simbolos } = await import('../escenas/primitivas.js');
  assert.deepEqual(simbolos('s', 3), ['s₁', 's₂', 's₃', '…']);
  const ns = conjunto('S', { x: 20, y: 40, nombre: 'S', elementos: ['s₁', 's₂', 's₃'], definicion: 'd > 0', señalado: 0 });
  const el = (i) => ns.find((n) => n.k === `S:e${i}`);
  assert.deepEqual([0, 1, 2].map((i) => el(i).txt), ['s₁', 's₂', 's₃']);
  assert.ok(el(0).a.x < el(1).a.x && el(1).a.x < el(2).a.x);
  assert.ok(ns.some((n) => n.txt === 'd > 0'));
  const aro = ns.find((n) => n.k === 'S:aro');
  assert.ok(aro && Math.abs(aro.a.cx - el(0).a.x) < 12 && el(0).c === 'ambar');
});

test('conjunto con muchos números no se sale del ancho', async () => {
  const { conjunto } = await import('../escenas/primitivas.js');
  const ns = conjunto('D', { x: 24, y: 40, nombre: 'D(720)', elementos: [1, 2, 3, 4, 5, 6, 8, 9, 10, 12, 15, 16, 18, 20, 24, 30, 36, 40, 45, 48, 60, 72, 80, 90, 120, 144, 180, 240, 360, 720].map(String), ancho: 680 });
  for (const n of ns.filter((n) => n.t === 'text')) assert.ok(n.a.x + [...n.txt].length * 7.8 <= 680, `${n.k} se sale`);
});

test('rectángulo: celdas filas × columnas y lados rotulados', async () => {
  const { rectangulo } = await import('../escenas/primitivas.js');
  const ns = rectangulo('R', { x: 40, y: 40, filas: 4, cols: 6, lado: 12, c: 'cian', etiquetaFilas: 'a = 4', etiquetaCols: 'b = 6' });
  assert.equal(ns.filter((n) => n.k.startsWith('R:c')).length, 24);
  assert.ok(ns.some((n) => n.txt === 'a = 4') && ns.some((n) => n.txt === 'b = 6'));
});
