import fs from "fs";
import moo from "moo";
import yaml from "js-yaml";
import { MooLexer } from "./moo.js";
import { log } from "console";

const inputPath = "./fixtures/batch-phase-parameters/input.txt";
const fhx = fs.readFileSync(inputPath, "utf-8");
const inputPath2 = "./fixtures/attribute-instances/input.txt";
const fhx2 = fs.readFileSync(inputPath2, "utf-8");
const inputPath3 =
    "../../FHX-Files/Cytiva_Muskegon/original/_PR_DOWNSTREAM_Y.txt";
const fhx3 = fs.readFileSync(inputPath3, "utf-8");

// console.log(fhx3);

// let lexer = moo.compile({
//     _blockkey: ["BATCH_PHASE_PARAMETER", "BATCH_RECIPE"],

//     // catches NAME="STRING" and extracts STRING
//     _block_name: { match: /NAME="(?:[^"]*)"/, value: (s) => s.slice(5, -1) },

//     // catches PROPERTY=VALUE, e.g., TYPE=UNICODE_STRING
//     _property: {
//         match: /[A-Z_]+=[A-Z_]+/,
//         value: (s) => {
//             let [property, value] = s.split("=");
//             return { property, value };
//         },
//     },
//     _parameter_string: {
//         match: /[A-Z_]+="(?:[^"]*)"/,
//         value: (s) => {
//             let [parameter, value] = s.split("=");
//             return { parameter, value: value.slice(1, -1) };
//         },
//     },
//     _parameter_numeric: {
//         match: /[A-Z_]+=[0-9]+/,
//         value: (s) => {
//             let [parameter, value] = s.split("=");
//             return { parameter, value: Number(value) };
//         },
//     },
//     keyword: /[A-Z_]+/, // catches NAME, TYPE, DIRECTION, etc.
//     equals: "=",
//     quoted: /"(?:[^"]*)"/, // catches "R_MESSAGE_2"
//     unquoted: /[A-Z_]+/, // catches UNICODE_STRING, INPUT, etc.
//     WS: { match: /\s+/, lineBreaks: true },
//     lbrace: "{",
//     rbrace: "}",
//     errors: moo.error,
// });

// // Loading fhx into lexer
// lexer.reset(fhx2);

// // print tokens
// // for (let token of lexer) {
// //     console.log(token);
// // }

// Code below uses the MooLexer class written in moo.js
let mooLexer = new MooLexer();
let fhxLexer = mooLexer.feed(fhx3);

// let alltokens = fhxLexer.tokenize().filter((token) => token.type !== "_WS");
// console.log(alltokens);
// console.log(alltokens.length);

// for (let token of fhxLexer) {
//     console.log(token);
//     console.log(token.text);
// }

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
let tokens = [];
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
console.log(blocks.length);
blocks[2].tokens
    .filter((t) => t.type !== "_WS")
    .forEach((t) => console.log(t.toString()));
