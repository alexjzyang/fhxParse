import fs from "fs";
import yaml from "js-yaml";

// const blockNames = fs.readFileSync(
//     "src/moo-lexer/fixtures/batch-phase-parameters/block-names.json",
//     "utf-8",
// );

// import blocks from "./src/moo-lexer/fixtures/batch-phase-parameters/blocks.js";
// console.log(JSON.parse(blockNames));
// console.log(typeof blocks);
// const yamlInput = fs.readFileSync(
//     "src/moo-lexer/fixtures/batch-phase-parameters/definition-lines.yaml",
//     "utf-8",
// );
// const parsedYaml = yaml.load(yamlInput);
// console.log(typeof parsedYaml[0]);
// console.log(parsedYaml[0]);

const batchPhaseParametersExpectedOutput = fs.readFileSync(
    "src/moo-lexer/fixtures/batch-phase-parameters/expected.yaml",
    "utf-8",
);
const parsedExpectedOutput = yaml.load(batchPhaseParametersExpectedOutput);
console.log(parsedExpectedOutput.blocks[0]);

// testtest
