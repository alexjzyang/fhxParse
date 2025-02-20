/**
 * tableGenerator() function will generate CSV files given a fhx string
 */

import { FileIO } from "../util/FileIO.js";
import { getModuleParameters } from "./ModuleParameterTable.js";
import { getModuleProperties } from "./ModulePropertyTable.js";
import { getFunctionBlocks } from "./FunctionBlockTable.js";
import { getCompositeBlocks } from "./CompositeTable.js";
import { getAlarms } from "./AlarmTable.js";
import { getHistoryCollection } from "./HistoryTable.js";
import { getEMCommands } from "./EMCommands.js";
import { getEMChildDevices } from "./EMChildDevices.js";
import { createTestFolder } from "../util/OutputFolderGenerator.js";
import {
    valueOfParameter,
    findBlocks,
    findBlockWithName,
} from "../util/FhxUtil.js";
import path from "path";

// Process the class and equipment modules given a fhx file
// The fhx file has to include the definition of the composites
/**
 *
 * @param {string} fhxdata fhx data, which contains module blocks and the definitions of their embedded composites
 * @param {*} options {outputBaseDir, outputBaseName} indicates the output directory
 * @returns
 */
export function tableGenerator(
    fhxdata,
    options = { outputBaseDir: "test/output", outputBaseName: "RUN" }
) {
    let { outputBaseDir, outputBaseName } = options; // destruct the options object

    let modules = findBlocks(fhxdata, "MODULE_CLASS") // find all module blocks
        .map((block) => {
            // this can be encaptulated in a class containing a block, with name and fhx info
            return {
                // return the block's name and fhx
                name: valueOfParameter(block, "NAME"),
                fhx: block,
            };
        });

    // create output folder
    let runFolder = createTestFolder(outputBaseDir, outputBaseName, new Date());

    modules.forEach((module) => {
        // loop through all the modules
        module.type = moduleType(module.fhx); // module.fhx is a function block definition

        let moduleTables = createTables(fhxdata, module); // create tables for the module
        // add module name to the output subfolder
        let outputPath = path.join(runFolder, module.name);

        // extract csv string from each tables
        let propertiesCsv = moduleTables.properties.toCsvString();
        let parametersCsv = moduleTables.parameters.toCsvString();
        let functionBlocksCsv = moduleTables.functionBlocks.toCsvString();
        let embeddedCompositeBlocksCsv =
            moduleTables.compositeBlocks.embedded.toCsvString();
        let linkedCompositeBlocksCsv =
            moduleTables.compositeBlocks.linked.toCsvString();
        let alarmsCsv = moduleTables.alarms.toCsvString();
        let historyCollectionCsv = moduleTables.historyCollection.toCsvString();
        let commandsCsv, childDevicesCsv;

        // EM has additional tables
        if (module.type === "Equipment Module Class") {
            commandsCsv = moduleTables.commands.toCsvString();
            childDevicesCsv = moduleTables.childDevices.toCsvString();
        }
        FileIO.writeFile(
            path.join(outputPath, `${module.name}.txt`),
            module.fhx
        );
        // write the csv string to a file
        FileIO.writeFile(
            path.join(outputPath, "properties.csv"),
            propertiesCsv
        );
        FileIO.writeFile(
            path.join(outputPath, "parameters.csv"),
            parametersCsv
        );
        FileIO.writeFile(
            path.join(outputPath, "functionBlocks.csv"),
            functionBlocksCsv
        );
        FileIO.writeFile(
            path.join(outputPath, "emBeddedCompositeBlocks.csv"),
            embeddedCompositeBlocksCsv
        );
        FileIO.writeFile(
            path.join(outputPath, "linkedCompositeBlocks.csv"),
            linkedCompositeBlocksCsv
        );
        FileIO.writeFile(path.join(outputPath, "alarms.csv"), alarmsCsv);
        FileIO.writeFile(
            path.join(outputPath, "getHistoryCollection.csv"),
            historyCollectionCsv
        );
        if (module.type === "Equipment Module Class") {
            FileIO.writeFile(
                path.join(outputPath, "commands.csv"),
                commandsCsv
            );
            FileIO.writeFile(
                path.join(outputPath, "childDevices.csv"),
                childDevicesCsv
            );
        }
        // Combine all CSV strings into one with respective names and extra lines between them
        let combinedCsv = `Properties,Table Size: 2 X ${moduleTables.properties.data.length}\n${propertiesCsv}`;
        if (module.type === "Equipment Module Class") {
            combinedCsv += `\nCommands,Table Size: 2 X ${moduleTables.commands.data.length}\n${commandsCsv}
  \nChild Devices,Table Size: 3 X ${moduleTables.childDevices.data.length}\n${childDevicesCsv}`;
        }
        combinedCsv += `\nParameters,Table Size: 3 X ${
            moduleTables.parameters.data.length + 1
        }\n${parametersCsv}
      \nFunction Blocks,Table Size: 2 X ${
          moduleTables.functionBlocks.data.length + 1
      }\n${functionBlocksCsv}
      \nEmbedded Composite Blocks,Table Size: 1 X ${
          moduleTables.compositeBlocks.embedded.data.length + 1
      }\n${embeddedCompositeBlocksCsv}
      \nLinked Composite Blocks,Table Size: 2 X ${
          moduleTables.compositeBlocks.linked.data.length + 1
      }\n${linkedCompositeBlocksCsv}
      \nAlarms,Table Size: 7 X ${
          moduleTables.alarms.data.length + 1
      }\n${alarmsCsv}
      \nHistory Collection,Table Size: 8 X ${
          moduleTables.historyCollection.data.length + 1
      }\n${historyCollectionCsv}`;

        // Write the combined CSV string to a new file
        FileIO.writeFile(path.join(outputPath, "combined.csv"), combinedCsv);
    });
    return;
}

// Other Code //

// /**
//  * Finds all command definitions for a given Equipment Module (EM) in the provided FHX data.
//  * Extracts the command names and their definitions.
//  *
//  * @param {string} fhx_data - The FHX data as a string.
//  * @param {string} modulename - The name of the Equipment Module.
//  * @returns {Array<{name: string, definition: string}>} - An array of objects containing the command names and their definitions.
//  */
// function listEMCommands(emfhx) {
//   // let emname = nameOf(emfhx);

//   let commandsFhx = dscreator.findAll(emfhx, Function_Block, {
//     value: "COMMAND_00",
//     key: "NAME",
//   });

//   let cmds = commandsFhx.map((block) => {
//     let commandname = valueOfParameter(block, "NAME");
//     let commanddefinition = valueOfParameter(block, "DEFINITION");
//     return { name: commandname, definition: commanddefinition };
//   });
//   return cmds;
// }

// /**
//  * Compiles all command definitions for a given Equipment Module (EM) in the provided FHX data.
//  * Extracts the command names, their definitions, and writes them to text files.
//  *
//  * @param {string} emFhxData - The FHX data as a string.
//  * @param {string} emname - The name of the Equipment Module.
//  * @returns {Array<{filename: string, data: string}>} - An array of objects containing the filenames and their data.
//  */
// function compileEMCommands(emFhxData, emname) {
//   // Get a list of names and their definition for the Equipment Module (enname)
//   let emCommands = findEMCommands(emFhxData, emname);

//   // add fhx data to each command
//   emCommands.map((command) => {
//     let definitionBlock = findBlockWithName(
//       emFhxData,
//       Function_Block_Definition,
//       command.definition
//     );
//     command.fhx = definitionBlock;
//   });

//   // Create an array of files with command names and their data for processing with FileIO
//   let files = emCommands.map((command) => {
//     let filename = command.name;
//     let data = command.fhx;
//     return { filename, data };
//   });

//   // Define the output path for the command files
//   let emOutputPath = path.join(outputPath, emname, "commands");

//   // Write the command files to the output path
//   // FileIO.writeTxtFiles(files, emOutputPath, true);

//   // Return the array of files
//   return files;
// }

// function cmdRunner(ems_fhxdata) {
//   let emfhxdata = findBlockWithName(
//     ems_fhxdata,
//     Module_Class,
//     emname
//   );
//   let emCommands = listEMCommands(emfhxdata);
//   let cmdFhx = dscreator.findCompositeDefinitionOf(
//     emfhxdata,
//     ems_fhxdata,
//     emCommands[0].name
//   );

//   let sfcdata = processSFC(cmdFhx);
//   dscreator.sfcToCsv(outputPath, "sfc.csv", cmdFhx);
//   return;
// }

function processComposites(fhx_data, functionBlock) {
    let definition = valueOfParameter(functionBlock, "DEFINITION"); // identify the name of the associated function block definition
    let block = findBlockWithName(
        fhx_data,
        "FUNCTION_BLOCK_DEFINITION",
        definition
    ); // finds the function block definintion of
    let type = moduleType(block);
}

export function moduleType(block) {
    // block is a function block definition
    let type;
    let category = valueOfParameter(block, "CATEGORY");

    switch (true) {
        case category.includes("Library/CompositeTemplates"):
            type = "Linked Composite";
            break;
        case category === "":
            type = "Embedded Composite";
            break;
        case category.includes("Library/Control Module Classes"):
            type = "Control Module Class";
            break;
        case category.includes("Library/Equipment Module Classes"):
            type = "Equipment Module Class";
            break;
        default:
            throw new Error(
                "Function Block definition not a linked composite. Case not handled."
            );
    }
    return type;
}

/**
 *
 * @param {object} module {fhx,name, type}
 * [type] is identified using the CATEGORY parameter of the function block definition
 * Possible values currently being handled are "Linked Composite" and "Embedded Composite"
 * "Control Module Class" and "Equipment Module Class"
 * @returns {object} res, which contains relevant tables for DS creation
 */
function createTables(fhxdata, { fhx, name, type }) {
    let moduleBlock = findBlockWithName(fhx, "MODULE_CLASS", name);

    let res = {
        properties: getModuleProperties(moduleBlock),
        parameters: getModuleParameters(moduleBlock),
        functionBlocks: getFunctionBlocks(fhx, name),
        compositeBlocks: getCompositeBlocks(fhx, name),
        alarms: getAlarms(moduleBlock),
        historyCollection: getHistoryCollection(moduleBlock),
    };

    if (type === "Equipment Module Class") {
        // if (type === "Embedded Composite") {
        res.commands = getEMCommands(fhxdata, moduleBlock);
        res.childDevices = getEMChildDevices(fhxdata, moduleBlock);
    }
    return res;
}
