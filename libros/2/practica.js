// Clase práctica 2 (18 de septiembre de 2025) — acompaña a la Conferencia 2 (mcd, diofánticas, mcm).
// Enunciados transcritos del PDF renderizado; «∗» se escribe ·, y lo corregido lleva su marca.
const R = String.raw;
const L2 = (e) => ({ l: 2, e });
const BEZOUT = L2('teo-menor-combinacion'), COMUNES = L2('teo-divisores-comunes'), MCD_N = L2('cor-mcd-n'), COCIENTES = L2('cor-cocientes-coprimos');
const PRODUCTO = L2('teo-divide-producto'), SOLUBLE = L2('teo-diofantica-solucion'), EUCLIDES = L2('teo-euclides'), COEF = L2('teo-coeficientes');
const GENERAL = L2('teo-solucion-general'), MCM_MCD = L2('cor-mcm-mcd'), MULT_MCM = L2('cor-multiplo-mcm'), DEF_MCD = L2('def-mcd'), DEF_MCM = L2('def-mcm');

export default {
  numero: 2, fecha: '18 de septiembre de 2025',
  ejercicios: [
    {
      id: 'cp2-1', numero: 1, nombre: R`Un método para resolver $ax + by = c$`,
      enunciado: R`Implemente un método que dados $a, b, c \in \Z$ y $a, b \neq 0$ diga si $ax + by = c$ tiene solución en los enteros, es decir que existan $x_0, y_0 \in \Z$ tales que $ax_0 + by_0 = c$, en caso de existir encuentre una y dé una forma de generar otras $n$.`,
      partes: [{
        id: 'x',
        pistas: [
          { tipo: 'concepto', texto: R`Es la conferencia entera convertida en algoritmo: el <b>Algoritmo de Euclides</b>, el <b>método de los coeficientes</b> para escribir el mcd como combinación lineal, el teorema <b>«$ax + by = c$ tiene solución si y solo si $(a, b) \mid c$»</b> y la <b>solución general</b>.`, enlaces: [EUCLIDES, COEF, SOLUBLE, GENERAL] },
          { tipo: 'estrategia', texto: R`Separa el método en tres preguntas: ¿tiene solución?, ¿cuál es una?, ¿cómo salen las demás? Cada una la responde un teorema distinto de la conferencia.` },
          { tipo: 'arranque', texto: R`Para la primera pregunta solo necesitas un número. ¿Cuál, y con qué algoritmo lo calculas? ¿Qué compruebas después con $c$?` },
          { tipo: 'desbloqueo', texto: R`El algoritmo de Euclides con sus coeficientes te da $d = as + bt$. Si $d \mid c$, ¿por qué número multiplicas esa igualdad para que el lado derecho sea $c$?` },
          { tipo: 'desbloqueo', texto: R`Para las otras $n$: la solución general suma a $x_0$ múltiplos de un número y resta a $y_0$ múltiplos de otro. ¿Cuáles? Cuidado con los signos: Euclides trabaja con $|a|$ y $|b|$.` },
        ],
        solucion: {
          pasos: [
            { texto: R`<b>Signos.</b> Se trabaja con $|a|$ y $|b|$: el mcd no depende del signo, y al final se corrige el signo de cada coeficiente.` },
            { texto: R`<b>Euclides con coeficientes.</b> Se empieza con $r_{-1} = |a| = |a| \cdot 1 + |b| \cdot 0$ y $r_0 = |b| = |a| \cdot 0 + |b| \cdot 1$. En cada paso $r_{i+1} = r_{i-1} - q_i r_i$ (división con resto) y se calculan igual los coeficientes: $s_{i+1} = s_{i-1} - q_i s_i$, $t_{i+1} = t_{i-1} - q_i t_i$. Así cada resto cumple $r_i = |a| s_i + |b| t_i$.` },
            { texto: R`Cuando un resto es $0$, el anterior es $d = (a, b)$, y viene con sus coeficientes: $d = |a| s + |b| t$. Los restos decrecen estrictamente y son $\ge 0$, así que el proceso termina.` },
            { texto: R`<b>¿Tiene solución?</b> Si $d \nmid c$, no tiene (teorema de la conferencia) y el método termina diciéndolo.` },
            { texto: R`<b>Una solución.</b> Si $d \mid c$: con $s' = \pm s$ y $t' = \pm t$ (el signo de $a$ y el de $b$) queda $a s' + b t' = d$. Multiplicando por $\frac{c}{d} \in \Z$: $x_0 = s' \cdot \frac{c}{d}$, $y_0 = t' \cdot \frac{c}{d}$ cumplen $ax_0 + by_0 = c$.` },
            { texto: R`<b>Otras $n$.</b> Para $k = 1, \dots, n$: $x_k = x_0 + k\frac{b}{d}$, $y_k = y_0 - k\frac{a}{d}$. Son soluciones: $ax_k + by_k = ax_0 + by_0 + k\left(\frac{ab}{d} - \frac{ab}{d}\right) = c$; y son distintas porque $\frac{b}{d} \neq 0$. Por la solución general, así se obtienen todas.` },
            { texto: R`Ejemplo: $3088x + 456y = 16$. Euclides da $d = 8 = 3088 \cdot (-22) + 456 \cdot 149$, y $8 \mid 16$. Multiplicando por $2$: $x_0 = -44$, $y_0 = 298$. Las demás: $x = -44 + 57k$, $y = 298 - 386k$.` },
          ],
        },
        aprendes: {
          resultado: R`El método: Euclides con coeficientes da $d = (a, b) = as + bt$; hay solución si y solo si $d \mid c$; entonces $x_0 = s\frac{c}{d}$, $y_0 = t\frac{c}{d}$ y todas son $x_0 + k\frac{b}{d}$, $y_0 - k\frac{a}{d}$.`,
          ideas: [
            { idea: 'Llevar la «historia» de cada resto', texto: R`Si cada resto se guarda como combinación $|a|s_i + |b|t_i$, el último (el mcd) sale ya escrito como combinación lineal, sin volver hacia atrás. Es memoria dentro del cálculo.` },
            { idea: 'Escalar una solución', texto: R`Si resuelves el problema para $d$, lo resuelves para cualquier múltiplo de $d$ multiplicando. Resolver primero el caso «unitario» y escalar es un patrón general.` },
            { idea: 'Una particular + las de la homogénea', texto: R`Todas las soluciones son una particular más las de $ax + by = 0$. Ese esquema (particular + homogénea) reaparece en congruencias y en ecuaciones diferenciales.` },
          ],
        },
      }],
    },
    {
      id: 'cp2-2', numero: 2, nombre: R`Primos relativos dos a dos si y solo si el mcm es el producto`,
      enunciado: R`Sean $a_1, a_2, \dots, a_n$ números naturales. Demuestre que $(a_i, a_j) = 1$ para todo par $1 \le i \lt j \le n$ si y solo si $\mcm(a_1, a_2, \dots, a_n) = a_1 a_2 \cdots a_n$.`,
      nota: R`$\mcm(a_1, \dots, a_n)$ es el menor múltiplo común positivo de todos ellos (los $a_i$ son positivos).`,
      partes: [{
        id: 'x',
        pistas: [
          { tipo: 'concepto', texto: R`Se aplican la definición de <b>mcm</b> y el teorema <b>«si $a \mid b_1 \cdots b_n$ y $a$ es primo relativo con $b_1, \dots, b_{n-1}$, entonces $a \mid b_n$»</b>, el que convierte «primos relativos» en «se puede cancelar».`, enlaces: [DEF_MCM, PRODUCTO, L2('def-primos-relativos')] },
          { tipo: 'estrategia', texto: R`Son dos implicaciones. Para «⇐» usa la contrarrecíproca: si dos de ellos no son primos relativos, fabrica un múltiplo común más pequeño que el producto.` },
          { tipo: 'arranque', texto: R`Para «⇒»: el producto $P$ ya es un múltiplo común. Para ver que es el menor, prueba que $P$ divide a <i>todo</i> múltiplo común positivo $M$, añadiendo los factores de uno en uno.` },
          { tipo: 'arranque', texto: R`Si ya sabes $a_1 \cdots a_j \mid M$ y además $a_{j+1} \mid M$, escribe $M = a_1 \cdots a_j \cdot u$. ¿Qué condición te deja pasar $a_{j+1}$ a dividir a $u$?` },
          { tipo: 'desbloqueo', texto: R`Necesitas que $a_1 \cdots a_j$ sea primo relativo con $a_{j+1}$. Pruébalo aparte: si $x$ e $y$ son primos relativos con $z$, también lo es $xy$ (toma $g = (xy, z)$ y mira qué divide).` },
          { tipo: 'desbloqueo', texto: R`Para «⇐»: si $(a_i, a_j) = d \gt 1$, divide el producto entre $d$. ¿Sigue siendo múltiplo de $a_i$, de $a_j$ y de los demás?` },
        ],
        solucion: {
          pasos: [
            { texto: R`Sea $P = a_1 a_2 \cdots a_n$, que es un múltiplo común positivo de todos los $a_i$.` },
            { texto: R`<b>Lema.</b> Si $(x, z) = 1$ y $(y, z) = 1$, entonces $(xy, z) = 1$. Sea $g = (xy, z)$. Un divisor común de $g$ y $x$ divide a $z$ y a $x$, luego divide a $(x, z) = 1$: $(g, x) = 1$. Como $g \mid xy$, por el teorema de la conferencia $g \mid y$; y $g \mid z$, así que $g \mid (y, z) = 1$.` },
            { texto: R`<b>⇒.</b> Supongamos $(a_i, a_j) = 1$ para $i \neq j$, y sea $M$ un múltiplo común positivo. Probamos por inducción en $j$ que $a_1 \cdots a_j \mid M$. Para $j = 1$, es la hipótesis $a_1 \mid M$.` },
            { texto: R`Si $a_1 \cdots a_j \mid M$, escribimos $M = a_1 \cdots a_j \cdot u$. Por el lema, aplicado $j - 1$ veces, $(a_1 \cdots a_j, a_{j+1}) = 1$. Como $a_{j+1} \mid a_1 \cdots a_j \cdot u$, el teorema da $a_{j+1} \mid u$, y entonces $a_1 \cdots a_{j+1} \mid M$.` },
            { texto: R`Con $j = n$: $P \mid M$, luego $P \le M$ para todo múltiplo común positivo. Como $P$ es múltiplo común, es el menor: $\mcm(a_1, \dots, a_n) = P$.` },
            { texto: R`<b>⇐ (contrarrecíproca).</b> Si $(a_i, a_j) = d \gt 1$ para algún $i \lt j$, sea $Q = \frac{P}{d}$. Es entero y es múltiplo común: $Q = a_i \cdot \frac{a_j}{d} \cdot (\text{los demás})$ es múltiplo de $a_i$, $Q = \frac{a_i}{d} \cdot a_j \cdot (\text{los demás})$ lo es de $a_j$, y los demás factores están enteros.` },
            { texto: R`Entonces $\mcm(a_1, \dots, a_n) \le Q \lt P$: el mcm no es el producto.` },
          ],
        },
        aprendes: {
          resultado: R`$\mcm(a_1, \dots, a_n) = a_1 \cdots a_n$ si y solo si los $a_i$ son primos relativos dos a dos.`,
          ideas: [
            { idea: '«Mínimo» se prueba dividiendo', texto: R`Para ver que un múltiplo común $P$ es el menor, no compares tamaños uno a uno: prueba que $P$ divide a todo múltiplo común. Divide implica $\le$ (entre positivos).` },
            { idea: 'El lema de productos coprimos', texto: R`$(x, z) = (y, z) = 1 \Rightarrow (xy, z) = 1$. Úsalo cada vez que necesites que un producto sea primo relativo con algo; aplicado varias veces cubre productos de muchos factores.` },
            { idea: 'Contrarrecíproca constructiva', texto: R`Para «si falla la hipótesis, falla la conclusión», construye el contraejemplo con lo que da la falla: aquí, $d \gt 1$ permite dividir el producto y obtener un múltiplo común menor.` },
          ],
        },
      }],
    },
    {
      id: 'cp2-3', numero: 3, nombre: 'Los apartamentos de la inmobiliaria',
      enunciado: R`Una inmobiliaria renta apartamentos del tipo A cuyo alquiler es <span class="sin-tex">&#36;188.00</span> y apartamentos de tipo B cuyo alquiler es <span class="sin-tex">&#36;508.00</span>. Cuando todos los apartamentos de tipo A y B hayan sido rentados, la inmobiliaria recibirá un total de <span class="sin-tex">&#36;1580.00</span>. ¿Cuántos apartamentos de cada tipo posee?`,
      partes: [{
        id: 'x',
        pistas: [
          { tipo: 'concepto', texto: R`Es una <b>ecuación diofántica lineal</b>: se usan el teorema de existencia, el <b>Algoritmo de Euclides</b> con sus coeficientes y la <b>solución general</b>.`, enlaces: [SOLUBLE, EUCLIDES, COEF, GENERAL] },
          { tipo: 'estrategia', texto: R`Traduce a ecuación con $x$ apartamentos de tipo A e $y$ de tipo B. Pero no basta resolver en $\Z$: $x$ e $y$ cuentan apartamentos, así que deben ser $\ge 0$.` },
          { tipo: 'arranque', texto: R`Antes de resolver: ¿tiene solución? Calcula $(188, 508)$ con el algoritmo de Euclides.` },
          { tipo: 'arranque', texto: R`Divide toda la ecuación entre el mcd: trabajarás con números más pequeños y coeficientes primos relativos.` },
          { tipo: 'desbloqueo', texto: R`Con la solución general $x = x_0 + 127k$, $y = y_0 - 47k$, impón $x \ge 0$ e $y \ge 0$: son dos desigualdades para $k$. ¿Cuántos enteros $k$ las cumplen?` },
          { tipo: 'desbloqueo', texto: R`Atajo: en $47x + 127y = 395$, como $127y \le 395$, solo caben $y = 0, 1, 2, 3$. Prueba cuáles dejan $395 - 127y$ divisible por $47$.` },
        ],
        solucion: {
          pasos: [
            { texto: R`Sean $x$ e $y$ los apartamentos de tipo A y B: $188x + 508y = 1580$ con $x, y \ge 0$ enteros.` },
            { texto: R`Euclides: $508 = 2 \cdot 188 + 132$, $188 = 1 \cdot 132 + 56$, $132 = 2 \cdot 56 + 20$, $56 = 2 \cdot 20 + 16$, $20 = 1 \cdot 16 + 4$, $16 = 4 \cdot 4$. Luego $(188, 508) = 4$, y $4 \mid 1580$: hay soluciones enteras.` },
            { texto: R`Dividiendo entre $4$: $47x + 127y = 395$, con $(47, 127) = 1$.` },
            { texto: R`Euclides para $127$ y $47$: $127 = 2 \cdot 47 + 33$, $47 = 1 \cdot 33 + 14$, $33 = 2 \cdot 14 + 5$, $14 = 2 \cdot 5 + 4$, $5 = 1 \cdot 4 + 1$. Volviendo hacia atrás: $1 = 47 \cdot (-27) + 127 \cdot 10$.` },
            { texto: R`Multiplicando por $395$: $x_0 = -27 \cdot 395 = -10665$, $y_0 = 10 \cdot 395 = 3950$. Solución general: $x = -10665 + 127k$, $y = 3950 - 47k$, $k \in \Z$.` },
            { texto: R`$x \ge 0 \iff 127k \ge 10665 \iff k \ge 83{,}97\ldots$, es decir $k \ge 84$. $y \ge 0 \iff 47k \le 3950 \iff k \le 84{,}04\ldots$, es decir $k \le 84$. Solo $k = 84$.` },
            { texto: R`Con $k = 84$: $x = -10665 + 10668 = 3$, $y = 3950 - 3948 = 2$. Comprobación: $188 \cdot 3 + 508 \cdot 2 = 564 + 1016 = 1580$. Posee $x = 3$ apartamentos de tipo A e $y = 2$ de tipo B.` },
          ],
        },
        aprendes: {
          resultado: R`$3$ apartamentos de tipo A y $2$ de tipo B; es la única solución con $x, y \ge 0$.`,
          ideas: [
            { idea: 'Problema con enunciado → diofántica + restricciones', texto: R`Cantidades enteras con un total fijo son una diofántica. La solución general da infinitas; las restricciones del contexto ($\ge 0$) las recortan a un intervalo de $k$.` },
            { idea: 'Simplificar por el mcd antes de nada', texto: R`Dividir la ecuación entre $(a, b)$ achica las cuentas y deja coeficientes primos relativos, donde la solución general es más limpia.` },
            { idea: 'Acotar antes de calcular', texto: R`Cuando las incógnitas son no negativas, $127y \le 395$ deja muy pocos valores posibles. Probar pocos casos puede ser más rápido que el método general; sirve para comprobar.` },
          ],
        },
      }],
    },
    {
      id: 'cp2-4', numero: 4, nombre: R`¿Cuántos de $a, 2a, \dots, ba$ son divisibles por $b$?`,
      enunciado: R`Sean $a, b$ naturales, cuántos números de la secuencia $a, 2a, \dots, ba$ son divisibles por $b$.`,
      planteamiento: {
        texto: R`Los $b$ números $a, 2a, \dots, ba$ y, como líneas, los múltiplos de $b$. Cambia $a$ y $b$ y cuenta las coincidencias: busca la regla.`,
        pasos: [
          { texto: R`Los números $ka$, $k = 1, \dots, b$.` },
          { texto: R`Los múltiplos de $b$.` },
          { texto: R`La pregunta, en general.` },
        ],
        escena: 'cp2/multiplos',
      },
      partes: [{
        id: 'x',
        pistas: [
          { tipo: 'concepto', texto: R`Se aplican el corolario <b>$\frac{a}{(a,b)}$ y $\frac{b}{(a,b)}$ son primos relativos</b> y el teorema <b>«si $a \mid b_1 \cdots b_n$ y es primo relativo con los primeros, divide al último»</b>.`, enlaces: [COCIENTES, PRODUCTO] },
          { tipo: 'estrategia', texto: R`Traduce la pregunta: ¿para qué $k \in \{1, \dots, b\}$ se cumple $b \mid ka$? Simplifica esa condición hasta que solo hable de $k$.` },
          { tipo: 'arranque', texto: R`Experimenta en el planteamiento con $a = 6$, $b = 8$ y con otros pares. ¿Con qué número relacionado con $a$ y $b$ coincide el conteo?` },
          { tipo: 'arranque', texto: R`Saca el mcd: $d = (a, b)$, $a = da'$, $b = db'$. ¿Qué sabes de $a'$ y $b'$? Reescribe $b \mid ka$ con ellos.` },
          { tipo: 'desbloqueo', texto: R`Llegas a $b' \mid ka'$. Como $(a', b') = 1$, ¿qué dice eso de $k$? Después cuenta los múltiplos de $b'$ entre $1$ y $b = db'$.` },
        ],
        solucion: {
          pasos: [
            { texto: R`Hay que contar los $k \in \{1, \dots, b\}$ con $b \mid ka$. Sea $d = (a, b)$, $a = da'$, $b = db'$; por el corolario, $(a', b') = 1$.` },
            { texto: R`$b \mid ka \iff db' \mid kda' \iff b' \mid ka'$ (se cancela $d \neq 0$: $kda' = db' t \iff ka' = b't$).` },
            { texto: R`Si $b' \mid ka'$, como $(b', a') = 1$, el teorema da $b' \mid k$. Y si $b' \mid k$, claramente $b' \mid ka'$. Así: $b \mid ka \iff b' \mid k$.` },
            { texto: R`Los múltiplos de $b'$ entre $1$ y $b = db'$ son $b', 2b', \dots, db'$: exactamente $d$.` },
            { texto: R`Hay exactamente $(a, b)$ números de la secuencia divisibles por $b$.` },
          ],
        },
        aprendes: {
          resultado: R`Exactamente $(a, b)$ de los números $a, 2a, \dots, ba$ son divisibles por $b$.`,
          ideas: [
            { idea: 'Sacar el mcd para quedarte con coprimos', texto: R`Escribir $a = da'$, $b = db'$ con $(a', b') = 1$ es el movimiento estándar del Libro II: convierte una divisibilidad con factores comunes en una entre coprimos, donde se puede cancelar.` },
            { idea: 'Reducir a una condición sobre el contador', texto: R`«¿Cuántos $k$ cumplen…?» se resuelve transformando la condición en algo simple sobre $k$ (aquí $b' \mid k$) y contando eso.` },
            { idea: 'Experimentar para conjeturar', texto: R`Contar en dos o tres ejemplos te dice qué demostrar. La demostración luego explica por qué sale $(a, b)$.` },
          ],
        },
      }],
    },
    {
      id: 'cp2-5', numero: 5, nombre: 'Cuentas con el mcd',
      enunciado: R`Sea $a, b, c, k, n \in \N$, calcule o demuestre (según sea el caso) que:<br>(a) $(ka, kb) = k(a, b)$<br>(b) Si $(a, b) = 1$: $(a + b, a)$; $(a + b, ab)$; $(a + b, a - b)$; $(n^2 + 1, (n+1)^2 + 1)$<br>(c) $[a, b, c] = \frac{abc}{(ab, bc, ca)}$`,
      marcaEnunciado: 'corregido',
      nota: R`En el PDF el apartado (c) dice $(a, b, c) = \frac{abc}{(ab, bc, ca)}$, que es falso: con $a = 2$, $b = 3$, $c = 1$ queda $1 \neq \frac{6}{1} = 6$. Lo cierto es la misma fórmula para el <b>mcm</b>, $[a, b, c]$; se demuestra esa. En (b), el último cálculo no depende de $a$ y $b$. Aquí $\N = \{1, 2, 3, \dots\}$.`,
      partes: [
        {
          id: 'a', etiqueta: '(a)', enunciado: R`$(ka, kb) = k(a, b)$.`,
          pistas: [
            { tipo: 'concepto', texto: R`Se aplican <b>el mcd es la menor combinación lineal positiva</b> (escribir $(a, b) = as + bt$) y <b>los divisores comunes son los divisores del mcd</b>.`, enlaces: [BEZOUT, COMUNES] },
            { tipo: 'estrategia', texto: R`Para probar que dos números positivos son iguales, prueba que cada uno divide al otro.` },
            { tipo: 'arranque', texto: R`$k(a, b)$ divide a $ka$ y a $kb$. ¿Qué te dice eso respecto de $(ka, kb)$?` },
            { tipo: 'arranque', texto: R`Para la otra dirección: escribe $(a, b) = as + bt$ y multiplica por $k$. ¿Qué divide a ese lado derecho?` },
          ],
          solucion: {
            pasos: [
              { texto: R`Sea $d = (a, b)$ y $D = (ka, kb)$. Ambos positivos.` },
              { texto: R`$d \mid a$ y $d \mid b$, luego $kd \mid ka$ y $kd \mid kb$: $kd$ es divisor común, y por el teorema $kd \mid D$.` },
              { texto: R`Por la conferencia, $d = as + bt$ con $s, t \in \Z$. Multiplicando: $kd = (ka)s + (kb)t$. Como $D \mid ka$ y $D \mid kb$, $D$ divide a esa combinación: $D \mid kd$.` },
              { texto: R`Dos positivos que se dividen mutuamente son iguales: $(ka, kb) = k(a, b)$.` },
            ],
          },
          aprendes: {
            resultado: R`$(ka, kb) = k(a, b)$ para $k \in \N$: el mcd «saca factor común».`,
            ideas: [
              { idea: 'Igualdad por doble divisibilidad', texto: R`$x \mid y$ e $y \mid x$ con $x, y \gt 0$ implica $x = y$. Es la forma más usada de probar igualdades de mcd y mcm.` },
              { idea: 'Bézout como herramienta para «el mcd divide a…»', texto: R`Escribir el mcd como combinación lineal y multiplicar permite probar que un divisor común divide a $kd$. Cuando necesites que algo divida a un mcd (o a un múltiplo de él), escríbelo como combinación.` },
            ],
          },
        },
        {
          id: 'b1', etiqueta: '(b)', enunciado: R`Si $(a, b) = 1$, calcule $(a + b, a)$.`,
          pistas: [
            { tipo: 'concepto', texto: R`Se aplica la idea del corolario <b>$\mcd(a, b) = \mcd(b, r)$</b>: sumar o restar a un número un múltiplo del otro no cambia sus divisores comunes. Y <b>los divisores comunes son los divisores del mcd</b>.`, enlaces: [L2('cor-mcd-resto'), COMUNES] },
            { tipo: 'estrategia', texto: R`Compara los divisores comunes de $a + b$ y $a$ con los divisores comunes de $a$ y $b$.` },
            { tipo: 'arranque', texto: R`Si $g \mid a + b$ y $g \mid a$, ¿divide $g$ a $b$? ¿Y al revés?` },
          ],
          solucion: {
            pasos: [
              { texto: R`Si $g \mid a + b$ y $g \mid a$, entonces $g \mid (a + b) - a = b$. Si $g \mid a$ y $g \mid b$, entonces $g \mid a + b$.` },
              { texto: R`Los divisores comunes de $a + b$ y $a$ son exactamente los de $a$ y $b$; en particular el mayor coincide.` },
              { texto: R`$(a + b, a) = (a, b) = 1$.` },
            ],
          },
          aprendes: {
            resultado: R`$(a + b, a) = 1$ cuando $(a, b) = 1$; en general $(a + b, a) = (a, b)$.`,
            ideas: [
              { idea: 'Mismos divisores comunes ⇒ mismo mcd', texto: R`Para calcular un mcd, transfórmalo en otro con los mismos divisores comunes: $(x, y) = (x - qy, y)$. Es el motor del algoritmo de Euclides.` },
              { idea: 'Restar lo que estorba', texto: R`De $a + b$ y $a$ se obtiene $b$ restando. Antes de calcular, mira qué combinación de los datos deja algo conocido.` },
            ],
          },
        },
        {
          id: 'b2', etiqueta: '(b)', enunciado: R`Si $(a, b) = 1$, calcule $(a + b, ab)$.`,
          pistas: [
            { tipo: 'concepto', texto: R`Se aplica el teorema <b>«si $a \mid b_1 \cdots b_n$ y $a$ es primo relativo con los primeros, divide al último»</b>, junto con el cálculo anterior $(a + b, a) = 1$.`, enlaces: [PRODUCTO, COMUNES] },
            { tipo: 'estrategia', texto: R`Llama $g$ al mcd buscado y trata de demostrar que $g$ divide a $a$ y a $b$: entonces divide a $(a, b) = 1$.` },
            { tipo: 'arranque', texto: R`$g \mid ab$. Para pasar a $g \mid b$ te falta saber que $g$ y $a$ son primos relativos. ¿Por qué lo son? (usa que $g \mid a + b$).` },
            { tipo: 'desbloqueo', texto: R`Un divisor común de $g$ y $a$ divide a $a + b$ y a $a$, luego a $b$: divide a $(a, b)$. Después repite el argumento cambiando los papeles de $a$ y $b$.` },
          ],
          solucion: {
            pasos: [
              { texto: R`Sea $g = (a + b, ab)$.` },
              { texto: R`$(g, a) = 1$: si $h \mid g$ y $h \mid a$, entonces $h \mid a + b$ y $h \mid a$, luego $h \mid b$; así $h \mid (a, b) = 1$.` },
              { texto: R`Como $g \mid ab$ y $(g, a) = 1$, el teorema da $g \mid b$.` },
              { texto: R`Por simetría ($(g, b) = 1$ y $g \mid ab$), $g \mid a$.` },
              { texto: R`$g$ divide a $a$ y a $b$, luego $g \mid (a, b) = 1$: $(a + b, ab) = 1$.` },
            ],
          },
          aprendes: {
            resultado: R`$(a + b, ab) = 1$ cuando $(a, b) = 1$.`,
            ideas: [
              { idea: 'Probar coprimalidad para poder cancelar', texto: R`El teorema de cancelación ($g \mid ab$, $(g, a) = 1 \Rightarrow g \mid b$) necesita una coprimalidad. Si no la tienes, pruébala primero: suele salir de las hipótesis con una resta.` },
              { idea: 'Atacar el mcd desconocido con un nombre', texto: R`Llamar $g$ al mcd y deducir qué divide $g$ es más fácil que calcularlo de frente.` },
            ],
          },
        },
        {
          id: 'b3', etiqueta: '(b)', enunciado: R`Si $(a, b) = 1$, calcule $(a + b, a - b)$.`,
          pistas: [
            { tipo: 'concepto', texto: R`Se usan <b>los divisores comunes son los divisores del mcd</b> y el apartado (a): $(2a, 2b) = 2(a, b)$.`, enlaces: [COMUNES, DEF_MCD] },
            { tipo: 'estrategia', texto: R`El valor no es siempre el mismo: prueba con algunos pares coprimos ($2$ y $1$; $3$ y $1$) y luego acota qué valores puede tomar.` },
            { tipo: 'arranque', texto: R`Si $g$ divide a $a + b$ y a $a - b$, ¿a qué divide su suma? ¿Y su diferencia?` },
            { tipo: 'desbloqueo', texto: R`Llegas a $g \mid 2a$ y $g \mid 2b$, luego $g \mid (2a, 2b) = 2$. Falta decidir cuándo es $2$: ¿qué paridad tienen $a$ y $b$ para que $a + b$ sea par?` },
          ],
          solucion: {
            pasos: [
              { texto: R`Sea $g = (a + b, a - b)$. Entonces $g \mid (a + b) + (a - b) = 2a$ y $g \mid (a + b) - (a - b) = 2b$.` },
              { texto: R`Luego $g \mid (2a, 2b) = 2(a, b) = 2$ (apartado (a)): $g \in \{1, 2\}$.` },
              { texto: R`$g = 2$ si y solo si $a + b$ y $a - b$ son pares, es decir, si $a$ y $b$ tienen la misma paridad. No pueden ser ambos pares (serían no coprimos), así que $g = 2$ exactamente cuando $a$ y $b$ son ambos impares.` },
              { texto: R`Ejemplos: $a = 3, b = 1$: $(4, 2) = 2$. $a = 2, b = 1$: $(3, 1) = 1$.` },
            ],
          },
          aprendes: {
            resultado: R`$(a + b, a - b) = 2$ si $a$ y $b$ son impares, y $1$ si tienen distinta paridad.`,
            ideas: [
              { idea: 'Sumar y restar para aislar', texto: R`Si $g$ divide a $x + y$ y a $x - y$, divide a $2x$ y a $2y$. Combinar los datos para aislar cada variable es un truco que se repite.` },
              { idea: 'Acotar el mcd y luego decidir', texto: R`Primero encuentra un número que el mcd debe dividir (aquí $2$); luego decide caso por caso cuál de sus divisores es.` },
            ],
          },
        },
        {
          id: 'b4', etiqueta: '(b)', enunciado: R`Calcule $(n^2 + 1, (n+1)^2 + 1)$.`,
          pistas: [
            { tipo: 'concepto', texto: R`Se usa la idea de <b>$\mcd(a, b) = \mcd(b, r)$</b>: combinar los dos números para hacerlos más pequeños sin cambiar los divisores comunes. Al final, el <b>Algoritmo de la División</b> por $5$.`, enlaces: [L2('cor-mcd-resto'), COMUNES, { l: 1, e: 'teo-division' }] },
            { tipo: 'estrategia', texto: R`Haz como en Euclides pero con expresiones: resta, multiplica y resta hasta eliminar $n$ y quedarte con un número fijo que el mcd debe dividir.` },
            { tipo: 'arranque', texto: R`Resta los dos números. ¿Qué expresión de grado $1$ queda?` },
            { tipo: 'arranque', texto: R`Con $g \mid n^2 + 1$ y $g \mid 2n + 1$: busca una combinación que elimine el $n^2$. Prueba con $4(n^2 + 1)$ y $(2n + 1)(2n - 1)$.` },
            { tipo: 'desbloqueo', texto: R`Obtienes $g \mid 5$. Para saber cuándo es $5$, escribe $n = 5q + r$ y mira para qué resto $r$ se cumple $5 \mid 2n + 1$.` },
          ],
          solucion: {
            pasos: [
              { texto: R`Sea $g = (n^2 + 1, (n+1)^2 + 1)$. Como $(n+1)^2 + 1 - (n^2 + 1) = 2n + 1$, se tiene $g \mid 2n + 1$.` },
              { texto: R`$4(n^2 + 1) - (2n + 1)(2n - 1) = 4n^2 + 4 - (4n^2 - 1) = 5$. Como $g$ divide a $n^2 + 1$ y a $2n + 1$, divide a esa combinación: $g \mid 5$, así que $g \in \{1, 5\}$.` },
              { texto: R`$g = 5$ exige $5 \mid 2n + 1$. Con $n = 5q + r$, $0 \le r \le 4$: $2n + 1 = 10q + 2r + 1$, y $2r + 1 \in \{1, 3, 5, 7, 9\}$ es múltiplo de $5$ solo para $r = 2$.` },
              { texto: R`Si $r = 2$: $2n + 1 = 5(2q + 1)$, $n^2 + 1 = 25q^2 + 20q + 5$ y $(n+1)^2 + 1 = 25q^2 + 30q + 10$; los tres son múltiplos de $5$, así que $g = 5$.` },
              { texto: R`Resultado: $(n^2 + 1, (n+1)^2 + 1) = 5$ si $n$ deja resto $2$ al dividirlo por $5$, y $1$ en otro caso.` },
            ],
          },
          aprendes: {
            resultado: R`$(n^2 + 1, (n+1)^2 + 1)$ vale $5$ cuando $n = 5q + 2$ y $1$ en los demás casos.`,
            ideas: [
              { idea: 'Euclides con expresiones', texto: R`Para el mcd de dos polinomios en $n$, combínalos para bajar el grado hasta llegar a una constante $C$: el mcd divide a $C$. Funciona con cualquier par de expresiones.` },
              { idea: 'Después de acotar, decide por restos', texto: R`Si sabes que $g \mid 5$, revisa los $5$ restos posibles de $n$. Una lista finita de casos cierra el problema.` },
            ],
          },
        },
        {
          id: 'c', etiqueta: '(c)', enunciado: R`$[a, b, c] = \frac{abc}{(ab, bc, ca)}$ (corregido: en el PDF, $(a, b, c)$).`,
          pistas: [
            { tipo: 'concepto', texto: R`Se aplican las definiciones de <b>mcd</b> y <b>mcm</b> y el corolario <b>todo múltiplo común es múltiplo del mcm</b> (que vale igual para tres números).`, enlaces: [DEF_MCM, MULT_MCM, DEF_MCD] },
            { tipo: 'estrategia', texto: R`No calcules ninguno de los dos lados. Llama $m = [a, b, c]$ y $D = (ab, bc, ca)$ y prueba dos desigualdades, $m \le \frac{abc}{D}$ y $\frac{abc}{D} \le m$, usando solo «mínimo» y «máximo».` },
            { tipo: 'arranque', texto: R`¿Es $\frac{abc}{D}$ un múltiplo común de $a$, $b$ y $c$? Escríbelo como $a \cdot \frac{bc}{D}$.` },
            { tipo: 'arranque', texto: R`Para la otra desigualdad, mira el número $\frac{abc}{m}$: ¿divide a $ab$? Escribe $ab = \frac{abc}{m} \cdot \frac{m}{c}$.` },
            { tipo: 'desbloqueo', texto: R`Para que $\frac{abc}{m}$ sea entero necesitas $m \mid abc$: $abc$ es múltiplo común, y todo múltiplo común es múltiplo del mcm.` },
          ],
          solucion: {
            pasos: [
              { texto: R`Sean $m = [a, b, c]$ y $D = (ab, bc, ca)$.` },
              { texto: R`$\frac{abc}{D}$ es múltiplo común: como $D \mid bc$, $\frac{abc}{D} = a \cdot \frac{bc}{D}$ es múltiplo de $a$; igual $\frac{abc}{D} = b \cdot \frac{ca}{D} = c \cdot \frac{ab}{D}$. Es positivo, así que $m \le \frac{abc}{D}$.` },
              { texto: R`$abc$ es múltiplo común de $a, b, c$, y todo múltiplo común es múltiplo del mcm (mismo argumento de la conferencia: si $M = qm + r$ con $0 \le r \lt m$, $r$ sería un múltiplo común menor que $m$, luego $r = 0$). Así $m \mid abc$ y $\frac{abc}{m}$ es entero.` },
              { texto: R`$\frac{abc}{m}$ es divisor común de $ab$, $bc$, $ca$: $ab = \frac{abc}{m} \cdot \frac{m}{c}$ con $\frac{m}{c} \in \Z$ porque $c \mid m$; igual con $bc$ (usando $a \mid m$) y $ca$ (usando $b \mid m$).` },
              { texto: R`Como $D$ es el mayor divisor común, $\frac{abc}{m} \le D$, es decir $\frac{abc}{D} \le m$.` },
              { texto: R`Juntando: $[a, b, c] = \frac{abc}{(ab, bc, ca)}$.` },
            ],
          },
          aprendes: {
            resultado: R`$[a, b, c] = \frac{abc}{(ab, bc, ca)}$ (y la versión con el mcd a la izquierda es falsa).`,
            ideas: [
              { idea: 'Igualdad por dos desigualdades «extremas»', texto: R`Para $\min = X$: prueba que $X$ es candidato (así $\min \le X$) y que algo construido con el mínimo acota $X$ (así $X \le \min$). Funciona con mcd, mcm y cualquier «el menor que cumple…».` },
              { idea: 'Dualidad mcd ↔ mcm', texto: R`Dividir el producto por un mcm da un divisor común, y dividirlo por un divisor común da un múltiplo común. Esa ida y vuelta conecta los dos conceptos.` },
              { idea: 'Prueba la fórmula con números antes', texto: R`El enunciado del PDF era falso y se ve con $a = 2, b = 3, c = 1$. Antes de demostrar una identidad, pruébala en un ejemplo pequeño.` },
            ],
          },
        },
      ],
    },
    {
      id: 'cp2-6', numero: 6, nombre: R`Un segmento de longitud $\sqrt{a^2 + b^2}$ contiene una solución`,
      enunciado: R`Las soluciones de la ecuación lineal diofantina $ax + by = c$ son interpretadas geométricamente como, aquellos puntos con coordenadas enteras sobre la recta que representa dicha ecuación. Prueba que si $(a, b) = 1$, entonces cualquier segmento de longitud mayor o igual a $(a^2 + b^2)^{\frac{1}{2}}$ sobre la línea $ax + by = c$ contiene al menos uno de los puntos solución de la ecuación.`,
      nota: R`Los segmentos se entienden cerrados (incluyen sus extremos), y $a, b \neq 0$.`,
      planteamiento: {
        texto: R`La recta, sus puntos enteros y un segmento de esa longitud. Cambia $a$, $b$, $c$.`,
        pasos: [
          { texto: R`La recta sobre la cuadrícula de puntos enteros.` },
          { texto: R`Las soluciones: los puntos enteros de la recta.` },
          { texto: R`Un segmento de longitud $\sqrt{a^2 + b^2}$.` },
          { texto: R`La pregunta.` },
        ],
        escena: 'cp2/recta-diofantica',
      },
      partes: [{
        id: 'x',
        pistas: [
          { tipo: 'concepto', texto: R`Se aplican <b>«$ax + by = c$ tiene solución si y solo si $(a, b) \mid c$»</b> y, sobre todo, la <b>solución general</b>: todas las soluciones son $(x_0 + kb, y_0 - ka)$ cuando $(a, b) = 1$.`, enlaces: [SOLUBLE, GENERAL] },
          { tipo: 'estrategia', texto: R`Usa la forma de la solución general para ver cómo están repartidas las soluciones sobre la recta: ¿a qué distancia está cada una de la siguiente?` },
          { tipo: 'arranque', texto: R`Resta dos soluciones consecutivas ($k$ y $k + 1$). ¿Qué vector obtienes y cuál es su longitud?` },
          { tipo: 'desbloqueo', texto: R`Ahora describe <i>todos</i> los puntos de la recta con un parámetro real $t$, del mismo modo: $(x_0 + tb, y_0 - ta)$. ¿Qué longitud tiene el tramo entre los parámetros $t_1$ y $t_2$?` },
          { tipo: 'desbloqueo', texto: R`Un segmento de longitud $\ge \sqrt{a^2 + b^2}$ corresponde a un intervalo de $t$ de longitud $\ge 1$. ¿Contiene necesariamente un entero?` },
        ],
        solucion: {
          pasos: [
            { texto: R`Como $(a, b) = 1$ y $1 \mid c$, la ecuación tiene una solución entera $(x_0, y_0)$.` },
            { texto: R`Por la solución general (con $d = 1$), las soluciones son exactamente $(x_0 + kb, y_0 - ka)$ con $k \in \Z$.` },
            { texto: R`De la solución $k$ a la $k + 1$ hay el vector $(b, -a)$, de longitud $L = \sqrt{a^2 + b^2}$.` },
            { texto: R`Todo punto de la recta es $P(t) = (x_0 + tb, y_0 - ta)$ con $t \in \mathbb{R}$: $(b, -a)$ es paralelo a la recta porque $a \cdot b + b \cdot (-a) = 0$, y es no nulo. La distancia entre $P(t)$ y $P(t')$ es $|t - t'| \cdot L$.` },
            { texto: R`Un segmento de la recta es $\{P(t) : t_1 \le t \le t_2\}$ y mide $(t_2 - t_1)L$. Si mide $\ge L$, entonces $t_2 - t_1 \ge 1$, y el intervalo $[t_1, t_2]$ contiene un entero $k$ (por ejemplo, el menor entero $\ge t_1$, que es $\le t_1 + 1 \le t_2$).` },
            { texto: R`$P(k) = (x_0 + kb, y_0 - ka)$ es una solución y está en el segmento.` },
          ],
          escena: 'cp2/recta-diofantica-solucion',
        },
        aprendes: {
          resultado: R`Las soluciones de $ax + by = c$ con $(a, b) = 1$ están igualmente espaciadas sobre la recta, a distancia $\sqrt{a^2 + b^2}$; por eso todo segmento de esa longitud contiene una.`,
          ideas: [
            { idea: 'La solución general es una progresión', texto: R`$(x_0 + kb, y_0 - ka)$ son puntos equiespaciados: un punto de partida más $k$ veces un vector fijo. Verla así convierte preguntas geométricas en preguntas sobre enteros $k$.` },
            { idea: 'Parametrizar para pasar a una sola variable', texto: R`Describir la recta con un parámetro $t$ convierte «longitud del segmento» en «longitud de un intervalo de $t$». Un problema en el plano pasa a ser un problema en la recta real.` },
            { idea: 'Un intervalo de longitud $\ge 1$ contiene un entero', texto: R`Es un principio pequeño pero potente: cada vez que un parámetro recorre un tramo de longitud $\ge 1$, toca un entero.` },
          ],
        },
      }],
    },
    {
      id: 'cp2-7', numero: 7, nombre: R`Si $a \mid bc$ entonces $a \mid (a, b)(a, c)$`,
      enunciado: R`Demuestre que si $a \mid bc$ entonces $a \mid \mcd(a, b) \cdot \mcd(a, c)$.`,
      nota: R`$a, b, c$ son enteros no nulos.`,
      partes: [{
        id: 'x',
        pistas: [
          { tipo: 'concepto', texto: R`Se aplican <b>los divisores comunes son los divisores del mcd</b> y el <b>mcd de varios números por partes</b>; además el ejercicio 5(a): $(kx, ky) = k(x, y)$.`, enlaces: [COMUNES, MCD_N] },
          { tipo: 'estrategia', texto: R`Convierte el producto de dos mcd en un único mcd de varios números. Si $a$ divide a cada uno de ellos, divide a su mcd.` },
          { tipo: 'arranque', texto: R`Usa $(kx, ky) = k(x, y)$ con $k = (a, b)$: $(a, b)(a, c) = ((a, b)\,a, (a, b)\,c)$. ¿Cómo sigues desarrollando cada término?` },
          { tipo: 'desbloqueo', texto: R`Llegas a $(a^2, ab, ac, bc)$. ¿Divide $a$ a cada uno de los cuatro números?` },
        ],
        solucion: {
          pasos: [
            { texto: R`Con $(kx, ky) = k(x, y)$ para $k \gt 0$ (ejercicio 5(a)), tomando $k = (a, b)$: $(a, b)(a, c) = \big((a, b)\,a,\ (a, b)\,c\big)$.` },
            { texto: R`De nuevo con 5(a): $(a, b)\,a = (a^2, ab)$ y $(a, b)\,c = (ac, bc)$ (los mcd son positivos; si $a$ o $c$ son negativos se usa $|a|$ o $|c|$, que no cambia ningún mcd).` },
            { texto: R`Por el corolario del mcd por partes: $\big((a^2, ab), (ac, bc)\big) = (a^2, ab, ac, bc)$.` },
            { texto: R`$a$ divide a $a^2$, a $ab$ y a $ac$, y a $bc$ por hipótesis: es un divisor común de los cuatro.` },
            { texto: R`Los divisores comunes dividen al mcd: $a \mid (a^2, ab, ac, bc) = (a, b)(a, c)$.` },
          ],
        },
        aprendes: {
          resultado: R`Si $a \mid bc$, entonces $a \mid (a, b)(a, c)$; en general, $(a, b)(a, c) = (a^2, ab, ac, bc)$.`,
          ideas: [
            { idea: 'El mcd se distribuye como un producto', texto: R`$(x, y)(z, w) = (xz, xw, yz, yw)$: un producto de mcd es el mcd de todos los productos cruzados. Úsalo para convertir productos de mcd en un solo mcd.` },
            { idea: 'Para «divide al mcd», divide a cada uno', texto: R`Si quieres $a \mid (\dots)$ y el lado derecho es un mcd, basta comprobar que $a$ divide a cada número de dentro.` },
            { idea: 'Reutilizar ejercicios anteriores', texto: R`El 5(a) es la llave de este. En una práctica, los ejercicios suelen encadenarse: revisa qué probaste antes.` },
          ],
        },
      }],
    },
    {
      id: 'cp2-8', numero: 8, nombre: R`Si $a^n \mid b^n$ entonces $a \mid b$`,
      enunciado: R`Demuestre que si $a^n \mid b^n$ entonces $a \mid b$.`,
      nota: R`$n \in \Z^+$ y $a, b \in \Z$.`,
      partes: [{
        id: 'x',
        pistas: [
          { tipo: 'concepto', texto: R`Se aplican el corolario <b>$\frac{a}{(a,b)}$ y $\frac{b}{(a,b)}$ son primos relativos</b> y el teorema <b>«si $a \mid b_1 \cdots b_n$ y es primo relativo con los primeros, divide al último»</b>.`, enlaces: [COCIENTES, PRODUCTO] },
          { tipo: 'estrategia', texto: R`Divide $a$ y $b$ entre su mcd para quedarte con dos números primos relativos; ahí la divisibilidad es muy restrictiva.` },
          { tipo: 'arranque', texto: R`Con $d = (a, b)$, $a = da'$, $b = db'$: ¿qué dice $a^n \mid b^n$ sobre $a'$ y $b'$?` },
          { tipo: 'desbloqueo', texto: R`Si $(a', b') = 1$, ¿son primos relativos $a'^n$ y $b'^n$? Te sirve el lema: si $x$ e $y$ son primos relativos con $z$, también lo es $xy$.` },
          { tipo: 'desbloqueo', texto: R`Si $a'^n$ divide a $b'^n$ y son primos relativos, ¿cuánto puede valer $a'^n$? Y no olvides los casos con $a = 0$ o $b = 0$.` },
        ],
        solucion: {
          pasos: [
            { texto: R`Casos con ceros: si $a = 0$, $0 \mid b^n$ obliga a $b^n = 0$, luego $b = 0$ y $0 \mid 0$. Si $b = 0$, $a \mid 0$. Suponemos $a, b \neq 0$.` },
            { texto: R`Sea $d = (a, b)$, $a = da'$, $b = db'$, con $(a', b') = 1$ por el corolario.` },
            { texto: R`$a^n \mid b^n$ es $d^n a'^n \mid d^n b'^n$, y cancelando $d^n \neq 0$: $a'^n \mid b'^n$.` },
            { texto: R`Lema: si $(x, z) = (y, z) = 1$ entonces $(xy, z) = 1$ (ejercicio 2). Aplicado repetidamente, $(a', b') = 1$ da $(a', b'^n) = 1$ y luego $(a'^n, b'^n) = 1$.` },
            { texto: R`$a'^n$ divide a $a'^n$ y a $b'^n$, luego divide a su mcd, que es $1$: $a'^n = \pm 1$, así que $a' = \pm 1$.` },
            { texto: R`Entonces $a = \pm d$, y como $d \mid b$, $a \mid b$.` },
          ],
        },
        aprendes: {
          resultado: R`Si $a^n \mid b^n$ entonces $a \mid b$.`,
          ideas: [
            { idea: 'Normalizar por el mcd', texto: R`Escribir $a = da'$, $b = db'$ con $(a', b') = 1$ quita lo común y deja la parte «difícil» entre coprimos. Es el primer movimiento cuando una divisibilidad involucra potencias o productos de $a$ y $b$.` },
            { idea: 'Si $x \mid y$ y $(x, y) = 1$, entonces $x = \pm 1$', texto: R`Un número que divide a otro con el que es primo relativo divide a $1$. Muchas demostraciones terminan así.` },
            { idea: 'Los casos con cero, aparte', texto: R`La división por el mcd exige números no nulos. Despacha primero los casos triviales con $0$ y luego trabaja tranquilo.` },
          ],
        },
      }],
    },
  ],
};
