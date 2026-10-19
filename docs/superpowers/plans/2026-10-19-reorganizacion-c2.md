# Reorganización del Libro II según la investigación — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:executing-plans (ejecución directa elegida por el usuario). Steps use checkbox (`- [ ]`) syntax.

**Goal:** Aplicar al motor y a las escenas del Libro II las recetas del informe `~/reports/Visualizar teoría de números.md`.

**Architecture:** Nuevas marcas en `Nodo` (`ref`, `supuesto`, `quitar`) interpretadas por `escenaPorCapas` y `pintar`; vista de tira en `motor/elemento.js`; macros KaTeX de color; una pieza `escenas/piezas/rectanguloEuclides.js`.

**Spec:** `docs/superpowers/specs/2026-10-18-biblioteca-teoria-numeros-design.md` §14.

## Global Constraints
- Paleta actual sin cambios (solo contraste).
- Un movimiento por paso; nada fuera de la vista (`tests/escenas.test.mjs`, `herramientas/fuzz-textos.mjs`).
- Texto literal de la conferencia: colorear símbolos no cambia palabras.

## Review Focus
1. `ref` solo se ve en su propio paso (al avanzar o retroceder vuelve a su estado normal).
2. `supuesto` desaparece al cerrar la contradicción, también al volver con ◀.
3. Rectángulo de Euclides con cocientes grandes (p. ej. 4999/2): no dibuja miles de cuadrados.
4. La vista de tira no rompe el teclado ni el estado del paso actual.

---

### Task 1: `ref`, `supuesto` y `quitar` en el motor
`escenaPorCapas`: los nodos con `ref: true` de la capa i solo cuentan cuando i === paso (si no, se ignoran); un nodo `{ k, quitar: true }` elimina la clave. `pintar`: clases `ref` (encendido, contorno) y `supuesto` (punteado / cursiva).
- [ ] Tests RED → GREEN (comun.test: ref solo en su paso; quitar elimina; navegador: clase `supuesto` con `stroke-dasharray`).

### Task 2: Vista de tira
Botón «▦ tira» bajo los controles: panel con una miniatura SVG por paso (estado estático) y su número; clic → ir a ese paso y cerrar el panel. `Esc` cierra.
- [ ] Test navegador RED → GREEN: N miniaturas; clic en la 3 → `3/N`.

### Task 3: Color compartido en KaTeX
Macros `\cResto{…}`, `\cSalto{…}`, `\cDado{…}`, `\cAux{…}`, `\cRes{…}` → `\htmlClass{k-…}{…}` con `trust` limitado a `\htmlClass`. Aplicar a r, q y s/d en cor-mcd-resto, teo-menor-combinacion, teo-euclides y coeficientes.
- [ ] Test contenido (KaTeX con las mismas opciones) + navegador (un `.k-ambar` dentro de la demostración) RED → GREEN.

### Task 4: Euclides como rectángulo cortado en cuadrados
Pieza `rectanguloEuclides(id, filas, { x, y, ancho, alto, hasta })`: rectángulo a×b a escala; cada fila corta q cuadrados de lado b (si q > 12, un único bloque rotulado «q cuadrados de b»); el último lado es el mcd. Lupa: el rectángulo-resto actual reescalado al lado. `teo-euclides` la usa.
- [ ] Tests RED → GREEN: 45×16 → bloques de 2, 1, 4, 3 cuadrados; 4999×2 no pasa de 30 rect; último lado = mcd.

### Task 5: Restos con su expresión y reiluminado en coeficientes
`ej-euclides-3088`: cada carril lleva «rᵢ = 3088·sᵢ + 456·tᵢ» (Euclides extendido hacia delante; termina en 8 = 3088·(−22) + 456·149). Coeficientes (teo y ej): cada paso reilumina con `ref` la fila de Euclides cuyo cociente usa y la fila anterior de la tabla.
- [ ] Tests RED → GREEN.

### Task 6: Bézout y solución general
`teo-menor-combinacion`: S = {c₁, c₂, c₃, …}; r supuesto punteado con su etiqueta de combinación (valores reales), que desaparece en el paso «r = 0». `teo-solucion-general`: bloques rotulados «mcm(a,b)».
- [ ] Tests RED → GREEN.

### Task 7: Revisión
- [ ] Suite, fuzz, render de lo tocado, contraste de la paleta medido (ratio WCAG sobre #000), revisión final.
