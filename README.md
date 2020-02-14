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