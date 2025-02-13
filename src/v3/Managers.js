import { Component } from "./Components.js";

export class ObjectManager {
    constructor() {
        this.objects = {};
        // this.children = {};
    }

    add(obj) {
        this.objects[obj.name] = obj;
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
    constructor(fhx) {
        this.original = fhx;
        this.remaining = "";
    }

    #findNextComponent() {
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
                if (openBracketIndex !== -1)
                    throw new Error(
                        "Unexpected behavior: No matching closing bracket found"
                    );
                else {
                    // if there are no more brackets, end of file reached
                    return undefined;
                }
            }
            if (depth < 0) throw new Error("Depth calculation error");

            if (
                openBracketIndex < closeBracketIndex &&
                openBracketIndex !== -1
            ) {
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
        // If the fhx string is not a valid component, then the string is not
        // processed properly. It should be added to remaining string for future
        // implementation
        if (!obj) this.remaining = this.remaining + fhxStr;
        this.original = this.original.substring(currIndex + 1).trim(); // modify the original string to remmove already processed string
        return obj;
    }

    createManager() {
        let mgr = new ObjectManager();
        let obj;
        while ((obj = this.#findNextComponent())) {
            mgr.add(obj);
            continue; // repeatedly run findNextComponent until the entire fhx is consumed
        }
        return mgr;
    }
}

export function debugManager(fhx) {
    let objectCreator = new ObjectCreator(fhx);
    let mgr = objectCreator.createManager();
    return 1;
}
