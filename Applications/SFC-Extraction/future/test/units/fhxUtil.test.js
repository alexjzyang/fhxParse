/**
 * PSEUDOCODE: fhxUtil.test.js
 *
 * Test Suite: FhxUtil Primitives
 *
 * Tests:
 *   1. Extracts a MODULE_CLASS block with nested braces
 *      - Input: 'MODULE_CLASS NAME="X" { INNER { KEY="v" } }'
 *      - Assert: findBlocks returns array with 1 element
 *      - Assert: valueOfParameter(block, "NAME") === "X"
 *
 *   2. Handles missing parameter gracefully
 *      - Input: 'FUNCTION_BLOCK { }'
 *      - Assert: valueOfParameter returns undefined
 *
 *   3. Handles quoted values with spaces
 *      - Input: 'SOMETHING NAME="Complex Name" { }'
 *      - Assert: valueOfParameter returns "Complex Name"
 *
 *   4. Extracts multiple blocks of same type
 *      - Input: 'MODULE_CLASS NAME="A" { } MODULE_CLASS NAME="B" { }'
 *      - Assert: findBlocks returns array with 2 elements
 *
 *   5. Returns empty array for non-existent block type
 *      - Input: 'MODULE_CLASS NAME="X" { }'
 *      - Assert: findBlocks(input, "NONEXISTENT") returns []
 *
 * ============================================================================
 */

import { expect } from "chai";
import FhxUtil from "../../src/util/FhxUtil.js";

describe("FhxUtil primitives", () => {
    it("extracts a MODULE_CLASS block with nested braces", () => {
        const fhx = 'MODULE_CLASS NAME="X" { INNER { KEY="v" } }';
        const blocks = FhxUtil.findBlocks(fhx, "MODULE_CLASS");
        expect(blocks).to.be.an("array").with.lengthOf(1);
        expect(FhxUtil.valueOfParameter(blocks[0], "NAME")).to.equal("X");
    });

    it("handles missing parameter gracefully", () => {
        const fhx = "FUNCTION_BLOCK { }";
        const blocks = FhxUtil.findBlocks(fhx, "FUNCTION_BLOCK");
        expect(blocks).to.be.an("array").with.lengthOf(1);
        expect(FhxUtil.valueOfParameter(blocks[0], "NAME")).to.be.undefined;
    });

    it("handles quoted values with spaces", () => {
        const fhx = 'SOMETHING NAME="Complex Name" { }';
        const blocks = FhxUtil.findBlocks(fhx, "SOMETHING");
        expect(FhxUtil.valueOfParameter(blocks[0], "NAME")).to.equal(
            "Complex Name",
        );
    });

    it("extracts multiple blocks of same type", () => {
        const fhx = 'MODULE_CLASS NAME="A" { } MODULE_CLASS NAME="B" { }';
        const blocks = FhxUtil.findBlocks(fhx, "MODULE_CLASS");
        expect(blocks).to.have.lengthOf(2);
        expect(FhxUtil.valueOfParameter(blocks[0], "NAME")).to.equal("A");
        expect(FhxUtil.valueOfParameter(blocks[1], "NAME")).to.equal("B");
    });

    it("returns empty array for non-existent block type", () => {
        const fhx = 'MODULE_CLASS NAME="X" { }';
        const blocks = FhxUtil.findBlocks(fhx, "NONEXISTENT");
        expect(blocks).to.be.an("array").with.lengthOf(0);
    });
});
