/**
 * This class aims to encapsulate all the fhx in the input library
 */

import fs from "fs";
import path from "path";
import * as fhxProcessor from "./src/fhxProcessor.js";
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

const FHX_Export_18NOV2024 = "NCTM Mixer Export 18NOV24";
const FHX_Filenames_18NOV24 = {
  Control_Module_Class: "GEX_Control_Module_Classes.fhx",
};

const FHX_Filename = FHX_Filenames_18NOV24.Control_Module_Class;
const outputPath = "output";
const fhxfilepath = path.join(
  FHX_Path,
  FHX_Export_25NOV24,
  FHX_Filenames_25NOV24.Equipment_Module_Class
);
/**
 * Future Project:
 * signature: fhxfiles.path.Export_25NOV24.Control_Module_Class => returns
 * path.join(FHX_Path, FHX_Export_25NOV24, FHX_Filenames_25NOV24.Control_Module_Class)
 *
 */

console.log("Loading file: " + fhxfilepath);
const fhx_data = fs.readFileSync(fhxfilepath, "utf-16le");

function test() {
  let module = fhxProcessor.fhxObject(fhx_data, "MODULE_CLASS", "_E_M_AGIT");

  let attributes = fhxProcessor.findBlocks(module, "ATTRIBUTE"); // Find all attribute blocks
  let attributeInstances = fhxProcessor.findBlocks(
    module,
    "ATTRIBUTE_INSTANCE"
  ); // Find all attribute instance blocks

  let configurableAttributes = attributes.filter((attribute) =>
    attribute.includes("CATEGORY=COMMON")
  ); // Filter CATEGORY=COMMON attributes
  console.log("Configurable Attributes: ", configurableAttributes.length);
  console.log("Attribute Instances: ", attributeInstances.length);
  let configurableAttributesNames = configurableAttributes.map((attribute) => {
    return fhxProcessor.nameOf(attribute);
  });
  let attributeInstancesNames = attributeInstances.map((instance) => {
    return fhxProcessor.nameOf(instance);
  });

  // list of configurable attributes that aren't associated with an attribute instance

  let missingInstances = configurableAttributesNames.filter(
    (name) => !attributeInstancesNames.includes(name)
  );
  console.log(
    "configurable attributes (parameters with CATEGORY+COMMON) which do not have a attribute instance block: ",
    missingInstances
  );
  // list of attribute instances that don't have a configurable attribute
  let missingAttributes = attributeInstancesNames
    .filter((name) => !configurableAttributesNames.includes(name))
    .sort((a, b) => a.localeCompare(b));
  console.log(
    "attribute instances which do not have a configurable attribute: ",
    missingAttributes
  );
  FileIO.writeTxtFileConcat(missingAttributes, "output", "missingAttributes");
}

// test(fhx_data);

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
