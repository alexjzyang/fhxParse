// import { FhxProcessor, FileIO, namesFromIndex } from "fhxtool";
import fs from "fs";
import path from "path";
import * as dscreater from "./DSCreater.js";
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
/**
 * Find the property values of a module class block
 * @param {string} fhx_data input fhx data
 * @param {string} modulename the module which properties are to be found
 */
function obtainModuleParameters(fhx_data, modulename) {
  let block = fhxObject(fhx_data, "MODULE_CLASS", modulename);
  let properties = classProperties(block);
  let header = [
    { id: "Name", title: "Name" },
    { id: "Item", title: "Item" },
  ];
  let records = [];

  for (const key in properties) {
    if (Object.hasOwnProperty.call(properties, key)) {
      const property = properties[key];
      records.push({ Name: property.DVname, Item: property.value });
    }
  }
  writeCsv(header, records, outputPath, `${modulename}Properties.csv`);
}

function runner(fhx_data) {
  let blocks = dscreater.findBlocks(fhx_data, "MODULE_CLASS");
  blocks.forEach((block) => {
    if (
      dscreater.valueOf(block, "CATEGORY").includes("Equipment Module Classes")
    ) {
      let modulename = dscreater.valueOf(block, "NAME");
      FileIO.writeFiles(
        path.join(outputPath, "All EMC"),
        modulename,
        block,
        false
      );
    }
  });
}

const fhxfilepath = path.join(
  FHX_Path,
  FHX_Export_25NOV24,
  FHX_Filenames_25NOV24.Equipment_Module_Class
);

console.log("Loading file: " + fhxfilepath);
const fhx_data = fs.readFileSync(fhxfilepath, "utf-16le");
const modulename = "_E_M_AGIT";

runner(fhx_data);
