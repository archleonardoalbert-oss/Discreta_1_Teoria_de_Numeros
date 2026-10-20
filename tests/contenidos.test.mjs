// Comprobaciones de contenido comunes a todos los libros (I, IV, V y los ya hechos).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { existsSync, readdirSync } from 'node:fs';
import { MACROS, TRUST } from '../motor/macros.js';

const katex = createRequire(import.meta.url)('../vendor/katex/katex.min.js');
const formulas = (s) => [...s.matchAll(/\$\$([\s\S]+?)\$\$|\$([^$]+?)\$/g)].map((m) => ({ tex: m[1] ?? m[2], display: !!m[1] }));
const TIPOS = ['DEF', 'LEMA', 'TEO', 'COR', 'PROP', 'EJ', 'MET', 'PRIN'];
const ORDEN = {
  1: ['pbo', 'pim', 'teo-pbo-pim', 'ej-suma-impares', 'def-divide', 'lema-divisor-0', 'teo-divisor-menor', 'teo-transitiva',
    'teo-division', 'def-primo', 'cor-compuesto', 'lema-divisor-primo', 'teo-infinitos-primos'],
};

for (const l of readdirSync(new URL('../libros/', import.meta.url)).filter((d) => /^\d+$/.test(d))) {
  const { default: libro } = await import(`../libros/${l}/contenido.js`);
  test(`libro ${l}: estructura, escenas existentes y fórmulas KaTeX válidas`, () => {
    assert.equal(libro.numero, Number(l));
    if (ORDEN[l]) assert.deepEqual(libro.elementos.map((e) => e.id), ORDEN[l]);
    assert.equal(new Set(libro.elementos.map((e) => e.id)).size, libro.elementos.length, 'ids repetidos');
    for (const e of libro.elementos) {
      assert.ok(TIPOS.includes(e.tipo), `${e.id}: tipo ${e.tipo}`);
      assert.ok(e.nombre && e.enunciado && e.explicacion && e.pasos.length, e.id);
      assert.equal(e.escena, `${l}/${e.id}`);
      assert.ok(existsSync(new URL(`../escenas/${e.escena}.js`, import.meta.url)), `${e.id}: falta la escena`);
      for (const p of e.pasos) assert.ok(p.marca === undefined || ['corregido', 'añadido'].includes(p.marca), `${e.id}: marca`);
      for (const s of [e.nombre, e.enunciado, e.explicacion, ...e.pasos.map((p) => p.texto)])
        for (const f of formulas(s)) {
          assert.doesNotThrow(() => katex.renderToString(f.tex, { displayMode: f.display, throwOnError: true, macros: { ...MACROS }, trust: TRUST, strict: 'ignore' }), `${e.id}: ${f.tex}`);
          assert.ok(!/<[A-Za-z]/.test(f.tex), `${e.id}: «<» pegado a letra`);
        }
    }
  });
}

test('libro I: erratas corregidas y añadidos marcados', async () => {
  const { default: libro } = await import('../libros/1/contenido.js');
  const el = (id) => libro.elementos.find((x) => x.id === id), txt = JSON.stringify(libro);
  assert.ok(!txt.includes('demostar') && !txt.includes('estos es') && !txt.includes('un contradicción'));
  assert.ok(txt.includes('a - ab + b'), 'a − (a−1)b = a − ab + b');
  assert.equal(el('lema-divisor-0').marcaEnunciado, 'corregido');
  for (const id of ['pbo', 'pim', 'def-divide', 'def-primo']) assert.equal(el(id).pasosAñadidos, 'idea', id);
  for (const id of ['lema-divisor-0', 'teo-divisor-menor', 'cor-compuesto']) assert.equal(el(id).pasosAñadidos, 'demostracion', id);
  assert.ok(el('teo-pbo-pim').pasos.filter((p) => p.marca === 'añadido').length >= 4, 'falta PIM ⇒ PBO');
});
