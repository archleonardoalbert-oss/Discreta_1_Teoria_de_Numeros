import { test } from 'node:test';
import assert from 'node:assert/strict';
import { division, mcd, mcm, euclides, coeficientes, diofantica, menorCombinacionPositiva } from '../motor/aritmetica.js';

// Generador determinista para las pruebas de propiedades.
const azar = (semilla) => () => ((semilla = (semilla * 1103515245 + 12345) % 2147483648) / 2147483648);

test('división con resto no negativo, también para a negativo', () => {
  assert.deepEqual(division(17, 5), { q: 3, r: 2 });
  assert.deepEqual(division(-17, 5), { q: -4, r: 3 });
  assert.deepEqual(division(15, 5), { q: 3, r: 0 });
});

test('mcd de la conferencia, con signos y con cero', () => {
  assert.equal(mcd(3088, 456), 8);
  assert.equal(mcd(-12, 18), 6);
  assert.equal(mcd(7, 0), 7);
  assert.equal(mcd(12, 18, 30), 6);
});

test('mcm', () => {
  assert.equal(mcm(4, 6), 12);
  assert.equal(mcm(-4, 6), 12);
});

test('Euclides con 3088 y 456 reproduce las filas de la conferencia', () => {
  const e = euclides(3088, 456);
  assert.deepEqual(e.filas.map((f) => [f.a, f.q, f.b, f.r]),
    [[3088, 6, 456, 352], [456, 1, 352, 104], [352, 3, 104, 40], [104, 2, 40, 24], [40, 1, 24, 16], [24, 1, 16, 8], [16, 2, 8, 0]]);
  assert.equal(e.mcd, 8);
});

test('coeficientes con la tabla Aᵢ, Bᵢ de la conferencia', () => {
  const c = coeficientes(3088, 456);
  assert.deepEqual(c.pasos.map((p) => [p.A, p.B]), [[1, -1], [-1, 2], [2, -5], [-5, 17], [17, -22], [-22, 149]]);
  assert.deepEqual([c.x, c.y], [-22, 149]);
});

test('coeficientes cuando b divide a a', () => {
  const c = coeficientes(12, 4);
  assert.equal(12 * c.x + 4 * c.y, 4);
});

test('diofántica sin solución devuelve null', () => {
  assert.equal(diofantica(4, 6, 7), null);
});

test('diofántica con solución da x0, y0 y los pasos b/d y a/d', () => {
  const s = diofantica(4, 6, 10);
  assert.equal(4 * s.x0 + 6 * s.y0, 10);
  assert.deepEqual([s.d, s.pasoX, s.pasoY], [2, 3, 2]);
});

test('propiedad: a·x + b·y = mcd y toda diofántica devuelta se cumple (300 casos)', () => {
  const r = azar(7);
  for (let i = 0; i < 300; i++) {
    const a = Math.floor(r() * 1001) - 500, b = Math.floor(r() * 1001) - 500 || 1, c = Math.floor(r() * 2001) - 1000;
    const k = coeficientes(a, b);
    assert.equal(a * k.x + b * k.y, mcd(a, b), `coeficientes(${a}, ${b})`);
    const s = diofantica(a, b, c);
    if (c % mcd(a, b) === 0) assert.equal(a * s.x0 + b * s.y0, c, `diofantica(${a}, ${b}, ${c})`);
    else assert.equal(s, null);
  }
});

test('menor combinación lineal positiva = mcd', () => {
  const m = menorCombinacionPositiva([12, 18, 30], 6);
  assert.equal(m.valor, 6);
  assert.equal(m.coefs.reduce((s, x, i) => s + x * [12, 18, 30][i], 0), 6);
});
