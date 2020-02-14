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
