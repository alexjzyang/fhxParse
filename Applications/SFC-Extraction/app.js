/*
 * Organization: Awesome Present Technologies
 * Project: fhxParse
 * Application: SFC Extraction
 *
 * File: app.js
 * Created: 01/17/2026
 * Author: Alex Yang
 *
 * Load, process SFC, and optionally save into json files
 */

import { processSFC } from "../../src/ComponentObjects/SFCProcessing.js";
import FhxUtil from "../../src/util/FhxUtil.js";
import { FileIO } from "../../src/util/FileIO.js";

const inputPath = "./inputs/A-PROTEIN_PROD.fhx";
const inputFhx = FileIO.readFile(inputPath);
// console.log(inputFhx);

let res = processSFC(inputFhx);
// console.log(res);
FileIO.writeFile(
    "./outputs/A-PROTEIN_PROD_SFC.json",
    JSON.stringify(res, null, 2),
);
