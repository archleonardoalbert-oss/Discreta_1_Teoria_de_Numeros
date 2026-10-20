import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import libro from '../libros/3/contenido.js';
import { MACROS, TRUST } from '../motor/macros.js';

const katex = createRequire(import.meta.url)('../vendor/katex/katex.min.js');
const IDS = ['lema-p-no-divide', 'lema-euclides', 'teo-primo-producto', 'cor-primos', 'cor-potencia', 'teo-fundamental',
  'def-canonica', 'cor-canonica', 'lema-6q', 'teo-wilson', 'teo-fermat', 'cor-fermat', 'lema-compuestos'];
const formulas = (s) => [...s.matchAll(/\$\$([\s\S]+?)\$\$|\$([^$]+?)\$/g)].map((m) => ({ tex: m[1] ?? m[2], display: !!m[1] }));

test('el libro III tiene los 13 elementos en el orden de la conferencia', () => {
  assert.equal(libro.numero, 3);
  assert.deepEqual(libro.elementos.map((e) => e.id), IDS);
  for (const e of libro.elementos) {
    assert.equal(e.escena, `3/${e.id}`);
    assert.ok(e.enunciado && e.explicacion && e.pasos.length, e.id);
  }
});

test('todas las fórmulas del libro III compilan en KaTeX', () => {
  for (const e of libro.elementos)
    for (const s of [e.nombre, e.enunciado, e.explicacion, ...e.pasos.map((p) => p.texto)])
      for (const f of formulas(s)) {
        assert.doesNotThrow(() => katex.renderToString(f.tex, { displayMode: f.display, throwOnError: true, macros: { ...MACROS }, trust: TRUST, strict: 'ignore' }), `${e.id}: ${f.tex}`);
        assert.ok(!/<[A-Za-z]/.test(f.tex), `${e.id}: «<» pegado a letra`);
      }
});

test('erratas corregidas y demostraciones añadidas marcadas', () => {
  const el = (id) => libro.elementos.find((x) => x.id === id);
  assert.ok(!JSON.stringify(libro).includes('su parte su parte'));
  for (const id of ['lema-p-no-divide', 'cor-primos', 'cor-canonica', 'teo-wilson', 'teo-fermat']) assert.equal(el(id).pasosAñadidos, 'demostracion', id);
});
