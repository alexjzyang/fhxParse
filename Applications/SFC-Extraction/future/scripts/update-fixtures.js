// Load A-PROTEIN_PROD.fhx
// Create PhaseLogic instance for the phase name
// Extract run_logic, hold_logic, abort_logic, restart_logic, stop_logic
// For each logic, call processSFC() to get JSON
// Combine into phaseSfcJson object
// Write to test/fixtures/golden/A-PROTEIN_PROD.expected.json
// Log: "Golden fixture written"


const inputFileName = "A-PROTEIN_PROD.fhx";
const phaseName = "A-PROTEIN_PROD";
const inputPath = `Applications/SFC-Extraction/inputs/${inputFileName}`;
const outputPath = `Applications/SFC-Extraction/test/fixtures/golden/${phaseName}.expected.json`;

const fs = require("fs").promises;