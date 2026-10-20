// Cámara: anima el viewBox del svg hacia una ventana [x, y, ancho, alto] con la curva «smooth».
const curva = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
const animaciones = new WeakMap();

export function moverCamara(svg, destino, ms) {
  cancelAnimationFrame(animaciones.get(svg));
  const origen = (svg.getAttribute('viewBox') || destino.join(' ')).split(/\s+/).map(Number);
  if (!ms || origen.every((v, i) => v === destino[i])) { svg.setAttribute('viewBox', destino.join(' ')); return; }
  const t0 = performance.now();
  const paso = (ahora) => {
    const t = Math.min(1, (ahora - t0) / ms), k = curva(t);
    svg.setAttribute('viewBox', origen.map((v, i) => +(v + (destino[i] - v) * k).toFixed(2)).join(' '));
    if (t < 1) animaciones.set(svg, requestAnimationFrame(paso));
  };
  animaciones.set(svg, requestAnimationFrame(paso));
}
