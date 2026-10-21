// Renderiza solo la escena (SVG) de un elemento en varios pasos, sin animación. Nunca la pantalla del usuario. Uso:
//   herramientas/escena.sh 'elemento.html?l=1&e=pbo' /ruta/prefijo 0,2,4   → prefijo-0.png, prefijo-2.png, …
// En una página de ejercicio: AMBITO='.parte[data-p=x]' PRE='.parte[data-p=x] [data-a=solucion]' para la escena de una solución.
const { chromium } = require('playwright-core');
const { spawn } = require('node:child_process');
const path = require('node:path');
const [ruta, prefijo, pasos = '0'] = process.argv.slice(2);
const RAIZ = path.resolve(__dirname, '..'), PUERTO = 8797;
(async () => {
  const srv = spawn('python3', ['-m', 'http.server', String(PUERTO), '--bind', '127.0.0.1'], { cwd: RAIZ, stdio: 'ignore' });
  await new Promise((r) => setTimeout(r, 600));
  const b = await chromium.launch({ executablePath: process.env.CHROMIUM });
  try {
    const pg = await b.newPage({ viewport: { width: 1400, height: 1000 }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
    pg.on('pageerror', (e) => console.log('error:', e.message));
    pg.on('console', (m) => { if (m.type() === 'error') console.log('consola:', m.text()); });
    await pg.goto(`http://127.0.0.1:${PUERTO}/${ruta}`, { waitUntil: 'networkidle' });
    const ambito = process.env.AMBITO ? `${process.env.AMBITO} ` : '';
    for (const sel of (process.env.PRE || '').split(',').filter(Boolean)) { await pg.click(sel); await pg.waitForTimeout(300); }
    let actual = 0;
    for (const p of pasos.split(',').map(Number)) {
      while (actual < p) { await pg.click(`${ambito}[data-a=adelante]`); actual++; }
      await pg.waitForTimeout(250);
      await pg.locator(`${ambito}.escena svg`).first().screenshot({ path: `${prefijo}-${p}.png` });
    }
  } finally { await b.close(); srv.kill(); }
})();
