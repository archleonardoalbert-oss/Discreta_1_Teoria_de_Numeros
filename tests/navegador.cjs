// Tests en navegador real (Chromium headless). Uso:
//   NODE_PATH=.superpowers/dev/node_modules CHROMIUM=$HOME/.cache/ms-playwright/chromium-1234/chrome-linux64/chrome node tests/navegador.cjs [filtro]
const { chromium } = require('playwright-core');
const { spawn } = require('node:child_process');
const path = require('node:path');

const RAIZ = path.resolve(__dirname, '..'), PUERTO = 8799, BASE = `http://127.0.0.1:${PUERTO}/`;
const FILTRO = process.argv[2] || '';
let ok = 0, mal = 0;
const pruebas = [];
const t = (nombre, fn) => pruebas.push({ nombre, fn });
const afirmar = (c, m) => { if (!c) throw new Error(m); };

// Abre una página y devuelve la lista (viva) de errores de consola/página.
const abrir = async (pg, ruta) => {
  const errores = [];
  pg.removeAllListeners('console'); pg.removeAllListeners('pageerror');
  pg.on('console', (m) => { if (m.type() === 'error') errores.push(m.text()); });
  pg.on('pageerror', (e) => errores.push(e.message));
  await pg.goto(BASE + ruta, { waitUntil: 'load' });
  await pg.evaluate(() => document.fonts.ready);
  return errores;
};

// ---------------------------------------------------------------- pruebas

t('sin internet: ninguna petición sale del servidor local y las fuentes cargan', async (b) => {
  const ctx = await b.newContext();
  const pg = await ctx.newPage();
  const externas = [];
  await pg.route('**/*', (r) => {
    const u = new URL(r.request().url());
    if (!['127.0.0.1', 'localhost'].includes(u.hostname)) { externas.push(u.href); return r.abort(); }
    return r.continue();
  });
  try {
    await pg.goto(BASE + 'index.html', { waitUntil: 'networkidle' });
    const cargadas = await pg.evaluate(async () => {
      await document.fonts.ready;
      return ['Lectura', 'JetBrains Mono'].filter((n) => [...document.fonts].some((f) => f.family.replace(/"/g, '') === n && f.status === 'loaded'));
    });
    afirmar(cargadas.length === 2, `fuentes cargadas: ${cargadas.join(', ') || 'ninguna'}`);
    afirmar(!externas.length, `peticiones externas: ${externas.join(', ')}`);
  } finally { await ctx.close(); }
});

t('pintar reconcilia por clave: A → B → A deja exactamente A, con «nuevo» solo en lo cambiado', async (b, pg) => {
  const errores = await abrir(pg, 'tests/paginas/svg.html');
  await pg.waitForFunction(() => window.listo);
  const A = [
    { k: 'eje', t: 'line', a: { x1: 10, y1: 100, x2: 390, y2: 100 }, c: 'tenue', fijo: true },
    { k: 'p', t: 'circle', a: { cx: 50, cy: 100, r: 5 }, c: 'ciruela' },
    { k: 'arco', t: 'path', a: { d: 'M 10 100 Q 30 60 50 100' }, c: 'cian' },
    { k: 'tx', t: 'text', a: { x: 50, y: 80 }, txt: 'a = 17', c: 'ciruela' },
  ];
  const B = [A[0], { ...A[1], a: { cx: 120, cy: 100, r: 5 } }, A[3], { k: 'nuevo', t: 'rect', a: { x: 5, y: 5, width: 20, height: 20 }, c: 'ambar' }];
  for (const estado of [A, B, A]) await pg.evaluate((e) => window.prueba(e), estado);
  await pg.waitForTimeout(1000);
  const dom = await pg.evaluate(() => [...document.querySelectorAll('#s [data-k]')].map((n) => ({ k: n.dataset.k, nuevo: n.classList.contains('nuevo') })));
  afirmar(JSON.stringify(dom.map((d) => d.k).sort()) === JSON.stringify(A.map((n) => n.k).sort()), `claves en el DOM: ${dom.map((d) => d.k)}`);
  const esperados = (await pg.evaluate(([x, y]) => window.nuevos(x, y), [B, A])).sort();
  const marcados = dom.filter((d) => d.nuevo).map((d) => d.k).sort();
  afirmar(JSON.stringify(marcados) === JSON.stringify(esperados), `nuevos ${marcados} ≠ esperados ${esperados}`);
  const cx = await pg.evaluate(() => getComputedStyle(document.querySelector('#s [data-k=p]')).cx);
  afirmar(cx === '50px', `el punto no volvió a cx=50 (cx=${cx})`);
  afirmar(await pg.evaluate(() => document.querySelector('#s [data-k=tx]').textContent) === 'a = 17', 'texto del rótulo');
  afirmar(!errores.length, errores.join(' | '));
});

// ---------------------------------------------------------------- ejecución

(async () => {
  const srv = spawn('python3', ['-m', 'http.server', String(PUERTO), '--bind', '127.0.0.1'], { cwd: RAIZ, stdio: 'ignore' });
  await new Promise((r) => setTimeout(r, 700));
  const b = await chromium.launch({ executablePath: process.env.CHROMIUM });
  try {
    for (const { nombre, fn } of pruebas) {
      if (FILTRO && !nombre.includes(FILTRO)) continue;
      const pg = await b.newPage({ viewport: { width: 1280, height: 900 } });
      try { await fn(b, pg); ok++; console.log('✓', nombre); }
      catch (e) { mal++; console.log('✗', nombre, '—', e.message.split('\n')[0]); }
      finally { await pg.close(); }
    }
  } finally {
    await b.close(); srv.kill();
    console.log(`\n${ok} bien, ${mal} mal`);
    process.exit(mal ? 1 : 0);
  }
})();

