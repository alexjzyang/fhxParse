// Test 1
// The class FunctionBlock should have methods toString, testIdentical, testSimilar, and getDifference.
// Test 2
//
import { should } from "chai";
import { findBlocks } from "../../v1/_FhxProcessor.js";
import { FunctionBlock } from "./FunctionBlock.js";
import fs from "fs";
import path from "path";
should();

describe.skip("FunctionBlock", function () {
  let functionBlocks;
  before(function () {
    let fhx = fs.readFileSync("test/data/FunctionBlocks.txt", "utf8");
    let fbFhx = findBlocks(fhx, "FUNCTION_BLOCK"); // This test is coupled with the findBlocks function in the FhxProcessor
    functionBlocks = fbFhx.map((fb) => new FunctionBlock(fb));
  });
  it("should create an object with fhx as input.", function () {
    console.log(functionBlocks[0].fhx);
    functionBlocks[0].should.be.an.instanceof(FunctionBlock);
    functionBlocks[1].should.be.an.instanceof(FunctionBlock);
    functionBlocks[2].should.be.an.instanceof(FunctionBlock);
    functionBlocks[3].should.be.an.instanceof(FunctionBlock);
  });
  it("should store the original fhx text.", function () {
    functionBlocks[0].fhx.should.be.a("string");
    functionBlocks[1].fhx.should.be.a("string");
    functionBlocks[2].fhx.should.be.a("string");
    functionBlocks[3].fhx.should.be.a("string");
  });
  it("should have a method toString, which reconstitute the original fhx text.", function () {
    functionBlocks[0]
      .toString()
      .should.equal(functionBlocks[0].fhx.replaceAll("\r", ""));
    functionBlocks[1]
      .toString()
      .should.equal(functionBlocks[1].fhx.replaceAll("\r", ""));
    functionBlocks[2]
      .toString()
      .should.equal(functionBlocks[2].fhx.replaceAll("\r", ""));
    functionBlocks[3]
      .toString()
      .should.equal(functionBlocks[3].fhx.replaceAll("\r", ""));
  });
});
describe.skip("FunctionBlock, with an integrated example", function () {
  let functionBlocks;
  let fhx = fs.readFileSync("test/data/FunctionBlocks.txt", "utf8");

  before(function () {
    let fbFhx = findBlocks(fhx, "FUNCTION_BLOCK"); // This test is coupled with the findBlocks function in the FhxProcessor
    functionBlocks = fbFhx.map((fb) => new FunctionBlock(fb));
  });

  it("should reconstitude the original fhx text by combining each object with join function.", function () {
    let result = functionBlocks.map((fb) => fb.toString()).join("\r\n");
    result.should.equal(fhx);
  });
});
