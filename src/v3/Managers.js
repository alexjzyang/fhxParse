import { Component } from "./Components.js";

export class ObjectManager {
  constructor() {
    this.objects = {};
    // this.children = {};
  }

  add(obj) {
    // if (this.objects[obj.name] !== undefined) return;
    //   throw new Error("Duplicate Object Found: " + obj.name);
    this.objects[obj.name] = obj;
    // obj.objManager = this;
  }

  get(name) {
    return this.objects[name];
  }
}

/**
 * Object Creator is responsible to create fhx components and add them to the object manager
 * It has the added benefit to monitor how much of the fhx file is left to process
 */
export class ObjectCreator {
  #objectManager;
  constructor(fhx) {
    this.original = fhx;
    this.remaining = "";
    this.#objectManager = new ObjectManager();
  }

  findNextComponent() {
    // save start index, current depth is 0
    let startIndex = 0;
    let depth = 0;
    let currIndex, openBracketIndex, closeBracketIndex;
    currIndex = 0;

    do {
      // depth calculation and finding indices of the matching bracket
      openBracketIndex = this.original.indexOf("{", currIndex + 1);
      closeBracketIndex = this.original.indexOf("}", currIndex + 1);

      // Handling various processing errors
      if (closeBracketIndex === -1) {
        if (openBracketIndex === -1) return -1;
        throw new Error("No matching closing bracket found");
      }
      if (depth < 0) throw new Error("Depth calculation error");

      if (openBracketIndex < closeBracketIndex && openBracketIndex !== -1) {
        depth++;
        currIndex = openBracketIndex;
      } else {
        depth--;
        currIndex = closeBracketIndex;
      }
    } while (depth !== 0);

    // return the substring from start to end index
    // attempt to create the object with the substring, if successful, create a
    let fhxStr = this.original.substring(startIndex, currIndex + 1); // isolate the processed string

    let obj = new Component(fhxStr);
    if (obj) this.#objectManager.add(obj);
    else this.remaining = this.remaining + fhxStr;

    this.original = this.original.substring(currIndex + 1); // modify the original string to remmove already processed string
    return 1;
  }

  createManager() {
    return this.#objectManager;
  }
}

// export function objectCreatorRunner(fhx) {
//   let objectCreator = new ObjectCreator(fhx);
//   objectCreator.findNextComponent();
//   return 1;
// }
