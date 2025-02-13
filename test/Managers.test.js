import { expect, should } from "chai";
import fs from "fs";
import path from "path";
import { ObjectCreator, ObjectManager } from "../src/v3/Managers.js";

should();

describe("ObjectCreator, with fhx containing a single module block, _E_M_AGIT", function () {
    let textFilePath = "./test/data/_E_M_AGIT.txt";
    let fhx = fs.readFileSync(textFilePath, "utf8");

    // it should instantiate an ObjectCreator object
    it("should instantiate an ObjectCreator object", function () {
        let objectCreator = new ObjectCreator(fhx);
        objectCreator.should.exist.and.be.an.instanceof(ObjectCreator);
    });
    describe("createManager", function () {
        let objectCreator = new ObjectCreator(fhx);
        let mgr = objectCreator.createManager();

        // it should create an ObjectManager once create Manger
        it("should create an ObjectManager object", function () {
            mgr.should.exist.and.be.an.instanceof(ObjectManager);
        });

        // once object manager is created, it should contain one object called _E_M_AGIT
        // based on the input file
        it("should contain one object called _E_M_AGIT", function () {
            mgr.get("_E_M_AGIT").should.exist;
        });

        // once object manager is created, the objectCreator should contain an empty
        // original string and an empty remaining string

        it("should consume the entire fhx string once the manager is created", function () {
            objectCreator.original.should.equal("");
            objectCreator.remaining.should.equal("");
        });
    });
});

describe("ObjectCreator, with fhx file containing multiple modules", function () {
    let textFilePath = "./test/data/Mixer Control_Module_Classes.fhx";
    let fhx = fs.readFileSync(textFilePath, "utf16le");
    let mgr = new ObjectCreator(fhx).createManager();

    it("should contain FUNCTION_BLOCK_DEFINITION: _CT_M_C_DC_ML", function () {
        let obj = mgr.get("_CT_M_C_DC_ML");
        obj.should.exist;
        obj.type.should.equal("FUNCTION_BLOCK_DEFINITION");
    });

    it("should contain FUNCTION_BLOCK_DEFINITION: _CT_M_C_AI_RATE", function () {
        let obj = mgr.get("_CT_M_C_AI_RATE");
        obj.should.exist;
        obj.type.should.equal("FUNCTION_BLOCK_DEFINITION");
    });

    it("should contain FUNCTION_BLOCK_DEFINITION: _CT_M_ALMCHNGDLY", function () {
        let obj = mgr.get("_CT_M_ALMCHNGDLY");
        obj.should.exist;
        obj.type.should.equal("FUNCTION_BLOCK_DEFINITION");
    });

    it("should contain FUNCTION_BLOCK_DEFINITION: _CT_M_C_C_ML", function () {
        let obj = mgr.get("_CT_M_C_C_ML");
        obj.should.exist;
        obj.type.should.equal("FUNCTION_BLOCK_DEFINITION");
    });

    it("should contain FUNCTION_BLOCK_DEFINITION: _CT_M_C_INPUTSEL", function () {
        let obj = mgr.get("_CT_M_C_INPUTSEL");
        obj.should.exist;
        obj.type.should.equal("FUNCTION_BLOCK_DEFINITION");
    });

    it("should contain FUNCTION_BLOCK_DEFINITION: _CT_M_FL50", function () {
        let obj = mgr.get("_CT_M_FL50");
        obj.should.exist;
        obj.type.should.equal("FUNCTION_BLOCK_DEFINITION");
    });

    it("should contain FUNCTION_BLOCK_DEFINITION: _CT_M_C_USM_TM", function () {
        let obj = mgr.get("_CT_M_C_USM_TM");
        obj.should.exist;
        obj.type.should.equal("FUNCTION_BLOCK_DEFINITION");
    });
});
