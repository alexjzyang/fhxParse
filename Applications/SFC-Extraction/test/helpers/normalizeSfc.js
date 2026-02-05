/**
 * PSEUDOCODE: normalizeSfc.js
 * 
 * Purpose: Make SFC JSON deterministic for test comparisons
 * 
 * removeVolatile(obj):
 *   - Recursively traverse object
 *   - Skip volatile keys: _generatedId, timestamp, createdAt, updatedAt, __v
 *   - If obj is an array, map each element through removeVolatile
 *   - If obj is object, create new object excluding volatile keys
 *   - Return cleaned object
 * 
 * sortArrayByKey(arr, keyCandidates):
 *   - Given array and list of key names to try (e.g., ["id", "name"])
 *   - Sort array by first matching key that exists
 *   - Return sorted copy (don't mutate original)
 * 
 * normalizeSfc(obj):
 *   - Deep clone input object
 *   - For each logic block key (runLogic, holdLogic, abortLogic, restartLogic, stopLogic):
 *     - If logic.steps exists and is array:
 *       - Sort by id, then name
 *     - If logic.transitions exists and is array:
 *       - Sort by (from + "::" + to + "::" + name)
 *   - Generic: sort top-level steps[] and transitions[]
 *   - Apply removeVolatile to final object
 *   - Return normalized object
 * 
 * ============================================================================
 * IMPLEMENTATIONS BELOW
 * ============================================================================
 */

/**
 * Remove volatile fields that should not affect test comparisons
 * @param {any} obj - Object or primitive to clean
 * @returns {any} - Cleaned object with volatile keys removed
 */
export function removeVolatile(obj) {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj !== "object") return obj;

  if (Array.isArray(obj)) {
    return obj.map((item) => removeVolatile(item));
  }

  const volatileKeys = new Set([
    "_generatedId",
    "timestamp",
    "createdAt",
    "updatedAt",
    "__v",
    "_id",
  ]);

  const cleaned = {};
  for (const [key, value] of Object.entries(obj)) {
    if (!volatileKeys.has(key)) {
      cleaned[key] = removeVolatile(value);
    }
  }
  return cleaned;
}

/**
 * Sort an array by one of multiple candidate keys
 * @param {Array} arr - Array of objects
 * @param {Array<string>} keyCandidates - Keys to try in order (default: ["id", "name"])
 * @returns {Array} - Sorted copy of array
 */
function sortArrayByKey(arr, keyCandidates = ["id", "name"]) {
  if (!Array.isArray(arr)) return arr;

  return arr.slice().sort((a, b) => {
    for (const keyName of keyCandidates) {
      const aVal = a?.[keyName] ?? "";
      const bVal = b?.[keyName] ?? "";
      if (aVal !== bVal) {
        return String(aVal).localeCompare(String(bVal));
      }
    }
    return 0;
  });
}

/**
 * Normalize SFC JSON for deterministic test comparisons
 * - Sorts arrays (steps, transitions)
 * - Removes volatile fields (timestamps, generated IDs)
 * - Handles nested logic blocks (runLogic, holdLogic, etc.)
 * @param {object} obj - SFC JSON object to normalize
 * @returns {object} - Normalized object
 */
export function normalizeSfc(obj) {
  if (!obj || typeof obj !== "object") return obj;

  // Deep clone to avoid mutating input
  const copy = JSON.parse(JSON.stringify(obj));

  // Normalize each logic block (runLogic, holdLogic, abortLogic, restartLogic, stopLogic)
  const logicKeys = [
    "runLogic",
    "holdLogic",
    "abortLogic",
    "restartLogic",
    "stopLogic",
  ];
  for (const logicKey of logicKeys) {
    const logic = copy[logicKey];
    if (!logic || typeof logic !== "object") continue;

    // Sort steps array
    if (Array.isArray(logic.steps)) {
      logic.steps = sortArrayByKey(logic.steps, ["id", "name"]);
    }

    // Sort transitions array by (from + to + name)
    if (Array.isArray(logic.transitions)) {
      logic.transitions = logic.transitions.slice().sort((a, b) => {
        const leftKey = `${a.from || ""}::${a.to || ""}::${a.name || ""}`;
        const rightKey = `${b.from || ""}::${b.to || ""}::${b.name || ""}`;
        return leftKey.localeCompare(rightKey);
      });
    }
  }

  // Also sort top-level steps and transitions if they exist
  if (Array.isArray(copy.steps)) {
    copy.steps = sortArrayByKey(copy.steps, ["id", "name"]);
  }
  if (Array.isArray(copy.transitions)) {
    copy.transitions = copy.transitions.slice().sort((a, b) => {
      const leftKey = `${a.from || ""}::${a.to || ""}::${a.name || ""}`;
      const rightKey = `${b.from || ""}::${b.to || ""}::${b.name || ""}`;
      return leftKey.localeCompare(rightKey);
    });
  }

  // Remove volatile fields
  return removeVolatile(copy);
}

export default { removeVolatile, normalizeSfc };
