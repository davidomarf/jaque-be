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

### Complejidad

Espacio: `O(n)`, se ocupa un arreglo auxiliar cuyo tamaño `m` es `m <= n`.

Tiempo: `O(n)`, se copian en el peor de los casos, `n/m` arreglos auxiliares,
cada uno de `m` elementos. La complejidad sigue creciendo linealmente => `O(n)`
