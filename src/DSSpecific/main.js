import { tableGenerator } from "./DSTableGenerator.js";
import fs from "fs";

let fhxfile1 = fs.readFileSync("src/fhx/Mixer Control_Module_Classes.fhx");
let fhxfile2 = fs.readFileSync("src/fhx/Mixer Mixer_EM_Classes.fhx");

tableGenerator(fhxfile1);
tableGenerator(fhxfile2);
