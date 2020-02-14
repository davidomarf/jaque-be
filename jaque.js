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

/**
 * Find the longest increasing subarray
 * 
 * From an array, return the longest subarray such that every element
 * is bigger than the previous one.
 * @param {number[]} arr 
 * @return {number[]} Longest subarray
 */
function subarray(arr) {
  let longest = [];
  let temp = [];

  // Walk through the array, starting from the second element,
  // and checking if the current and last elements fulfill the property,
  // holding the current streak in a temporary array that gets compared
  // when it breaks, or at the end of the array.
  for (let i = 1; i < arr.length; i++) {
    // Current and last element fulfill the property
    if (arr[i] > arr[i - 1]) {
      // Add the last element only if current streak is 0
      if (temp.length === 0) {
        temp.push(arr[i - 1]);
      }
      // Add the current element to the list
      temp.push(arr[i]);
    }

    // The streak breaks
    // Either because:
    //    - current element is not bigger than the last one
    //    - it's the last element from the array
    if (arr[i] <= arr[i - 1] || i + 1 === arr.length) {
      // If the streak was bigger than the previously longest streak,
      // update the longest streak
      if (temp.length >= longest.length) {
        longest = [...temp];
      }
      // Empty the temporary array, which holds the streak
      temp = [];
    }
  }
  return longest;
}

module.exports = {
  reverse,
  subarray
};
