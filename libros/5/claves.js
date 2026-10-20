// Ideas que se llevan de cada elemento del Libro V: técnicas y atajos reutilizables en demostraciones propias.
const R = String.raw;

export default {
  'def-src': [
    { idea: 'Un SRC es «un representante por columna»', texto: R`Para comprobar que $n$ números forman un SRC($n$) basta ver que sus restos son distintos: $n$ restos distintos entre $0$ y $n - 1$ son todos. Es el principio del palomar al revés: $n$ objetos en $n$ cajas sin repetir llenan todas.` },
    { idea: 'Cambiar un número por su resto', texto: R`Dentro de un SRC cualquier elemento se puede sustituir por otro de su columna. Elegir bien los representantes (los más pequeños, o los simétricos $-\frac{n}{2} \lt r \le \frac{n}{2}$) simplifica las cuentas.` },
  ],
  'teo-src-k': [
    { idea: 'Probar «no choca» en vez de «llena todo»', texto: R`Para ver que $n$ objetos llenan $n$ casillas basta ver que no hay dos en la misma (inyectiva ⇒ biyectiva en conjuntos finitos del mismo tamaño). Es más fácil probar que no hay choques que construir la correspondencia.` },
    { idea: 'Contrarrecíproco', texto: R`Si «$P \Rightarrow Q$» es difícil, prueba «no $Q$ ⇒ no $P$». Aquí: suponer un choque abajo produce un choque arriba, y arriba no lo hay.` },
    { idea: 'Multiplicar por un coprimo es reordenar', texto: R`Si $(k,n) = 1$, $x \mapsto kx$ permuta las columnas. Por eso $\prod (k a_i) \equiv \prod a_i$ y $\sum k a_i \equiv \sum a_i$: es la puerta a Fermat y a Euler.` },
  ],
  'def-ecuacion-lineal': [
    { idea: 'Una solución es una columna', texto: R`Las soluciones de una congruencia se cuentan módulo $n$. Si encuentras $x_0$, todos los $x_0 + tn$ son la misma respuesta.` },
    { idea: 'Para $n$ pequeño, probar todas las columnas', texto: R`Con $n$ pequeño se resuelve probando $x = 0, \dots, n - 1$: es una demostración completa porque cualquier entero es congruente con uno de ellos.` },
  ],
  'teo-soluble': [
    { idea: 'Congruencia ⇔ ecuación con una incógnita más', texto: R`$ax \equiv b\ (n)$ es lo mismo que $ax - ny = b$. Pasar de una a otra te deja usar Bézout, Euclides extendido y la solución general de las diofánticas.` },
    { idea: 'La imagen de $x \mapsto ax$ son los múltiplos de $d$', texto: R`Todo $ax + ny$ es múltiplo de $d = (a,n)$, y todo múltiplo de $d$ se alcanza. Por eso «soluble ⇔ $d | b$» y por eso a cada imagen llegan $d$ flechas.` },
    { idea: 'Comprobar que una familia de soluciones funciona', texto: R`Para ver que $x_0 + \frac{n}{d}t$ es solución basta sustituir: $a \cdot \frac{n}{d} t = \frac{a}{d} \cdot n \cdot t$ es múltiplo de $n$. Sustituir y agrupar el factor $n$ es el truco estándar.` },
  ],
  'ej-3x-9': [
    { idea: 'Reducir antes de resolver', texto: R`Cambia cada número por su resto (o por un representante cómodo) antes de operar: $9 \to 2$. Las cuentas se hacen pequeñas y no cambia nada.` },
    { idea: 'Comprobar siempre', texto: R`Al final sustituye la solución: $3 \cdot 3 = 9 \equiv 2$. Es una línea y caza los errores de signo.` },
  ],
  'teo-d-soluciones': [
    { idea: 'Contar soluciones = contar columnas distintas', texto: R`Para probar que hay exactamente $d$ hay que probar dos cosas: que las $d$ candidatas son distintas módulo $n$ y que cualquier otra coincide con una de ellas. Siempre son esas dos mitades.` },
    { idea: 'Algoritmo de la división como «reducir el índice»', texto: R`Si una familia depende de $t$ y es periódica, escribe $t = qd + r$: la parte $qd$ da vueltas completas y solo importa $r$. Sirve para cualquier sucesión periódica (potencias módulo $n$, por ejemplo).` },
    { idea: 'Cancelar un factor que no es coprimo', texto: R`De $ct_1 \equiv ct_2\ (n)$ no se deduce $t_1 \equiv t_2\ (n)$, sino módulo $\frac{n}{(c,n)}$. Es un error muy común cancelar sin dividir el módulo.` },
  ],
  'ej-18x-30': [
    { idea: 'Receta para $ax \equiv b\ (n)$', texto: R`1) $d = (a,n)$; si $d \nmid b$ no hay solución. 2) Encuentra una $x_0$ (Euclides extendido o tanteo en $\frac{ax}{d} \equiv \frac{b}{d}\ (\frac{n}{d})$). 3) Las soluciones son $x_0 + \frac{n}{d}t$, $t = 0, \dots, d - 1$.` },
    { idea: 'Atajo: dividir todo por $d$', texto: R`$18x \equiv 30\ (42)$ equivale a $3x \equiv 5\ (7)$. Ahí la solución es única ($x \equiv 4$) y las $6$ del módulo $42$ son $4 + 7t$.` },
  ],
  'cor-unica': [
    { idea: 'Unicidad por cancelación', texto: R`Para probar que algo es único, supón dos ($x_0$, $x_1$), iguala lo que cumplen ($ax_1 \equiv ax_0$) y cancela. Es el patrón de casi todas las pruebas de unicidad.` },
    { idea: 'Inverso módulo $n$', texto: R`Si $(a,n) = 1$, la solución de $ax \equiv 1$ es el inverso $a^{-1}$, y la de $ax \equiv b$ es $x \equiv a^{-1}b$. «Dividir por $a$» módulo $n$ significa multiplicar por $a^{-1}$.` },
  ],
  'teo-chino': [
    { idea: 'Construir con una «base»', texto: R`Si sabes resolver los casos «$1$ aquí y $0$ en los demás», cualquier caso es una combinación con pesos $a_i$. Es la misma idea que los vectores base del álgebra lineal (y que la interpolación de Lagrange).` },
    { idea: 'Para el $0$: que contenga el factor; para el $1$: el inverso', texto: R`$p_j = \frac{p}{n_j}$ contiene a todos los $n_i$ con $i \neq j$ (vale $0$ módulo ellos); multiplicarlo por su inverso módulo $n_j$ lo convierte en $1$.` },
    { idea: 'Unicidad: la diferencia de dos soluciones', texto: R`Resta dos soluciones: la diferencia cumple el sistema con todos los restos $0$, es decir, es múltiplo de todos los módulos y por tanto de su mcm. Restar dos soluciones sirve igual en diofánticas, congruencias y ecuaciones lineales.` },
    { idea: 'Primos relativos dos a dos ⇒ mcm = producto', texto: R`Es lo que hace que la solución sea única módulo el producto. Si no son coprimos, el sistema puede no tener solución o tenerla módulo el mcm.` },
  ],
  'ej-chino': [
    { idea: 'Atajo por tanteo dirigido', texto: R`Con módulos pequeños: los $x \equiv 2\ (7)$ son $2, 9, 16, 23, \dots$; prueba solo esos con las demás condiciones. Es más rápido que la construcción cuando los números son pequeños.` },
    { idea: 'Reducir al final', texto: R`La fórmula da un $A$ grande ($233$); réstale múltiplos de $p$ para quedarte con el representante entre $0$ y $p - 1$.` },
  ],
};
