import { expect } from "chai";
import { describe, it, before, after } from "mocha";
import fs from "fs";
import yaml from "js-yaml";

// Import the module to test, e.g., import { MooLexer } from './moo.js';

describe("MooLexer", () => {
    let lexer;

    const batchPhaseParametersInput = fs.readFileSync(
        "./src/moo-lexer/fixtures/batch-phase-parameters/input.txt",
        "utf-8",
    );

    const batchPhaseParametersExpectedOutput = yaml.load(
        fs.readFileSync(
            "./src/moo-lexer/fixtures/batch-phase-parameters/expected.yaml",
            "utf-8",
        ),
    );

    const attributeInstancesInputs = fs.readFileSync(
        "./src/moo-lexer/fixtures/attribute-instances/input.txt",
        "utf-8",
    );
    const attributeInstancesExpectedOutput = yaml.load(
        fs.readFileSync(
            "./src/moo-lexer/fixtures/attribute-instances/expected.yaml",
            "utf-8",
        ),
    );

    before(() => {
        // Setup code, e.g., initialize lexer or read test datatell me more about fixtures
        // lexer = new MooLexer();
    });

    after(() => {
        // Cleanup code, e.g., remove temp files if any
    });

    describe("#tokenize()", () => {
        it("should find fhx block definition lines", () => {
            expect(/**/).to.deep.equal(
                batchPhaseParametersExpectedOutput.definition_lines,
            );
        });
        it("should find the names of the blocks", () => {
            expect(/**/).to.deep.equal(
                batchPhaseParametersExpectedOutput.block_names,
            );
        });
        it("should find the blocks", () => {
            expect(/**/).to.deep.equal(
                batchPhaseParametersExpectedOutput.blocks,
            );
        });
        it("should find nested blocks", () => {
            expect(/**/).to.deep.equal(
                attributeInstancesExpectedOutput.nested_blocks,
            );
        });
        // Add more describe blocks for other methods or features
    });
});
