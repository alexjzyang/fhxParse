/**
 * The design of HandleComposites.js
 *
 * 1. Find composites given a MODULE_CLASS
 * 2. Identifies the type of composites
 * 3. Finds the composites definition
 * 4. Process the composites and extract relevant data
 * 5. Examine whether there is nested composites
 *
 * 6. Consume the fhx content as it is being identified.
 */

import { getModuleParameters } from "../DSSpecific/ModuleParameterTable.js";
import {
    FunctionBlockDefinition,
    ModuleClass,
} from "./FhxComponents/SimpleComponent.js";

function handleModuleClass(fhxdata, fhx_moduleclass) {
    // create module class object
    let moduleClass = new ModuleClass(fhx_moduleclass);
    // find function block definitions names
    let functionBlockDefinitionNames = moduleClass.functionBlocks.map(
        (fb) => fb.definition
    );
    // create function block definition objects based on those definition names
    let functionBlockDefinitionsBlocks = functionBlockDefinitionNames.map(
        (fb) => {
            let block = findBlockWithName(
                fhxdata,
                "FUNCTION_BLOCK_DEFINITION",
                fb
            );
            return block;
        }
    );

    let moduleComponents = {};
    // Process module class object (piece by piece)
    let tables = {};
    let components = {};

    //	process attribute blocks
    components.attributes = moduleClass.attributes;
    //	process attribute instance blocks
    components.attributeInstances = moduleClass.attributeInstances;
    //	Create a tables
    tables.parameters = `${moduleClass.name} PARAMETERS TABLE`;
    tables.functionBlocks = `${moduleClass.name} FUNCTION BLOCKS TABLE`;

    moduleComponents.tables = tables;
    moduleComponents.components = components;

    // process function block definition objects (piece by piece)
    let functionBlockComponents = functionBlockDefinitionsBlocks.map((fb) =>
        blockProcessor(fb)
    );
    moduleComponents.components.functionBlocks = functionBlockComponents;
    return moduleComponents;
}

function blockProcessor(blockObj) {
    let components = {};
    let tables = {};

    //	process attribute blocks
    components.attributes = block.attributes;
    //	process attribute instance blocks
    components.attributeInstances = block.attributeInstances;
    //	Create a tables

    tables.parameters = `${block.name} PARAMETERS TABLE`;
    tables.functionBlocks = `${block.name} FUNCTION BLOCKS TABLE`;

    return { components, tables };
}

/**
 *
 * @param {string} fhxdata overall fhx data
 * @param {string} fhx_block fhx of a block (function block definition or module class block)
 * @returns
 */
function handleFunctionBlockDefinition(fhxdata, fhx_block) {
    // create function block definition object
    let fbdObj = new FunctionBlockDefinition(fhx_block);
    // calling the block processor
    let fbd = blockProcessor(fbdObj);

    // // Process module class object (piece by piece)
    // let tables = {};
    // let components = {};

    // //	process attribute blocks
    // components.attributes = fbdObj.attributes;
    // //	process attribute instance blocks
    // components.attributeInstances = fbdObj.attributeInstances;
    // //	Create a tables
    // // tables.parameters = getModuleParameters(fbdObj.block);
    // tables.parameters = `${fbdObj.name} PARAMETERS TABLE`;

    // test if the block definition has any function blocks associated with it
    if (fbdObj.functionBlocks.length > 0) {
        // find the names of the function block definitions
        let functionBlockDefinitionNames = fbdObj.functionBlocks.map(
            (fb) => fb.definition
        );

        //find function block definition of these nested function blocks
        let functionBlockDefinitionsBlocks = functionBlockDefinitionNames.map(
            (fb) => {
                let block = findBlockWithName(
                    fhxdata,
                    "FUNCTION_BLOCK_DEFINITION",
                    fb
                );
                return block;
            }
        );

        /*=== Type of function blocks Begin ===*/

        /*=== Type of function blocks End ===*/

        // create a sudo table. right now use a string to mimic the creation of tables
        tables.functionBlocks = `${fbdObj.name} FUNCTION BLOCKS TABLE`;

        // process nested blocks
        // !!!! This should create independant objects with references to the parent block
        let functionBlockComponents = functionBlockDefinitionsBlocks.map((fb) =>
            blockProcessor(fb)
        );

        fbd.components.functionBlocks = functionBlockComponents;
    }

    return fbd;
}
