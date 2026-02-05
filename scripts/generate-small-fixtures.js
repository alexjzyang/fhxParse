/**
 * PSEUDOCODE: generate-small-fixtures.js
 *
 * Purpose: Generate a library of small, handcrafted FHX snippets for unit tests
 *
 * Define fixtures as array of {name, content}:
 *   - simple_module: 'MODULE_CLASS NAME="X" { }'
 *   - nested_braces: 'MODULE_CLASS NAME="Y" { INNER { KEY="v" } }'
 *   - quoted_param: 'SOMETHING NAME="Name With Spaces" { }'
 *   - missing_name: 'BLOCK { }'
 *   - multiple_blocks: 'MODULE_CLASS NAME="A" { } MODULE_CLASS NAME="B" { }'
 *   - simple_step: 'STEP NAME="S1" ID="S1" { }'
 *   - simple_transition: 'TRANSITION FROM="S1" TO="S2" NAME="t1" { }'
 *   - empty_input: ''
 *
 * main():
 *   - Create fixtures array with each snippet
 *   - Ensure output directory exists: test/fixtures/small/
 *   - For each fixture:
 *     - Write content to test/fixtures/small/<name>.fhx
 *   - Log success message with count
 *
 * ============================================================================
 */
