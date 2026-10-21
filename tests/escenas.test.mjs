// Test genérico de escenas, válido para cualquier libro: para cada elemento cuya escena ya existe.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const libros = readdirSync(path.join(RAIZ, 'libros')).filter((d) => /^\d+$/.test(d));
const azar = (semilla) => () => ((semilla = (semilla * 1103515245 + 12345) % 2147483648) / 2147483648);

// Caja de un nodo para comprobar que cabe en la vista.
function puntos(n) {
  const a = n.a;
  if (n.t === 'path') { const v = a.d.match(/-?\d+(\.\d+)?/g).map(Number); return v.flatMap((x, i) => (i % 2 ? [] : [[x, v[i + 1]]])); }
  if (n.t === 'line') return [[a.x1, a.y1], [a.x2, a.y2]];
  if (n.t === 'circle') return [[a.cx - a.r, a.cy - a.r], [a.cx + a.r, a.cy + a.r]];
  if (n.t === 'rect') return [[a.x, a.y], [a.x + a.width, a.y + a.height]];
  return [[a.x, a.y]];
}

function entradasAzar(entradas, r) {
  const e = {};
  for (const ent of entradas) {
    const uno = () => ent.min + Math.floor(r() * (ent.max - ent.min + 1));
    e[ent.id] = ent.lista ? Array.from({ length: ent.lista.min + Math.floor(r() * (ent.lista.max - ent.lista.min + 1)) }, uno) : uno();
  }
  return e;
}

/** Una escena con su lista de pasos: pura, sin claves repetidas y dentro de la vista con entradas por defecto y al azar. */
function probarEscena(ruta, pasos, semilla) {
  const archivo = path.join(RAIZ, 'escenas', `${ruta}.js`);
  if (!existsSync(archivo)) return;
  const el = { pasos, id: semilla };
    test(`escena ${ruta}: pura, sin solapes de clave, dentro de la vista, en todos los pasos`, async () => {
      const { default: esc } = await import(archivo);
      if (esc.capas !== undefined) assert.equal(esc.capas, el.pasos.length, 'capas ≠ pasos del contenido');
      const porDefecto = Object.fromEntries(esc.entradas.map((x) => [x.id, x.valor]));
      assert.equal(esc.validar(porDefecto), null, 'los valores por defecto no validan');
      const r = azar(el.id.length * 7919);
      const casos = [porDefecto];
      for (let i = 0; casos.length < 21 && i < 400; i++) { const e = entradasAzar(esc.entradas, r); if (esc.validar(e) === null) casos.push(e); }
      for (const e of casos) {
        const { ancho, alto } = esc.vista(e);
        for (let i = 0; i < el.pasos.length; i++) {
          const ns = esc.estado(e, i);
          const ks = ns.map((n) => n.k);
          assert.equal(new Set(ks).size, ks.length, `claves repetidas (${JSON.stringify(e)}, paso ${i})`);
          assert.deepEqual(esc.estado(e, i), ns, 'no determinista');
          for (const n of ns.filter((n) => n.t === 'text')) {
            const w = [...n.txt].length * 7.8, x = n.a.x, anc = n.a['text-anchor'] ?? 'start';
            const [x0, x1] = anc === 'middle' ? [x - w / 2, x + w / 2] : anc === 'end' ? [x - w, x] : [x, x + w];
            assert.ok(x0 >= -4 && x1 <= ancho + 4, `texto ${n.k} «${n.txt}» se sale (${Math.round(x0)}…${Math.round(x1)} de ${ancho}) con ${JSON.stringify(e)} paso ${i}`);
          }
          for (const n of ns) for (const [x, y] of puntos(n))
            assert.ok(x >= -30 && x <= ancho + 30 && y >= -30 && y <= alto + 30, `${n.k} fuera de la vista (${x}, ${y}) con ${JSON.stringify(e)} paso ${i}`);
          assert.ok(ns.filter((n) => n.t === 'path').length <= 400, 'demasiados arcos');
        }
      }
    });
}

for (const l of libros) {
  const { default: libro } = await import(`../libros/${l}/contenido.js`);
  for (const el of libro.elementos) probarEscena(el.escena, el.pasos, el.id);
  // las escenas de la clase práctica: planteamientos y soluciones
  if (!existsSync(path.join(RAIZ, 'libros', l, 'practica.js'))) continue;
  const { default: cp } = await import(`../libros/${l}/practica.js`);
  for (const x of cp.ejercicios) {
    if (x.planteamiento) probarEscena(x.planteamiento.escena, x.planteamiento.pasos, `${x.id}-plan`);
    for (const p of x.partes) if (p.solucion.escena) probarEscena(p.solucion.escena, p.solucion.pasos, `${x.id}-${p.id}`);
  }
}
