// Ideas que se llevan de cada elemento del Libro III: técnicas y atajos reutilizables en demostraciones propias.
const R = String.raw;

export default {
  'lema-p-no-divide': [
    { idea: 'Con un primo solo hay dos opciones', texto: R`Cualquier cosa que divida a $p$ es $1$ o $p$. Para probar algo sobre $(p, a)$ basta descartar una de las dos. Es el «o es todo o es nada» de los primos.` },
    { idea: 'Primo + no divide ⇒ coprimo', texto: R`$p \nmid a \Rightarrow (p, a) = 1$. Es la puerta para usar Bézout ($ax + py = 1$) con primos.` },
  ],
  'lema-euclides': [
    { idea: 'Multiplicar Bézout por lo que quieres dividir', texto: R`Si $ax + py = 1$, multiplica por $b$: $b = abx + pby$. Ahora cada sumando es múltiplo de $p$. Este truco prueba casi todas las propiedades de divisibilidad con coprimos.` },
    { idea: 'Versión general', texto: R`Si $d | ab$ y $(d, a) = 1$, entonces $d | b$ (no hace falta que $d$ sea primo). La prueba es la misma.` },
    { idea: 'Ojo: falla sin primo', texto: R`$6 | 4 \cdot 9$ pero $6 \nmid 4$ y $6 \nmid 9$. Si $d$ no es primo, hace falta la hipótesis de coprimalidad.` },
  ],
  'teo-primo-producto': [
    { idea: 'Generalizar de 2 a $n$ por inducción', texto: R`Si una propiedad vale para dos factores, agrupa $a_1 \cdots a_k$ como un solo factor $A$ y aplícala a $A \cdot a_{k+1}$. Así se extiende casi cualquier resultado de «dos» a «muchos».` },
    { idea: 'Un primo «se queda» en algún factor', texto: R`Si $p$ divide a un producto, divide a algún factor. Úsalo para localizar dónde está un primo.` },
  ],
  'cor-primos': [
    { idea: 'Divisores de un primo', texto: R`Para identificar un número que divide a un primo, compáralo con $1$ y con el primo: no hay más candidatos.` },
    { idea: 'Primos en dos factorizaciones', texto: R`Un primo de un lado tiene que estar en el otro: es el paso clave de la unicidad del Teorema Fundamental.` },
  ],
  'cor-potencia': [
    { idea: '$p | a^k \Rightarrow p | a$', texto: R`Las potencias no esconden primos nuevos: los primos de $a^k$ son los de $a$. Así se prueba que $\sqrt 2$ es irracional ($2 | a^2 \Rightarrow 2 | a$).` },
    { idea: 'Y luego $p^k | a^k$', texto: R`Si $p | a$, cada copia de $a$ aporta un $p$: el exponente se multiplica por $k$.` },
  ],
  'teo-fundamental': [
    { idea: 'Existencia por inducción fuerte', texto: R`Si $n$ no es primo, $n = ab$ con factores menores: la hipótesis se aplica a los dos. Es el modelo de toda prueba que «parte en trozos más pequeños».` },
    { idea: 'Unicidad: quitar un factor común y reducir', texto: R`Encuentra un primo que está en las dos factorizaciones, cancélalo y aplica la hipótesis a $n/p$. «Cancelar y reducir» es la técnica.` },
    { idea: 'Para qué sirve', texto: R`Todo lo multiplicativo (divisores, mcd, mcm, cuadrados perfectos, $\sqrt n$ racional) se decide mirando los exponentes de la factorización.` },
  ],
  'def-canonica': [
    { idea: 'Exponentes como vector', texto: R`$n = \prod p_i^{\alpha_i}$ se puede pensar como la lista de exponentes. Multiplicar suma exponentes; dividir los resta; $d | n$ si cada exponente de $d$ es $\le$ el de $n$.` },
    { idea: 'Contar divisores', texto: R`$n = p_1^{\alpha_1} \cdots p_k^{\alpha_k}$ tiene $(\alpha_1 + 1) \cdots (\alpha_k + 1)$ divisores positivos: cada exponente se elige entre $0$ y $\alpha_i$.` },
  ],
  'cor-canonica': [
    { idea: 'Comparar dos números por sus exponentes', texto: R`Dos números son iguales si y solo si tienen los mismos exponentes. Para probar $a = b$ con productos, compara exponentes primo a primo.` },
    { idea: 'mcd y mcm de un vistazo', texto: R`$\mcd$: el menor exponente de cada primo; $\mcm$: el mayor. De ahí $\mcd(a,b) \cdot \mcm(a,b) = ab$.` },
  ],
  'lema-6q': [
    { idea: 'Dividir en casos por el resto', texto: R`Escribir $n = 6q + r$ reduce un problema sobre todos los enteros a $6$ casos. Elige el módulo según los primos que intervienen ($2 \cdot 3 = 6$).` },
    { idea: 'Necesario no es suficiente', texto: R`Ser $6q \pm 1$ es necesario para ser primo ($\gt 3$), no suficiente ($25$). Distingue siempre la implicación de su recíproco.` },
    { idea: 'Uso típico', texto: R`Para $p \gt 3$ primo: $p^2 = (6q \pm 1)^2 = 36q^2 \pm 12q + 1$, así que $24 | p^2 - 1$ se prueba en dos líneas.` },
  ],
  'teo-wilson': [
    { idea: 'Emparejar para simplificar un producto', texto: R`Si los factores se pueden agrupar en parejas que valen $1$ (inversos), el producto se reduce a los que quedan sueltos. Lo mismo vale para sumas con parejas que suman $0$.` },
    { idea: 'Los que son su propio inverso', texto: R`$x^2 \equiv 1\ (p) \Rightarrow x \equiv \pm 1$. Esta ecuación aparece en muchas pruebas; con $p$ primo solo tiene esas dos soluciones.` },
    { idea: 'Test de primalidad (teórico)', texto: R`$n$ es primo si y solo si $(n-1)! \equiv -1\ (n)$. Es exacto pero lento: sirve más para demostrar que para calcular.` },
  ],
  'teo-fermat': [
    { idea: 'Permutación de restos', texto: R`Multiplicar $1, 2, \dots, p - 1$ por $a$ solo los reordena: compara los productos y cancela. Es la misma idea en Euler y en muchas identidades.` },
    { idea: 'Atajo para potencias grandes', texto: R`Reduce el exponente módulo $p - 1$: $2^{100} \bmod 11$, con $100 = 10 \cdot 10$, da $1$.` },
  ],
  'cor-fermat': [
    { idea: 'Separar en casos según si $p$ divide', texto: R`«$p | a$ o $p \nmid a$» cubre todo. En el primer caso suele ser trivial; en el segundo tienes coprimalidad y todos los teoremas.` },
    { idea: 'Versión sin hipótesis', texto: R`$a^p \equiv a\ (p)$ vale para todo $a$: es más cómoda cuando no sabes si $p | a$.` },
  ],
  'lema-compuestos': [
    { idea: 'Construir con un factorial', texto: R`$N! + k$ es múltiplo de $k$ para $2 \le k \le N$. El factorial es la forma rápida de tener un número divisible por todos los pequeños a la vez.` },
    { idea: 'Huecos arbitrariamente grandes', texto: R`Hay tramos de $n$ compuestos seguidos para cualquier $n$: los primos se vuelven escasos. Para probar «existen tramos así», basta construir uno.` },
  ],
};
