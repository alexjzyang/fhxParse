import fs from "fs";
import path from "path";
import { should, expect } from "chai";
import { SimpleModuleClass } from "./SimpleComponent.js";
import { findBlockWithName } from "../../v1/_FhxProcessor.js";
import { ModuleParameterTable } from "../../DSSpecific/ModuleParameterTable.js";
should();

describe.only("SimpleModuleClass", () => {
    let fhxFilepath = path.join("test", "data", "emsFhx.fhx");
    let fhx = fs.readFileSync(fhxFilepath, "utf-16le");
    let testModuleName = "_E_M_AGIT";
    let testModuleBlock = findBlockWithName(
        fhx,
        "MODULE_CLASS",
        testModuleName
    );
    let moduleClass = new SimpleModuleClass(testModuleBlock);

    it("should create a parameter table", () => {
        moduleClass.parameterTable.should.be.an.instanceof(
            ModuleParameterTable
        );
    });
});
