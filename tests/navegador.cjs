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
  await pg.evaluate(() => window.prueba([{ k: 'grueso', t: 'line', a: { x1: 0, y1: 0, x2: 10, y2: 0 }, c: 'ambar', ancho: 4 }]));
  const grosor = await pg.evaluate(() => getComputedStyle(document.querySelector('#s [data-k=grueso]')).strokeWidth);
  afirmar(grosor === '4px', `ancho del trazo: ${grosor}`);
  afirmar(!errores.length, errores.join(' | '));
});

t('pintar: «ref» enciende una pieza anterior y «supuesto» la dibuja punteada', async (b, pg) => {
  await abrir(pg, 'tests/paginas/svg.html');
  await pg.waitForFunction(() => window.listo);
  await pg.evaluate(() => window.prueba([{ k: 'r', t: 'line', a: { x1: 0, y1: 10, x2: 50, y2: 10 }, c: 'ambar' }]));
  await pg.evaluate(() => window.prueba([
    { k: 'r', t: 'line', a: { x1: 0, y1: 10, x2: 50, y2: 10 }, c: 'ambar', ref: true },
    { k: 'h', t: 'line', a: { x1: 0, y1: 30, x2: 50, y2: 30 }, c: 'ambar', supuesto: true },
  ]));
  await pg.waitForTimeout(1100);
  const r = await pg.evaluate(() => { const el = document.querySelector('#s [data-k=r]'); return { ref: el.classList.contains('ref'), op: getComputedStyle(el).opacity }; });
  afirmar(r.ref && r.op === '1', `ref: ${JSON.stringify(r)}`);
  const dash = await pg.evaluate(() => getComputedStyle(document.querySelector('#s [data-k=h]')).strokeDasharray);
  afirmar(dash && dash !== 'none' && dash !== '1px' && dash !== '1', `supuesto sin punteado: ${dash}`);
});

const FIX = 'elemento.html?base=tests/paginas/&l=0&e=division';
const cuenta = (pg) => pg.textContent('.cuenta');
const montada = (pg) => pg.waitForFunction(() => document.querySelector('.escena svg [data-k]'));

t('cinemática: lo que nace «desde» otra pieza parte de su posición y llega a la suya', async (b, pg) => {
  await abrir(pg, 'tests/paginas/svg.html');
  await pg.waitForFunction(() => window.listo);
  await pg.evaluate(() => window.prueba([{ k: 'src', t: 'circle', a: { cx: 20, cy: 20, r: 6 }, c: 'cian' }]));
  const inicial = await pg.evaluate(() => {
    window.prueba([{ k: 'src', t: 'circle', a: { cx: 20, cy: 20, r: 6 }, c: 'cian' }, { k: 'hijo', t: 'rect', a: { x: 200, y: 100, width: 30, height: 30 }, c: 'ambar', desde: 'src' }]);
    return document.querySelector('#s [data-k=hijo]').style.transform;
  });
  afirmar(inicial.includes('translate'), `no parte de la pieza origen: «${inicial}»`);
  await pg.waitForTimeout(1500);
  const final = await pg.evaluate(() => getComputedStyle(document.querySelector('#s [data-k=hijo]')).transform);
  afirmar(final === 'none', `no llegó a su sitio: ${final}`);
});

t('cinemática: las piezas nuevas aparecen escalonadas (a mitad, las primeras ya se ven más que las últimas)', async (b, pg) => {
  await abrir(pg, 'tests/paginas/svg.html');
  await pg.waitForFunction(() => window.listo);
  await pg.evaluate(() => window.prueba([{ k: 'base', t: 'circle', a: { cx: 5, cy: 5, r: 2 }, c: 'tenue' }]));
  await pg.evaluate(() => window.prueba([{ k: 'base', t: 'circle', a: { cx: 5, cy: 5, r: 2 }, c: 'tenue' },
    ...Array.from({ length: 20 }, (_, i) => ({ k: `n${i}`, t: 'circle', a: { cx: 20 + 15 * i, cy: 20, r: 5 }, c: 'cian' }))]));
  await pg.waitForTimeout(300);
  const [primera, ultima] = await pg.evaluate(() => ['n0', 'n19'].map((k) => Number(getComputedStyle(document.querySelector(`#s [data-k=${k}]`)).opacity)));
  afirmar(primera > ultima + 0.1, `opacidades a los 300 ms: n0 ${primera}, n19 ${ultima}`);
});

t('cinemática: «orden» agrupa la entrada por significado (los del mismo orden a la vez)', async (b, pg) => {
  await abrir(pg, 'tests/paginas/svg.html');
  await pg.waitForFunction(() => window.listo);
  await pg.evaluate(() => window.prueba([{ k: 'base', t: 'circle', a: { cx: 5, cy: 5, r: 2 }, c: 'tenue' }]));
  await pg.evaluate(() => window.prueba([{ k: 'base', t: 'circle', a: { cx: 5, cy: 5, r: 2 }, c: 'tenue' },
    { k: 'a1', t: 'circle', a: { cx: 20, cy: 20, r: 5 }, c: 'cian', orden: 0 }, { k: 'a2', t: 'circle', a: { cx: 40, cy: 20, r: 5 }, c: 'cian', orden: 0 },
    { k: 'b1', t: 'circle', a: { cx: 60, cy: 20, r: 5 }, c: 'cian', orden: 3 }]));
  await pg.waitForTimeout(250);
  const [a1, a2, b1] = await pg.evaluate(() => ['a1', 'a2', 'b1'].map((k) => Number(getComputedStyle(document.querySelector(`#s [data-k=${k}]`)).opacity)));
  afirmar(Math.abs(a1 - a2) < 0.05 && a1 > b1 + 0.1, `a1 ${a1}, a2 ${a2}, b1 ${b1}`);
});

t('cinemática: lo reiluminado late una vez', async (b, pg) => {
  await abrir(pg, 'tests/paginas/svg.html');
  await pg.waitForFunction(() => window.listo);
  await pg.evaluate(() => window.prueba([{ k: 'r', t: 'circle', a: { cx: 20, cy: 20, r: 6 }, c: 'ambar' }]));
  await pg.evaluate(() => window.prueba([{ k: 'r', t: 'circle', a: { cx: 20, cy: 20, r: 6 }, c: 'ambar', ref: true }]));
  const anim = await pg.evaluate(() => getComputedStyle(document.querySelector('#s [data-k=r]')).animationName);
  afirmar(anim === 'pulso', `animación: ${anim}`);
});

t('cinemática: la cámara hace zoom a lo que pide el paso', async (b, pg) => {
  await abrir(pg, FIX); await montada(pg);
  await pg.click('[data-a=adelante]'); await pg.click('[data-a=adelante]');
  await pg.waitForTimeout(1500);
  const vb = await pg.evaluate(() => document.querySelector('.escena svg').getAttribute('viewBox'));
  afirmar(vb === '200 60 440 140', `viewBox ${vb}`);
});

t('elemento: ◀ ▶, teclado y clic en una línea mueven el paso', async (b, pg) => {
  const errores = await abrir(pg, FIX); await montada(pg);
  afirmar((await cuenta(pg)) === '1/3', `inicio ${await cuenta(pg)}`);
  await pg.click('[data-a=adelante]');
  afirmar((await cuenta(pg)) === '2/3', 'adelante');
  afirmar(await pg.evaluate(() => document.querySelectorAll('ol.pasos > li')[1].classList.contains('actual')), 'li 2 no es actual');
  await pg.keyboard.press('ArrowLeft');
  afirmar((await cuenta(pg)) === '1/3', '← no retrocedió');
  await pg.click('ol.pasos > li:nth-child(3)');
  afirmar((await cuenta(pg)) === '3/3', 'clic en la línea 3');
  await pg.click('[data-a=inicio]');
  afirmar((await cuenta(pg)) === '1/3', 'inicio');
  afirmar(!errores.length, errores.join(' | '));
});

t('elemento: la vista de tira muestra todos los pasos y lleva al elegido', async (b, pg) => {
  const errores = await abrir(pg, FIX); await montada(pg);
  await pg.click('[data-a=tira]');
  afirmar((await pg.locator('.tira .miniatura').count()) === 3, 'no hay 3 miniaturas');
  afirmar((await pg.locator('.tira .miniatura svg [data-k]').count()) > 0, 'miniaturas vacías');
  await pg.click('.tira .miniatura:nth-child(3)');
  afirmar((await cuenta(pg)) === '3/3', `tras clic: ${await cuenta(pg)}`);
  afirmar(!(await pg.isVisible('.tira')), 'la tira no se cerró');
  await pg.click('[data-a=tira]'); await pg.keyboard.press('Escape');
  afirmar(!(await pg.isVisible('.tira')), 'Esc no cierra la tira');
  afirmar(!errores.length, errores.join(' | '));
});

t('elemento: la r de la demostración tiene el color del resto', async (b, pg) => {
  await abrir(pg, 'elemento.html?l=2&e=cor-mcd-resto'); await montada(pg);
  const color = await pg.evaluate(() => { const el = document.querySelector('ol.pasos .k-ambar'); return el && getComputedStyle(el).color; });
  const ambar = await pg.evaluate(() => { const d = document.createElement('i'); d.style.color = 'var(--ambar)'; document.body.append(d); return getComputedStyle(d).color; });
  afirmar(color === ambar, `color de r: ${color} (ámbar ${ambar})`);
});

t('contraste: los textos de pasos anteriores siguen legibles y el gris tenue llega a AA', async (b, pg) => {
  await abrir(pg, 'elemento.html?l=2&e=def-mcd'); await montada(pg);
  await pg.click('[data-a=adelante]'); await pg.waitForTimeout(700);
  const op = await pg.evaluate(() => getComputedStyle(document.querySelector('.escena svg text.hecho')).opacity);
  afirmar(Number(op) >= 0.85, `opacidad de texto hecho: ${op}`);
  const tenue = await pg.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--tenue').trim());
  afirmar(tenue === '#737890', `--tenue = ${tenue}`);
});

t('KaTeX no llena la consola de avisos por los colores', async (b, pg) => {
  const avisos = [];
  pg.on('console', (m) => { if (m.type() === 'warning') avisos.push(m.text()); });
  await pg.goto(BASE + 'elemento.html?l=2&e=cor-mcd-resto', { waitUntil: 'load' }); await montada(pg);
  afirmar(!avisos.length, `avisos: ${avisos.slice(0, 2).join(' | ')}`);
});

t('elemento: cambiar una entrada a mitad de la demostración conserva el paso', async (b, pg) => {
  await abrir(pg, FIX); await montada(pg);
  await pg.click('[data-a=adelante]');
  await pg.fill('.entradas input[data-id=a]', '23');
  afirmar((await cuenta(pg)) === '2/3', `paso tras editar: ${await cuenta(pg)}`);
  await pg.waitForTimeout(700);
  afirmar((await pg.textContent('.escena svg')).includes('23'), 'la escena no muestra 23');
});

t('elemento: entradas no válidas avisan y no tocan la escena', async (b, pg) => {
  const errores = await abrir(pg, FIX); await montada(pg);
  await pg.waitForTimeout(700);
  const antes = await pg.innerHTML('.escena svg');
  for (const v of ['0', '-3', '2.5', 'abc', '']) {
    await pg.fill('.entradas input[data-id=b]', v);
    afirmar(await pg.isVisible('.aviso'), `sin aviso para «${v}»`);
    afirmar((await pg.innerHTML('.escena svg')) === antes, `la escena cambió con «${v}»`);
  }
  await pg.fill('.entradas input[data-id=b]', '5');
  afirmar(!(await pg.isVisible('.aviso')), 'el aviso no se fue al volver a un valor válido');
  afirmar(!errores.length, errores.join(' | '));
});

t('elemento: en pantalla estrecha se apila sin scroll horizontal', async (b, pg) => {
  await pg.setViewportSize({ width: 400, height: 800 });
  await abrir(pg, FIX); await montada(pg);
  const ancho = await pg.evaluate(() => document.documentElement.scrollWidth);
  afirmar(ancho <= 400, `scrollWidth ${ancho}`);
  afirmar(await pg.isVisible('.escena svg'), 'escena invisible');
  const anchoSvg = await pg.evaluate(() => document.querySelector('.escena svg').getBoundingClientRect().width);
  afirmar(anchoSvg >= 560, `la escena se encoge hasta ser ilegible (${anchoSvg}px)`);
});

t('elemento: con movimiento reducido las transiciones son instantáneas', async (b, pg) => {
  await pg.emulateMedia({ reducedMotion: 'reduce' });
  await abrir(pg, FIX); await montada(pg);
  const t = await pg.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--t-paso').trim());
  afirmar(t === '0s', `--t-paso = ${t}`);
});

t('portada: 5 libros de frente y se abren los disponibles', async (b, pg) => {
  const { catalogo } = await import(path.join(RAIZ, 'libros', 'catalogo.js'));
  const esperados = catalogo.filter((l) => l.disponible).map((l) => `libro.html?l=${l.numero}`);
  const errores = await abrir(pg, 'index.html');
  await pg.waitForSelector('.portada');
  afirmar((await pg.locator('.portada').count()) === 5, 'no hay 5 portadas');
  const enlaces = await pg.$$eval('a.portada', (as) => as.map((a) => a.getAttribute('href')));
  afirmar(JSON.stringify(enlaces) === JSON.stringify(esperados), `enlaces: ${enlaces}`);
  afirmar((await pg.locator('.portada svg').count()) === 5, 'faltan ilustraciones');
  afirmar(!errores.length, errores.join(' | '));
});

t('índice de libro: lista los elementos con su tipo y enlaza a cada página', async (b, pg) => {
  const errores = await abrir(pg, 'libro.html?base=tests/paginas/&l=0');
  await pg.waitForSelector('#raiz > ol.indice-libro a');
  const hrefs = await pg.$$eval('#raiz > ol.indice-libro a', (as) => as.map((a) => a.getAttribute('href')));
  afirmar(JSON.stringify(hrefs) === JSON.stringify(['elemento.html?base=tests/paginas/&l=0&e=division']), `hrefs: ${hrefs}`);
  afirmar((await pg.textContent('#raiz > ol.indice-libro')).includes('Teorema'), 'sin etiqueta de tipo');
  afirmar(!errores.length, errores.join(' | '));
});

t('el Libro II lista sus 22 elementos en orden', async (b, pg) => {
  await abrir(pg, 'libro.html?l=2');
  await pg.waitForSelector('#raiz > ol.indice-libro a');
  const ids = await pg.$$eval('#raiz > ol.indice-libro a', (as) => as.map((a) => new URL(a.href).searchParams.get('e')));
  afirmar(ids.length === 22, `hay ${ids.length}`);
  afirmar(ids[0] === 'def-mcd' && ids[21] === 'cor-multiplo-mcm', `orden: ${ids[0]} … ${ids[21]}`);
});

t('elemento: el resaltado de un paso es el mismo llegando con ▶, con ◀ o saltando con clic', async (b, pg) => {
  await abrir(pg, 'elemento.html?l=2&e=def-mcd'); await montada(pg);
  const nuevos = () => pg.evaluate(() => [...document.querySelectorAll('.escena svg .nuevo:not(.sale)')].map((n) => n.dataset.k).sort().join());
  await pg.click('[data-a=adelante]'); await pg.click('[data-a=adelante]');
  const yendo = await nuevos();
  await pg.click('[data-a=adelante]'); await pg.click('[data-a=atras]');
  afirmar((await nuevos()) === yendo, 'al volver con ◀ el resaltado cambia');
  await pg.click('[data-a=inicio]'); await pg.click('ol.pasos > li:nth-child(3)');
  afirmar((await nuevos()) === yendo, 'al saltar con clic el resaltado cambia');
});

t('elemento: la leyenda explica solo los colores que hay en la escena', async (b, pg) => {
  await abrir(pg, 'elemento.html?l=2&e=def-mcd'); await montada(pg);
  for (let i = 0; i < 3; i++) await pg.click('[data-a=adelante]');
  await pg.waitForTimeout(700);
  const enEscena = await pg.evaluate(() => [...new Set([...document.querySelectorAll('.escena svg [data-k]:not(.sale)')]
    .map((n) => [...n.classList].find((c) => c.startsWith('c-'))?.slice(2)))].filter((c) => !['tenue', 'muy-tenue', 'texto'].includes(c)).sort().join());
  const enLeyenda = await pg.$$eval('.leyenda [data-color]', (xs) => xs.map((x) => x.dataset.color).sort().join());
  afirmar(enLeyenda && enLeyenda === enEscena, `leyenda «${enLeyenda}» ≠ colores de la escena «${enEscena}»`);
  afirmar((await pg.textContent('.leyenda')).includes('resultado'), 'sin significado del verde');
});

// Recorre, para cada libro y cada elemento cuya escena ya existe, todos los pasos hacia delante y hacia atrás.
const EJ = 'ejercicio.html?base=tests/paginas/&l=0&x=cp0-1';
const parte = (p) => `.parte[data-p=${p}]`;
const abrirEj = async (pg, ruta = EJ) => {
  const errores = await abrir(pg, ruta);
  await pg.evaluate(() => { try { localStorage.clear(); } catch {} });
  await pg.reload({ waitUntil: 'load' });
  await pg.waitForSelector('.parte');
  return errores;
};
const visibles = (pg, sel) => pg.$$eval(sel, (els) => els.filter((e) => e.offsetParent !== null).length);

t('ejercicio: las pistas se abren una a una y la solución está oculta hasta pedirla', async (b, pg) => {
  const errores = await abrirEj(pg);
  afirmar(await visibles(pg, `${parte('a')} .pista`) === 0, 'hay pistas abiertas al llegar');
  const txt = await pg.textContent(`${parte('a')} [data-a=pista]`);
  afirmar(txt.includes('1 de 3') && txt.includes('concepto'), `botón: ${txt}`);
  await pg.click(`${parte('a')} [data-a=pista]`);
  afirmar(await visibles(pg, `${parte('a')} .pista`) === 1, 'no abrió exactamente una');
  afirmar((await pg.textContent(`${parte('a')} [data-a=pista]`)).includes('estrategia'), 'el botón no anuncia la siguiente');
  await pg.click(`${parte('a')} [data-a=pista]`); await pg.click(`${parte('a')} [data-a=pista]`);
  afirmar(await visibles(pg, `${parte('a')} .pista`) === 3, 'no están las 3');
  afirmar(await visibles(pg, `${parte('a')} [data-a=pista]`) === 0, 'sigue ofreciendo pistas sin quedar ninguna');
  afirmar(await visibles(pg, `${parte('a')} .solucion`) === 0, 'la solución se ve sin pedirla');
  await pg.click(`${parte('a')} [data-a=solucion]`);
  afirmar(await visibles(pg, `${parte('a')} .solucion li`) === 1, 'la solución no empieza en el primer paso');
  afirmar(await visibles(pg, `${parte('a')} .aprendes`) === 0, 'Qué te llevas antes de terminar');
  await pg.click(`${parte('a')} [data-a=siguiente]`); await pg.click(`${parte('a')} [data-a=siguiente]`);
  afirmar(await visibles(pg, `${parte('a')} .solucion li`) === 3, 'no reveló los 3 pasos');
  afirmar(await visibles(pg, `${parte('a')} .aprendes`) === 1, 'falta Qué te llevas al terminar');
  afirmar(await pg.$$eval('.katex', (k) => k.length) > 0 && !(await pg.$('.katex-error')), 'KaTeX');
  afirmar(errores.length === 0, errores.join(' | '));
});

t('ejercicio: el progreso sobrevive a recargar y es por parte', async (b, pg) => {
  await abrirEj(pg);
  await pg.click(`${parte('a')} [data-a=pista]`); await pg.click(`${parte('a')} [data-a=pista]`);
  await pg.click(`${parte('b')} [data-a=solucion]`);
  await pg.reload({ waitUntil: 'load' }); await pg.waitForSelector('.parte');
  afirmar(await visibles(pg, `${parte('a')} .pista`) === 2, 'parte a no conserva 2 pistas');
  afirmar(await visibles(pg, `${parte('b')} .pista`) === 0, 'parte b heredó pistas');
  afirmar(await visibles(pg, `${parte('b')} .solucion`) === 1 && await visibles(pg, `${parte('a')} .solucion`) === 0, 'solución vista no es por parte');
  await pg.click(`${parte('a')} [data-a=reiniciar]`);
  afirmar(await visibles(pg, `${parte('a')} .pista`) === 0, '«empezar de cero» no borra');
});

t('ejercicio: la solución con escena revela los pasos uno a uno y termina en Qué te llevas', async (b, pg) => {
  const errores = await abrirEj(pg);
  await pg.click(`${parte('b')} [data-a=solucion]`);
  await pg.waitForFunction(() => document.querySelector('.parte[data-p=b] .escena svg [data-k]'));
  afirmar(await visibles(pg, `${parte('b')} .pasos li`) === 1, 'se ven pasos futuros');
  await pg.click(`${parte('b')} [data-a=adelante]`); await pg.click(`${parte('b')} [data-a=adelante]`);
  afirmar(await visibles(pg, `${parte('b')} .pasos li`) === 3 && await visibles(pg, `${parte('b')} .aprendes`) === 1, 'no terminó');
  afirmar(errores.length === 0, errores.join(' | '));
});

t('ejercicio: la pista-concepto enlaza a la página del elemento con su nombre', async (b, pg) => {
  await abrirEj(pg);
  await pg.click(`${parte('a')} [data-a=pista]`);
  const a = await pg.$eval(`${parte('a')} .pista a`, (x) => ({ href: x.getAttribute('href'), txt: x.textContent }));
  afirmar(a.href === 'elemento.html?base=tests/paginas/&l=0&e=division' && a.txt.includes('Algoritmo de la División (prueba)'), JSON.stringify(a));
});

t('ejercicio: planteamiento, nota, vecinos y sin scroll horizontal en pantalla estrecha', async (b, pg) => {
  await pg.setViewportSize({ width: 380, height: 800 });
  const errores = await abrirEj(pg);
  afirmar(await visibles(pg, '.planteamiento .escena svg') === 1, 'falta el planteamiento');
  afirmar((await pg.textContent('.nota')).includes('aclaración'), 'falta la nota');
  afirmar(await pg.$eval('.vecinos .sig', (x) => x.getAttribute('href')).then((h) => h.includes('x=cp0-2')), 'siguiente ejercicio');
  const ancho = await pg.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  afirmar(ancho <= 0, `scroll horizontal de ${ancho}px`);
  await pg.setViewportSize({ width: 1280, height: 800 });
  afirmar(errores.length === 0, errores.join(' | '));
});

t('índice de libro: la clase práctica aparece tras los elementos y enlaza cada ejercicio', async (b, pg) => {
  const errores = await abrir(pg, 'libro.html?base=tests/paginas/&l=0');
  await pg.waitForSelector('#practica a');
  const r = await pg.$$eval('#practica a', (as) => as.map((a) => a.getAttribute('href')));
  afirmar(r.length === 2 && r[0] === 'ejercicio.html?base=tests/paginas/&l=0&x=cp0-1', JSON.stringify(r));
  afirmar((await pg.textContent('#practica')).includes('1 de enero de 2025'), 'falta la fecha');
  afirmar(errores.length === 0, errores.join(' | '));
});

t('elemento: «Se practica en» enlaza a los ejercicios que lo citan como concepto', async (b, pg) => {
  const errores = await abrir(pg, FIX); await montada(pg);
  await pg.waitForSelector('.practica-en a');
  const r = await pg.$$eval('.practica-en a', (as) => as.map((a) => [a.getAttribute('href'), a.textContent]));
  afirmar(r.length === 2 && r[0][0] === 'ejercicio.html?base=tests/paginas/&l=0&x=cp0-1' && r[0][1].includes('CP 0 · ejercicio 1'), JSON.stringify(r));
  afirmar(errores.length === 0, errores.join(' | '));
});

const fs = require('node:fs');
for (const l of fs.readdirSync(path.join(RAIZ, 'libros')).filter((d) => /^\d+$/.test(d))) {
  t(`recorrido del libro ${l}: todos los pasos sin errores, KaTeX correcto y vuelta exacta al inicio`, async (b, pg) => {
    const { default: libro } = await import(path.join(RAIZ, 'libros', l, 'contenido.js'));
    const hechos = libro.elementos.filter((e) => fs.existsSync(path.join(RAIZ, 'escenas', `${e.escena}.js`)));
    afirmar(hechos.length, 'ninguna escena');
    for (const el of hechos) {
      const errores = await abrir(pg, `elemento.html?l=${l}&e=${el.id}`);
      await pg.waitForFunction(() => document.querySelector('.escena svg [data-k]'));
      const inicio = await pg.evaluate(() => [...document.querySelectorAll('.escena svg [data-k]')].map((n) => n.dataset.k).sort().join());
      for (let i = 1; i < el.pasos.length; i++) await pg.click('[data-a=adelante]');
      afirmar((await pg.textContent('.cuenta')) === `${el.pasos.length}/${el.pasos.length}`, `${el.id}: no llegó al último paso`);
      for (let i = 1; i < el.pasos.length; i++) await pg.click('[data-a=atras]');
      await pg.waitForTimeout(800);
      const vuelta = await pg.evaluate(() => [...document.querySelectorAll('.escena svg [data-k]')].map((n) => n.dataset.k).sort().join());
      afirmar(vuelta === inicio, `${el.id}: al volver al paso 1 los nodos no coinciden`);
      afirmar(!(await pg.locator('.katex-error').count()), `${el.id}: fórmula KaTeX rota`);
      afirmar(!errores.length, `${el.id}: ${errores.join(' | ')}`);
    }
  });
}

// ---------------------------------------------------------------- ejecución

(async () => {
  const srv = spawn('python3', ['-m', 'http.server', String(PUERTO), '--bind', '127.0.0.1'], { cwd: RAIZ, stdio: 'ignore' });
  await new Promise((r) => setTimeout(r, 700));
  const b = await chromium.launch({ executablePath: process.env.CHROMIUM });
  try {
    for (const { nombre, fn } of pruebas) {
      if (FILTRO && !nombre.includes(FILTRO)) continue;
      const pg = await b.newPage({ viewport: { width: 1280, height: 900 } });
      pg.setDefaultTimeout(8000);
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

