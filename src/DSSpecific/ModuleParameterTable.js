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

import {
  findBlocks,
  findBlockWithName,
  valueOfParameter,
} from "../v1/_FhxProcessor.js";
import { DSTable } from "./Common.js";

function getModuleParameters(fhxdata, modulename) {
  let module_fhxdata = findBlockWithName(fhxdata, "MODULE_CLASS", modulename);

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
    case "FLOAT_WITH_STATUS": // Float with Status"
      value = valueOfParameter(block, "CV");
      break;
    case "INTERNAL_REFERENCE": // Internal Reference
    case "EXTERNAL_REFERENCE": // External Reference
    case "DYNAMIC_REFERENCE": // Dynamic Reference
      value = valueOfParameter(block, "REF") || "";
      break;
    case "MODE": // Mode
      value = valueFromMode(block);
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

/**
 * Sample Mode Attribute Instance Block
 *  ATTRIBUTE_INSTANCE NAME="REQ_MODE"
  {
    VALUE
    {
      OOS_P=F
      IMAN_P=T
      LOV_P=T
      MAN_P=F
      AUTO_P=F
      CAS_P=T
      RCAS_P=T
      ROUT_P=T
      OOS_A=T
      IMAN_A=T
      LOV_A=T
      MAN_A=T
      AUTO_A=T
      CAS_A=T
      RCAS_A=T
      ROUT_A=T
      TARGET=RCAS
      NORMAL=RCAS
    }
    EXPOSE=F
    EXPOSE_IS_OVERRIDDEN=T
  }
 * 
 */
function valueFromMode(block) {
  let modeOptions = [
    { fhxKey: "OOS_P", modeName: "Out of Servive" },
    { fhxKey: "IMAN_P", modeName: "Initialization Manual" },
    { fhxKey: "LOV_P", modeName: "Local Override" },
    { fhxKey: "MAN_P", modeName: "Manual" },
    { fhxKey: "AUTO_P", modeName: "Auto" },
    { fhxKey: "CAS_P", modeName: "Cascade" },
    { fhxKey: "RCAS_P", modeName: "Remote Cascade" },
    { fhxKey: "ROUT_P", modeName: "Remote Out" },
  ];

  let textValue = "Permitted Modes: ";
  if (block.includes(`OOS_P=T`)) textValue += "Out of Service";
  if (block.includes(`MAN_P=T`)) textValue += " Manual";
  if (block.includes(`AUTO_P=T`)) textValue += " Auto";
  if (block.includes(`CAS_P=T`)) textValue += " Cascade";
  if (block.includes(`RCAS_P=T`)) textValue += " Remote Cascade";
  if (block.includes(`ROUT_P=T`)) textValue += " Remote Out";
  return textValue;
}

export { getModuleParameters };
