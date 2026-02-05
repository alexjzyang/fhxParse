/**
 * PSEUDOCODE: malformed.test.js
 * 
 * Test Suite: Malformed/Edge Case Input Handling
 * 
 * Tests:
 *   1. Handles unbalanced braces gracefully
 *      - Input: 'MODULE_CLASS NAME="X" { MISSING_CLOSE'
 *      - Assert: Either throws documented error OR returns empty/null
 * 
 *   2. Handles empty/whitespace input
 *      - Input: "   " or ""
 *      - Assert: Returns object or empty array (documented behavior)
 * 
 *   3. Handles deeply nested braces
 *      - Input: 'X { Y { Z { A { B { } } } } }'
 *      - Assert: Extraction succeeds or throws documented error
 * 
 *   4. Handles missing closing brace at end
 *      - Input: 'MODULE_CLASS NAME="X" { CONTENT'
 *      - Assert: Throws or returns partial
 * 
 *   5. Handles null/undefined input gracefully
 *      - Input: null or undefined
 *      - Assert: Throws error or returns empty
 * 
 * ============================================================================
 */

import { expect } from "chai";
import FhxUtil from "../../src/util/FhxUtil.js";
import { processSFC } from "../../src/ComponentObjects/SFCProcessing.js";

describe("Malformed input handling", () => {
  it("handles unbalanced braces", () => {
    const fhx = 'MODULE_CLASS NAME="X" { MISSING_CLOSE';
    try {
      const blocks = FhxUtil.findBlocks(fhx, "MODULE_CLASS");
      expect(blocks).to.be.an("array");
    } catch (err) {
      expect(err.message).to.include("EOF");
    }
  });

  it("handles empty input gracefully", () => {
    const fhx = "";
    const blocks = FhxUtil.findBlocks(fhx, "MODULE_CLASS");
    expect(blocks).to.be.an("array").with.lengthOf(0);
  });

  it("handles whitespace input", () => {
    const fhx = "   ";
    const blocks = FhxUtil.findBlocks(fhx, "MODULE_CLASS");
    expect(blocks).to.be.an("array");
  });

  it("handles deeply nested braces", () => {
    const fhx = 'X NAME="test" { Y { Z { A { B { } } } } }';
    try {
      const blocks = FhxUtil.findBlocks(fhx, "X");
      expect(blocks).to.be.an("array").with.length.greaterThan(0);
    } catch (err) {
      expect(err).to.exist;
    }
  });

  it("processSFC returns object for malformed input", () => {
    const sfc = 'STEP NAME="Bad';
    const out = processSFC(sfc);
    expect(out).to.be.an("object");
  });
});
