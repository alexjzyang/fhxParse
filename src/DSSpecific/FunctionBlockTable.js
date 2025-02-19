/**
 * Continuing the effort of generating Design Specification related tables
 * The input portion of the code is copied from previous files, ModuleParameterTable.js
 */

import {
    findBlocks,
    valueOfParameter,
    findBlockWithName,
} from "../util/FhxUtil.js";
import { DSTable } from "./Common.js";

/**
 * The Function Block table should be generated in the following format:
 *
 * Name | Function Block Type
 * AI1  | AI
 *
 *
 */

/**
 * Retrieves function blocks for a given module name.
 * @param {Object} fhxdata - The overall FHX data.
 * @param {string} modulename - The name of the module.
 * @returns {FunctionBlockTable} - The table of function blocks.
 */
function getFunctionBlocks(fhxdata, modulename) {
    let module_fhxdata = findBlockWithName(fhxdata, "MODULE_CLASS", modulename); // isolate the module class block

    let functionBlocksFhx = findBlocks(module_fhxdata, "FUNCTION_BLOCK"); // find all function blocks in the module class block

    // if a function block has a definition that can be found in the overall fhx,
    // it is possible that that function block definition is filed under a particular
    // "CATEGORY" for instance "Library/CompositeTemplates/M_CM_Composites"

    let functionBlocks = functionBlocksFhx.map((fb) => {
        // get a list of name and definition of each function block
        let name = valueOfParameter(fb, "NAME");
        let definition = valueOfParameter(fb, "DEFINITION");
        return { name, definition };
    });

    //Filter out linked composites from the list of Function Block Definitions
    functionBlocks = functionBlocks.filter((fb) => {
        let definitionBlock = findBlockWithName(
            fhxdata,
            "FUNCTION_BLOCK_DEFINITION",
            fb.definition
        );
        if (definitionBlock) {
            // if a function block doesn't have a definition block then it is a OOB block
            let category = valueOfParameter(definitionBlock, "CATEGORY");
            if (
                category.includes("Library/CompositeTemplates") ||
                category === ""
            ) {
                // if there is a function block definition with category in CompositeTemplates, it is a linked composite
                // if the category is empty, it is an embedded composite
                return false;
            } else
                throw new Error(
                    "Function Block definition not a linked composite. Case not handled."
                );
        } else return true;
    });

    let functionBlockProperties = functionBlocks.map((fb) => {
        return new FunctionBlockProperty(fb.name, fb.definition);
    }); // create a list of FunctionBlockProperty objects

    let table = new FunctionBlockTable(functionBlockProperties); // return FunctionBlockTable object
    return table;
}

/**
 * Represents a function block property.
 * @class
 */
class FunctionBlockProperty {
    /**
     * @param {string} name - The name of the function block.
     * @param {string} definition - The definition of the function block.
     */
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
/**
 * Represents a table of function blocks.
 * @class
 * @extends DSTable
 */
class FunctionBlockTable extends DSTable {
    /**
     * Creates an instance of FunctionBlockTable.
     * @param {Array<FunctionBlockProperty>} functionBlocks - The list of function blocks.
     */
    constructor(functionBlocks) {
        super("Function Blocks", ["Name", "Definition"], functionBlocks); // Instantiate a table object with tableName, tableHeader and data
    }

    toCsvString() {
        // convert the table object to a csv string ready to be written to a csv file
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
