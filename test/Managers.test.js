import { expect, should } from "chai";
import fs from "fs";
import { FhxProcessor, ObjectManager } from "../src/Managers.js";
import {
    FunctionBlockDefinitionComponent,
    ModuleClassComponent,
} from "../src/Components.js";

should();

describe("FhxProcessor, with fhx containing a single module block, _E_M_AGIT", function () {
    let textFilePath = "./test/data/_E_M_AGIT.txt";
    let fhx = fs.readFileSync(textFilePath, "utf8");

    // it should instantiate an FhxProcessor object
    it("should instantiate an FhxProcessor object", function () {
        let fhxProcessor = new FhxProcessor(fhx);
        fhxProcessor.should.exist.and.be.an.instanceof(FhxProcessor);
    });
    describe("createManager", function () {
        // testing  createManager coverts the #findNextComponent method
        let fhxProcessor = new FhxProcessor(fhx);
        let mgr = fhxProcessor.createManager();

        // it should create an ObjectManager once create Manger
        it("should create an ObjectManager object", function () {
            mgr.should.exist.and.be.an.instanceof(ObjectManager);
        });

        // once object manager is created, it should contain one object called _E_M_AGIT
        // based on the input file
        it("should contain one object called _E_M_AGIT", function () {
            mgr.get("_E_M_AGIT").should.exist;
        });

        // once object manager is created, the FhxProcessor should contain an empty
        // original string and an empty remaining string

        it("should consume the entire fhx string once the manager is created", function () {
            fhxProcessor.original.should.equal("");
            fhxProcessor.remaining.should.equal("");
        });
    });
});

describe("FhxProcessor, with fhx file containing multiple modules", function () {
    let textFilePath = "./test/data/Mixer Mixer_EM_Classes.fhx";
    let fhx = fs.readFileSync(textFilePath, "utf16le");
    let mgr = new FhxProcessor(fhx).createManager();
    describe("ObjectManager created by FhxProcessor.createManager", function () {
        it("should contain FUNCTION_BLOCK_DEFINITION: _CT_M_C_DC_ML, __5D419B06_1888B27C__, _CT_M_SNTL_16MON from the fhx file", function () {
            let obj;
            obj = mgr.get("_CT_M_C_DC_ML");
            obj.should.exist;
            obj.typeName.should.equal("FUNCTION_BLOCK_DEFINITION");
            obj = mgr.get("__5D419B06_1888B27C__");
            obj.should.exist;
            obj.typeName.should.equal("FUNCTION_BLOCK_DEFINITION");
            obj = mgr.get("_CT_M_SNTL_16MON");
            obj.should.exist;
            obj.typeName.should.equal("FUNCTION_BLOCK_DEFINITION");
        });
        // it should contain the following module class: _C_M_AI, _C_M_AI_TARE, _C_M_DI
        it("should contain MODULE_CLASS: _C_M_AGIT_M, _E_M_TEMP, _C_M_TCU", function () {
            let obj;
            obj = mgr.get("_C_M_AGIT_M");
            obj.should.exist;
            obj.typeName.should.equal("MODULE_CLASS");
            obj = mgr.get("_E_M_TEMP");
            obj.should.exist;
            obj.typeName.should.equal("MODULE_CLASS");
            obj = mgr.get("_C_M_TCU");
            obj.should.exist;
            obj.typeName.should.equal("MODULE_CLASS");
        });
        it("should create the components as instances of the correct component classes", function () {
            let obj;
            obj = mgr.get("__5D24CE4A_A808E6E3__");
            obj.should.exist;
            obj.should.be.an.instanceof(FunctionBlockDefinitionComponent);
            obj = mgr.get("_CT_M_CNL_WT_EM");
            obj.should.exist;
            obj.should.be.an.instanceof(FunctionBlockDefinitionComponent);
            obj = mgr.get("__5D1CF4EF_895FDB62__");
            obj.should.exist;
            obj.should.be.an.instanceof(FunctionBlockDefinitionComponent);
            obj = mgr.get("_E_M_COND");
            obj.should.exist;
            obj.should.be.an.instanceof(ModuleClassComponent);
            obj = mgr.get("_C_M_PID_1AI_M");
            obj.should.exist;
            obj.should.be.an.instanceof(ModuleClassComponent);
        });
    });
});

// describe();
