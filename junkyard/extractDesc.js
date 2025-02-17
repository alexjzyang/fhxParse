/*
    Goal:
    Similar to extractName logic, this file aims to test different logic to 
    extract fhx blocks description
*/

/**
 * This class aims to encaptulate all the fhx in the input library
 */

import fs from "fs";
import path from "path";

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
  FHX_Filenames_25NOV24.Phase
);
/**
 * Future Project:
 * signature: fhxfiles.path.Export_25NOV24.Control_Module_Class => returns
 * path.join(FHX_Path, FHX_Export_25NOV24, FHX_Filenames_25NOV24.Control_Module_Class)
 *
 */

console.log("Loading file: " + fhxfilepath);
const fhx_data = fs.readFileSync(fhxfilepath, "utf-16le");

//////////////////////////////////////////////////////
// Use one single block as input.
/**
 *
 * @param {string} data fhx
 * @param {string} blockKey e.g. FUNCTION_BLOCK_DEFINITION
 * @param {string} blockName MYCONTROLMODULE
 */
function findDesc(data, blockKey, blockName) {
  const searchFor = `${blockKey} NAME="${blockName}"`;
  const blockIndex = data.indexOf(searchFor);

  for (let i = 0; i < 4; i++) {
    const nextEolIndex = data.indexOf("\r\n", nextEolIndex + 1);
  }

  if (blockIndex === -1 || nextEolIndex === -1) {
    console.log("no indices found");
  } else {
    const desc = `DESCRIPTION="`;
    console.log(data.substring(nextEolIndex, nextEolIndex + 20));
  }
}

function blockIsolation() {}

const blockKey = "MODULE_CLASS";
const blockName = "_C_M_AGIT_M";
function runner(data) {
  console.log(findDesc(data, blockKey, blockName));
}

export default runner(fhx_data);
