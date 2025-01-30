// import { FhxProcessor, FileIO, namesFromIndex } from "fhxtool";
import fs, { mkdirSync, writeFileSync } from "fs";
import path from "path";
import * as fhxProcessor from "./src/v1/_FhxProcessor.js";
import * as dscreator from "./src/v1/_DSCreator.js";
import { FileIO } from "./src/v1/_FileIO.js";
import { getModuleParameters } from "./src/DSSpecific/ModuleParameterTable.js";
import { getModuleProperties } from "./src/DSSpecific/ModulePropertyTable.js";
import { writeCsvFile } from "./src/FileIO.js";
import { getFunctionBlocks } from "./src/DSSpecific/FunctionBlockTable.js";
import { getCompositeBlocks } from "./src/DSSpecific/CompositeTable.js";
import { getAlarms } from "./src/DSSpecific/AlarmTable.js";
import { getHistoryCollection } from "./src/DSSpecific/HistoryTable.js";

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

/**
 * Finds all command definitions for a given Equipment Module (EM) in the provided FHX data.
 * Extracts the command names and their definitions.
 *
 * @param {string} fhx_data - The FHX data as a string.
 * @param {string} modulename - The name of the Equipment Module.
 * @returns {Array<{name: string, definition: string}>} - An array of objects containing the command names and their definitions.
 */
function listEMCommands(emfhx) {
  // let emname = fhxProcessor.nameOf(emfhx);

  let commandsFhx = dscreator.findAll(emfhx, Function_Block, {
    value: "COMMAND_00",
    key: "NAME",
  });

  let cmds = commandsFhx.map((block) => {
    let commandname = fhxProcessor.valueOfParameter(block, "NAME");
    let commanddefinition = fhxProcessor.valueOfParameter(block, "DEFINITION");
    return { name: commandname, definition: commanddefinition };
  });
  return cmds;
}

/**
 * Compiles all command definitions for a given Equipment Module (EM) in the provided FHX data.
 * Extracts the command names, their definitions, and writes them to text files.
 *
 * @param {string} emFhxData - The FHX data as a string.
 * @param {string} emname - The name of the Equipment Module.
 * @returns {Array<{filename: string, data: string}>} - An array of objects containing the filenames and their data.
 */
function compileEMCommands(emFhxData, emname) {
  // Get a list of names and their definition for the Equipment Module (enname)
  let emCommands = findEMCommands(emFhxData, emname);

  // add fhx data to each command
  emCommands.map((command) => {
    let definitionBlock = fhxProcessor.findBlockWithName(
      emFhxData,
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
  // FileIO.writeTxtFiles(files, emOutputPath, true);

  // Return the array of files
  return files;
}

/*
All alarm attribute instance keys
ATTRIBUTE_INSTANCE NAME="FAIL_ALM"
 {
   VALUE
   {
     PRIORITY_NAME="WARNING"
     ENAB=F
     INV=F
     ATYP="_A_M_ Equipment Failure"
     MONATTR=""
     ALMATTR="FAILURE"
     LIMATTR=""
     PARAM1="FAIL"
     PARAM2="MONITOR/FAILURE"
     SUPPTIMEOUT=480
     MASK=65535
     ISDEFAULTMASK=T
     ALARM_FUNCTIONAL_CLASSIFICATION=0
   }*/

// function getAlarms() {
//   // getAlarms is SIP because valueOf an empty string ("")is not yet working
//   let attribute_instances = fhxProcessor.findBlocks(
//     module_class,
//     "ATTRIBUTE_INSTANCE"
//   );
//   let alarms = attribute_instances.filter((block) => {
//     return block.includes("PRIORITY_NAME");
//   });

//   let alarm_attribute_instances_keys = {
//     name: "NAME",
//     priority: "PRIORITY_NAME",
//     enable: "ENAB",
//     inverted: "INV",
//     type: "ATYP",
//     monitor_attribute: "MONATTR",
//     alarm_parameter: "ALMATTR",
//     limit: "LIMATTR",
//     p1: "PARAM1",
//     p2: "PARAM2",
//     timeout: "SUPPTIMEOUT",
//   };
//   let alarm_parameters = alarms.map((alarm) => {
//     let alarm_values = {};
//     for (let key in alarm_attribute_instances_keys) {
//       let dvkey = alarm_attribute_instances_keys[key];
//       let value = fhxProcessor.valueOfParameter(alarm, dvkey);
//       alarm_values[key] = value;
//     }
//     return alarm_values;
//   });
//   if (alarm_parameters.timeout) {
//     alarm_parameters.timeoutHours = alarm_parameters.timeout / 3600;
//     alarm_parameters.timeoutMinutes = (alarm_parameters.timeout % 3600) / 60;
//     alarm_parameters.alarm_timeout_seconds =
//       (alarm_parameters[timeout] % 3600) % 60;
//   }
//   return alarm_parameters;
// }

function runner(fhxdata) {
  let modulenames = fhxProcessor
    .findBlocks(fhxdata, "MODULE_CLASS")
    .map((block) => {
      return fhxProcessor.valueOfParameter(block, "NAME");
    });

  modulenames.forEach((modulename) => {
    let res = {
      parameters: getModuleParameters(fhxdata, modulename),
      properties: getModuleProperties(fhxdata, modulename),
      functionBlocks: getFunctionBlocks(fhxdata, modulename),
      compositeBlocks: getCompositeBlocks(fhxdata, modulename),
      alarms: getAlarms(fhxdata, modulename),
      historyCollection: getHistoryCollection(fhxdata, modulename),
    };
    let outputPath = path.join("output", "Run_1", modulename);

    let modulefhx = fhxProcessor.findBlockWithName(
      fhxdata,
      "MODULE_CLASS",
      modulename
    );
    // FileIO.writeTxtFile(modulefhx, outputPath, `${modulename}.txt`, false);

    let propertiesCsv = res.properties.toCsvString();
    let parametersCsv = res.parameters.toCsvString();
    let functionBlocksCsv = res.functionBlocks.toCsvString();
    let embeddedCompositeBlocksCsv = res.compositeBlocks.embedded.toCsvString();
    let linkedCompositeBlocksCsv = res.compositeBlocks.linked.toCsvString();
    let alarmsCsv = res.alarms.toCsvString();
    let historyCollectionCsv = res.historyCollection.toCsvString();

    FileIO.writeFile(propertiesCsv, path.join(outputPath), "properties.csv");
    FileIO.writeFile(parametersCsv, path.join(outputPath), "parameters.csv");
    FileIO.writeFile(
      functionBlocksCsv,
      path.join(outputPath),
      "functionBlocks.csv"
    );
    FileIO.writeFile(
      embeddedCompositeBlocksCsv,
      path.join(outputPath),
      "emBeddedCompositeBlocks.csv"
    );
    FileIO.writeFile(
      linkedCompositeBlocksCsv,
      path.join(outputPath),
      "linkedCompositeBlocks.csv"
    );
    FileIO.writeFile(alarmsCsv, path.join(outputPath), "alarms.csv");
    FileIO.writeFile(
      historyCollectionCsv,
      path.join(outputPath),
      "getHistoryCollection.csv"
    );

    // Combine all CSV strings into one with respective names and extra lines between them
    let combinedCsv = `Properties,Table Size: 2 X ${
      res.properties.data.length
    }\n${propertiesCsv}
    \nParameters,Table Size: 3 X ${
      res.parameters.data.length + 1
    }\n${parametersCsv}
    \nFunction Blocks,Table Size: 2 X ${
      res.functionBlocks.data.length + 1
    }\n${functionBlocksCsv}
    \nEmbedded Composite Blocks,Table Size: 1 X ${
      res.compositeBlocks.embedded.data.length + 1
    }\n${embeddedCompositeBlocksCsv}
    \nLinked Composite Blocks,Table Size: 2 X ${
      res.compositeBlocks.linked.data.length + 1
    }\n${linkedCompositeBlocksCsv}
    \nAlarms,Table Size: 7 X ${res.alarms.data.length + 1}\n${alarmsCsv}
    \nHistory Collection,Table Size: 8 X ${
      res.historyCollection.data.length + 1
    }\n${historyCollectionCsv}`;

    // Write the combined CSV string to a new file
    FileIO.writeFile(combinedCsv, path.join(outputPath), "combined.csv");
  });
  return;
}

function cmdrunner(ems_fhxdata) {
  let emfhxdata = fhxProcessor.findBlockWithName(
    ems_fhxdata,
    Module_Class,
    emname
  );
  let emCommands = listEMCommands(emfhxdata);
  let cmdFhx = dscreator.findCompositeDefinitionOf(
    emfhxdata,
    ems_fhxdata,
    emCommands[0].name
  );

  let sfcdata = fhxProcessor.processSFC(cmdFhx);
  dscreator.sfcToCsv(outputPath, "sfc.csv", cmdFhx);
  return;
}
cmdrunner(ems_fhxdata);
runner(cms_fhxdata);
