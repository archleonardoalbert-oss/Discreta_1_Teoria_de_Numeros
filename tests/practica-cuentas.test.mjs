// Las respuestas numéricas de las soluciones de las clases prácticas, verificadas por fuerza bruta,
// y comprobación de que la solución escrita dice exactamente eso.
import { test } from 'node:test';
import assert from 'node:assert/strict';

const mcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };
const cp = async (n) => (await import(`../libros/${n}/practica.js`)).default;
const solucion = (x, parte) => JSON.stringify((parte ? x.partes.find((p) => p.id === parte) : x.partes[0]).solucion.pasos) + JSON.stringify(x.partes.map((p) => p.aprendes));
const ej = (c, id) => c.ejercicios.find((x) => x.id === id);

test('CP-02 1: el ejemplo 3088x + 456y = 16 tiene la solución y el paso que se escriben', async () => {
  assert.equal(3088 * -44 + 456 * 298, 16);
  assert.equal(3088 / 8, 386); assert.equal(456 / 8, 57);
  const s = solucion(ej(await cp(2), 'cp2-1'));
  for (const t of ['-44', '298', '57k', '386k']) assert.ok(s.includes(t), t);
});

test('CP-02 3: 188x + 508y = 1580 con x, y ≥ 0 tiene solo (3, 2)', async () => {
  const sols = [];
  for (let x = 0; 188 * x <= 1580; x++) if ((1580 - 188 * x) % 508 === 0) sols.push([x, (1580 - 188 * x) / 508]);
  assert.deepEqual(sols, [[3, 2]]);
  assert.equal(47 * -27 + 127 * 10, 1);
  const s = solucion(ej(await cp(2), 'cp2-3'));
  for (const t of ['-27', '10665', '3950', '84', 'x = 3', 'y = 2']) assert.ok(s.includes(t), t);
});

test('CP-02 4: entre a, 2a, …, ba hay exactamente (a, b) múltiplos de b', async () => {
  for (let a = 1; a <= 30; a++) for (let b = 1; b <= 30; b++) {
    let n = 0; for (let k = 1; k <= b; k++) if ((k * a) % b === 0) n++;
    assert.equal(n, mcd(a, b), `${a}, ${b}`);
  }
});

test('CP-02 5: las cuatro cuentas con (a, b) = 1 y la identidad corregida del apartado (c)', () => {
  for (let a = 1; a <= 25; a++) for (let b = 1; b <= 25; b++) {
    if (mcd(a, b) !== 1) continue;
    assert.equal(mcd(a + b, a), 1); assert.equal(mcd(a + b, a * b), 1);
    assert.equal(mcd(a + b, a - b), (a % 2 && b % 2) ? 2 : 1);
  }
  for (let n = 0; n <= 200; n++) assert.equal(mcd(n * n + 1, (n + 1) ** 2 + 1), n % 5 === 2 ? 5 : 1, `n = ${n}`);
  const mcm = (a, b) => (a * b) / mcd(a, b);
  for (let a = 1; a <= 12; a++) for (let b = 1; b <= 12; b++) for (let c = 1; c <= 12; c++)
    assert.equal(mcm(mcm(a, b), c), (a * b * c) / mcd(mcd(a * b, b * c), c * a));
  assert.notEqual(mcd(mcd(2, 3), 1), (2 * 3 * 1) / mcd(mcd(6, 3), 2), 'el enunciado original es falso en (2, 3, 1)');
});

test('CP-02 7 y 8: a | bc ⇒ a | (a,b)(a,c) y aⁿ | bⁿ ⇒ a | b, por fuerza bruta', () => {
  for (let a = 1; a <= 30; a++) for (let b = 1; b <= 30; b++) {
    for (let c = 1; c <= 30; c++) if ((b * c) % a === 0) assert.equal((mcd(a, b) * mcd(a, c)) % a, 0);
    for (let n = 1; n <= 4; n++) if (b ** n % a ** n === 0) assert.equal(b % a, 0);
  }
});
