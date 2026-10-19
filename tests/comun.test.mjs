import { test } from 'node:test';
import assert from 'node:assert/strict';
import { escenaPorCapas, planPara, carril, filas, rotulo, ANCHO } from '../escenas/comun.js';
import { divisores } from '../motor/aritmetica.js';

test('divisores positivos ordenados', () => {
  assert.deepEqual(divisores(12), [1, 2, 3, 4, 6, 12]);
  assert.deepEqual(divisores(-9), [1, 3, 9]);
});

test('escenaPorCapas acumula capas hasta el paso y la capa posterior sobrescribe la misma clave', () => {
  const esc = escenaPorCapas({
    entradas: [{ id: 'a', etiqueta: 'a', valor: 3, min: 1, max: 9 }], alto: 100,
    base: () => [rotulo('base', 0, 0, 'B')],
    capas: [
      ({ a }) => [rotulo('x', 0, 10, `a=${a}`)],
      () => [rotulo('y', 0, 20, 'dos')],
      () => [rotulo('x', 0, 10, 'cambiado', 'verde')],
    ],
  });
  assert.deepEqual(esc.estado({ a: 3 }, 0).map((n) => n.k), ['base', 'x']);
  assert.deepEqual(esc.estado({ a: 3 }, 1).map((n) => n.k), ['base', 'x', 'y']);
  const ult = esc.estado({ a: 3 }, 2);
  assert.deepEqual(ult.map((n) => n.k), ['base', 'x', 'y']);
  assert.equal(ult[1].txt, 'cambiado');
  assert.deepEqual(esc.vista({ a: 3 }), { ancho: ANCHO, alto: 100 });
  assert.equal(esc.capas, 3);
});

test('planPara incluye el 0 y todos los valores con margen', () => {
  const p = planPara([-22, 149]);
  assert.ok(p.min < -22 && p.max > 149 && p.min <= 0 && p.max >= 0);
});

test('un carril dibuja su línea base, sus saltos hasta el final y su etiqueta', () => {
  const p = planPara([0, 18]);
  const c = carril('c', p, 100, { salto: 6, n: 3, c: 'cian', etiqueta: 'd = 6' });
  assert.ok(c.some((n) => n.k === 'c:base'));
  assert.equal(c.filter((n) => n.t === 'path').length, 3);
  assert.ok(c.some((n) => n.txt === 'd = 6'));
});

test('filas: una línea de texto por fila, con la actual resaltada', () => {
  const f = filas('t', ['3088 = 6·456 + 352', '456 = 1·352 + 104'], { x: 10, y: 20, actual: 1 });
  assert.deepEqual(f.map((n) => n.txt), ['3088 = 6·456 + 352', '456 = 1·352 + 104']);
  assert.equal(f[1].c, 'ambar');
});

test('escenaPorCapas conserva la leyenda propia de la escena', () => {
  const esc = escenaPorCapas({ entradas: [], alto: 10, capas: [() => []], leyenda: { cian: 'saltos de a' } });
  assert.deepEqual(esc.leyenda, { cian: 'saltos de a' });
});
