import fs from "fs";
import { AttributeComponent, ModuleClassComponent } from "./src/Components.js";
import { FhxProcessor } from "./src/Managers.js";
import path from "path";

import { FileIO } from "./src/util/FileIO.js";
import { processSFC } from "./src/SFCProessing.js";
import { findBlocks, findBlockWithName } from "./src/util/FhxUtil.js";
import { DesignSpecTables } from "./src/DSProcessor.js";

let textFilePath = "src/fhx/Mixer Mixer_EM_Classes.fhx";
let emsfhx = FileIO.readFile(textFilePath);

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
// (() => {
//     let em1fhx = findBlockWithName(fhx, "MODULE_CLASS", "_E_M_AGIT");
//     let emComponent = new ModuleClassComponent(em1fhx);
//     let res = emComponent.processDSTable();
//     FileIO.writeFile("test/output/temp/EM_AGIT.csv", res, { encoding: "utf8" });
//     return;
// })();

function allBlocks(fhx, type = "ATTRIBUTE") {
    let blocks = findBlocks(fhx, type);
    console.log(`there are ${blocks.lenth} blocks found`);
    let res = blocks.join("\n");
    FileIO.writeFile(`test/output/temp/${type.toLowerCase()}.txt`, res, {
        encoding: "utf8",
    });
    return res;
}
// function getUniqueParams(fhx, blockType) {
//     let elements = allBlocks(fhx, blockType);
// }
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

// uniqueParams(emsfhx, "ATTRIBUTE");
// uniqueParams(emsfhx, "FUNCTION_BLOCK");
// uniqueParams(emsfhx, "ATTRIBUTE_INSTANCE");
function uniqueAttributeInstances(fhx) {
    let blocks = findBlocks(fhx, "ATTRIBUTE_INSTANCE");
    let valueblocks = [];
    let blocksWithoutValue = [];
    let unhandled = [];

    blocks.forEach((block) => {
        let value = findBlocks(block, "VALUE");
        if (value.length === 0) {
            blocksWithoutValue.push(block);
        } else if (value.length === 1) {
            blocksWithoutValue.push(block.replace(value[0], ""));
            valueblocks.push(value[0]);
        } else unhandled.push(block);
    });
    // FileIO.writeFile(
    //     "test/output/temp/attributeInstancesWithoutValue.txt",
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

    // FileIO.writeFile(
    //     "test/output/temp/unHandledValueBlocks.txt",
    //     unhandled.join("\n"),
    //     {
    //         encoding: "utf8",
    //     }
    // );
    let res = uniqueParams(blocksWithoutValue.join("\n"), "ATTRIBUTE_INSTANCE");
    // FileIO.writeFile(
    //     "test/output/temp/uniqueAttributeInstancesElements.txt",
    //     res,
    //     {
    //         encoding: "utf8",
    //     }
    // );
    return res;
}

uniqueAttributeInstances(emsfhx);
