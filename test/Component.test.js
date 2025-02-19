import { expect, should } from "chai";
import fs from "fs";
import path from "path";
import { FhxProcessor } from "../src/Managers.js";
import { FileIO } from "../src/util/FileIO.js";
should();

// Template using expect
describe("Component, temporarily", () => {
    describe("Component.processDSTable", () => {
        let fhx = FileIO.readFile("test/data/Mixer Mixer_EM_Classes.fhx");
        let outputPath = "test/output/temp";

        if (!fs.existsSync(outputPath)) {
            fs.mkdirSync(outputPath, { recursive: true });
        }
        after(() => {
            fs.rmdirSync(outputPath, { recursive: true });
        });

        it("Should not throw", () => {
            let module = "_E_M_AGIT";
            let objectCreator = new FhxProcessor(fhx);
            let mgr = objectCreator.createManager();
            let moduleClassComponent = mgr.get(module);
            let res = moduleClassComponent.processDSTable();
            FileIO.writeFile(path.join(outputPath, module + ".csv"), res, {
                encoding: "utf8",
            });
            return;
        });
    });
});
