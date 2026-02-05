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
let { PhaseLogic, processSFC, FileIO, FhxUtil } = fhxlib;

const filename = "A-PROTEIN_PROD";
const inputPath = "./inputs/" + filename + ".fhx";
const outputPath = "./outputs/" + filename + ".json";

const inputFhx = FileIO.readFile(inputPath);

const phase = new PhaseLogic(inputFhx, filename);
const runLogicFhx = phase.run_logic.fhx;
const runLogicJson = processSFC(runLogicFhx);
const holdLogicFhx = phase.hold_logic.fhx;
const holdLogicJson = processSFC(holdLogicFhx);
const abortLogicFhx = phase.abort_logic.fhx;
const abortLogicJson = processSFC(abortLogicFhx);
const restartLogicFhx = phase.restart_logic.fhx;
const restartLogicJson = processSFC(restartLogicFhx);
const stopLogicFhx = phase.stop_logic.fhx;
const stopLogicJson = processSFC(stopLogicFhx);

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
