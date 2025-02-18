import fs from "fs";
import { ModuleClassComponent } from "./src/Components.js";
import { FhxProcessor } from "./src/Managers.js";
import path from "path";

import { testTableGenerator } from "./src/DSSpecific/main.js";
import { FileIO } from "./src/util/FileIO.js";

let textFilePath = "src/fhx/Mixer Mixer_EM_Classes.fhx";
let fhx = FileIO.readFile(textFilePath);

// write the all function_block_definitions to temp output folder in txt format
(() => {
    let objectCreator = new FhxProcessor(fhx);
    let mgr = objectCreator.createManager();
    let moduleClassFhx = mgr.objects._E_M_AGIT.block;
    let moduleClass = new ModuleClassComponent(moduleClassFhx);
    let composites = moduleClass.functionBlocks
        .map((fb) => mgr.get(fb.definition))
        .filter((fb) => fb.type === "FUNCTION_BLOCK_DEFINITION");
    composites.forEach((fb) => {
        FileIO.writeFile(
            path.join("test/output/temp", fb.name + ".txt"),
            fb.block,
            {
                encoding: "utf8",
            }
        );
    });
    return;
})();

// writes all tables of moduleclasscomponent to csv table
(() => {
    let fhx = FileIO.readFile("src/fhx/Mixer Mixer_EM_Classes.fhx");
    let module = "_E_M_AGIT";
    // associating function block definitions with the module class blocks, as precursor
    let objectCreator = new FhxProcessor(fhx);
    let mgr = objectCreator.createManager();
    let moduleClassComponent = mgr.get(module);
    let res = moduleClassComponent.processDSTable();
    FileIO.writeFile(path.join("test/output/temp", module + ".csv"), res, {
        encoding: "utf8",
    });
    return;

    // of processing the module class and its associated function blocks
})();

testTableGenerator();
