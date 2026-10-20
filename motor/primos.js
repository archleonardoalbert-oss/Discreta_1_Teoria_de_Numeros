// Aritmética de primos para la Conferencia 3.

export function esPrimo(n) {
  if (n < 2) return false;
  for (let d = 2; d * d <= n; d++) if (n % d === 0) return false;
  return true;
}

/** Multiconjunto ordenado de factores primos de n ≥ 2 (n = producto de la lista). */
export function factorizar(n) {
  const f = [];
  for (let d = 2; d * d <= n; d++) while (n % d === 0) { f.push(d); n /= d; }
  if (n > 1) f.push(n);
  return f;
}

/** Forma canónica: [[p₁, α₁], [p₂, α₂], …] con p₁ < p₂ < …. */
export function canonica(n) {
  const pares = [];
  for (const p of factorizar(n)) {
    if (pares.length && pares.at(-1)[0] === p) pares.at(-1)[1]++;
    else pares.push([p, 1]);
  }
  return pares;
}

/** y con x·y que deja resto 1 al dividir entre n, o null si no existe. */
export function inversoMod(x, n) {
  for (let y = 1; y < n; y++) if ((x * y) % n === 1 % n) return y;
  return null;
}

export function factorialBig(n) {
  let f = 1n;
  for (let i = 2n; i <= BigInt(n); i++) f *= i;
  return f;
}

/** Resto de aᵉ al dividir entre m (exacto con BigInt). */
export function restoPotencia(a, e, m) {
  let r = 1n, b = ((BigInt(a) % BigInt(m)) + BigInt(m)) % BigInt(m);
  for (let i = 0; i < e; i++) r = (r * b) % BigInt(m);
  return Number(r);
}
