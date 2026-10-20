// Libro IV — Conferencia 4 (28 de septiembre de 2025): congruencia.
// Texto literal de la conferencia (transcrito del PDF renderizado). Lo corregido lleva `marca: 'corregido'`;
// lo que no está en la conferencia va con `pasosAñadidos` o `marca: 'añadido'`. Las demostraciones de una sola
// línea se parten por sus cláusulas para que cada una tenga su paso.
const R = String.raw;
import CLAVES from './claves.js';

const NOMBRES = {
  1: R`$a \equiv a\ (n)$`, 2: R`$a \equiv b \iff b \equiv a$`, 3: R`$a \equiv b$ y $b \equiv c$ ⇒ $a \equiv c$`, 4: R`$a \pm c \equiv b \pm d\ (n)$`,
  5: R`$ak \equiv bk\ (n)$`, 6: R`$ac \equiv bd\ (n)$`, 7: R`$a^k \equiv b^k\ (n)$`, 8: R`$a + c \equiv b + c\ (n)$`,
  9: R`$\frac{a}{c} \equiv \frac{b}{c}\ (\frac{n}{c})$`, 10: R`si $c|n$, $a \equiv b\ (c)$`,
};
const prop = (n, enunciado, pasos, _escena, extra = {}) => ({
  id: `prop-${n}`, tipo: 'PROP', nombre: R`Propiedad ${n}: ${NOMBRES[n]}`, enunciado, pasos, escena: `4/prop-${n}`, ...extra,
});

const libro = {
  numero: 4, romano: 'IV', titulo: 'Congruencia', color: 'verde',
  conferencia: 'Conferencia 4 · 28 de septiembre de 2025',
  elementos: [
    {
      id: 'def-congruencia', tipo: 'DEF', nombre: 'Congruencia módulo n',
      enunciado: R`Sea $n \in \Z_+$, $a \in \Z$, $b \in \Z$, se dice que $a$ es congruente con $b$ módulo $n$ si $a$ y $b$ tienen el mismo resto al ser divididos por $n$ y esto se denota $a \equiv b \pmod n$ o $a \equiv b\ (n)$`,
      explicacion: R`Enrolla la recta en filas de $n$: la fila $q$ empieza en $qn$. Cada columna reúne a los números con el mismo resto. Ser congruentes es caer en la misma columna.`,
      pasosAñadidos: 'idea',
      pasos: [
        { texto: R`Los enteros en la recta, uno tras otro.` },
        { texto: R`La recta se enrolla en filas de $n$: la columna de cada número es su resto $r$ ($0 \le r \lt n$), y la fila es su cociente.` },
        { texto: R`$a$ y $b$ caen en la misma columna si y solo si tienen el mismo resto: $a \equiv b\ (n)$.` },
      ],
      escena: '4/def-congruencia',
    },
    {
      id: 'teo-congruencia-divide', tipo: 'TEO', nombre: R`$a \equiv b\ (n)$ si y solo si $n|a - b$`,
      enunciado: R`Sea $n \in \Z_+$, $a \in \Z$, $b \in \Z$, se dice que $a \equiv b\ (n)$ si y solo si $n|a - b$`,
      explicacion: R`En la tabla enrollada, ir de $b$ a $a$ dentro de la misma columna es bajar (o subir) filas enteras: saltos de $n$. Y si la distancia es un múltiplo de $n$, los dos restos no pueden diferir, porque dos columnas distintas están a menos de $n$.`,
      pasos: [
        { texto: R`Demostremos que si $a \equiv b\ (n)$ entonces $n|a - b$` },
        { texto: R`Como $a \equiv b\ (n)$, por definición, $a = kn + r$ y $b = qn + r$` },
        { texto: R`(Mismo resto $r$ por la definición; $k$ y $q$ son los cocientes de dividir $a$ y $b$ entre $n$.)`, marca: 'añadido' },
        { texto: R`luego $a - kn = b - qn$` },
        { texto: R`$a - b = kn - qn$` },
        { texto: R`$a - b = (k - q)n$ por lo que $n|a - b$` },
        { texto: R`Demostremos ahora que si $n|a - b$ entonces $a \equiv b\ (n)$. Tenemos que $a = nq_1 + r_1$ y $b = nq_2 + r_2$` },
        { texto: R`luego $a - b = n(q_1 - q_2) + r_1 - r_2$` },
        { texto: R`Ahora, como $n|a - b$ y $n|n(q_1 - q_2)$ entonces $n|r_1 - r_2$ y $n||r_1 - r_2|$` },
        { texto: R`(Si $n$ divide a dos números divide a su diferencia: $r_1 - r_2 = (a - b) - n(q_1 - q_2)$.)`, marca: 'añadido' },
        { texto: R`pero $|r_1 - r_2| \lt n$ por lo que $r_1 - r_2 = 0$ entonces $r_1 = r_2$ y, por tanto, $a \equiv b\ (n)$` },
        { texto: R`(¿Por qué $|r_1 - r_2| \lt n$? Los dos restos están en $\{0, \dots, n - 1\}$: el mayor menos el menor es a lo sumo $n - 1$. Y un múltiplo de $n$ con valor absoluto menor que $n$ solo puede ser $0$.)`, marca: 'añadido' },
      ],
      escena: '4/teo-congruencia-divide',
    },
    {
      id: 'teo-equivalencia', tipo: 'TEO', nombre: 'La congruencia es una relación de equivalencia',
      enunciado: R`La relación de congruencia módulo $n$ es una relación de equivalencia`,
      explicacion: R`Reflexiva, simétrica y transitiva son las propiedades básicas 1, 2 y 3. Lo que dicen en el dibujo: la relación agrupa los enteros en $n$ columnas que no se tocan, las clases residuales.`,
      pasosAñadidos: 'demostracion',
      pasos: [
        { texto: R`Una relación es de equivalencia si es reflexiva, simétrica y transitiva: hay que comprobar las tres.` },
        { texto: R`Reflexiva: $a - a = 0 = n \cdot 0$, luego $n | a - a$ y $a \equiv a\ (n)$ (propiedad 1).` },
        { texto: R`Simétrica: si $a - b = kn$, entonces $b - a = (-k)n$ con $-k$ entero, luego $b \equiv a\ (n)$ (propiedad 2).` },
        { texto: R`Transitiva: si $a - b = kn$ y $b - c = ln$, sumando, $a - c = (k + l)n$ (el $b$ se cancela), luego $a \equiv c\ (n)$ (propiedad 3).` },
        { texto: R`La clase de $a$ es $[a] = \{x \in \Z : x \equiv a\ (n)\}$. Todo entero está en la clase de su resto $r \in \{0, \dots, n - 1\}$, por el algoritmo de la división.` },
        { texto: R`Dos clases que comparten un elemento son la misma: si $c \equiv a$ y $c \equiv b$, por simetría y transitividad $a \equiv b$, y todo lo congruente con uno lo es con el otro.` },
        { texto: R`Restos distintos no son congruentes, así que hay exactamente $n$ clases disjuntas, una por columna: $[0], [1], \dots, [n-1]$.` },
      ],
      escena: '4/teo-equivalencia',
    },
    prop(1, R`Para todo $a$, $a \equiv a\ (n)$`, [
      { texto: R`Como $a - a = 0 = n * 0$` },
        { texto: R`($0 = n \cdot 0$ con $0$ entero: es justo «$0$ es múltiplo de $n$».)`, marca: 'añadido' },
      { texto: R`entonces $n|a - a$` },
    ], undefined, { explicacion: R`De $a$ a $a$ no hay que saltar: cero saltos de $n$.` }),
    prop(2, R`$a \equiv b\ (n)$ si y solo si $b \equiv a\ (n)$`, [
      { texto: R`Si $a - b = kn$ para algún $k$` },
      { texto: R`luego $b - a = -kn$` },
        { texto: R`($-k$ es entero, así que $b - a$ es múltiplo de $n$: $n | b - a$, es decir, $b \equiv a\ (n)$.)`, marca: 'añadido' },
    ], undefined, { explicacion: R`El mismo camino de saltos recorrido al revés: $k$ saltos de $n$ hacia un lado son $-k$ hacia el otro.`, marcaEnunciado: 'corregido' }),
    prop(3, R`Si $a \equiv b\ (n)$ y $b \equiv c\ (n)$ entonces $a \equiv c\ (n)$`, [
      { texto: R`Si $a - b = kn$ y $b - c = ln$ para $k, l$ enteros` },
        { texto: R`(Se suman las dos igualdades: $(a - b) + (b - c) = a - c$; el $b$ se cancela, y $kn + ln = (k + l)n$.)`, marca: 'añadido' },
      { texto: R`entonces $a - c = (k + l)n$` },
    ], undefined, { explicacion: R`Dos tramos de saltos de $n$ seguidos forman un tramo de saltos de $n$.` }),
    prop(4, R`Si $a \equiv b\ (n)$ y $c \equiv d\ (n)$ entonces $a \pm c \equiv b \pm d\ (n)$`, [
      { texto: R`Si $a - b = kn$ y $c - d = ln$ para $k, l$ enteros entonces` },
        { texto: R`(Se reagrupa: $(a + c) - (b + d) = (a - b) + (c - d)$ y $(a - c) - (b - d) = (a - b) - (c - d)$.)`, marca: 'añadido' },
      { texto: R`$(a + c) - (b + d) = (k + l)n$` },
      { texto: R`y $(a - c) - (b - d) = (k - l)n$` },
    ], undefined, { explicacion: R`Da igual qué representante de cada columna elijas: al sumarlos (o restarlos) caes siempre en la misma columna.` }),
    prop(5, R`Si $a \equiv b\ (n)$ y $k \in \Z_+$ entonces $ak \equiv bk\ (n)$`, [
      { texto: R`Se suma $k$ veces $a \equiv b\ (n)$` },
      { texto: R`Con rigor es una inducción en $k$: para $k = 1$ es la hipótesis; si $ka \equiv kb$, sumándole $a \equiv b$ (propiedad 4) sale $(k+1)a \equiv (k+1)b$.`, marca: 'añadido' },
    ], undefined, { explicacion: R`$ka$ es $a + a + \dots + a$. Cada suma cae en la misma columna para $a$ que para $b$.` }),
    prop(6, R`Si $a \equiv b\ (n)$ y $c \equiv d\ (n)$ entonces $ac \equiv bd\ (n)$`, [
      { texto: R`Para ello se debe demostrar que $ac - bd$ es múltiplo de $n$.` },
      { texto: R`Entonces $ac - bd = ac - bc + bc - bd = c(a - b) + b(c - d)$` },
        { texto: R`(Se suma y resta $bc$, es decir, se suma $0$: el truco para que aparezcan $a - b$ y $c - d$. Luego se saca factor común.)`, marca: 'añadido' },
      { texto: R`y como $a - b$ y $c - d$ son múltiplos de $n$ entonces $ac - bd$ también lo es` },
        { texto: R`En detalle: con $a - b = kn$ y $c - d = ln$, $ac - bd = c \cdot kn + b \cdot ln = (ck + bl)n$.`, marca: 'añadido' },
    ], undefined, { explicacion: R`Los productos son rectángulos. Quitar el rectángulo $b \times d$ del $a \times c$ deja una escuadra que se parte en dos tiras: una de anchura $a - b$ y otra de anchura $c - d$. Las dos anchuras son múltiplos de $n$, así que las tiras se cortan en bloques de $n$.` }),
    prop(7, R`Si $a \equiv b\ (n)$ y $k \in \Z_+$ entonces $a^k \equiv b^k\ (n)$`, [
      { texto: R`Se multiplica $k$ veces $a \equiv b\ (n)$` },
      { texto: R`Con rigor es una inducción en $k$: para $k = 1$ es la hipótesis; si $a^k \equiv b^k$, multiplicándola por $a \equiv b$ (propiedad 6) sale $a^{k+1} \equiv b^{k+1}$.`, marca: 'añadido' },
    ], undefined, { explicacion: R`$a^k = a \cdot a \cdots a$. Cada vez que se multiplica por $a$ de un lado y por $b$ del otro, los restos siguen siendo iguales.` }),
    prop(8, R`Si $a \equiv b\ (n)$ entonces $a + c \equiv b + c\ (n)$`, [
      { texto: R`Se tiene que $a \equiv b\ (n)$ y también que $c \equiv c\ (n)$` },
        { texto: R`($c \equiv c$ es la propiedad 1; luego se aplica la propiedad 4 con $d = c$.)`, marca: 'añadido' },
      { texto: R`luego $a + c \equiv b + c\ (n)$` },
    ], undefined, { explicacion: R`Mover $a$ y $b$ la misma distancia $c$ no cambia la distancia entre ellos: siguen a un múltiplo de $n$.` }),
    prop(9, R`Si $c$ es divisor común de $a, b, n$ luego, si $a \equiv b\ (n)$ entonces $\frac{a}{c} \equiv \frac{b}{c}\ (\frac{n}{c})$`, [
      { texto: R`Como $c$ es divisor común de $a, b, n$ entonces para $a_1, b_1, n_1$ enteros se tiene que $a = ca_1$, $b = cb_1$ y $n = cn_1$` },
      { texto: R`y, entonces, $ca_1 \equiv cb_1\ (cn_1)$ luego $ca_1 - cb_1 = kcn_1$ para $k$ entero,` },
        { texto: R`(Se divide toda la igualdad entre $c \neq 0$: $c(a_1 - b_1) = c(kn_1)$ da $a_1 - b_1 = kn_1$.)`, marca: 'añadido' },
      { texto: R`lo que es lo mismo que $a_1 - b_1 = kn_1$, por lo que $a_1 \equiv b_1\ (n_1)$ por tanto $\frac{a}{c} \equiv \frac{b}{c}\ (\frac{n}{c})$` },
    ], undefined, { explicacion: R`Es un cambio de unidad: si todo se mide en «unidades de $c$», $a$ pasa a ser $a_1$, $b$ pasa a ser $b_1$ y el salto $n$ pasa a ser $n_1$. Los mismos $k$ saltos siguen llevando de $b$ a $a$.` }),
    prop(10, R`Si $c|n$ y $a \equiv b\ (n)$ entonces $a \equiv b\ (c)$`, [
      { texto: R`Como $c|n$ entonces $n = qc$ con $q$ entero` },
      { texto: R`y como $a \equiv b\ (n)$ entonces $a - b = kn$ con $k$ entero,` },
      { texto: R`luego $a - b = kqc$ y como $kq$ es un entero entonces $a \equiv b\ (c)$` },
    ], undefined, { explicacion: R`Cada salto de $n$ está hecho de $q$ saltos de $c$. Si $k$ saltos de $n$ van de $b$ a $a$, también lo hacen $kq$ saltos de $c$.` }),
    {
      id: 'teo-cancelacion', tipo: 'TEO', nombre: R`Si $ca \equiv cb\ (n)$ entonces $a \equiv b\ (\frac{n}{d})$`,
      enunciado: R`Si $ca \equiv cb\ (n)$ entonces $a \equiv b\ (\frac{n}{d})$ donde $d = \mcd(c,n)$`,
      explicacion: R`Multiplicar por $c$ es una aplicación $x \mapsto cx$ de las $n$ columnas en sí mismas. Si $d = \mcd(c, n) \gt 1$, la aplicación pliega: a cada imagen llegan exactamente $d$ flechas, desde números separados $n/d$. Por eso, de $ca \equiv cb$ solo se recupera $a \equiv b$ módulo $n/d$.`,
      pasos: [
        { texto: R`Como $ca \equiv cb\ (n)$ entonces $ca - cb = c(a - b) = kn$,` },
        { texto: R`ahora si se tiene que $d = \mcd(c,n)$ entonces existen $s$ y $r$, $(r,s) = 1$ tales que $c = dr$ y $n = ds$,` },
        { texto: R`($d$ divide a $c$ y a $n$, de ahí $r$ y $s$. Y $(r,s) = 1$: si $e \gt 1$ dividiera a ambos, $de$ sería un divisor común de $c$ y $n$ mayor que $d$.)`, marca: 'añadido' },
        { texto: R`si se sustituye en la igualdad previa se tiene que $dr(a - b) = kds$ y si se simplifica queda que $r(a - b) = ks$.` },
        { texto: R`A partir de esto se tiene que $s|r(a - b)$ y, como $r$ y $s$ son primos relativos, entonces $s|a - b$` },
        { texto: R`(Es el teorema de la Conferencia 2: si $s | rx$ y $(s, r) = 1$, entonces $s | x$. Aquí $x = a - b$.)`, marca: 'añadido' },
        { texto: R`y, por tanto $a \equiv b\ (s)$ lo que es lo mismo que $a \equiv b\ (\frac{n}{d})$` },
      ],
      escena: '4/teo-cancelacion',
    },
    {
      id: 'cor-cancelacion-coprimos', tipo: 'COR', nombre: R`Si $ca \equiv cb\ (n)$ y $\mcd(c,n) = 1$ entonces $a \equiv b\ (n)$`,
      enunciado: R`Si $ca \equiv cb\ (n)$ y $\mcd(c,n) = 1$ entonces $a \equiv b\ (n)$`,
      explicacion: R`Con $\mcd(c, n) = 1$ la aplicación $x \mapsto cx$ no pliega nada: a cada columna llega exactamente una flecha. Si dos flechas llegan al mismo sitio, salieron del mismo sitio.`,
      pasos: [
        { texto: R`Para $d = 1$ se tiene entonces,` },
        { texto: R`a partir del teorema anterior que $a \equiv b\ (\frac{n}{1})$` },
        { texto: R`(y $\frac{n}{1} = n$: con $\mcd(c,n) = 1$ no se pierde nada del módulo.)`, marca: 'añadido' },
      ],
      escena: '4/cor-cancelacion-coprimos',
    },
    {
      id: 'cor-cancelacion-primo', tipo: 'COR', nombre: R`Si $ca \equiv cb\ (p)$ y $p \nmid c$ entonces $a \equiv b\ (p)$`,
      enunciado: R`Si $ca \equiv cb\ (p)$ y $p \nmid c$ donde $p$ es primo, entonces $a \equiv b\ (p)$`,
      explicacion: R`Módulo un primo, multiplicar por cualquier $c$ que no sea múltiplo de $p$ es una permutación de las columnas: se puede «dividir» por $c$.`,
      pasos: [
        { texto: R`Como $p \nmid c$ y $p$ es primo, entonces $\mcd(c,p) = 1$,` },
        { texto: R`(Los divisores positivos de $p$ son $1$ y $p$; como $p \nmid c$, el único común con $c$ es $1$.)`, marca: 'añadido' },
        { texto: R`y entonces se tiene el corolario anterior` },
      ],
      escena: '4/cor-cancelacion-primo',
    },
    {
      id: 'fuerte-1', tipo: 'PROP', nombre: R`Propiedad fuerte 1: $a \equiv b\ (m)$ y $a \equiv b\ (n)$ ⇒ $a \equiv b\ (\mcm(m,n))$`,
      enunciado: R`Si $a \equiv b\ (m)$ y $a \equiv b\ (n)$ entonces $a \equiv b\ (\mcm(m,n))$`,
      explicacion: R`$a - b$ es a la vez múltiplo de $m$ y de $n$. En la factorización de $a - b$, cada primo tiene al menos el exponente que pide $m$ y el que pide $n$, o sea el mayor de los dos: eso es ser múltiplo del $\mcm$.`,
      pasos: [
        { texto: R`Por el <b>Teorema Fundamental de la Aritmética</b> $m = \prod_p p^{m_p}$, $n = \prod_p p^{n_p}$ y $\mcm(m,n) = \prod_p p^{\max(m_p,n_p)}$ donde $p$ son números primos, $m_p \ge 0$ y $n_p \ge 0$.` },
        { texto: R`Entonces, si $a \equiv b\ (m)$ y $a \equiv b\ (n)$ esto significa que $p^{m_p}|a - b$ y que $p^{n_p}|a - b$` },
        { texto: R`(Porque $p^{m_p} | m$ y $m | a - b$: transitividad. Lo mismo con $n$.)`, marca: 'añadido' },
        { texto: R`y, por tanto, $p^{\max(m_p,n_p)}|a - b$.` },
        { texto: R`($p^{\max(m_p, n_p)}$ es uno de los dos, $p^{m_p}$ o $p^{n_p}$: el mayor. Así que divide a $a - b$.)`, marca: 'añadido' },
        { texto: R`Ahora como $a - b = \prod_p p^{c_p}$ donde $c_p \ge \max(m_p,n_p)$ entonces $\mcm(m,n)|a - b$` },
        { texto: R`y, por tanto, $a \equiv b\ (\mcm(m,n))$` },
      ],
      escena: '4/fuerte-1',
    },
    {
      id: 'fuerte-2', tipo: 'PROP', nombre: R`Propiedad fuerte 2: $a \equiv b\ (n)$ ⇒ $\mcd(a,n) = \mcd(b,n)$`,
      enunciado: R`Si $a \equiv b\ (n)$ entonces $\mcd(a,n) = \mcd(b,n)$`,
      explicacion: R`$a = kn + b$: los divisores comunes de $a$ y $n$ son los mismos que los de $n$ y $b$ (un divisor de $n$ divide a $kn$, y entonces divide a $a$ si y solo si divide a $b$). Mismos divisores comunes, mismo máximo.`,
      pasos: [
        { texto: R`Si $a \equiv b\ (n)$ entonces $a - b = kn$ para $k$ entero,` },
        { texto: R`luego $a = k * n + b$` },
        { texto: R`(Conferencia 2: si $a = kn + b$, un divisor común de $a$ y $n$ divide a $b = a - kn$, y uno común de $n$ y $b$ divide a $a = kn + b$. Los divisores comunes son los mismos, luego el máximo también.)`, marca: 'añadido' },
        { texto: R`y por tanto $\mcd(a,n) = \mcd(n,b)$` },
      ],
      escena: '4/fuerte-2',
    },
    {
      id: 'fuerte-3', tipo: 'PROP', nombre: R`Propiedad fuerte 3: $ac \equiv bd$, $c \equiv d$ y $\mcd(c,n) = 1$ ⇒ $a \equiv b$`,
      enunciado: R`Si $ac \equiv bd\ (n)$, $c \equiv d\ (n)$ y $\mcd(c,n) = 1$ entonces $a \equiv b\ (n)$`,
      explicacion: R`En rectángulos: $c = qn + d$ parte el rectángulo $a \times c$ en un trozo $a \times qn$, múltiplo de $n$, y un trozo $a \times d$. Lo que queda, $ad - bd = d(a - b)$, es múltiplo de $n$; y como $d$ no comparte factores con $n$, se cancela.`,
      pasos: [
        { texto: R`Como $c \equiv d\ (n)$ entonces $\mcd(d,n) = \mcd(c,n) = 1$` },
        { texto: R`(Es la propiedad fuerte 2 aplicada a $c \equiv d$.)`, marca: 'añadido' },
        { texto: R`y $c - d = qn$, lo que es lo mismo que $c = qn + d$` },
        { texto: R`Ahora, como $ac \equiv bd\ (n)$ entonces $ac - bd = kn$ y sustituyendo $c$ se tiene que $a(qn + d) - bd = kn$` },
        { texto: R`$aqn + ad - bd = kn$` },
        { texto: R`$ad - bd = kn - aqn$` },
        { texto: R`$ad - bd = (k - aq)n$` },
        { texto: R`entonces $da \equiv db\ (n)$ y como $\mcd(d,n) = 1$ entonces $a \equiv b\ (n)$` },
      ],
      escena: '4/fuerte-3',
    },
    {
      id: 'fuerte-4', tipo: 'PROP', nombre: R`Propiedad fuerte 4: $a \equiv b\ (n)$ ⇒ $f(a) \equiv f(b)\ (n)$`,
      enunciado: R`Sea $f(x)$ un polinomio con coeficientes enteros $a \equiv b\ (n)$ entonces $f(a) \equiv f(b)\ (n)$`,
      explicacion: R`Un polinomio solo usa sumas y productos, y las dos respetan las columnas. Término a término, $c_k a^k$ y $c_k b^k$ caen en la misma columna, y sus sumas también.`,
      pasos: [
        { texto: R`$f(x)$ de manera general se puede definir como $f(x) = \sum_{k=0}^{m} c_k x^k$` },
        { texto: R`Como $a \equiv b\ (n)$ entonces se puede tener $a^k \equiv b^k\ (n)$` },
        { texto: R`(Propiedad 7.)`, marca: 'añadido' },
        { texto: R`luego se pueden multiplicar por un entero tal que $c_k a^k \equiv c_k b^k\ (n)$` },
        { texto: R`(Propiedad 6 con $c_k \equiv c_k$.)`, marca: 'añadido' },
        { texto: R`y estas se pueden sumar varias veces de modo que $\sum_{k=0}^{m} c_k a^k \equiv \sum_{k=0}^{m} c_k b^k\ (n)$` },
        { texto: R`(Propiedad 4, una vez por cada sumando.)`, marca: 'añadido' },
        { texto: R`y como $f(a) = \sum_{k=0}^{m} c_k a^k$ y $f(b) = \sum_{k=0}^{m} c_k b^k$ entonces $f(a) \equiv f(b)\ (n)$` },
      ],
      escena: '4/fuerte-4',
    },
    {
      id: 'def-solucion', tipo: 'DEF', nombre: R`Solución de $f(x) \equiv 0\ (n)$`,
      enunciado: R`Si $f(x)$ es un polinomio con coeficientes enteros se dice que $a$ es solución de $f(x) \equiv 0\ (n)$ si $f(a) \equiv 0\ (n)$`,
      explicacion: R`Basta probar un representante de cada columna: $x = 0, 1, \dots, n - 1$. Los que hacen que $f(x)$ caiga en la columna del $0$ son las soluciones.`,
      pasosAñadidos: 'idea',
      pasos: [
        { texto: R`Se evalúa $f(x)$ en $x = 0, 1, \dots, n - 1$.` },
        { texto: R`Cada valor $f(x)$ cae en una columna (su resto al dividir entre $n$).` },
        { texto: R`Son solución los $x$ cuyo $f(x)$ cae en la columna $0$: $f(x) \equiv 0\ (n)$.` },
      ],
      escena: '4/def-solucion',
    },
    {
      id: 'teo-solucion-clase', tipo: 'TEO', nombre: R`Si $a$ es solución y $a \equiv b\ (n)$, $b$ también lo es`,
      enunciado: R`Sea $f(x)$ un polinomio con coeficientes enteros tal que $a$ es solución de $f(x) \equiv 0\ (n)$ y $a \equiv b\ (n)$, entonces $b$ también es solución`,
      explicacion: R`Las soluciones no van sueltas: vienen por columnas enteras. Si un número de la columna es solución, lo es toda la columna.`,
      pasos: [
        { texto: R`Por el teorema anterior se tiene que $f(a) \equiv f(b)\ (n)$` },
        { texto: R`(Es la propiedad fuerte 4, porque $a \equiv b\ (n)$.)`, marca: 'añadido' },
        { texto: R`entonces se tiene que $f(b) \equiv f(a) \equiv 0\ (n)$ y, por tanto, $b$ es solución` },
      ],
      escena: '4/teo-solucion-clase',
    },
    {
      id: 'teo-fermat', tipo: 'TEO', nombre: 'Pequeño Teorema de Fermat (con congruencias)',
      enunciado: R`<b><i>Pequeño Teorema de Fermat</i></b>. Sea $p$ primo y $a \in \Z$, luego si $p \nmid a$ entonces $a^{p-1} \equiv 1\ (p)$`,
      explicacion: R`Multiplicar por $a$ mueve cada casilla $1, \dots, p - 1$ a otra, sin repetir ninguna: es una permutación. Así que el producto de las imágenes es el mismo producto de antes, reordenado.`,
      pasos: [
        { texto: R`Si se tienen los primeros $p - 1$ múltiplos positivos de $a$, que serían $a, 2a, 3a, \dots, (p - 1)a$,` },
        { texto: R`ninguno de ellos es congruente con otro módulo $p$ pues si eso pasara entonces se tendría $ra \equiv sa\ (p)$, $1 \le r \lt s \le p - 1$, lo que resultaría en que $r \equiv s\ (p)$ lo que es falso.` },
        { texto: R`(De $ra \equiv sa\ (p)$ se cancela $a$ porque $p \nmid a$; y $r \equiv s$ es falso porque $0 \lt s - r \lt p$.)`, marca: 'añadido' },
        { texto: R`Entonces el conjunto de múltiplos debe ser congruente módulo $p$ con $1, 2, 3, \dots, p - 1$, en algún orden.`, marca: 'corregido' },
        { texto: R`(Además ninguno es $\equiv 0$: $p \nmid ia$ porque $p \nmid i$ y $p \nmid a$ (lema de Euclides). Son $p - 1$ restos distintos dentro de $\{1, \dots, p - 1\}$: son todos.)`, marca: 'añadido' },
        { texto: R`Luego, si multiplicamos todas estas congruencias se tiene: $a * 2a * 3a * \dots * (p - 1)a \equiv 1 * 2 * 3 * \dots * (p - 1)\ (p)$`, marca: 'corregido' },
        { texto: R`Lo que es lo mismo que: $(p - 1)!\,a^{p-1} \equiv (p - 1)!\ (p)$` },
        { texto: R`Como $p \nmid (p - 1)!$ (es producto de números menores que $p$), se puede cancelar $(p - 1)!$ por el corolario anterior.`, marca: 'añadido' },
        { texto: R`luego $a^{p-1} \equiv 1\ (p)$` },
      ],
      escena: '4/teo-fermat',
    },
  ],
};

libro.elementos = libro.elementos.map((e) => ({ ...e, claves: CLAVES[e.id] }));
export default libro;
