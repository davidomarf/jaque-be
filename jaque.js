/**
 * Reverses a string
 * @param {string} str  String to be reversed
 * @return {string} Reversed string
 */
function reverse(str) {
  let reversed = "";
  // Walk the characters in the string from last to first and
  // append each one to the end of an empty string.

  // "" | "word" <- Start from the end
  // "[d]" | "wor[d]"
  // "d[r]" | "wo[r]d"
  // "dr[o]" | "w[o]rd"
  // "dro[w]" | "[w]ord"
  // "drow" | "word"
  // No characters left -> String is reversed

  for (let i = str.length - 1; i >= 0; i--) {
    reversed += str[i];
  }
  return reversed;
}

module.exports = {
  reverse
};
