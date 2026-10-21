// Clase práctica 4 (3 de octubre de 2025) — acompaña a la Conferencia 4 (congruencias).
// Enunciados transcritos del PDF renderizado (los exponentes, leídos del PDF: pdftotext los pierde).
const R = String.raw;
const L4 = (e) => ({ l: 4, e });
const SUMA = L4('prop-4'), PRODUCTO = L4('prop-6'), POTENCIA = L4('prop-7'), FERMAT = L4('teo-fermat'), DEF = L4('def-congruencia');
const DIVIDE = L4('teo-congruencia-divide'), POLINOMIO = L4('fuerte-4');

export default {
  numero: 4, fecha: '3 de octubre de 2025',
  ejercicios: [
    {
      id: 'cp4-1', numero: 1, nombre: 'Verdadero o falso con números enormes',
      enunciado: R`Clasifique en verdadero o falso las siguientes afirmaciones:<ul><li>$37621 + 2^{30} \cdot 471 + 59603 \cdot 25$ es divisible por $12$.</li><li>$375121 \cdot 4^{105} - 35^{91}$ es coprimo (primo relativo) con $6$ y $9^{1684} - 7^{52688}$ es divisible por $10$.</li><li>$2^{70} + 3^{70}$ es divisible por $13$ y $3^{47}$ deja resto $4$ cuando se divide por $23$.</li></ul>`,
      partes: [
        {
          id: 'a', etiqueta: '1.ª', enunciado: R`$37621 + 2^{30} \cdot 471 + 59603 \cdot 25$ es divisible por $12$.`,
          pistas: [
            { tipo: 'concepto', texto: R`Se aplican las <b>propiedades 4, 6 y 7</b> de la congruencia: sumas, productos y potencias se pueden reducir pieza a pieza. Y <b>$a \equiv b\ (n) \iff n \mid a - b$</b>: «divisible por $12$» es «$\equiv 0 \pmod{12}$».`, enlaces: [SUMA, PRODUCTO, POTENCIA, DIVIDE] },
            { tipo: 'estrategia', texto: R`No calcules el número. Cambia cada pieza por su resto módulo $12$ y opera con los restos.` },
            { tipo: 'arranque', texto: R`Calcula $37621$, $471$, $59603$ y $25$ módulo $12$. Si un resto es $11$, usa $-1$: simplifica los productos.` },
            { tipo: 'desbloqueo', texto: R`Para $2^{30}$: calcula $2^1, 2^2, 2^3, 2^4, \dots$ módulo $12$ y busca cuándo se repiten los restos.` },
          ],
          solucion: {
            pasos: [
              { texto: R`Restos módulo $12$: $37621 = 12 \cdot 3135 + 1 \equiv 1$; $471 = 12 \cdot 39 + 3 \equiv 3$; $59603 = 12 \cdot 4966 + 11 \equiv -1$; $25 \equiv 1$.` },
              { texto: R`Potencias de $2$: $2^2 = 4$, $2^3 = 8$, $2^4 = 16 \equiv 4$. Desde $2^2$ se alternan $4, 8, 4, 8, \dots$: exponente par da $4$. Así $2^{30} \equiv 4$.` },
              { texto: R`Por las propiedades 6 y 4: $37621 + 2^{30} \cdot 471 + 59603 \cdot 25 \equiv 1 + 4 \cdot 3 + (-1) \cdot 1 = 12 \equiv 0 \pmod{12}$.` },
              { texto: R`Es divisible por $12$: <b>verdadera</b>.` },
            ],
          },
          aprendes: {
            resultado: R`La afirmación es verdadera: la expresión es $\equiv 0 \pmod{12}$.`,
            ideas: [
              { idea: 'Reducir antes de operar', texto: R`Con congruencias, cada número se puede cambiar por su resto (o por cualquier representante) antes de sumar o multiplicar. Nunca calcules el número grande.` },
              { idea: 'Representantes negativos', texto: R`$11 \equiv -1 \pmod{12}$: elegir el representante más pequeño en valor absoluto hace triviales los productos y las potencias.` },
              { idea: 'Las potencias se vuelven periódicas', texto: R`Calcula potencias sucesivas hasta que un resto se repita; desde ahí el ciclo se repite. Sirve para cualquier $a^k \bmod n$.` },
            ],
          },
        },
        {
          id: 'b', etiqueta: '2.ª', enunciado: R`$375121 \cdot 4^{105} - 35^{91}$ es coprimo con $6$ y $9^{1684} - 7^{52688}$ es divisible por $10$.`,
          pistas: [
            { tipo: 'concepto', texto: R`Las <b>propiedades 4, 6 y 7</b> (reducir sumas, productos y potencias) en dos módulos distintos.`, enlaces: [SUMA, PRODUCTO, POTENCIA] },
            { tipo: 'estrategia', texto: R`«Coprimo con $6$» significa que no lo divide ni $2$ ni $3$: el mcd con $6$ solo puede ser $1, 2, 3$ o $6$. Trabaja módulo $2$ y módulo $3$ por separado.` },
            { tipo: 'arranque', texto: R`Módulo $3$: $4 \equiv 1$ y $35 \equiv -1$. ¿Y $375121$? (suma sus cifras). Módulo $2$: ¿qué paridad tiene cada término?` },
            { tipo: 'desbloqueo', texto: R`Para la segunda afirmación: $9 \equiv -1 \pmod{10}$. Para $7$, busca la primera potencia que da $1$ módulo $10$ y mira el exponente $52688$ respecto de ella.` },
          ],
          solucion: {
            pasos: [
              { texto: R`Sea $v = 375121 \cdot 4^{105} - 35^{91}$. El mcd de $v$ y $6$ divide a $6$; es $1$ si y solo si ni $2$ ni $3$ dividen a $v$.` },
              { texto: R`Módulo $2$: $4^{105}$ es par y $35^{91}$ es impar, así que $v \equiv 0 - 1 \equiv 1 \pmod 2$: $2 \nmid v$.` },
              { texto: R`Módulo $3$: $375121$ tiene suma de cifras $19$, así que $375121 \equiv 19 \equiv 1$ (porque $10 \equiv 1 \pmod 3$); $4 \equiv 1$ y $35 \equiv -1$. Entonces $v \equiv 1 \cdot 1^{105} - (-1)^{91} = 1 + 1 = 2 \pmod 3$: $3 \nmid v$. Luego $(v, 6) = 1$.` },
              { texto: R`$9 \equiv -1 \pmod{10}$, y $1684$ es par: $9^{1684} \equiv 1$. Además $7^2 = 49 \equiv -1$, así que $7^4 \equiv 1 \pmod{10}$; como $52688 = 4 \cdot 13172$, $7^{52688} \equiv 1$.` },
              { texto: R`$9^{1684} - 7^{52688} \equiv 1 - 1 = 0 \pmod{10}$. Las dos partes se cumplen: <b>verdadera</b>.` },
            ],
          },
          aprendes: {
            resultado: R`La afirmación es verdadera: $v$ no es divisible ni por $2$ ni por $3$, y $9^{1684} - 7^{52688} \equiv 0 \pmod{10}$.`,
            ideas: [
              { idea: 'Coprimo con $n$ = ningún primo de $n$ lo divide', texto: R`Para $(v, 6) = 1$ basta mirar módulo $2$ y módulo $3$. Descomponer el módulo en primos reduce una pregunta a varias más fáciles.` },
              { idea: 'Buscar la potencia que da $\pm 1$', texto: R`Si $a^k \equiv 1$ (o $-1$), los exponentes se reducen dividiendo por $k$. $9 \equiv -1$ y $7^2 \equiv -1 \pmod{10}$ resuelven exponentes enormes al instante.` },
              { idea: 'Suma de cifras', texto: R`Como $10 \equiv 1 \pmod 3$ (y $\pmod 9$), un número es congruente con la suma de sus cifras módulo $3$ y módulo $9$.` },
            ],
          },
        },
        {
          id: 'c', etiqueta: '3.ª', enunciado: R`$2^{70} + 3^{70}$ es divisible por $13$ y $3^{47}$ deja resto $4$ al dividirse por $23$.`,
          pistas: [
            { tipo: 'concepto', texto: R`Se aplica el <b>Pequeño Teorema de Fermat</b>: si $p$ es primo y $p \nmid a$, $a^{p-1} \equiv 1 \pmod p$. Más la <b>propiedad 7</b> (potencias).`, enlaces: [FERMAT, POTENCIA] },
            { tipo: 'estrategia', texto: R`Exponentes grandes módulo un primo: divide el exponente entre $p - 1$ y quédate solo con el resto.` },
            { tipo: 'arranque', texto: R`$13$ es primo: $2^{12} \equiv 1$ y $3^{12} \equiv 1 \pmod{13}$. Escribe $70 = 12q + r$. ¿Qué te queda por calcular?` },
            { tipo: 'desbloqueo', texto: R`A veces hay un ciclo más corto que $p - 1$: mira $3^3 \bmod 13$. Para $3^{47} \bmod 23$: $23$ es primo, $3^{22} \equiv 1$.` },
          ],
          solucion: {
            pasos: [
              { texto: R`$13$ es primo y no divide a $2$ ni a $3$: por Fermat $2^{12} \equiv 1$ y $3^{12} \equiv 1 \pmod{13}$.` },
              { texto: R`$70 = 12 \cdot 5 + 10$: $2^{70} = (2^{12})^5 \cdot 2^{10} \equiv 2^{10} = 1024 = 13 \cdot 78 + 10 \equiv 10$.` },
              { texto: R`$3^3 = 27 = 2 \cdot 13 + 1 \equiv 1$, y $70 = 3 \cdot 23 + 1$: $3^{70} = (3^3)^{23} \cdot 3 \equiv 3$.` },
              { texto: R`$2^{70} + 3^{70} \equiv 10 + 3 = 13 \equiv 0 \pmod{13}$: divisible por $13$.` },
              { texto: R`$23$ es primo: $3^{22} \equiv 1 \pmod{23}$. $47 = 22 \cdot 2 + 3$: $3^{47} \equiv 3^3 = 27 \equiv 4 \pmod{23}$. Deja resto $4$. Las dos partes se cumplen: <b>verdadera</b>.` },
            ],
          },
          aprendes: {
            resultado: R`La afirmación es verdadera: $13 \mid 2^{70} + 3^{70}$ y $3^{47} \equiv 4 \pmod{23}$.`,
            ideas: [
              { idea: 'Fermat reduce exponentes', texto: R`Módulo un primo $p$ (y base no múltiplo de $p$), el exponente solo importa por su resto al dividir por $p - 1$. Es el atajo estándar para $a^{\text{enorme}} \bmod p$.` },
              { idea: 'Busca ciclos más cortos', texto: R`Fermat da un ciclo de longitud $p - 1$, pero puede haber uno menor ($3^3 \equiv 1 \pmod{13}$). Calcular unas pocas potencias a veces ahorra trabajo.` },
            ],
          },
        },
      ],
    },
    {
      id: 'cp4-2', numero: 2, nombre: R`$1! + 2! + \dots + n!$ es un cuadrado solo para finitos $n$`,
      enunciado: R`Demuestre que es finita la cantidad de valores de $n$, para los cuales la suma desde $k = 1$ hasta $n$ de $k!$ es un cuadrado $\left(\sum_{k=1}^{n} k! = x^2\right)$.`,
      partes: [{
        id: 'x',
        pistas: [
          { tipo: 'concepto', texto: R`Se aplican las <b>propiedades 4 y 6</b> (sumas y productos módulo $n$) y la definición de <b>congruencia</b>: dos números iguales dejan el mismo resto.`, enlaces: [SUMA, PRODUCTO, DEF] },
          { tipo: 'estrategia', texto: R`Para probar que un número no es un cuadrado, busca un módulo en el que deje un resto que ningún cuadrado deja.` },
          { tipo: 'arranque', texto: R`A partir de cierto $k$, $k!$ es múltiplo de muchos números. Elige un módulo que haga $0$ a casi todos los sumandos.` },
          { tipo: 'arranque', texto: R`Prueba módulo $5$: ¿desde qué $k$ es $k! \equiv 0$? ¿Cuánto vale la suma módulo $5$ para $n \ge 4$?` },
          { tipo: 'desbloqueo', texto: R`Haz la tabla de cuadrados módulo $5$: para $x \equiv 0, 1, 2, 3, 4$, ¿cuánto vale $x^2$? Compárala con el resto de la suma.` },
        ],
        solucion: {
          pasos: [
            { texto: R`Para $k \ge 5$, $k! = 1 \cdot 2 \cdots 5 \cdots k$ es múltiplo de $5$: $k! \equiv 0 \pmod 5$.` },
            { texto: R`Para $n \ge 4$: $\sum_{k=1}^{n} k! \equiv 1 + 2 + 6 + 24 = 33 \equiv 3 \pmod 5$ (los sumandos desde $5!$ son $\equiv 0$).` },
            { texto: R`Todo entero es $x \equiv 0, 1, 2, 3, 4 \pmod 5$, y entonces $x^2 \equiv 0, 1, 4, 9, 16$, es decir, $0, 1, 4, 4, 1$. Un cuadrado nunca es $\equiv 3 \pmod 5$.` },
            { texto: R`Luego para $n \ge 4$ la suma no es un cuadrado. Solo quedan $n = 1, 2, 3$: $1 = 1^2$, $3$ no es cuadrado, $9 = 3^2$.` },
            { texto: R`La suma es un cuadrado exactamente para $n = 1$ y $n = 3$: una cantidad finita.` },
          ],
        },
        aprendes: {
          resultado: R`$\sum_{k=1}^{n} k!$ es un cuadrado solo para $n = 1$ y $n = 3$.`,
          ideas: [
            { idea: 'Obstrucción modular', texto: R`Si una ecuación es imposible módulo $m$, es imposible en los enteros. Para «nunca es un cuadrado» se compara con la tabla de cuadrados módulo $m$.` },
            { idea: 'Elegir el módulo que mata lo que estorba', texto: R`Los factoriales grandes son $\equiv 0$ módulo cualquier número pequeño. Elegir bien el módulo deja solo un número finito de términos.` },
            { idea: '«Finitos» = a partir de un punto, ninguno', texto: R`Para probar que algo pasa finitas veces, muestra que deja de pasar desde un $n_0$ y revisa a mano los casos anteriores.` },
          ],
        },
      }],
    },
    {
      id: 'cp4-3', numero: 3, nombre: 'Dos ecuaciones sin soluciones enteras',
      enunciado: R`Demuestre que las siguientes ecuaciones no tienen solución en enteros ($\Z$):<ul><li>$3x^2 + 5 + 9xy = y^2$</li><li>$x^2 + y^2 - 8z = 6$</li></ul>`,
      partes: [
        {
          id: 'a', etiqueta: '1.ª', enunciado: R`$3x^2 + 5 + 9xy = y^2$.`,
          pistas: [
            { tipo: 'concepto', texto: R`Se aplica la <b>propiedad fuerte 4</b>: si $a \equiv b\ (n)$, entonces $f(a) \equiv f(b)\ (n)$ para todo polinomio $f$ con coeficientes enteros. Una igualdad entera sigue siendo cierta módulo cualquier $n$.`, enlaces: [POLINOMIO, SUMA, PRODUCTO] },
            { tipo: 'estrategia', texto: R`Si la ecuación no tiene solución módulo algún $m$, no la tiene en los enteros. Busca un módulo donde sea imposible.` },
            { tipo: 'arranque', texto: R`¿Qué módulo hace desaparecer a la vez los términos $3x^2$ y $9xy$?` },
            { tipo: 'desbloqueo', texto: R`Módulo $3$ queda $y^2 \equiv 5 \equiv 2$. Haz la tabla de cuadrados módulo $3$.` },
          ],
          solucion: {
            pasos: [
              { texto: R`Supongamos que hay enteros $x, y$ con $3x^2 + 5 + 9xy = y^2$. Los dos lados son el mismo número, así que son congruentes módulo $3$.` },
              { texto: R`Módulo $3$: $3x^2 \equiv 0$, $9xy \equiv 0$ y $5 \equiv 2$; queda $y^2 \equiv 2 \pmod 3$.` },
              { texto: R`Pero $y \equiv 0, 1, 2$ da $y^2 \equiv 0, 1, 4 \equiv 1$: un cuadrado es $\equiv 0$ o $1 \pmod 3$, nunca $2$.` },
              { texto: R`Contradicción: la ecuación no tiene soluciones enteras.` },
            ],
          },
          aprendes: {
            resultado: R`$3x^2 + 5 + 9xy = y^2$ no tiene soluciones enteras: módulo $3$ pide un cuadrado $\equiv 2$.`,
            ideas: [
              { idea: 'Reducir una ecuación módulo $m$', texto: R`Una igualdad entre enteros se conserva módulo cualquier $m$. Si módulo $m$ es imposible, la ecuación original también. Es la técnica número uno para «no tiene solución entera».` },
              { idea: 'Elegir $m$ mirando los coeficientes', texto: R`Si varios coeficientes son múltiplos de $3$, trabajar módulo $3$ los borra. Mira qué divide a los coeficientes que estorban.` },
            ],
          },
        },
        {
          id: 'b', etiqueta: '2.ª', enunciado: R`$x^2 + y^2 - 8z = 6$.`,
          pistas: [
            { tipo: 'concepto', texto: R`Otra vez la <b>propiedad fuerte 4</b> y las propiedades de sumas y productos: la ecuación se puede leer módulo cualquier número.`, enlaces: [POLINOMIO, SUMA] },
            { tipo: 'estrategia', texto: R`Elige el módulo que elimina la variable que no controlas ($z$) y estudia qué valores puede tomar el resto.` },
            { tipo: 'arranque', texto: R`¿Qué módulo hace $8z \equiv 0$? Escribe la ecuación en ese módulo.` },
            { tipo: 'desbloqueo', texto: R`Haz la tabla de cuadrados módulo $8$ ($x \equiv 0, \dots, 7$) y todas las sumas posibles de dos cuadrados. ¿Aparece el $6$?` },
          ],
          solucion: {
            pasos: [
              { texto: R`Si hubiera enteros $x, y, z$ con $x^2 + y^2 - 8z = 6$, módulo $8$ quedaría $x^2 + y^2 \equiv 6 \pmod 8$.` },
              { texto: R`Cuadrados módulo $8$: $x \equiv 0, 1, 2, 3, 4, 5, 6, 7$ da $x^2 \equiv 0, 1, 4, 1, 0, 1, 4, 1$. Solo $0, 1, 4$.` },
              { texto: R`Sumas de dos de ellos: $0, 1, 2, 4, 5, 8 \equiv 0$. Nunca $6$.` },
              { texto: R`Contradicción: no hay soluciones enteras.` },
            ],
          },
          aprendes: {
            resultado: R`$x^2 + y^2 - 8z = 6$ no tiene soluciones enteras: una suma de dos cuadrados nunca es $\equiv 6 \pmod 8$.`,
            ideas: [
              { idea: 'El módulo que borra una variable', texto: R`Una variable libre ($z$) multiplicada por $m$ desaparece módulo $m$. Así reduces a una pregunta sobre las otras variables.` },
              { idea: 'Cuadrados módulo $4$ y $8$', texto: R`Módulo $4$ los cuadrados son $0, 1$; módulo $8$, $0, 1, 4$. Recuérdalos: aparecen constantemente en ecuaciones con cuadrados. (Módulo $4$ aquí no basta: $1 + 1 \equiv 2 \equiv 6$).` },
            ],
          },
        },
      ],
    },
    {
      id: 'cp4-4', numero: 4, nombre: R`Ternas con $2^a + 2^b = c!$`,
      enunciado: R`Determine el número de ternas $(a, b, c)$ que satisfagan: $2^a + 2^b = c!$.`,
      nota: R`El enunciado no dice si $0$ es natural. Con $a, b, c \ge 0$ hay $5$ ternas; si se exige $a, b \ge 1$, hay $4$. La solución da las dos.`,
      partes: [{
        id: 'x',
        pistas: [
          { tipo: 'concepto', texto: R`Se aplican la <b>propiedad 7</b> (potencias módulo $n$, para ver que $2^k$ es periódico módulo $7$) y la factorización única (Libro III): todo entero positivo es $2^e$ por un impar, de una sola forma.`, enlaces: [POTENCIA, DEF, { l: 3, e: 'teo-fundamental' }] },
          { tipo: 'estrategia', texto: R`Saca factor común la potencia de $2$ más pequeña: el lado izquierdo queda $2^a$ por un número impar. Compara con la parte par y la impar de $c!$.` },
          { tipo: 'arranque', texto: R`Con $a \lt b$: $2^a(1 + 2^{b-a}) = c!$. Para $c$ grande, $c!$ es múltiplo de $7$. ¿Puede $1 + 2^k$ ser múltiplo de $7$?` },
          { tipo: 'arranque', texto: R`Calcula $2^0, 2^1, 2^2, 2^3, \dots$ módulo $7$. ¿Qué restos aparecen? ¿Aparece el $6 \equiv -1$?` },
          { tipo: 'desbloqueo', texto: R`Eso descarta $c \ge 7$. Para $c \le 6$, escribe $c! = 2^e \cdot m$ con $m$ impar y compara: $2^a = 2^e$ y $1 + 2^{b-a} = m$.` },
          { tipo: 'desbloqueo', texto: R`No olvides el caso $a = b$: $2^{a+1} = c!$. ¿Qué factoriales son potencias de $2$?` },
        ],
        solucion: {
          pasos: [
            { texto: R`<b>Caso $a = b$:</b> $2^{a+1} = c!$. Para $c \ge 3$, $3 \mid c!$ y no divide a una potencia de $2$. $c = 0, 1$ dan $c! = 1$, imposible ($2^{a+1} \ge 2$). Solo $c = 2$: $2^{a+1} = 2$, $a = 0$. Terna $(0, 0, 2)$.` },
            { texto: R`<b>Caso $a \lt b$</b> (el caso $a \gt b$ es simétrico): $2^a(1 + 2^k) = c!$ con $k = b - a \ge 1$, y $1 + 2^k$ es impar y $\ge 3$; en particular $c \ge 3$.` },
            { texto: R`Si $c \ge 7$: $7 \mid c!$ y $(7, 2^a) = 1$, luego $7 \mid 1 + 2^k$, es decir, $2^k \equiv -1 \equiv 6 \pmod 7$.` },
            { texto: R`Pero $2^3 = 8 \equiv 1 \pmod 7$, así que las potencias de $2$ módulo $7$ recorren solo $1, 2, 4$ (propiedad 7: $2^{3q + r} \equiv 2^r$). Nunca $6$: no hay soluciones con $c \ge 7$.` },
            { texto: R`Para $3 \le c \le 6$, por la factorización única, $2^a$ es la mayor potencia de $2$ que divide a $c!$ y $1 + 2^k$ su parte impar: $3! = 2 \cdot 3$ da $a = 1$, $2^k = 2$, $k = 1$. $4! = 2^3 \cdot 3$ da $a = 3$, $k = 1$. $5! = 2^3 \cdot 15$ pide $2^k = 14$, imposible. $6! = 2^4 \cdot 45$ pide $2^k = 44$, imposible.` },
            { texto: R`Con $a \lt b$: $(1, 2, 3)$ y $(3, 4, 4)$; con $a \gt b$, sus simétricas $(2, 1, 3)$ y $(4, 3, 4)$.` },
            { texto: R`Total: con $a, b \ge 0$, las $5$ ternas $(0, 0, 2), (1, 2, 3), (2, 1, 3), (3, 4, 4), (4, 3, 4)$; con $a, b \ge 1$, las $4$ últimas.` },
          ],
        },
        aprendes: {
          resultado: R`$2^a + 2^b = c!$ tiene $5$ soluciones con $a, b \ge 0$ (o $4$ con $a, b \ge 1$): $(0, 0, 2)$, $(1, 2, 3)$, $(2, 1, 3)$, $(3, 4, 4)$, $(4, 3, 4)$.`,
          ideas: [
            { idea: 'Sacar la menor potencia', texto: R`$2^a + 2^b = 2^a(1 + 2^{b-a})$ separa la parte par de la impar. Con la factorización única, puedes igualar cada parte con la del otro lado.` },
            { idea: 'Un primo grande del factorial como obstrucción', texto: R`$c!$ es múltiplo de todo primo $\le c$. Elegir un primo $p$ en el que el otro lado nunca es $\equiv 0$ acota $c$ y deja finitos casos.` },
            { idea: 'Ciclo de potencias módulo $p$', texto: R`Las potencias de $2$ módulo $7$ solo toman $1, 2, 4$. Calcular el ciclo te dice qué restos son imposibles.` },
          ],
        },
      }],
    },
    {
      id: 'cp4-5', numero: 5, nombre: R`Si $P \equiv 5\ (8)$ y $P \mid a^4 + b^4$, entonces $P \mid a$ y $P \mid b$`,
      enunciado: R`Sea $P$ un número primo tal que si $P \equiv 5\ (8)$ y $P \mid (a^4 + b^4)$ entonces $P \mid a$ y $P \mid b$.`,
      nota: R`Se lee: «Demuestre que si $P$ es un primo con $P \equiv 5 \pmod 8$ y $P \mid a^4 + b^4$, entonces $P \mid a$ y $P \mid b$».`,
      partes: [{
        id: 'x',
        pistas: [
          { tipo: 'concepto', texto: R`Se aplican el <b>Pequeño Teorema de Fermat</b> ($a^{P-1} \equiv 1$ si $P \nmid a$) y la <b>propiedad 7</b> (elevar una congruencia a una potencia).`, enlaces: [FERMAT, POTENCIA] },
          { tipo: 'estrategia', texto: R`Por contradicción: si $P \nmid a$, consigue una congruencia imposible elevando $a^4 \equiv -b^4$ a una potencia que haga aparecer el exponente $P - 1$.` },
          { tipo: 'arranque', texto: R`Primero: si $P$ divide a uno de $a$, $b$, divide al otro (usa $P \mid a^4 + b^4$ y que $P$ es primo). Así basta descartar el caso $P \nmid a$, $P \nmid b$.` },
          { tipo: 'arranque', texto: R`$P = 8t + 5$. Escribe $P - 1$ como $4$ por algo. ¿Ese algo es par o impar?` },
          { tipo: 'desbloqueo', texto: R`Eleva $a^4 \equiv -b^4$ a la potencia $2t + 1$. ¿Qué dice Fermat de cada lado? ¿Qué signo queda?` },
        ],
        solucion: {
          pasos: [
            { texto: R`Si $P \mid a$: entonces $P \mid (a^4 + b^4) - a^4 = b^4$, y como $P$ es primo, $P \mid b$ (corolario del Libro III: si $p \mid b^k$, $p \mid b$). Igual si $P \mid b$. Basta descartar $P \nmid a$ y $P \nmid b$.` },
            { texto: R`Supongamos $P \nmid a$, $P \nmid b$. De $P \mid a^4 + b^4$: $a^4 \equiv -b^4 \pmod P$.` },
            { texto: R`$P = 8t + 5$, así que $P - 1 = 8t + 4 = 4(2t + 1)$, con $2t + 1$ impar.` },
            { texto: R`Elevando a $2t + 1$ (propiedad 7): $a^{4(2t+1)} \equiv (-1)^{2t+1} b^{4(2t+1)}$, es decir, $a^{P-1} \equiv -b^{P-1} \pmod P$.` },
            { texto: R`Por Fermat, $a^{P-1} \equiv 1$ y $b^{P-1} \equiv 1$: queda $1 \equiv -1$, o sea $P \mid 2$. Imposible, porque $P \ge 5$.` },
            { texto: R`Luego $P \mid a$ y $P \mid b$.` },
          ],
        },
        aprendes: {
          resultado: R`Si $P$ es primo, $P \equiv 5 \pmod 8$ y $P \mid a^4 + b^4$, entonces $P \mid a$ y $P \mid b$.`,
          ideas: [
            { idea: 'Elevar para alcanzar el exponente de Fermat', texto: R`Si tienes $x^k \equiv y$ y $k$ divide a $p - 1$, eleva a $\frac{p-1}{k}$: aparece $x^{p-1} \equiv 1$. Así se convierten congruencias de potencias en información concreta.` },
            { idea: 'El signo sobrevive a potencias impares', texto: R`$(-1)^{\text{impar}} = -1$. Por eso importa que $\frac{P-1}{4}$ sea impar: es exactamente donde se usa $P \equiv 5 \pmod 8$.` },
            { idea: '$1 \equiv -1$ solo módulo $2$', texto: R`Llegar a $1 \equiv -1 \pmod p$ es una contradicción para todo primo impar. Es un final típico de estos argumentos.` },
          ],
        },
      }],
    },
    {
      id: 'cp4-6', numero: 6, nombre: 'Los palíndromos con una cantidad par de cifras son compuestos',
      enunciado: R`Sea $n$ un entero positivo, mayor que $20$. Si $n$ es palíndromo y tiene una cantidad par de cifras entonces $n$ es compuesto.`,
      partes: [{
        id: 'x',
        pistas: [
          { tipo: 'concepto', texto: R`Se aplican las <b>propiedades 4, 6 y 7</b>: un número escrito en base $10$, $n = \sum d_i 10^i$, se puede reducir cifra a cifra módulo cualquier $m$.`, enlaces: [SUMA, PRODUCTO, POTENCIA] },
          { tipo: 'estrategia', texto: R`Busca un divisor fijo que divida a todos esos palíndromos. Prueba con $1221$, $4554$, $123321$: ¿qué primo los divide a todos?` },
          { tipo: 'arranque', texto: R`Es $11$. ¿A qué es congruente $10$ módulo $11$? ¿Y $10^i$?` },
          { tipo: 'desbloqueo', texto: R`Con $2m$ cifras, empareja la posición $i$ con la $2m - 1 - i$: tienen la misma cifra, y sus exponentes suman $2m - 1$, que es impar. ¿Qué signos tienen $(-1)^i$ y $(-1)^{2m-1-i}$?` },
          { tipo: 'desbloqueo', texto: R`Ya tienes $11 \mid n$. ¿Por qué $n$ no puede ser el propio $11$, y por qué eso lo hace compuesto?` },
        ],
        solucion: {
          pasos: [
            { texto: R`Sea $n = \sum_{i=0}^{2m-1} d_i 10^i$ con $2m$ cifras, palíndromo: $d_i = d_{2m-1-i}$.` },
            { texto: R`$10 \equiv -1 \pmod{11}$, luego $10^i \equiv (-1)^i$ (propiedad 7) y $n \equiv \sum_{i=0}^{2m-1} d_i (-1)^i \pmod{11}$.` },
            { texto: R`Emparejamos $i$ con $j = 2m - 1 - i$ ($i \lt j$ recorre la primera mitad). Como $i + j = 2m - 1$ es impar, $i$ y $j$ tienen distinta paridad: $(-1)^i = -(-1)^j$. Y $d_i = d_j$. Cada par aporta $d_i(-1)^i + d_j(-1)^j = 0$.` },
            { texto: R`Luego $n \equiv 0 \pmod{11}$: $11 \mid n$.` },
            { texto: R`Como $n \gt 20$, $n \neq 11$, y $11$ es un divisor con $1 \lt 11 \lt n$: $n$ es compuesto.` },
          ],
        },
        aprendes: {
          resultado: R`Todo palíndromo con una cantidad par de cifras es múltiplo de $11$; si es mayor que $20$, es compuesto.`,
          ideas: [
            { idea: 'Criterios de divisibilidad = $10$ módulo $m$', texto: R`$10 \equiv 1 \pmod 9$ da la suma de cifras; $10 \equiv -1 \pmod{11}$ da la suma alternada. Cualquier pregunta sobre cifras se traduce eligiendo el $m$ adecuado.` },
            { idea: 'Emparejar términos que se cancelan', texto: R`Una simetría (palíndromo) más un cambio de signo (paridad del exponente) hace que los términos se anulen por pares. Busca simetrías que emparejen.` },
            { idea: 'Para «compuesto», un divisor fijo', texto: R`Si toda una familia es compuesta, suele haber un mismo divisor para todos. Encuéntralo con ejemplos.` },
          ],
        },
      }],
    },
    {
      id: 'cp4-7', numero: 7, nombre: 'Un número de 10 cifras con todos los dígitos es compuesto',
      enunciado: R`Si $n$ es un entero positivo, de $10$ cifras, tal que tiene todos los dígitos decimales entonces $n$ es compuesto.`,
      partes: [{
        id: 'x',
        pistas: [
          { tipo: 'concepto', texto: R`Se aplican las <b>propiedades 4, 6 y 7</b>: $n = \sum d_i 10^i$ se reduce cifra a cifra módulo $m$.`, enlaces: [SUMA, PRODUCTO, POTENCIA] },
          { tipo: 'estrategia', texto: R`Como en el ejercicio anterior: busca un divisor fijo que divida a todos estos números.` },
          { tipo: 'arranque', texto: R`Las $10$ cifras son $0, 1, \dots, 9$, cada una una vez, en cualquier orden. ¿Qué cantidad no depende del orden?` },
          { tipo: 'desbloqueo', texto: R`La suma de las cifras es $45$. ¿Qué número es congruente con la suma de sus cifras? ($10 \equiv\ ?$ módulo $9$).` },
        ],
        solucion: {
          pasos: [
            { texto: R`Sea $n = \sum_{i=0}^{9} d_i 10^i$, donde $d_0, \dots, d_9$ son los dígitos $0, 1, \dots, 9$ en algún orden.` },
            { texto: R`$10 \equiv 1 \pmod 9$, así que $10^i \equiv 1$ y $n \equiv d_0 + d_1 + \dots + d_9 = 0 + 1 + \dots + 9 = 45 \equiv 0 \pmod 9$.` },
            { texto: R`Así $9 \mid n$. Como $n$ tiene $10$ cifras, $n \ge 10^9 \gt 9$, y $9$ es un divisor con $1 \lt 9 \lt n$: $n$ es compuesto.` },
          ],
        },
        aprendes: {
          resultado: R`Todo número de $10$ cifras que usa los diez dígitos es múltiplo de $9$, y por tanto compuesto.`,
          ideas: [
            { idea: 'Busca un invariante que no dependa del orden', texto: R`Cuando un objeto se define «en cualquier orden», calcula algo que no cambie al permutar (la suma de cifras). Ese invariante suele bastar.` },
            { idea: 'Módulo $9$ y suma de cifras', texto: R`$n \equiv$ suma de sus cifras $\pmod 9$. Atajo para cualquier pregunta sobre divisibilidad por $3$ o por $9$.` },
          ],
        },
      }],
    },
    {
      id: 'cp4-8', numero: 8, nombre: 'Los números de Fermat son primos relativos dos a dos',
      enunciado: R`Se le llama «número de Fermat» a aquellos que pueden ser escritos de la forma $2^{2^n} + 1$, $n \ge 0$. Demuestre que los números de Fermat son coprimos dos a dos.<br>a) Utilizando este resultado, demuestre que existen infinitos números primos.`,
      partes: [
        {
          id: 'x', enunciado: R`Los números de Fermat $F_n = 2^{2^n} + 1$ son primos relativos dos a dos.`,
          pistas: [
            { tipo: 'concepto', texto: R`Se aplican la definición de <b>primos relativos</b> (Libro II), el <b>Principio de Inducción Matemática</b> y <b>$a \equiv b\ (n) \iff n \mid a - b$</b>.`, enlaces: [{ l: 2, e: 'def-primos-relativos' }, { l: 1, e: 'pim' }, DIVIDE] },
            { tipo: 'estrategia', texto: R`Busca una relación entre $F_n$ y el producto de todos los anteriores. Si $F_n$ es «producto de los anteriores más algo pequeño», un divisor común tiene que dividir a ese algo.` },
            { tipo: 'arranque', texto: R`Calcula $F_0 = 3$, $F_1 = 5$, $F_2 = 17$, $F_3 = 257$. Compara $F_0 F_1$ con $F_2$, y $F_0 F_1 F_2$ con $F_3$.` },
            { tipo: 'arranque', texto: R`Conjetura: $F_0 F_1 \cdots F_{n-1} = F_n - 2$. Pruébala por inducción con $(x - 1)(x + 1) = x^2 - 1$ y $x = 2^{2^n}$.` },
            { tipo: 'desbloqueo', texto: R`Si $d$ divide a $F_m$ y a $F_n$ con $m \lt n$, entonces $d$ divide a $F_n - F_0 \cdots F_{n-1}$. ¿A qué número? ¿Y qué paridad tienen los $F_k$?` },
          ],
          solucion: {
            pasos: [
              { texto: R`<b>Afirmación:</b> $F_0 F_1 \cdots F_{n-1} = F_n - 2$ para $n \ge 1$. Base: $F_0 = 3 = 5 - 2 = F_1 - 2$.` },
              { texto: R`Paso: si $F_0 \cdots F_{n-1} = F_n - 2 = 2^{2^n} - 1$, entonces $F_0 \cdots F_n = (2^{2^n} - 1)(2^{2^n} + 1) = 2^{2^{n+1}} - 1 = F_{n+1} - 2$.` },
              { texto: R`Sean $m \lt n$ y $d \gt 0$ un divisor común de $F_m$ y $F_n$. Como $F_m$ es uno de los factores de $F_0 \cdots F_{n-1}$, $d$ divide a ese producto, y por tanto a $F_n - F_0 \cdots F_{n-1} = 2$.` },
              { texto: R`Los $F_k$ son impares ($2^{2^k}$ es par), así que $d \neq 2$: $d = 1$. Luego $(F_m, F_n) = 1$.` },
            ],
          },
          aprendes: {
            resultado: R`$F_0 F_1 \cdots F_{n-1} = F_n - 2$, y por eso los números de Fermat son primos relativos dos a dos.`,
            ideas: [
              { idea: 'Calcular, conjeturar, demostrar', texto: R`Con cuatro valores se ve el patrón $F_0 \cdots F_{n-1} = F_n - 2$; luego la inducción lo confirma. No intentes demostrar sin haber visto la fórmula.` },
              { idea: 'Producto de los anteriores + constante', texto: R`Si $X = (\text{producto de los anteriores}) + c$, todo divisor común de $X$ con un anterior divide a $c$. Es el mismo truco que en la infinitud de primos ($c = 1$).` },
              { idea: 'Diferencia de cuadrados en cadena', texto: R`$(x - 1)(x + 1) = x^2 - 1$ hace que el producto telescopie con exponentes $2^n$.` },
            ],
          },
        },
        {
          id: 'a', etiqueta: 'a)', enunciado: R`Utilizando este resultado, demuestre que existen infinitos números primos.`,
          pistas: [
            { tipo: 'concepto', texto: R`Se aplica <b>todo entero mayor que $1$ tiene un divisor primo</b> (Libro I), igual que en la demostración de la infinitud de los primos.`, enlaces: [{ l: 1, e: 'lema-divisor-primo' }, { l: 1, e: 'teo-infinitos-primos' }] },
            { tipo: 'estrategia', texto: R`Una sucesión infinita de números mayores que $1$, primos relativos dos a dos, fabrica primos distintos.` },
            { tipo: 'arranque', texto: R`Elige un divisor primo $q_n$ de cada $F_n$. ¿Pueden coincidir $q_m$ y $q_n$ con $m \neq n$?` },
          ],
          solucion: {
            pasos: [
              { texto: R`Cada $F_n \gt 1$ tiene un divisor primo; sea $q_n$ uno de ellos.` },
              { texto: R`Si $q_m = q_n$ con $m \neq n$, ese primo dividiría a $F_m$ y a $F_n$, que son primos relativos. Imposible.` },
              { texto: R`Así $q_0, q_1, q_2, \dots$ son primos distintos, uno por cada $n \ge 0$: hay infinitos primos.` },
            ],
          },
          aprendes: {
            resultado: R`Hay infinitos primos: cada número de Fermat aporta un primo distinto.`,
            ideas: [
              { idea: 'Coprimos dos a dos ⇒ primos distintos', texto: R`Una familia infinita de números $\gt 1$ primos relativos dos a dos da infinitos primos distintos, eligiendo un divisor primo de cada uno. Es una plantilla para demostrar infinitud.` },
              { idea: 'Reutilizar el resultado previo', texto: R`El apartado a) es corto porque usa el principal. Antes de empezar un apartado, pregúntate cómo lo simplifica lo ya demostrado.` },
            ],
          },
        },
      ],
    },
    {
      id: 'cp4-9', numero: 9, nombre: R`$(a^n - 1, a^m - 1) = a^{(n,m)} - 1$`,
      enunciado: R`Sean $n, m, a$ enteros positivos con $n \gt 1$. Demuestre que $(a^n - 1, a^m - 1) = a^{(n,m)} - 1$.`,
      nota: R`Hace falta $a \gt 1$: con $a = 1$ los dos números son $0$ y su mcd no está definido.`,
      partes: [{
        id: 'x',
        pistas: [
          { tipo: 'concepto', texto: R`Se aplican el corolario <b>$\mcd(a, b) = \mcd(b, r)$</b> y el <b>Algoritmo de Euclides</b> (Libro II), junto con la <b>propiedad 7</b> de la congruencia (potencias).`, enlaces: [{ l: 2, e: 'cor-mcd-resto' }, { l: 2, e: 'teo-euclides' }, POTENCIA] },
          { tipo: 'estrategia', texto: R`El resultado tiene exponente $(n, m)$: imita el algoritmo de Euclides en los exponentes. Cada paso de Euclides sobre $(n, m)$ debería corresponder a un paso sobre $(a^n - 1, a^m - 1)$.` },
          { tipo: 'arranque', texto: R`Si $n = qm + r$, compara $a^n - 1$ con $a^r - 1$ módulo $a^m - 1$. Pista: $a^m \equiv 1 \pmod{a^m - 1}$.` },
          { tipo: 'desbloqueo', texto: R`Concluye $(a^n - 1, a^m - 1) = (a^m - 1, a^r - 1)$. Repite como en Euclides: ¿dónde termina la cadena de exponentes?` },
        ],
        solucion: {
          pasos: [
            { texto: R`<b>Paso clave.</b> Sea $n = qm + r$ con $0 \le r \lt m$. Como $a^m \equiv 1 \pmod{a^m - 1}$, por la propiedad 7 $a^{qm} \equiv 1$, y $a^n = a^{qm} a^r \equiv a^r$. Luego $a^m - 1 \mid (a^n - 1) - (a^r - 1)$.` },
            { texto: R`Escribiendo $a^n - 1 = Q(a^m - 1) + (a^r - 1)$, los divisores comunes de $a^n - 1$ y $a^m - 1$ son los de $a^m - 1$ y $a^r - 1$ (mismo argumento que $\mcd(a, b) = \mcd(b, r)$): $(a^n - 1, a^m - 1) = (a^m - 1, a^r - 1)$.` },
            { texto: R`Aplicamos el algoritmo de Euclides a $(n, m)$: $n = q_1 m + r_1$, $m = q_2 r_1 + r_2$, …, hasta un resto $0$; el último resto no nulo es $d = (n, m)$.` },
            { texto: R`Por el paso clave, en cada etapa el mcd no cambia: $(a^n - 1, a^m - 1) = (a^m - 1, a^{r_1} - 1) = \dots = (a^d - 1, a^0 - 1) = (a^d - 1, 0)$.` },
            { texto: R`Como $a \gt 1$, $a^d - 1 \gt 0$ y $(a^d - 1, 0) = a^d - 1$. Luego $(a^n - 1, a^m - 1) = a^{(n,m)} - 1$.` },
          ],
        },
        aprendes: {
          resultado: R`$(a^n - 1, a^m - 1) = a^{(n,m)} - 1$ para $a \gt 1$.`,
          ideas: [
            { idea: 'Euclides en los exponentes', texto: R`Si una operación «respeta» la división con resto (aquí, $a^n - 1 \equiv a^r - 1$), el algoritmo de Euclides se traslada y el mcd del resultado es la imagen del mcd. Sirve también para mcd de números de Fibonacci.` },
            { idea: '$x \equiv 1 \pmod{x - 1}$', texto: R`Todo número es $\equiv 1$ módulo él mismo menos uno. Con potencias, esto convierte $a^{qm + r}$ en $a^r$.` },
            { idea: 'Hipótesis olvidadas', texto: R`El enunciado olvida $a \gt 1$. Prueba los casos extremos ($a = 1$) para descubrir hipótesis que faltan.` },
          ],
        },
      }],
    },
  ],
};
