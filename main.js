import fs from "fs";
import { AttributeComponent, ModuleClassComponent } from "./src/Components.js";
import { FhxProcessor } from "./src/Managers.js";
import path from "path";

import { FileIO } from "./src/util/FileIO.js";
import { processSFC } from "./src/SFCProessing.js";
import { findBlocks, findBlockWithName } from "./src/util/FhxUtil.js";
import { DesignSpecTables } from "./src/DSProcessor.js";

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
    console.log(`there are ${blocks.lenth} blocks found`);
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
    return {};
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
// unique(fbfhx);
