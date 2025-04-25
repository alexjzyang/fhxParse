/**
 * @file app.js
 * @description Sanofi Swiftwater Morpheus Project apps
 * @author Alex Yang
 * @date April 16, 2025
 */

// module imports //
import path from "path";
import { FileIO } from "../../src/util/FileIO.js";
import fhxutil from "../../src/util/FhxUtil.js";
import { config } from "dotenv";
config();

/**
 * fhx inputs
 * foler: "/Users/alexyang/Library/CloudStorage/GoogleDrive-alex.yang@awesomepresent.com/Shared drives/Awesome Present Technologies/FHX/Sanofi_Swift_Water_B55"
 * files: "055MSS3700.fhx", "A-PROTEIN_PROD.fhx"
 */

// input constants //
// const fhxFolder =
// "/Users/alexyang/Library/CloudStorage/GoogleDrive-alex.yang@awesomepresent.com/Shared drives/Awesome Present Technologies/FHX/Sanofi_Swift_Water_B55";
const fhxFiles = ["055MSS3700.fhx", "A-PROTEIN_PROD.fhx"];

// initial setup //
import { setup } from "./setup.js";
import { sfc_steps_to_md, sfcToMd } from "./frsgen.js";
setup(
    { files: fhxFiles, folder: fhxFolder },
    { override: false, clear: true, create: true }
);

// frsgen app input //
const phasename = "50L-CELL-EXP-PH";
const fhx_phasekey = "BATCH_EQUIPMENT_PHASE_CLASS";
const phaseRunlogicDefinitionName = "__6749548E_27E591EA__";
const fhxblocksPath = path.join(
    fhxFolder,
    "./fhxblocks/A-PROTEIN_PROD/FUNCTION_BLOCK_DEFINITION"
);
const currentDirectory = path.dirname(new URL(import.meta.url).pathname);
const phaseRunlogicPath = path.join(
    currentDirectory,
    fhxblocksPath,
    phaseRunlogicDefinitionName + ".txt"
);

// frs gen app //

let phases = [
    "50L-CELL-EXP-PH",
    "50L-IDLE-PH",
    "50L-MANUAL-PH",
    "50L-MEDIA-STB-PH",
    "50L-SYS-LOCK-PH",
    "50L-XFER-OUT-PH",
    "200L-GRWTH-PH",
    "200L-IDLE-PH",
    "200L-MANUAL-PH",
    "200L-SYLCK-PH",
    "2K-GRWTH-PH",
    "2K-HRVST-PH",
    "2K-IDLE-PH",
    "2K-MANUAL-PH",
    "2K-SYS-LCK-PH",
];
let inputFhx = FileIO.readFile(path.join(fhxFolder, "A-PROTEIN_PROD.fhx"));
let outputDir = path.join(currentDirectory, "./output");
let getMd = (phaseName) => {
    let mdText = sfcToMd(inputFhx, phaseName, "RUN_LOGIC");
    return mdText;
};
phases.forEach((phase) => {
    let mdText = getMd(phase);
    let filepath = path.join(outputDir, `${phase}.md`);
    FileIO.writeFile(filepath, mdText, "utf8");
});

// test code //
/**
 * use sfc_steps_to_md(fhx) to extract sfc steps into a markdown file
 */

console.log("Reading: ", phaseRunlogicPath);
const FHX_50L_CELL_EXP_PH_Runlogic = FileIO.readFile(phaseRunlogicPath);

const resobj = sfc_steps_to_md(FHX_50L_CELL_EXP_PH_Runlogic);
FileIO.writeFile("test.md", resobj, "utf8");
