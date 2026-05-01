import moo from "moo";

// class MooLexer {
//     // create an instance of the lexer with fhx keywords and patterns
//     constructor(text) {
//         this.lexer = moo.compile({
//             // Need to make sure to handle EXPRESSIONS //
//             comment: /\/\*[\s\S]*?\*\//, // catches /* ... */ comments, including multiline
//             _keyword: /[A-Z_a-z_]+/, // catches NAME, TYPE, DIRECTION, etc.
//             _equals: "=",
//             _quoted: /"(?:[^"]*)"/, // catches "R_MESSAGE_2"
//             _unquoted: /[A-Z_a-z_]+/, // catches UNICODE_STRING, INPUT, etc.
//             _number: /-?[0-9]+\.?[0-9]*/, // catches numbers, including negative and decimal numbers
//             _WS: { match: /\s+/, lineBreaks: true },
//             lbrace: "{",
//             rbrace: "}",
//             _errors: moo.error,
//         });
//         this.lexer.reset(text);
//     }
//     lexer() {
//         return this.lexer;
//     }
//     tokenize() {
//         return [...this.lexer];
//     }
// }

// I'm totally overengineering this
function fhxLexer(text) {
    return moo
        .compile({
            // Need to make sure to handle EXPRESSIONS //
            comment: /\/\*[\s\S]*?\*\//, // catches /* ... */ comments, including multiline
            _keyword: /[A-Z_a-z_]+/, // catches NAME, TYPE, DIRECTION, etc.
            _equals: "=",
            _quoted: /"(?:[^"]*)"/, // catches "R_MESSAGE_2"
            _unquoted: /[A-Z_a-z_]+/, // catches UNICODE_STRING, INPUT, etc.
            _number: /-?[0-9]+\.?[0-9]*/, // catches numbers, including negative and decimal numbers
            _WS: { match: /\s+/, lineBreaks: true },
            lbrace: "{",
            rbrace: "}",
            _errors: moo.error,
        })
        .reset(text);
}

// // Below is a quick and dirty way to identify blocks
// // This is still work in progress and will be refactored later. The main purpose
// // is to test the lexer and see if it can correctly identify blocks and their
// // contents.
// class Block {
//     constructor(blockkey = "", blockname = "") {
//         this.key = blockkey;
//         this.name = blockname;
//         this.fhx = "";
//         this.tokens = [];
//     }
//     construct(token) {
//         this.tokens.push(token);
//     }
// }
// function fhxBlockTokens(fhxLexer) {
//     let blocks = [];
//     let blockLevel = 0;
//     let inblock = false;
//     let indefinition = false;
//     let block;

//     for (let token of fhxLexer) {
//         if (token.type === "blockkey" && !inblock && blockLevel === 0) {
//             block = new Block();

//             inblock = true;
//             indefinition = true;
//             block.key = token.value;
//         }

//         if (token.type === "block_name" && inblock && indefinition) {
//             block.name = token.value;
//         }
//         if (token.type === "lbrace") {
//             blockLevel++;
//             indefinition = false;
//         }
//         if (token.type === "rbrace") {
//             blockLevel--;
//             if (blockLevel === 0 && indefinition == false) {
//                 blocks.push(block);
//                 inblock = false;
//             }
//         }
//         if (inblock) {
//             block.construct(token);
//             block.fhx += token.text;
//         } else {
//             // console.log(token);
//         }
//     }
//     return blocks;
// }

export {
    // MooLexer,
    fhxLexer,
};
