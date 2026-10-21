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

const esPrimo = (n) => { if (n < 2) return false; for (let d = 2; d * d <= n; d++) if (n % d === 0) return false; return true; };

test('CP-03 1: si aⁿ − 1 es primo, a = 2 y n primo; si aⁿ + 1 es primo, a par y n potencia de 2 (a, n ≤ 30 con valor < 10¹²)', () => {
  for (let a = 2; a <= 30; a++) for (let n = 2; n <= 30; n++) {
    const v = a ** n; if (v > 1e12) continue;
    if (esPrimo(v - 1)) assert.ok(a === 2 && esPrimo(n), `${a}^${n} − 1`);
    if (esPrimo(v + 1)) assert.ok(a % 2 === 0 && (n & (n - 1)) === 0, `${a}^${n} + 1`);
  }
});

test('CP-03 2: para 4 < n ≤ 300, n | (n − 1)! si y solo si n es compuesto; y 4 ∤ 3!', () => {
  for (let n = 5; n <= 300; n++) {
    let f = 1; for (let k = 1; k < n; k++) f = (f * k) % n;
    assert.equal(f === 0, !esPrimo(n), `n = ${n}`);
  }
  assert.notEqual(6 % 4, 0);
});

test('CP-03 3: la descomposición canónica de 20! es 2¹⁸ · 3⁸ · 5⁴ · 7² · 11 · 13 · 17 · 19', async () => {
  let f = 1n; for (let k = 1n; k <= 20n; k++) f *= k;
  assert.equal(f, 2n ** 18n * 3n ** 8n * 5n ** 4n * 7n ** 2n * 11n * 13n * 17n * 19n);
  const s = solucion(ej(await cp(3), 'cp3-3'));
  for (const t of ['2^{18}', '3^{8}', '5^{4}', '7^{2}']) assert.ok(s.includes(t), t);
});

test('CP-03 4, 6 y 7: el 15.º primo es 47; solo p = 3 hace primo a p² + 2; pₙ ≤ 2^(2^(n−1)) para n ≤ 5', () => {
  const primos = []; for (let n = 2; primos.length < 15; n++) if (esPrimo(n)) primos.push(n);
  assert.equal(primos[14], 47);
  for (let p = 2; p < 3000; p++) if (esPrimo(p) && esPrimo(p * p + 2)) assert.equal(p, 3);
  assert.ok(esPrimo(29));
  const ps = []; for (let n = 2; ps.length < 5; n++) if (esPrimo(n)) ps.push(n);
  ps.forEach((p, i) => assert.ok(p <= 2 ** (2 ** i)));
});

const mcdN = (a, b) => { while (b) [a, b] = [b, a % b]; return a; };   // BigInt

test('CP-04 1: las cinco afirmaciones son verdaderas, con los restos que dice la solución', async () => {
  assert.equal((37621n + 2n ** 30n * 471n + 59603n * 25n) % 12n, 0n);
  const v = 375121n * 4n ** 105n - 35n ** 91n;
  assert.ok(v % 2n !== 0n && v % 3n !== 0n);
  assert.equal((9n ** 1684n - 7n ** 52688n) % 10n, 0n);
  assert.equal((2n ** 70n + 3n ** 70n) % 13n, 0n);
  assert.equal(3n ** 47n % 23n, 4n);
  assert.equal(37621 % 12, 1); assert.equal(59603 % 12, 11); assert.equal(2 ** 10 % 13, 10);
  const c = ej(await cp(4), 'cp4-1');
  assert.ok(c.partes.every((p) => /verdadera/i.test(JSON.stringify(p.aprendes))), 'cada parte concluye «verdadera»');
});

test('CP-04 2 y 3: Σ k! es cuadrado solo para n = 1 y 3 (n ≤ 20); cuadrados módulo 5, 3 y 8', () => {
  let s = 0n, f = 1n; const n2 = [];
  for (let n = 1n; n <= 20n; n++) { f *= n; s += f; let r = BigInt(Math.floor(Math.sqrt(Number(s)))); while (r * r > s) r--; while ((r + 1n) * (r + 1n) <= s) r++; if (r * r === s) n2.push(Number(n)); }
  assert.deepEqual(n2, [1, 3]);
  const cuad = (m) => [...new Set(Array.from({ length: m }, (_, x) => (x * x) % m))].sort((a, b) => a - b);
  assert.deepEqual(cuad(5), [0, 1, 4]); assert.deepEqual(cuad(3), [0, 1]); assert.deepEqual(cuad(8), [0, 1, 4]);
  const sumas = new Set(); for (const p of cuad(8)) for (const q of cuad(8)) sumas.add((p + q) % 8);
  assert.ok(!sumas.has(6));
});

test('CP-04 4, 5, 6 y 9 por fuerza bruta', () => {
  const fact = (c) => { let f = 1; for (let k = 2; k <= c; k++) f *= k; return f; };
  const ternas = [];
  for (let a = 0; a < 40; a++) for (let b = 0; b < 40; b++) for (let c = 0; c <= 18; c++) if (2 ** a + 2 ** b === fact(c)) ternas.push([a, b, c]);
  assert.deepEqual(ternas, [[0, 0, 2], [1, 2, 3], [2, 1, 3], [3, 4, 4], [4, 3, 4]]);
  for (let p = 5; p < 200; p += 8) {
    if (!esPrimo(p)) continue;
    for (let a = 0; a < p; a++) for (let b = 0; b < p; b++) if ((a ** 4 + b ** 4) % p === 0) assert.ok(a === 0 && b === 0, `${p}: ${a}, ${b}`);
  }
  for (let n = 22; n < 1000000; n++) { const s = String(n); if (s.length % 2 === 0 && s === [...s].reverse().join('')) assert.equal(n % 11, 0, s); }
  for (let a = 2n; a <= 6n; a++) for (let n = 2; n <= 12; n++) for (let m = 1; m <= 12; m++)
    assert.equal(mcdN(a ** BigInt(n) - 1n, a ** BigInt(m) - 1n), a ** BigInt(mcd(n, m)) - 1n);
});

test('CP-04 8: F₀⋯Fₙ₋₁ = Fₙ − 2 y los números de Fermat son primos relativos dos a dos', () => {
  const F = Array.from({ length: 7 }, (_, n) => 2n ** (2n ** BigInt(n)) + 1n);
  for (let n = 1; n < 7; n++) assert.equal(F.slice(0, n).reduce((x, y) => x * y, 1n), F[n] - 2n);
  for (let i = 0; i < 7; i++) for (let j = i + 1; j < 7; j++) assert.equal(mcdN(F[i], F[j]), 1n);
});

test('CP-05 1, 3 y 5: 17x ≡ 9 (276) da x ≡ 33; los huevos son 301; el menor n es 213', async () => {
  assert.deepEqual(Array.from({ length: 276 }, (_, x) => x).filter((x) => (17 * x) % 276 === 9), [33]);
  assert.equal(17 * 65 - 276 * 4, 1);
  let h = 1; while (![2, 3, 4, 5, 6].every((m) => h % m === 1) || h % 7 !== 0) h++;
  assert.equal(h, 301);
  let n = 5; while (!(n % 2 === 1 && n % 3 === 0 && (n + 2) % 5 === 0 && (n + 4) % 7 === 0)) n++;
  assert.equal(n, 213);
  const c = await cp(5);
  assert.ok(solucion(ej(c, 'cp5-1')).includes('33'));
  assert.ok(solucion(ej(c, 'cp5-3')).includes('301'));
  assert.ok(solucion(ej(c, 'cp5-5')).includes('213'));
});

test('CP-05 4: existen dos SRC con suma SRC exactamente para n impar (n ≤ 7, búsqueda exhaustiva)', () => {
  const perms = (xs) => (xs.length <= 1 ? [xs] : xs.flatMap((x, i) => perms([...xs.slice(0, i), ...xs.slice(i + 1)]).map((p) => [x, ...p])));
  for (let n = 1; n <= 7; n++) {
    const base = [...Array(n).keys()];
    // basta A = 0, 1, …, n − 1 (reordenar los pares no cambia nada) y B una permutación de los restos
    const hay = perms(base).some((B) => new Set(base.map((a, i) => (a + B[i]) % n)).size === n);
    assert.equal(hay, n % 2 === 1, `n = ${n}`);
  }
});

test('CP-05 6, 8 y 9 por fuerza bruta', () => {
  const ps = [2, 3, 5, 7, 11, 13];
  for (const p of ps) for (const q of ps) if (p !== q)
    for (let n = -30n; n <= 30n; n++) {
      const [P, Q] = [BigInt(p), BigInt(q)];
      assert.equal((P * n ** Q + Q * n ** P - (P + Q) * n) % (P * Q), 0n, `${p}, ${q}, ${n}`);
    }
  const mcm = (a, b) => (a * b) / mcd(a, b);
  for (let n1 = 1; n1 <= 9; n1++) for (let n2 = 1; n2 <= 9; n2++) for (let n3 = 1; n3 <= 9; n3++)
    for (let a1 = 0; a1 < n1; a1++) for (let a2 = 0; a2 < n2; a2++) for (let a3 = 0; a3 < n3; a3++) {
      const L = mcm(mcm(n1, n2), n3), sols = [];
      for (let x = 0; x < L; x++) if (x % n1 === a1 && x % n2 === a2 && x % n3 === a3) sols.push(x);
      const compatibles = (a1 - a2) % mcd(n1, n2) === 0 && (a1 - a3) % mcd(n1, n3) === 0 && (a2 - a3) % mcd(n2, n3) === 0;
      assert.equal(sols.length, compatibles ? 1 : 0);
    }
  const formula = (n) => {
    let e = 0; while (n % 2 === 0) { n /= 2; e++; }
    let r = 0; for (let p = 3; p <= n; p += 2) if (n % p === 0) { r++; while (n % p === 0) n /= p; }
    return 2 ** r * (e <= 1 ? 1 : e === 2 ? 2 : 4);
  };
  for (let n = 1; n <= 400; n++) {
    let c = 0; for (let x = 0; x < n; x++) if ((x * x - 1) % n === 0) c++;
    assert.equal(c, formula(n), `n = ${n}`);
  }
});
