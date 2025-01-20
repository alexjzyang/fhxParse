// import { FhxProcessor, FileIO, namesFromIndex } from "fhxtool";
import fs, { writeFileSync } from "fs";
import path from "path";
import * as fhxProcessor from "./src/FhxProcessor.js";
import * as dscreator from "./src/DSCreator.js";
import { FileIO } from "./src/FileIO.js";

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
const ems_fhxdata = fs.readFileSync(emfilepath, "utf-16le");
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
function findEMCommands(emfhx) {
  let emname = fhxProcessor.nameOf(emfhx);

  let commandsFhx = dscreator.findAll(emfhx, null, Function_Block, {
    value: "COMMAND_00",
    key: "NAME",
  });

  let cmds = commandsFhx.map((block) => {
    let commandname = fhxProcessor.valueOf(block, "NAME");
    let commanddefinition = fhxProcessor.valueOf(block, "DEFINITION");
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
  FileIO.writeTxtFiles(files, emOutputPath, true);

  // Return the array of files
  return files;
}

function SFCSteps(emFhxData) {
  let steps = fhxProcessor.findBlocks(emFhxData, "STEP");
  /*
    Structure of Steps:
    Description
    List of ACTIONS
  */
  let stepValues = steps.map((step) => {
    let getValue = (key) => fhxProcessor.valueOf(step, key);
    let values = {
      name: getValue("NAME"),
      description: getValue("DESCRIPTION"),
      actions: SFCActions(step),
    };
    return values;
  });
  return stepValues;
}

function SFCTransitions(cmdFhxData) {
  let transitionBlocks = fhxProcessor.findBlocks(cmdFhxData, "TRANSITION");
  /*
    Structure of Transitions:
    Transition Header
    transition: [
    { id: "name", title: "NAME" },
    { id: "description", title: "DESCRIPTION" },
    { id: "position", title: "POSITION" },
    { id: "termination", title: "TERMINATION" },
    { id: "expression", title: "EXPRESSION" },
    ],
   */
  let transitionValues = transitionBlocks.map((block) => {
    let transitionValue = (key) => fhxProcessor.valueOf(block, key);
    let values = {
      name: transitionValue("NAME"),
      description: transitionValue("DESCRIPTION"),
      position: transitionValue("POSITION"),
      termination: transitionValue("TERMINATION"),
      expression: transitionValue("EXPRESSION"),
    };
    return values;
  });
  return transitionValues;
}

function SFCActions(stepFhxData) {
  let actionBlocks = fhxProcessor.findBlocks(stepFhxData, "ACTION");
  /*
      Structure of Actions:
      Action Header
      action: [
      { id: "name", title: "NAME" },
      { id: "description", title: "DESCRIPTION" },
      { id: "actionType", title: "ACTION_TYPE" },
      { id: "qualifier", title: "QUALIFIER" },
      { id: "expression", title: "EXPRESSION" },
      { id: "confirmExpression", title: "CONFIRM_EXPRESSION" },
      { id: "confirmTimeOut", title: "CONFIRM_TIME_OUT" },
      { id: "delayedExpression", title: "DELAY_EXPRESSION" },
      { id: "delayTime", title: "DELAY_TIME" },
      ]
  */
  let actionValues = actionBlocks.map((block) => {
    let getValue = (key) => fhxProcessor.valueOf(block, key);
    let values = {
      name: getValue("NAME"),
      description: getValue("DESCRIPTION"),
      actionType: getValue("ACTION_TYPE"),
      qualifier: getValue("QUALIFIER"),
      expression: getValue("EXPRESSION"),
      confirmExpression: getValue("CONFIRM_EXPRESSION"),
      confirmTimeOut: getValue("CONFIRM_TIME_OUT"),
      delayedExpression: getValue("DELAY_EXPRESSION"),
      delayTime: getValue("DELAY_TIME"),
    };
    return values;
  });

  return actionValues;
}

const csvHeaders = {
  action: [
    { id: "name", title: "NAME" },
    { id: "description", title: "DESCRIPTION" },
    { id: "actionType", title: "ACTION_TYPE" },
    { id: "qualifier", title: "QUALIFIER" },
    { id: "expression", title: "EXPRESSION" },
    { id: "confirmExpression", title: "CONFIRM_EXPRESSION" },
    { id: "confirmTimeOut", title: "CONFIRM_TIME_OUT" },
    { id: "delayedExpression", title: "DELAY_EXPRESSION" },
    { id: "delayTime", title: "DELAY_TIME" },
  ],
  transition: [
    { id: "name", title: "NAME" },
    { id: "description", title: "DESCRIPTION" },
    { id: "position", title: "POSITION" },
    { id: "termination", title: "TERMINATION" },
    { id: "expression", title: "EXPRESSION" },
  ],
};

function findCommendFhxs(em_fhxdata, emname) {
  let em1fhx = fhxProcessor.findBlockWithName(em_fhxdata, Module_Class, emname); // Find the Equipment Module block
  // Identify the definition of the commands
  let emCommands = findEMCommands(em1fhx, emname);
  emCommands.map((command) => {
    let definitionBlock = fhxProcessor.findBlockWithName(
      em_fhxdata,
      Function_Block_Definition,
      command.definition
    );
    command.fhx = definitionBlock;
  });
  return emCommands;
}

function processSFC(cmdfhx) {
  let steps = SFCSteps(cmdfhx);
  let transitions = SFCTransitions(cmdfhx);

  return { steps, transitions };
}

function writeJsonFile(filepath, data) {
  fs.writeFileSync(filepath, JSON.stringify(data, null, 2), "utf8");
}

function runner(ems_fhxdata) {
  let module = emname;
  let cmdFhxData = findCommendFhxs(ems_fhxdata, module);
  let jsonResult = cmdFhxData.map((cmd) => {
    let sfc = processSFC(cmd.fhx);
    return { name: cmd.name, sfc, definition: cmd.definition };
  });

  // Write the JSON result to a file
  const jsonOutputPath = path.join(outputPath, module, "commands.json");
  writeJsonFile(jsonOutputPath, jsonResult);

  return jsonResult;
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

/**
 * Finding the alarm names, priority,
 * Parameter,
 * Parameter Limit
 * Default limit,
 * Enabled
 * Alarm Message,
 * Placeholder
 * Priority
 *
 * @param {string} module_class fhx of a module class
 */
function getAlarms(module_class) {
  let attribute_instances = fhxProcessor.findBlocks(
    module_class,
    "ATTRIBUTE_INSTANCE"
  );
  let alarms = attribute_instances.filter((block) => {
    return block.includes("PRIORITY_NAME");
  });

  let alarm_attribute_instances_keys = {
    name: "NAME",
    priority: "PRIORITY_NAME",
    enable: "ENAB",
    inverted: "INV",
    type: "ATYP",
    monitor_attribute: "MONATTR",
    alarm_parameter: "ALMATTR",
    limit: "LIMATTR",
    p1: "PARAM1",
    p2: "PARAM2",
    timeout: "SUPPTIMEOUT",
  };
  let alarm_parameters = alarms.map((alarm) => {
    let alarm_values = {};
    for (let key in alarm_attribute_instances_keys) {
      let dvkey = alarm_attribute_instances_keys[key];
      let value = fhxProcessor.valueOf(alarm, dvkey);
      alarm_values[key] = value;
    }
    return alarm_values;
  });
  if (alarm_parameters[timeout]) {
    alarm_parameters[timeoutHours] = alarm_parameters[timeout] / 3600;
    alarm_parameters[timeoutMinutes] = (alarm_parameters[timeout] % 3600) / 60;
    alarm_parameters[alarm_timeout_seconds] =
      (alarm_parameters[timeout] % 3600) % 60;
  }
  return alarm_parameters;
}

function runner2(ems_fhxdata) {
  let alarmParams = getAlarms(ems_fhxdata);
}

let fhx_E_M_AGIT = fhxProcessor.findBlockWithName(
  ems_fhxdata,
  Module_Class,
  emname
);
runner2(fhx_E_M_AGIT);
// runner(ems_fhxdata);
