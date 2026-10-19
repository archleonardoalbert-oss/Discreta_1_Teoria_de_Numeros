// Aritmética de la Conferencia 2, escrita como en clase (Euclides por filas, tabla de coeficientes Aᵢ, Bᵢ).

const signo = (v) => (v < 0 ? -1 : 1);

/** a = b·q + r con 0 ≤ r < b (b > 0), también para a negativo. */
export function division(a, b) {
  const q = Math.floor(a / b);
  return { q, r: a - b * q };
}

/** mcd de cualquier cantidad de enteros (≥ 0; mcd(a, 0) = |a|). */
export function mcd(...ns) {
  return ns.reduce((x, y) => {
    x = Math.abs(x); y = Math.abs(y);
    while (y) [x, y] = [y, x % y];
    return x;
  }, 0);
}

export function mcm(a, b) {
  return Math.abs(a * b) / mcd(a, b);
}

/** Filas a = q·b + r hasta el resto 0 (la última fila tiene r = 0). */
export function euclides(a, b) {
  const filas = [];
  while (b !== 0) {
    const { q, r } = division(a, b);
    filas.push({ a, q, b, r });
    [a, b] = [b, r];
  }
  return { filas, mcd: Math.abs(a) };
}

/**
 * Coeficientes x, y con a·x + b·y = mcd(a, b) usando la tabla de la conferencia:
 * A₁ = 1, B₁ = −q_k, A_{i+1} = B_i, B_{i+1} = A_i − q_{k−i}·B_i  (k = índice del último resto no nulo).
 */
export function coeficientes(a, b) {
  let A = Math.abs(a), B = Math.abs(b);
  if (B === 0) return { pasos: [], x: signo(a), y: 0 };
  if (A === 0) return { pasos: [], x: 0, y: signo(b) };
  const cambio = A < B;
  if (cambio) [A, B] = [B, A];
  const filas = euclides(A, B).filas;
  const k = filas.length - 1;
  let x = 0, y = 1;                        // b | a: el mcd es b
  const pasos = [];
  if (k >= 1) {
    const q = (i) => filas[i - 1].q;       // q₁ … q_{k+1}, numerados como en clase
    let Ai = 1, Bi = -q(k);
    pasos.push({ i: 1, A: Ai, B: Bi, q: q(k) });
    for (let i = 1; i < k; i++) {
      [Ai, Bi] = [Bi, Ai - q(k - i) * Bi];
      pasos.push({ i: i + 1, A: Ai, B: Bi, q: q(k - i) });
    }
    [x, y] = [Ai, Bi];
  }
  if (cambio) [x, y] = [y, x];
  return { pasos, x: x * signo(a), y: y * signo(b) };
}

/** Una solución de a·x + b·y = c y los pasos de la solución general, o null si mcd(a, b) ∤ c. */
export function diofantica(a, b, c) {
  const d = mcd(a, b);
  if (d === 0 || c % d !== 0) return null;
  const { x, y } = coeficientes(a, b), k = c / d;
  return { x0: x * k, y0: y * k, d, pasoX: b / d, pasoY: a / d };
}

/** Menor combinación lineal positiva de ns con coeficientes en [−radio, radio] (búsqueda exhaustiva). */
export function menorCombinacionPositiva(ns, radio) {
  let mejor = null;
  const coefs = ns.map(() => -radio);
  for (;;) {
    const v = coefs.reduce((s, x, i) => s + x * ns[i], 0);
    if (v > 0 && (!mejor || v < mejor.valor)) mejor = { valor: v, coefs: [...coefs] };
    let i = 0;
    while (i < coefs.length && coefs[i] === radio) coefs[i++] = -radio;
    if (i === coefs.length) return mejor;
    coefs[i]++;
  }
}

/** Divisores positivos de n (n ≠ 0), en orden creciente. */
export function divisores(n) {
  n = Math.abs(n);
  const bajos = [], altos = [];
  for (let d = 1; d * d <= n; d++) if (n % d === 0) { bajos.push(d); if (d * d !== n) altos.unshift(n / d); }
  return [...bajos, ...altos];
}

/** mcd de n números y coeficientes exactos con Σ coefs[i]·ns[i] = mcd (combinando de dos en dos). */
export function combinacionMcd(ns) {
  let d = 0, coefs = [];
  for (const v of ns) {
    const { x, y } = coeficientes(d, v);
    coefs = [...coefs.map((c) => c * x), y];
    d = mcd(d, v);
  }
  return { d, coefs };
}
