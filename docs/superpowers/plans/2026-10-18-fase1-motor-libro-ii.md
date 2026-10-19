# Biblioteca de Teoría de Números — Fase 1: motor + portada + Libro II (Conferencia 2)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Web local, sin internet, con la biblioteca (5 portadas, solo el Libro II abierto) y las 22 páginas de la Conferencia 2, cada una con texto literal, demostración paso a paso y animación SVG con entradas editables.

**Architecture:** Tres capas separadas. *Contenido* (`libros/2/contenido.js`: texto literal y pasos), *escenas* (`escenas/2/<id>.js`: función pura `(entradas, paso) → Nodo[]`) y *motor* (`motor/`: reconcilia nodos SVG por clave con transiciones CSS, marca automáticamente lo nuevo de cada paso, entradas, navegación). Las páginas son plantillas únicas (`libro.html?l=2`, `elemento.html?l=2&e=<id>`) alimentadas por los datos.

**Tech Stack:** HTML + CSS + JS (módulos ES, sin frameworks ni build), SVG, KaTeX 0.19.0 vendorizado, Literata + JetBrains Mono vendorizadas, `node --test` (Node 24) para lógica pura, playwright-core + Chromium headless para el navegador, lanzador en Python 3.

**Spec:** `docs/superpowers/specs/2026-10-18-biblioteca-teoria-numeros-design.md` (léelo entero antes de empezar; §3 son decisiones del usuario que no se deshacen).

## Global Constraints

- Ninguna petición fuera de `127.0.0.1`/`localhost` (fuentes, KaTeX, todo vendorizado).
- Fondo `#000`; paneles `#030304`–`#040406`; bordes `#121420`; texto `#d6d1c2`; tenue `#5c6175`. Acentos: cian `#3aa9bb`, ciruela `#b8509f`, ámbar `#c99448`, verde `#4aa97c`, violeta `#7d6cc4`. **Prohibido** reutilizar la paleta neón de `~/Leo/Tutoriales/DP` (`#22e3ff`, `#ff4fd8`, etc.).
- Colores semánticos de escena, iguales en toda la web: saltos/divisor = cian; número objetivo = ciruela; resto = ámbar; conjuntos auxiliares = violeta; conclusión/resultado = verde.
- Lectura: Literata ~18 px, interlineado 1.75–1.8, medida ≤ 70 caracteres; JetBrains Mono solo en etiquetas, entradas y números de escena (desactivar ligaduras: `font-variant-ligatures: none`).
- Texto de enunciados y pasos = **literal de la conferencia** leído del PDF renderizado (`pdftoppm -r 150 -png`), no de `pdftotext`. Correcciones → `marca: 'corregido'`; demostraciones/pasos añadidos → `marca: 'añadido'`.
- Negativos = saltos hacia la **izquierda** de 0.
- Un movimiento por paso; lo de pasos anteriores sigue escrito en el dibujo (atenuado, legible); ningún número que use el texto del paso falta en la escena; unidades visibles en medidas y multiplicaciones.
- Avance solo manual (◀ ▶ ⏮, ← →, clic en línea). Transición 0,4–0,8 s; `prefers-reduced-motion` → instantánea.
- KaTeX: dentro de `$…$` escribir `\lt`/`\gt`, nunca `<` pegado a letra.
- Nunca capturar la pantalla del usuario; la revisión visual renderiza solo las páginas del proyecto en Chromium headless.
- Commits con la línea `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Review Focus

1. **Entrada no válida o vacía** (campo borrado, `0`, negativo donde el teorema pide positivo, decimal, texto): mensaje junto a la entrada, la escena conserva el último estado válido, nada se rompe. → test en Task 5.
2. **Números grandes** (3088, o el tope): la recta agrupa saltos con «×g» y sigue legible; por encima del tope, aviso y sin dibujar. → tests en Task 3 (escala) y Task 9 (Euclides con 3088/456).
3. **Cambiar entradas en mitad de la demostración**: se queda en el mismo paso; nunca un paso fuera de rango. → test en Task 5.
4. **Retroceder ◀** reproduce exactamente el estado del paso anterior (mismos nodos), sin restos de animación. → test en Task 3 (pureza/determinismo) y Task 5 (navegador).
5. **Pantalla estrecha** (≤ 820 px): columnas apiladas, sin scroll horizontal de página, escena visible. → test en Task 5.

---

## Estructura de archivos

```
abrir-biblioteca              lanzador Python (copia adaptada de ~/Leo/Tutoriales/DP/abrir-curso)
index.html                    biblioteca: 5 portadas
libro.html                    índice de un libro (?l=N)
elemento.html                 página de elemento (?l=N&e=id)
css/biblioteca.css            tokens, portada, libro, elemento, escena
vendor/katex/                 KaTeX 0.19.0 (katex.min.js/css, fonts/, contrib/auto-render.min.js)
vendor/fuentes/               Literata + JetBrains Mono woff2 + fuentes.css + licencias OFL
fuentes/                      MD-I-Conf-01..05.pdf (copia de ~/Descargas/Telegram Desktop/Discreta/Conf)
motor/aritmetica.js           matemática pura (división, mcd, Euclides, coeficientes, mcm, diofánticas)
motor/escala.js               escala de la recta y agrupación de saltos
motor/nodos.js                tipo Nodo, marcarNuevos (puro)
motor/svg.js                  pintar(): reconciliación por clave en el DOM
motor/entradas.js             campos editables, listas 2–4, validación
motor/elemento.js             monta elemento.html (texto, pasos, escena, controles, teclado)
motor/libro.js, motor/portada.js
escenas/primitivas.js         recta, saltos, llave, punto, cuadrícula con unidad, reglas dobles (→ Nodo[])
escenas/2/<id>.js             una escena por elemento de la Conf-02
libros/catalogo.js            los 5 libros
libros/2/contenido.js         los 22 elementos de la Conf-02
tests/*.test.mjs              node --test
tests/navegador.cjs           playwright
tests/paginas/                fixtures de navegador (libro «0» de prueba)
.superpowers/dev/             node_modules de playwright-core (ignorado por git)
```

## Interfaces comunes (las usan casi todas las tareas)

```js
/** Nodo de escena. Clave k única por estado; geometría en a; color semántico en c.
 * @typedef {{k:string, t:'line'|'path'|'circle'|'rect'|'text', a:Object<string,number|string>,
 *            txt?:string, c?:'cian'|'ciruela'|'ambar'|'violeta'|'verde'|'tenue'|'texto',
 *            fijo?:boolean, ancho?:number}} Nodo
 * Entrada de escena:
 * @typedef {{id:string, etiqueta:string, valor:number|number[], min:number, max:number,
 *            lista?:{min:number,max:number}}} Entrada
 * Escena (export default de escenas/N/<id>.js):
 *   { entradas: Entrada[], validar(e):string|null, vista(e):{ancho:number,alto:number},
 *     estado(e, paso:number): Nodo[] }      // pura y determinista; e = {id: valor}
 * Elemento (en libros/N/contenido.js):
 *   { id, tipo:'DEF'|'LEMA'|'TEO'|'COR'|'PROP'|'EJ', nombre, enunciado, marcaEnunciado?,
 *     explicacion, pasos:[{texto, marca?:'corregido'|'añadido'}], escena:'2/<id>' }
 * Invariante: para toda escena y entradas válidas, estado(e, i) existe para i ∈ [0, pasos.length).
 */
```

---

### Task 1: Esqueleto, lanzador, recursos sin internet e infraestructura de tests

**Files:**
- Create: `abrir-biblioteca`, `index.html` (provisional, solo `<h1>`), `css/biblioteca.css` (tokens `:root` de Global Constraints + `body`), `vendor/katex/…`, `vendor/fuentes/…`, `fuentes/*.pdf`, `tests/navegador.cjs`, `tests/humo.test.mjs`
- Modify: `.gitignore` (+ `.superpowers/dev/`)

**Interfaces:**
- Produces: `./abrir-biblioteca [--sin-abrir]` (puerto libre desde 8780); `tests/navegador.cjs` con helpers `t(nombre, fn)`, `afirmar(cond, msg)`, `abrir(pg, ruta)` y lista `PAGINAS` que las tareas siguientes amplían; se ejecuta con `NODE_PATH=.superpowers/dev/node_modules CHROMIUM=$HOME/.cache/ms-playwright/chromium-1234/chrome-linux64/chrome node tests/navegador.cjs`.

- [ ] **Step 1:** Copiar `~/Descargas/Telegram Desktop/Discreta/Conf/*.pdf` a `fuentes/`. Copiar `~/Leo/Tutoriales/DP/.superpowers/dev/node_modules/playwright-core` a `.superpowers/dev/node_modules/`.
- [ ] **Step 2:** Vendorizar KaTeX 0.19.0 (`npm pack katex@0.19.0` en el scratchpad y copiar `dist/katex.min.{js,css}`, `dist/fonts/`, `dist/contrib/auto-render.min.js`). Vendorizar Literata (400, 400 italic, 600; latin + latin-ext) y copiar JetBrains Mono de `~/Leo/Tutoriales/DP/vendor/fuentes/`; `vendor/fuentes/fuentes.css` con `@font-face` locales; licencias OFL incluidas.
- [ ] **Step 3: Test que falla** — `tests/navegador.cjs`, prueba «sin internet»: abre `index.html` interceptando toda petición cuyo host no sea local; afirma 0 peticiones externas y que `Literata` y `JetBrains Mono` tienen `status === 'loaded'` tras `document.fonts.ready`. `tests/humo.test.mjs`: arranca `./abrir-biblioteca --sin-abrir`, lee la URL impresa y afirma HTTP 200 en `/` y en `/vendor/katex/katex.min.js`.
- [ ] **Step 4:** Ejecutar ambos. Esperado: FAIL (no existen lanzador/página).
- [ ] **Step 5:** Implementar `abrir-biblioteca` (como el de DP: `Cache-Control: no-store`, `.js` → `text/javascript`, imprime `Biblioteca en http://localhost:PUERTO/`), `index.html` provisional que cargue `css/biblioteca.css` y use ambas fuentes.
- [ ] **Step 6:** `node --test tests/` y el comando de navegador. Esperado: PASS.
- [ ] **Step 7:** Commit `feat: esqueleto, lanzador y recursos sin internet`.

### Task 2: Aritmética pura

**Files:** Create `motor/aritmetica.js`, `tests/aritmetica.test.mjs`

**Interfaces:**
- Produces:
  - `division(a:number, b:number) → {q, r}` con `b > 0`, `0 ≤ r < b` también para `a < 0`.
  - `mcd(...ns:number[]) → number` (≥ 0; `mcd(a,0)=|a|`).
  - `mcm(a, b) → number` (`|ab|/mcd`).
  - `euclides(a, b) → {filas:[{a, q, b, r}], mcd}` (filas en el orden de la conferencia: `a = q·b + r`, última con `r = 0`).
  - `coeficientes(a, b) → {pasos:[{i, A, B, q}], x, y}` siguiendo **exactamente** la tabla de la conferencia (`A₁ = 1, B₁ = −q_k`, `A_{i+1} = B_i`, `B_{i+1} = A_i − q_{k−i}·B_i`), con `a·x + b·y = mcd`.
  - `diofantica(a, b, c) → null | {x0, y0, d, pasoX: b/d, pasoY: a/d}`.
  - `menorCombinacionPositiva(ns:number[], radio:number) → {valor, coefs:number[]}` por búsqueda acotada (para la escena del PBO).

- [ ] **Step 1: Tests que fallan** con los valores del spec:
```js
assert.deepEqual(division(17, 5), {q:3, r:2});
assert.deepEqual(division(-17, 5), {q:-4, r:3});
assert.equal(mcd(3088, 456), 8); assert.equal(mcd(-12, 18), 6); assert.equal(mcd(7, 0), 7);
assert.deepEqual(euclides(3088, 456).filas.map(f => [f.a, f.q, f.b, f.r]),
  [[3088,6,456,352],[456,1,352,104],[352,3,104,40],[104,2,40,24],[40,1,24,16],[24,1,16,8],[16,2,8,0]]);
const c = coeficientes(3088, 456);
assert.deepEqual(c.pasos.map(p => [p.A, p.B]), [[1,-1],[-1,2],[2,-5],[-5,17],[17,-22],[-22,149]]);
assert.deepEqual([c.x, c.y], [-22, 149]);
assert.equal(mcm(4, 6), 12);
assert.equal(diofantica(4, 6, 7), null);
// propiedad: 300 pares aleatorios en [-500,500]² (b≠0): a·x+b·y === mcd, y toda diofantica devuelta cumple a·x0+b·y0 === c
```
- [ ] **Step 2:** `node --test tests/aritmetica.test.mjs` → FAIL.
- [ ] **Step 3:** Implementar. `coeficientes` para `b ∤ a`; si `b | a` devuelve `{pasos:[], x:0, y:1}` (mcd = b).
- [ ] **Step 4:** → PASS.
- [ ] **Step 5:** Commit `feat: aritmética de la conferencia 2`.

### Task 3: Nodos, escala y primitivas visuales

**Files:** Create `motor/nodos.js`, `motor/escala.js`, `escenas/primitivas.js`, `tests/primitivas.test.mjs`

**Interfaces:**
- Produces:
  - `marcarNuevos(previo:Nodo[]|null, actual:Nodo[]) → Set<string>`: claves de nodos no `fijo` que no existían en `previo` o cuyo `txt`/`a` cambió. Con `previo = null` → todos los no fijos.
  - `planRecta({min, max, ancho, margen=24}) → {x(v):number, marcas:number[]}`: marcas «redondas» (1, 2, 5 × 10ᵏ) con ≥ 40 px entre ellas, siempre incluye 0 si está en rango.
  - `agrupar(longitudPx:number, n:number, minPx=18) → number` (g mínimo con `g·longitudPx ≥ minPx`).
  - Primitivas (todas → `Nodo[]`, prefijo de clave `id`): `recta(id, plan, y)`, `saltos(id, plan, {desde, salto, n, y, c})` (n < 0 o salto < 0 ⇒ hacia la izquierda; si se agrupan, un arco por grupo con etiqueta `×g` y el último grupo parcial), `punto(id, plan, v, y, {c, etiqueta})`, `llave(id, plan, v1, v2, y, texto, c)`, `cuadricula(id, {x, y, filas, cols, unidad, lado, c})` (dibuja la unidad de muestra con su rótulo, p. ej. «1 cuadradito = d»), `reglasDobles(id, plan, {b, k, y})` (regla inferior en unidades, superior con una marca cada `b` numerada 0…k).
  - `TOPE_SALTOS = 400` (más arcos que eso tras agrupar ⇒ la escena debe validar y avisar).

- [ ] **Step 1: Tests que fallan:**
```js
const p = planRecta({min:-20, max:20, ancho:600});
assert.ok(p.x(-5) < p.x(0) && p.x(0) < p.x(5));
const s = saltos('s', p, {desde:0, salto:5, n:-3, y:100, c:'cian'});
// los 3 arcos terminan en -5, -10, -15 (x decreciente)
assert.equal(marcarNuevos(null, [{k:'a',t:'line',a:{},fijo:true},{k:'b',t:'line',a:{}}]).has('a'), false);
assert.deepEqual([...marcarNuevos([{k:'b',t:'text',a:{x:1},txt:'3'}], [{k:'b',t:'text',a:{x:1},txt:'4'}])], ['b']);
const g = saltos('g', planRecta({min:-70000,max:70000,ancho:600}), {desde:0, salto:3088, n:-22, y:100});
assert.ok(g.some(n => n.txt?.startsWith('×')));     // agrupó
// claves únicas en todas las primitivas; misma llamada dos veces ⇒ deepEqual (determinismo)
```
- [ ] **Step 2:** → FAIL. **Step 3:** Implementar. **Step 4:** → PASS.
- [ ] **Step 5:** Commit `feat: nodos, escala y primitivas de la recta`.

### Task 4: Pintado SVG con transiciones

**Files:** Create `motor/svg.js`, `tests/paginas/svg.html`, Modify `css/biblioteca.css` (clases de escena), `tests/navegador.cjs`

**Interfaces:**
- Consumes: `Nodo`, `marcarNuevos` (Task 3).
- Produces: `pintar(svg:SVGSVGElement, previo:Nodo[]|null, actual:Nodo[], {animar:boolean}) → void`. Reconciliación por `k`: los que siguen actualizan geometría vía `style` (propiedades CSS de SVG: `cx, cy, r, x, y, width, height, d`; `x1…y2` como atributo con transición WAAPI de opacidad si cambian); los nuevos entran con fundido (y trazado `stroke-dashoffset` para `path`/`line`); los que desaparecen se desvanecen y se eliminan. Clase `nuevo` (color pleno + halo sutil) en `marcarNuevos(previo, actual)`; el resto clase `hecho` (opacidad ~0,7, legible). Clase `c-<color>` según `c`. Duración por variable CSS `--t-paso: .55s`; `@media (prefers-reduced-motion: reduce)` → `0s`.

- [ ] **Step 1: Test que falla** (navegador, `tests/paginas/svg.html` expone `window.prueba(previo, actual)`): pintar A, luego B (A con un nodo movido y uno nuevo), luego A otra vez; afirmar que el DOM final tiene exactamente las claves de A, ninguna con clase `nuevo` salvo las que `marcarNuevos(B, A)` da, y ningún nodo huérfano tras 1 s.
- [ ] **Step 2:** → FAIL. **Step 3:** Implementar. **Step 4:** → PASS.
- [ ] **Step 5:** Commit `feat: pintado SVG reconciliado con transiciones`.

### Task 5: Página de elemento (distribución B)

**Files:** Create `elemento.html`, `motor/elemento.js`, `motor/entradas.js`, `tests/paginas/libros/0/contenido.js` + `tests/paginas/escenas/0/division.js` (fixture: algoritmo de la división con 3 pasos), Modify `css/biblioteca.css`, `tests/navegador.cjs`

**Interfaces:**
- Consumes: `pintar` (Task 4), `Escena`/`Elemento` (interfaces comunes).
- Produces: `montarElemento(raiz:HTMLElement, {libro, elemento, escena, anterior?, siguiente?})`; `elemento.html` resuelve `?l=&e=` importando `libros/<l>/contenido.js` y `escenas/<escena>.js` (base configurable para fixtures: `?base=tests/paginas/`). `crearEntradas(contenedor, entradas, alCambiar(e))` con validación (entero, `min`/`max`, listas 2–4 con botones + / −). DOM estable para tests: `.enunciado`, `.explicacion`, `ol.pasos > li` (clases `hecho`/`actual`/`futuro`, `data-marca`), `.escena svg`, `.cuenta` (`«i/N»`), botones `[data-a=inicio|atras|adelante]`, `.entradas input`, `.aviso`.

Diseño (spec §5): enunciado arriba con etiqueta de tipo coloreada; explicación llana con rótulo «explicación (no es de la conferencia)»; debajo dos columnas: izquierda `ol.pasos` con la demostración entera (actual resaltado en ámbar, pasados gris legible, futuros apagados; clic en un `li` salta), derecha escena + entradas + controles. Marcas `corregido`/`añadido` como etiqueta pequeña al margen. Anterior/siguiente elemento al pie; enlace al libro arriba. ≤ 820 px: columnas apiladas.

- [ ] **Step 1: Tests que fallan** (navegador, fixture):
  - Inicio en `1/3`; `adelante` → `2/3` y `li` 2 con clase `actual`; ← vuelve a `1/3`; clic en `li` 3 → `3/3`.
  - En paso 2, cambiar `a` a 23 ⇒ sigue en `2/3` y el texto de la escena muestra `23`.
  - Escribir `0`, `-3`, `2.5`, `abc` y vaciar en `b` ⇒ `.aviso` visible, el SVG no cambia, ningún error de consola.
  - Viewport 400×800 ⇒ `document.documentElement.scrollWidth <= 400` y `.escena` visible.
  - `emulateMedia({reducedMotion:'reduce'})` ⇒ `getComputedStyle(...).getPropertyValue('--t-paso')` es `0s`.
- [ ] **Step 2:** → FAIL. **Step 3:** Implementar (KaTeX con auto-render, delimitadores `$…$` y `$$…$$`). **Step 4:** → PASS.
- [ ] **Step 5:** Commit `feat: página de elemento con demostración paso a paso`.

### Task 6: Portada «Biblioteca» e índice de libro

**Files:** Create `libros/catalogo.js`, `motor/portada.js`, `motor/libro.js`, `libro.html`, Modify `index.html`, `css/biblioteca.css`, `tests/navegador.cjs`

**Interfaces:**
- Produces: `catalogo = [{numero:1..5, romano:'I'..'V', titulo, color, disponible, ilustracion}]` — I «Principios · Divisibilidad» cian; II «mcd · Diofánticas · mcm» ciruela, `disponible:true`; III «Primos · Teorema Fundamental» ámbar; IV «Congruencia» verde; V «Sistemas residuales · TCR» violeta. `libro.html?l=N` lista los elementos de `libros/N/contenido.js` con etiqueta de tipo y enlace a `elemento.html?l=N&e=id`.

Diseño (aprobado en boceto «B · Portadas»): portadas de frente 150×205 aprox., lomo de color a la izquierda, número de libro en mono, título en Literata, mini-ilustración SVG abajo (I saltos en la recta, II barras de mcd/mcm, III rectángulos de factores, IV reloj de congruencias, V tres anillos); hover eleva el libro; los no disponibles atenuados con «en preparación»; espacio visible para libros futuros.

- [ ] **Step 1: Tests que fallan:** `index.html` tiene 5 `.portada`; solo la II es enlace (`a[href="libro.html?l=2"]`); `libro.html?l=2` lista 22 elementos en el orden del spec §12 (comparar ids con `contenido.js`) — este test queda en rojo hasta Task 7, déjalo fuera de la ejecución (comentado con `// PENDIENTE Task 7`) hasta entonces.
- [ ] **Step 2:** → FAIL. **Step 3:** Implementar. **Step 4:** → PASS (salvo el pendiente).
- [ ] **Step 5:** Commit `feat: portada de la biblioteca e índice de libro`.

### Task 7: Contenido literal de la Conferencia 2

**Files:** Create `libros/2/contenido.js`, `tests/contenido.test.mjs`, Modify `tests/navegador.cjs` (quitar el skip de Task 6)

**Interfaces:**
- Produces: los 22 elementos de spec §12 con ids: `def-mcd`, `prop-signos`, `teo-divide-mcd`, `def-primos-relativos`, `def-combinacion-lineal`, `teo-menor-combinacion`, `teo-divisores-comunes`, `cor-mcd-n`, `cor-cocientes-coprimos`, `teo-divide-producto`, `cor-mcd-resto`, `def-diofantica`, `teo-diofantica-solucion`, `teo-euclides`, `ej-euclides-3088`, `teo-coeficientes`, `ej-coeficientes-3088`, `teo-solucion-general`, `def-mcm`, `teo-multiplos-comunes`, `cor-mcm-mcd`, `cor-multiplo-mcm`. Escena de cada uno: `'2/<id>'`.

Reglas: renderizar `fuentes/MD-I-Conf-02.pdf` a PNG y transcribir **mirando la imagen**. Cada oración/igualdad de la demostración = un paso (agrupar igualdades encadenadas que sean un solo movimiento). Corregir y marcar: «a_b ∗ b_n» → `a_n·b_n` (`marcaEnunciado:'corregido'`). Completar con `marca:'añadido'` y las herramientas de la conferencia las demostraciones de spec §8 (divisores comunes = divisores del mcd; cor. mcd n-ario; cocientes coprimos; a | b₁⋯bₙ; signos; a | b ⇒ mcd = |a|; Euclides: termina —restos estrictamente decrecientes y ≥ 0, PBO— y r_k = mcd por `cor-mcd-resto`; corolarios del mcm). Los elementos sin demostración llevan pasos de construcción de la idea (`marca:'añadido'`), entre 2 y 6.

- [ ] **Step 1: Tests que fallan** (`node --test`): 22 elementos, ids en ese orden y únicos; cada uno con `enunciado`, `explicacion`, `pasos.length ≥ 1`; cada `marca` ∈ {corregido, añadido}; todo texto renderiza con `katex.renderToString` (cargar `vendor/katex/katex.min.js` en un `vm`) sin lanzar; ningún `$…$` contiene `<` seguido de letra; `ej-coeficientes-3088` contiene `-22` y `149`.
- [ ] **Step 2:** → FAIL. **Step 3:** Transcribir. **Step 4:** → PASS (incluido el test de Task 6).
- [ ] **Step 5:** Commit `feat: contenido literal de la conferencia 2`.

### Tasks 8–11: Escenas de la Conferencia 2

Comunes a las cuatro tareas:

**Files:** Create `escenas/2/<id>.js` por elemento; `tests/escenas2.test.mjs` (lo crea Task 8, las demás añaden casos).

**Interfaces:** Consumen `escenas/primitivas.js`, `motor/aritmetica.js`, `Escena`; producen el `export default` de cada `escenas/2/<id>.js`.

**Test genérico** (Task 8 lo escribe para todas las escenas existentes; se aplica solo a las que haya): para cada elemento con escena, con las entradas por defecto y con 20 combinaciones válidas aleatorias dentro de `min/max`: `validar(e) === null`; para todo `i < pasos.length`, `estado(e, i)` no lanza, claves únicas, todo nodo cabe en `vista(e)`, y `estado(e, i)` llamado dos veces es `deepEqual`. Más los tests específicos de cada tarea. Flujo de cada tarea: tests (FAIL) → escenas → PASS → `node tests/navegador.cjs` recorre todos los pasos de las páginas nuevas sin errores de consola → commit `feat: escenas 2 (<grupo>)`.

Cada escena: valores iniciales = ejemplo de la conferencia si existe, si no pequeños y claros; un movimiento por paso; los resultados de pasos anteriores quedan rotulados en el dibujo.

### Task 8: mcd y combinación lineal (elementos 1–5)

| id | idea de la escena |
|---|---|
| `def-mcd` | a y b como puntos ciruela; se prueban saltos d = 1,2,… (uno por paso agrupados) que pasan por ambos; el mayor queda en verde «mcd». |
| `prop-signos` | −a es el espejo de a a la izquierda de 0; los mismos saltos pasan por a y por −a. |
| `teo-divide-mcd` | si a | b, los saltos de |a| ya pasan por b: |a| es el mcd; caso b = 0. |
| `def-primos-relativos` | únicos saltos comunes de longitud 1. |
| `def-combinacion-lineal` | x saltos de a (izquierda si x < 0) seguidos de y saltos de b, terminando en c; entradas a, b, x, y. |

Tests específicos: `def-mcd` con (12, 18) termina con un nodo verde de texto que contiene `6`; `def-combinacion-lineal` con a=3088, x=−22 ⇒ los arcos de a terminan a la izquierda de 0.

### Task 9: menor combinación positiva, divisores comunes, n números (6–10)

| id | idea |
|---|---|
| `teo-menor-combinacion` | conjunto S (violeta) de combinaciones positivas como barras; PBO elige la menor s; dividir a₁ entre s muestra r = 0 (si r > 0 sería una combinación menor: barra ámbar «contradicción»); s pasa por todos los aᵢ ⇒ s = d. Lista 2–4 números. |
| `teo-divisores-comunes` | los saltos comunes de a y b son exactamente los que caben en el mcd. |
| `cor-mcd-n` | mcd(a₂…aₙ) primero, luego con a₁, mostrando que coincide. |
| `cor-cocientes-coprimos` | reglas dobles: en unidades de d, a y b se convierten en a/d y b/d, cuyos únicos saltos comunes son de 1. |
| `teo-divide-producto` | rectángulo de cuadraditos b₁×…; a no comparte saltos con los primeros factores ⇒ todo cae en bₙ. |

Tests: `teo-menor-combinacion` con [12, 18, 30] da s = 6 en el último paso; con 4 números no lanza; `cor-cocientes-coprimos` con (3088, 456) rotula 386 y 57.

### Task 10: resto, diofánticas y Euclides (11–17)

| id | idea |
|---|---|
| `cor-mcd-resto` | a = qb + r en la recta; un salto x que pasa por a y b pasa por r y viceversa. |
| `def-diofantica` | puntos enteros (x, y) sobre la recta ax + by = c en una rejilla 2D; solo los enteros valen. |
| `teo-diofantica-solucion` | d | c ⇔ hay solución: se escala la combinación de d por k = c/d (reglas dobles). |
| `teo-euclides` | cada fila: el resto de la anterior pasa a ser el salto; se rotula cada fila en la recta y se acumula la tabla en el propio dibujo. |
| `ej-euclides-3088` | las 7 divisiones de 3088 y 456 con escala automática, termina en 8. |
| `teo-coeficientes` | la tabla Aᵢ, Bᵢ se rellena de abajo arriba recorriendo los cocientes. |
| `ej-coeficientes-3088` | 22 saltos de 3088 a la izquierda (agrupados) y 149 de 456 a la derecha, terminando en 8. |

Tests: `ej-euclides-3088` último paso contiene texto `8` en verde y respeta `TOPE_SALTOS`; `ej-coeficientes-3088` termina en el punto x correspondiente a 8; `teo-euclides` con (a, b) que da 2 filas no lanza en ningún paso (pasos de filas inexistentes muestran el estado final).

### Task 11: solución general y mcm (18–22)

| id | idea |
|---|---|
| `teo-solucion-general` | desde (x₀, y₀), desplazamientos de b/d en x y −a/d en y recorren todas las soluciones enteras sobre la recta; la segunda solución obliga al mismo patrón. |
| `def-mcm` | saltos de a y de b desde 0 hasta coincidir por primera vez. |
| `teo-multiplos-comunes` | rectángulo a×b en bloques de lado d: ab/d; los múltiplos comunes son repeticiones de ese bloque. |
| `cor-mcm-mcd` | [a,b]·(a,b) = |ab| como rectángulos de igual área. |
| `cor-multiplo-mcm` | todo punto donde coinciden los saltos de a y b es un salto de [a,b]. |

Tests: `def-mcm` con (4, 6) termina en 12; `cor-mcm-mcd` con (4, 6) rotula 12 y 2 y área 24; validación rechaza a = 0 en `def-mcm`.

### Task 12: Recorrido completo y revisión visual

**Files:** Modify `tests/navegador.cjs`; Create `herramientas/ver.cjs` (renderiza páginas a PNG en `.superpowers/dev/capturas/`)

- [ ] **Step 1:** Añadir test: para cada uno de los 22 elementos, recorrer todos los pasos con `adelante` y de vuelta con `atras`; afirmar 0 errores de consola, 0 `.katex-error`, `.cuenta` coherente, y que tras volver al paso 1 los nodos coinciden con los del arranque.
- [ ] **Step 2:** Ejecutar toda la batería (`node --test tests/` + navegador). Esperado: PASS.
- [ ] **Step 3:** Renderizar con `herramientas/ver.cjs` la portada, el índice del Libro II y el primer, medio y último paso de cada elemento; revisar uno a uno contra Global Constraints (sobrecarga, legibilidad, paleta, unidades visibles, datos de pasos previos escritos en el dibujo). Corregir lo que falle.
- [ ] **Step 4:** Commit `test: recorrido completo del libro II` y entregar al usuario para que califique las animaciones (spec §11: se para aquí).
