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

import fhxlib from "../../src/main.js";
let { PhaseLogic, FileIO, FhxUtil } = fhxlib;

const filename = "A-PROTEIN_PROD";
const phasename = "SUM-ADDWFI-PH";
const inputPath = "../../FHX-Files/Sanofi_Swift_Water_B55/" + filename + ".fhx";
const outputPath = "./outputs/" + "SUM-ADDWFI-PH" + ".json";

const inputFhx = FileIO.readFile(inputPath);

const phase = new PhaseLogic(inputFhx, phasename);
const runLogicFhx = phase.run_logic.fhx;
const runLogicJson = phase.run_logic.json;
const holdLogicFhx = phase.hold_logic.fhx;
const holdLogicJson = phase.hold_logic.json;
const abortLogicFhx = phase.abort_logic.fhx;
const abortLogicJson = phase.abort_logic.json;
const restartLogicFhx = phase.restart_logic.fhx;
const restartLogicJson = phase.restart_logic.json;
const stopLogicFhx = phase.stop_logic.fhx;
const stopLogicJson = phase.stop_logic.json;

const phaseSfcJson = {
    phaseName: phase.phaseName,
    runLogic: runLogicJson,
    holdLogic: holdLogicJson,
    abortLogic: abortLogicJson,
    restartLogic: restartLogicJson,
    stopLogic: stopLogicJson,
};

// console.log(res);
FileIO.writeFile(outputPath, JSON.stringify(phaseSfcJson, null, 2));
