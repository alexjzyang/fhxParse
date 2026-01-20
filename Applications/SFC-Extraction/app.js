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

import { PhaseLogic } from "../../src/ComponentObjects/PhaseProcessing.js";
import { processSFC } from "../../src/ComponentObjects/SFCProcessing.js";
import FhxUtil from "../../src/util/FhxUtil.js";
import { FileIO } from "../../src/util/FileIO.js";

const inputPath = "./inputs/A-PROTEIN_PROD.fhx";
const inputFhx = FileIO.readFile(inputPath);

const phase = new PhaseLogic(inputFhx, "SUM-ADDWFI-PH");
const runLogicFhx = phase.run_logic;
const runLogicJson = processSFC(runLogicFhx);
const holdLogicFhx = phase.hold_logic;
const holdLogicJson = processSFC(holdLogicFhx);
const abortLogicFhx = phase.abort_logic;
const abortLogicJson = processSFC(abortLogicFhx);
const restartLogicFhx = phase.restart_logic;
const restartLogicJson = processSFC(restartLogicFhx);
const stopLogicFhx = phase.stop_logic;
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
FileIO.writeFile(
    "./outputs/SUM-ADDWFI-PH.json",
    JSON.stringify(phaseSfcJson, null, 2),
);
