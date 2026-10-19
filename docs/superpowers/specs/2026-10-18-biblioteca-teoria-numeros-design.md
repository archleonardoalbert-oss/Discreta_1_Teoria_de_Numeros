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

- **Recta numérica con saltos** (base de todo). `a | b` ⇔ saltando de longitud `a` desde 0 se cae exactamente en
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
