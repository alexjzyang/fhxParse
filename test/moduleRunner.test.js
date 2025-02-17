// short integrated test for moduleRunner.js
// given input of a single module class, test and verify that a new folder is created with the correct files in the folder.
// Content of the files are not tested. The test only serves to verify that the moduleRunner is still working.

import fs from "fs";
import path from "path";
import { moduleRunner } from "../moduleRunner.js";
import { fileURLToPath } from "url";
import { expect, should } from "chai";
import { createTestFolder } from "../src/util/OutputFolderGenerator.js";
should();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
let fhxfile1 = fs.readFileSync("fhx/Mixer Control_Module_Classes.fhx");
let fhxfile2 = fs.readFileSync("fhx/Mixer Mixer_EM_Classes.fhx");

describe.only("moduleRunner", function () {
  // const inputFilePath = path.join(__dirname, "data", "emsFhx.fhx");
  const outputDir = path.join(__dirname, "test_output");
  fhxfile1 = fs.readFileSync("fhx/Mixer Control_Module_Classes.fhx", "utf16le");
  fhxfile2 = fs.readFileSync("fhx/Mixer Mixer_EM_Classes.fhx", "utf16le");

  let cm1 = "_C_M_AGIT_M";
  let cm2 = "_C_M_PID_1AI_M";
  let cmtables = [
    "alarms.csv",
    "properties.csv",
    "parameters.csv",
    "functionBlocks.csv",
    "emBeddedCompositeBlocks.csv",
    "linkedCompositeBlocks.csv",
    "alarms.csv",
    "getHistoryCollection.csv",
  ];

  let em1 = "_E_M_PH";
  let em2 = "_E_M_TEMP";
  let emtables = [
    "alarms.csv",
    "properties.csv",
    "parameters.csv",
    "functionBlocks.csv",
    "emBeddedCompositeBlocks.csv",
    "linkedCompositeBlocks.csv",
    "alarms.csv",
    "getHistoryCollection.csv",
    "commands.csv",
    "childDevices.csv",
  ];
  // Clean up before test

  beforeEach(function () {
    if (fs.existsSync(outputDir)) {
      fs.rmSync(outputDir, { recursive: true });
    }
  });

  after(function () {
    fs.rmSync(outputDir, { recursive: true });
  });

  it("should create all the necessary tables created based on a CMC fhx input", function () {
    let outputPathShouldBe = createTestFolder(outputDir, "RUN");
    let cm1Path = path.join(outputPathShouldBe, cm1);
    let cm2Path = path.join(outputPathShouldBe, cm2);
    expect(
      moduleRunner(fhxfile1, {
        outputBaseDir: outputDir,
        outputBaseName: "RUN",
      })
    ).to.not.throw;
    expect(fs.existsSync(cm1Path));
    expect(fs.existsSync(cm2Path));
    cmtables.forEach((table) =>
      expect(fs.existsSync(path.join(cm1Path, table)))
    );
  });

  it("should create all the necessary tables created based on a EMC fhx input", function () {
    let outputPathShouldBe = createTestFolder(outputDir, "RUN");
    let em1Path = path.join(outputPathShouldBe, em1);
    let em2Path = path.join(outputPathShouldBe, em2);
    expect(
      moduleRunner(fhxfile2, {
        outputBaseDir: outputDir,
        outputBaseName: "RUN",
      })
    ).to.not.throw;
    expect(fs.existsSync(em1Path));
    expect(fs.existsSync(em2Path));
    emtables.forEach((table) =>
      expect(fs.existsSync(path.join(em1Path, table)))
    );
  });
});
