import { expect, should } from "chai";
import fs from "fs";
import { ComponentProcessor } from "../src/v3/ComponentProcessor.js";
import {
  AttributeComponent,
  AttributeInstanceComponent,
  FunctionBlockComponent,
} from "../src/v3/Components.js";

should();

// Class currently not necessary
describe.skip("ComponentProcessor", () => {
  // Testing ProcessAttributes
  describe("ProcessAttributes", () => {
    let attributeBlockStr = fs.readFileSync(
      "./test/data/FhxComponents/Attribute.txt",
      "utf8"
    );

    let attribute = new AttributeComponent(attributeBlockStr);

    it("should return 'Processing ATTRIBUTE' for the moment", () => {
      ComponentProcessor.processAttribute(attribute).should.equal(
        "Processing ATTRIBUTE"
      );
    });
  });

  // Testing ProcessAttributeInstances
  describe("ProcessAttributeInstances", () => {
    let attributeInstanceBlockStr = fs.readFileSync(
      "./test/data/FhxComponents/AttributeInstance.txt",
      "utf8"
    );
    let attributeInstance = new AttributeInstanceComponent(
      attributeInstanceBlockStr
    );

    it("should return 'Processing ATTRIBUTE_INSTANCE' for the moment", () => {
      ComponentProcessor.processAttributeInstance(
        attributeInstance
      ).should.equal("Processing ATTRIBUTE_INSTANCE");
    });
  });

  // Testing ProcessFunctionBlocks
  describe("ProcessFunctionBlocks", () => {
    let functionBlockStr = fs.readFileSync(
      "./test/data/FhxComponents/FunctionBlock.txt",
      "utf8"
    );
    let functionBlock = new FunctionBlockComponent(functionBlockStr);

    it("should return 'Processing FUNCTION_BLOCK' for the moment", () => {
      ComponentProcessor.processFunctionBlock(functionBlock).should.equal(
        "Processing FUNCTION_BLOCK"
      );
    });
  });
});
