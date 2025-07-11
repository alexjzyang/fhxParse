import { ModuleClassComponent } from "./src/ComponentObjects/Components.js";
import { FhxProcessor } from "./src/ComponentObjects/Managers.js";
import path from "path";

import { FileIO } from "./src/util/FileIO.js";
import fhxutil, { findBlocks } from "./src/util/FhxUtil.js";
import { DesignSpecTables } from "./src/ComponentObjects/DSProcessor.js";

// write the all function_block_definitions to temp output folder in txt format
function identifyFbd(fhx, outputpath = "test/output/temp") {
    let objectCreator = new FhxProcessor(fhx);
    let mgr = objectCreator.createManager();
    let moduleClassFhx = mgr.objects._E_M_AGIT.block;
    let moduleClass = new ModuleClassComponent(moduleClassFhx);
    let composites = moduleClass.functionBlocks
        .map((fb) => mgr.get(fb.definition))
        .filter((fb) => fb.type === "FUNCTION_BLOCK_DEFINITION");
    composites.forEach((fb) => {
        FileIO.writeFile(path.join(outputpath, fb.name + ".txt"), fb.block, {
            encoding: "utf8",
        });
    });
    return;
}

function allBlocks(fhx, type = "ATTRIBUTE") {
    let blocks = findBlocks(fhx, type);
    // console.log(`there are ${blocks.lenth} blocks found`);
    let res = blocks.join("\n");
    FileIO.writeFile(`test/output/temp/${type.toLowerCase()}.txt`, res, {
        encoding: "utf8",
    });
    return res;
}

function uniqueParams(fhx, blockType) {
    let elements = allBlocks(fhx, blockType);
    let lines = elements.split("\n");
    let res = "";
    let uniqueKeys = [];
    for (let line of lines) {
        line = line.trim();
        if (line === "{" || line === "}" || line === "") {
            continue;
        }
        let indexOfEqual = line.indexOf("=");
        let indexOfSpace = line.indexOf(" ");
        let endIndex;
        if (indexOfEqual === -1 && indexOfSpace === -1) {
            res += line + "\n";
            continue;
        } else if (indexOfEqual === -1 && indexOfSpace !== -1) {
            endIndex = indexOfSpace;
        } else if (indexOfEqual !== -1 && indexOfSpace === -1) {
            endIndex = indexOfEqual;
        } else {
            endIndex =
                indexOfEqual < indexOfSpace ? indexOfEqual : indexOfSpace;
        }
        let key = line.substring(0, endIndex).trim();
        if (!uniqueKeys.includes(key)) {
            uniqueKeys.push(key);
            res += line + "\n";
        }
    }
    FileIO.writeFile(`test/output/temp/${blockType}UniqueProperties.txt`, res, {
        encoding: "utf8",
    });
    return res;
}

function uniqueAttributeInstances(fhx) {
    let blocks = findBlocks(fhx, "ATTRIBUTE_INSTANCE");
    let valueblocks = [];
    let strippedBlock = [];
    let unhandled = [];
    let historyBlocks = [];

    blocks.forEach((block) => {
        let value = findBlocks(block, "VALUE");
        let history = findBlocks(block, "HISTORY_DATA_POINT");
        if (history.length > 0) {
            if (history.length > 1) {
                console.log("More than one historization configuration found");
                unhandled.push(block);
                return;
            }
            historyBlocks.push(history[0]);
            block = block.replace(history[0], "");
        }
        if (value.length > 0) {
            if (value.length > 1) {
                console.log("More than one value block found");
                unhandled.push(block);
                return;
            }
            valueblocks.push(value[0]);
            block = block.replace(value[0], "");
        }

        strippedBlock.push(block);
    });
    // FileIO.writeFile(
    //     "test/output/temp/strippedAttributeInstanceBlocks.txt",
    //     blocksWithoutValue.join("\n"),
    //     { encoding: "utf8" }
    // );
    // FileIO.writeFile(
    //     "test/output/temp/valueBlocks.txt",
    //     valueblocks.join("\n"),
    //     {
    //         encoding: "utf8",
    //     }
    // );
    //     FileIO.writeFile(
    //     "test/output/temp/historyBlocks.txt",
    //     historyBlocks.join("\n"),
    //     {
    //         encoding: "utf8",
    //     }
    // );
    // FileIO.writeFile(
    //     "test/output/temp/unHandledAttributeInstanceBlocks.txt",
    //     unhandled.join("\n"),
    //     {
    //         encoding: "utf8",
    //     }
    // );

    // These attribute instances are stripped of value and historization related blocks. Examine to find remaining unique elements in them
    let res = uniqueParams(strippedBlock.join("\n"), "ATTRIBUTE_INSTANCE");
    // FileIO.writeFile(
    //     "test/output/temp/uniqueAttributeInstancesElements.txt",
    //     res,
    //     {
    //         encoding: "utf8",
    //     }
    // );
    return res;
}

// the design of a crawler that goes through the FHX and identifies the unique characteristics, and filters out repetitive elements
export function unique(fhx) {
    fhx = FileIO.readFile("test/data/FhxComponents/FunctionBlocks.txt");
    // filter out value and history blocks

    return {};
}

function nextBracket() {
    /**
     * This functio should identify the next block which opens and close with matching brackets of the same level
     *
     * Example results
     * FUNCTION_BLOCK NAME [...]
     * {
     *  [...]
     * }
     *
     * ADDITIONAL_CONNECTOR NAME="REQ_SP" TYPE=INPUT { ATTRIBUTE="REQ_SP" }
     *
     * The starting index should be given, and the function should not need to identify the type of block or the key to the enclosed object
     */

    let fhx = FileIO.readFile("test/data/FhxComponents/FunctionBlocks.txt");
    let startIndex = 0;
    let endIndex = 0;
    let openBracketIndex = fhx.indexOf("{", startIndex);
    let closeBracketIndex = fhx.indexOf("}", startIndex);
    let depth = 0;
    if (openBracketIndex === -1 || closeBracketIndex === -1) {
        console.log("No nested block found");
        return null;
    }

    // look for the next open bracket
    // if the next open bracket is before the close bracket, then increase the depth
    // if the next close bracket is before the open bracket, then decrease the depth
    // if the depth is 0, then the block is found
    openBracketIndex = fhx.indexOf("{", openBracketIndex + 1);
    if (openBracketIndex > closeBracketIndex) {
        console.log("found matching brackets");
        endIndex = closeBracketIndex;
        depth -= 1;
    } else {
        depth += 1;
    }

    let nested = fhx.substring(startIndex, endIndex + 1);
    return nested;
}

// uniqueParams(emsfhx, "ATTRIBUTE");
// uniqueParams(emsfhx, "FUNCTION_BLOCK");
// uniqueParams(emsfhx, "ATTRIBUTE_INSTANCE");
// uniqueAttributeInstances(emsfhx);

// let emsfhx = FileIO.readFile("src/fhx/Mixer Mixer_EM_Classes.fhx");
// let fbtxt = FileIO.readFile(
//     "test/data/ExhaustiveLists/UniqueFunctionBlockElements.txt"
// );

// expected result should be
/*

{
FUNCTION_BLOCK:{NAME:ACT1, DEFINITION:ACT}
}

*/
// unique();

(function runner() {
    let emsfhx = FileIO.readFile("./src/fhx/Mixer Mixer_EM_Classes.fhx");
    // let moduleName = "_E_M_AGIT";

    // Use FhxProcessor to digest fhx and create manager
    let ObjectManager = new FhxProcessor(emsfhx).createManager();

    // let emNames = ObjectManager.findAllEms();
    let emNames = ["_E_M_AGIT", "_E_M_COND", "_E_M_PH", "_E_M_TEMP"];
    let modulenames = [
        "EQUIPMENT_LOGIC",
        "COMMAND_00000",
        "COMMAND_00001",
        "COMMAND_00002",
        "MONITOR",
    ];

    let modulename = ["__5D419B06_1888B1ED__"];

    let pathname = "test/output/RUNxx_20250306/_E_M_AGIT/EQUIPMENT_LOGIC";
    modulename.forEach((moduleName) => {
        FileIO.writeFile(
            path.join(pathname, moduleName, `${moduleName}.txt`),
            ObjectManager.get(moduleName).block,
            {
                encoding: "utf8",
            }
        );
        // Identify the module class
        let dsTables = new DesignSpecTables(ObjectManager, moduleName);
        // let folder = createTestFolder("test/output", "RUN");

        for (let table in dsTables.tables) {
            if (!table) return;
            let create = dsTables.tables[table];

            FileIO.writeFile(
                path.join(pathname, moduleName, `${table}.csv`),
                create,
                {
                    encoding: "utf8",
                }
            );
        }

        let associatedTables = dsTables
            .getAssociatedTables()
            .map((table) => table.name);
        console.log(associatedTables);
        FileIO.writeFile(
            path.join(pathname, moduleName, `AssociatedTables.json`),
            JSON.stringify(associatedTables),
            {
                encoding: "utf8",
            }
        );
    });
    return;
}); //();

// function processNestedBlocks(fhx) {
//     let inputPath = "test/output/RUNxx_20250306/_E_M_AGIT";
//     let associated = FileIO.readFile(
//         path.join(inputPath, "AssociatedTables.json"),
//         { encoding: "utf8" }
//     );
//     nestedModuleNames = JSON.parse(nestedModules);
//     let emsfhx = FileIO.readFile("./src/fhx/Mixer Mixer_EM_Classes.fhx");

//     let fhxblocks =

// }

/**
 *
 * @param {string} sfcBlockFhx fhx of the sfc functin block
 * @returns array of rows for the sfc csv table
 */
export function sfcTable(sfcBlockFhx) {
    let sfcDataObj = fhxProcessor.processSFC(sfcBlockFhx);

    let rows;

    for (let stepIndex = 0; stepIndex < sfcDataObj.steps.length; stepIndex++) {
        let step = sfcDataObj.steps[stepIndex];
        let stepText = `${step.name}\n${step.description}`;
        if (step.actions.length === 0) {
            rows.push({
                steps: stepText,
                actions: "N/A",
                expressions: "N/A",
            });
        }
        for (
            let actionIndex = 0;
            actionIndex < step.actions.length;
            actionIndex++
        ) {
            let action = step.actions[actionIndex];
            let actionText = `${action.name}\n${action.description}`;
            for (let expIndex = 0; expIndex < 3; expIndex++) {
                let delay, act, confirm;
                delay = act = confirm = "";
                if (action.delayedExpression) {
                    delay += `Delay Expression: \n${action.delayedExpression}\n`;
                }
                if (action.delayTime) {
                    delay += `Delay Time: \n${action.delayTime}\n`;
                }

                act = `Action: \n${action.expression}\n`;

                if (action.confirmExpression) {
                    confirm += `Confirm Expression: \n${action.confirmExpression}\n`;
                }
                if (action.confirmTimeOut) {
                    confirm += `Confirm TimeOut: \n${action.confirmTimeOut}\n`;
                }

                delay = delay === "" ? `Delay Time: \n0` : delay;
                confirm =
                    confirm === ""
                        ? `Confirm Expression: True;\nConfirm TimeOut: \n0`
                        : confirm;
                let exps = { delay, act, confirm };
                let record = {};

                record.steps =
                    actionIndex === 0 && expIndex === 0 ? stepText : "";
                record.actions = expIndex === 0 ? actionText : "";
                switch (expIndex) {
                    case 0:
                        record.expressions = exps.delay;
                        break;
                    case 1:
                        record.expressions = exps.act;
                        break;
                    case 2:
                        record.expressions = exps.confirm;
                        break;
                }

                rows.push(record);
            }
        }
    }
    sfcDataObj.transitions.forEach((transition) => {
        let record = {
            steps: `${transition.name}\n${transition.description}`, // In the transition section, csv header id is still "steps"
            expressions: transition.expression,
        };
        rows.push(record);
    });
    return rows;
}
