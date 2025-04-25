import { FileIO } from "../util/FileIO.js";

const filepath =
    "/Users/alexyang/Library/CloudStorage/GoogleDrive-alex.yang@awesomepresent.com/Shared drives/Awesome Present Technologies/FHX/TempFHX/fbs.txt";

const fhx = FileIO.readFile(filepath, "utf-8");

/**
 * Parsing FUNCTION_BLOCK fhx into json using regex
 * @param {string} fhx
 */
const functionBlockDigestRegex = (fhx) => {
    let fhxLines = fhx.split("\n");
    let regexLines = [
        /FUNCTION_BLOCK NAME="[^"]*" DEFINITION="[^"]*"/,
        /DESCRIPTION="[^"]*"/,
        /ID=[0-9]+/,
        /RECTANGLE= \{ X=[0-9]+ Y=[0-9]+ H=[0-9]+ W=[0-9]+ \}   \}/,
    ];

    fhxLines.forEach((line, index) => {
        const regex = regexLines[index];
        let res = line.match(regex);
    });
};

class FHXRegex {
    static firstWordRegex = /^[a-zA-Z0-9_]*(?=\sNAME|$)/;
    static nameRegex = /(^FUNCTION_BLOCK NAME=")[^"]*"/;
    static definitionRegex = /DEFINITION="[^"]*"/;
    static descriptionRegex = /DESCRIPTION="[^"]*"/;
    static idRegex = /ID=[0-9]+/;
    static rectangleRegex =
        /RECTANGLE= \{ X=[0-9]+ Y=[0-9]+ H=[0-9]+ W=[0-9]+ \}/;
}
class FunctionBlock {
    constructor(fhx) {
        this.fhx = fhx;
    }
    getName() {
        FHXRegex.nameRegex;
    }
}

const sampleJson = {
    FUNCTION_BLOCK: [
        {
            NAME: "ACT1",
            DEFINITION: "ACT",
            DESCRIPTION: "Action",
            ID: 3699080611,
            RECTANGLE: { X: 380, Y: 140, H: 56, W: 110 },
        },
    ],
};

const fhxString = `FUNCTION_BLOCK NAME="ACT1" DEFINITION="ACT"
  {
    DESCRIPTION="Action"
    ID=3699080611
    RECTANGLE= { X=380 Y=140 H=56 W=110 }
  }`;

useRegex(fhxString);
