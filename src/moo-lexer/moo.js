// const moo = require("moo");
import moo from "moo";

class MooLexer {
    // create an instance of the lexer with fhx keywords and patterns
    constructor(text = "") {
        this.lexer = moo.compile({
            blockkey: [
                "SCHEMA",
                "LOCAL",
                "BATCH_PHASE_PARAMETER",
                "BATCH_RECIPE",
                "BATCH_RECIPE_FORMULA",
                "ATTRIBUTE_INSTANCE",
            ],

            // catches NAME="STRING" and extracts STRING
            block_name: {
                match: /NAME="(?:[^"]*)"/,
                value: (s) => s.slice(5, -1),
            },

            // catches PROPERTY=VALUE, e.g., TYPE=UNICODE_STRING
            property: {
                match: /[A-Z_a-z_]+=[A-Z_a-z_]+/,
                value: (s) => {
                    let [property, value] = s.split("=");
                    return { property, value };
                },
            },
            parameter_string: {
                match: /[A-Z_a-z_]+="(?:[^"]*)"/,
                value: (s) => {
                    let [parameter, value] = s.split("=");
                    return { parameter, value: value.slice(1, -1) };
                },
            },
            parameter_numeric: {
                match: /[A-Z_a-z_]+=-?[0-9]+\.?[0-9]*/,
                value: (s) => {
                    let [parameter, value] = s.split("=");
                    return { parameter, value: Number(value) };
                },
            },
            ///* Version: 15.0.0.8510.xr */\r\n'
            comment: /\/\*[\s\S]*?\*\//,
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
        return this;
    }
    // *tokenize method to return an array of tokens from the lexer
    // todo get rid of the whitespace tokens in the output
    tokenize() {
        return Array.from(this.lexer).filter((token) => token.type !== "WS");
    }
}

export { MooLexer };
