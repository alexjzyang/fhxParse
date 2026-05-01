import fs from "fs";
import moo from "moo";
import yaml from "js-yaml";
import { MooLexer } from "./moo.js";
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
let blocks = [];
let blockLevel = 0;
let inblock = false;
let indefinition = false;
let block;

for (let token of fhxLexer.lexer) {
    // console.log(token.text);

    if (token.type === "blockkey" && !inblock && blockLevel === 0) {
        block = new Block();

        inblock = true;
        indefinition = true;
        block.key = token.value;
    }

    if (token.type === "block_name" && inblock && indefinition) {
        block.name = token.value;
    }
    if (token.type === "lbrace") {
        blockLevel++;
        indefinition = false;
    }
    if (token.type === "rbrace") {
        blockLevel--;
        if (blockLevel === 0 && indefinition == false) {
            blocks.push(block);
            inblock = false;
        }
    }
    if (inblock) {
        block.construct(token);
        block.fhx += token.text;
    } else {
        // console.log(token);
    }
}

// Code below uses the MooLexer class written in moo.js
let mooLexer = new MooLexer();
let fhxLexer = mooLexer.feed(fhx4);
// let alltokens = fhxLexer.tokenize().filter((token) => token.type !== "_WS");
// console.log(alltokens);
// console.log(alltokens.length);
// let errorTokens = alltokens.filter((token) => token.type === "_error");
// console.log(errorTokens);
// console.log(errorTokens.length);
// element definitions
let definitions = alltokens
    .filter((token) => token.type === "comment")
    .forEach((element) => {
        console.log(element.text);
    });

console.log(blocks.length);
blocks[0].tokens
    .filter((t) => t.type === "_error")
    .forEach((t) => console.log(t));
