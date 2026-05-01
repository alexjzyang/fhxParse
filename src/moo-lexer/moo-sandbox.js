import fs from "fs";
import moo from "moo";
import yaml from "js-yaml";
import { fhxLexer } from "./moo.js";
// loading fhx files
const inputPath = "./fixtures/batch-phase-parameters/input.txt";
const fhx = fs.readFileSync(inputPath, "utf-8");
const inputPath2 = "./fixtures/attribute-instances/input.txt";
const fhx2 = fs.readFileSync(inputPath2, "utf-8");
const inputPath3 =
    "../../FHX-Files/Cytiva_Muskegon/original/_PR_DOWNSTREAM_Y.txt";
const fhx3 = fs.readFileSync(inputPath3, "utf-8");
const inputPath4 =
    "../../FHX-Files/Cytiva_Muskegon/original/_PH_UF_XFER_IN.txt";
const fhx4 = fs.readFileSync(inputPath4, "utf-8");

const testFhx = fs.readFileSync(
    "./fixtures/atomic-tokens/simple-block.txt",
    "utf-8",
);

const expectedTokens = yaml.load(
    fs.readFileSync("./fixtures/atomic-tokens/expected.yaml", "utf-8"),
);

console.log(typeof expectedTokens.number[0]);
