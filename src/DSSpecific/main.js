import { tableGenerator } from "./DSTableGenerator.js";
import fs from "fs";

export function testTableGenerator(fhxFile) {
    let fhxfile1 = fs.readFileSync("src/fhx/Mixer Control_Module_Classes.fhx");
    let fhxfile2 = fs.readFileSync("src/fhx/Mixer Mixer_EM_Classes.fhx");
    if (!fhxFile) {
        tableGenerator(fhxfile1);
        tableGenerator(fhxfile2);
    }
}

export { tableGenerator };
