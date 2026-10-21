// Clase práctica 5 (17 de octubre de 2025) — acompaña a la Conferencia 5 (sistemas residuales, ecuaciones
// lineales congruenciales y Teorema Chino del Resto). Enunciados transcritos del PDF renderizado.
const R = String.raw;
const L5 = (e) => ({ l: 5, e }), L4 = (e) => ({ l: 4, e });
const SRC = L5('def-src'), SRC_K = L5('teo-src-k'), SOLUBLE = L5('teo-soluble'), D_SOL = L5('teo-d-soluciones'), UNICA = L5('cor-unica');
const CHINO = L5('teo-chino'), EJ_CHINO = L5('ej-chino'), FUERTE1 = L4('fuerte-1'), FERMAT = L4('teo-fermat');

export default {
  numero: 5, fecha: '17 de octubre de 2025',
  ejercicios: [
    {
      id: 'cp5-1', numero: 1, nombre: R`Resolver $17x \equiv 9 \pmod{276}$`,
      enunciado: R`Resuelva $17x \equiv 9 \pmod{276}$.`,
      partes: [{
        id: 'x',
        pistas: [
          { tipo: 'concepto', texto: R`Se aplican <b>$ax \equiv b\ (n)$ es soluble si y solo si $(a, n) \mid b$</b> y el corolario <b>si $(a, n) = 1$ la solución es única</b>. Para encontrarla, el método de los coeficientes del Libro II.`, enlaces: [SOLUBLE, UNICA, { l: 2, e: 'teo-coeficientes' }] },
          { tipo: 'estrategia', texto: R`Primero decide si tiene solución y cuántas. Después busca un número que haga de «inverso» de $17$ módulo $276$ y multiplica.` },
          { tipo: 'arranque', texto: R`Calcula $(17, 276)$. ¿Qué te dice sobre la cantidad de soluciones?` },
          { tipo: 'arranque', texto: R`$17x \equiv 9 \pmod{276}$ significa $17x - 9 = 276y$ para algún $y$: es una diofántica. Haz Euclides con $276$ y $17$ para escribir $1$ como combinación de ambos.` },
          { tipo: 'desbloqueo', texto: R`Si $17u + 276v = 1$, entonces $17u \equiv 1 \pmod{276}$. Multiplica la congruencia por $u$ y reduce.` },
        ],
        solucion: {
          pasos: [
            { texto: R`Euclides: $276 = 16 \cdot 17 + 4$, $17 = 4 \cdot 4 + 1$. Luego $(17, 276) = 1 \mid 9$: hay solución, y es única módulo $276$.` },
            { texto: R`Hacia atrás: $1 = 17 - 4 \cdot 4 = 17 - 4(276 - 16 \cdot 17) = 65 \cdot 17 - 4 \cdot 276$. Así $17 \cdot 65 \equiv 1 \pmod{276}$.` },
            { texto: R`Multiplicando $17x \equiv 9$ por $65$: $x \equiv 65 \cdot 17x \equiv 65 \cdot 9 = 585 \pmod{276}$.` },
            { texto: R`$585 = 2 \cdot 276 + 33$, así que $x \equiv 33 \pmod{276}$.` },
            { texto: R`Comprobación: $17 \cdot 33 = 561 = 2 \cdot 276 + 9$.` },
          ],
        },
        aprendes: {
          resultado: R`$x \equiv 33 \pmod{276}$, única solución.`,
          ideas: [
            { idea: 'El inverso modular sale de Euclides', texto: R`Si $(a, n) = 1$, escribir $1 = au + nv$ da $au \equiv 1 \pmod n$: $u$ es el inverso de $a$. Multiplicar por él «divide» la congruencia.` },
            { idea: 'Contar antes de buscar', texto: R`$(a, n)$ dice si hay solución y cuántas antes de calcular nada. Empieza siempre por ahí.` },
            { idea: 'Comprobar al final', texto: R`Sustituir la solución cuesta una multiplicación y detecta casi cualquier error de signo o de cuenta.` },
          ],
        },
      }],
    },
    {
      id: 'cp5-2', numero: 2, nombre: 'Múltiplos de $a$ que terminan en cualquier secuencia de dígitos',
      enunciado: R`Sea $a \in \Z$. Demuestra que existen infinitos múltiplos de $a$ que terminan en cualquier secuencia de dígitos, si $a$ es coprimo con $10$.`,
      nota: R`«Termina en la secuencia» se entiende para múltiplos positivos: sus últimas cifras son las de la secuencia.`,
      partes: [{
        id: 'x',
        pistas: [
          { tipo: 'concepto', texto: R`Se aplican <b>$ax \equiv b\ (n)$ es soluble si y solo si $(a, n) \mid b$</b>, el corolario <b>si $(a, n) = 1$ la solución es única</b> y que <b>toda la clase de una solución es solución</b>.`, enlaces: [SOLUBLE, UNICA, L4('teo-solucion-clase')] },
          { tipo: 'estrategia', texto: R`Traduce «termina en estas cifras» a una congruencia. Después, «ser múltiplo de $a$» es una ecuación lineal congruencial.` },
          { tipo: 'arranque', texto: R`Si la secuencia tiene $k$ cifras y forma el número $s$, ¿qué significa que $m$ termine en ella? ¿Módulo qué número trabajas?` },
          { tipo: 'arranque', texto: R`Busca $m = ax$ con $ax \equiv s \pmod{10^k}$. ¿Qué necesitas sobre $(a, 10^k)$?` },
          { tipo: 'desbloqueo', texto: R`Un divisor primo de $10^k$ es $2$ o $5$, y ninguno divide a $a$. Una vez que tienes una solución $x_0$, ¿cuántas más obtienes sumando múltiplos de $10^k$?` },
        ],
        solucion: {
          pasos: [
            { texto: R`Sea la secuencia de $k$ dígitos, que forma el número $s$ con $0 \le s \lt 10^k$. Un entero positivo $m$ termina en esa secuencia si y solo si $m \equiv s \pmod{10^k}$.` },
            { texto: R`$a \neq 0$ (porque $(0, 10) = 10$), y los múltiplos de $a$ y de $-a$ son los mismos, así que podemos suponer $a \gt 0$. Buscamos $x$ con $ax \equiv s \pmod{10^k}$.` },
            { texto: R`$(a, 10^k) = 1$: un primo que divida a $10^k$ divide a $10$, así que es $2$ o $5$; y ninguno divide a $a$, porque $(a, 10) = 1$. Por el teorema, la ecuación tiene solución $x_0$.` },
            { texto: R`Todo $x = x_0 + t \cdot 10^k$ es solución (misma clase). Tomando $t$ con $x \gt 0$, los números $m_t = a(x_0 + t \cdot 10^k)$ son múltiplos positivos de $a$ con $m_t \equiv s \pmod{10^k}$: terminan en la secuencia.` },
            { texto: R`Son distintos para distintos $t$ (difieren en $a \cdot 10^k \neq 0$): hay infinitos.` },
          ],
        },
        aprendes: {
          resultado: R`Si $(a, 10) = 1$, para cualquier secuencia de dígitos hay infinitos múltiplos de $a$ que terminan en ella.`,
          ideas: [
            { idea: '«Últimas $k$ cifras» = módulo $10^k$', texto: R`Las últimas cifras de un número son su resto módulo $10^k$. Las preguntas sobre terminaciones se vuelven congruencias.` },
            { idea: 'Coprimo con $n$ = coprimo con sus potencias', texto: R`$(a, n) = 1 \Rightarrow (a, n^k) = 1$: los primos de $n^k$ son los de $n$. Úsalo para pasar de $10$ a $10^k$.` },
            { idea: 'Una solución da infinitas', texto: R`Una ecuación congruencial con solución tiene toda una clase de soluciones: sumar múltiplos del módulo da infinitas.` },
          ],
        },
      }],
    },
    {
      id: 'cp5-3', numero: 3, nombre: 'Los huevos de la mujer del mercado',
      enunciado: R`Una mujer va al mercado con un bolso de huevos. Un caballo estacionado allí se los rompe. El dueño del animal, apenado por la situación, ofrece retribuir lo perdido. Pregunta cuántos huevos traía. La mujer no recuerda el número exacto, pero recuerda que cuando los agrupaba en grupos de a dos, quedaba uno afuera; lo mismo sucedía con grupos de tres, cuatro, cinco y seis. Sin embargo, en grupos de siete, no sobraba ninguno. ¿Cuál es el menor número de huevos que debe pagar?`,
      planteamiento: {
        texto: R`El mismo montón de huevos agrupado de distintas maneras. Lo que se sabe y lo que se pregunta, sin el número.`,
        pasos: [
          { texto: R`$N$ huevos, número desconocido.` },
          { texto: R`De $2$ en $2$, de $3$ en $3$ y de $4$ en $4$: sobra uno.` },
          { texto: R`De $5$ en $5$ y de $6$ en $6$: también sobra uno.` },
          { texto: R`De $7$ en $7$: no sobra ninguno. La pregunta.` },
        ],
        escena: 'cp5/huevos',
      },
      partes: [{
        id: 'x',
        pistas: [
          { tipo: 'concepto', texto: R`Es un problema del tipo del <b>Teorema Chino del Resto</b> (como el ejemplo $2, 3, 2$ de la conferencia), pero con módulos que no son primos relativos. Para eso, la <b>propiedad fuerte 1</b>: $a \equiv b$ módulo $m$ y $n$ ⇒ módulo $\mcm(m, n)$.`, enlaces: [CHINO, EJ_CHINO, FUERTE1] },
          { tipo: 'estrategia', texto: R`Traduce cada frase a una congruencia sobre $N$. Antes de aplicar ningún teorema, simplifica: los módulos $2, \dots, 6$ no son primos relativos y comparten el mismo resto.` },
          { tipo: 'arranque', texto: R`«Sobra $1$ en grupos de $m$» es $N \equiv 1 \pmod m$. Las cinco primeras dicen lo mismo sobre $N - 1$: ¿de qué números es múltiplo $N - 1$? ¿Y de qué número único, entonces?` },
          { tipo: 'desbloqueo', texto: R`$N - 1$ es múltiplo de $\mcm(2, 3, 4, 5, 6) = 60$: $N = 60t + 1$. Impón $7 \mid N$: queda una congruencia lineal en $t$ módulo $7$.` },
        ],
        solucion: {
          pasos: [
            { texto: R`Sea $N$ el número de huevos: $N \equiv 1 \pmod m$ para $m = 2, 3, 4, 5, 6$, y $N \equiv 0 \pmod 7$.` },
            { texto: R`Las cinco primeras dicen $m \mid N - 1$ para $m = 2, \dots, 6$. Por la propiedad fuerte 1 (aplicada varias veces), equivalen a $\mcm(2, 3, 4, 5, 6) \mid N - 1$, y $\mcm(2, 3, 4, 5, 6) = 2^2 \cdot 3 \cdot 5 = 60$. Así $N = 60t + 1$ con $t \ge 0$.` },
            { texto: R`$7 \mid 60t + 1$: como $60 = 8 \cdot 7 + 4$, queda $4t + 1 \equiv 0$, es decir, $4t \equiv 6 \pmod 7$.` },
            { texto: R`$(4, 7) = 1$: solución única. El inverso de $4$ módulo $7$ es $2$ ($4 \cdot 2 = 8 \equiv 1$); multiplicando, $t \equiv 12 \equiv 5 \pmod 7$.` },
            { texto: R`El menor $t \ge 0$ es $5$: $N = 60 \cdot 5 + 1 = 301$. Comprobación: $300$ es múltiplo de $2, 3, 4, 5, 6$, y $301 = 7 \cdot 43$.` },
            { texto: R`Debe pagar al menos $301$ huevos.` },
          ],
        },
        aprendes: {
          resultado: R`El menor número de huevos es $301$ (todos los posibles son $N \equiv 301 \pmod{420}$).`,
          ideas: [
            { idea: 'Mismo resto en varios módulos = un solo módulo, el mcm', texto: R`$N \equiv r$ módulo $m_1, \dots, m_k$ equivale a $N \equiv r \pmod{\mcm(m_1, \dots, m_k)}$. Junta las condiciones antes de resolver: el sistema se encoge.` },
            { idea: 'Sustituir la forma general', texto: R`De $N \equiv 1 \pmod{60}$, escribe $N = 60t + 1$ y lleva esa forma a la siguiente condición: queda una congruencia lineal en $t$. Es el método «a mano» del Teorema Chino.` },
            { idea: '«El menor» = el menor representante positivo', texto: R`Resuelto el sistema módulo $M$, el menor valor es el menor representante que cumple las condiciones del contexto (aquí, positivo).` },
          ],
        },
      }],
    },
    {
      id: 'cp5-4', numero: 4, nombre: R`¿Para qué $n$ hay dos SRC cuya suma es un SRC?`,
      enunciado: R`Encuentre todas las $n$ enteros positivos tales que, existen dos sistemas residuales completos módulo $n$, $A = \{a_1, a_2, \dots, a_n\}$, $B = \{b_1, b_2, \dots, b_n\}$ que cumplen que $\{a_1 + b_1, a_2 + b_2, \dots, a_n + b_n\}$ también es un sistema residual completo módulo $n$.`,
      partes: [{
        id: 'x',
        pistas: [
          { tipo: 'concepto', texto: R`Se aplican la definición de <b>Sistema Residual Completo</b>, el teorema <b>si $(k, n) = 1$, $\{ka_1, \dots, ka_n\}$ es un SRC</b> y la <b>propiedad 4</b> (sumar congruencias).`, enlaces: [SRC, SRC_K, L4('prop-4')] },
          { tipo: 'estrategia', texto: R`Prueba con $n = 1, 2, 3, 4$ a mano y conjetura. Para los $n$ que funcionan, construye $A$ y $B$; para los que no, busca una cantidad (un invariante) que lo impida.` },
          { tipo: 'arranque', texto: R`Si $n$ es impar, prueba lo más simple: $A = B = \{0, 1, \dots, n - 1\}$ sumados posición a posición. ¿Las sumas $2i$ forman un SRC?` },
          { tipo: 'arranque', texto: R`Para $n$ par, suma todos los elementos de $A$, todos los de $B$ y todos los de la suma. ¿Qué relación hay entre esas tres sumas? ¿Cuánto vale módulo $n$ la suma de los elementos de un SRC?` },
          { tipo: 'desbloqueo', texto: R`La suma de cualquier SRC es $\equiv 0 + 1 + \dots + (n - 1) = \frac{n(n-1)}{2} \pmod n$. Si $n$ es par, ¿a qué es congruente eso? ¿Puede ser que $x + x \equiv x$?` },
        ],
        solucion: {
          pasos: [
            { texto: R`<b>$n$ impar: sí.</b> Tomamos $a_i = b_i = i$ para $i = 0, \dots, n - 1$. Las sumas son $2i$, es decir, $2 \cdot \{0, 1, \dots, n - 1\}$. Como $(2, n) = 1$, por el teorema es un SRC.` },
            { texto: R`<b>Suma de un SRC.</b> Los elementos de un SRC son, en algún orden, congruentes con $0, 1, \dots, n - 1$ (uno a cada resto). Por la propiedad 4, su suma es $\equiv 0 + 1 + \dots + (n - 1) = \frac{n(n-1)}{2} \pmod n$.` },
            { texto: R`Si $n$ es par, $\frac{n(n-1)}{2} = \frac{n}{2}(n - 1) = \frac{n}{2} \cdot n - \frac{n}{2} \equiv -\frac{n}{2} \equiv \frac{n}{2} \pmod n$.` },
            { texto: R`<b>$n$ par: no.</b> Si $A$, $B$ y $C = \{a_i + b_i\}$ fueran SRC, la suma de $C$ sería la suma de $A$ más la de $B$: $\frac{n}{2} \equiv \frac{n}{2} + \frac{n}{2} = n \equiv 0 \pmod n$.` },
            { texto: R`Pero $0 \lt \frac{n}{2} \lt n$, así que $\frac{n}{2} \not\equiv 0 \pmod n$. Contradicción.` },
            { texto: R`Respuesta: exactamente los $n$ impares (incluido $n = 1$).` },
          ],
        },
        aprendes: {
          resultado: R`Existen tales $A$ y $B$ si y solo si $n$ es impar.`,
          ideas: [
            { idea: 'Invariante: la suma total', texto: R`Para probar que algo es imposible, busca una cantidad que debería valer dos cosas distintas. Sumar todos los elementos de un SRC da siempre lo mismo módulo $n$.` },
            { idea: 'Construcciones simples para el caso posible', texto: R`Para el caso que funciona, prueba lo más simple ($A = B = \{0, \dots, n-1\}$) y apóyate en un teorema ya visto ($k \cdot \text{SRC}$ es SRC).` },
            { idea: 'Conjeturar con casos pequeños', texto: R`Con $n = 1, 2, 3, 4$ a mano se ve el patrón «impares sí, pares no». La conjetura te dice qué construir y qué refutar.` },
          ],
        },
      }],
    },
    {
      id: 'cp5-5', numero: 5, nombre: R`El menor impar $n \gt 3$ con $3 \mid n$, $5 \mid n + 2$, $7 \mid n + 4$`,
      enunciado: R`Determine el menor $n$ impar, $n \gt 3$, tal que $3 \mid n$, $5 \mid n + 2$ y $7 \mid n + 4$.`,
      partes: [{
        id: 'x',
        pistas: [
          { tipo: 'concepto', texto: R`Se aplican el <b>Teorema Chino del Resto</b> (módulos primos relativos dos a dos) y la <b>propiedad fuerte 1</b>, para juntar dos congruencias con el mismo resto.`, enlaces: [CHINO, EJ_CHINO, FUERTE1] },
          { tipo: 'estrategia', texto: R`Escribe las cuatro condiciones (incluida «impar») como congruencias. Busca las que se pueden juntar antes de resolver.` },
          { tipo: 'arranque', texto: R`$5 \mid n + 2 \iff n \equiv -2 \equiv 3 \pmod 5$. Haz lo mismo con $7 \mid n + 4$. ¿Qué observas en los dos restos?` },
          { tipo: 'desbloqueo', texto: R`$n \equiv 3$ módulo $5$ y $7$ da $n \equiv 3 \pmod{35}$. Sustituye $n = 35s + 3$ en $3 \mid n$ y después impón que sea impar.` },
        ],
        solucion: {
          pasos: [
            { texto: R`Condiciones: $n \equiv 0 \pmod 3$, $n \equiv -2 \equiv 3 \pmod 5$, $n \equiv -4 \equiv 3 \pmod 7$, $n \equiv 1 \pmod 2$.` },
            { texto: R`Las de $5$ y $7$ tienen el mismo resto: por la propiedad fuerte 1, $n \equiv 3 \pmod{35}$. Sea $n = 35s + 3$.` },
            { texto: R`$3 \mid 35s + 3 \iff 3 \mid 35s \iff 3 \mid s$ (porque $(3, 35) = 1$). Luego $s = 3u$ y $n = 105u + 3$.` },
            { texto: R`$n$ impar: $105u + 3$ es impar si y solo si $105u$ es par, es decir, $u$ par. Con $u = 2w$: $n = 210w + 3$.` },
            { texto: R`$w = 0$ da $n = 3$, que no es $\gt 3$; el siguiente es $w = 1$: $n = 213$. Comprobación: $213 = 3 \cdot 71$, $215 = 5 \cdot 43$, $217 = 7 \cdot 31$.` },
          ],
        },
        aprendes: {
          resultado: R`$n = 213$ (todas las soluciones: $n \equiv 3 \pmod{210}$).`,
          ideas: [
            { idea: '«$m \mid n + c$» es «$n \equiv -c \pmod m$»', texto: R`Pasar de divisibilidades a congruencias con el resto ya despejado es el primer movimiento de cualquier sistema.` },
            { idea: 'Buscar restos iguales', texto: R`Dos condiciones con el mismo resto se juntan en una sola con el mcm. Ahorra la mitad del trabajo del Teorema Chino.` },
            { idea: 'La paridad es una congruencia más', texto: R`«Impar» es $n \equiv 1 \pmod 2$. Inclúyela en el sistema en lugar de tratarla aparte.` },
          ],
        },
      }],
    },
    {
      id: 'cp5-6', numero: 6, nombre: R`Un $k$ con $pq \mid pn^q + qn^p + kn$ para todo $n$`,
      enunciado: R`Sean $p$ y $q$ dos números primos diferentes, demuestre que $\exists k \in \Z$, tal que $pn^q + qn^p + kn$ es divisible por $pq$ $\forall n \in \Z$.`,
      partes: [{
        id: 'x',
        pistas: [
          { tipo: 'concepto', texto: R`Se aplican el <b>Pequeño Teorema de Fermat</b> en la forma <b>$p \mid n^p - n$ para todo $n$</b> (Libro III) y la <b>propiedad fuerte 1</b>: divisible por $p$ y por $q$ ⇒ divisible por $\mcm(p, q) = pq$.`, enlaces: [{ l: 3, e: 'cor-fermat' }, FERMAT, FUERTE1] },
          { tipo: 'estrategia', texto: R`$pq$ divide a un número si y solo si lo dividen $p$ y $q$. Trabaja módulo $p$ y módulo $q$ por separado y busca un $k$ que sirva para los dos.` },
          { tipo: 'arranque', texto: R`Módulo $p$: ¿qué pasa con el término $pn^q$? ¿Y a qué es congruente $n^p$?` },
          { tipo: 'arranque', texto: R`Módulo $p$ queda $(q + k)n \equiv 0$ para todo $n$. ¿Qué condición sobre $k$ lo garantiza?` },
          { tipo: 'desbloqueo', texto: R`Necesitas $k \equiv -q \pmod p$ y, por simetría, $k \equiv -p \pmod q$. Hay un $k$ muy simple que cumple las dos sin resolver nada.` },
        ],
        solucion: {
          pasos: [
            { texto: R`Tomamos $k = -(p + q)$ y sea $E = pn^q + qn^p + kn$.` },
            { texto: R`Módulo $p$: $pn^q \equiv 0$ y, por Fermat ($p \mid n^p - n$), $n^p \equiv n$. Así $E \equiv qn - (p + q)n = -pn \equiv 0 \pmod p$.` },
            { texto: R`Módulo $q$: $qn^p \equiv 0$ y $n^q \equiv n$. Así $E \equiv pn - (p + q)n = -qn \equiv 0 \pmod q$.` },
            { texto: R`$p \mid E$ y $q \mid E$ con $p \neq q$ primos, así que $\mcm(p, q) = pq$ divide a $E$ (propiedad fuerte 1), para todo $n \in \Z$.` },
          ],
        },
        aprendes: {
          resultado: R`$k = -(p + q)$ cumple $pq \mid pn^q + qn^p + kn$ para todo $n$.`,
          ideas: [
            { idea: 'Dividir un módulo compuesto en sus primos', texto: R`$pq \mid E$ equivale a $p \mid E$ y $q \mid E$. Cada primo por separado es más fácil, y Fermat solo funciona con módulo primo.` },
            { idea: 'Fermat como $n^p \equiv n$', texto: R`La forma $n^p \equiv n \pmod p$ vale para todo $n$ (incluso múltiplos de $p$). Úsala para bajar potencias de exponente $p$.` },
            { idea: 'Buscar el parámetro con las condiciones', texto: R`Escribe qué tiene que cumplir $k$ en cada módulo y luego elige uno que cumpla todas. A veces hay una elección evidente ($-(p+q)$); si no, el Teorema Chino la da.` },
          ],
        },
      }],
    },
    {
      id: 'cp5-7', numero: 7, nombre: R`$k$ consecutivos, cada uno divisible por un cubo mayor que $1$`,
      enunciado: R`Demuestra que dado $k \in \Z^+$, es posible encontrar una secuencia de $k$ enteros consecutivos, cada uno divisible por un cubo mayor que $1$.`,
      partes: [{
        id: 'x',
        pistas: [
          { tipo: 'concepto', texto: R`Se aplican el <b>Teorema Chino del Resto</b> y la <b>infinitud de los primos</b> (Libro I).`, enlaces: [CHINO, { l: 1, e: 'teo-infinitos-primos' }] },
          { tipo: 'estrategia', texto: R`Decide de antemano qué cubo va a dividir a cada número de la secuencia, y pide todas las condiciones a la vez con un sistema de congruencias.` },
          { tipo: 'arranque', texto: R`Si los números son $x + 1, x + 2, \dots, x + k$, quieres $c_i^3 \mid x + i$. Escríbelo como congruencia sobre $x$. ¿Qué tiene que cumplir la familia de módulos para usar el TCR?` },
          { tipo: 'desbloqueo', texto: R`Elige $k$ primos distintos $p_1, \dots, p_k$: los cubos $p_i^3$ son primos relativos dos a dos.` },
        ],
        solucion: {
          pasos: [
            { texto: R`Como hay infinitos primos, elegimos $k$ primos distintos $p_1, \dots, p_k$.` },
            { texto: R`Los módulos $p_1^3, \dots, p_k^3$ son primos relativos dos a dos: un divisor común de $p_i^3$ y $p_j^3$ solo podría tener los factores primos $p_i$ y $p_j$ a la vez, y $p_i \neq p_j$.` },
            { texto: R`Por el Teorema Chino del Resto, el sistema $x \equiv -i \pmod{p_i^3}$, $i = 1, \dots, k$, tiene solución $x$.` },
            { texto: R`Entonces $p_i^3 \mid x + i$ para cada $i$: los $k$ consecutivos $x + 1, \dots, x + k$ son divisibles, respectivamente, por los cubos $p_1^3, \dots, p_k^3$, todos mayores que $1$.` },
          ],
        },
        aprendes: {
          resultado: R`Para todo $k$ hay $k$ enteros consecutivos, cada uno divisible por un cubo mayor que $1$.`,
          ideas: [
            { idea: 'El TCR fabrica números a medida', texto: R`Para pedir varias propiedades de divisibilidad a la vez (a números consecutivos, por ejemplo), asigna un módulo a cada una y resuelve el sistema.` },
            { idea: 'Primos distintos dan módulos coprimos', texto: R`Potencias de primos distintos son primas relativas dos a dos. Es la forma de garantizar la hipótesis del TCR.` },
            { idea: 'Mismo esquema que «$n$ compuestos consecutivos»', texto: R`Igual que $(n+1)! + j$, aquí se consigue un bloque donde cada número tiene su divisor asignado. El TCR es la versión flexible de esa idea.` },
          ],
        },
      }],
    },
    {
      id: 'cp5-8', numero: 8, nombre: 'Teorema Chino del Resto con módulos cualesquiera',
      enunciado: R`Sea un sistema de ecuaciones lineales de congruencia $$x \equiv a_1 \pmod{n_1},\quad x \equiv a_2 \pmod{n_2},\quad \dots,\quad x \equiv a_k \pmod{n_k}.$$ Demuestre que dicho sistema tiene solución si y solo si $a_i \equiv a_j \pmod{(n_i, n_j)}$. Demuestre que la solución es única mod $\mcm(n_1, n_2, \dots, n_k)$.`,
      nota: R`La condición es para todo par $i \neq j$.`,
      partes: [
        {
          id: 'x', enunciado: R`Existencia: hay solución si y solo si $a_i \equiv a_j \pmod{(n_i, n_j)}$ para todo $i \neq j$.`,
          pistas: [
            { tipo: 'concepto', texto: R`Se aplican <b>$ax \equiv b\ (n)$ es soluble si y solo si $(a, n) \mid b$</b>, la <b>propiedad 10</b> (si $c \mid n$, una congruencia módulo $n$ vale módulo $c$) y la idea del <b>Teorema Chino del Resto</b>.`, enlaces: [SOLUBLE, L4('prop-10'), CHINO] },
            { tipo: 'estrategia', texto: R`«Solo si»: lleva las congruencias $i$ y $j$ al módulo común $(n_i, n_j)$. «Si»: resuelve primero el caso de dos congruencias y luego haz inducción sobre $k$, juntando las primeras en una sola.` },
            { tipo: 'arranque', texto: R`Para dos congruencias: escribe $x = a_1 + n_1 t$ y sustituye en la segunda. Queda una congruencia lineal en $t$. ¿Cuándo es soluble?` },
            { tipo: 'arranque', texto: R`Paso inductivo: las $k - 1$ primeras equivalen a $x \equiv c \pmod L$, con $L = \mcm(n_1, \dots, n_{k-1})$. Para añadir la $k$-ésima, ¿qué hay que comprobar sobre $c - a_k$?` },
            { tipo: 'desbloqueo', texto: R`Necesitas $(L, n_k) \mid c - a_k$. Con la factorización en primos (comparando exponentes), $(\mcm(n_1, \dots, n_{k-1}), n_k) = \mcm((n_1, n_k), \dots, (n_{k-1}, n_k))$. Y cada $(n_i, n_k)$ divide a $c - a_k$.` },
          ],
          solucion: {
            pasos: [
              { texto: R`<b>Solo si.</b> Si $x$ es solución, $x \equiv a_i \pmod{n_i}$ y $(n_i, n_j) \mid n_i$, así que $x \equiv a_i \pmod{(n_i, n_j)}$ (propiedad 10). Igual $x \equiv a_j \pmod{(n_i, n_j)}$. Luego $a_i \equiv a_j \pmod{(n_i, n_j)}$.` },
              { texto: R`<b>Dos congruencias.</b> $x \equiv a_1\ (n_1)$ significa $x = a_1 + n_1 t$. La segunda queda $n_1 t \equiv a_2 - a_1 \pmod{n_2}$, soluble si y solo si $(n_1, n_2) \mid a_2 - a_1$, que es la hipótesis. Con una solución $t$ se obtiene una $x$.` },
              { texto: R`Además, para dos congruencias, $y$ es solución si y solo si $y \equiv x \pmod{[n_1, n_2]}$ (lo prueba la parte de unicidad). Así el par equivale a una sola congruencia módulo $[n_1, n_2]$.` },
              { texto: R`<b>Inducción en $k$.</b> Supongamos que las $k - 1$ primeras (compatibles dos a dos) equivalen a $x \equiv c \pmod L$ con $L = [n_1, \dots, n_{k-1}]$. Falta ver que $x \equiv c\ (L)$ y $x \equiv a_k\ (n_k)$ son compatibles: $(L, n_k) \mid c - a_k$.` },
              { texto: R`Para cada $i \lt k$: $c \equiv a_i \pmod{n_i}$, luego también módulo $(n_i, n_k)$; y $a_i \equiv a_k \pmod{(n_i, n_k)}$ por hipótesis. Así $(n_i, n_k) \mid c - a_k$ para todo $i \lt k$, y por tanto su mcm también.` },
              { texto: R`Ese mcm es $(L, n_k)$: para cada primo, con exponentes $\alpha_i$ en $n_i$ y $\beta$ en $n_k$, se cumple $\min(\max_i \alpha_i, \beta) = \max_i \min(\alpha_i, \beta)$ (el TFA del Libro III da los exponentes). Luego $(L, n_k) \mid c - a_k$.` },
              { texto: R`Por el caso de dos congruencias hay solución, y el sistema completo equivale a una congruencia módulo $[L, n_k] = [n_1, \dots, n_k]$. Por inducción, vale para todo $k$.` },
            ],
          },
          aprendes: {
            resultado: R`El sistema tiene solución si y solo si cada par de congruencias es compatible: $a_i \equiv a_j \pmod{(n_i, n_j)}$.`,
            ideas: [
              { idea: 'Lo local da lo global', texto: R`Que cada par de condiciones sea compatible basta para que lo sea todo el sistema. La prueba consiste en juntar condiciones de dos en dos sin perder compatibilidad.` },
              { idea: 'Sustituir y resolver una lineal', texto: R`Para dos congruencias, $x = a_1 + n_1 t$ convierte el sistema en una ecuación lineal en $t$, que la conferencia ya sabe resolver.` },
              { idea: 'Exponentes para identidades de mcd y mcm', texto: R`mcd = mínimo de exponentes, mcm = máximo. Identidades como $(\mcm(a, b), c) = \mcm((a, c), (b, c))$ se reducen a $\min(\max(x, y), z) = \max(\min(x, z), \min(y, z))$.` },
            ],
          },
        },
        {
          id: 'u', enunciado: R`Unicidad: la solución es única módulo $\mcm(n_1, \dots, n_k)$.`,
          pistas: [
            { tipo: 'concepto', texto: R`Se aplican la <b>propiedad fuerte 1</b> (congruentes módulo $m$ y $n$ ⇒ módulo $\mcm(m, n)$) y el corolario <b>todo múltiplo común es múltiplo del mcm</b>.`, enlaces: [FUERTE1, { l: 2, e: 'cor-multiplo-mcm' }] },
            { tipo: 'estrategia', texto: R`«Única módulo $M$» significa dos cosas: dos soluciones son congruentes módulo $M$, y todo lo congruente módulo $M$ con una solución también es solución.` },
            { tipo: 'arranque', texto: R`Sean $x$, $y$ soluciones. ¿Qué divide a $x - y$? Mira cada congruencia del sistema.` },
            { tipo: 'desbloqueo', texto: R`$n_i \mid x - y$ para todo $i$: $x - y$ es múltiplo común de todos los $n_i$. ¿Qué dice eso respecto del mcm?` },
          ],
          solucion: {
            pasos: [
              { texto: R`Sean $x$, $y$ soluciones. Para cada $i$: $x \equiv a_i \equiv y \pmod{n_i}$, así que $n_i \mid x - y$.` },
              { texto: R`$x - y$ es múltiplo común de $n_1, \dots, n_k$, luego múltiplo de $M = \mcm(n_1, \dots, n_k)$: $x \equiv y \pmod M$.` },
              { texto: R`Recíprocamente, si $x$ es solución e $y \equiv x \pmod M$, como $n_i \mid M$ también $y \equiv x \equiv a_i \pmod{n_i}$ (propiedad 10): $y$ es solución.` },
              { texto: R`Las soluciones forman exactamente una clase módulo $M$: la solución es única módulo $\mcm(n_1, \dots, n_k)$.` },
            ],
          },
          aprendes: {
            resultado: R`Si el sistema tiene solución, es única módulo $\mcm(n_1, \dots, n_k)$ (con módulos coprimos, el mcm es el producto: el TCR de la conferencia).`,
            ideas: [
              { idea: 'Unicidad = la diferencia es múltiplo', texto: R`Para probar «única módulo $M$», resta dos soluciones y muestra que $M$ divide a la diferencia. Es el mismo esquema que en ecuaciones lineales.` },
              { idea: 'Generalizar quitando hipótesis', texto: R`El TCR de la conferencia pide módulos coprimos; aquí se ve qué pasa sin esa hipótesis: aparece una condición de compatibilidad y el producto se cambia por el mcm.` },
            ],
          },
        },
      ],
    },
    {
      id: 'cp5-9', numero: 9, nombre: R`★ ¿Cuántas soluciones tiene $x^2 \equiv 1 \pmod n$?`,
      enunciado: R`* Calcule la cantidad de soluciones de $x^2 \equiv 1 \pmod n$, para $n$ un entero positivo.`,
      nota: R`Es el ejercicio con estrella (más difícil). Se cuentan las soluciones módulo $n$, es decir, los $x \in \{0, 1, \dots, n - 1\}$.`,
      partes: [{
        id: 'x',
        pistas: [
          { tipo: 'concepto', texto: R`Se aplican el <b>Teorema Chino del Resto</b> (para partir $n$ en potencias de primos), el <b>Teorema Fundamental</b> (esa partición) y el <b>Lema de Euclides</b> (Libro III).`, enlaces: [CHINO, { l: 3, e: 'teo-fundamental' }, { l: 3, e: 'lema-euclides' }] },
          { tipo: 'estrategia', texto: R`Divide el problema: si $n = p_1^{e_1} \cdots p_r^{e_r}$, el TCR hace que contar soluciones módulo $n$ sea multiplicar las cuentas módulo cada $p_i^{e_i}$.` },
          { tipo: 'arranque', texto: R`Experimenta: cuenta las soluciones módulo $3$, $5$, $9$, $8$, $15$ y $16$. ¿Qué patrón ves para primos impares? ¿Y para potencias de $2$?` },
          { tipo: 'arranque', texto: R`Para $p$ impar: $x^2 \equiv 1 \pmod{p^e}$ significa $p^e \mid (x - 1)(x + 1)$. ¿Puede $p$ dividir a los dos factores a la vez?` },
          { tipo: 'desbloqueo', texto: R`Para $2^e$ con $e \ge 3$: $x$ es impar, y $x - 1$, $x + 1$ son pares consecutivos; uno de ellos tiene un solo factor $2$. ¿Cuántos factores $2$ le tocan al otro? ¿Qué valores de $x$ módulo $2^e$ salen?` },
          { tipo: 'desbloqueo', texto: R`Para juntar: cada elección de una solución módulo cada $p_i^{e_i}$ da, por el TCR, exactamente una solución módulo $n$. Las cuentas se multiplican.` },
        ],
        solucion: {
          pasos: [
            { texto: R`Sea $n = 2^e p_1^{e_1} \cdots p_r^{e_r}$ con $p_i$ primos impares distintos ($e \ge 0$). Los factores son primos relativos dos a dos.` },
            { texto: R`<b>Reducción por el TCR.</b> $x^2 \equiv 1 \pmod n$ si y solo si $x^2 \equiv 1$ módulo cada factor (un número es múltiplo de $n$ si y solo si lo es de cada factor, por ser coprimos). Por el TCR, cada combinación de restos módulo los factores corresponde a exactamente un resto módulo $n$. Así, el número de soluciones es el producto de las cuentas módulo cada factor.` },
            { texto: R`<b>$p$ impar.</b> $p^k \mid (x - 1)(x + 1)$. Si $p$ dividiera a ambos, dividiría a su diferencia $2$: imposible. Si $p \nmid x + 1$, entonces $(p^k, x + 1) = 1$ y $p^k \mid x - 1$ (teorema del Libro II); si no, $p^k \mid x + 1$. Así $x \equiv \pm 1 \pmod{p^k}$: exactamente $2$ soluciones, distintas porque $p^k \nmid 2$.` },
            { texto: R`<b>$2^e$ con $e \le 2$.</b> $e = 0$ o $1$: una solución ($x \equiv 1$). $e = 2$: $x \equiv 1, 3 \pmod 4$, dos soluciones.` },
            { texto: R`<b>$2^e$ con $e \ge 3$.</b> $x$ es impar, y $x - 1$, $x + 1$ son pares que difieren en $2$: uno de ellos es $\equiv 2 \pmod 4$ y tiene un solo factor $2$. Para que $2^e \mid (x - 1)(x + 1)$, el otro debe ser múltiplo de $2^{e-1}$: $x \equiv \pm 1 \pmod{2^{e-1}}$.` },
            { texto: R`Módulo $2^e$ eso da $x \in \{1,\ 2^{e-1} + 1,\ 2^{e-1} - 1,\ 2^e - 1\}$, cuatro restos distintos (con $e \ge 3$). Todos sirven: $(2^{e-1} \pm 1)^2 = 2^{2e-2} \pm 2^e + 1 \equiv 1$ porque $2e - 2 \ge e$.` },
            { texto: R`<b>Resultado.</b> Con $r$ primos impares distintos en $n$: el número de soluciones es $2^r \cdot c$, con $c = 1$ si $e \le 1$, $c = 2$ si $e = 2$ y $c = 4$ si $e \ge 3$. Ejemplos: módulo $15$ hay $4$; módulo $8$, $4$; módulo $120 = 2^3 \cdot 3 \cdot 5$, $16$.` },
          ],
        },
        aprendes: {
          resultado: R`$x^2 \equiv 1 \pmod n$ tiene $2^r \cdot c$ soluciones, donde $r$ es el número de primos impares distintos de $n$ y $c = 1, 1, 2, 4$ según el exponente de $2$ en $n$ sea $0, 1, 2$ o $\ge 3$.`,
          ideas: [
            { idea: 'Contar módulo $n$ = multiplicar cuentas módulo potencias de primos', texto: R`El TCR convierte un problema módulo $n$ en problemas independientes módulo cada $p^e$. Para contar soluciones de cualquier ecuación polinómica módulo $n$, empieza así.` },
            { idea: 'Factorizar la ecuación', texto: R`$x^2 - 1 = (x - 1)(x + 1)$, y los dos factores casi no comparten primos (su diferencia es $2$). Un primo que divide al producto «elige» uno de los factores.` },
            { idea: 'El primo $2$ es especial', texto: R`Muchos resultados tienen un comportamiento distinto para $p = 2$, porque $1 \equiv -1$ módulo $2$ y $x \pm 1$ son ambos pares. Trata siempre el $2$ aparte.` },
          ],
        },
      }],
    },
  ],
};
