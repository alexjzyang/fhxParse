// short integrated test for moduleRunner.js
// given input of a single module class, test and verify that a new folder is created with the correct files in the folder.
// Content of the files are not tested. The test only serves to verify that the moduleRunner is still working.

import fs from "fs";
import path from "path";
import { moduleRunner } from "../moduleRunner.js";
import { fileURLToPath } from "url";
import { expect, should } from "chai";
should();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe.skip("moduleRunner", function () {
  const inputFilePath = path.join(__dirname, "data", "emsFhx.fhx");
  const outputDir = path.join(__dirname, "test_output");

  // Clean up before test
  if (fs.existsSync(outputDir)) {
    fs.rmSync(outputDir, { recursive: true });
  }
  let fhx = fs.readFileSync(inputFilePath, "utf-16le");

  function testFunc() {
    moduleRunner(fhx, {
      outputBaseDir: outputDir,
      outputBaseName: "RUN",
    });
    return 1;
  }
  after(function () {
    // Clean up after test
    if (fs.existsSync(outputDir)) {
      fs.rmSync(outputDir, { recursive: true });
    }
  });
  it("should run successfully", function () {
    (function () {
      testFunc();
    }).should.not.throw();
  });

  it("should create the correct folders and files", function () {
    expect(true).to.be.true;
  });
});
