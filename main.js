// import { FhxProcessor, FileIO, namesFromIndex } from "fhxtool";
import fs from "fs";
import path from "path";
import * as fhxProcessor from "./src/fhxProcessor.js";
import * as dscreator from "./src/DSCreator.js";
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

function runner(fhx_data, blockName = "_C_M_AI") {
  let block = fhxProcessor.fhxObject(fhx_data, "MODULE_CLASS", blockName);
  dscreator.valuesOfModuleParameters(block, blockName);
  dscreator.obtainModuleProperties(block, blockName);
  // fhxProcessor.writeCsv(
  //   [
  //     { id: "name", title: "Name" },
  //     { id: "type", title: "Type" },
  //     { id: "value", title: "Default Value" },
  //     { id: "configurable", title: "Configurable" },
  //   ],
  //   values,
  //   outputPath,
  //   `${blockName}-ModuleParameters.csv`
  // );
}

function runAgitEM(fhx_data) {
  let blockName = "_E_M_AGIT";
  let emBlock = fhxProcessor.fhxObject(fhx_data, "MODULE_CLASS", blockName);
  /*
  dscreator.valuesOfModuleParameters(emBlock, blockName);
  dscreator.obtainModuleProperties(emBlock, blockName);
  */

  // let commandDef_0 = "__5D24D8BB_A831B14A__";

  let functionBlocks = fhxProcessor.findBlocks(emBlock, "FUNCTION_BLOCK");
  // find FUNCTION_BLOCK where NAME includes COMMAND_00
  let commands = functionBlocks.filter((block) =>
    fhxProcessor.nameOf(block).includes("COMMAND_00")
  );

  /*
  // write the commands to a text file
  FileIO.writeTxtFile(
    commands.join("\r\n"),
    path.join("output", blockName),
    blockName + " commands"
  );
  */

  // creating a list of command name and definitions
  let commandNames = commands.map((block) => {
    return {
      name: fhxProcessor.nameOf(block),
      definition: fhxProcessor.valueOf(block, "DEFINITION"),
    };
  });
  console.log(commandNames);
  // FUNCTION_BLOCK NAME="COMMAND_CTRL" DEFINITION="_CT_M_CMD_CTRL"

  let testValueIn = fhxProcessor.valueIn(
    emBlock,
    "FUNCTION_BLOCK",
    "DEFINITION",
    fhxProcessor.valueOf(emBlock, "NAME")[0].includes("_CT_M_CMD_CTRL")
  );
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
const cm_fhxdata = fs.readFileSync(cmfilepath, "utf-16le");
const em_fhxdata = fs.readFileSync(emfilepath, "utf-16le");
const Module_Class = "MODULE_CLASS";
const emname = "_E_M_AGIT";
const cmname = "_C_M_AI";

console.log(path.dirname("./"));

// // runner(em_fhxdata, emname);
// runAgitEM(em_fhxdata);
// runner(cm_fhxdata, cmname);
// runner(em_fhxdata, emname);
function findValueIn(fhx_data, blockType, name, property) {
  let cmblock = fhxProcessor.fhxObject(fhx_data, "MODULE_CLASS", cmname);
  let attrBlock = fhxProcessor.fhxObject(cmblock, blockType, name);
  console.log(attrBlock);
  let cv = fhxProcessor.valueOf(attrBlock, property);
  console.log(cv);
}
// findValueIn(cm_fhxdata, "ATTRIBUTE_INSTANCE", "SENS_FAILURE", "CV");

let tree = [
  { block: "MODULE_CLASS", property: "_C_M_AI" },
  { block: "ATTRIBUTE", property: "SENS_FAILURE" },
];

let property = "CATEGORY";
// fhx_data = cm_fhxdata;

function findValueInTree(fhx_data, tree, property) {
  let block = fhx_data;
  for (let i = 0; i < tree.length; i++) {
    block = fhxProcessor.fhxObject(block, tree[i].block, tree[i].property);
  }
  return fhxProcessor.valueOf(block, property); // valueOf needs to be detect
  // whether the user is looking for a block or a property. So that findValueInTree
  // can be used for both after modifying the function signature.
}

findValueInTree(cm_fhxdata, tree, property);
