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
  FHX_Filenames_25NOV24.Control_Module_Class
);
/**
 * Future Project:
 * signature: fhxfiles.path.Export_25NOV24.Control_Module_Class => returns
 * path.join(FHX_Path, FHX_Export_25NOV24, FHX_Filenames_25NOV24.Control_Module_Class)
 *
 */

console.log("Loading file: " + fhxfilepath);
const fhx_data = fs.readFileSync(fhxfilepath, "utf-16le");
