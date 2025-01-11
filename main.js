// import { FhxProcessor, FileIO, namesFromIndex } from "fhxtool";
import fs from "fs";
import path from "path";
import * as fhxProcessor from "./src/fhxProcessor.js";
import * as dscreator from "./src/DSCreater.js";
import { FileIO } from "./FileIO.js";

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

// a DSCreater function to find all Equipment Module Classes
function findAllEMC(fhx_data) {
  // let fhxBlockType = "MODULE_CLASS";
  // let modulename = "_E_M_AGIT";
  // let category = "Equipment Module Classes";
  // let fhxProperties = { category: "CATEGORY" };
  let outputFilePath = "output/All EMC";

  let blocks = fhxProcessor.findBlocks(fhx_data, "MODULE_CLASS"); // Find all module class blocks
  blocks.forEach((block) => {
    if (
      fhxProcessor
        .valueOf(block, "CATEGORY")
        .includes("Equipment Module Classes")
    ) {
      // Check if the block is an equipment module class
      let modulename = fhxProcessor.valueOf(block, "NAME"); // Get the module name
      FileIO.writeTxtFile(block, outputFilePath, modulename); // Write the block to a text file
    }
  });
}

function runner(fhx_data) {
  let block = fhxProcessor.fhxObject(fhx_data, "MODULE_CLASS", "_C_M_AI");
  let values = dscreator.valuesOfModuleParameters(block);
  return;
}

const emfilepath = path.join(
  FHX_Path,
  FHX_Export_25NOV24,
  FHX_Filenames_25NOV24.Equipment_Module_Class
);

const cmfilepath = path.join(
  FHX_Path,
  FHX_Export_25NOV24,
  FHX_Filenames_25NOV24.Control_Module_Class
);

// console.log("Loading file: " + fhxfilepath);
const fhx_data = fs.readFileSync(cmfilepath, "utf-16le");
const modulename = "_E_M_AGIT";
// const modulename = "_C_M_AI";

runner(fhx_data);
