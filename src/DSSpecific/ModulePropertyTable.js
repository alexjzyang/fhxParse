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
import { valueOfParameter } from "../util/FhxUtil.js";
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
    // list of module properties
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

/**
 * Retrieves module properties for a given module name.
 * @param {string} moduleBlock - The fhx string of a single MODULE_CLASS block
 * @returns {PropertyTable} - The table of module properties.
 */
function getModuleProperties(moduleBlock) {
    // obtain all module properties
    let cmProperties = moduleProperties.map((property) => {
        // find all module properties based on the list of module properties above
        // instead of mapping, we can possibly use an switch statement like in module property table.js
        let value = valueOfParameter(moduleBlock, property);
        return new ModuleProperty(property, value);
    });

    // compiling into table
    return new PropertyTable(cmProperties); // Create a new PropertyTable object with the list of module properties
}

/**
 * Represents a module property.
 * @class
 */

class ModuleProperty {
    /**
     * Creates an instance of moduleProperty.
     * For example, the property = "DESCRIPTION"; value= "Analogue Input Module"
     *
     * @param {string} property - The property name.
     * @param {string} value - The property value.
     */
    constructor(property, value) {
        this.property = property;
        this.value = value;
    }
    toString() {
        return `${this.property} | ${this.value}`;
    }
}

/**
 * Represents a table of module properties.
 * @class
 * @extends DSTable
 */
class PropertyTable extends DSTable {
    /**
     * Creates an instance of PropertyTable.
     * @param {Array<ModuleProperty>} moduleProperties - The list of module properties.
     */
    constructor(moduleProperties) {
        super("Module Properties", null, moduleProperties); // Instantiate a table of properties with Table name, header and data
    }

    toCsvString() {
        // Convert the table to a CSV string
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
