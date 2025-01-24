import { expect } from "chai";
import fs from "fs";
import path from "path";
import {
  writeTxtFile,
  writeJsonFile,
  writeCsvFile,
  readFile,
  readFhxFile,
} from "../src/FileIO.js";

const __dirname = path.dirname(new URL(import.meta.url).pathname);
// // In your script:
// import config from "../config.js"; // Adjust the path to this file as necessary

// console.log("Root Directory:", config.rootDir);

const testDir = path.join(__dirname, "test_files");
const testTxtFile = "test.txt";
const testJsonFile = "test.json";
const testCsvFile = "test.csv";
const testFhxFile = "test.fhx";
describe("FileIO", function () {
  before(function () {
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir);
    }
  });

  after(function () {
    fs.rmdirSync(testDir, { recursive: true });
  });

  it("should write and read a text file", function () {
    const data = "Hello, world!";
    writeTxtFile(data, testDir, testTxtFile);
    const content = readFile(path.join(testDir, testTxtFile));
    expect(content).to.equal(data);
  });

  it("should write and read a JSON file", function () {
    const data = { message: "Hello, world!" };
    writeJsonFile(data, testDir, testJsonFile);
    const content = JSON.parse(readFile(path.join(testDir, testJsonFile)));
    expect(content).to.deep.equal(data);
  });

  it("should write and read a CSV file", function () {
    const header = ["name", "age"];
    const records = [
      ["Alice", "30"],
      ["Bob", "25"],
    ];
    writeCsvFile(header, records, testDir, testCsvFile);
    const content = readFile(path.join(testDir, testCsvFile));
    const expectedContent = "name,age\nAlice,30\nBob,25";
    expect(content).to.equal(expectedContent);
  });

  it("should read a UTF-16LE encoded .fhx file", function () {
    const data = "Hello, world!";
    const buffer = Buffer.from(data, "utf16le");
    fs.writeFileSync(path.join(testDir, testFhxFile), buffer);
    const content = readFhxFile(path.join(testDir, testFhxFile));
    expect(content).to.equal(data);
  });
});
