/**
 * Composite Blocks have a similar structure to Function Blocks
 * Except that their definition can be found in the fhx file
 *
 * If the CATEGORY of the composite's FUNCTION_BLOCK_DEFINITION
 * constains "Library/CompositeTemplates", then it is a linked composite
 * if the CATEGORY of the composite's FUNCTION_BLOCK_DEFINITION
 * is an empty string, then it is a embedded composite
 */

import {
  findBlocks,
  findBlockWithName,
  valueOfParameter,
} from "../v1/_FhxProcessor.js";
import { DSTable } from "./Common.js";

/**
 * The Function Block table should be generated in the following format:
 *
 * Name | Function Block Type
 * AI1  | AI
 *
 *
 */

function getCompositeBlocks(fhxdata, modulename) {
  let module_fhxdata = findBlockWithName(fhxdata, "MODULE_CLASS", modulename);

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
  let compositeBlocks = functionBlocks.filter((fb) => {
    let definitionBlock = findBlockWithName(
      fhxdata,
      "FUNCTION_BLOCK_DEFINITION",
      fb.definition
    );
    if (definitionBlock) {
      let category = valueOfParameter(definitionBlock, "CATEGORY");
      if (category.includes("Library/CompositeTemplates")) {
        fb.type = "Linked Composite";
        return true;
      } else if (category === "") {
        fb.type = "Embedded Composite";
        return true;
      } else
        throw new Error(
          "Function Block definition not a linked composite. Case not handled."
        );
    } else return false;
  });
  let embeddedCompositeBlockProperties = [];
  let linkedCompositeBlockProperies = [];

  compositeBlocks.forEach((fb) => {
    if (fb.type === "Linked Composite") {
      linkedCompositeBlockProperies.push(
        new LinkedCompositeBlockPropery(fb.name, fb.definition)
      );
    } else if (fb.type === "Embedded Composite") {
      embeddedCompositeBlockProperties.push(
        new EmbeddedCompositeBlockPropery(fb.name)
      );
    } else {
      throw new Error("Composite Block type not handled.");
    }
  });
  return {
    embedded: new EmbeddedCompositeBlockTable(embeddedCompositeBlockProperties),
    linked: new LinkedCompositeBlockTable(linkedCompositeBlockProperies),
  };
}

class LinkedCompositeBlockPropery {
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
class LinkedCompositeBlockTable extends DSTable {
  constructor(block) {
    super("Composite Blocks", ["Name", "Definition"], block);
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

class EmbeddedCompositeBlockPropery {
  constructor(name) {
    this.name = name;
  }

  toString() {
    return `${this.name}`;
  }
}

// Since they have very similar syntax to function blocks,
// FunctionBlockTable should also handle linked composites.
class EmbeddedCompositeBlockTable extends DSTable {
  constructor(block) {
    super("Embedded Composite Blocks", ["NAME"], block);
  }

  toCsvString() {
    let csv = "";
    if (this.tableHeader) csv += this.tableHeader.join(",") + "\n";

    for (const { name } of this.data.sort((a, b) =>
      a.name.localeCompare(b.name)
    )) {
      let row = [name];
      csv += row.join(",") + "\n";
    }
    return csv;
  }
}

export { getCompositeBlocks };
