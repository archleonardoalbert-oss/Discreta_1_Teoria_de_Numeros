// Renderiza páginas del proyecto a PNG (nunca la pantalla del usuario). Uso:
//   herramientas/ver.sh <ruta-relativa> <salida.png> [pasos-adelante] [ancho]
// CLICS='sel1,sel2' pulsa esos elementos antes de capturar (p. ej. pistas o «Ver solución» de un ejercicio).
const { chromium } = require('playwright-core');
const { spawn } = require('node:child_process');
const path = require('node:path');
const [ruta, salida, pasos = '0', ancho = '1280'] = process.argv.slice(2);
const RAIZ = path.resolve(__dirname, '..'), PUERTO = 8798;
(async () => {
  const srv = spawn('python3', ['-m', 'http.server', String(PUERTO), '--bind', '127.0.0.1'], { cwd: RAIZ, stdio: 'ignore' });
  await new Promise((r) => setTimeout(r, 600));
  const b = await chromium.launch({ executablePath: process.env.CHROMIUM });
  try {
    const pg = await b.newPage({ viewport: { width: Number(ancho), height: 900 }, deviceScaleFactor: 1 });
    pg.on('pageerror', (e) => console.log('error:', e.message));
    await pg.goto(`http://127.0.0.1:${PUERTO}/${ruta}`, { waitUntil: 'networkidle' });
    for (let i = 0; i < Number(pasos); i++) { await pg.click('[data-a=adelante]'); }
    for (const sel of (process.env.CLICS || '').split(',').filter(Boolean)) { await pg.click(sel); await pg.waitForTimeout(200); }
    await pg.waitForTimeout(900);
    await pg.screenshot({ path: salida, fullPage: true });
  } finally { await b.close(); srv.kill(); }
})();
