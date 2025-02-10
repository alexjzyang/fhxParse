import { should } from "chai";
import fs from "fs";
import path from "path";
import { ObjectCreator } from "../src/v3/Managers.js";

should();

describe("ObjectCreator, with fhx of a single module", function () {
  let textFilePath = "./test/data/_E_M_AGIT.txt";
  let fhx = fs.readFileSync(textFilePath, "utf8");
  let objectCreator = new ObjectCreator(fhx);
  it("should contain a Object Manager", function () {
    objectCreator.objectManager.should.exist;
  });
  describe("findComponent()", function () {
    it("should return the 1 when a module is found", function () {
      objectCreator.findNextComponent().should.equal(1);
    });
    it("should return -1 once all the fhx is consumed", function () {
      objectCreator.findNextComponent().should.equal(-1); // Since in this case
      // there is only one module. The second time when findNextComponent is called,
      // it should return -1
    });
    it("should add the _E_M_AGIT module to the Object Manager", function () {
      objectCreator.objectManager.get("_E_M_AGIT").should.exist;
    });
  });
});
