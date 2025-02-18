/**
 * Test suite for FileIO utility functions.
 */

import { expect, should } from "chai";
import fs from "fs";
import path from "path";
import { FileIO } from "../src/util/FileIO.js";

should();

describe("FileIO", function () {
    const testDir = "output/temp";
    const testTxtFile = path.join(testDir, "testFile.txt");
    const testContent = "Hello, world!";
    // const utf16Content = "Hello, world! in UTF16";
    const fhxFilePath = path.join("src/fhx", "_E_M_AGIT.fhx");

    before(function () {
        if (!fs.existsSync(testDir)) {
            fs.mkdirSync(testDir, { recursive: true });
        }
    });

    after(function () {
        if (fs.existsSync(testTxtFile)) {
            fs.unlinkSync(testTxtFile);
        }
        if (fs.existsSync(testDir)) {
            fs.rmdirSync(testDir, { recursive: true });
        }
    });

    // test writen file exist.
    it("should write a file to the specified path", function () {
        FileIO.writeFile(testTxtFile, testContent);
        expect(fs.existsSync(testTxtFile)).to.be.true;
    });
    // test read file content
    it("should read the content of a file", function () {
        const content = FileIO.readFile(testTxtFile);
        expect(content).to.equal(testContent);
    });
    // test read fhx file content with utf16le encoding results in a stirng
    it("should read the content of a fhx file with utf16le encoding", function () {
        FileIO.readFile(fhxFilePath).should.be.a("string");
    });
});
