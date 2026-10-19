// Escala de la recta numérica: de valores a píxeles, marcas «redondas» y agrupación de saltos.

export const r1 = (v) => Math.round(v * 10) / 10;

/** Plan de una recta horizontal que muestra [min, max] en `ancho` píxeles. */
export function planRecta({ min, max, ancho, margen = 24 }) {
  const escala = (ancho - 2 * margen) / (max - min || 1);
  const x = (v) => r1(margen + (v - min) * escala);
  // separación mínima entre marcas: 40 px o el ancho del número más largo que se rotularía
  const anchoTexto = (s) => Math.max(String(Math.ceil(min / s) * s).length, String(Math.floor(max / s) * s).length) * 8 + 12;
  let paso = 1;
  for (let p = 1; ; p *= 10) {
    const c = [1, 2, 5].map((m) => m * p).find((s) => s * escala >= Math.max(40, anchoTexto(s)));
    if (c) { paso = c; break; }
  }
  const marcas = [];
  for (let m = Math.ceil(min / paso) * paso; m <= max; m += paso) marcas.push(m);
  return { min, max, ancho, escala, x, marcas };
}

/** Menor g tal que g saltos de longitudPx ocupan al menos minPx (sin pasar de n saltos). */
export function agrupar(longitudPx, n, minPx = 18) {
  const g = Math.max(1, Math.ceil(minPx / longitudPx));
  return Math.min(g, Math.max(1, Math.abs(n)));
}
