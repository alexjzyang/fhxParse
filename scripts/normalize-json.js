/**
 * PSEUDOCODE: normalize-json.js
 *
 * Purpose: CLI tool to normalize a JSON file for debugging/diffs
 *
 * main():
 *   - Get input file path from command line args[2]
 *   - Get output file path from command line args[3] (optional)
 *   - If no input file, print usage and exit
 *   - Read input JSON file
 *   - Parse JSON
 *   - Apply normalizeSfc() function
 *   - If output file specified:
 *     - Write normalized JSON to output file
 *   - Else:
 *     - Write normalized JSON to stdout
 *   - Log completion to stderr
 *
 * Usage:
 *   node scripts/normalize-json.js input.json output.json
 *   node scripts/normalize-json.js input.json > output.json
 *
 * ============================================================================
 */
