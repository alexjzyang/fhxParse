import { should } from "chai";
import fs from "fs";
import path from "path";
import { ObjectCreator } from "../src/v3/Managers.js";

should();

describe("ObjectCreator, with fhx of a single module", function () {
  describe("findComponent()", function () {
    let textFilePath = "./test/data/_E_M_AGIT.txt";
    let fhx = fs.readFileSync(textFilePath, "utf8");
    let objectCreator = new ObjectCreator(fhx);
    it("should return the 1 when a module is found", function () {
      objectCreator.findNextComponent().should.equal(1);
    });
    it("should return -1 once all the fhx is consumed", function () {
      objectCreator.findNextComponent().should.equal(-1); // Since in this case
      // there is only one module. The second time when findNextComponent is called,
      // it should return -1
    });
    it("should contain an empty original string and an empty remaining string, since there is only one module in it", function () {
      objectCreator.original.should.equal("");
      objectCreator.remaining.should.equal("");
    });
    it("should add the _E_M_AGIT module to the Object Manager", function () {
      objectCreator.createManager().get("_E_M_AGIT").should.exist;
    });
  });
});

describe("ObjectCreator, with fhx of multiple modules", function () {
  let textFilePath = "./test/data/Mixer Control_Module_Classes.fhx";
  let fhx = fs.readFileSync(textFilePath, "utf16le");
  let objectCreator = new ObjectCreator(fhx);
  let mgr;
  before(function () {
    while (objectCreator.findNextComponent() !== -1) {
      continue; // repeatedly run findNextComponent until the entire fhx is consumed
    }
    mgr = objectCreator.createManager();
  });

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
