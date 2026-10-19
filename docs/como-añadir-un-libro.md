# Cómo añadir un libro (otra conferencia o una clase práctica)

El motor, la portada, la página de elemento y las piezas de dibujo son comunes. Un libro nuevo solo necesita
**contenido** y **escenas**.

## 1. Registrar el libro

En `libros/catalogo.js`, pon `disponible: true` en su entrada (o añade una nueva con `numero`, `romano`,
`titulo`, `color` ∈ cian · ciruela · ambar · verde · violeta, e `ilustracion`, un SVG de 120×50).

## 2. Contenido: `libros/<n>/contenido.js`

```js
const R = String.raw;              // para escribir LaTeX sin duplicar barras
export default {
  numero: 1, romano: 'I', titulo: '…', color: 'cian', conferencia: 'Conferencia 1 · 9 de septiembre de 2025',
  elementos: [
    {
      id: 'teo-algo', tipo: 'TEO',              // DEF · LEMA · TEO · COR · PROP · EJ · MET
      nombre: R`…`, enunciado: R`…`,            // texto LITERAL de la conferencia; $…$ y $$…$$ para fórmulas
      marcaEnunciado: 'corregido',              // solo si se corrigió una errata
      explicacion: R`…`,                        // en lenguaje llano, con el idioma de los saltos
      pasosAñadidos: 'demostracion',            // 'idea' | 'demostracion' si TODOS los pasos son añadidos
      pasos: [{ texto: R`…` }, { texto: R`…`, marca: 'añadido' }],
      escena: '1/teo-algo',
    },
  ],
};
```

Reglas: transcribir mirando el PDF renderizado (`pdftoppm -r 110 -png fuentes/MD-I-Conf-0N.pdf …`), no el
texto extraído. Dentro de `$…$` usa `\lt` y `\gt`, nunca `<` pegado a una letra. Las macros `\mcd`, `\mcm` y `\Z`
están en `motor/macros.js` (añade ahí las que hagan falta).

## 3. Escenas: `escenas/<n>/<id>.js`

Una escena por elemento, con `escenaPorCapas` (en `escenas/comun.js`): **una capa por paso**. Lo de pasos
anteriores se queda dibujado, y si una capa vuelve a emitir una clave existente, la sustituye (sirve para
recolorear un resultado en verde).

```js
import { escenaPorCapas, planPara, carril, rotulo, nota, ANCHO } from '../comun.js';
import { recta, punto } from '../primitivas.js';

export default escenaPorCapas({
  entradas: [{ id: 'a', etiqueta: 'a', valor: 12, min: 1, max: 120 }],  // lista: { min: 2, max: 4 } para n números
  validar: ({ a }) => null,                    // mensaje si las entradas no cumplen las hipótesis
  preparar: ({ a }) => ({ p: planPara([a]) }), // cálculos compartidos por las capas
  alto: 240,                                   // número o función del contexto
  base: ({ p }) => recta('eje', p, 180),       // lo que está siempre
  capas: [ /* una función ctx → Nodo[] por paso, tantas como pasos tenga el elemento */ ],
});
```

Piezas disponibles:

| Dónde | Qué |
|---|---|
| `escenas/primitivas.js` | `recta`, `saltos` (negativos hacia la izquierda; agrupa si no caben), `punto`, `llave`, `cuadricula` (con su unidad), `reglasDobles` (cambio de escala) |
| `escenas/comun.js` | `escenaPorCapas`, `planPara`, `carril` (fila de saltos con etiqueta), `nota` (pizarra de resultados), `rotulo`, `linea`, `filas`, `num`, `por`, `nSaltos` |
| `escenas/piezas/` | `euclides.js` (divisiones apiladas), `coeficientes.js` (tabla Aᵢ, Bᵢ), `multiplos.js` (dos saltadores y coincidencias) |
| `motor/aritmetica.js` | `division`, `mcd`, `mcm`, `divisores`, `euclides`, `coeficientes`, `combinacionMcd`, `diofantica` |

Colores con significado: saltos y divisores en **cian**, número objetivo en **ciruela**, resto en **ámbar**,
conjuntos auxiliares en **violeta** y conclusión en **verde**. Un movimiento por paso; los números que use el
texto del paso tienen que estar escritos en el dibujo.

## 4. Comprobar

```sh
node --test 'tests/*.test.mjs'      # incluye el test genérico de TODAS las escenas de todos los libros
tests/navegador.sh                  # recorre cada paso de cada libro en Chromium sin ventana
herramientas/ver.sh 'elemento.html?l=1&e=teo-algo' salida.png 3   # render de un paso para revisarlo
```

El test genérico (`tests/escenas.test.mjs`) comprueba en cada escena, con valores por defecto y aleatorios,
que haya una capa por paso, que las claves no se repitan, que la escena sea determinista y que todo quepa en
la vista. El recorrido de navegador comprueba que no haya errores, que KaTeX no falle y que al volver atrás
la escena quede igual que al principio.
