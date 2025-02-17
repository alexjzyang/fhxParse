import { should } from "chai";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  incrementRunNumber,
  createTestFolder,
} from "../src/util/OutputFolderGenerator.js";

should();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe("OutputFolderGenerator", function () {
  const baseDir = path.join(__dirname, "test_output");
  const baseName = "RUN";

  // create test folder
  before(function () {
    if (fs.existsSync(baseDir)) {
      fs.rmSync(baseDir, { recursive: true, force: true });
    }
    fs.mkdirSync(baseDir);
  });

  // delete test folder after all tests are done
  after(function () {
    if (fs.lstatSync(baseDir).isDirectory()) {
      fs.rmSync(baseDir, { recursive: true, force: true });
    }
  });

  // clear test folders after each test case
  afterEach(function () {
    fs.readdirSync(baseDir).forEach((dir) => {
      const filePath = path.join(baseDir, dir);
      if (fs.lstatSync(filePath).isDirectory()) {
        fs.rmSync(filePath, { recursive: true, force: true });
      }
    });
  });

  // test incrementRunNumber function
  describe("incrementRunNumber", function () {
    afterEach(function () {
      fs.readdirSync(baseDir).forEach((dir) => {
        const filePath = path.join(baseDir, dir);
        if (fs.lstatSync(filePath).isDirectory()) {
          fs.rmSync(filePath, { recursive: true, force: true });
        }
      });
    });

    it("should return the correct incremented run number", function () {
      const folder1 = path.join(baseDir, "RUN1_20250101");
      const folder2 = path.join(baseDir, "RUN2_20250102");
      fs.mkdirSync(folder1);
      fs.mkdirSync(folder2);

      const result = incrementRunNumber(baseDir, baseName);
      result.should.equal("RUN3");
    });
  });

  // test createTestFolder function
  describe("createTestFolder", function () {
    afterEach(function () {
      fs.readdirSync(baseDir).forEach((dir) => {
        const filePath = path.join(baseDir, dir);
        if (fs.lstatSync(filePath).isDirectory()) {
          fs.rmSync(filePath, { recursive: true, force: true });
        }
      });
    });

    // Test case: folders should be created with the correct name with today's date
    it("should return the correct folder name", function () {
      const folder = createTestFolder(baseDir, baseName);
      const today = new Date();
      const dateString = `${String(today.getFullYear())}${String(
        today.getMonth() + 1
      ).padStart(2, "0")}${String(today.getDate() + 1).padStart(2, "0")}`;

      path.basename(folder).should.equal("RUN1_" + dateString);
    });

    // Test case: folders should be created if no folder with the same date exists
    it("should create a new folder with the date if no folder with the same date exists", function () {
      const existingFolderName = "RUN1_20241224";
      const newFolderName = "RUN2_20241231"; // manually increment the run number
      const existingFolderPath = path.join(baseDir, existingFolderName);
      const newFolderPath = path.join(baseDir, newFolderName);

      fs.mkdirSync(existingFolderPath);
      fs.existsSync(existingFolderPath).should.be.true;
      createTestFolder(baseDir, baseName, new Date("2024-12-31"));
      fs.existsSync(newFolderPath).should.be.true;
    });

    // Test case: folders should not be created if a folder with the same date exists
    it("should not create a new folder if one with the same date already exists", function () {
      const folder1 = createTestFolder(
        baseDir,
        baseName,
        new Date("2024-07-04")
      );
      fs.existsSync(folder1).should.be.true;
      const dirNumBefore = fs.readdirSync(baseDir).length;
      const folder2 = createTestFolder(
        baseDir,
        baseName,
        new Date("2024-07-04")
      );
      const dirNumAfter = fs.readdirSync(baseDir).length;
      dirNumBefore.should.equal(
        dirNumAfter,
        "there should not be more folders"
      );

      folder1.should.equal(
        folder2,
        `The function should have returned the same folder name. folder1: ${folder1}, folder2: ${folder2}`
      );
    });

    // Test case: created folders should have the correct run number increments
    it("should create folders with incremented numbers if an existing folder has a different date", function () {
      const run1_date = new Date("2025-02-03");
      const run2_date = new Date("2025-02-06");

      const folder1 = createTestFolder(baseDir, baseName, run1_date);
      const folder2 = createTestFolder(baseDir, baseName, run2_date);
      fs.existsSync(folder1).should.be.true;
      fs.existsSync(folder2).should.be.true;

      path.basename(folder1).should.include("RUN1", `folder1: ${folder1}`);
      path.basename(folder2).should.include("RUN2", `folder2: ${folder2}`);
    });
  });
});

// Test case: integrated test with multiple examples
describe("OutputFolderGenerator, with an integrated example", function () {
  const baseDir = path.join(__dirname, "test_output");

  // create base test output directory
  before(function () {
    if (fs.existsSync(baseDir)) {
      fs.rmSync(baseDir, { recursive: true, force: true });
    }
    fs.mkdirSync(baseDir);
  });

  // clean up test folders after each test
  after(function () {
    if (fs.lstatSync(baseDir).isDirectory()) {
      fs.rmSync(baseDir, { recursive: true, force: true });
    }
  });
  it("should properly create folders with the following examples", function () {
    // verify that the base folder is empty
    fs.readdirSync(baseDir).length.should.equal(
      0,
      "base folder should be empty"
    );

    // creating test cases simulating different dates
    const run1_date = new Date("2025-02-03");
    const run2_date = new Date("2025-02-06");
    const run3_date = new Date("2025-02-07");
    const run4_date = new Date("2025-02-07");

    // create folders with the dates
    const folder1 = createTestFolder(baseDir, "TestRun", run1_date);
    const folder2 = createTestFolder(baseDir, "TestRun", run2_date);
    const folder3 = createTestFolder(baseDir, "TestRun", run3_date);
    const folder4 = createTestFolder(baseDir, "TestRun", run4_date);

    // The newly created folders should exist
    fs.existsSync(folder1).should.be.true;
    fs.existsSync(folder2).should.be.true;
    fs.existsSync(folder3).should.be.true;
    fs.existsSync(folder4).should.be.true;

    // The folder names should be as expected
    path.basename(folder1).should.include("TestRun1_", `folder1: ${folder1}`);
    path.basename(folder2).should.include("TestRun2_", `folder2: ${folder2}`);
    path.basename(folder3).should.include("TestRun3_", `folder3: ${folder3}`);
    // TestRun4_ should not exist, because it is ran on the same day as run3
    path
      .basename(folder4)
      .should.not.include(
        "TestRun4_",
        `folder4: ${folder4} should not exist, because it is ran on the same day as run3`
      );
  });
});
