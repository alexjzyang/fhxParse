// import { FhxProcessor, FileIO, namesFromIndex } from "fhxtool";
import fs, { mkdirSync, writeFileSync } from "fs";
import path from "path";
import * as fhxProcessor from "./src/v1/_FhxProcessor.js";
import * as dscreator from "./src/v1/_DSCreator.js";
import { FileIO } from "./src/v1/_FileIO.js";
import { getModuleParameters } from "./src/DSSpecific/ModuleParameterTable.js";
import { getModuleProperties } from "./src/DSSpecific/ModulePropertyTable.js";
import { writeCsvFile } from "./src/util/FileIO.js";
import { getFunctionBlocks } from "./src/DSSpecific/FunctionBlockTable.js";
import { getCompositeBlocks } from "./src/DSSpecific/CompositeTable.js";
import { getAlarms } from "./src/DSSpecific/AlarmTable.js";
import { getHistoryCollection } from "./src/DSSpecific/HistoryTable.js";
import { getEMCommands } from "./src/DSSpecific/EMCommands.js";
import { getEMChildDevices } from "./src/DSSpecific/EMChildDevices.js";
import { createTestFolder } from "./src/util/OutputFolderGenerator.js";
import { moduleRunner } from "./moduleRunner.js";
import { FunctionBlock } from "./src/v2/FhxComponents/FunctionBlock.js";

const FHX_Path = "C:/NCTM Mixers SDS Creation/FHX NCTM MXRs/";
const FHX_Export_25NOV24 = "NCTM Mixers DVfhx Export 25NOV24";
const FHX_Filenames_25NOV24 = {
  Unite_Class: "GEX_Unit_Classes.fhx",
  Composite_Template: "Mixer CompositeTemplates.fhx",
  Equipment_Module_Class: "Mixer Mixer_EM_Classes.fhx",
  Module_Template: "Mixer ModuleTemplates.fhx",
  Instances: "N-MIXERS Instances.fhx",
  Alarms: "Mixer Alarm Types.fhx",
  Control_Module_Class: "Mixer Control_Module_Classes.fhx",
  Phase: "Mixer Mixer_Phase_Classes.fhx",
  Named_Sets: "Mixer Named Sets.fhx",
};

const FHX_Export_18NOV2024 = "NCTM Mixers DVfhx Export 18NOV24";
const FHX_Filenames_18NOV24 = {
  Control_Module_Class: "GEX_Control_Module_Classes.fhx",
};

const FHX_Export_temp = "temp";
const FHX_Filenames_temp = {
  Control_Module_Class: "GEX_Control_Module_Classes.fhx",
};

const FHX_Filename = FHX_Filenames_18NOV24.Control_Module_Class;
const outputPath = "output";

const emsfilepath = path.join(
  FHX_Path,
  FHX_Export_25NOV24,
  FHX_Filenames_25NOV24.Equipment_Module_Class
);

const cmsfilepath = path.join(
  FHX_Path,
  FHX_Export_25NOV24,
  FHX_Filenames_25NOV24.Control_Module_Class
);

// console.log("Loading file: " + fhxfilepath);
const fhx_data = fs.readFileSync(cmsfilepath, "utf-16le");
const cms_fhxdata = fs.readFileSync(cmsfilepath, "utf-16le");
const ems_fhxdata = fs.readFileSync(emsfilepath, "utf-16le");
const Module_Class = "MODULE_CLASS";
const Function_Block = "FUNCTION_BLOCK";
const Function_Block_Definition = "FUNCTION_BLOCK_DEFINITION";
const Definition = "DEFINITION";
const emname = "_E_M_AGIT";
const cmname = "_C_M_AI";

function runner(fhx) {
  let _E_M_AGIT_fhx = fhxProcessor.findBlockWithName(fhx, Module_Class, emname);
  let functionBlocks = fhxProcessor
    .findBlocks(_E_M_AGIT_fhx, Function_Block)
    .map((fb) => {
      return new FunctionBlock(fb);
    });
  let fb = functionBlocks[5];

  console.log(fb.name);
  console.log(fb.fhx);
  console.log("Object To String:");
  console.log(fb.toString());
  console.log(fb.testSimilar());
  console.log(fb.testIdentical());

  return;
}

runner(ems_fhxdata);
