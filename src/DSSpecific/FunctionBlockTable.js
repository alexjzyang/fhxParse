/**
 * Continuing the effort of generating Design Specification related tables
 * The input portion of the code is copied from previous files, ModuleParameterTable.js
 */

import {
  findBlocks,
  findBlockWithName,
  valueOfParameter,
} from "../v1/_FhxProcessor.js";
import { DSTable } from "./Common.js";
import path from "path";
import fs from "fs";

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

/**
 * The Function Block table should be generated in the following format:
 *
 * Name | Function Block Type
 * AI1  | AI
 *
 *
 */

function getFunctionBlocks() {
  // Find module block
  let cms_fhxdata = readFhx(cmsfilepath);
  let module_fhxdata = findBlockWithName(
    cms_fhxdata,
    "MODULE_CLASS",
    testCmName
  );

  let functionBlocksFhx = findBlocks(module_fhxdata, "FUNCTION_BLOCK");
  // if a function block has a definition that can be found in the overall fhx,
  // it is possible that that function block definition is filed under a particular
  // "CATEGORY" for instance "Library/CompositeTemplates/M_CM_Composites"

  let functionBlocks = functionBlocksFhx.map((fb) => {
    let name = valueOfParameter(fb, "NAME");
    let definition = valueOfParameter(fb, "DEFINITION");
    return { name, definition };
  });

  //Filter out linked composites
  functionBlocks = functionBlocks.filter((fb) => {
    let definitionBlock = findBlockWithName(
      cms_fhxdata,
      "FUNCTION_BLOCK_DEFINITION",
      fb.definition
    );
    if (definitionBlock) {
      let category = valueOfParameter(definitionBlock, "CATEGORY");
      if (category.includes("Library/CompositeTemplates")) {
        // fb.type = "Linked Composite";
        return false;
      } else
        throw new Error(
          "Function Block definition not a linked composite. Case not handled."
        );
    } else return true;
  });
  let functionBlockProperties = functionBlocks.map((fb) => {
    return new FunctionBlockProperty(fb.name, fb.definition);
  });

  let table = new FunctionBlockTable(functionBlockProperties);
  return table;
}

class FunctionBlockProperty {
  constructor(name, definition) {
    this.name = name;
    this.definition = definition;
  }

  toString() {
    return `${this.name} | ${this.definition}`;
  }
}

// Since they have very similar syntax to function blocks,
// FunctionBlockTable should also handle linked composites.
class FunctionBlockTable extends DSTable {
  constructor(functionBlocks) {
    super("Function Blocks", ["Name", "Definition"], functionBlocks);
  }

  toCsvString() {
    let csv = "";
    if (this.tableHeader) csv += this.tableHeader.join(",") + "\n";

    for (const { name, definition } of this.data.sort((a, b) =>
      a.name.localeCompare(b.name)
    )) {
      let row = [name, definition];
      csv += row.join(",") + "\n";
    }
    return csv;
  }
}

export { getFunctionBlocks };
