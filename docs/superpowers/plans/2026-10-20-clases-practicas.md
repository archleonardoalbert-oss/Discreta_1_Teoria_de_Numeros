# Clases prácticas — plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** cada Libro N gana su Clase práctica N: enunciados, planteamiento visual opcional, pistas a petición (la primera siempre el concepto de la conferencia), solución modelo paso a paso y «Qué te llevas».

**Architecture:** contenido en `libros/N/practica.js`; página nueva `ejercicio.html` montada por `motor/ejercicio.js`; el bloque «pasos + escena + controles» de `motor/elemento.js` se extrae a `motor/estudio.js` para reutilizarlo en planteamientos y soluciones con escena. Escenas nuevas en `escenas/cpN/`.

**Tech Stack:** JS ES modules sin frameworks, SVG, KaTeX 0.18.9 vendorizado, `node --test`, playwright-core.

**Spec:** `docs/superpowers/specs/2026-10-18-biblioteca-teoria-numeros-design.md` §17 (y §9, §16 para escenas y rigor).

## Global Constraints

- Primera pista de **cada parte** = `tipo: 'concepto'` con ≥ 1 enlace `{l, e}` a un elemento existente.
- Dentro de `$…$` en prácticas: prohibidos `/`, `*`, `∗`. Fracciones `\frac`, producto `\cdot`.
- Pistas una a una; ninguna hace la cuenta clave. Mayoría dedicadas al arranque.
- Soluciones: cada implicación justificada; si usa otra conferencia, la nombra.
- Sin internet; paleta y tipografía actuales; responsive sin scroll horizontal.
- `localStorage` siempre dentro de try/catch.
- Comandos de navegador: `NODE_PATH=.superpowers/dev/node_modules CHROMIUM=… node tests/navegador.cjs`.

## Review Focus

1. Recargar la página tras abrir 2 pistas → siguen abiertas 2, no 0 ni todas (test en Task 1).
2. `localStorage` bloqueado (lanza) → la página funciona igual (test en Task 1 con stub que lanza).
3. Ejercicio con varias partes → cada parte tiene su propio contador de pistas y su solución (Task 1).
4. Enlace de pista a elemento de **otro** libro (p. ej. CP-04 → Libro II) resuelve nombre y href (Task 1).
5. Pantalla estrecha → sin scroll horizontal en `ejercicio.html` (Task 6, navegador).

---

### Task 1: Motor de la página de ejercicio

**Files:**
- Create: `motor/estudio.js`, `motor/ejercicio.js`, `motor/progreso.js`, `ejercicio.html`
- Modify: `motor/elemento.js` (usa `montarEstudio`), `css/biblioteca.css`
- Test: `tests/progreso.test.mjs`, `tests/paginas/libros/0/practica.js` (fixture), `tests/navegador.cjs`

**Interfaces:**
- Produces: `montarEstudio(contenedor, { pasos, escena, nombre, ocultarFuturos = false, alTerminar }) → { ir(i) }` — columnas pasos | escena, controles, entradas, tira; con `ocultarFuturos` los pasos futuros no se ven y ▶ revela; `alTerminar()` se llama al llegar al último paso.
- Produces: `progreso(clave) → { leer(): {pistas: number, solucion: boolean, paso: number}, guardar(estado), borrar() }` (try/catch; si falla, memoria en RAM).
- Produces: `montarEjercicio(raiz, { libro, practica, ejercicio, nombresElementos, anterior, siguiente })`, `arrancarEjercicio()` (lee `?base=&l=&x=`).
- `nombresElementos: Map<'l/e', {nombre, href}>` construido importando los `contenido.js` citados por los enlaces.

- [ ] Test `progreso`: guardar/leer ida y vuelta; `globalThis.localStorage` que lanza → `leer()` devuelve `{pistas:0, solucion:false, paso:0}` y `guardar` no lanza.
- [ ] Extraer `montarEstudio` de `montarElemento` sin cambiar comportamiento; correr los 27 tests de navegador → siguen pasando.
- [ ] Implementar `progreso.js`, `ejercicio.js`, `ejercicio.html`, CSS (`.pista`, `.pista-tipo-*`, `.aprendes`, `.solucion`).
- [ ] Fixture `tests/paginas/libros/0/practica.js` con 1 ejercicio de 2 partes (pistas 3 y 4; una con escena de solución) y enlaces a libros 0 y 2.
- [ ] Tests navegador: «ejercicio: las pistas se abren una a una y la solución está oculta hasta pedirla»; «ejercicio: el progreso sobrevive a recargar y es por parte»; «ejercicio: la pista-concepto enlaza al elemento (también de otro libro)»; «ejercicio: al revelar el último paso aparece Qué te llevas».
- [ ] Commit `feat: página de ejercicio (pistas, solución paso a paso, progreso)`.

### Task 2: Índice del libro y «Se practica en»

**Files:** Modify `motor/libro.js`, `motor/elemento.js`; Test `tests/navegador.cjs`.
- Libro: si `libros/N/practica.js` existe (import con catch), sección «Clase práctica N · fecha» con `n. nombre` → `ejercicio.html?l=N&x=id`.
- Elemento: recorre las prácticas de los 5 libros; si alguna pista-concepto enlaza `{l, e}` del elemento, muestra «Se practica en» con «CP-n · ejercicio k».
- [ ] Tests navegador: índice del libro fixture muestra la sección; el elemento citado muestra «Se practica en».
- [ ] Commit.

### Task 3: Validación genérica del contenido de prácticas

**Files:** Create `tests/practica.test.mjs`, `tests/practica-cuentas.test.mjs`.
- Para cada `libros/N/practica.js`: `numero === N`, ids únicos con prefijo `cpN-`; cada parte: `pistas.length >= 3`, `pistas[0].tipo === 'concepto'` y enlaces existentes (import del contenido del libro `l`); tipos válidos; `solucion.pasos.length >= 3`; `aprendes.resultado` y `aprendes.ideas.length >= 2`; escenas citadas existen; KaTeX válido en todo texto; ninguna fórmula contiene `/`, `*`, `∗`.
- `practica-cuentas`: verifica por código las respuestas citadas en las soluciones: CP-02 3 → $(x, y) = (3, 2)$ única; CP-03 3 → $2^{18} 3^{8} 5^{4} 7^{2} 11 \cdot 13 \cdot 17 \cdot 19$; CP-04 1 → las 3 afirmaciones verdaderas; CP-04 2 → $n \in \{1, 3\}$; CP-04 4 → 5 ternas con $a,b \ge 0$; CP-05 1 → $x \equiv 33 \pmod{276}$; CP-05 3 → 301; CP-05 5 → 213; CP-05 9 → fórmula $2^r c(e)$ contra fuerza bruta $n \le 300$; CP-02 5 → $(n^2+1, (n+1)^2+1) = 5 \iff n \equiv 2 \pmod 5$; CP-02 4 → $(a, b)$ contra fuerza bruta.
- [ ] Commit junto con el primer `practica.js` (Task 4), ya que sin contenido el test no tiene qué recorrer.

### Tasks 4–8: Contenido CP-01 … CP-05 (una por libro)

**Files:** Create `libros/N/practica.js`, `escenas/cpN/*.js` (solo los planteamientos/soluciones listados en §17); Modify `tests/navegador.cjs` (recorrido de los ejercicios del libro).

Por ejercicio, en este orden de trabajo: leer el enunciado en el PNG renderizado → resolverlo entero → escribir la solución modelo (pasos justificados) → derivar las pistas desde la solución (concepto, estrategia, 2–3 de arranque, desbloqueos) → «Qué te llevas».

- [ ] Task 4 CP-01 (8 ejercicios; escenas cp1: descomposiciones, saltos 4 y 5, polígono, tablero L + solución por cuadrantes).
- [ ] Task 5 CP-02 (8; escenas cp2: múltiplos de a y b, recta diofántica + solución).
- [ ] Task 6 CP-03 (8).
- [ ] Task 7 CP-04 (9).
- [ ] Task 8 CP-05 (9; escena cp5: huevos).
- Cada task: `node --test tests/*.test.mjs` verde, recorrido de navegador del libro verde, commit.

### Task 9: Cierre

- [ ] Recorrido de navegador global (todos los ejercicios: pistas, solución, KaTeX), revisión visual de las escenas nuevas con `herramientas/escena.sh`.
- [ ] `docs/como-añadir-un-libro.md`: sección «Clase práctica» (formato, reglas de pistas y notación).
- [ ] Memoria del proyecto actualizada. Commit.
