/**
 * PSEUDOCODE: compare-golden.js
 *
 * Purpose: Compare current app output against golden fixture (regression check)
 *
 * main():
 *   - Define inputPath = "Applications/SFC-Extraction/inputs/A-PROTEIN_PROD.fhx"
 *   - Define goldenPath = "Applications/SFC-Extraction/test/fixtures/golden/A-PROTEIN_PROD.expected.json"
 *   - Load inputFhx using FileIO.readFile(inputPath)
 *   - Create PhaseLogic and processSFC (same as app.js)
 *   - Build phaseSfcJson object
 *   - Load golden JSON from goldenPath
 *   - Normalize both result and golden using normalizeSfc()
 *   - Use deep-equal to compare normalized objects
 *   - If match:
 *     - Log "✓ PASS: Golden fixture matches"
 *     - Exit with code 0
 *   - Else:
 *     - Log "✗ MISMATCH: Output differs from golden"
 *     - Print summary of differences (field names, array lengths)
 *     - Exit with code 1
 *
 * ============================================================================
 */
