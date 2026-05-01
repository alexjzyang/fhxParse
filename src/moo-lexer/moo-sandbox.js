import fs from "fs";
import moo from "moo";
import yaml from "js-yaml";
import { fhxBlockTokens, MooLexer } from "./moo.js";
import { log } from "console";
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

// Below is a quick and dirty way to identify blocks
class Block {
    constructor(blockkey = "", blockname = "") {
        this.key = blockkey;
        this.name = blockname;
        this.fhx = "";
        this.tokens = [];
    }
    construct(token) {
        this.tokens.push(token);
    }
}

let mooLexer = new MooLexer();
let fhxLexer = mooLexer.feed(fhx);

let allTokens = [...fhxLexer].filter((token) => token.type !== "_WS"); // filter out whitespace tokens
// console.log(allTokens);

let definitionTokens = allTokens.filter((token) => token.type === "definition");
console.log(definitionTokens.map((token) => token.value));

let errorTokens = allTokens.filter((token) => token.type === "_errors");
console.log(errorTokens.length == 0 ? "No error tokens" : errorTokens.length);
