/**
 * Test suite for NewFileIO utility functions.
 */

import chai from "chai";
import fs from "fs";
import path from "path";
import { NewFileIO } from "src/util/FileIO.js";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const expect = chai.expect;
chai.should();

describe("NewFileIO", function () {
  const testDir = path.join(__dirname, "test/output/temp");
  const testFile = path.join(testDir, "testFile.txt");
  const testContent = "Hello, world!";
  const utf16Content = "Hello, world! in UTF16";

  before(function () {
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir, { recursive: true });
    }
  });

  after(function () {
    if (fs.existsSync(testFile)) {
      fs.unlinkSync(testFile);
    }
    if (fs.existsSync(testDir)) {
      fs.rmdirSync(testDir, { recursive: true });
    }
  });

  /**
   * Test case for writing a file with the given content.
   * @param {Function} done - Callback function to signal completion.
   */
  it("should write a file with the given content", function (done) {
    NewFileIO.writeFile(testFile, testContent, function (err) {
      expect(err).to.be.null;
      expect(fs.existsSync(testFile)).to.be.true;
      done();
    });
  });

  /**
   * Test case for reading a file with the given content.
   * @param {Function} done - Callback function to signal completion.
   */
  it("should read a file with the given content", function (done) {
    NewFileIO.readFile(testFile, function (err, data) {
      expect(err).to.be.null;
      expect(data).to.equal(testContent);
      done();
    });
  });

  /**
   * Test case for reading a fhx file with utf16le encoding.
   * @param {Function} done - Callback function to signal completion.
   */
  it("should read a fhx file with utf16le encoding", function (done) {
    const utf16File = path.join(testDir, "utf16File.txt");
    fs.writeFileSync(utf16File, utf16Content, "utf16le");
    NewFileIO.readFile(utf16File, "utf16le", function (err, data) {
      expect(err).to.be.null;
      expect(data).to.equal(utf16Content);
      fs.unlinkSync(utf16File);
      done();
    });
  });

  /**
   * Test case for adding the proper extension to a file name.
   */
  it("should add the proper extension", function () {
    const fileName = "testFile";
    const extension = ".txt";
    const result = NewFileIO.addExtension(fileName, extension);
    expect(result).to.equal(fileName + extension);
  });

  /**
   * Test case for creating subdirectories if they do not exist.
   * @param {Function} done - Callback function to signal completion.
   */
  it("should create subdirectories if not exist", function (done) {
    const subDir = path.join(testDir, "subDir");
    const subFile = path.join(subDir, "subFile.txt");
    NewFileIO.writeFile(subFile, testContent, function (err) {
      expect(err).to.be.null;
      expect(fs.existsSync(subDir)).to.be.true;
      expect(fs.existsSync(subFile)).to.be.true;
      fs.unlinkSync(subFile);
      fs.rmdirSync(subDir);
      done();
    });
  });
});
