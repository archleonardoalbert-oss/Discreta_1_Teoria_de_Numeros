// Ideas que se llevan de cada elemento del Libro II: técnicas y atajos reutilizables en demostraciones propias.
const R = String.raw;

export default {
  'def-mcd': [
    { idea: 'El mcd es el salto común más largo', texto: R`Un divisor común es un salto que cae en $a$ y en $b$. Para acotar un mcd basta mostrar un divisor común (cota inferior) y un número del que todos los divisores comunes son divisores (cota superior).` },
    { idea: 'Calcular sin factorizar', texto: R`Con números grandes no busques divisores: usa Euclides. Factorizar es lento; dividir es rápido.` },
  ],
  'prop-signos': [
    { idea: 'Los signos no importan en divisibilidad', texto: R`$d | a \iff d | -a \iff -d | a$. Puedes suponer $a, b \ge 0$ al estudiar mcd y divisibilidad, y decirlo al principio («sin pérdida de generalidad»).` },
    { idea: 'Igualdad de máximos por igualdad de conjuntos', texto: R`Para probar $\max A = \max B$, prueba $A = B$. Es más fácil comparar conjuntos que comparar máximos.` },
  ],
  'teo-divide-mcd': [
    { idea: 'Si uno divide al otro, el mcd es el pequeño', texto: R`$a | b \Rightarrow (a, b) = |a|$. En particular $(a, 0) = |a|$: es el caso en el que termina Euclides.` },
    { idea: 'Probar que algo es el máximo', texto: R`Dos pasos: es del conjunto y nadie del conjunto lo supera. Es el esquema de toda prueba de «es el mayor» o «es el menor».` },
  ],
  'def-primos-relativos': [
    { idea: 'Coprimos = sin factores primos comunes', texto: R`$(a, b) = 1$ si ningún primo divide a los dos. Es la forma práctica de comprobarlo.` },
    { idea: 'Coprimos ⇔ alguna combinación da 1', texto: R`$(a,b) = 1$ si y solo si $ax + by = 1$ para algunos enteros. Para probar que dos números son coprimos, basta exhibir esa combinación: $(n, n+1) = 1$ porque $(n+1) - n = 1$.` },
  ],
  'def-combinacion-lineal': [
    { idea: 'Las combinaciones heredan divisores', texto: R`Todo divisor común de $a$ y $b$ divide a cualquier $ax + by$. Es la herramienta más usada del libro.` },
    { idea: 'Saltos hacia los dos lados', texto: R`Con coeficientes negativos puedes «volver». Así, con saltos de $a$ y de $b$, alcanzas exactamente los múltiplos de $(a, b)$.` },
  ],
  'teo-menor-combinacion': [
    { idea: 'Bézout: el mcd es la menor combinación positiva', texto: R`$(a,b) = ax + by$ para algunos enteros. Cuando necesites el mcd dentro de una igualdad, escríbelo así.` },
    { idea: 'Mínimo + algoritmo de la división', texto: R`Toma el menor elemento $s$ de un conjunto cerrado bajo «restar múltiplos»; el resto de dividir cualquier elemento entre $s$ también estaría en el conjunto y sería menor. Luego el resto es $0$ y $s$ divide a todo. Es un patrón muy reutilizable.` },
    { idea: 'Probar $s = d$ con dos desigualdades', texto: R`$s \le d$ y $d \le s$. Probar una igualdad como dos desigualdades es a menudo lo más fácil.` },
  ],
  'teo-divisores-comunes': [
    { idea: 'Los divisores comunes son los divisores del mcd', texto: R`$c | a$ y $c | b \iff c | (a,b)$. Atajo: para ver que $c$ divide a los dos, comprueba solo que divide al mcd.` },
    { idea: 'El mcd es el mayor también en divisibilidad', texto: R`No solo es el mayor en tamaño: todos los divisores comunes lo dividen. Es la definición que se generaliza a otros contextos.` },
  ],
  'cor-mcd-n': [
    { idea: 'mcd de muchos, de dos en dos', texto: R`$(a_1, \dots, a_n) = (a_1, (a_2, \dots, a_n))$. Calcula el mcd de una lista reduciéndola par a par.` },
    { idea: 'Probar igualdades de mcd por divisores comunes', texto: R`Si dos listas tienen los mismos divisores comunes, tienen el mismo mcd. Es el método general.` },
  ],
  'cor-cocientes-coprimos': [
    { idea: 'Dividir por el mcd deja coprimos', texto: R`$\frac{a}{d}$ y $\frac{b}{d}$ son coprimos. Es el primer paso de muchas pruebas: «sea $d = (a,b)$, $a = da'$, $b = db'$ con $(a', b') = 1$».` },
    { idea: 'Reducir una fracción', texto: R`Es lo que pasa al simplificar $\frac{a}{b}$ al máximo: numerador y denominador quedan coprimos.` },
  ],
  'teo-divide-producto': [
    { idea: 'Si $a | bc$ y $(a,b) = 1$, entonces $a | c$', texto: R`El factor coprimo «no ayuda» a la divisibilidad y se puede quitar. Prueba: multiplica Bézout ($ax + by = 1$) por $c$.` },
    { idea: 'Error típico', texto: R`Sin coprimalidad es falso: $4 | 2 \cdot 6$ pero $4 \nmid 6$. Comprueba siempre la hipótesis $(a, b) = 1$.` },
  ],
  'cor-mcd-resto': [
    { idea: '$(a, b) = (b, r)$', texto: R`Cambiar $a$ por su resto al dividir entre $b$ no cambia el mcd. Es el motor de Euclides y sirve para simplificar mcd con expresiones: $(n^2 + 1, n) = (1, n) = 1$.` },
    { idea: 'Más general: $(a, b) = (a - kb, b)$', texto: R`Restar a uno un múltiplo del otro conserva el mcd. Úsalo para mcd de polinomios en $n$.` },
  ],
  'def-diofantica': [
    { idea: 'Solo soluciones enteras', texto: R`Una diofántica no se resuelve despejando: se buscan enteros. Lo primero es saber si existen (criterio del mcd) y luego describirlas todas.` },
    { idea: 'Probar que no hay solución', texto: R`Si $(a,b) \nmid c$, no hay solución. También sirve mirar restos: $6x + 10y = 7$ es imposible porque el lado izquierdo es par.` },
  ],
  'teo-diofantica-solucion': [
    { idea: 'Criterio: $(a,b) | c$', texto: R`$ax + by = c$ tiene solución entera si y solo si el mcd divide a $c$. Es lo primero que se comprueba.` },
    { idea: 'Escalar una solución', texto: R`Si sabes resolver $ax + by = d$, multiplica por $\frac{c}{d}$ para resolver $ax + by = c$. Resolver el caso «$= \mcd$» basta para todos.` },
  ],
  'teo-euclides': [
    { idea: 'Terminación por descenso', texto: R`Los restos bajan estrictamente y no pueden bajar de $0$: el algoritmo termina. Así se prueba que cualquier proceso que «decrece en los naturales» termina.` },
    { idea: 'Invariante', texto: R`En cada paso el mcd no cambia. Un invariante más una terminación es el esquema de las pruebas sobre algoritmos.` },
  ],
  'ej-euclides-3088': [
    { idea: 'Disposición en tabla', texto: R`Escribe cada división en una fila; el divisor pasa a dividendo y el resto a divisor. Así no se pierde ningún número.` },
    { idea: 'Comprobar', texto: R`El mcd debe dividir a los dos números: $3088 = 8 \cdot 386$, $456 = 8 \cdot 57$.` },
  ],
  'teo-coeficientes': [
    { idea: 'Euclides hacia atrás', texto: R`Despeja cada resto y sustituye de abajo arriba: obtienes $x, y$ con $ax + by = \mcd$. La tabla $A_i, B_i$ es esa sustitución organizada.` },
    { idea: 'Atajo hacia delante', texto: R`También puedes llevar, para cada resto, su expresión $r_i = a s_i + b t_i$ mientras divides: cada nueva expresión es la de dos filas antes menos $q$ veces la de la fila anterior.` },
  ],
  'ej-coeficientes-3088': [
    { idea: 'Comprobar siempre la combinación', texto: R`$3088 \cdot (-22) + 456 \cdot 149 = -67936 + 67944 = 8$. Un error de signo se detecta enseguida.` },
    { idea: 'Para qué sirve', texto: R`Con $x, y$ resuelves diofánticas, calculas inversos módulo $n$ y resuelves congruencias lineales.` },
  ],
  'teo-solucion-general': [
    { idea: 'Restar dos soluciones', texto: R`La diferencia de dos soluciones resuelve la ecuación «homogénea» $ax + by = 0$. Estudiar la homogénea da todas las soluciones: es la misma idea que en ecuaciones diferenciales y en álgebra lineal.` },
    { idea: 'Intercambio de saltos', texto: R`$\frac{b}{d}$ saltos de $a$ equivalen a $\frac{a}{d}$ saltos de $b$ (los dos miden $\mcm(a,b)$). Sumar uno y restar el otro no cambia el total.` },
  ],
  'def-mcm': [
    { idea: 'El primer punto donde coinciden los saltos', texto: R`El mcm es la primera coincidencia de los saltos de $a$ y de $b$; todas las demás son sus múltiplos.` },
    { idea: 'Con exponentes', texto: R`El mcm toma, para cada primo, el mayor exponente que aparece en $a$ o en $b$.` },
  ],
  'teo-multiplos-comunes': [
    { idea: 'Dividir por el mcd para aplicar coprimalidad', texto: R`Ante una igualdad $k_1a = k_2b$, divide entre $(a,b)$ para que los coeficientes sean coprimos y usa «$m | nx$, $(m,n) = 1 \Rightarrow m | x$».` },
    { idea: 'Describir todos los objetos', texto: R`El teorema no da solo uno: da la forma de todos los múltiplos comunes. Busca siempre la descripción completa.` },
  ],
  'cor-mcm-mcd': [
    { idea: '$(a,b) \cdot [a,b] = |ab|$', texto: R`Si conoces el mcd (por Euclides), el mcm sale gratis dividiendo: $[a,b] = \frac{|ab|}{(a,b)}$.` },
    { idea: 'Coprimos', texto: R`Si $(a,b) = 1$, $[a,b] = |ab|$: por eso en el Teorema Chino del Resto el módulo final es el producto.` },
  ],
  'cor-multiplo-mcm': [
    { idea: 'Todo múltiplo común es múltiplo del mcm', texto: R`Atajo: si $a | m$ y $b | m$, entonces $[a,b] | m$. Úsalo para juntar dos condiciones de divisibilidad en una.` },
    { idea: 'Simetría con el mcd', texto: R`Todo divisor común divide al mcd, y el mcm divide a todo múltiplo común: son las dos caras de la misma estructura.` },
  ],
};
