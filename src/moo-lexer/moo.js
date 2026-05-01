import moo from "moo";
function fhxLexer(text) {
    return moo
        .compile({
            // Need to make sure to handle EXPRESSIONS //
            comment: /\/\*[\s\S]*?\*\//, // catches /* ... */ comments, including multiline
            keyword: /(?<!=)[A-Z_a-z_]+(?=\s+[A-Z_a-z_]+)/, // catches keywords followed by whitespace, BATCH_PHASE_PARAMETER

            property_name: /[A-Z_a-z_0-9]+(?=\s*=)/, // catches words followed by an equal sign without capturing the equal sign, such as NAME, TYPE, etc.

            quoted_string: /"(?:[^"]*)"/, // catches "R_MESSAGE_2"
            unquoted_string: /[A-Z_a-z_]+/, // catches UNICODE_STRING, INPUT, etc.
            // _single_double_quotes: /"(?:[^"])/, // catches one double quote "
            // _words: /[A-Z_a-z_]+/, // catches any other words that are not keywords or properties
            number: /-?[0-9]+\.?[0-9]*/, // catches numbers, including negative and decimal numbers

            two_double_quotes: /""/, //catches back to back double quotes ""
            equals_sign: "=",
            lbrace: "{",
            rbrace: "}",
            WS: { match: /\s+/, lineBreaks: true },
            errors: moo.error,
        })
        .reset(text);
}

export { fhxLexer };
