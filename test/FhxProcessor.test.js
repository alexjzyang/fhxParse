import { expect } from "chai";
import { loadTxtFile, loadFhxFile } from "./utils/loadTestData";
import FhxProcessor from "../src/FhxProcessor";
let { valueOf } = FhxProcessor;

describe("ValueOf function", () => {
  let fhx;

  before(() => {
    const fhx = loadTxtFile("./data/smallBlocks.txt");
  });

  it("should
});
