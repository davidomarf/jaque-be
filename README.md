# Prueba Jaque BED

## Cómo iniciar

- Clonar el repositorio,
- Ejecutar tests con `npm test`

## Contenido

1. [Reversa](reversa)
1. [Subconjuntos](subconjuntos)
1. [Duplicados](duplicados)
1. [Suma de rangos](suma-de-rangos)
1. [Gestor de citas](gestor-de-citas)

## Reversa

Primero pensé en reemplazar los caracteres in-place:

En cadena con longitud `n`, par o impar, recorrer hasta la mitad de la
palabra, intercambiando
`i` por `n - i`:

```js
for (let i = 0, n = str.length, mitad = floor(n / 2); i < n; i++) {
  let temp = str[i];
  str[i] = str[n - 1 - i];
  str[n - 1 - i] = temp;
}
```

Pero en JS, las cadenas son inmutables, así que preferí crear una cadena
auxiliar a la que se le añadieran los caracteres de la cadena original, en
sentido contrario.

### Complejidad

Espacio: `O(n)`, se crea una nueva cadena de la misma longitud que la
original, teniendo `~2n` elementos en memoria.

Tiempo: `O(n)`, insertar cada caracter tiene un número constante de pasos,
y se tienen que insertar `n` caracteres.

## Subconjuntos

La primera implementación que consideré consiste en:

1. Crear un objeto `subarray` con propiedades `{elements: [], size: 0}`.
2. Recorrer el arreglo recibido `arr`, añadiendo cada elemento a un arreglo
   temporal `temp` hasta que se rompa la condición (`a[i + 1] <= a [i]`).
   - Si la longitud del arreglo temporal `temp` es mayor que `subarray.size`:
     - Actualizar `subarray` con nuevos elementos y tamaño.
   - Continuar recorriendo el arreglo `arr`.

Con un arreglo vacío, `subarray` sería `{elements: [], size: 0}`.
Con un arreglo sin subconjuntos que cumplan con la condición,
`subarray` sería `{elements: [], size: 0}`.

---

La implementación final se conservó, excepto que `subarray` es un arreglo y
no un objeto.

---

Añadí dos consideraciones:

- Los subarreglos devueltos deben tener como mínimo, 2 elementos. Subarreglos
  con un solo elemento no se consideran.
- Cuando se encuentran subarreglos de la misma longitud, se devuelve el último
  encontrado.

### Complejidad

Espacio: `O(n)`, se ocupa un arreglo auxiliar cuyo tamaño `m` es `m <= n`.

Tiempo: `O(n)`, se copian en el peor de los casos, `n/m` arreglos auxiliares,
cada uno de `m` elementos. La complejidad sigue creciendo linealmente => `O(n)`

## Duplicados

Las dos ideas que aparecieron primero en mi mente:

- **Eliminar** los elementos en el arreglo original, cada que se encuentre un
  elemento igual al anterior, o
- Crear un arreglo **auxiliar** que no contenga los duplicados.

Y después recordé haber usado `Set()`, que automáticamente crea conjuntos
(sin duplicados) de un arreglo. Consideré usar alguna de las otras dos ideas,
para evitar usar las funciones nativas del lenguaje.

---

Considerando los casos extremos (`0` duplicados, `n` duplicados), concluí que:

- `0` duplicados. Resulta más eficiente checar que no hay duplicados
  (cosa que pasaría al **eliminar** duplicados), que copiar el arreglo entero
  a un **auxiliar**
- `n` duplicados. Resulta más costoso eliminar `n-1` elementos de un arreglo,
  que "ignorar" o "no-pushear" `n-1` elementos a un arreglo **auxiliar**.

De todos modos preferí utilizar la idea del arreglo auxiliar.

Parae liminar elementos, habría usado `[].splice(i, k)`, que dependiendo de la
implementación, puede tener diferentes complejidades de tiempo.

Pero después tendría que manejar las situaciones en las que hay duplicados, y
se tendría que actualizar el valor de longitud del arreglo. Y creo que volvería
a la función más vulnerable a bugs lógicos.

### Complejidad

Espacio: `O(n)`. En el peor de los casos, hay 2 arreglos de tamaño `n`, `2n`,
que sigue creciendo linealmente: `O(n)`.

Tiempo: `O(n)`.

## Suma de rangos

La primer opción fue sumar elementos dentro de un `for` con un i de `n` a `m`,
pero después encontré la expresión que devuelve el valor correcto:

`m(m+1) / 2 - n(n-1) / 2`.

Elaboro:

Asumiendo que `n < m`,
la suma de todos los números naturales `i` tal que `n <= i<= m` puede obtenerse
sumando todos los números naturales `i <= m`, y restando la suma de todos los
números naturales `i <= n - 1`.
(De considerarse hasta `i<= n`, se restaría un `n` de más, empezando la suma
en `n+1`, no en `n`)
Ambas sumas pueden obtenerse con la fórmula de los
[números triangulares](https://en.m.wikipedia.org/wiki/Triangular_number).

La suma de números `i <= m` se obtiene con `m (m+1) / 2`,
la suma de números `i <= n - 1` se obtiene con `n(n-1) / 2`

Por lo tanto, la suma de números `i` tal que `n <= i<= m` se obtiene con
`m(m+1) / 2 - n(n-1) / 2`.

### Complejidad

Espacio: `O(1)`

Tiempo: `O(1)`

Aunque dependiendo de las implementaciones de los algoritmos de multiplicación
del intérprete, las complejidades de tiempo y espacio no son constantes, para
términos prácticos se puede escribir como constante.

---

## Gestor de citas

Por mucho, el que más complicado encontré.

Debo decir que lo más difícil fue el decidir el nivel apropiado de complejidad
para el sistema:

- Consideré en momentos añadir los métodos necesarios para agendar, atender, o
  cancelar citas.
- El funcionamiento necesario para que no sólo se reporte la hora disponible,
  sino también los empleados con el que se puede agendar cada cita.
- Añadir horarios para comida a los empleados.
- La internacionalización de las funciones que lidian con fechas, independientes
  de si localmente la semana inicia en domingo o en lunes. O si la zona horaria
  provoca desbordamiento de días al convertir a ISO (que un 31 de octubre, al
  ser convertido en ISO, termine siendo 1 de Noviembre, por ejemplo).

Asumí que me tomaría poco tiempo. Y así fue una vez que elegí, y me comprometí,
con un nivel de complejidad. Pero el estar corrigiendo, añadiendo, y eliminando
propiedades, métodos, y funciones, me tomó mucho más tiempo del esperado.

Decidí que el sistema debería de hacer lo que el problema pide, y no más. Aún
cuando el haberlo hecho de otra forma, habría facilitado el mantenimiento o
extensibilidad.

Creo que está bien equilibrado.

---

En `getAvailableAppointments`, justo antes de filtrar el objeto devuelto
`available`, `calendar` contiene información que podría ser más útil, y que
sería más eficiente en un entorno real.

Por ejemplo,

- `available`, sólo registra qué horarios están disponibles.
- `calendar`, registra cuántas citas posibles hay para cada horario.

Si se calcula el número disponible de citas al final del mes, es más útil:

- Usar `calendar` y actualizar sólo ese objecto despueś de cada nueva cita
  agendada (asumiendo que no hay cambios en la plantilla de empleados), que
- Usar `available` y tener que re-calcularlo por cada cita agendada (por no saber
  si aún hay citas disponibles para ese mismo horario, con otro empleado).

---

Las clases de `Employee` y `Appointment` tienen mucha menos información y
funcionalidad de la necesaria, pero decidí dejarlos en paz y que funcionen
para resolver el problema dado.

### Destacamientos

Partes de la solución que más me gustaron incluyen:

- Obtener los horarios disponibles sólo para una semana, y repetirlos de
  acuerdo al día, en lugar de tener que obtenerlos para cada día del mes.
- El llevar rastro de cuántas citas se pueden agendar para cada horario.

### Complejidad

En un problema donde `n` es el número de empleados y `m` el número de citas
agendadas,

- **Tiempo: `O(n + m)`.**
  Durante la ejecución, se itera sobre `n` ~7 veces. Y cada una de ellas genera
  iteraciones en función del horario `h` del empleado, que también es lineal y
  tiene un valor máximo de 48 (2 por cada hora del día, 1 cada media hora).
  Itera sobre `m` sólo una vez.
  A pesar de que mi solución es lineal (y que no considero que exista una solución
  con complejidad más eficiente que la lineal), tiene lugares para optimización.
  Por ejemplo:

  - Podría crearse un diccionario para memoizar la conversión de horas "HH:MM" a
    enteros en formato militar, y viceversa, para evitar calcularlo para
    **cada media hora** por **cada horario diario** de **cada empleado**.

- **Espacio: `O(n + m)`.**

---

Hay partes vulnerables del código, la más importante siendo que se pueden
obtener fechas erróneas al convertir a ISO dependiendo del huso horario.
