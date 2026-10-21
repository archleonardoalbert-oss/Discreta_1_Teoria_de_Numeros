// Comprobaciones del contenido de las clases prácticas (libros/N/practica.js).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { existsSync } from 'node:fs';
import { MACROS, TRUST } from '../motor/macros.js';

const katex = createRequire(import.meta.url)('../vendor/katex/katex.min.js');
const formulas = (s) => [...s.matchAll(/\$\$([\s\S]+?)\$\$|\$([^$]+?)\$/g)].map((m) => ({ tex: m[1] ?? m[2], display: !!m[1] }));
const TIPOS = ['concepto', 'estrategia', 'arranque', 'desbloqueo'];
// Libros que ya tienen su clase práctica (se exige el archivo).
const CON_PRACTICA = ['1', '2'];
const NUM_EJERCICIOS = { 1: 8, 2: 8, 3: 8, 4: 9, 5: 9 };

const textos = (x) => [x.nombre, x.enunciado, x.nota, x.planteamiento?.texto, ...(x.planteamiento?.pasos ?? []).map((p) => p.texto),
  ...x.partes.flatMap((p) => [p.etiqueta, p.enunciado, ...p.pistas.map((q) => q.texto), ...p.solucion.pasos.map((s) => s.texto),
    p.aprendes.resultado, ...p.aprendes.ideas.flatMap((i) => [i.idea, i.texto])])].filter(Boolean);

for (const l of CON_PRACTICA) {
  test(`clase práctica ${l}: estructura, pistas, solución, «qué te llevas» y notación`, async () => {
    assert.ok(existsSync(new URL(`../libros/${l}/practica.js`, import.meta.url)), `falta libros/${l}/practica.js`);
    const { default: cp } = await import(`../libros/${l}/practica.js`);
    const libros = {};
    for (const n of ['1', '2', '3', '4', '5']) libros[n] = (await import(`../libros/${n}/contenido.js`)).default;
    assert.equal(cp.numero, Number(l));
    assert.ok(cp.fecha);
    assert.equal(cp.ejercicios.length, NUM_EJERCICIOS[l]);
    assert.deepEqual(cp.ejercicios.map((x) => x.numero), cp.ejercicios.map((_, i) => i + 1));
    assert.equal(new Set(cp.ejercicios.map((x) => x.id)).size, cp.ejercicios.length);
    for (const x of cp.ejercicios) {
      assert.match(x.id, new RegExp(`^cp${l}-\\d+$`));
      assert.ok(x.nombre && x.enunciado && x.partes.length, x.id);
      assert.ok(x.marcaEnunciado === undefined || x.marcaEnunciado === 'corregido', `${x.id}: marca`);
      if (x.planteamiento) {
        assert.ok(x.planteamiento.texto && x.planteamiento.pasos.length >= 2, `${x.id}: planteamiento`);
        assert.ok(existsSync(new URL(`../escenas/${x.planteamiento.escena}.js`, import.meta.url)), `${x.id}: falta ${x.planteamiento.escena}`);
      }
      assert.equal(new Set(x.partes.map((p) => p.id)).size, x.partes.length, `${x.id}: partes repetidas`);
      for (const p of x.partes) {
        const d = `${x.id}/${p.id}`;
        assert.ok(p.pistas.length >= 3, `${d}: menos de 3 pistas`);
        assert.ok(p.pistas.every((q) => TIPOS.includes(q.tipo) && q.texto), `${d}: tipo de pista`);
        assert.equal(p.pistas[0].tipo, 'concepto', `${d}: la primera pista no es el concepto`);
        assert.ok(p.pistas.slice(1).every((q) => q.tipo !== 'concepto'), `${d}: concepto repetido`);
        const enl = p.pistas[0].enlaces ?? [];
        assert.ok(enl.length >= 1 || x.sinConcepto, `${d}: la pista-concepto no enlaza a la conferencia`);
        for (const { l: lb, e } of p.pistas.flatMap((q) => q.enlaces ?? []))
          assert.ok(libros[String(lb)]?.elementos.some((y) => y.id === e), `${d}: enlace a ${lb}/${e} inexistente`);
        assert.ok(p.solucion.pasos.length >= 3, `${d}: solución corta`);
        assert.ok(p.solucion.pasos.every((s) => s.texto && (s.marca === undefined || ['corregido', 'añadido'].includes(s.marca))), `${d}: pasos`);
        if (p.solucion.escena) assert.ok(existsSync(new URL(`../escenas/${p.solucion.escena}.js`, import.meta.url)), `${d}: falta escena`);
        assert.ok(p.aprendes?.resultado && p.aprendes.ideas.length >= 2 && p.aprendes.ideas.every((i) => i.idea && i.texto), `${d}: qué te llevas`);
      }
      for (const s of textos(x)) {
        for (const f of formulas(s)) {
          assert.doesNotThrow(() => katex.renderToString(f.tex, { displayMode: f.display, throwOnError: true, macros: { ...MACROS }, trust: TRUST, strict: 'ignore' }), `${x.id}: ${f.tex}`);
          assert.ok(!/[/*∗]/.test(f.tex), `${x.id}: notación prohibida («/», «*» o «∗») en $${f.tex}$`);
          assert.ok(!/<[A-Za-z]/.test(f.tex), `${x.id}: «<» pegado a letra en $${f.tex}$`);
        }
        assert.ok(!/\d\s*\/\s*\d|\s\*\s|∗/.test(s.replace(/\$[^$]*\$/g, '').replace(/<\/?[a-z][^>]*>/g, '')), `${x.id}: «/» o «*» fuera de fórmulas: ${s.slice(0, 60)}`);
      }
    }
  });
}
