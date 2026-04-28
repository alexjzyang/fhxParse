// const moo = require("moo");
import moo from "moo";

let lexer = moo.compile({
    WS: /[ \t]+/,
    comment: /\/\/.*?$/,
    number: /0|[1-9][0-9]*/,
    string: /"(?:\\["\\]|[^\n"\\])*"/,
    lparen: "(",
    rparen: ")",
    keyword: ["while", "if", "else", "moo", "cows"],
    NL: { match: /\n/, lineBreaks: true },
});

let res = [];
lexer.reset("while (10) cows\nmoo");
res.push(lexer.next()); // -> { type: 'keyword', value: 'while' }
res.push(lexer.next()); // -> { type: 'WS', value: ' ' }
res.push(lexer.next()); // -> { type: 'lparen', value: '(' }
res.push(lexer.next()); // -> { type: 'number', value: '10' }

// console.log(res);


