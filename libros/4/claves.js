// Ideas que se llevan de cada elemento del Libro IV: técnicas y atajos reutilizables en demostraciones propias.
const R = String.raw;

export default {
  'def-congruencia': [
    { idea: 'Pensar en columnas', texto: R`$a \equiv b\ (n)$ es «misma columna en la tabla de $n$ columnas». Muchas preguntas («¿qué resto deja?», «¿es divisible?») son preguntas sobre en qué columna cae algo.` },
    { idea: 'Representantes negativos', texto: R`$n - 1 \equiv -1\ (n)$. Usar $-1$ en lugar de $n - 1$ simplifica mucho las potencias: $(n-1)^k \equiv (-1)^k$.` },
  ],
  'teo-congruencia-divide': [
    { idea: 'La forma de trabajar: $n | a - b$', texto: R`En las pruebas casi nunca se usa «mismo resto»; se usa $a - b = kn$. Traduce la congruencia a esa igualdad en la primera línea.` },
    { idea: 'Un múltiplo de $n$ más pequeño que $n$ es $0$', texto: R`Si $n | x$ y $|x| \lt n$, entonces $x = 0$. Es el argumento estándar para probar que dos restos (o dos representantes cercanos) son iguales.` },
  ],
  'teo-equivalencia': [
    { idea: 'Las clases parten el conjunto', texto: R`Toda relación de equivalencia reparte los elementos en clases disjuntas. Para trabajar con una clase basta un representante: cualquier cálculo con otro da lo mismo.` },
    { idea: 'Comprobar «está bien definido»', texto: R`Cuando operes con clases (sumar columnas, multiplicarlas), comprueba que el resultado no depende del representante elegido. Es lo que hacen las propiedades 4 y 6.` },
  ],
  'prop-1': [{ idea: 'Toda congruencia empieza en una igualdad', texto: R`Incluso lo trivial se prueba traduciendo a $n | a - b$. Hazlo siempre: evita errores con signos y con el módulo.` }, { idea: 'Cero es múltiplo de todo', texto: R`$0 = n \cdot 0$: por eso $a \equiv a$ y por eso $n | 0$ para todo $n \neq 0$.` }],
  'prop-2': [{ idea: 'Cambiar el orden es cambiar el signo del cociente', texto: R`$a - b = kn \iff b - a = (-k)n$. El orden en una congruencia no importa.` }, { idea: 'Entero negado es entero', texto: R`Al demostrar divisibilidad basta que el factor sea entero; su signo no importa.` }],
  'prop-3': [{ idea: 'Sumar igualdades para eliminar el intermedio', texto: R`$(a - b) + (b - c) = a - c$: la suma telescópica hace desaparecer $b$. Es el truco de toda cadena de congruencias.` }, { idea: 'Cadenas', texto: R`Por esto puedes escribir $a \equiv b \equiv c \equiv \dots$ y saltar del primero al último.` }],
  'prop-4': [{ idea: 'Sustituir por un representante cómodo', texto: R`En una suma puedes cambiar cada sumando por cualquier número de su columna: $47 + 38 \equiv 2 + 3\ (5)$. Reduce primero, suma después.` }, { idea: 'Reagrupar', texto: R`$(a + c) - (b + d) = (a - b) + (c - d)$: separa la diferencia en diferencias que ya conoces.` }],
  'prop-5': [{ idea: 'Repetir una propiedad = inducción', texto: R`«Se suma $k$ veces» es una inducción en $k$: base $k = 1$ y paso «sumar una vez más». Escríbela así cuando quieras rigor.` }, { idea: 'Atajo', texto: R`Para multiplicar por un número fijo $k$ basta reducir el otro factor: $13 \cdot 7 \equiv 3 \cdot 7 = 21 \equiv 1\ (10)$.` }],
  'prop-6': [{ idea: 'Sumar y restar lo mismo', texto: R`$ac - bd = ac - bc + bc - bd$. Sumar $0$ de forma inteligente para hacer aparecer diferencias conocidas es una de las técnicas más usadas en toda la matemática.` }, { idea: 'Reducir antes de multiplicar', texto: R`$123 \cdot 456 \equiv 3 \cdot 6 = 18 \equiv 8\ (10)$: la última cifra de un producto solo depende de las últimas cifras.` }],
  'prop-7': [{ idea: 'Potencias grandes: reducir la base', texto: R`$27^{100} \equiv 1^{100} = 1\ (13)$, porque $27 \equiv 1$. Busca un representante de la base que sea $0$, $1$ o $-1$.` }, { idea: 'Inducción en el exponente', texto: R`$a^{k+1} = a^k \cdot a$: cualquier propiedad de potencias se prueba así.` }],
  'prop-8': [{ idea: 'Sumar lo mismo a los dos lados', texto: R`Como en una ecuación: de $a \equiv b$ pasas a $a + c \equiv b + c$. Sirve para «despejar» en congruencias lineales.` }, { idea: 'Combinar propiedades', texto: R`Esta propiedad sale de dos anteriores (1 y 4). Antes de demostrar algo desde cero, mira si es un caso particular de lo que ya tienes.` }],
  'prop-9': [{ idea: 'Dividir hay que hacerlo en los tres', texto: R`Si divides $a$ y $b$ por $c$, también hay que dividir el módulo: $6 \equiv 12\ (6)$ da $1 \equiv 2\ (1)$, no $(6)$.` }, { idea: 'Cambio de unidad', texto: R`Si todo lo que aparece es múltiplo de $c$, mide en unidades de $c$: el problema se hace más pequeño.` }],
  'prop-10': [{ idea: 'Bajar a un módulo divisor', texto: R`Una congruencia módulo $n$ vale módulo cualquier divisor de $n$. Útil para comprobar: si algo falla módulo $2$ o $3$, falla módulo $6$.` }, { idea: 'Al revés no', texto: R`De $a \equiv b\ (c)$ no se deduce nada módulo $n$ con $c | n$: los saltos de $c$ son más finos que los de $n$.` }],
  'teo-cancelacion': [
    { idea: 'Cancelar exige dividir el módulo', texto: R`De $ca \equiv cb\ (n)$ sale $a \equiv b\ (\frac{n}{d})$ con $d = (c,n)$. Ejemplo: $2 \cdot 2 \equiv 2 \cdot 5\ (6)$ pero $2 \not\equiv 5\ (6)$; solo $2 \equiv 5\ (3)$.` },
    { idea: 'Quitar el mcd para tener coprimos', texto: R`Escribir $c = dr$, $n = ds$ con $(r,s) = 1$ es el truco estándar para poder usar «$s | rx \Rightarrow s | x$».` },
  ],
  'cor-cancelacion-coprimos': [{ idea: 'Con coprimos se divide como siempre', texto: R`Si $(c,n) = 1$, $c$ tiene inverso módulo $n$ y se cancela sin tocar el módulo.` }, { idea: 'Corolario = teorema con un caso concreto', texto: R`Muchos corolarios son sustituir un parámetro ($d = 1$). Busca qué valor hace más sencillo el teorema general.` }],
  'cor-cancelacion-primo': [{ idea: 'Módulo primo: casi como en los racionales', texto: R`Módulo $p$ se puede dividir por cualquier número que no sea múltiplo de $p$. Por eso las pruebas con módulo primo son mucho más fáciles.` }, { idea: 'Primo y no divide ⇒ coprimos', texto: R`$p \nmid c \Rightarrow (p, c) = 1$. Es la forma más rápida de obtener coprimalidad.` }],
  'fuerte-1': [
    { idea: 'Juntar congruencias con distintos módulos', texto: R`Si algo vale módulo $m$ y módulo $n$, vale módulo $\mcm(m,n)$. Con $m, n$ coprimos, módulo $mn$: es la base del Teorema Chino del Resto.` },
    { idea: 'Comparar exponentes primo a primo', texto: R`Divisibilidad, mcd y mcm se leen en los exponentes de la factorización: $d | n$ si y solo si cada exponente de $d$ es $\le$ el de $n$.` },
  ],
  'fuerte-2': [{ idea: 'mcd invariante al sumar múltiplos', texto: R`$\mcd(a, n) = \mcd(a + kn, n)$. Es la idea del algoritmo de Euclides y permite reducir $a$ módulo $n$ antes de calcular un mcd.` }, { idea: 'Probar igualdad de mcd por divisores comunes', texto: R`Para ver que dos mcd son iguales, prueba que los conjuntos de divisores comunes son iguales: cada divisor de uno divide al otro.` }],
  'fuerte-3': [{ idea: 'Sustituir para eliminar una variable', texto: R`Escribe la hipótesis como igualdad ($c = qn + d$) y sustitúyela: los términos múltiplos de $n$ se pueden quitar.` }, { idea: 'Lo que es múltiplo de $n$ desaparece', texto: R`$aqn \equiv 0\ (n)$: en congruencias, cualquier término con factor $n$ se borra.` }],
  'fuerte-4': [{ idea: 'Reducir dentro de un polinomio', texto: R`Para saber $f(1000) \bmod 7$, reduce primero $1000 \equiv 6 \equiv -1$ y calcula $f(-1)$.` }, { idea: 'Criterios de divisibilidad', texto: R`Un número es $f(10)$ con $f$ el polinomio de sus cifras. Como $10 \equiv 1\ (9)$, $f(10) \equiv f(1)$ = suma de cifras: el criterio del $9$. Con $10 \equiv -1\ (11)$ sale el del $11$.` }],
  'def-solucion': [{ idea: 'Basta probar un representante por columna', texto: R`Para resolver $f(x) \equiv 0\ (n)$ prueba $x = 0, \dots, n - 1$ (o $-\frac{n}{2}, \dots, \frac{n}{2}$, que da cuentas más pequeñas).` }, { idea: 'Probar que no hay solución', texto: R`Si ningún resto funciona, no hay solución entera. Ejemplo: $x^2 \equiv 2\ (3)$ no tiene solución, así que $x^2 - 3y = 2$ tampoco.` }],
  'teo-solucion-clase': [{ idea: 'Las soluciones vienen por columnas', texto: R`Por eso se cuentan «módulo $n$» y por eso basta mirar $0, \dots, n - 1$.` }, { idea: 'Reducir antes de comprobar', texto: R`Para comprobar que $b$ es solución, reduce $b$ a su resto y comprueba ese.` }],
  'teo-fermat': [
    { idea: 'Permutación ⇒ el producto no cambia', texto: R`Si una operación solo reordena un conjunto, el producto (o la suma) de sus elementos no cambia. Comparar los dos productos da la identidad.` },
    { idea: 'Atajo para potencias', texto: R`$a^{p-1} \equiv 1\ (p)$: reduce el exponente módulo $p - 1$. $3^{100} \bmod 7$: $100 = 6 \cdot 16 + 4$, así que $3^{100} \equiv 3^4 = 81 \equiv 4$.` },
    { idea: 'Test de no-primalidad', texto: R`Si $a^{n-1} \not\equiv 1\ (n)$ para algún $a$ coprimo con $n$, entonces $n$ no es primo, sin factorizarlo.` },
  ],
};
