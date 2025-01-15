// import { FhxProcessor, FileIO, namesFromIndex } from "fhxtool";
import fs, { writeFileSync } from "fs";
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
const Function_Block = "FUNCTION_BLOCK";
const Function_Block_Definition = "FUNCTION_BLOCK_DEFINITION";
const emname = "_E_M_AGIT";
const cmname = "_C_M_AI";

/**
 * Finds all command definitions for a given Equipment Module (EM) in the provided FHX data.
 * Extracts the command names and their definitions.
 *
 * @param {string} fhx_data - The FHX data as a string.
 * @param {string} modulename - The name of the Equipment Module.
 * @returns {Array<{name: string, definition: string}>} - An array of objects containing the command names and their definitions.
 */
function findEMCommands(fhx_data, modulename) {
  let _E_M_AGITfhx = fhxProcessor.findBlockWithName(
    fhx_data,
    Module_Class,
    modulename
  );

  let commandsFhx = dscreator.findAll(_E_M_AGITfhx, null, Function_Block, {
    value: "COMMAND_00",
    key: "NAME",
  });

  let _E_M_AGITcmds = commandsFhx.map((block) => {
    let commandname = fhxProcessor.valueOf(block, "NAME");
    let commanddefinition = fhxProcessor.valueOf(block, "DEFINITION");
    return { name: commandname, definition: commanddefinition };
  });
  return _E_M_AGITcmds;
}

/**
 * Compiles all command definitions for a given Equipment Module (EM) in the provided FHX data.
 * Extracts the command names, their definitions, and writes them to text files.
 *
 * @param {string} fhx_data - The FHX data as a string.
 * @param {string} emname - The name of the Equipment Module.
 * @returns {Array<{filename: string, data: string}>} - An array of objects containing the filenames and their data.
 */
function compileEMCommands(fhx_data, emname) {
  // Get a list of names and their definition for the Equipment Module (enname)
  let emCommands = findEMCommands(fhx_data, emname);

  // add fhx data to each command
  emCommands.map((command) => {
    let definitionBlock = fhxProcessor.findBlockWithName(
      fhx_data,
      Function_Block_Definition,
      command.definition
    );
    command.fhx = definitionBlock;
  });

  // Create an array of files with command names and their data for processing with FileIO
  let files = emCommands.map((command) => {
    let filename = command.name;
    let data = command.fhx;
    return { filename, data };
  });

  // Define the output path for the command files
  let emOutputPath = path.join(outputPath, emname, "commands");

  // Write the command files to the output path
  FileIO.writeTxtFiles(files, emOutputPath, true);

  // Return the array of files
  return files;
}

function runner(em_fhxdata) {
  let em0fhxdata = compileEMCommands(em_fhxdata, emname)[0];

  let step0 = fhxProcessor.findBlockWithName(em0fhxdata.data, "STEP", "S0000");
  let actionBlocks = fhxProcessor.findBlocks(step0, "ACTION");

  let actionValues = actionBlocks.map((block) => {
    let actionValue = (key) => fhxProcessor.valueOf(block, key);
    let actionValues = {
      name: actionValue("NAME"),
      description: actionValue("DESCRIPTION"),
      actionType: actionValue("ACTION_TYPE"),
      qualifier: actionValue("QUALIFIER"),
      expression: actionValue("EXPRESSION"),
      confirmExpression: actionValue("CONFIRM_EXPRESSION"),
      confirmTimeOut: actionValue("CONFIRM_TIME_OUT"),
      delayedExpression: actionValue("DELAYED_EXPRESSION"),
      delayTime: actionValue("DELAY_TIME"),
    };
    return actionValues;
  });
  // let action0 = fhxProcessor.findBlockWithName(step0, "ACTION", "A000");
  // let actionValue = (key) => fhxProcessor.valueOf(action0, key);
  // let action0Values = {
  //   description: actionValue("DESCRIPTION"),
  //   actionType: actionValue("ACTION_TYPE"),
  //   qualifier: actionValue("QUALIFIER"),
  //   expression: actionValue("EXPRESSION"),
  //   confirmExpression: actionValue("CONFIRM_EXPRESSION"),
  //   confirmTimeOut: actionValue("CONFIRM_TIME_OUT"),
  //   delayedExpression: actionValue("DELAYED_EXPRESSION"),
  //   delayTime: actionValue("DELAY_TIME"),
  // };
  // console.log(action0Values.expression);
  fs.writeFileSync(
    path.join(outputPath, emname, "commands", "steps", "actions.json"),
    JSON.stringify(actionValues)
  );
}
runner(em_fhxdata);
