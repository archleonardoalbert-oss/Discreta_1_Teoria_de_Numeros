# Tres idiomas visuales (recta, rectángulo, conjunto) — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans (elegido por el usuario: ejecución directa). Steps use checkbox (`- [ ]`) syntax.

**Goal:** Añadir los idiomas «rectángulo de cuadraditos» y «conjunto» a las piezas comunes y rehacer con ellos las escenas del Libro II donde la recta era insuficiente.

**Architecture:** Dos primitivas nuevas en `escenas/primitivas.js` (`conjunto`, `rectangulo`), reutilizables por cualquier libro; las escenas afectadas las usan en vez de puntos/listas en la recta.

**Tech Stack:** el del proyecto (JS sin frameworks, SVG, `node --test`, playwright-core).

**Spec:** `docs/superpowers/specs/2026-10-18-biblioteca-teoria-numeros-design.md` §4 (actualización 2026-10-19).

## Global Constraints

- Conjunto definido por propiedad (p. ej. S del PBO): **solo símbolos** `s₁, s₂, s₃, …`, ordenados de menor a mayor desde el principio; el PBO **solo señala el de la izquierda**; la condición que lo define siempre escrita junto al conjunto.
- Conjunto concreto (divisores): **números reales**, `D(12) = {1, 2, 3, 4, 6, 12}`.
- Producto `a·b`: rectángulo de `a` × `b` cuadraditos con los dos lados rotulados y la unidad visible.
- Todo lo demás del spec y del plan de fase 1 sigue vigente (colores con significado, un movimiento por paso, nada fuera de la vista, test genérico de escenas).

## Review Focus

1. Conjuntos con muchos elementos (D(120) tiene 16): no se salen de la vista → el test genérico de ancho de texto lo vigila; `conjunto` reparte en varias filas si no cabe.
2. Rectángulos grandes: el lado del cuadradito se reduce y hay tope (validar avisa).
3. El PBO señala exactamente el primer elemento, también al volver con ◀ (test de resaltado ya existente).

---

### Task 1: Primitivas `conjunto` y `rectangulo`

**Files:** Modify `escenas/primitivas.js`, `tests/primitivas.test.mjs`

**Interfaces — Produces:**
- `conjunto(id, { x, y, nombre, elementos: string[], definicion?, c = 'violeta', señalado = -1, ancho = 680 }) → Nodo[]`: texto `nombre = {`, los elementos separados por comas (fila nueva si no caben en `ancho`), `}` y debajo la definición en tenue. Cada elemento es un nodo de texto con clave `${id}:e${i}`; el `señalado` va en ámbar con un aro (`${id}:aro`) y un rótulo «mínimo (PBO)» debajo.
- `simbolos(letra, n) → string[]`: `['s₁', 's₂', …, 'sₙ', '…']`.
- `rectangulo(id, { x, y, filas, cols, lado, c, etiquetaFilas, etiquetaCols, unidad = '1' }) → Nodo[]`: la `cuadricula` existente + rótulos de los lados (izquierda: filas, arriba: columnas).

- [ ] Tests (RED): `conjunto` con 3 elementos produce textos `s₁`, `s₂`, `s₃` en x creciente y la definición; con `señalado: 0` el aro está sobre `s₁`; con 16 números y ancho 680 ningún texto pasa de 680; `rectangulo` rotula `a = 4` y `b = 6` y tiene 24 celdas.
- [ ] Implementar → GREEN → commit `feat: primitivas conjunto y rectángulo`.

### Task 2: S del PBO como conjunto simbólico (`teo-menor-combinacion`)

- [ ] Test (RED): en el paso 4 (índice 3) hay `S:e0 = 's₁'` y ningún nodo de puntos `s<número>`; en el paso 5 el señalado es `s₁` (aro) y la nota dice `s = s₁`; en el paso 8 aparece un elemento ámbar `r` a la izquierda de `s₁`.
- [ ] Escena: S = {s₁, s₂, s₃, …} con «d > 0, d = a₁x₁ + … + aₙxₙ»; PBO señala s₁ = s; contradicción: «r» intenta colocarse a la izquierda de s₁. La recta queda para `a₁ = s·q + r` y para «s cae en todos los aᵢ».
- [ ] GREEN → commit.

### Task 3: Conjuntos de divisores con números reales

`prop-signos` (D(a) = D(−a)), `def-primos-relativos` (D(a), D(b), D(a) ∩ D(b) = {1}), `teo-divisores-comunes` (D(a) ∩ D(b) = D(d)).
- [ ] Tests (RED): textos de elementos con los números reales (p. ej. D(8) contiene «1», «2», «4», «8» como elementos), intersección marcada en verde; las conclusiones existentes se mantienen.
- [ ] Escenas → GREEN → commit.

### Task 4: Productos como rectángulos

`teo-multiplos-comunes` (rectángulo a × b; sus b columnas se reparten en d tiras de b/d: una tira tiene ab/d cuadraditos = [a,b]), `cor-mcm-mcd` y `teo-divide-producto` usan `rectangulo` (lados rotulados).
- [ ] Tests (RED): en `teo-multiplos-comunes` último paso existe un rectángulo con `a·b` celdas y un rótulo `ab/d = 12` para (4, 6); `cor-mcm-mcd` rotula los lados `|a| = 4` y `|b| = 6`.
- [ ] Escenas → GREEN → commit.

### Task 5: Guía, recorrido y revisión

- [ ] `docs/como-añadir-un-libro.md`: tabla de piezas con `conjunto`, `simbolos`, `rectangulo` y la regla de los tres idiomas.
- [ ] Suite completa + fuzz de textos + render de las escenas tocadas; revisión final de la rama.
