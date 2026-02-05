/**
 * PSEUDOCODE: sfcGolden.test.js
 *
 * Test Suite: Integration Tests (Golden/Regression + Contracts)
 *
 * Tests:
 *   1. Produces same normalized JSON as golden fixture
 *      - Load A-PROTEIN_PROD.fhx
 *      - Run PhaseLogic + processSFC (all 5 logic types)
 *      - Load golden JSON from test/fixtures/golden/
 *      - Normalize both
 *      - Deep-equal compare
 *      - Assert: match
 *
 *   2. Validates transitions reference existing steps
 *      - Load real FHX
 *      - Extract run_logic via processSFC
 *      - Build set of step IDs/names
 *      - For each transition:
 *        - Assert: from exists in steps
 *        - Assert: to exists in steps
 *
 *   3. All steps have required fields
 *      - Extract steps from processSFC output
 *      - For each step:
 *        - Assert: has id or name
 *
 *   4. All transitions have required fields
 *      - Extract transitions
 *      - For each transition:
 *        - Assert: has from, to, and name
 *
 *   5. No duplicate step IDs
 *      - Extract step IDs
 *      - Assert: set size equals array length
 *
 * ============================================================================
 */

import { expect } from "chai";
import { FileIO } from "../../src/util/FileIO.js";
import { PhaseLogic, processSFC } from "../../src/main.js";
import { normalizeSfc } from "../helpers/normalizeSfc.js";
import fs from "fs/promises";
import path from "path";

describe("Integration: SFC golden and contracts", function () {
    this.timeout(30_000);

    const inputPath = "Applications/SFC-Extraction/inputs/A-PROTEIN_PROD.fhx";
    const goldenPath =
        "Applications/SFC-Extraction/test/fixtures/golden/A-PROTEIN_PROD.expected.json";

    it("produces the same normalized JSON as golden fixture", async () => {
        const fhx = FileIO.readFile(inputPath);
        const phase = new PhaseLogic(fhx, "A-PROTEIN_PROD");

        const result = {
            phaseName: phase.phaseName,
            runLogic: processSFC(phase.run_logic.fhx),
            holdLogic: processSFC(phase.hold_logic.fhx),
            abortLogic: processSFC(phase.abort_logic.fhx),
            restartLogic: processSFC(phase.restart_logic.fhx),
            stopLogic: processSFC(phase.stop_logic.fhx),
        };

        const expectedRaw = await fs.readFile(path.resolve(goldenPath), "utf8");
        const expected = JSON.parse(expectedRaw);

        expect(normalizeSfc(result)).to.deep.equal(normalizeSfc(expected));
    });

    it("validates transitions reference existing steps in run logic", async () => {
        const fhx = FileIO.readFile(inputPath);
        const phase = new PhaseLogic(fhx, "A-PROTEIN_PROD");
        const run = processSFC(phase.run_logic.fhx);

        const stepNames = new Set((run.steps || []).map((s) => s.name || s.id));
        for (const t of run.transitions || []) {
            expect(
                stepNames.has(t.from),
                `Transition references unknown step: ${t.from}`,
            ).to.be.true;
            expect(
                stepNames.has(t.to),
                `Transition references unknown step: ${t.to}`,
            ).to.be.true;
        }
    });

    it("all steps have required fields", async () => {
        const fhx = FileIO.readFile(inputPath);
        const phase = new PhaseLogic(fhx, "A-PROTEIN_PROD");
        const run = processSFC(phase.run_logic.fhx);

        for (const step of run.steps || []) {
            expect(step.id || step.name, "Step missing id and name").to.exist;
        }
    });

    it("all transitions have required fields", async () => {
        const fhx = FileIO.readFile(inputPath);
        const phase = new PhaseLogic(fhx, "A-PROTEIN_PROD");
        const run = processSFC(phase.run_logic.fhx);

        for (const t of run.transitions || []) {
            expect(t.from, "Transition missing from").to.exist;
            expect(t.to, "Transition missing to").to.exist;
        }
    });

    it("no duplicate step IDs", async () => {
        const fhx = FileIO.readFile(inputPath);
        const phase = new PhaseLogic(fhx, "A-PROTEIN_PROD");
        const run = processSFC(phase.run_logic.fhx);

        const ids = (run.steps || []).map((s) => s.id || s.name);
        const uniqueIds = new Set(ids);
        expect(uniqueIds.size, "Duplicate step IDs found").to.equal(ids.length);
    });
});
