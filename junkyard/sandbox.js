/**
 * This class aims to encapsulate all the fhx in the input library
 */

import fs from "fs";
import path from "path";
// import * as fhxProcessor from "./src/FhxProcessor.js";
import { findBlockWithName } from "./src/v1/_FhxProcessor.js";

function test() {
    let module = fhxProcessor.fhxObject(fhx_data, "MODULE_CLASS", "_E_M_AGIT");

    let attributes = fhxProcessor.findBlocks(module, "ATTRIBUTE"); // Find all attribute blocks
    let attributeInstances = fhxProcessor.findBlocks(
        module,
        "ATTRIBUTE_INSTANCE"
    ); // Find all attribute instance blocks

    let configurableAttributes = attributes.filter((attribute) =>
        attribute.includes("CATEGORY=COMMON")
    ); // Filter CATEGORY=COMMON attributes
    console.log("Configurable Attributes: ", configurableAttributes.length);
    console.log("Attribute Instances: ", attributeInstances.length);
    let configurableAttributesNames = configurableAttributes.map(
        (attribute) => {
            return fhxProcessor.nameOf(attribute);
        }
    );
    let attributeInstancesNames = attributeInstances.map((instance) => {
        return fhxProcessor.nameOf(instance);
    });

    // list of configurable attributes that aren't associated with an attribute instance
    let missingInstances = configurableAttributesNames.filter(
        (name) => !attributeInstancesNames.includes(name)
    );
    console.log(
        "configurable attributes (parameters with CATEGORY+COMMON) which do not have a attribute instance block: ",
        missingInstances
    );
    // list of attribute instances that don't have a configurable attribute
    let missingAttributes = attributeInstancesNames
        .filter((name) => !configurableAttributesNames.includes(name))
        .sort((a, b) => a.localeCompare(b));
    console.log(
        "attribute instances which do not have a configurable attribute: ",
        missingAttributes
    );
}

function findValueIn(fhx_data, blockType, name, property) {
    let cmblock = fhxProcessor.fhxObject(fhx_data, "MODULE_CLASS", cmname);
    let attrBlock = fhxProcessor.fhxObject(cmblock, blockType, name);
    console.log(attrBlock);
    let cv = fhxProcessor.valueOf(attrBlock, property);
    console.log(cv);
}

let tree = [
    { block: "MODULE_CLASS", property: "_C_M_AI" },
    { block: "ATTRIBUTE", property: "SENS_FAILURE" },
];

let property = "CATEGORY";

function findValueInTree(fhx_data, tree, property) {
    let block = fhx_data;
    for (let i = 0; i < tree.length; i++) {
        block = fhxProcessor.fhxObject(block, tree[i].block, tree[i].property);
    }
    return fhxProcessor.valueOfParameter(block, property);
}

function runner(fhx) {
    let data = findBlockWithName(
        fhx,
        "FUNCTION_BLOCK_DEFINITION",
        "_CT_M_CMD_CTRL"
    );
    fs.writeFileSync("output/temp/_CT_M_CMD_CTRL.txt", data, "utf-8");
}
const em_E_M_AGITFhx = fs.readFileSync("./fhx/_E_M_AGIT.fhx", "utf-16le");

runner(em_E_M_AGITFhx);
