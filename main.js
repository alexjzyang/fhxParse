// import { FhxProcessor, FileIO, namesFromIndex } from "fhxtool";
import fs, { mkdirSync, writeFileSync } from "fs";
import path from "path";
import * as fhxProcessor from "./src/v1/_FhxProcessor.js";
import { createTables, moduleRunner, moduleType } from "./moduleRunner.js";
import {
  ModuleParameter,
  ModuleParameterTable,
} from "./src/DSSpecific/ModuleParameterTable.js";
import { FileIO } from "./src/v1/_FileIO.js";
import { SimpleModuleClass } from "./src/v2/FhxComponents/SimpleComponent.js";
// import { getModuleParameters } from "./src/DSSpecific/ModuleParameterTable.js";
// import { getFunctionBlocks } from "./src/DSSpecific/FunctionBlockTable.js";

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
const fhx = fs.readFileSync(emsfilepath, "utf-16le");
const Module_Class = "MODULE_CLASS";
const Function_Block = "FUNCTION_BLOCK";
const Function_Block_Definition = "FUNCTION_BLOCK_DEFINITION";
const Definition = "DEFINITION";
const emname = "_E_M_AGIT";
const cmname = "_C_M_AI";
const em_E_M_AGITFhx = fs.readFileSync("./fhx/_E_M_AGIT.fhx", "utf-16le");

function runner(fhx) {
  moduleRunner(fhx);
}

function runner2() {
  // const em_E_M_AGITFhx = fs.readFileSync("./fhx/_E_M_AGIT.fhx", "utf-16le");

  const fhx = em_E_M_AGITFhx;

  let _E_M_AGITModuleClass = new SimpleModuleClass(fhx); // create a simple module class object

  let fblist = _E_M_AGITModuleClass.listFunctionBlocks();
  let FBs = _E_M_AGITModuleClass.functionBlocks; // use the class function to find all function blocks
  let FBsDef = FBs.map((fb) => {
    // use the class function to find all function block definitions
    const def = _E_M_AGITModuleClass.findFunctionBlockDefinition(
      fhx,
      fb.definition
    ); // find the type of the function block definition it is
    let type;
    if (def) type = moduleType(def);
    else type = "OOB";
    return type; // return the type of the function block definition
  });

  return;
}
// runner(fhx);
runner2(fhx);

function getModuleParameters(moduleBlock) {
  let moduleParameters = [];

  // Find Attribute blocks with CATEGORY=COMMON
  let attributes = fhxProcessor.findBlocks(moduleBlock, "ATTRIBUTE").filter(
    (attribute) => attribute.includes("CATEGORY=COMMON") // Filter attributes with CATEGORY=COMMON, i.e. module parameters
  );
  // Find Attribute Instance blocks of the Module Parameters
  let attributeInstances = fhxProcessor.findBlocks(
    moduleBlock,
    "ATTRIBUTE_INSTANCE"
  ); // Find  all attribute instances of the module

  // for each module parameter defined in attribute instance
  // find the parameter value described in attribute instances
  // every module parameter should have a value, if not throw an error
  for (const attrIndex in attributes) {
    for (const attrInstanceIndex in attributeInstances) {
      const attributeInstance = attributeInstances[attrInstanceIndex];
      const attribute = attributes[attrIndex];
      if (
        // find the attribute instance associated with the attribute that are module parameters
        fhxProcessor.valueOfParameter(attribute, "NAME") ===
        fhxProcessor.valueOfParameter(attributeInstance, "NAME")
      ) {
        moduleParameters.push(
          // Create a list of ModuleParameter objects from those parameters
          new ModuleParameter(
            fhxProcessor.valueOfParameter(attributeInstance, "NAME"),
            fhxProcessor.valueOfParameter(attribute, "TYPE"),
            attributeInstance
          )
        );
      }
    }
  }

  return new ModuleParameterTable(moduleParameters);
}
