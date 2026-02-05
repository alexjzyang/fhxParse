/**
 * PSEUDOCODE: processSfc.test.js
 *
 * Test Suite: processSFC Small Cases
 *
 * Tests:
 *   1. Parses a simple SFC step/transition
 *      - Input: 'STEP NAME="S1" { } STEP NAME="S2" { } TRANSITION FROM="S1" TO="S2" { }'
 *      - Assert: output is object
 *      - Assert: output.steps array has at least 1 element
 *      - Assert: output.transitions array has 1 element
 *      - Assert: first transition has from="S1", to="S2"
 *
 *   2. Returns object for empty input
 *      - Input: ""
 *      - Assert: output is an object (not null/undefined)
 *
 *   3. Extracts step names correctly
 *      - Input: 'STEP NAME="InitStep" { } STEP NAME="EndStep" { }'
 *      - Assert: steps have names "InitStep" and "EndStep"
 *
 *   4. Handles transitions without steps gracefully
 *      - Input: 'TRANSITION FROM="A" TO="B" { }'
 *      - Assert: output has transitions array
 *
 * ============================================================================
 */

import { expect } from "chai";
import { processSFC } from "../../src/ComponentObjects/SFCProcessing.js";

describe("processSFC small cases", () => {
    it("parses a simple SFC step/transition", () => {
        const sfc = `
      STEP NAME="S1" ID="S1" { }
      STEP NAME="S2" ID="S2" { }
      TRANSITION FROM="S1" TO="S2" NAME="t1" { }
    `;
        const out = processSFC(sfc);
        expect(out).to.be.an("object");
        expect(out.steps).to.be.an("array").with.length.greaterThan(0);
        expect(out.transitions).to.be.an("array").with.lengthOf(1);
        expect(out.transitions[0].from).to.equal("S1");
        expect(out.transitions[0].to).to.equal("S2");
    });

    it("returns an object for empty input", () => {
        const out = processSFC("");
        expect(out).to.be.an("object");
    });

    it("extracts step names correctly", () => {
        const sfc = `
      STEP NAME="InitStep" ID="S1" { }
      STEP NAME="EndStep" ID="S2" { }
    `;
        const out = processSFC(sfc);
        expect(out.steps).to.be.an("array").with.length.greaterThan(0);
        const stepNames = out.steps.map((s) => s.name);
        expect(stepNames).to.include("InitStep");
        expect(stepNames).to.include("EndStep");
    });

    it("handles transitions without matching steps gracefully", () => {
        const sfc = 'TRANSITION FROM="A" TO="B" { }';
        const out = processSFC(sfc);
        expect(out).to.be.an("object");
        expect(out.transitions).to.be.an("array");
    });
});
