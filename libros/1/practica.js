// Clase práctica 1 (11 de septiembre de 2025) — acompaña a la Conferencia 1 (principios y divisibilidad).
// Enunciados transcritos del PDF renderizado; «∗» se escribe ·, y lo corregido lleva su marca.
// Pistas: la primera es siempre el concepto de la conferencia; luego estrategia, arranque y desbloqueos.
const R = String.raw;
const DIV = { l: 1, e: 'teo-division' }, DIVIDE = { l: 1, e: 'def-divide' }, PIM = { l: 1, e: 'pim' };

export default {
  numero: 1, fecha: '11 de septiembre de 2025',
  ejercicios: [
    {
      id: 'cp1-1', numero: 1, nombre: R`$k$ divide al producto de $k$ enteros consecutivos`,
      enunciado: R`Sea $k \in \Z^+$. Demuestre que $k$ divide a todo producto de $k$ enteros consecutivos.<br>(a) Demuestre que $k!$ divide al producto de $k$ enteros consecutivos.`,
      partes: [
        {
          id: 'k', enunciado: R`$k$ divide al producto de $k$ enteros consecutivos.`,
          pistas: [
            { tipo: 'concepto', texto: R`Se aplica el <b>Algoritmo de la División</b>: al dividir cualquier entero por $k$ queda un resto $r$ con $0 \le r \lt k$. Y la definición de divisibilidad: $k \mid m$ significa $m = kt$ para algún entero $t$.`, enlaces: [DIV, DIVIDE] },
            { tipo: 'estrategia', texto: R`No intentes dividir el producto entero. Para que $k$ divida a un producto basta con que divida a <i>uno</i> de los factores. Busca ese factor.` },
            { tipo: 'arranque', texto: R`Ponle nombre a la lista: $n, n+1, \dots, n+k-1$. Ahora aplica el algoritmo de la división al primero, $n$, dividiendo por $k$.` },
            { tipo: 'arranque', texto: R`Con $n = qk + r$: ¿cuánto le falta a $n$ para llegar al siguiente múltiplo de $k$? Escríbelo en función de $r$.` },
            { tipo: 'desbloqueo', texto: R`Separa dos casos: $r = 0$ y $0 \lt r \lt k$. En el segundo, comprueba que el número que encontraste sigue estando dentro de la lista (compara lo que sumaste con $k - 1$).` },
          ],
          solucion: {
            pasos: [
              { texto: R`Sean los $k$ enteros consecutivos $n, n+1, \dots, n+k-1$ y sea $P$ su producto.` },
              { texto: R`Por el Algoritmo de la División, $n = qk + r$ con $q, r \in \Z$ y $0 \le r \lt k$.` },
              { texto: R`Caso $r = 0$: $n = qk$, luego $k \mid n$, y $n$ es un factor de $P$.` },
              { texto: R`Caso $0 \lt r \lt k$: sea $j = k - r$. Como $0 \lt r \lt k$, se tiene $1 \le j \le k - 1$, así que $n + j$ es uno de los factores de la lista.` },
              { texto: R`Y $n + j = qk + r + (k - r) = (q + 1)k$, luego $k \mid n + j$.` },
              { texto: R`En ambos casos hay un factor $m$ de la lista con $m = kt$. Escribiendo $P = m \cdot Q$, donde $Q$ es el producto de los demás factores, queda $P = k \cdot (tQ)$ con $tQ \in \Z$: $k \mid P$.` },
            ],
          },
          aprendes: {
            resultado: R`Entre $k$ enteros consecutivos siempre hay un múltiplo de $k$; por eso $k$ divide a su producto.`,
            ideas: [
              { idea: 'Para dividir un producto, busca un solo factor', texto: R`Si $a \mid m$, entonces $a \mid m \cdot t$ para cualquier $t$. Un problema sobre un producto grande se reduce a encontrar <i>un</i> factor que funcione. Úsalo siempre que el objeto sea un producto y el divisor sea «pequeño».` },
              { idea: 'El algoritmo de la división localiza', texto: R`Escribir $n = qk + r$ dice exactamente cuánto falta para el siguiente múltiplo: $k - r$. Es la herramienta para cualquier afirmación del tipo «en todo bloque de $k$ consecutivos hay un múltiplo de $k$».` },
              { idea: 'Casos según el resto', texto: R`Separar $r = 0$ de $r \neq 0$ es el primer movimiento natural cuando aparece la división: muchos argumentos tienen un caso trivial y uno que hay que construir.` },
            ],
          },
        },
        {
          id: 'a', etiqueta: '(a)', enunciado: R`$k!$ divide al producto de $k$ enteros consecutivos.`,
          pistas: [
            { tipo: 'concepto', texto: R`Se aplica el <b>Principio de Inducción Matemática</b>, y dos veces: una sobre el primer número de la lista y otra sobre $k$.`, enlaces: [PIM, DIVIDE] },
            { tipo: 'estrategia', texto: R`Fija $k$ y piensa en el producto como función del primer factor: $f(n) = n(n+1)\cdots(n+k-1)$. Para probar que todos los $f(n)$ son múltiplos de $k!$, basta con que lo sea el primero y que la diferencia entre dos seguidos también lo sea.` },
            { tipo: 'arranque', texto: R`Escribe $f(n+1)$ y $f(n)$ uno debajo del otro. ¿Qué factores tienen en común? Calcula $f(n+1) - f(n)$ sacando factor común.` },
            { tipo: 'desbloqueo', texto: R`La diferencia te queda como $k$ por un producto de $k - 1$ enteros consecutivos. ¿Qué sabrías de ese producto si el resultado ya valiera para $k - 1$? Eso pide una inducción sobre $k$ cuya hipótesis valga para todo $n$.` },
            { tipo: 'desbloqueo', texto: R`Al final, no olvides los bloques que no son todos positivos: ¿qué pasa si la lista contiene el $0$? ¿Y si todos son negativos? (saca el signo).` },
          ],
          solucion: {
            pasos: [
              { texto: R`Para $n \ge 1$ y $k \ge 1$ sea $f_k(n) = n(n+1)\cdots(n+k-1)$. Probamos por inducción sobre $k$ la afirmación $A(k)$: «$k! \mid f_k(n)$ para todo $n \ge 1$».` },
              { texto: R`Base $k = 1$: $1! = 1$ divide a cualquier entero.` },
              { texto: R`Paso: supongamos $A(k-1)$, es decir, $(k-1)! \mid f_{k-1}(m)$ para todo $m \ge 1$. Probamos $A(k)$ por inducción sobre $n$.` },
              { texto: R`Base $n = 1$: $f_k(1) = 1 \cdot 2 \cdots k = k!$, que es divisible por $k!$.` },
              { texto: R`Paso en $n$: $f_k(n+1) - f_k(n) = (n+1)\cdots(n+k-1) \cdot \big[(n+k) - n\big] = k \cdot f_{k-1}(n+1)$, porque los $k - 1$ factores centrales son comunes.` },
              { texto: R`Por $A(k-1)$, $f_{k-1}(n+1) = (k-1)! \cdot t$ con $t \in \Z$; luego $f_k(n+1) - f_k(n) = k \cdot (k-1)! \cdot t = k! \cdot t$.` },
              { texto: R`Si $k! \mid f_k(n)$, entonces $f_k(n+1) = f_k(n) + k! \cdot t$ es suma de dos múltiplos de $k!$, así que $k! \mid f_k(n+1)$. Por el PIM, $k! \mid f_k(n)$ para todo $n \ge 1$, y eso es $A(k)$. Por el PIM, $A(k)$ vale para todo $k \ge 1$.` },
              { texto: R`Bloques que no son todos positivos: si contienen el $0$, el producto es $0$ y $k! \mid 0$. Si todos son negativos, $n + k - 1 \lt 0$; con $m = -(n+k-1) \ge 1$ el producto es $(-1)^k \cdot m(m+1)\cdots(m+k-1) = (-1)^k f_k(m)$, divisible por $k!$.` },
            ],
          },
          aprendes: {
            resultado: R`$k!$ divide al producto de $k$ enteros consecutivos (el cociente es el número combinatorio $\binom{n+k-1}{k}$).`,
            ideas: [
              { idea: 'Diferencias que telescopian', texto: R`Para probar que todos los términos $f(1), f(2), \dots$ son múltiplos de algo, prueba que $f(1)$ lo es y que cada diferencia $f(n+1) - f(n)$ también. Sirve para cualquier «$d \mid$ expresión en $n$».` },
              { idea: 'Inducción doble con hipótesis fuerte', texto: R`Cuando el paso para $k$ necesita el resultado para $k-1$ con un $n$ distinto, haz la inducción exterior sobre $k$ con hipótesis «para todo $n$». La hipótesis debe ser tan general como lo que vas a necesitar.` },
              { idea: 'Reducir negativos a positivos', texto: R`Un producto de negativos es $\pm$ un producto de positivos: saca $(-1)^k$ y no repitas la demostración.` },
            ],
          },
        },
      ],
    },
    {
      id: 'cp1-2', numero: 2, nombre: 'Números especiales: si $p$ y $q$ lo son, $pq$ también',
      enunciado: R`Un entero $n \gt 1$ es especial si para todo $k \in \Z^+$, con $k \le n$ se puede escribir como suma de divisores distintos de $n$. Demuestre que si $p$ y $q$ son especiales entonces $pq$ es especial.`,
      nota: R`Aquí $p$ y $q$ son enteros especiales cualesquiera, no necesariamente primos.`,
      partes: [{
        id: 'x',
        pistas: [
          { tipo: 'concepto', texto: R`Se aplica el <b>Algoritmo de la División</b> (dividir un $k$ cualquiera por $q$) y la definición de divisor: si $d \mid p$, entonces $qd \mid pq$.`, enlaces: [DIV, DIVIDE] },
          { tipo: 'estrategia', texto: R`Construye la escritura de $k$ a partir de las que ya tienes: $p$ especial te da sumas para los números $\le p$ y $q$ especial para los $\le q$. Parte $k$ en un trozo «grande», hecho de bloques de tamaño $q$, y un trozo pequeño.` },
          { tipo: 'arranque', texto: R`Divide $k$ entre $q$: $k = aq + b$ con $0 \le b \lt q$. ¿Hasta dónde puede llegar $a$ si $k \le pq$?` },
          { tipo: 'arranque', texto: R`$a \le p$ se escribe con divisores distintos de $p$. Multiplica esa escritura por $q$. ¿Qué tipo de números son los sumandos que obtienes, respecto de $pq$?` },
          { tipo: 'desbloqueo', texto: R`Falta $b \lt q$, que se escribe con divisores de $q$. Para ver que no se repite ningún sumando, compara tamaños: ¿cómo son los sumandos que vienen de $p$ (multiplicados por $q$) frente a los que vienen de $q$?` },
        ],
        solucion: {
          pasos: [
            { texto: R`$pq \gt 1$. Sea $k \in \Z^+$ con $k \le pq$; hay que escribirlo como suma de divisores distintos de $pq$.` },
            { texto: R`Algoritmo de la División: $k = aq + b$ con $0 \le b \lt q$. Como $aq \le k \le pq$, se tiene $a \le p$.` },
            { texto: R`Si $a \ge 1$: como $1 \le a \le p$ y $p$ es especial, $a = d_1 + \dots + d_s$ con $d_i$ divisores distintos de $p$. Entonces $aq = qd_1 + \dots + qd_s$, y cada $qd_i$ divide a $pq$ (si $p = d_i t$, entonces $pq = (qd_i)t$). Los $qd_i$ son distintos porque los $d_i$ lo son.` },
            { texto: R`Si $b \ge 1$: como $1 \le b \lt q$ y $q$ es especial, $b = e_1 + \dots + e_r$ con $e_j$ divisores distintos de $q$, y cada $e_j \mid q \mid pq$.` },
            { texto: R`Ningún $qd_i$ coincide con un $e_j$: $e_j \le b \lt q \le qd_i$ (porque $d_i \ge 1$).` },
            { texto: R`Así $k = \sum qd_i + \sum e_j$ (omitiendo la parte vacía si $a = 0$ o $b = 0$; no pueden ser ambas, porque $k \ge 1$) es suma de divisores distintos de $pq$. Luego $pq$ es especial.` },
          ],
        },
        aprendes: {
          resultado: R`El producto de dos números especiales es especial.`,
          ideas: [
            { idea: 'La división como cambio de escala', texto: R`$k = aq + b$ es escribir $k$ «en bloques de $q$» más un sobrante, como las cifras de un número en base $q$. Úsalo para combinar una propiedad válida hasta $p$ con otra válida hasta $q$ y obtenerla hasta $pq$.` },
            { idea: 'Separar por tamaños da distinción gratis', texto: R`Si todos los objetos de un grupo son $\ge q$ y los del otro son $\lt q$, no pueden coincidir. Cuando necesites «distintos», busca una escala que los separe.` },
            { idea: 'Reutilizar la hipótesis dos veces', texto: R`Cada hipótesis («$p$ es especial», «$q$ es especial») se usa sobre un trozo distinto del problema. Antes de empezar, pregúntate qué trozo puede tragarse cada una.` },
          ],
        },
      }],
    },
    {
      id: 'cp1-3', numero: 3, nombre: 'Descomposiciones de $n$ con sumandos casi iguales',
      enunciado: R`Determine el número de formas de descomponer a $n$ en sumandos donde el orden no es relevante y la diferencia modular de cualquier par de sumandos es a lo sumo $1$.`,
      nota: R`«Diferencia modular» significa diferencia en valor absoluto: dos sumandos $x, y$ cumplen $|x - y| \le 1$. Los sumandos son enteros positivos y $n \in \Z^+$.`,
      planteamiento: {
        texto: R`Cada sumando es una fila de cuadraditos. Una descomposición vale si dos filas cualesquiera difieren a lo sumo en un cuadradito. Cambia $n$ para ver más ejemplos.`,
        pasos: [
          { texto: R`$n$ cuadraditos.` },
          { texto: R`Una descomposición válida en dos sumandos.` },
          { texto: R`Otra válida, en tres sumandos.` },
          { texto: R`Una que no vale: dos sumandos difieren en más de $1$.` },
          { texto: R`El orden no cuenta. La pregunta: ¿cuántas válidas hay?` },
        ],
        escena: 'cp1/descomposiciones',
      },
      partes: [{
        id: 'x',
        pistas: [
          { tipo: 'concepto', texto: R`Se aplica el <b>Algoritmo de la División</b>, y sobre todo su parte de <b>unicidad</b>: $q$ y $r$ con $n = mq + r$, $0 \le r \lt m$, son únicos.`, enlaces: [DIV] },
          { tipo: 'estrategia', texto: R`Clasifica las descomposiciones por cuántos sumandos tienen. Cuenta cuántas hay con exactamente $m$ sumandos y luego suma sobre $m$.` },
          { tipo: 'arranque', texto: R`Si dos sumandos cualesquiera difieren a lo sumo en $1$, ¿cuántos valores distintos pueden aparecer? Llama $x$ al menor sumando.` },
          { tipo: 'arranque', texto: R`Con $m$ sumandos, de los cuales $s$ valen $x + 1$ y el resto valen $x$: escribe $n$ en función de $m$, $x$ y $s$. ¿Entre qué valores está $s$?` },
          { tipo: 'desbloqueo', texto: R`Lo que te quedó tiene la forma exacta del algoritmo de la división de $n$ entre $m$. ¿Qué te dice la unicidad sobre $x$ y $s$? ¿Para qué valores de $m$ existe la descomposición?` },
        ],
        solucion: {
          pasos: [
            { texto: R`Si todos los pares difieren a lo sumo en $1$, solo hay dos valores posibles: el mínimo $x$ y, quizá, $x + 1$ (un sumando $\ge x + 2$ diferiría del mínimo en $2$ o más).` },
            { texto: R`Como el orden no importa, una descomposición con $m$ sumandos queda determinada por $x$ y por $s$, la cantidad de sumandos iguales a $x + 1$. Como al menos uno vale $x$, $0 \le s \le m - 1$.` },
            { texto: R`Entonces $n = (m - s)x + s(x+1) = mx + s$ con $0 \le s \lt m$.` },
            { texto: R`Por la unicidad del Algoritmo de la División, $x$ y $s$ son el cociente y el resto de dividir $n$ entre $m$: para cada $m$ hay <b>a lo sumo una</b> descomposición.` },
            { texto: R`Existe exactamente cuando $x = \lfloor n \div m \rfloor$ es positivo, es decir, cuando $1 \le m \le n$; tomando $x$ y $s$ como cociente y resto, la descomposición ($m - s$ veces $x$, $s$ veces $x + 1$) cumple la condición. Si $m \gt n$, $x = 0$ y no hay sumandos positivos suficientes.` },
            { texto: R`Hay una descomposición para cada $m = 1, 2, \dots, n$: en total, $n$ formas.` },
          ],
        },
        aprendes: {
          resultado: R`Hay exactamente $n$ descomposiciones: una por cada número de sumandos $m = 1, \dots, n$, con sumandos $\lfloor n \div m \rfloor$ y $\lfloor n \div m \rfloor + 1$.`,
          ideas: [
            { idea: 'La unicidad cuenta', texto: R`La unicidad del algoritmo de la división no es un detalle: convierte «¿cuántos hay?» en «hay exactamente uno». Si un objeto queda descrito por un par $(q, r)$ con $n = mq + r$, $0 \le r \lt m$, hay uno solo.` },
            { idea: 'Clasificar antes de contar', texto: R`Agrupa por un parámetro natural (aquí, el número de sumandos), cuenta en cada grupo y suma. Es más fácil contar «con $m$ sumandos» que todo a la vez.` },
            { idea: 'Normalizar la descripción', texto: R`Elegir el mínimo $x$ como referencia hace que cada objeto tenga una sola descripción $(x, s)$ con $s \lt m$. Sin esa normalización contarías dos veces.` },
          ],
        },
      }],
    },
    {
      id: 'cp1-4', numero: 4, nombre: 'Infinitos múltiplos de $n$ con todos los dígitos',
      enunciado: R`Sea $n \in \Z^+$. Demuestre que existen infinitos múltiplos de $n$ que contienen a todos los dígitos decimales.`,
      partes: [{
        id: 'x',
        pistas: [
          { tipo: 'concepto', texto: R`Se aplica el <b>Algoritmo de la División</b>: en todo bloque de $n$ enteros consecutivos hay un múltiplo de $n$ (como en el ejercicio 1).`, enlaces: [DIV] },
          { tipo: 'estrategia', texto: R`No busques el múltiplo y luego mires sus cifras. Fija primero las cifras que quieres y deja «espacio libre» para ajustar hasta caer en un múltiplo.` },
          { tipo: 'arranque', texto: R`Piensa en $1234567890$ seguido de ceros: $N = 1234567890 \cdot 10^j$. Si le sumas un número pequeño, ¿qué cifras de $N$ cambian y cuáles no?` },
          { tipo: 'arranque', texto: R`Cerca de $N$, ¿a qué distancia como mucho está el siguiente múltiplo de $n$? ¿Qué condición sobre $j$ garantiza que llegar hasta él no toca las diez primeras cifras?` },
          { tipo: 'desbloqueo', texto: R`Para que sean infinitos: cada $j$ suficientemente grande da un múltiplo. ¿Por qué los múltiplos que salen con $j$ distintos son números distintos? (cuenta sus cifras).` },
        ],
        solucion: {
          pasos: [
            { texto: R`Sea $j \in \Z^+$ con $10^j \gt n$, y sea $N = 1234567890 \cdot 10^j$: en decimal, las cifras $1234567890$ seguidas de $j$ ceros.` },
            { texto: R`Algoritmo de la División: $N = qn + r$ con $0 \le r \lt n$. Sea $t = 0$ si $r = 0$ y $t = n - r$ si $r \gt 0$; entonces $M = N + t$ es múltiplo de $n$ ($M = qn$ o $M = (q+1)n$) y $0 \le t \lt n$.` },
            { texto: R`Como $0 \le t \lt n \lt 10^j$, el número $t$ tiene a lo sumo $j$ cifras. Sumarlo a $N$ solo rellena los $j$ ceros finales: $M$ se escribe $1234567890$ seguido de las $j$ cifras de $t$ (completadas con ceros a la izquierda).` },
            { texto: R`Luego $M$ es múltiplo de $n$ y contiene los diez dígitos.` },
            { texto: R`Para cada $j$ con $10^j \gt n$ se obtiene un $M_j$ que tiene exactamente $10 + j$ cifras. Con $j$ distintos, los $M_j$ tienen distinta cantidad de cifras, así que son distintos: hay infinitos.` },
          ],
        },
        aprendes: {
          resultado: R`Todo $n \in \Z^+$ tiene infinitos múltiplos que contienen los diez dígitos.`,
          ideas: [
            { idea: 'Fijar lo importante y ajustar en una zona libre', texto: R`Pon las cifras que necesitas en la parte alta y deja las cifras bajas libres para corregir. Sirve para cualquier «existe un múltiplo de $n$ que empieza por…».` },
            { idea: 'Un bloque de $n$ consecutivos contiene un múltiplo de $n$', texto: R`Es la consecuencia más usada del algoritmo de la división. Si puedes moverte libremente $n$ pasos sin estropear nada, caes en un múltiplo.` },
            { idea: 'Infinitos = una familia con un parámetro libre', texto: R`Para probar «existen infinitos», construye uno para cada valor de un parámetro ($j$) y comprueba que valores distintos dan objetos distintos.` },
          ],
        },
      }],
    },
    {
      id: 'cp1-5', numero: 5, nombre: R`Todo $n \ge 12$ es $4p + 5q$`,
      enunciado: R`Demuestre que con los valores $4$ y $5$ se puede obtener cualquier valor $n$, $n \ge 12$ como sumas de esos números, ($n = 4p + 5q$).`,
      nota: R`$p, q$ son enteros no negativos (se usa cada valor tantas veces como se quiera, incluso ninguna).`,
      planteamiento: {
        texto: R`Desde el $0$, con saltos de $4$ y de $5$: qué números se alcanzan y cuáles no. Lo que se pide es la llave de la derecha.`,
        pasos: [
          { texto: R`Los dos saltos.` },
          { texto: R`Los números que se alcanzan hasta $24$.` },
          { texto: R`Los que no se alcanzan.` },
          { texto: R`Lo que hay que demostrar: desde $12$, todos.` },
        ],
        escena: 'cp1/saltos-4-5',
      },
      partes: [{
        id: 'x',
        pistas: [
          { tipo: 'concepto', texto: R`Se aplica el <b>Principio de Inducción Matemática</b> con base $n_0 = 12$: de que $n$ se pueda escribir, deducir que $n + 1$ también.`, enlaces: [PIM] },
          { tipo: 'estrategia', texto: R`Si ya tienes $n = 4p + 5q$, no empieces de cero para $n + 1$: modifica la escritura que tienes, cambiando unas «monedas» por otras.` },
          { tipo: 'arranque', texto: R`¿Qué cambio de una moneda por otra sube el total exactamente en $1$? ¿Cuándo puedes hacerlo?` },
          { tipo: 'desbloqueo', texto: R`Si no hay ningún $4$ ($p = 0$), entonces $n = 5q$. Usa $n \ge 12$ para saber cuántos cincos hay como mínimo. ¿Qué cambio de cincos por cuatros sube $1$? (busca dos múltiplos que difieran en $1$).` },
        ],
        solucion: {
          pasos: [
            { texto: R`Sea $P(n)$: «existen $p, q \ge 0$ enteros con $n = 4p + 5q$». Base: $12 = 4 \cdot 3 + 5 \cdot 0$.` },
            { texto: R`Paso: sea $n \ge 12$ con $n = 4p + 5q$.` },
            { texto: R`Caso $p \ge 1$: cambiamos un $4$ por un $5$: $n + 1 = 4(p-1) + 5(q+1)$, con $p - 1 \ge 0$.` },
            { texto: R`Caso $p = 0$: $n = 5q \ge 12$, así que $q \ge 3$ (con $q \le 2$ sería $n \le 10$).` },
            { texto: R`Cambiamos tres cincos por cuatro cuatros, usando $16 - 15 = 1$: $n + 1 = 5q + 1 = 4 \cdot 4 + 5(q - 3)$, con $q - 3 \ge 0$.` },
            { texto: R`En ambos casos $P(n+1)$. Por el PIM con $n_0 = 12$, todo $n \ge 12$ es de la forma $4p + 5q$.` },
          ],
        },
        aprendes: {
          resultado: R`Todo entero $n \ge 12$ se escribe $4p + 5q$ con $p, q \ge 0$ (y $11$ no: el límite es exacto).`,
          ideas: [
            { idea: 'Inducción por «cambio de monedas»', texto: R`En el paso inductivo, transforma la escritura de $n$ en la de $n+1$ con un intercambio local que sume $1$. Cada intercambio posible es un caso.` },
            { idea: 'Combinaciones que valen 1', texto: R`$1 = 5 - 4 = 4 \cdot 4 - 5 \cdot 3$: buscar combinaciones de los valores que den $1$ es la clave (en el Libro II verás que existen porque $\mcd(4,5) = 1$).` },
            { idea: 'La hipótesis $n \ge n_0$ trabaja en el paso', texto: R`$n \ge 12$ no es solo para la base: garantiza que hay suficientes monedas para el intercambio. Si un caso del paso parece imposible, mira qué te da la cota.` },
          ],
        },
      }],
    },
    {
      id: 'cp1-6', numero: 6, nombre: R`Todo polígono simple de $n$ lados se triangula en $n - 2$ triángulos`,
      enunciado: R`Todo polígono simple con $n$ lados, $n \ge 3$ puede ser triangulado en $n - 2$ triángulos.<ul><li>Nota 1: Un polígono es simple si cualquiera de sus lados no consecutivos no se intersectan.</li><li>Nota 2: El proceso de triangulación de un polígono se obtiene al dividirlo en triángulos agregando diagonales que no se intersectan.</li><li>Nota 3: Se cumple que en cualquier polígono simple con al menos $4$ lados, existe una diagonal interior.</li></ul>`,
      planteamiento: {
        texto: R`Qué es una diagonal interior y qué es una triangulación, sobre un polígono concreto de $7$ lados.`,
        pasos: [
          { texto: R`Un polígono simple de $7$ lados.` },
          { texto: R`Una diagonal interior (Nota 3) y una que no lo es.` },
          { texto: R`Una triangulación: diagonales interiores que no se cortan.` },
          { texto: R`La pregunta: ¿siempre salen $n - 2$?` },
        ],
        escena: 'cp1/poligono',
      },
      partes: [{
        id: 'x',
        pistas: [
          { tipo: 'concepto', texto: R`Se aplica el <b>Principio de Inducción Matemática</b> en su forma fuerte: suponer el resultado para <i>todos</i> los polígonos con menos lados, como en la demostración de que todo entero mayor que $1$ tiene un divisor primo.`, enlaces: [PIM, { l: 1, e: 'lema-divisor-primo' }] },
          { tipo: 'estrategia', texto: R`Parte el polígono en dos polígonos más pequeños, triangula cada uno con la hipótesis y junta.` },
          { tipo: 'arranque', texto: R`La Nota 3 es la herramienta para partir. Si la diagonal deja $k$ lados del polígono a un lado, ¿cuántos lados tiene cada pedazo? (no olvides la diagonal).` },
          { tipo: 'desbloqueo', texto: R`Con $n_1$ y $n_2$ lados, suma los triángulos $(n_1 - 2) + (n_2 - 2)$ usando cuánto vale $n_1 + n_2$.` },
          { tipo: 'desbloqueo', texto: R`Comprueba que los dos pedazos tienen al menos $3$ lados y menos de $n$: por eso hace falta la versión fuerte (no sabes si tienen $n - 1$ lados).` },
        ],
        solucion: {
          pasos: [
            { texto: R`Base $n = 3$: el triángulo ya está triangulado, en $1 = 3 - 2$ triángulo.` },
            { texto: R`Paso (inducción fuerte): sea $n \ge 4$ y supongamos que todo polígono simple con $m$ lados, $3 \le m \lt n$, se triangula en $m - 2$ triángulos.` },
            { texto: R`Por la Nota 3 hay una diagonal interior $d$, que une dos vértices no consecutivos. $d$ parte el polígono en dos polígonos simples $P_1$ y $P_2$.` },
            { texto: R`Si a un lado de $d$ quedan $k$ lados del polígono, al otro quedan $n - k$, y como los extremos no son consecutivos, $2 \le k \le n - 2$. Cada pedazo tiene además el lado $d$: $P_1$ tiene $k + 1$ lados y $P_2$ tiene $n - k + 1$.` },
            { texto: R`Ambos están entre $3$ y $n - 1$ lados, así que por la hipótesis se triangulan en $(k + 1) - 2$ y $(n - k + 1) - 2$ triángulos.` },
            { texto: R`Las diagonales de $P_1$, las de $P_2$ y $d$ no se cortan (cada grupo vive en su pedazo), así que juntas triangulan el polígono con $(k - 1) + (n - k - 1) = n - 2$ triángulos.` },
            { texto: R`Por el PIM (forma fuerte), vale para todo $n \ge 3$.` },
          ],
        },
        aprendes: {
          resultado: R`Todo polígono simple de $n \ge 3$ lados se triangula en $n - 2$ triángulos.`,
          ideas: [
            { idea: 'Inducción fuerte cuando partir da piezas de cualquier tamaño', texto: R`Si al dividir el problema no sabes el tamaño exacto de las piezas (solo que son menores), necesitas la hipótesis para todos los tamaños menores, no solo para $n - 1$.` },
            { idea: 'Contar por piezas', texto: R`Las cantidades que se reparten se suman: lados $n_1 + n_2 = n + 2$ (la diagonal se cuenta dos veces). Escribe esa cuenta y el total sale solo.` },
            { idea: 'Comprobar que las piezas caen en la hipótesis', texto: R`Siempre verifica que cada pieza cumple las condiciones de la hipótesis (aquí, entre $3$ y $n - 1$ lados). Es el paso que más se olvida.` },
          ],
        },
      }],
    },
    {
      id: 'cp1-7', numero: 7, nombre: R`El tablero $128 \times 128$ sin una casilla se cubre con piezas en L`,
      enunciado: R`Se tiene una matriz de $128 \times 128$, demuestre que, si se quita una cuadrícula aleatoria entonces se puede completar la matriz utilizando cuadrículas en forma de $L$ de tamaño $3$.`,
      nota: R`Se quita una casilla cualquiera y hay que cubrir todas las demás con piezas en L de $3$ casillas, sin solapes ni huecos.`,
      planteamiento: {
        texto: R`El tablero (aquí más pequeño, $2^k \times 2^k$) con una casilla quitada, y la pieza. Puedes mover la casilla quitada.`,
        pasos: [
          { texto: R`El tablero con una casilla quitada.` },
          { texto: R`La pieza en L.` },
          { texto: R`Lo que se pregunta.` },
        ],
        escena: 'cp1/tablero',
      },
      partes: [{
        id: 'x',
        pistas: [
          { tipo: 'concepto', texto: R`Se aplica el <b>Principio de Inducción Matemática</b>, pero no sobre $128$ directamente: $128 = 2^7$.`, enlaces: [PIM] },
          { tipo: 'estrategia', texto: R`Demuestra algo más general, que es más fácil de inducir: todo tablero $2^k \times 2^k$ al que se le quita <i>una casilla cualquiera</i> se puede cubrir. La inducción va sobre $k$.` },
          { tipo: 'arranque', texto: R`Corta el tablero $2^{k+1} \times 2^{k+1}$ en cuatro cuadrantes de $2^k \times 2^k$. La casilla quitada está en uno de ellos: ese ya está en las condiciones de la hipótesis. ¿Qué le falta a los otros tres?` },
          { tipo: 'desbloqueo', texto: R`A cada uno de los tres cuadrantes completos le «sobra» una casilla para estar en la hipótesis. Mira las cuatro casillas del centro del tablero: ¿cómo tapar a la vez una casilla de cada uno de esos tres con una sola pieza?` },
        ],
        solucion: {
          pasos: [
            { texto: R`Generalizamos: $P(k)$ = «todo tablero $2^k \times 2^k$ al que se le quita una casilla cualquiera se cubre con piezas L sin solapes». Como $128 = 2^7$, basta $P(7)$.` },
            { texto: R`Base $k = 1$: un tablero $2 \times 2$ sin una casilla es exactamente una pieza L.` },
            { texto: R`Paso: supongamos $P(k)$ y tomemos un tablero $2^{k+1} \times 2^{k+1}$ sin una casilla. Lo cortamos en cuatro cuadrantes de $2^k \times 2^k$.` },
            { texto: R`La casilla quitada está en uno de ellos; ese cuadrante es un $2^k \times 2^k$ sin una casilla, y por $P(k)$ se cubre.` },
            { texto: R`Las cuatro casillas centrales del tablero son una de cada cuadrante. Colocamos una pieza L sobre las tres que están en los cuadrantes completos.` },
            { texto: R`Ahora cada uno de esos tres cuadrantes es un $2^k \times 2^k$ con una casilla ya ocupada (la de la L), y por $P(k)$ se cubre el resto.` },
            { texto: R`Las cuatro coberturas y la L central no se solapan y cubren todo menos la casilla quitada: vale $P(k+1)$. Por el PIM, $P(k)$ para todo $k \ge 1$; en particular el tablero $128 \times 128$.` },
          ],
          escena: 'cp1/tablero-solucion',
        },
        aprendes: {
          resultado: R`Todo tablero $2^k \times 2^k$ sin una casilla cualquiera se cubre con piezas L; en particular, el de $128 \times 128$.`,
          ideas: [
            { idea: 'Fortalecer el enunciado para poder inducir', texto: R`Probar algo más general (cualquier $k$, cualquier casilla) hace la inducción posible: la hipótesis tiene que poder aplicarse a los pedazos. Si los pedazos no encajan en tu enunciado, generalízalo.` },
            { idea: 'Crear a propósito la situación de la hipótesis', texto: R`Los cuadrantes completos no estaban en la hipótesis; la L central los pone en ella. Pregúntate: ¿qué pequeña pieza añadida convierte cada pedazo en un caso que ya sé resolver?` },
            { idea: 'Contar es necesario, no suficiente', texto: R`$4^k - 1$ es múltiplo de $3$, así que el número de casillas cuadra; pero eso no prueba que se pueda cubrir. Una cuenta descarta imposibles; la construcción demuestra posibles.` },
          ],
        },
      }],
    },
    {
      id: 'cp1-8', numero: 8, nombre: R`$p(1024)$ para $p(x) = (x-a)(x-b)\cdots(x-z)$`,
      sinConcepto: true,
      enunciado: R`Se tiene el polinomio $p(x) = (x-a)(x-b)(x-c)\cdots(x-y)(x-z)$, se cumple que $a + b + c + \dots + y + z = 100$. Calcule $p(1024)$.`,
      partes: [{
        id: 'x',
        pistas: [
          { tipo: 'concepto', texto: R`Este ejercicio no usa ningún teorema de la conferencia: es un ejercicio de leer el enunciado con cuidado. Solo necesitas que un producto vale $0$ en cuanto un factor vale $0$.` },
          { tipo: 'estrategia', texto: R`Antes de usar el dato $a + b + \dots + z = 100$, escribe la lista completa de factores, sin puntos suspensivos.` },
          { tipo: 'arranque', texto: R`Las letras recorren el abecedario de la $a$ a la $z$. ¿Qué letras hay justo antes de la $y$?` },
          { tipo: 'desbloqueo', texto: R`Uno de los factores es $(x - x)$. ¿Cuánto vale?` },
        ],
        solucion: {
          pasos: [
            { texto: R`Los factores recorren todas las letras de la $a$ a la $z$: $\dots(x - v)(x - w)(x - x)(x - y)(x - z)$.` },
            { texto: R`Entre ellos está el factor $(x - x)$, y $x - x = 0$ para cualquier valor de $x$.` },
            { texto: R`Un producto con un factor nulo es nulo: $p(x) = 0$ para todo $x$; en particular $p(1024) = 0$.` },
            { texto: R`El dato $a + b + \dots + z = 100$ no hace falta: es una distracción.` },
          ],
        },
        aprendes: {
          resultado: R`$p(1024) = 0$, porque el producto contiene el factor $(x - x) = 0$.`,
          ideas: [
            { idea: 'Escribe lo que esconden los puntos suspensivos', texto: R`«$\dots$» oculta términos. Antes de operar, escribe la lista entera, o al menos los términos cercanos a los extremos y a los casos especiales.` },
            { idea: 'Sospecha de un dato que no encaja', texto: R`Si un dato no parece conectar con lo que se pide (aquí la suma), puede ser una distracción. Busca primero el camino más directo.` },
            { idea: 'Un producto es $0$ si y solo si un factor lo es', texto: R`Ante un producto, pregúntate siempre si algún factor se anula.` },
          ],
        },
      }],
    },
  ],
};
