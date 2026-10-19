// Nodos de escena: descripción pura de lo que se dibuja en un paso (ver interfaces del plan).

const igualA = (x, y) => {
  const kx = Object.keys(x), ky = Object.keys(y);
  return kx.length === ky.length && kx.every((k) => x[k] === y[k]);
};

/** Claves que «son nuevas» en este paso: no existían antes o cambiaron su texto o su geometría. */
export function marcarNuevos(previo, actual) {
  const antes = new Map((previo || []).map((n) => [n.k, n]));
  const nuevos = new Set();
  for (const n of actual) {
    if (n.fijo) continue;
    const p = antes.get(n.k);
    if (!p || p.txt !== n.txt || !igualA(p.a, n.a)) nuevos.add(n.k);
  }
  return nuevos;
}
