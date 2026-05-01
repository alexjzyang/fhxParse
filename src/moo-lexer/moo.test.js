import { expect, should } from "chai";
import { describe, it, before, after } from "mocha";
import fs from "fs";
import yaml from "js-yaml";
import { fhxLexer } from "./moo.js";

describe("fhxLexer", () => {
    const inputTokens = fs.readFileSync(
        "./src/moo-lexer/fixtures/atomic-tokens/simple-block.txt",
        "utf-8",
    );

    const expectedTokens = yaml.load(
        fs.readFileSync(
            "./src/moo-lexer/fixtures/atomic-tokens/expected.yaml",
            "utf-8",
        ),
    );

    const tokens = Array.from(fhxLexer(inputTokens));

    it("should create an iterable lexer", () => {
        expect(fhxLexer(inputTokens)).to.be.iterable;
    });

    it("should not contain any comment tokens", () => {
        const commentTokens = tokens.filter((t) => t.type === "comment");
        expect(commentTokens).to.be.empty;
    });

    it("should contain expected keyword tokens", () => {
        const keywordTokens = tokens
            .filter((t) => t.type === "keyword")
            .map((t) => t.value);
        expect(keywordTokens).to.have.members(expectedTokens.keyword);
    });

    it("should contain expected properties tokens", () => {
        const propertiesTokens = tokens
            .filter((t) => t.type === "property_name")
            .map((t) => t.value);
        expect(propertiesTokens).to.have.members(expectedTokens.property_name);
    });

    it("should contain expected quoted string tokens", () => {
        const quotedStringTokens = tokens
            .filter((t) => t.type === "quoted_string")
            .map((t) => t.value);
        expect(quotedStringTokens).to.have.members(
            expectedTokens.quoted_string,
        );
    });

    it("should contain expected unquoted string tokens", () => {
        const unquotedStringTokens = tokens
            .filter((t) => t.type === "unquoted_string")
            .map((t) => t.value);
        expect(unquotedStringTokens).to.have.members(
            expectedTokens.unquoted_string,
        );
    });
    it("should contain expected number tokens", () => {
        const numberTokens = tokens
            .filter((t) => t.type === "number")
            .map((t) => t.value);
        expect(numberTokens).to.have.members(expectedTokens.number.toString());
    });

    it("should not contain dual double quote tokens", () => {
        const twoDoubleQuoteTokens = tokens.filter(
            (t) => t.type === "two_double_quotes",
        );
        expect(twoDoubleQuoteTokens).to.be.empty;
    });
    it("should contain equal sign tokens", () => {
        expect(tokens.filter((t) => t.type === "equals_sign")).to.not.be.empty;
    });
    it("should contain one lbrace and one rbrace tokens", () => {
        expect(tokens.filter((t) => t.type === "lbrace")).to.have.lengthOf(1);
        expect(tokens.filter((t) => t.type === "rbrace")).to.have.lengthOf(1);
    });

    it("should contain whitespace tokens", () => {
        expect(tokens.filter((t) => t.type === "WS")).to.not.be.empty;
    });
    it("should not contain any error tokens", () => {
        expect(tokens.filter((t) => t.type === "errors")).to.be.empty;
    });
});
