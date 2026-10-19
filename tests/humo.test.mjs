import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

test('el lanzador sirve la portada y KaTeX', async () => {
  const p = spawn(path.join(RAIZ, 'abrir-biblioteca'), ['--sin-abrir'], { cwd: '/' });
  try {
    const url = await new Promise((ok, mal) => {
      p.stdout.on('data', (d) => { const m = String(d).match(/http:\/\/localhost:\d+\//); if (m) ok(m[0]); });
      p.on('error', mal); p.on('exit', (c) => mal(new Error('el lanzador terminó con ' + c)));
      setTimeout(() => mal(new Error('el lanzador no imprimió la URL')), 5000);
    });
    for (const r of ['', 'vendor/katex/katex.min.js', 'vendor/fuentes/fuentes.css']) {
      const res = await fetch(url + r);
      assert.equal(res.status, 200, r || '/');
    }
  } finally { p.kill(); }
});
