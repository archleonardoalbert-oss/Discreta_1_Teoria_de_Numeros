# Biblioteca de Teoría de Números

Herramienta de estudio, visual e interactiva, para la parte de **Teoría de Números** de la asignatura
**Matemática Discreta I** de la **Universidad de La Habana** (curso 2025–2026).

Cada conferencia es un «libro». Dentro de cada libro, cada definición, lema, teorema, corolario, propiedad
y ejemplo tiene su página con:
- el enunciado de la conferencia;
- una explicación breve en lenguaje llano;
- la demostración paso a paso;
- una animación que construye la idea paso a paso.

Además, cada libro incluye su **clase práctica**: los ejercicios con pistas graduadas, una solución modelo y
un resumen de las ideas reutilizables.

Para construir la web se utilizaron las **conferencias y clases prácticas reales** de la asignatura en el
curso 2025–2026: cinco conferencias de Teoría de Números y sus cinco clases prácticas. Los enunciados, las
definiciones y los ejercicios son los mismos que se trabajan en clase, en el mismo
orden.

> **Aviso importante.** No es material oficial de la asignatura ni sustituye a las conferencias, las clases
> prácticas ni la orientación del profesorado. Es un complemento para estudiar.
>
> Ante cualquier discrepancia, manda el material del curso y lo que indiquen los profesores. Si encuentras
> un error, repórtalo (ver [Reportar errores](#reportar-errores)).

---

## Índice

- [Contenido](#contenido)
- [Cómo está pensada](#cómo-está-pensada)
- [Uso](#uso)
- [Cómo estudiar con la biblioteca](#cómo-estudiar-con-la-biblioteca)
- [Fidelidad al material del curso](#fidelidad-al-material-del-curso)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Desarrollo](#desarrollo)
- [Créditos y licencias](#créditos-y-licencias)
- [Reportar errores](#reportar-errores)

---

## Contenido

| Libro | Conferencia | Elementos | Clase práctica |
|---|---|---|---|
| **I** | Principios · Divisibilidad: Principio del Buen Orden, Inducción, algoritmo de la división, primos, infinitud de los primos | 13 | CP 1 · 8 ejercicios |
| **II** | mcd · Diofantinas · mcm: identidad de Bézout, algoritmo de Euclides (y sus coeficientes), ecuaciones diofantinas lineales y su solución general, mcm | 22 | CP 2 · 8 ejercicios |
| **III** | Primos · Teorema Fundamental: lema de Euclides, factorización única, forma canónica, teoremas de Wilson y de Fermat | 13 | CP 3 · 8 ejercicios |
| **IV** | Congruencia: definición, relación de equivalencia, propiedades básicas y fuertes, cancelación, Pequeño Teorema de Fermat | 23 | CP 4 · 9 ejercicios |
| **V** | Sistemas residuales · TCR: sistemas residuales completos, ecuaciones lineales congruenciales, Teorema Chino del Resto | 10 | CP 5 · 9 ejercicios |

En total: **81 elementos** de las conferencias y **42 ejercicios** de las clases prácticas.

---

## Cómo está pensada

### La página de un elemento

- **Arriba**: el enunciado de la conferencia y una explicación breve.
- **A la izquierda**: la demostración entera.
  - El paso actual está resaltado y los anteriores siguen legibles.
  - Pulsar una línea salta a ese paso.
- **A la derecha**: la animación. Avanza **solo cuando el estudiante lo pide** (◀ ▶ o las flechas del teclado).
  - La vista de **tira** muestra todos los pasos en miniatura.
  - Las **entradas son editables**: puedes cambiar los números del ejemplo y la animación se reconstruye.
- **Al final**: «para tus demostraciones · ideas que te llevas», las técnicas reutilizables de esa demostración.
  Por ejemplo, el contraejemplo mínimo, «sumar y restar lo mismo» o reducir antes de operar.
- **«Se practica en»**: los ejercicios de las clases prácticas que usan ese resultado.

### El lenguaje visual

Todas las animaciones usan el mismo «idioma», para no tener que aprenderlo de nuevo en cada página:

1. **Recta numérica con saltos** para la divisibilidad, la división con resto, las sumas y las combinaciones
   lineales.
   - Decir que $a \mid b$ es decir que, saltando de $a$ en $a$ desde $0$, se cae exactamente en $b$.
   - Los coeficientes negativos son saltos hacia la izquierda.
2. **Rectángulo de cuadraditos** para todo producto. La unidad siempre está a la vista.
3. **Conjuntos**:
   - los definidos por una propiedad, como en el Principio del Buen Orden, con elementos simbólicos ordenados $c_1, c_2, \dots$;
   - los concretos, como los divisores de $12$, con sus números.
4. Para las congruencias, la **recta enrollada** en $n$ columnas: dos números son congruentes si caen en la
   misma columna.

Los **colores tienen un significado fijo** en toda la web: cian para los saltos o el divisor, ciruela para el
número dado, ámbar para el resto o el paso actual, violeta para lo auxiliar y verde para el resultado. Cada
animación muestra su leyenda.

Principios de diseño:
- **un movimiento por paso**;
- **ningún dato necesario queda fuera del dibujo** (la memoria vive en la imagen, no en la cabeza de quien estudia);
- lo supuesto en una demostración por contradicción se dibuja **punteado**;
- lo que se reutiliza de un paso anterior se **reilumina**.

### La página de un ejercicio (clase práctica)

Su papel es **acompañar a quien resuelve, no darle la solución**:

1. **Enunciado** del ejercicio y, si hace falta, una **aclaración** (erratas, convenciones).
2. **Planteamiento visual**, solo cuando ayuda de verdad a ver qué se pide. Muestra los datos y la pregunta,
   nunca la idea clave.
3. **Pistas a petición, una a una**. El botón anuncia de qué tipo es la siguiente:
   - la **primera** es siempre **el concepto de la conferencia** que se aplica, con enlace a su página;
   - después vienen **estrategia**, **arranque** (la mayoría, porque empezar suele ser lo más difícil) y
     **desbloqueos** para los atascos siguientes;
   - ninguna pista hace la cuenta clave.
4. **«Ver solución»**: una solución modelo que se revela **paso a paso**, sin mostrar el siguiente, para que
   se pueda intentar adivinarlo. Cada implicación está justificada y nombra el resultado que usa.
5. **«Qué te llevas»**: al terminar la solución, el resultado y los métodos o formas de pensar que sirven en
   otros problemas, con indicaciones de cuándo reconocerlos.

Los ejercicios con apartados tienen pistas y solución separadas por apartado.

El progreso (pistas abiertas, solución vista) se guarda **solo en el navegador** de quien lo usa. No se envía
a ningún sitio y se puede borrar con «empezar de cero».

---

## Uso

### Requisitos

- **Python 3** (cualquier versión actual), solo para servir los archivos en local.
- Un **navegador moderno**: Firefox, Chrome, Chromium o Edge.
- **No necesita internet.** KaTeX y las fuentes vienen incluidos en `vendor/`.

### Abrir la biblioteca

Desde la carpeta del proyecto:

```sh
# Linux / macOS
./abrir-biblioteca

# Windows (o si el archivo no es ejecutable)
python abrir-biblioteca
```

El script levanta un servidor local en `http://localhost:8780/` (o el siguiente puerto libre) y abre el
navegador. Si el navegador no se abre solo, copia en él la dirección que aparece en la terminal. Para cerrar,
pulsa `Ctrl+C`.

Las páginas no funcionan abriendo los `.html` directamente (`file://`): los módulos de JavaScript necesitan
el servidor local.

### Atajos

| Tecla | Acción |
|---|---|
| `→` / `←` | paso siguiente / anterior (páginas de elementos) |
| clic en una línea | ir a ese paso de la demostración |
| `Esc` | cerrar la vista de tira |

---

## Cómo estudiar con la biblioteca

Una recomendación, basada en cómo está construida:

1. **Primero la conferencia**, en clase o en el material del curso. Después, la página del elemento para
   *ver* la idea: avanza paso a paso y cambia los números del ejemplo para comprobar que la entiendes en
   otros casos.
2. Al terminar cada demostración, **lee «ideas que te llevas»**: ahí está lo que se puede reutilizar en otros
   ejercicios.
3. En la clase práctica, **intenta el ejercicio con papel y lápiz antes de pedir ninguna pista**.
4. Pide **una pista cada vez**. La primera solo te dice qué parte de la conferencia aplicar, y a menudo con
   eso basta. Vuelve a intentarlo antes de pedir la siguiente.
5. Abre la solución cuando la hayas terminado o cuando de verdad estés bloqueado. Antes de pulsar
   «siguiente paso», intenta adivinar cuál será.
6. Contrasta siempre tus soluciones con las de la clase práctica y consulta las dudas con los profesores.

---

## Fidelidad al material del curso

- Los **enunciados** y las **demostraciones de las conferencias** se transcriben literalmente del material
  del curso, con su notación. En las clases prácticas, el enunciado se transcribe literal pero con notación
  matemática correcta (por ejemplo, $\cdot$ en lugar de `*`).
- Todo lo que **no** está en el material original va marcado. Los rótulos de las páginas lo indican:
  - **«corregido»**: una errata corregida (con el texto original explicado en la aclaración, cuando procede);
  - **«añadido · no está en la conferencia»**: pasos intermedios que justifican una implicación, o
    demostraciones que la conferencia deja sin hacer;
  - las explicaciones, los planteamientos, las pistas, las soluciones de las clases prácticas y las secciones
    de ideas son elaboración propia de esta herramienta, **no del profesorado**.
- Las demostraciones añadidas usan las herramientas de la propia conferencia (Principio del Buen Orden,
  algoritmo de la división, combinaciones lineales…), no maquinaria nueva. Si una solución usa un resultado
  de otra conferencia, lo dice y lo enlaza.
- **Todas las cuentas numéricas** de los ejemplos y de las soluciones están **verificadas por código**, por
  fuerza bruta cuando es posible (ver `tests/practica-cuentas.test.mjs`).

Algunas observaciones sobre enunciados de las clases prácticas, explicadas en la página de cada ejercicio:

| Ejercicio | Observación |
|---|---|
| CP 2 · 5(c) | Tal como está escrita, $(a,b,c) = \frac{abc}{(ab,bc,ca)}$ es falsa: con $a=2$, $b=3$, $c=1$ queda $1 \ne 6$. Se demuestra la versión correcta, $[a,b,c] = \frac{abc}{(ab,bc,ca)}$. |
| CP 4 · 4 | El número de ternas depende de si $0 \in \mathbb{N}$: hay 5 con $a, b \ge 0$ y 4 con $a, b \ge 1$. Se dan ambas. |
| CP 4 · 9 | Hace falta $a > 1$: con $a = 1$ los dos números son $0$ y su mcd no está definido. |
| CP 4 · 5 | Se aclara la redacción del enunciado. |
| CP 1 · 3 | «Diferencia modular» se interpreta como diferencia en valor absoluto. |

---

## Estructura del proyecto

```
index.html, libro.html, elemento.html, ejercicio.html   páginas (portada, índice, elemento, ejercicio)
abrir-biblioteca          servidor local + abre el navegador (Python 3, sin dependencias)
css/biblioteca.css        estilos (tema oscuro, tipografía de lectura)
motor/                    lógica común: navegación de pasos, entradas, SVG animado, KaTeX,
                          página de elemento (elemento.js), bloque pasos|escena (estudio.js),
                          página de ejercicio (ejercicio.js), progreso local (progreso.js), aritmética
libros/catalogo.js        los cinco libros (portada) y cuáles tienen clase práctica
libros/<n>/contenido.js   texto de cada elemento de la conferencia n (enunciado, explicación, pasos)
libros/<n>/claves.js      «ideas que te llevas» de cada elemento
libros/<n>/practica.js    clase práctica n: enunciados, pistas, soluciones, «qué te llevas»
escenas/<n>/<id>.js       una animación por elemento: función (entradas, paso) → dibujo
escenas/cp<n>/            animaciones de planteamientos y soluciones de la clase práctica
escenas/piezas/           piezas de dibujo reutilizables (Euclides, árboles de factores, reloj, recta enrollada…)
vendor/                   KaTeX 0.18.9 y fuentes (Noto Serif, JetBrains Mono), para funcionar sin conexión
fuentes/                  PDF originales de las conferencias y de las clases prácticas
tests/                    pruebas unitarias (node:test) y de navegador (Chromium)
herramientas/             render de páginas o escenas a PNG y búsqueda de textos fuera de la vista
docs/                     diseño, planes de trabajo y guía para añadir contenido
```

La arquitectura separa tres cosas:
- el **contenido**: textos en `libros/`;
- las **escenas**: dibujos parametrizados en `escenas/`;
- el **motor**, común a todo.

Una escena es una función pura de (entradas, número de paso) → lista de piezas SVG. Por eso avanzar,
retroceder o cambiar los números da siempre el mismo dibujo.

---

## Desarrollo

### Pruebas

Las pruebas unitarias solo necesitan **Node.js** (18 o posterior):

```sh
node --test tests/*.test.mjs
```

Comprueban, entre otras cosas:
- la estructura de todo el contenido y que **todas las fórmulas compilan en KaTeX**;
- en las clases prácticas:
  - que la primera pista de cada apartado es el concepto y enlaza a un elemento existente;
  - que no hay `/` ni `*` dentro de las fórmulas;
  - las respuestas numéricas, por fuerza bruta;
- en cada escena, con entradas por defecto y aleatorias, que sea determinista, que no repita piezas y que
  todo quepa en la vista.

Las pruebas de navegador recorren cada paso de cada libro y cada ejercicio en Chromium sin ventana.
Necesitan `playwright-core` y un Chromium:

```sh
npm install --prefix .superpowers/dev playwright-core
npx --prefix .superpowers/dev playwright install chromium     # o usa un Chromium ya instalado
CHROMIUM=/ruta/a/chrome tests/navegador.sh                     # filtro opcional: tests/navegador.sh "clase práctica"
```

`tests/navegador.sh` usa por defecto `NODE_PATH=.superpowers/dev/node_modules`. Puedes cambiarlo exportando
`NODE_PATH` y `CHROMIUM`.

### Herramientas de revisión

```sh
herramientas/ver.sh 'elemento.html?l=1&e=pbo' salida.png 3          # página completa, tras 3 pasos
herramientas/escena.sh 'elemento.html?l=4&e=prop-6' prefijo 0,2,4   # solo la animación, en varios pasos
node herramientas/fuzz-textos.mjs 2                                 # miles de entradas al azar: textos fuera de la vista
```

### Añadir o corregir contenido

La guía [docs/como-añadir-un-libro.md](docs/como-añadir-un-libro.md) explica:
- el formato de `contenido.js`, `claves.js` y `practica.js`;
- cómo escribir una escena con las piezas existentes;
- las reglas de rigor, notación y pistas.

En resumen:
- transcribe los enunciados **mirando el PDF renderizado** (la extracción de texto pierde exponentes y subíndices);
- marca todo lo corregido o añadido;
- justifica cada implicación;
- verifica cada número con un test.

---

## Créditos y licencias

- **Contenido matemático original**: las conferencias y clases prácticas de Matemática Discreta I de la
  Universidad de La Habana pertenecen a sus autores, el profesorado de la asignatura. Esta herramienta las
  reproduce con fines exclusivamente de estudio.
- **Bibliotecas y fuentes incluidas**:
  - [KaTeX](https://katex.org/) 0.18.9, licencia MIT;
  - [Noto Serif](https://fonts.google.com/noto/specimen/Noto+Serif) y
    [JetBrains Mono](https://www.jetbrains.com/lp/mono/), SIL Open Font License 1.1 (textos en `vendor/fuentes/`).
- La licencia del código de esta herramienta aún no se ha definido.

---

## Reportar errores

Un error matemático en una herramienta de estudio puede costar horas de confusión a quien la usa. Si
encuentras uno (una errata, un paso mal justificado, una cuenta incorrecta, una pista engañosa o una
animación que no se corresponde con el texto), por favor repórtalo indicando:

- el libro y el elemento o ejercicio (la dirección de la página basta);
- el paso concreto, si es una demostración;
- qué esperabas y qué aparece.

Cada corrección debería venir con su prueba: un test que falle con el error y pase con la corrección.
