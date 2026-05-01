// const moo = require("moo");
import moo from "moo";

class MooLexer {
    // create an instance of the lexer with fhx keywords and patterns
    /**
     * Constructs a lexer instance using the moo library to tokenize input text based on predefined rules.
     * The lexer is configured with various token types including definitions, block keys, names, properties,
     * parameters (string and numeric), expressions, comments, keywords, and punctuation.
     *
     * The expression regex (/EXPRESSION="(?:[^"]|"")*"/) correctly handles EXPRESSION="..." strings by allowing
     * any characters except a single double quote, but permitting two consecutive double quotes as part of the expression,
     * ensuring it ends with a single double quote as described in the comment. This matches the example provided,
     * where nested quotes and doubled quotes are preserved within the expression.
     *
     * @param {string} [text=""] - The input text to be lexed. If provided, the lexer is immediately reset with this text.
     */
    constructor(text = "") {
        this.lexer = moo.compile({
            // definition: /[A-Z_a-z_]+ NAME="(?:[^"]*)"/,
            // blockkey: [
            //     "SCHEMA",
            //     "LOCAL",
            //     "BATCH_PHASE_PARAMETER",
            //     "BATCH_RECIPE",
            //     "BATCH_RECIPE_FORMULA",
            //     "ATTRIBUTE_INSTANCE",
            //     "FUNCTION_BLOCK_DEFINITION",
            // ],
            // // catches NAME="STRING" and extracts STRING
            // block_name: {
            //     match: /NAME="(?:[^"]*)"/,
            //     value: (s) => s.slice(5, -1),
            // },

            // // catches PROPERTY=VALUE, e.g., TYPE=UNICODE_STRING
            // property: {
            //     match: /[0-9_A-Z_a-z_]+=[A-Z_a-z_0-9]+/,
            //     value: (s) => {
            //         let [property, value] = s.split("=");
            //         return { property, value };
            //     },
            // },
            // parameter_string: {
            //     match: /[A-Z_a-z_]+="(?:[^"]*)"/,
            //     value: (s) => {
            //         let [parameter, value] = s.split("=");
            //         return { parameter, value: value.slice(1, -1) };
            //     },
            // },
            // parameter_numeric: {
            //     match: /[A-Z_a-z_]+=-?[0-9]+\.?[0-9]*/,
            //     value: (s) => {
            //         let [parameter, value] = s.split("=");
            //         return { parameter, value: Number(value) };
            //     },
            // },
            expression:
                // if starts with EXPRESSION then handle the expression as a
                // string until the string ends with a sole double quote (one
                // standalone doubleq quote). Note two back to back double
                // quotes are still part of the expression
                //For example
                /**
EXPRESSION="IF
	'^/BSTATUS.CV' = '$phase_state:Aborting'
THEN
	'^/P_MSG1.CV' := ""Abort sequence active"";
	'^/P_MSG2.CV' := """";
ENDIF;
IF
	'^/BSTATUS.CV' = '$phase_state:Stopping'
THEN
	'^/P_MSG1.CV' := ""Stop sequence active"";
	'^/P_MSG2.CV' := """";
ENDIF;""
                 */
                /EXPRESSION="(?:(?:[^"]|"")*)"/,

            comment: /\/\*[\s\S]*?\*\//, // catches /* ... */ comments, including multiline
            _keyword: /[A-Z_a-z_]+/, // catches NAME, TYPE, DIRECTION, etc.
            _equals: "=",
            _quoted: /"(?:[^"]*)"/, // catches "R_MESSAGE_2"
            _unquoted: /[A-Z_a-z_]+/, // catches UNICODE_STRING, INPUT, etc.
            _WS: { match: /\s+/, lineBreaks: true },
            lbrace: "{",
            rbrace: "}",
            _errors: moo.error,
        });
        // if text is provided, feed it into the lexer
        this.lexer.reset(text);
    }
    // method to feed text into the lexer and return tokens
    feed(text) {
        this.lexer.reset(text);
        return this.lexer;
    }
    // *tokenize method to return an array of tokens from the lexer
    // todo get rid of the whitespace tokens in the output
    tokenize() {
        return Array.from(this.lexer).filter((token) => token.type !== "WS");
    }
}

// Below is a quick and dirty way to identify blocks
// This is still work in progress and will be refactored later. The main purpose
// is to test the lexer and see if it can correctly identify blocks and their
// contents.
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
function fhxBlockTokens(fhxLexer) {
    let blocks = [];
    let blockLevel = 0;
    let inblock = false;
    let indefinition = false;
    let block;

    for (let token of fhxLexer) {
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
    return blocks;
}

export { MooLexer, fhxBlockTokens };
