/**
 * Control Module Class Design Specification table generation
 *
 * List of Tables:
 *  Module Properties
 *  Module parameters
 *  Function Blocks
 *  Alarms
 *
 * The following code uses the v1 FhxParser code
 * Where new features are added, they will be explicitly written in this file
 */

import path from "path";
import fs from "fs";
import { findBlockWithName, valueOf } from "../v1/_FhxProcessor.js";

// Module Properties

/**
 * Table Format: Two Column Table
 *
 * Description | Module Description
 * Module Type | Analogue Input Module
 * Sub Type    | C_M_AI
 * ...
 */

// Inputs
const folderPath = "./fhx";
const filename = "Mixer Control_Module_Classes.fhx";
const cmsfilepath = path.join(folderPath, filename);
const moduleNames = [
  "_C_M_AI",
  "_C_M_AGIT_M",
  "_C_M_AI_TARE",
  "_C_M_DI",
  "_C_M_PID_1AI_M",
  "_C_M_PID_2AI_M",
  "_C_M_PID",
  "_C_M_TCU",
  "_C_M_UHM_M",
  "_C_M_USM_M",
];
const testCmName = "_C_M_AGIT_M";

// List of module properties
// DESCRIPTION="_M Analog Input Module with Sensor Failure CM"
// PERIOD=1
// PRIMARY_CONTROL_DISPLAY=""
// INSTRUMENT_AREA_DISPLAY="GEX_AI_STD_130_FP"
// DETAIL_DISPLAY="GEX_DIAG_130_DT"
// TYPE="Analogue Input  Module"
// SUB_TYPE="C_M_AI"
// NVM=F
// PERSIST=INITIALIZE

const moduleProperties = [
  "DESCRIPTION",
  "PERIOD",
  "PRIMARY_CONTROL_DISPLAY",
  "INSTRUMENT_AREA_DISPLAY",
  "DETAIL_DISPLAY",
  "TYPE",
  "SUB_TYPE",
  "NVM",
  "PERSIST",
];

function readFhx(filepath) {
  let data;
  try {
    data = fs.readFileSync(filepath, "utf16le");
    // console.log("File content:", data);
  } catch (err) {
    console.error("Error reading file:", err);
  }
  return data;
}

function getModuleProperties() {
  let cms_fhxdata = readFhx(cmsfilepath);
  let module_fhxdata = findBlockWithName(
    cms_fhxdata,
    "MODULE_CLASS",
    testCmName
  );

  // obtain all module properties
  let cmProperties = moduleProperties.map((property) => {
    // instead of mapping, we can possibly use an switch statement like in module property table.js
    let value = valueOf(module_fhxdata, property);
    return new moduleProperty(property, value);
  });

  // compiling into table
  return new PropertyTable(cmProperties);
}

class moduleProperty {
  constructor(property, value) {
    this.property = property;
    this.value = value;
  }
  toString() {
    return `${this.property} | ${this.value}`;
  }
}

class PropertyTable extends DSTable {
  constructor(moduleProperties) {
    super("Module Properties", null, moduleProperties);
  }

  toCsvString() {
    let csv = "";
    if (this.tableHeader) csv += this.tableHeader.join(",") + "\n";

    for (const { property, value } of this.data.sort((a, b) =>
      a.property.localeCompare(b.property)
    )) {
      let row = [property, value];
      csv += row.join(",") + "\n";
    }
    return csv;
  }
}

export { getModuleProperties };
