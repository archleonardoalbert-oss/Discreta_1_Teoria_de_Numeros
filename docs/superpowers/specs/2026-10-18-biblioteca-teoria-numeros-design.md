# Biblioteca de Teoría de Números — diseño

Fecha: 2026-10-18 · Carpeta del proyecto: `~/Leo/Tutoriales/TeoriaNumeros`

## 1. Qué es y por qué

Una web local que acompaña las **5 conferencias de Matemática Discreta I (Teoría de Números)** del usuario y
las convierte en aprendizaje **muy visual**. Cada definición, lema, teorema, corolario, propiedad y ejemplo de
las conferencias tiene su página con el texto de la conferencia y, sobre todo, una **animación que construye el
modelo mental de la idea clave**.

El problema que resuelve (palabras del usuario): sí forma imágenes mentales, pero se le «llena la RAM del
cerebro» cuando un paso exige recordar demasiada información —sobre todo numérica— de pasos anteriores. Si lo
ve en una imagen bien organizada y limpia, lo sigue muy bien.

**Éxito** = al terminar una página, el usuario puede cerrar los ojos y reproducir la idea; la animación nunca le
pide recordar algo que ya no está en pantalla.

Fuente de verdad: los PDF en `~/Descargas/Telegram Desktop/Discreta/Conf/MD-I-Conf-0{1..5}.pdf` (copiarlos a
`fuentes/` del proyecto). `pdftotext` pierde subíndices, exponentes y sumatorias: **leer las fórmulas mirando el
PDF renderizado** (p. ej. `pdftoppm -png`), no del texto extraído.

## 2. Objetivos, no-objetivos, anti-objetivos

**Objetivos**
- Cubrir **todos y cada uno** de los elementos de las 5 conferencias, en el orden de la conferencia.
- Por cada elemento: enunciado literal + explicación + demostración (si la hay) paso a paso + animación.
- Entradas numéricas **editables**; la animación se reconstruye con los nuevos valores.
- Funciona **sin internet**.

**No-objetivos (por ahora)**
- Las clases prácticas (CP-01…05): fuera de alcance; la biblioteca deja hueco para añadirlas como libros después.
- Ejercicios, autoevaluación, progreso guardado.

**Anti-objetivos (sería un fracaso aunque funcione)**
- Una animación cargada: muchas cosas moviéndose a la vez, o que obligue a recordar datos de pasos anteriores.
- Una demostración «reinventada» distinta de la de la conferencia.
- La paleta neón del curso de DP (`~/Leo/Tutoriales/DP`). El usuario pidió explícitamente **no** usarla.
- Texto incómodo de leer (fuente pequeña, contraste duro blanco-puro sobre negro, líneas largas).

## 3. Decisiones del usuario (no deshacer)

1. **Avance paso a paso controlado por el usuario** (◀ ▶). Nada avanza solo.
2. Cada paso de una demostración muestra **exactamente el texto de la conferencia**; la animación «le da vida» a
   ese paso, fiel a cómo se hizo en clase. Lo mismo para cada enunciado.
3. **Erratas corregidas y demostraciones ausentes completadas** (ver §8).
4. **La memoria vive en el dibujo** (opción «B» elegida en boceto): cada dato producido en un paso queda escrito
   pegado a la parte del dibujo que lo produjo (saltos numerados, llaves con su valor, etiquetas). **Sin** panel
   lateral de «lo que ya sabemos» y **sin** tira de fichas.
5. **Entradas editables** por el usuario.
6. **Biblioteca**: la portada es una fila de **libros de frente** (portadas, no lomos), uno por conferencia, cada
   uno con su color y un pequeño dibujo de su idea central. Huecos/espacio para libros futuros.
7. **Página de elemento — distribución B**: enunciado arriba; debajo, a la izquierda la **demostración entera**
   (paso actual resaltado, pasados en gris legible, futuros apagados) y a la derecha la **animación** con las
   entradas y los controles.
8. **Paleta mucho más oscura** que la de DP (ver §6).
9. **Orden de construcción: Conferencia 2 primero** (es la más sustanciosa para calificar las animaciones), luego
   1, 3, 4, 5.

## 4. Lenguaje visual (del usuario)

Es el «idioma» común de toda la web; se mantiene igual en todas las conferencias para no reaprenderlo.

**Actualización 2026-10-19 (tras calificar el Libro II, palabras del usuario):** «la recta numérica es bastante
buena pero no es suficiente». Hay **tres idiomas** y cada concepto usa el suyo:

1. **Recta con saltos**: divisibilidad, división con resto, sumas, combinaciones lineales («avanzar»).
2. **Rectángulo de cuadraditos**: todo producto `a·b` = `a` cuadraditos por `b` cuadraditos, con los lados
   rotulados y la unidad visible. No se representan productos como saltos repetidos cuando el producto es el
   protagonista.
3. **Conjunto**: un contenedor `{ … }` con sus elementos y, al lado, la condición que lo define (siempre claro
   quiénes son). Dos variantes:
   - **Conjunto definido por una propiedad** dentro de una demostración (p. ej. `S` del PBO): elementos **solo con
     símbolos** (`s₁, s₂, s₃, …`), dibujados **ordenados de menor a mayor desde el principio**; el PBO **solo
     señala el de la izquierda** (el mínimo).
   - **Conjunto concreto** (p. ej. divisores de 12): elementos con **sus números reales**, `D(12) = {1, 2, 3, 4, 6, 12}`.

- **Recta numérica con saltos**. `a | b` ⇔ saltando de longitud `a` desde 0 se cae exactamente en
  `b` tras `q` saltos. Si `a ∤ b`, `r` es la distancia mínima a `b` a la que se queda sin pasarse.
- **Negativos** (palabras del usuario): la recta se extiende a la izquierda de 0 y un coeficiente negativo
  son **saltos hacia la izquierda**. `3088·(−22)` = 22 saltos de 3088 hacia la izquierda desde 0;
  `3088·(−22) + 456·149` = esos saltos y después 149 saltos de 456 hacia la derecha, terminando en 8. Lo mismo
  para `mcd(−a, b)`, los coeficientes Aᵢ/Bᵢ que alternan signo, `r = a − sb` y `k` negativo en la solución
  general.
- **mcd(a, b)** = los saltos más grandes con los que, sin cambiar de salto, se pasa por `a` y por `b`.
- **Multiplicación** = rectángulo de cuadraditos, **con la unidad de medida siempre visible** y cambiante según
  el momento: `ab` en unidades; `ab/d` en bloques de longitud `d`.
- **Cambio de escala / división exacta** (`a/b = k`): explícito, con **dos reglas superpuestas** — la de abajo en
  unidades, la de arriba con una marca cada `b` — y la animación muestra cómo cada bloque de `b` «se convierte»
  en 1 paso de la regla de arriba; `k` es lo que se cuenta arriba. (Al usuario le cuesta hacer esta abstracción
  mentalmente: es prioritario mostrarla siempre que aparezca.)

Para los temas de las conferencias 4–5 (congruencias, sistemas residuales, TCR) el constructor extiende este
idioma de forma coherente (p. ej. la recta enrollada en un reloj de `n` posiciones para «mismo resto»), **siempre
partiendo de la recta con saltos** para que el usuario vea de dónde sale.

**Colores con significado, fijos en toda la web** (decisión del constructor, coherente): p. ej. saltos/divisor =
cian; número objetivo = ciruela; resto = ámbar; conjuntos auxiliares (como `S`) = violeta; resultado/conclusión =
verde. Leyenda accesible en cada animación.

## 5. Estructura y navegación

- **Portada «Biblioteca»**: 5 portadas de libro de frente (Libro I…V) con título de la conferencia, color de
  acento y mini-ilustración de su idea (boceto aprobado: saltos en la recta; barras de mcd/mcm; rectángulos de
  factores primos; reloj de congruencias; tres anillos del TCR). Hover: el libro se eleva ligeramente.
- **Dentro de un libro**: índice de los elementos en el orden de la conferencia, cada uno con etiqueta de tipo
  (DEF, LEMA, TEO, COR, PROP, EJ; colores distintos). Navegación anterior/siguiente entre elementos.
- **Página de elemento** (distribución B):
  - Enunciado literal arriba (con su tipo y nombre).
  - **Explicación** breve en lenguaje llano (escrita por el constructor; ver §8 marcas).
  - Columna izquierda: la demostración completa como lista de pasos (texto literal de la conferencia). El paso
    actual resaltado; pulsar una línea salta a ese paso (decisión propuesta y no rechazada).
  - Columna derecha: escena SVG animada; entradas numéricas editables; controles ◀ ▶ (y ⏮). Teclado ← →.
  - Elementos sin demostración (definiciones, enunciados): igual tienen animación que muestra **qué dicen**,
    con pasos si ayuda a construir la idea por partes.
  - Los **ejemplos** de la conferencia (Euclides con 3088 y 456, combinación lineal −22 / 149, TCR 2,3,2 mod
    3,5,7 → 23, 18x ≡ 30 (42)…) son elementos propios y también los valores iniciales de las animaciones
    relacionadas.
- La granularidad de «paso» sigue las líneas/oraciones de la demostración de la conferencia; el constructor
  puede agrupar líneas algebraicas consecutivas que sean un solo movimiento lógico.

## 6. Aspecto

- **Fondo negro puro** (`#000`), paneles casi invisibles (`#030304`–`#040406`), bordes muy tenues (`#121420`).
- **Acentos apagados**, no neón (tokens del boceto aprobado): cian petróleo `#3aa9bb`, ciruela `#b8509f`, ámbar
  viejo `#c99448`, verde musgo `#4aa97c`, violeta tenue `#7d6cc4`. Texto color hueso `#d6d1c2`, tenue `#5c6175`.
  El constructor puede ajustar para contraste/legibilidad, pero manteniendo esta oscuridad.
- **Lectura cómoda**: serif de pantalla (Literata, en el boceto), ~18 px, interlineado ~1.75–1.8, ancho de
  línea limitado; monoespaciada (JetBrains Mono) solo para etiquetas, entradas y números de la escena.
- Matemáticas con KaTeX.
- Sello propio de «biblioteca» (portadas, tipografía de libro, numeración romana de libros), sin copiar el estilo
  «circuito de luz» de DP.

## 7. Entradas editables y escala

- Cada animación arranca con el **ejemplo de la conferencia** si existe; si no, con valores pequeños y claros.
- El usuario puede editar las entradas; la animación se reconstruye y vuelve al paso actual (o al 1 si el
  paso ya no existe con los nuevos valores, p. ej. Euclides con menos divisiones).
- **Escala automática**: con números grandes (p. ej. 3088) la recta se reescala y agrupa saltos para seguir
  siendo legible (decisión del constructor: p. ej. mostrar «×6» sobre un arco que agrupa 6 saltos). Hay un tope
  por animación; por encima se avisa y no se dibuja algo ilegible.
- **Teoremas con n números** (mcd(a₁…aₙ), a | b₁⋯bₙ…): arrancan con 3 números y el usuario puede añadir o
  quitar entre 2 y 4 (decisión del constructor: más de 4 satura la escena). El motor admite listas de longitud
  variable.
- Validación de precondiciones del enunciado (p. ej. `b > 0`, primos relativos 2 a 2 en el TCR): mensaje claro
  junto a la entrada, sin romper la escena.

## 8. Fidelidad, correcciones y añadidos

- Texto de enunciados y demostraciones = **literal de la conferencia**, salvo correcciones.
- **Marcas discretas** (decisión del constructor, propuesta y no rechazada): «corregido» en erratas;
  «añadido — no está en la conferencia» en demostraciones/explicaciones completadas. Siempre se distingue lo
  literal de lo añadido.
- Erratas / huecos detectados (lista no exhaustiva; el constructor revisa todo al transcribir):
  - Conf-01: «Se debe demostrar también que el PIM implica PBO» → **completar** esa demostración. Lema «todo a
    divide a 0» y teoremas `|a| ≥ |b|`, corolario de compuesto: completar demostración. «demostar» → errata.
  - Conf-02: definición de combinación lineal «a_b ∗ b_n» → `a_n ∗ b_n`. Sin demostración: divisores comunes =
    divisores del mcd; mcd(a₁…aₙ) = mcd(a₁, mcd(a₂…aₙ)); a/(a,b) y b/(a,b) coprimos; a | b₁⋯bₙ con coprimalidad ⇒
    a | bₙ; propiedades de signo; a | b ⇒ mcd = |a|; corolarios del mcm; Algoritmo de Euclides (demostrar que
    termina y que r_k = mcd vía mcd(a,b) = mcd(b,r)) → **completar**.
  - Conf-03: fechada «December 2, 2024» (dejar tal cual). Wilson, Lema p ∤ a ⇒ (p,a)=1, corolario de primos
    `p = q_k`, forma canónica: completar demostraciones. El Pequeño Teorema de Fermat se demuestra en la Conf-04;
    en la Conf-03 enlazar a esa página.
  - Conf-04: propiedades 5 y 7 (ka ≡ kb y aᵏ ≡ bᵏ) confirmar con el PDF; propiedad 9 es `a/c ≡ b/c (n/c)`.
    Teorema de la equivalencia: enunciado dice «se dice que» (redacción) — no tocar salvo que sea error.
  - Conf-05: la demostración del TCR termina cortada («…congruentes entre ellas, como») → completar la frase.
- Las demostraciones añadidas deben usar el mismo estilo y herramientas que la conferencia (PBO, algoritmo de la
  división, combinaciones lineales…), no maquinaria nueva.
- **Comprobar las cuentas**: todos los ejemplos numéricos de la conferencia se verifican por código (ya
  verificados a mano: 8 = 3088·(−22) + 456·149; TCR → 23 mod 105; 18x ≡ 30 (42) → 4, 11, 18, 25, 32, 39).

## 9. Principios de animación (anti-sobrecarga)

1. **Un movimiento por paso.** En cada paso cambia/aparece una sola idea; el resto queda quieto.
2. **Lo nuevo resalta, lo viejo se queda escrito** (atenuado pero legible) en su sitio del dibujo.
3. **Ningún número que se necesite está solo en la memoria del usuario**: si el texto del paso lo usa, está
   visible en la escena.
4. **Unidades visibles** siempre que haya medida o multiplicación; cambio de escala animado, nunca implícito.
5. Animación de transición corta y suave (≈ 0,4–0,8 s) al pasar de paso; retroceder ◀ restaura el estado exacto
   (cada paso es un estado reproducible, no un acumulado de efectos).
6. Respeto a `prefers-reduced-motion` (transiciones instantáneas).

## 10. Construcción (decisiones del constructor, aceptadas por el usuario)

- HTML + CSS + JavaScript sin frameworks; escenas en SVG; KaTeX y fuentes **vendorizados** (sin internet; se
  pueden copiar de `~/Leo/Tutoriales/DP/vendor/`, comprobando versión vigente). Literata no está allí: se
  descarga y vendoriza (licencia OFL).
- Se sirve en local con un lanzador `./abrir-biblioteca` (servidor estático + abre el navegador), como el curso
  de DP. No depender de `file://`.
- Repositorio git propio en la carpeta del proyecto; `.superpowers/brainstorm/` en `.gitignore`.
- Arquitectura a decidir por el constructor, con estas exigencias: separar **contenido** (texto literal de cada
  elemento y sus pasos) de **escenas** (dibujo/animación parametrizada por entradas) y de un **motor** común
  (navegación de pasos, entradas, escala, transiciones). Una escena = función de (entradas, número de paso) →
  estado dibujable, para que ◀ ▶ y el cambio de entradas sean deterministas.
- Responsive razonable: en pantallas estrechas las dos columnas se apilan (demostración arriba, animación
  debajo, ambas visibles al hacer scroll).
- Verificación: test que recorra todas las páginas y pasos en Chromium headless sin errores de consola ni KaTeX
  roto; tests de los cálculos de cada escena (mcd, Euclides, coeficientes, TCR…) contra implementación de
  referencia. Revisión visual renderizando solo las páginas del proyecto (**nunca** capturar la pantalla del
  usuario sin permiso).

## 11. Entrega por fases

1. Motor + biblioteca (portada con los 5 libros, solo el II navegable) + **Conferencia 2 completa**. El usuario
   la revisa y califica las animaciones; sus correcciones se aplican al idioma visual antes de seguir.
2. Conferencia 1. 3. Conferencia 3. 4. Conferencia 4. 5. Conferencia 5.

## 12. Inventario de la Conferencia 2 (primera entrega)

En orden: Def. mcd · Propiedades de signo · Teo. a | b ⇒ mcd(a,b) = |a| (y mcd(a,0) = |a|) · Def. primos
relativos · Def. combinación lineal · Teo. mcd = menor combinación lineal positiva (con demostración) · Teo.
divisores comunes = divisores del mcd · Cor. mcd(a₁…aₙ) = mcd(a₁, mcd(a₂…aₙ)) · Cor. a/(a,b), b/(a,b) primos
relativos · Teo. a | b₁⋯bₙ y mcd(a, b_j) = 1 ⇒ a | bₙ · Cor. a = qb + r ⇒ mcd(a,b) = mcd(b,r) (con dem.) · Def.
ecuación diofántica lineal · Teo. ax + by = c soluble ⇔ mcd(a,b) | c (con dem.) · Teo. Algoritmo de Euclides ·
Ej. mcd(3088, 456) = 8 · Método de coeficientes Aᵢ, Bᵢ · Ej. 8 = 3088·(−22) + 456·149 · Teo. solución general
x = x₀ + k·b/(a,b), y = y₀ − k·a/(a,b) (con dem.) · Def. múltiplo común / mcm · Teo. todo múltiplo común es
k·ab/(a,b) (con dem.) · Cor. [a,b] = |ab|/(a,b) · Cor. todo múltiplo común es múltiplo de [a,b].

Inventarios de las demás conferencias: el constructor los extrae del PDF con el mismo criterio (todo elemento
con nombre o número propio es una página).

## 13. Lo que queda al constructor

Diseño concreto de cada escena dentro del idioma de §4 y los principios de §9; arquitectura interna; colores
semánticos exactos; mini-ilustraciones de las portadas de los libros III–V refinadas; topes de escala;
redacción de explicaciones llanas y demostraciones añadidas (marcadas).

## 14. Reorganización según la investigación (2026-10-19)

Informe: `~/reports/Visualizar teoría de números.md`. Aprobado por el usuario («todo lo demás está perfecto»),
**manteniendo la paleta actual** (no Okabe–Ito; solo medir y ajustar contraste).

Motor:
- **Reiluminar lo que se usa**: un paso puede marcar como referencia nodos de pasos anteriores; se ven encendidos
  solo en ese paso (regla 4 del informe: la referencia es perceptiva, no memorística).
- **Hipotético punteado**: lo supuesto en una contradicción se dibuja con trazo punteado y desaparece al cerrarla.
- **Vista de tira**: todos los estados de la demostración en miniatura; pulsar uno lleva a ese paso.
- **Color compartido fórmula ↔ dibujo** en KaTeX (`\htmlClass`): r en ámbar, saltos/divisor en cian, etc.

Escenas del Libro II:
- Algoritmo de Euclides como **rectángulo cortado en cuadrados** (un cociente por paso; el último lado es el mcd),
  con lupa del rectángulo-resto actual porque los cuadrados se vuelven diminutos.
- Ejemplo 3088/456: cada resto lleva escrita su expresión rᵢ = 3088·sᵢ + 456·tᵢ, que se calcula con una sola resta
  a partir de las dos anteriores (memoria dentro del dibujo).
- Coeficientes Aᵢ, Bᵢ: en cada paso se reiluminan la fila de Euclides cuyo cociente se usa y la fila anterior de la tabla.
- Bézout: el resto r supuesto hereda su etiqueta de combinación y se dibuja punteado; los elementos de S son
  c₁, c₂, c₃, … (decisión del constructor: s₁, s₂ ya son coeficientes en la conferencia).
- Solución general: los dos bloques rotulados «mcm(a, b)».

## 15. Libro III — Conferencia 3 (primos y TFA), 2026-10-20

El usuario pidió usar todo lo aprendido para que las animaciones sean lo más educativas, correctas y claras posible,
«desvinculándote si es necesario de mi manera de ver las cosas». Las representaciones salen del informe
`~/reports/Visualizar teoría de números.md` (reglas cognitivas, criterio de rigor: solo conteos y etiquetas, nunca
medidas a ojo; ejemplos genéricos sin coincidencias; hipótesis siempre visibles; lo supuesto punteado).

Inventario (13 elementos, en orden): Lema p ∤ a ⇒ (p,a)=1 · Lema de Euclides · Teo. p | a₁⋯aₙ ⇒ p | aⱼ · Cor. p | q₁⋯qₙ
(primos) ⇒ p = q_k · Cor. p | aᵏ ⇒ p | a y pᵏ | aᵏ · TFA · Def. descomposición canónica · Cor. forma canónica única ·
Lema primos > 3 son 6q ± 1 · Teo. Wilson · Pequeño Teorema de Fermat · Cor. p | aᵖ − a · Lema n compuestos consecutivos.

Representaciones elegidas (decisiones del constructor):
- Divisibilidad de productos: **fila de cajas de factores** (a₁)(a₂)…(aₙ) con la etiqueta «p | ·» o «p ∤ ·» en cada una;
  la inducción se dibuja como **plantilla** (bloque A = a₁⋯a_k y caja a_{k+1}), no como dominós.
- Lema de Euclides: lenguaje de la Conf 2 (carriles de saltos para ax + py = 1, escalados por b) + rectángulo a×b
  agrupado en bloques de p para «p | ab».
- TFA: **dos árboles de factores distintos** del mismo n (división por el menor primo / por el divisor más cercano a √n);
  existencia = el árbol crece por inducción fuerte; unicidad = dos filas ordenadas de hojas que se cancelan par a par.
- Forma canónica: hojas agrupadas → **vector de exponentes** (una barra por primo).
- 6q ± 1: la recta **enrollada en 6 columnas**; las columnas 0, 2, 4 (pares) y 3 (múltiplos de 3) se tachan; los primos
  > 3 solo quedan en las columnas 1 y 5; la columna 5 se reetiqueta 6k − 1. Aviso: el recíproco es falso (25, 35).
- Wilson: **reloj de p posiciones con cuerdas x — x⁻¹** (x·y deja resto 1); 1 y p − 1 son su propio inverso (rotulado
  también −1); cada cuerda aporta un «1». Recíproco: si n = a·b compuesto, a | (n−1)! y no puede dividir a (n−1)! + 1.
- Fermat: **permutación de restos**: a, 2a, …, (p−1)a dejan restos distintos (flechas dirigidas a 1…p−1), producto y
  cancelación de (p−1)! por el lema de Euclides. Es la misma prueba que la Conf 4 (sin el lenguaje de congruencias).
- n compuestos consecutivos: (n+1)! como producto 1·2·…·(n+1) con el factor k reiluminado en «k | (n+1)! + k».
- Ninguna escena exige recordar números de pasos anteriores; los «p | ·» quedan escritos en cada caja.

## 16. Libros I, IV y V (Conferencias 1, 4 y 5), 2026-10-20

El usuario aprobó el Libro III («está espectacular») y pidió terminar el resto con el mismo criterio: lo más educativo,
correcto y claro posible, con el estilo y la creatividad de 3Blue1Brown. Mismas reglas que §15 (informe, conteos y
etiquetas, hipótesis visibles, supuesto punteado, memoria dentro del dibujo, un movimiento por paso).

Nuevo tipo de elemento: **Principio** (PBO y PIM no se demuestran).

### Libro I — Conferencia 1 (13 elementos)
PBO · PIM · Teo. PBO ⇔ PIM · Ej. Σ(2k−1) = n² · Def. a | b · Lema a | 0 · Teo. b | a ⇒ |a| ≥ |b| · Teo. transitividad ·
Algoritmo de la división · Def. primo · Cor. compuesto ⇔ n = ab · Lema divisor primo (tres demostraciones) · Infinitud de primos.
- PBO: **barrido** que sale de 1 y se detiene en el primer punto de A; contraste con ℤ (no hay de dónde salir).
- PIM: **plantilla** P(n) ⇒ P(n+1) que se estampa casilla a casilla (no dominós).
- PBO ⇒ PIM: patrón del **contraejemplo mínimo** sobre una cinta simbólica n₀, …, m−1, m; C punteado se desvanece.
  PIM ⇒ PBO (añadida): un muro «ninguno de 1…n está en A» que avanza.
- Σ(2k−1) = n²: **escuadras** de cuadraditos (gnomones) que envuelven el cuadrado (m−1)² y lo completan a m².
- a | b: saltos desde 0 que caen en b + el mismo producto como rectángulo |a| × |q| (apoyo a la traducción).
- Transitividad: cada salto de b se despliega en q₁ saltos de a; luego un muro de q₁ × q₂ ladrillos «a».
- División: saltos de b desde a hacia el 0; S = {c₁, c₂, …} simbólico; r = mín S; r − b punteado a la izquierda del
  mínimo; unicidad con la franja (−b, b) donde el único múltiplo de b es 0.
- Primo: n cuadraditos que solo forman el rectángulo 1 × n (intentos con filas de 2, 3, … dejan sobrantes en ámbar).
- Divisor primo: escalera de descenso con el suelo 1 dibujado; inducción fuerte como franja [2, n−1] supuesta; D concreto
  con su mínimo y un p punteado que tendría que estar a su izquierda.
- Infinitud: una serie de saltos por cada pᵢ que cae en P = p₁⋯p_k, y m = P + 1 a un paso de todas (resto 1);
  contraste 30031 = 59·509 (m no tiene por qué ser primo).

### Libro IV — Conferencia 4 (22 elementos)
Def. congruencia · Teo. ⇔ n | a − b · Teo. relación de equivalencia · Propiedades básicas 1–10 (una página cada una) ·
Teo. cancelación (n/d) · dos corolarios · Propiedades fuertes 1–4 · Def. solución de f(x) ≡ 0 · Teo. la clase entera es
solución · Pequeño Teorema de Fermat (versión con congruencias).
- Idioma base: **la recta enrollada en n columnas** (fila q = qn … qn + n − 1; negativos en filas por encima del 0).
  Congruentes = misma columna; a − b = saltos verticales de n.
- Propiedades: suma = desplazar dos representantes lo mismo; producto ac − bd = c(a − b) + b(c − d) como **rectángulo
  en L** con tiras de anchura múltiplo de n; prop. 9 como **cambio de escala** (reglas dobles, la unidad pasa a ser c);
  prop. 10 cada salto de n se parte en saltos de c.
- Cancelación: **aplicación x ↦ cx** dibujada como dos filas 0…n−1 con flechas; con d > 1 la aplicación pliega
  (llegan d flechas a cada imagen) y solo se recupera la clase mod n/d; con mcd = 1 es biyección.
- Fermat: flechas i ↦ a·i (mod p) entre dos filas, cada casilla recibe exactamente una; producto de ambas filas.

### Libro V — Conferencia 5 (9 elementos)
Def. SRC · Teo. k·SRC es SRC · Def. ecuación lineal congruencial · Teo. soluble ⇔ (a, n) | b · Ej. 3x ≡ 9 (7) ·
Teo. exactamente d soluciones · Ej. 18x ≡ 30 (42) · Cor. solución única · Teorema Chino del Resto · Ej. 2, 3, 2 (mod 3, 5, 7).
- SRC: cada elemento vuela a su columna; cada columna recibe exactamente uno.
- k·SRC: flechas x ↦ kx entre dos filas; la colisión supuesta (punteada) obligaría a una colisión arriba.
- ax ≡ b: x ↦ ax con **contador de llegadas**: la imagen es una sola órbita espaciada d y cada casilla recibe d flechas.
- d soluciones: saltos de n/d desde x₀; d saltos completan una vuelta n (t = qd + r).
- 18x ≡ 30 (42): las 6 soluciones en un reloj de 42 forman un hexágono regular.
- TCR: la **matriz de «vectores base»** pⱼsⱼ (1 en su módulo, 0 en los demás); A = Σ aᵢpᵢsᵢ; unicidad con las series
  de saltos de cada nᵢ. Ejemplo de Sunzi: tres series de saltos sobre una recta 0…105 que coinciden solo en 23.

## 17. Clases prácticas (CP-01…05), 2026-10-20

Fuente: `~/Descargas/Telegram Desktop/Discreta/CP/MD-I-CP-0{1..5}.pdf` (copiados a `fuentes/cp/`). La CP n acompaña a la
Conferencia n y vive dentro del Libro n. Leer las fórmulas del PDF renderizado: `pdftotext` pierde exponentes
(«270 + 370» es $2^{70} + 3^{70}$).

### Para qué (palabras del usuario)
La CP sirve para **poner en práctica los conceptos de la conferencia**; la web es un **apoyo para que él resuelva**,
no para ver la solución. Le cuesta sobre todo **el comienzo** (p. ej. ver qué descomposición hace visibles los factores).
Quiere pedir **pistas muy estratégicas, poco a poco**, que lo encaminen sin dar una ayuda fuerte; cuando él decida, ver
una **solución modelo paso a paso** y al final **qué se supone que aprenda**: el resultado, y sobre todo el método o la
forma de pensar usada en medio, y cómo aplicarlo a otros problemas.

### Reglas (del usuario, no deshacer)
1. **La primera pista de cada ejercicio (y de cada apartado) es siempre el concepto de la conferencia que se aplica**,
   con enlace a su página del libro. Es la pista más valiosa: la correspondencia conferencia ↔ CP es el objetivo.
2. **Notación matemática correcta y cómoda**: nada de «/» ni «∗» ni símbolos raros; fracciones con `\frac`,
   producto con `\cdot` o yuxtaposición, $\mid$, $\nmid$, $\equiv$, $\pmod{n}$ o $(n)$ como en la conferencia,
   $(a, b)$ y $[a, b]$ para mcd y mcm. El enunciado se transcribe literal en contenido pero bien tipografiado
   (el «∗» del PDF se escribe $\cdot$ o $\times$).
3. Pistas **una a una, a petición**; nunca se ve la siguiente sin pedirla. Orden: concepto → estrategia (qué tipo de
   movimiento) → arranque (dónde mirar para el primer movimiento, sin hacerlo) → desbloqueos de los atascos
   siguientes. Como lo más duro es empezar, **la mayoría de las pistas trabajan el arranque**. Ninguna pista hace
   una cuenta clave ni enuncia el paso que resuelve.
4. **Planteamiento visual solo si es posible y práctico**: muestra qué se pide y los datos, nunca la idea clave.
5. «Ver solución» cuando él quiera: paso a paso, cada implicación justificada (mismo rigor que los libros, §16 y
   feedback de rigor), con las herramientas de la conferencia; si usa un resultado de otra conferencia, lo nombra y
   enlaza.
6. Al terminar la solución: **«Qué te llevas»** = resultado + 2–4 ideas/métodos reutilizables, cada uno con cuándo
   reconocerlo en otro problema.
7. Fuera de alcance (otra rama, más adelante): escribir y verificar sus propias soluciones en la web.

### Estructura (decisiones del constructor)
- Contenido: `libros/N/practica.js` → `{ numero, fecha, ejercicios: [...] }`. Ejercicio:
  `{ id, numero, nombre, enunciado, marcaEnunciado?, nota?, planteamiento?, partes }`.
  - `nota`: aclaración del enunciado (errata, convención como $0 \in \N$), marcada.
  - `planteamiento`: `{ texto, pasos: [{texto}], escena }` (escena con el mismo contrato que las de los libros).
  - `partes`: siempre una lista (un solo elemento sin `etiqueta` si no hay apartados). Parte:
    `{ id, etiqueta?, enunciado?, pistas, solucion: { pasos, escena? }, aprendes: { resultado, ideas: [{idea, texto}] } }`.
  - Pista: `{ tipo: 'concepto' | 'estrategia' | 'arranque' | 'desbloqueo', texto, enlaces?: [{ l, e }] }`.
- Página `ejercicio.html?l=N&x=<id>`: migas · número y nombre · enunciado · nota · planteamiento (si hay; dos
  columnas como los elementos) · por cada parte: botón «Pedir pista (k de n)» que muestra el tipo de la siguiente,
  tarjetas de pistas abiertas, botón «Ver solución» → pasos que se revelan uno a uno con ▶ (los futuros ocultos, para
  poder intentar adivinar el siguiente; «mostrar todos»); al revelar el último aparece «Qué te llevas».
  Con escena de solución, distribución B como los elementos. Anterior/siguiente ejercicio.
- Progreso (pistas abiertas, solución vista) en `localStorage` por parte, con botón «empezar de cero»; si el
  almacenamiento falla, la página funciona igual.
- Índice del libro: tras los elementos, sección «Clase práctica N · fecha» con los ejercicios.
- Página de elemento: «Se practica en» con enlaces a los ejercicios cuya pista-concepto lo cita (correspondencia en
  ambos sentidos).
- Tests: estructura; primera pista de cada parte = concepto con enlaces a elementos existentes; ≥ 3 pistas por parte;
  ≥ 3 pasos de solución; resultado + ≥ 2 ideas; KaTeX sin errores; ni «/» ni «∗» ni «*» dentro de fórmulas; todas las
  respuestas numéricas verificadas por código; recorrido en navegador (pistas una a una, solución oculta hasta pedirla).

### Erratas y aclaraciones detectadas
- CP-02 5(c): $(a,b,c) = \frac{abc}{(ab,bc,ca)}$ es falso ($a = 2, b = 3, c = 1$: $1 \ne 6$); lo cierto es
  $[a,b,c] = \frac{abc}{(ab,bc,ca)}$ → corregido y marcado, con el contraejemplo en la nota.
- CP-03 1: «pimo» → primo. CP-01 3: «diferencia modular» = diferencia en valor absoluto, $|x - y| \le 1$.
- CP-04 4: depende de si $0 \in \N$: con $a, b \ge 0$ hay 5 ternas, con $a, b \ge 1$ hay 4 (se dicen ambas).
- CP-04 9: con $a = 1$ ambos números son $0$ y el mcd no está definido → se pide $a > 1$ (nota).
- CP-04 5: redacción «Sea P un número primo tal que si…» → se lee «Demuestre que si $P$ es primo, $P \equiv 5 \pmod 8$…».
- CP-01 8: el producto incluye el factor $(x - x) = 0$; el dato de la suma es una distracción (la solución lo dice).

### Planteamientos visuales elegidos (constructor)
CP-01 3 (descomposiciones como filas de cuadraditos, ejemplos y no-ejemplos), CP-01 5 (recta con lo alcanzable con
saltos de 4 y 5), CP-01 6 (polígono simple y una triangulación de ejemplo), CP-01 7 (tablero $2^k \times 2^k$ sin una
casilla y la pieza en L), CP-02 4 (marcas $a, 2a, \dots, ba$ y múltiplos de $b$), CP-02 6 (recta $ax + by = c$ con sus
puntos enteros y un segmento de longitud $\sqrt{a^2 + b^2}$), CP-05 3 (los huevos agrupados de $m$ en $m$).
Escenas de solución: CP-01 7 (la inducción por cuadrantes) y CP-02 6 (soluciones separadas por el vector $(b, -a)$).
Los demás ejercicios son álgebra: sin dibujo.
