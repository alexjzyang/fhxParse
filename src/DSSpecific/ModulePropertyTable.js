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
import { findBlockWithName, valueOfParameter } from "../v1/_FhxProcessor.js";
import { DSTable } from "./Common.js";

// Module Properties

/**
 * Table Format: Two Column Table
 *
 * Description | Module Description
 * Module Type | Analogue Input Module
 * Sub Type    | C_M_AI
 * ...
 */

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

function getModuleProperties(fhxdata, modulename) {
  let module_fhxdata = findBlockWithName(fhxdata, "MODULE_CLASS", modulename);

  // obtain all module properties
  let cmProperties = moduleProperties.map((property) => {
    // instead of mapping, we can possibly use an switch statement like in module property table.js
    let value = valueOfParameter(module_fhxdata, property);
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
