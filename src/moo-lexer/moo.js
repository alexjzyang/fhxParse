import moo from "moo";
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

export { fhxLexer };
