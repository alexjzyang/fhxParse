import { expect, should } from "chai";
import fs from "fs";
import { unique } from "./main.js";
import { FileIO } from "./src/util/FileIO.js";
should();

describe.only("prototyping the unique function", () => {
    let fbtxt = FileIO.readFile("test/data/FhxComponents/FunctionBlocks.txt");
    let res = unique(fbtxt);
    it("should return a json object", () => {
        res.should.be.an("object");
    });

    it("should have the following nested keyvalue pairs", () => {
        res.should.have.nested.property("FUNCTION_BLOCK");
        res.should.have.nested.property(
            "FUNCTION_BLOCK.NAME",
            "EQUIPMENT_LOGIC"
        );
        res.should.have.nested.property(
            "FUNCTION_BLOCK.DEFINITION",
            "__5D419B06_1888B1ED__"
        );
        res.should.have.nested.property("FUNCTION_BLOCK.RECTANGLE.X", "630");
        res.should.have.nested.property("FUNCTION_BLOCK");
    });
});

//    myObject.should.have.nested.property('nested.keyName', 'value');

// let expectedRes = {
//     FUNCTION_BLOCK: {
//         NAME: "EQUIPMENT_LOGIC",
//         DEFINITION: "__5D419B06_1888B1ED__",
//         ID: "3772356921",
//         RECTANGLE: { X: "630", Y: "784", H: "36", W: "140" },
//         DESCRIPTION: "Condition",
//         ALGORITHM_GENERATED: "T",
//         ADDITIONAL_CONNECTOR: {
//             NAME: "REQ_SP",
//             TYPE: INPUT,
//             ATTRIBUTE: "REQ_SP",
//         },
//     },
// };
