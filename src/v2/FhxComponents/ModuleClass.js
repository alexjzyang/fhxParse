/**
 * Should contain a list of components and identify their associated property info.
 *
 * For example, module class objects should contain a list of function block,
 * and identify whether they are embedded composites or another type.
 * For all embedded composites, there should be references or links to another
 * object that represents the embedded composite.
 *
 */

import { findBlocks } from "../../v1/_FhxProcessor";

class FHX {
  constructor(fhx) {
    this.fhx = fhx;
  }
  static getFhx() {
    return this.fhx;
  }
}

export class Module_Class {
  constructor(block, modulename) {
    this.block = block;
    this.functionBlocks = getFunctionBlocks().map((fb) => {
      // list of function block objects
      return new Function_Block(fb);
    });
  }

  getFunctionBlocks() {
    return findBlocks(this.fhx, "FUNCTION_BLOCK");
  }

  // addComponent(component) {
  //     this.components.push(component);
  // }

  // getComponents() {
  //     return this.components;
  // }
}

class Function_Block {
  constructor(fhx) {
    this.name = valueOfParameter(fhx, "NAME");
    this.definitionName = valueOfParameter(fhx, "DEFINITION");
    this.fhx = fhx;
    this.definition;
  }

  findDefinition(fhx) {
    // fhx which includes definitions of related components (Overall FHX)
    return new Function_Block_Definition(fhx, this.definitionName);
  }
}

class Function_Block_Definition {
  constructor(fhx, definitionName) {
    this.fhx = fhx;
    this.definitionName = definitionName;
    this.definition = findBlockWithName(
      fhx,
      "FUNCTION_BLOCK_DEFINITION",
      definitionName
    );
  }
}
