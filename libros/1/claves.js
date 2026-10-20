// Ideas que se llevan de cada elemento del Libro I: técnicas y atajos reutilizables en demostraciones propias.
const R = String.raw;

export default {
  pbo: [
    { idea: 'El PBO funciona porque hay suelo', texto: R`Vale para cualquier conjunto de enteros acotado inferiormente (no solo $\Z_+$): basta un punto de partida. Antes de usarlo comprueba dos cosas: que el conjunto no es vacío y que está acotado por debajo.` },
    { idea: 'Cómo se usa casi siempre', texto: R`Defines un conjunto de «contraejemplos» o de «candidatos», tomas su mínimo y fabricas otro elemento del conjunto todavía más pequeño. Esa contradicción es el corazón de la división con resto, de Bézout y del divisor primo.` },
  ],
  pim: [
    { idea: 'Dos piezas, siempre por separado', texto: R`Escribe aparte la base y el paso. En el paso, enuncia la hipótesis $P(n)$ y el objetivo $P(n+1)$ antes de empezar, y busca dónde aparece $P(n)$ dentro de $P(n+1)$.` },
    { idea: 'Inducción fuerte', texto: R`Si para probar $P(n+1)$ necesitas un caso anterior que no es $P(n)$ (por ejemplo un divisor $a \lt n$), supón cierto $P(k)$ para todo $n_0 \le k \le n$. Es igual de válido.` },
    { idea: 'El error clásico', texto: R`Un paso que no funciona para el primer $n$ invalida todo (el «todos los caballos son del mismo color» falla al pasar de $1$ a $2$). Comprueba el paso justo después de la base.` },
  ],
  'teo-pbo-pim': [
    { idea: 'Patrón del contraejemplo mínimo', texto: R`1) $C$ = los $n$ donde falla. 2) Supón $C \neq \varnothing$ y toma $m = \min C$. 3) Usa que todo lo menor que $m$ funciona. 4) Fabrica la contradicción. Cualquier inducción se puede escribir así, y a veces es más natural.` },
    { idea: 'Entre enteros, $\gt$ es $\ge + 1$', texto: R`$m \gt n_0$ con enteros significa $m \ge n_0 + 1$. Este paso tan pequeño es el que hace funcionar el argumento: en los racionales no es cierto, y por eso no hay PBO allí.` },
    { idea: 'Para probar que algo es vacío', texto: R`Supón que tiene un elemento, toma el mínimo y llega a contradicción. Es la forma estándar de probar «no hay contraejemplos».` },
  ],
  'ej-suma-impares': [
    { idea: 'Separar el último término', texto: R`En sumas $\sum_{k=1}^{m}$ escribe $\sum_{k=1}^{m-1} + (\text{término } m)$: así aparece la hipótesis. Es el movimiento número uno en inducción con sumas.` },
    { idea: 'Ver la fórmula antes de probarla', texto: R`Dibujar los primeros casos (escuadras de $1, 3, 5$) sugiere la fórmula $n^2$. Luego la inducción la confirma. Para adivinar fórmulas, calcula los $4$ o $5$ primeros casos.` },
  ],
  'def-divide': [
    { idea: 'Traducir «divide» a una igualdad', texto: R`En cuanto veas $a | b$, escribe «existe $q$ con $b = aq$». Casi todas las pruebas de divisibilidad empiezan así y terminan fabricando un $q$ entero.` },
    { idea: 'Para probar $a \nmid b$', texto: R`Basta encontrar el resto: si $b = aq + r$ con $0 \lt r \lt |a|$, no divide.` },
  ],
  'lema-divisor-0': [
    { idea: 'Comprobar todas las condiciones de la definición', texto: R`La definición de $a | b$ tiene dos partes ($a \neq 0$ y el $q$). Una prueba rigurosa revisa cada condición, aunque una sea trivial.` },
    { idea: 'Elegir el testigo', texto: R`Para un «existe $q$», basta exhibir uno. Aquí $q = 0$. Muchas pruebas de existencia son simplemente adivinar el testigo y comprobarlo.` },
  ],
  'teo-divisor-menor': [
    { idea: 'Valor absoluto para comparar tamaños', texto: R`$|xy| = |x|\,|y|$ convierte un producto con signos en uno de positivos, donde las desigualdades son fáciles.` },
    { idea: '«Entero no nulo ⇒ al menos 1»', texto: R`$q \in \Z$, $q \neq 0 \Rightarrow |q| \ge 1$. Es la única herramienta que distingue a los enteros de los reales en muchas pruebas, y da cotas gratis.` },
    { idea: 'Consecuencia útil', texto: R`Si $a | b$ y $b | a$ (ambos no nulos), entonces $|a| = |b|$. Y un número tiene finitos divisores: todos entre $-|n|$ y $|n|$.` },
  ],
  'teo-transitiva': [
    { idea: 'Encadenar igualdades sustituyendo', texto: R`Escribe cada hipótesis como igualdad ($b = aq_1$, $c = bq_2$) y sustituye una en otra. Luego reagrupa para que aparezca la forma que buscas ($c = a \cdot \text{algo}$).` },
    { idea: 'Cerrar comprobando que el factor es entero', texto: R`$q_1q_2 \in \Z$ porque los enteros son cerrados bajo producto. En divisibilidad, esa comprobación siempre hace falta.` },
  ],
  'teo-division': [
    { idea: 'Existencia por el mínimo de los candidatos', texto: R`Define el conjunto de todos los «posibles restos» positivos, toma el mínimo, y prueba que si fuera demasiado grande podrías hacerlo más pequeño (restar $b$ otra vez).` },
    { idea: 'Unicidad restando', texto: R`Supón dos descomposiciones, réstalas ($b(q - q_1) = r_1 - r$) y acota: un múltiplo de $b$ estrictamente entre $-b$ y $b$ solo puede ser $0$.` },
    { idea: 'El resto es el atajo universal', texto: R`Todo entero es $bq + r$ con $0 \le r \lt b$: puedes partir cualquier problema en $b$ casos (por ejemplo, $n$ par o impar; $n = 3q, 3q + 1, 3q + 2$).` },
  ],
  'def-primo': [
    { idea: 'Para probar que $n$ es primo basta hasta $\sqrt n$', texto: R`Si $n = ab$ con $a \le b$, entonces $a \le \sqrt n$. Basta probar divisores hasta $\sqrt n$.` },
    { idea: 'El 1 no es primo', texto: R`La definición pide $n \gt 1$; si no, la factorización en primos no sería única ($6 = 2 \cdot 3 = 1 \cdot 2 \cdot 3$).` },
  ],
  'cor-compuesto': [
    { idea: 'Reformular «no primo» como una factorización', texto: R`«Compuesto» se usa casi siempre como «$n = ab$ con $1 \lt a, b \lt n$»: los dos factores son más pequeños que $n$, lo que permite inducción o descenso.` },
    { idea: '«Sin pérdida de generalidad»', texto: R`Cuando dos objetos juegan papeles simétricos, puedes ordenarlos ($a \le b$) intercambiando nombres. Ahorra casos.` },
  ],
  'lema-divisor-primo': [
    { idea: 'Tres caras de la misma idea', texto: R`Descenso, inducción fuerte y PBO son intercambiables: «no se puede bajar para siempre en los positivos». Elige la que haga la prueba más corta.` },
    { idea: 'El mínimo de los divisores es primo', texto: R`El menor divisor mayor que $1$ de $n$ siempre es primo. Es el atajo para obtener un factor primo concreto.` },
    { idea: 'Descenso infinito', texto: R`Si de un contraejemplo sabes fabricar otro estrictamente menor (y positivo), no hay contraejemplos. Así se prueba también que $\sqrt 2$ es irracional.` },
  ],
  'teo-infinitos-primos': [
    { idea: '«Fabricar un número que esquive a todos»', texto: R`$P + 1$ deja resto $1$ al dividir entre cada $p_i$. Sumar $1$ a un múltiplo común es el truco para obtener algo coprimo con todos.` },
    { idea: 'Si $d | x$ y $d | y$, entonces $d | x - y$', texto: R`Es la herramienta que convierte «divide a $m$ y a $P$» en «divide a $1$». Úsala siempre que dos múltiplos estén cerca.` },
    { idea: 'No concluir más de lo probado', texto: R`La prueba da un primo nuevo $q$, no que $P + 1$ sea primo ($30031 = 59 \cdot 509$). Revisa qué afirma exactamente cada paso.` },
  ],
};
