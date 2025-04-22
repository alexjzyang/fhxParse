// import

import { FileIO } from "../../src/util/FileIO.js";
import fs from "fs";
import path from "path";
import { getBlockName, getBlockType, listRootBlocks } from "./lib.js";
import { create } from "domain";

export function setup(
    input = { files: [], folder: "" },
    operation = { override: false, clear: false, create: true }
) {
    let { override, clear } = operation;
    let { files, folder } = input;

    let rootFoldername = "fhxblocks";
    let currentDir = path.dirname(new URL(import.meta.url).pathname);
    rootFoldername = path.join(currentDir, rootFoldername);

    // if operation is clear then delete the folder
    if (clear) {
        console.log("Clearing FHX file folder");
        if (fs.existsSync(rootFoldername)) {
            fs.rmSync(rootFoldername, { recursive: true, force: true });
            console.log(`Folder deleted: ${rootFoldername}`);
        } else {
            console.log(`Folder does not exist: ${rootFoldername}`);
        }
    }

    if (!create) return;

    // if files are empty then console log the message and return
    if (files.length === 0) {
        console.log("No input files");
        return;
    }

    // Setup FHX file folder
    /**
     * Folder structure
     * fhxblocks
     *  ├── 055MSS3700.txt
     *  ├── A-PROTEIN_PROD.txt
     *  |-- Blocks/
     *     ├── 055FER375.txt
     *     ├── U-MIXSTATION.txt
     */

    console.log("Setup FHX file folder");
    // Create root folder. If the root folder already exists, and override is
    // false, it is assumed that the setup has already been run
    if (!fs.existsSync(rootFoldername)) {
        fs.mkdirSync(rootFoldername, { recursive: true });
        console.log(`Folder created: ${rootFoldername}`);
    } else {
        console.log(`Folder already exists: ${rootFoldername}`);
        if (!override) {
            console.log("Override is set to false. Skipping setup.");
            return;
        }
    }

    // create txt files of the original fhx files
    let fhxdata = files.map((filename) => {
        const filepath = path.join(folder, filename);
        console.log(`Reading file: ${filepath}`);
        let fhxdata = FileIO.readFile(filepath, {
            filetype: "fhx",
            encoding: "utf16le",
            // override: true,
        });
        let txtfilename = path.basename(filename, ".fhx");
        let newFilePath = path.join(rootFoldername, txtfilename);
        console.log(`Writing file: ${newFilePath}`);
        FileIO.writeFile(newFilePath, fhxdata, {
            filetype: "txt",
            encoding: "utf8",
            // override: true,
        });
        return fhxdata;
    });

    // find each root block

    fhxdata.forEach((fhx, index) => {
        let filename = files[index];
        filename = path.basename(filename, ".fhx");

        let fhxblocks = listRootBlocks(fhx);
        console.log("Setup complete with no errors");

        // Create an object where the type is the key to an array of names of the same type
        let blocks = fhxblocks.reduce((acc, fhx) => {
            let type = getBlockType(fhx);
            let name = getBlockName(fhx) || "";
            if (!acc[type]) {
                acc[type] = [];
            }

            acc[type].push({ name, fhx });
            return acc;
        }, {});

        // Create text files for the following blocks.
        let blockTypes = [
            "FUNCTION_BLOCK_DEFINITION",
            "MODULE_CLASS",
            "BATCH_EQUIPMENT_PHASE_CLASS",
        ];

        for (let blockType of blockTypes) {
            let block = blocks[blockType];
            if (block) {
                block.forEach((block) => {
                    let blockName = block.name;
                    let blockContent = block.fhx;
                    let blockFilePath = path.join(
                        rootFoldername,
                        filename,
                        blockType,
                        `${blockName}.txt`
                    );
                    console.log(
                        `Writing block ${blockName} to: ${blockFilePath}`
                    );
                    FileIO.writeFile(blockFilePath, blockContent, {
                        filetype: "txt",
                        encoding: "utf8",
                    });
                });
            }
        }
    });
}
