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
import {
  findBlocks,
  findBlockWithName,
  valueOfParameter,
} from "../v1/_FhxProcessor.js";
import { DSTable } from "./Common.js";

// Module Parameters

/**
 * Table Format: Three Column Table with Name, Type, Default Value
 *
 * Name      | Parameter Type    | Default Value
 * ----------|-------------------|----------------------------
 * A_COMMAND | ENUMERATION_VALUE | <$_N_M_GEXE_M_AGIT:Disable>
 * TIME_SAVE | FLOAT             | <0>
 * TASK_PTR  | UINT8             | <0>
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

function readFhx(filepath) {
  let data;
  try {
    data = fs.readFileSync(filepath, "utf16le");
  } catch (err) {
    console.error("Error reading file:", err);
  }
  return data;
}

function getModuleParameters() {
  // Find module block
  let cms_fhxdata = readFhx(cmsfilepath);
  let module_fhxdata = findBlockWithName(
    cms_fhxdata,
    "MODULE_CLASS",
    testCmName
  );

  let moduleParameters = [];

  // Find Attribute blocks with CATEGORY=COMMON
  let attributes = findBlocks(module_fhxdata, "ATTRIBUTE").filter((attribute) =>
    attribute.includes("CATEGORY=COMMON")
  );
  // Find Attribute Instance blocks of the Module Parameters
  let attributeInstances = findBlocks(module_fhxdata, "ATTRIBUTE_INSTANCE");

  // for each module parameter defined in attribute instance
  // find the parameter value described in attribute instances
  // every module parameter should have a value, if not throw an error
  for (const attrIndex in attributes) {
    for (const attrInstanceIndex in attributeInstances) {
      const attributeInstance = attributeInstances[attrInstanceIndex];
      const attribute = attributes[attrIndex];
      if (
        valueOfParameter(attribute, "NAME") ===
        valueOfParameter(attributeInstance, "NAME")
      ) {
        moduleParameters.push(
          new ModuleParameter(
            valueOfParameter(attributeInstance, "NAME"),
            valueOfParameter(attribute, "TYPE"),
            attributeInstance
          )
        );
      }
    }
  }

  return new ModuleParameterTable(moduleParameters);
}

class ModuleParameter {
  constructor(name, type, block) {
    this.name = name;
    this.type = type;
    this.block = block;
    this.defaultValue = valueFromBlock(this);
  }
  toString() {
    return `${this.name} | ${this.type} | ${this.defaultValue}`;
  }
}

class ModuleParameterTable extends DSTable {
  constructor(moduleParameters) {
    super(
      "Module Parameters",
      ["Name", "Parameter Type", "Default Value"],
      moduleParameters
    );
  }
  toCsvString() {
    let csv = "";
    if (this.tableHeader) csv += this.tableHeader.join(",") + "\n";

    for (const param of this.data.sort((a, b) =>
      a.name.localeCompare(b.name)
    )) {
      let row = [param.name, param.type, "<" + param.defaultValue + ">"];
      csv += row.join(",") + "\n";
    }
    return csv;
  }
}

function valueFromBlock({ type, block }) {
  let value;
  switch (type) {
    case "ENUMERATION_VALUE":
      let set = valueOfParameter(block, "SET");
      let option = valueOfParameter(block, "STRING_VALUE");
      value = `$${set}:${option}`;
      break;
    case "FLOAT":
    case "UINT8":
    case "UINT16":
    case "UINT32": // 32 bit unsigned integer
    case "INT8":
    case "INT16":
    case "INT32": // 32 bit signed integer
    case "BOOLEAN": // Boolean
    case "UNICODE_STRING": // String
      value = valueOfParameter(block, "CV");
      break;
    case "INTERNAL_REFERENCE": // Internal Reference
    case "EXTERNAL_REFERENCE": // External Reference
      value = valueOfParameter(block, "REF") || "";
      break;
    case "EVENT": // Alarm
      value = "ALARM";
      break;
    // Additional cases might be needed for other parameter types
    default:
      return;
  }
  return value;
}

export { getModuleParameters };
