import { should } from "chai";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  incrementRunNumber,
  createTestFolder,
} from "../../src/util/OutputFolderGenerator.js";

should();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe("OutputFolderGenerator", function () {
  const baseDir = path.join(__dirname, "test_output");
  const baseName = "RUN";

  before(function () {
    if (fs.existsSync(baseDir)) {
      fs.rmSync(baseDir, { recursive: true, force: true });
    }
    fs.mkdirSync(baseDir);
  });

  afterEach(function () {
    fs.readdirSync(baseDir).forEach((dir) => {
      const filePath = path.join(baseDir, dir);
      if (fs.lstatSync(filePath).isDirectory()) {
        fs.rmSync(filePath, { recursive: true, force: true });
      }
    });
  });

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

  describe("createTestFolder", function () {
    afterEach(function () {
      fs.readdirSync(baseDir).forEach((dir) => {
        const filePath = path.join(baseDir, dir);
        if (fs.lstatSync(filePath).isDirectory()) {
          fs.rmSync(filePath, { recursive: true, force: true });
        }
      });
    });

    it("should return the correct folder name", function () {
      const folder = createTestFolder(baseDir, baseName);
      const today = new Date();
      const dateString = `${String(today.getFullYear())}${String(
        today.getMonth() + 1
      ).padStart(2, "0")}${String(today.getDate() + 1).padStart(2, "0")}`;

      path.basename(folder).should.equal("RUN1_" + dateString);
    });

    it("should create a new folder with the date if no folder with the same date exists", function () {
      const existingFolderName = "RUN1_20241224";
      const newFolderName = "RUN2_20241231";
      const existingFolderPath = path.join(baseDir, existingFolderName);
      const newFolderPath = path.join(baseDir, newFolderName);

      fs.mkdirSync(existingFolderPath);
      fs.existsSync(existingFolderPath).should.be.true;
      createTestFolder(baseDir, baseName, new Date("2024-12-31"));
      fs.existsSync(newFolderPath).should.be.true;
    });

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
