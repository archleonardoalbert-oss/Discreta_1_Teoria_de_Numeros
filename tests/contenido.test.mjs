import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import libro from '../libros/2/contenido.js';
import { MACROS } from '../motor/macros.js';

const katex = createRequire(import.meta.url)('../vendor/katex/katex.min.js');
const IDS = ['def-mcd', 'prop-signos', 'teo-divide-mcd', 'def-primos-relativos', 'def-combinacion-lineal',
  'teo-menor-combinacion', 'teo-divisores-comunes', 'cor-mcd-n', 'cor-cocientes-coprimos', 'teo-divide-producto',
  'cor-mcd-resto', 'def-diofantica', 'teo-diofantica-solucion', 'teo-euclides', 'ej-euclides-3088', 'teo-coeficientes',
  'ej-coeficientes-3088', 'teo-solucion-general', 'def-mcm', 'teo-multiplos-comunes', 'cor-mcm-mcd', 'cor-multiplo-mcm'];

// Trozos de matemáticas de un texto: $$…$$ y $…$.
const formulas = (s) => [...s.matchAll(/\$\$([\s\S]+?)\$\$|\$([^$]+?)\$/g)].map((m) => ({ tex: m[1] ?? m[2], display: !!m[1] }));
const textos = (el) => [el.nombre, el.enunciado, el.explicacion, ...el.pasos.map((p) => p.texto)];

test('el libro II tiene los 22 elementos en el orden de la conferencia', () => {
  assert.deepEqual(libro.elementos.map((e) => e.id), IDS);
  assert.equal(libro.numero, 2);
});

test('cada elemento tiene enunciado, explicación, pasos y escena', () => {
  for (const e of libro.elementos) {
    assert.ok(e.enunciado && e.explicacion && e.nombre, e.id);
    assert.ok(e.pasos.length >= 1, `${e.id}: sin pasos`);
    assert.equal(e.escena, `2/${e.id}`);
    assert.ok(['DEF', 'LEMA', 'TEO', 'COR', 'PROP', 'EJ', 'MET'].includes(e.tipo), `${e.id}: tipo ${e.tipo}`);
    for (const p of e.pasos) assert.ok(p.marca === undefined || ['corregido', 'añadido'].includes(p.marca), `${e.id}: marca ${p.marca}`);
    assert.ok(e.pasosAñadidos === undefined || ['idea', 'demostracion'].includes(e.pasosAñadidos), `${e.id}: pasosAñadidos`);
  }
});

test('todas las fórmulas compilan en KaTeX y no tienen «<» pegado a una letra', () => {
  for (const e of libro.elementos)
    for (const s of textos(e))
      for (const f of formulas(s)) {
        assert.doesNotThrow(() => katex.renderToString(f.tex, { displayMode: f.display, throwOnError: true, macros: { ...MACROS } }), `${e.id}: ${f.tex}`);
        assert.ok(!/<[A-Za-z]/.test(f.tex), `${e.id}: «<» pegado a letra en ${f.tex}`);
      }
});

test('los números de los ejemplos son los de la conferencia', () => {
  const ej = (id) => libro.elementos.find((e) => e.id === id).pasos.map((p) => p.texto).join(' ');
  assert.ok(ej('ej-coeficientes-3088').includes('-22') && ej('ej-coeficientes-3088').includes('149'));
  assert.ok(ej('ej-euclides-3088').includes('16 = 2 * 8 + 0'));
});

test('las erratas detectadas están corregidas y marcadas', () => {
  const el = (id) => libro.elementos.find((e) => e.id === id);
  assert.ok(el('def-combinacion-lineal').enunciado.includes('a_n * b_n') && el('def-combinacion-lineal').marcaEnunciado === 'corregido');
  assert.ok(!el('def-mcm').enunciado.includes('de de') && el('def-mcm').marcaEnunciado === 'corregido');
  assert.ok(!/comúnes/.test(JSON.stringify(libro)));
});

test('el enunciado de Euclides tiene todas las filas del PDF', () => {
  const e = libro.elementos.find((x) => x.id === 'teo-euclides').enunciado;
  assert.ok(e.includes('r_2 &= q_4 * r_3 + r_4'), 'falta r₂ = q₄*r₃ + r₄');
});

test('la demostración añadida de cor-multiplo-mcm cubre a y b con signo', () => {
  const t = libro.elementos.find((x) => x.id === 'cor-multiplo-mcm').pasos.map((p) => p.texto).join(' ');
  assert.ok(t.includes('|a|') && t.includes('|b|'), t);
});
