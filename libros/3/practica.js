// Clase práctica 3 (25 de septiembre de 2025) — acompaña a la Conferencia 3 (primos y Teorema Fundamental).
// Enunciados transcritos del PDF renderizado; lo corregido lleva su marca.
const R = String.raw;
const L1 = (e) => ({ l: 1, e }), L3 = (e) => ({ l: 3, e });
const PRIMO = L1('def-primo'), COMPUESTO = L1('cor-compuesto'), DIVISOR_PRIMO = L1('lema-divisor-primo'), INFINITOS = L1('teo-infinitos-primos');
const PIM = L1('pim'), DIV = L1('teo-division'), TFA = L3('teo-fundamental'), CANONICA = L3('def-canonica'), PRIMO_PRODUCTO = L3('teo-primo-producto');

export default {
  numero: 3, fecha: '25 de septiembre de 2025',
  ejercicios: [
    {
      id: 'cp3-1', numero: 1, nombre: R`Primos de la forma $a^n - 1$ y $a^n + 1$`,
      enunciado: R`Sean $a$ y $n$ enteros mayores que $1$.<ul><li>Si $a^n - 1$ es primo $\Rightarrow a = 2$ y $n$ es primo.</li><li>Si $a^n + 1$ es primo $\Rightarrow a$ es par y $n$ es una potencia de $2$.</li></ul>`,
      marcaEnunciado: 'corregido',
      nota: R`En el PDF dice «pimo»: es «primo».`,
      partes: [
        {
          id: 'menos', etiqueta: '1.ª', enunciado: R`Si $a^n - 1$ es primo, entonces $a = 2$ y $n$ es primo.`,
          pistas: [
            { tipo: 'concepto', texto: R`Se aplica la caracterización de los <b>números compuestos</b>: $m$ es compuesto si y solo si $m = rs$ con $1 \lt r \le s \lt m$. Un primo no admite una factorización así.`, enlaces: [COMPUESTO, PRIMO] },
            { tipo: 'estrategia', texto: R`Las dos conclusiones se prueban igual: si fallaran, $a^n - 1$ tendría un divisor estrictamente entre $1$ y él mismo. Busca factorizaciones de $a^n - 1$.` },
            { tipo: 'arranque', texto: R`Experimenta: $3^2 - 1$, $3^3 - 1$, $5^2 - 1$, $10^3 - 1$. ¿Qué número relacionado con $a$ divide siempre a $a^n - 1$?` },
            { tipo: 'arranque', texto: R`Ese divisor es $a - 1$. Encuentra el otro factor: divide $x^n - 1$ entre $x - 1$ (o multiplica $(x - 1)(x^{n-1} + \dots + x + 1)$ y mira qué se cancela).` },
            { tipo: 'desbloqueo', texto: R`Con $a = 2$ ya probado, supón $n = rs$ con $1 \lt r, s \lt n$. Escribe $2^n - 1 = (2^r)^s - 1$ y usa la misma identidad con $x = 2^r$.` },
          ],
          solucion: {
            pasos: [
              { texto: R`<b>Identidad.</b> Para $m \ge 1$: $x^m - 1 = (x - 1)(x^{m-1} + x^{m-2} + \dots + x + 1)$. Al multiplicar, cada término $x^j$ aparece una vez con $+$ y otra con $-$, salvo $x^m$ y $-1$.` },
              { texto: R`Con $x = a$, $m = n$: $(a - 1) \mid a^n - 1$. Como $a^n - 1$ es primo, sus divisores positivos son $1$ y $a^n - 1$.` },
              { texto: R`$a - 1 = a^n - 1$ significaría $a^n = a$, imposible con $a \gt 1$, $n \gt 1$. Luego $a - 1 = 1$: $a = 2$.` },
              { texto: R`Si $n$ fuera compuesto, $n = rs$ con $1 \lt r, s \lt n$. Con $x = 2^r$, $m = s$: $2^n - 1 = (2^r)^s - 1 = (2^r - 1)(2^{r(s-1)} + \dots + 2^r + 1)$.` },
              { texto: R`Como $2 \le r \lt n$: $1 \lt 3 \le 2^r - 1 \lt 2^n - 1$. Así $2^n - 1$ tiene un divisor estrictamente entre $1$ y él mismo: es compuesto, contradicción. Luego $n$ es primo.` },
            ],
          },
          aprendes: {
            resultado: R`Si $a^n - 1$ es primo, entonces $a = 2$ y $n$ es primo (los primos de Mersenne). El recíproco es falso: $2^{11} - 1 = 2047 = 23 \cdot 89$.`,
            ideas: [
              { idea: 'La factorización $x^m - 1 = (x - 1)(x^{m-1} + \dots + 1)$', texto: R`Es LA descomposición de las potencias menos uno. Cada vez que veas $a^n - 1$ (o $a^n - b^n$), piensa en ella: hace visible el factor $a - 1$ y, si $n = rs$, el factor $a^r - 1$.` },
              { idea: 'Para probar «no es primo», exhibe un divisor intermedio', texto: R`Un primo solo tiene los divisores $1$ y él mismo. Basta un divisor $d$ con $1 \lt d \lt m$; comprobar las dos desigualdades es parte de la prueba.` },
              { idea: 'Experimentar para encontrar la factorización', texto: R`Si no ves la descomposición, calcula unos casos y mira qué número divide a todos. El patrón te dice qué factor buscar.` },
            ],
          },
        },
        {
          id: 'mas', etiqueta: '2.ª', enunciado: R`Si $a^n + 1$ es primo, entonces $a$ es par y $n$ es una potencia de $2$.`,
          pistas: [
            { tipo: 'concepto', texto: R`Otra vez la caracterización de <b>compuesto</b> ($m = rs$ con $1 \lt r \le s \lt m$), y la <b>descomposición canónica</b> de $n$ para separar su parte par y su parte impar.`, enlaces: [COMPUESTO, CANONICA] },
            { tipo: 'estrategia', texto: R`Igual que antes: si alguna conclusión fallara, encuentra un divisor de $a^n + 1$ entre $1$ y él mismo.` },
            { tipo: 'arranque', texto: R`Primero la paridad: si $a$ es impar, ¿cómo es $a^n + 1$? ¿Puede ser primo, sabiendo que es mayor que $2$?` },
            { tipo: 'arranque', texto: R`«$n$ es potencia de $2$» equivale a «$n$ no tiene divisores impares mayores que $1$». Escribe $n = 2^e m$ con $m$ impar y supón $m \ge 3$.` },
            { tipo: 'desbloqueo', texto: R`Para $m$ impar hay una identidad con signos alternos: $x^m + 1 = (x + 1)(x^{m-1} - x^{m-2} + \dots - x + 1)$. Sale de la anterior cambiando $x$ por $-x$. Úsala con $x = a^{2^e}$.` },
          ],
          solucion: {
            pasos: [
              { texto: R`$a^n + 1 \ge 2^2 + 1 = 5$. Si $a$ fuera impar, $a^n$ sería impar y $a^n + 1$ par y mayor que $2$: compuesto. Luego $a$ es par.` },
              { texto: R`Escribimos $n = 2^e m$ con $m$ impar (sacando todos los factores $2$ de $n$). Supongamos $m \ge 3$.` },
              { texto: R`<b>Identidad para $m$ impar.</b> Con $y = -x$ en $y^m - 1 = (y - 1)(y^{m-1} + \dots + 1)$: $-x^m - 1 = (-x - 1)(x^{m-1} - x^{m-2} + \dots - x + 1)$, y cambiando de signo, $x^m + 1 = (x + 1)(x^{m-1} - x^{m-2} + \dots - x + 1)$.` },
              { texto: R`Con $x = a^{2^e}$: $a^n + 1 = (a^{2^e})^m + 1 = (a^{2^e} + 1) \cdot (\dots)$, así que $a^{2^e} + 1 \mid a^n + 1$.` },
              { texto: R`Como $m \ge 3$, $2^e \lt n$, y entonces $1 \lt a^{2^e} + 1 \lt a^n + 1$: $a^n + 1$ sería compuesto. Contradicción; luego $m = 1$ y $n = 2^e$.` },
            ],
          },
          aprendes: {
            resultado: R`Si $a^n + 1$ es primo, $a$ es par y $n$ es potencia de $2$ (de ahí los números de Fermat $2^{2^k} + 1$). El recíproco es falso: $2^{32} + 1 = 641 \cdot 6700417$.`,
            ideas: [
              { idea: 'Separar la parte par y la impar: $n = 2^e m$', texto: R`Muchas afirmaciones sobre «potencia de $2$» se atacan suponiendo un factor impar $m \ge 3$ y llegando a contradicción.` },
              { idea: 'Las sumas $x^m + 1$ con $m$ impar factorizan', texto: R`$x + 1$ divide a $x^m + 1$ cuando $m$ es impar. Se obtiene de la identidad de $x^m - 1$ cambiando $x$ por $-x$; cambiar de signo una variable da identidades nuevas gratis.` },
              { idea: 'La paridad descarta rápido', texto: R`Antes de factorizar, mira la paridad: un número par mayor que $2$ no es primo.` },
            ],
          },
        },
      ],
    },
    {
      id: 'cp3-2', numero: 2, nombre: R`Para $n \gt 4$: $n \mid (n-1)!$ si y solo si $n$ es compuesto`,
      enunciado: R`Sea $n \in \Z$, $n \gt 4$. Demuestra que $n \mid (n - 1)!$ si y solo si $n$ es compuesto.`,
      partes: [{
        id: 'x',
        pistas: [
          { tipo: 'concepto', texto: R`Se aplican <b>$n$ es compuesto si y solo si $n = ab$ con $1 \lt a \le b \lt n$</b> (Libro I) y <b>si un primo divide a un producto, divide a alguno de los factores</b> (Libro III).`, enlaces: [COMPUESTO, PRIMO_PRODUCTO] },
          { tipo: 'estrategia', texto: R`Son dos implicaciones. «Compuesto ⇒ divide»: encuentra los factores de $n$ dentro del producto $1 \cdot 2 \cdots (n - 1)$. «Primo ⇒ no divide»: usa lo que hace un primo con un producto.` },
          { tipo: 'arranque', texto: R`Escribe $n = ab$ con $1 \lt a \le b \lt n$. ¿Aparecen $a$ y $b$ entre $1, 2, \dots, n - 1$? ¿Son factores distintos del producto?` },
          { tipo: 'desbloqueo', texto: R`El caso delicado es $a = b$, es decir $n = a^2$: no puedes usar el mismo factor dos veces. Busca otro múltiplo de $a$ menor que $n$. ¿Dónde se usa $n \gt 4$? (mira $n = 4$: $3! = 6$).` },
          { tipo: 'desbloqueo', texto: R`Si $n = p$ es primo y $p \mid 1 \cdot 2 \cdots (p - 1)$, entonces $p$ divide a algún factor $k$ con $1 \le k \le p - 1$. ¿Es posible?` },
        ],
        solucion: {
          pasos: [
            { texto: R`<b>Primo ⇒ no divide.</b> Si $n = p$ es primo y $p \mid 1 \cdot 2 \cdots (p - 1)$, por el teorema $p \mid k$ para algún $1 \le k \le p - 1$; pero $0 \lt k \lt p$ no es múltiplo de $p$. Luego $p \nmid (p - 1)!$.` },
            { texto: R`<b>Compuesto ⇒ divide.</b> Sea $n = ab$ con $1 \lt a \le b \lt n$.` },
            { texto: R`Caso $a \lt b$: $a$ y $b$ son dos factores distintos de $1 \cdot 2 \cdots (n - 1)$, luego $(n-1)! = a \cdot b \cdot (\text{los demás}) = n \cdot (\dots)$: $n \mid (n - 1)!$.` },
            { texto: R`Caso $a = b$, es decir $n = a^2$: como $n \gt 4$, $a \ge 3$, y entonces $2a \lt a^2 = n$ (porque $a \gt 2$). Así $a$ y $2a$ son factores distintos de $(n-1)!$, y $a \cdot 2a = 2n$ divide a $(n - 1)!$; en particular $n \mid (n - 1)!$.` },
            { texto: R`Para $n = 4$ falla: $a = 2$ y $2a = 4$ ya no es menor que $n$; de hecho $4 \nmid 3! = 6$. Por eso el enunciado pide $n \gt 4$.` },
          ],
        },
        aprendes: {
          resultado: R`Para $n \gt 4$: $n \mid (n - 1)!$ si y solo si $n$ es compuesto (con $n = 4$ falla).`,
          ideas: [
            { idea: 'Localizar los factores dentro de un factorial', texto: R`Para ver que $n \mid (n - 1)!$, encuentra factores del producto cuyo producto sea múltiplo de $n$. Cuidado: cada factor se usa una sola vez.` },
            { idea: 'Los casos frontera explican las hipótesis', texto: R`Si el enunciado pide $n \gt 4$, busca dónde falla para $n = 4$: te señala el caso delicado ($n = a^2$ con $a$ pequeño).` },
            { idea: 'Primo que divide a un producto', texto: R`$p \mid x_1 \cdots x_k \Rightarrow p \mid x_j$ para algún $j$. Si todos los factores son menores que $p$ y positivos, es imposible. Este argumento es la base de Wilson y de Fermat.` },
          ],
        },
      }],
    },
    {
      id: 'cp3-3', numero: 3, nombre: R`La descomposición canónica de $20!$`,
      enunciado: R`Encuentre la descomposición canónica de $20!$.`,
      partes: [{
        id: 'x',
        pistas: [
          { tipo: 'concepto', texto: R`Se aplican el <b>Teorema Fundamental de la Aritmética</b>, la <b>descomposición canónica</b> y <b>si un primo divide a un producto, divide a algún factor</b>.`, enlaces: [TFA, CANONICA, PRIMO_PRODUCTO] },
          { tipo: 'estrategia', texto: R`Dos preguntas: qué primos aparecen y con qué exponente. El exponente de un primo en un producto es la suma de sus exponentes en cada factor.` },
          { tipo: 'arranque', texto: R`¿Puede un primo mayor que $20$ dividir a $20! = 1 \cdot 2 \cdots 20$?` },
          { tipo: 'arranque', texto: R`Exponente de $2$: cada número par de $1, \dots, 20$ aporta al menos un $2$. ¿Cuántos hay? Los múltiplos de $4$ aportan uno más; ¿y los de $8$ y $16$?` },
          { tipo: 'desbloqueo', texto: R`En general, el exponente de $p$ es (múltiplos de $p$) + (múltiplos de $p^2$) + (múltiplos de $p^3$) + ⋯ entre $1$ y $20$. Hazlo para $3, 5, 7, 11, 13, 17, 19$.` },
        ],
        solucion: {
          pasos: [
            { texto: R`Si un primo $p$ divide a $20! = 1 \cdot 2 \cdots 20$, divide a algún factor $k \le 20$, así que $p \le 20$. Los primos posibles son $2, 3, 5, 7, 11, 13, 17, 19$.` },
            { texto: R`El exponente de $p$ en $20!$ es la suma de los exponentes de $p$ en cada $k$. Cada $k$ con $p^j \mid k$ aporta $1$ por cada $j$, así que el exponente es (número de múltiplos de $p$) + (de $p^2$) + ⋯ hasta $20$.` },
            { texto: R`$p = 2$: múltiplos de $2$: $10$; de $4$: $5$; de $8$: $2$; de $16$: $1$. Total $18$.` },
            { texto: R`$p = 3$: múltiplos de $3$: $6$; de $9$: $2$. Total $8$. $p = 5$: $4$ (y $25 \gt 20$). $p = 7$: $2$.` },
            { texto: R`$p = 11, 13, 17, 19$: un múltiplo cada uno, exponente $1$.` },
            { texto: R`$20! = 2^{18} \cdot 3^{8} \cdot 5^{4} \cdot 7^{2} \cdot 11 \cdot 13 \cdot 17 \cdot 19$.` },
          ],
        },
        aprendes: {
          resultado: R`$20! = 2^{18} \cdot 3^{8} \cdot 5^{4} \cdot 7^{2} \cdot 11 \cdot 13 \cdot 17 \cdot 19$.`,
          ideas: [
            { idea: 'Exponente de un primo en $n!$ (fórmula de Legendre)', texto: R`$\lfloor n \div p \rfloor + \lfloor n \div p^2 \rfloor + \lfloor n \div p^3 \rfloor + \cdots$. Cuenta cada factor $p$ «por capas». Sirve para saber en cuántos ceros termina $n!$ (exponente de $5$), o si $p^k \mid n!$.` },
            { idea: 'Contar por capas en lugar de factor a factor', texto: R`En vez de descomponer $20$ números, cuenta cuántos tienen al menos un $p$, cuántos al menos dos… La suma es la misma.` },
            { idea: 'Primos posibles: solo los que aparecen como factores', texto: R`En un producto de números $\le n$, todo primo divisor es $\le n$. Delimita primero qué primos pueden aparecer.` },
          ],
        },
      }],
    },
    {
      id: 'cp3-4', numero: 4, nombre: R`Un bloque de $2022$ consecutivos con exactamente $15$ primos`,
      enunciado: R`Demuestra que existe un bloque de $2022$ enteros consecutivos donde exactamente $15$ de ellos son primos.`,
      partes: [{
        id: 'x',
        pistas: [
          { tipo: 'concepto', texto: R`Se aplica el lema <b>hay $n$ compuestos consecutivos</b>: $(n+1)! + 2, \dots, (n+1)! + (n+1)$.`, enlaces: [L3('lema-compuestos')] },
          { tipo: 'estrategia', texto: R`No busques el bloque directamente. Piensa en un bloque de $2022$ que se desliza por la recta, un lugar cada vez, y en cuántos primos contiene en cada posición.` },
          { tipo: 'arranque', texto: R`Al pasar del bloque $\{k, \dots, k + 2021\}$ al $\{k + 1, \dots, k + 2022\}$, sale un número y entra otro. ¿En cuánto puede cambiar la cantidad de primos?` },
          { tipo: 'arranque', texto: R`Busca dos posiciones extremas: un bloque con al menos $15$ primos y otro sin ninguno.` },
          { tipo: 'desbloqueo', texto: R`El bloque $\{1, \dots, 2022\}$ contiene los $15$ primeros primos ($2, 3, \dots, 47$). Un bloque sin primos: el lema con $n = 2022$.` },
          { tipo: 'desbloqueo', texto: R`Si la cantidad empieza en $15$ o más, termina en $0$ y cambia de a lo sumo $1$ en $1$, tiene que pasar por $15$. Formalízalo con el último bloque que tiene al menos $15$.` },
        ],
        solucion: {
          pasos: [
            { texto: R`Para $k \ge 1$ sea $f(k)$ la cantidad de primos en $\{k, k + 1, \dots, k + 2021\}$.` },
            { texto: R`$f(k + 1) - f(k) \in \{-1, 0, 1\}$: los dos bloques comparten $k + 1, \dots, k + 2021$; solo sale $k$ y entra $k + 2022$.` },
            { texto: R`$f(1) \ge 15$: los $15$ primeros primos $2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47$ están en $\{1, \dots, 2022\}$.` },
            { texto: R`Por el lema, con $N = 2023! + 2$, los números $2023! + 2, \dots, 2023! + 2023$ son compuestos ($j \mid 2023! + j$ y $2023! + j \gt j$ para $2 \le j \le 2023$). Son $2022$ consecutivos: $f(N) = 0$.` },
            { texto: R`Sea $m$ el mayor $k \le N$ con $f(k) \ge 15$ (existe porque $f(1) \ge 15$, y $m \lt N$ porque $f(N) = 0$). Entonces $f(m + 1) \le 14$, y como $f$ cambia a lo sumo en $1$, $f(m) \le 15$. Luego $f(m) = 15$.` },
            { texto: R`El bloque $\{m, \dots, m + 2021\}$ tiene exactamente $15$ primos.` },
          ],
        },
        aprendes: {
          resultado: R`Existe un bloque de $2022$ enteros consecutivos con exactamente $15$ primos (y el mismo argumento da cualquier cantidad entre $0$ y $306$, los primos hasta $2022$).`,
          ideas: [
            { idea: 'Continuidad discreta', texto: R`Una función de los enteros que cambia de a lo sumo $1$ en cada paso toma todos los valores intermedios. Para probar que «existe un caso con exactamente $m$», muestra uno con $\ge m$, otro con $\le m$, y que el paso es pequeño.` },
            { idea: 'Ventana deslizante', texto: R`Comparar un bloque con el siguiente (sale uno, entra otro) es la forma de controlar cómo cambia una cantidad que depende de un bloque.` },
            { idea: 'Existencia sin construir', texto: R`No se sabe dónde está el bloque, pero se demuestra que existe. Una prueba de existencia puede ser un argumento de «tiene que pasar por ahí».` },
          ],
        },
      }],
    },
    {
      id: 'cp3-5', numero: 5, nombre: R`$2^{2^n} - 1$ tiene al menos $n$ divisores primos distintos`,
      enunciado: R`Demuestre que si $n \in \Z^+$ entonces $2^{2^n} - 1$ tiene al menos $n$ divisores primos distintos.`,
      partes: [{
        id: 'x',
        pistas: [
          { tipo: 'concepto', texto: R`Se aplican el <b>Principio de Inducción Matemática</b>, <b>todo entero mayor que $1$ tiene un divisor primo</b> y la noción de <b>primos relativos</b> (Libro II).`, enlaces: [PIM, DIVISOR_PRIMO, { l: 2, e: 'def-primos-relativos' }] },
          { tipo: 'estrategia', texto: R`Inducción en $n$: relaciona $2^{2^{n+1}} - 1$ con $2^{2^n} - 1$ y busca un primo nuevo.` },
          { tipo: 'arranque', texto: R`$2^{2^{n+1}} = \left(2^{2^n}\right)^2$. ¿Qué factorización conoces para un cuadrado menos $1$?` },
          { tipo: 'arranque', texto: R`Te queda $(2^{2^n} - 1)(2^{2^n} + 1)$. El primer factor ya tiene $n$ primos distintos. Necesitas un primo del segundo que no esté entre ellos.` },
          { tipo: 'desbloqueo', texto: R`Los dos factores son impares y difieren en $2$. ¿Qué divisores comunes pueden tener? Si son primos relativos, ningún primo del segundo divide al primero.` },
        ],
        solucion: {
          pasos: [
            { texto: R`Base $n = 1$: $2^{2} - 1 = 3$, que tiene un divisor primo.` },
            { texto: R`Paso: supongamos que $A = 2^{2^n} - 1$ tiene al menos $n$ divisores primos distintos. Como $2^{2^{n+1}} = (2^{2^n})^2$: $2^{2^{n+1}} - 1 = (2^{2^n} - 1)(2^{2^n} + 1) = A \cdot B$ con $B = 2^{2^n} + 1$.` },
            { texto: R`$(A, B) = 1$: un divisor común divide a $B - A = 2$; y $A$ es impar, así que el divisor común es $1$.` },
            { texto: R`$B \gt 1$ tiene un divisor primo $q$. Si $q$ dividiera a $A$, sería divisor común de $A$ y $B$, imposible. Luego $q$ es distinto de los primos de $A$.` },
            { texto: R`Los primos de $A$ y $q$ dividen a $AB$: son al menos $n + 1$ primos distintos. Por el PIM, vale para todo $n \in \Z^+$.` },
          ],
        },
        aprendes: {
          resultado: R`$2^{2^n} - 1$ tiene al menos $n$ divisores primos distintos.`,
          ideas: [
            { idea: 'Diferencia de cuadrados repetida', texto: R`$x^2 - 1 = (x - 1)(x + 1)$ aplicado una y otra vez descompone $2^{2^n} - 1 = (2 - 1)(2 + 1)(2^2 + 1)(2^4 + 1)\cdots$. Las potencias de exponente $2^n$ se parten así.` },
            { idea: 'Primo nuevo = factor nuevo coprimo con lo anterior', texto: R`Para que la cuenta de primos crezca, basta un factor nuevo $> 1$ que sea primo relativo con lo que ya tenías: cualquiera de sus primos es nuevo.` },
            { idea: 'Dos números que difieren en $2$', texto: R`Su mcd divide a $2$. Si además son impares, son primos relativos. Es un atajo muy frecuente.` },
          ],
        },
      }],
    },
    {
      id: 'cp3-6', numero: 6, nombre: R`Si $p$ y $p^2 + 2$ son primos, $p^3 + 2$ es primo`,
      enunciado: R`Demuestre que si $p$ y $p^2 + 2$ son primos entonces $p^3 + 2$ es primo.`,
      partes: [{
        id: 'x',
        pistas: [
          { tipo: 'concepto', texto: R`Se aplica el <b>Algoritmo de la División</b> por un número pequeño, como en el lema <b>todo primo mayor que $3$ es $6q \pm 1$</b>: separar casos según el resto.`, enlaces: [DIV, L3('lema-6q')] },
          { tipo: 'estrategia', texto: R`La hipótesis «$p^2 + 2$ es primo» es muy restrictiva. Antes de pensar en $p^3 + 2$, descubre para qué primos $p$ puede cumplirse.` },
          { tipo: 'arranque', texto: R`Prueba $p = 2, 3, 5, 7, 11$. Cuando $p^2 + 2$ no es primo, ¿qué número lo divide siempre?` },
          { tipo: 'arranque', texto: R`Divide $p$ entre $3$: $p = 3q + r$. Calcula $p^2 + 2$ según sea $r = 1$ o $r = 2$.` },
          { tipo: 'desbloqueo', texto: R`Si $3 \nmid p$, entonces $3 \mid p^2 + 2$ y $p^2 + 2 \gt 3$. ¿Qué único primo queda? Compruébalo.` },
        ],
        solucion: {
          pasos: [
            { texto: R`Si $p = 3$: $p^2 + 2 = 11$ y $p^3 + 2 = 29$, ambos primos.` },
            { texto: R`Si $p \neq 3$, como $p$ es primo, $3 \nmid p$. Por el Algoritmo de la División, $p = 3q + 1$ o $p = 3q + 2$.` },
            { texto: R`Si $p = 3q + 1$: $p^2 + 2 = 9q^2 + 6q + 3 = 3(3q^2 + 2q + 1)$. Si $p = 3q + 2$: $p^2 + 2 = 9q^2 + 12q + 6 = 3(3q^2 + 4q + 2)$. En ambos casos $3 \mid p^2 + 2$.` },
            { texto: R`Como $p \ge 2$, $p^2 + 2 \ge 6 \gt 3$: tiene el divisor $3$ con $1 \lt 3 \lt p^2 + 2$, así que es compuesto, contra la hipótesis.` },
            { texto: R`Luego la hipótesis solo se cumple con $p = 3$, y entonces $p^3 + 2 = 29$ es primo.` },
          ],
        },
        aprendes: {
          resultado: R`El único primo $p$ con $p^2 + 2$ primo es $p = 3$, y entonces $p^3 + 2 = 29$ es primo.`,
          ideas: [
            { idea: 'Hipótesis demasiado fuertes: averigua qué casos las cumplen', texto: R`Si la hipótesis parece rara, quizá solo la cumplen uno o dos objetos. Encuéntralos y comprueba la conclusión a mano.` },
            { idea: 'Restos módulo un primo pequeño', texto: R`Dividir por $2$, $3$ o $5$ y estudiar cada resto descarta casi todos los casos. El divisor adecuado suele ser el que aparece en los ejemplos.` },
            { idea: 'Calcular ejemplos antes de demostrar', texto: R`Con $p = 5, 7, 11$, $p^2 + 2 = 27, 51, 123$: todos múltiplos de $3$. El patrón te da la demostración.` },
          ],
        },
      }],
    },
    {
      id: 'cp3-7', numero: 7, nombre: R`$p_n \le 2^{2^{n-1}}$`,
      enunciado: R`Sea $p_n$ el $n$-ésimo primo. Demuestre que $p_n \le 2^{2^{n-1}}$.`,
      partes: [{
        id: 'x',
        pistas: [
          { tipo: 'concepto', texto: R`Se aplica la construcción de la <b>infinitud de los primos</b>: $p_1 p_2 \cdots p_n + 1$ tiene un divisor primo que no es ninguno de los $p_i$. Y el <b>PIM</b> en su forma fuerte.`, enlaces: [INFINITOS, DIVISOR_PRIMO, PIM] },
          { tipo: 'estrategia', texto: R`Inducción fuerte: para acotar $p_{n+1}$, usa las cotas de <i>todos</i> los anteriores a la vez.` },
          { tipo: 'arranque', texto: R`En la demostración de Euclides, $p_1 \cdots p_n + 1$ tiene un divisor primo $q$ distinto de $p_1, \dots, p_n$. ¿Qué relación hay entre $q$ y $p_{n+1}$? ¿Y entre $q$ y $p_1 \cdots p_n + 1$?` },
          { tipo: 'desbloqueo', texto: R`Llegas a $p_{n+1} \le p_1 \cdots p_n + 1 \le 2^{2^0} \cdot 2^{2^1} \cdots 2^{2^{n-1}} + 1$. Suma los exponentes: $1 + 2 + \dots + 2^{n-1}$.` },
          { tipo: 'desbloqueo', texto: R`Te queda $2^{2^n - 1} + 1$. Compáralo con $2^{2^n} = 2 \cdot 2^{2^n - 1}$.` },
        ],
        solucion: {
          pasos: [
            { texto: R`Base $n = 1$: $p_1 = 2 \le 2^{2^0} = 2$.` },
            { texto: R`Paso (inducción fuerte): supongamos $p_k \le 2^{2^{k-1}}$ para $k = 1, \dots, n$. Sea $N = p_1 p_2 \cdots p_n + 1 \gt 1$, y $q$ un divisor primo de $N$.` },
            { texto: R`$q$ no es ningún $p_i$: si $q = p_i$, dividiría a $N$ y a $p_1 \cdots p_n$, luego a $1$. Como los primos menores o iguales que $p_n$ son exactamente $p_1, \dots, p_n$, se tiene $q \gt p_n$, así que $q \ge p_{n+1}$. Además $q \le N$.` },
            { texto: R`Por la hipótesis: $p_{n+1} \le N \le 2^{2^0} \cdot 2^{2^1} \cdots 2^{2^{n-1}} + 1 = 2^{1 + 2 + \dots + 2^{n-1}} + 1 = 2^{2^n - 1} + 1$.` },
            { texto: R`Como $1 \le 2^{2^n - 1}$: $2^{2^n - 1} + 1 \le 2 \cdot 2^{2^n - 1} = 2^{2^n}$. Luego $p_{n+1} \le 2^{2^n}$, que es la afirmación para $n + 1$.` },
          ],
        },
        aprendes: {
          resultado: R`$p_n \le 2^{2^{n-1}}$ para todo $n \ge 1$: una cota (muy generosa) del $n$-ésimo primo.`,
          ideas: [
            { idea: 'Euclides da cotas, no solo infinitud', texto: R`$p_1 \cdots p_n + 1$ tiene un primo nuevo, así que el siguiente primo es $\le p_1 \cdots p_n + 1$. Las construcciones de existencia suelen dar también una cota.` },
            { idea: 'Inducción fuerte cuando el paso usa todo el pasado', texto: R`Si la cota de $p_{n+1}$ depende del producto de todos los anteriores, necesitas la hipótesis para todos, no solo para $p_n$.` },
            { idea: 'Productos de potencias = suma de exponentes', texto: R`$2^{2^0} \cdots 2^{2^{n-1}} = 2^{2^n - 1}$ por la suma geométrica. Pasar a exponentes convierte productos en sumas fáciles.` },
          ],
        },
      }],
    },
    {
      id: 'cp3-8', numero: 8, nombre: R`Para $n \gt 2$ hay un primo entre $n$ y $n!$`,
      enunciado: R`Demuestre que si $n \gt 2$, entonces existe un primo $p$ que satisface $n \lt p \lt n!$.`,
      partes: [{
        id: 'x',
        pistas: [
          { tipo: 'concepto', texto: R`Es la misma idea que la <b>infinitud de los primos</b> (un número que no es divisible por ningún primo pequeño), junto con <b>todo entero mayor que $1$ tiene un divisor primo</b>.`, enlaces: [INFINITOS, DIVISOR_PRIMO] },
          { tipo: 'estrategia', texto: R`Construye un número menor que $n!$ cuyos divisores primos no puedan ser $\le n$.` },
          { tipo: 'arranque', texto: R`Todo primo $p \le n$ divide a $n!$. ¿Qué número cercano a $n!$ no es divisible por ninguno de ellos?` },
          { tipo: 'desbloqueo', texto: R`Toma $n! - 1$. ¿Por qué es mayor que $1$? (aquí se usa $n \gt 2$). Toma un divisor primo suyo y comprueba las dos desigualdades.` },
        ],
        solucion: {
          pasos: [
            { texto: R`Como $n \gt 2$, $n! \ge 6$ y $n! - 1 \ge 5 \gt 1$. Sea $p$ un divisor primo de $n! - 1$.` },
            { texto: R`$p \le n! - 1 \lt n!$.` },
            { texto: R`Si fuera $p \le n$, $p$ sería uno de los factores de $n! = 1 \cdot 2 \cdots n$, así que $p \mid n!$. Entonces $p \mid n! - (n! - 1) = 1$, imposible.` },
            { texto: R`Luego $n \lt p \lt n!$.` },
          ],
        },
        aprendes: {
          resultado: R`Para $n \gt 2$ hay un primo $p$ con $n \lt p \lt n!$.`,
          ideas: [
            { idea: '«$\pm 1$» esquiva a todos los divisores', texto: R`$M \pm 1$ no es divisible por ningún divisor $\gt 1$ de $M$. Con $M = n!$ o $M = p_1 \cdots p_k$ se obtienen números sin primos pequeños.` },
            { idea: 'Revisar dónde se usa cada hipótesis', texto: R`$n \gt 2$ solo sirve para que $n! - 1 \gt 1$. Encontrar el papel de cada hipótesis comprueba la demostración.` },
          ],
        },
      }],
    },
  ],
};
