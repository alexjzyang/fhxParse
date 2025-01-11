/**
 * Adds two numbers.
 * @param {number} a - The first number.
 * @param {number} b - The second number.
 * @returns {number} The sum of the two numbers.
 */
/**
 * Concatenates two strings.
 * @param {string} a - The first string.
 * @param {string} b - The second string.
 * @returns {string} The concatenated string.
 */
function add(a, b) {
  if (typeof a !== typeof b) {
    throw new TypeError("Both arguments must be of the same type.");
  }

  return a + b;
}

add();
