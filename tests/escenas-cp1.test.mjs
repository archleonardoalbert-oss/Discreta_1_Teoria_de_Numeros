// Escenas de la Clase práctica 1.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { teselar, colorear } from '../escenas/cp1/tablero-solucion.js';
import tablero from '../escenas/cp1/tablero-solucion.js';
import saltos from '../escenas/cp1/saltos-4-5.js';

test('cp1 tablero: la teselación cubre todo menos la casilla quitada, sin solapes, con piezas en L', () => {
  for (const [k, f, c] of [[1, 0, 1], [2, 3, 0], [3, 2, 5], [4, 15, 15]]) {
    const piezas = teselar(k, f, c), lado = 2 ** k, vistas = new Set();
    assert.equal(piezas.length, (lado * lado - 1) / 3);
    for (const p of piezas) {
      assert.equal(p.length, 3);
      const fs = p.map((x) => x[0]), cs = p.map((x) => x[1]);
      assert.ok(Math.max(...fs) - Math.min(...fs) === 1 && Math.max(...cs) - Math.min(...cs) === 1, `no es una L: ${JSON.stringify(p)}`);
      for (const [a, b] of p) { const s = `${a},${b}`; assert.ok(!vistas.has(s), `solape en ${s}`); vistas.add(s); }
    }
    assert.ok(!vistas.has(`${f},${c}`));
    assert.equal(vistas.size, lado * lado - 1);
  }
});

test('cp1 tablero: la escena tiene un estado por paso de la solución y valida la casilla', () => {
  assert.equal(tablero.capas, 7);
  assert.ok(tablero.validar({ k: 3, fila: 8, col: 0 }));
  assert.equal(tablero.validar({ k: 3, fila: 7, col: 0 }), null);
});

test('cp1 saltos de 4 y 5: marca como no alcanzables exactamente 1, 2, 3, 6, 7 y 11', () => {
  const nodos = saltos.estado({}, 2);
  const malos = nodos.filter((n) => n.k.startsWith('no:') && n.t === 'circle').map((n) => Number(n.k.slice(3))).sort((a, b) => a - b);
  assert.deepEqual(malos, [1, 2, 3, 6, 7, 11]);
});

test('cp1 tablero: dos piezas que se tocan nunca comparten color', () => {
  for (const [k, f, c] of [[2, 3, 0], [3, 2, 5], [4, 15, 15], [4, 0, 7]]) {
    const piezas = teselar(k, f, c), colores = colorear(piezas), de = new Map();
    piezas.forEach((p, i) => p.forEach(([a, b]) => de.set(`${a},${b}`, i)));
    piezas.forEach((p, i) => p.forEach(([a, b]) => [[1, 0], [0, 1]].forEach(([da, db]) => {
      const v = de.get(`${a + da},${b + db}`);
      if (v !== undefined && v !== i) assert.notEqual(colores[i], colores[v], `piezas ${i} y ${v}`);
    })));
  }
});
