import fs from "fs";
import { ModuleClassComponent } from "./src/Components.js";
import { FhxProcessor } from "./src/Managers.js";
import path from "path";

import { FileIO } from "./src/util/FileIO.js";

let textFilePath = "src/fhx/Mixer Mixer_EM_Classes.fhx";
let fhx = FileIO.readFile(textFilePath);

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
