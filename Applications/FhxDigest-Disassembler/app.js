// This project aims to disassemble the fhx file into its block components.

import FhxUtil from "../../src/util/FhxUtil.js";
import FileIO from "../../src/util/FileIO.js";

// Files are created containing the first level blocks of an input fhx file.
// *This should be done recursively

// Load the fhx file from FHX Files storate
const inputFilePath =
    "../../FHX-Files/Cytiva_Muskegon/original/_PR_DOWNSTREAM_Y.txt";
let inputFhx = FileIO.readFile(inputFilePath);

// clean up output directory before writing new files
FileIO.clearDirectory("./outputs/");
FileIO.clearDirectory("./inputs/");

// Store a copy of the input file.
FileIO.writeFile("./inputs/_PR_DOWNSTREAM_Y.txt", inputFhx, {
    filetype: "txt",
});

// Find the SCHEMA and LOCALE blocks
let schemaBlock = FhxUtil.findBlocks(inputFhx, "SCHEMA");
let localeBlock = FhxUtil.findBlocks(inputFhx, "LOCALE");
// find batch recipe blocks
let batchRecipeBlocks = FhxUtil.findBlocks(inputFhx, "BATCH_RECIPE");
// Find batch formula blocks
let batchFormulaBlocks = FhxUtil.findBlocks(inputFhx, "BATCH_RECIPE_FORMULA");

// Check how many blocks of each type there are, and print the first one of each type to check if they are correct.
console.log("Number of SCHEMA blocks: " + schemaBlock.length);
console.log("Number of LOCALE blocks: " + localeBlock.length);
console.log("Number of BATCH_RECIPE blocks: " + batchRecipeBlocks.length);
console.log(
    "Number of BATCH_RECIPE_FORMULA blocks: " + batchFormulaBlocks.length,
);

// write them into separate files
FileIO.writeFile("./outputs/SCHEMA.txt", schemaBlock[0], {
    filetype: "txt",
});
FileIO.writeFile("./outputs/LOCALE.txt", localeBlock[0], {
    filetype: "txt",
});

batchRecipeBlocks.forEach((block, index) => {
    let blockName = FhxUtil.valueOfParameter(block, "NAME");
    FileIO.writeFile(`./outputs/BATCH_RECIPE - ${blockName}.txt`, block, {
        filetype: "txt",
    });
});

batchFormulaBlocks.forEach((block, index) => {
    let blockName = FhxUtil.valueOfParameter(block, "NAME");

    FileIO.writeFile(
        `./outputs/BATCH_RECIPE_FORMULA - ${blockName}.txt`,
        block,
        {
            filetype: "txt",
        },
    );
});

// remove blocks that are already extracted
inputFhx = inputFhx.replaceAll(schemaBlock[0], "");
inputFhx = inputFhx.replaceAll(localeBlock[0], "");
inputFhx = inputFhx.replaceAll(batchRecipeBlocks[0], "");

batchFormulaBlocks.forEach((block) => {
    inputFhx = inputFhx.replaceAll(block, "");
});

FileIO.writeFile("./outputs/_REMAINING.txt", inputFhx, {
    filetype: "txt",
});

//--Disassemble Batch Recipe--//
console.log("\n============Disassembling Batch Recipe==========");
let batchRecipeBlock = batchRecipeBlocks[0];
// create a directory for the batch recipe components
const batchRecipeName = FhxUtil.valueOfParameter(batchRecipeBlock, "NAME");
console.log("Batch recipe name: " + batchRecipeName);
const batchRecipeDir = `./outputs/BATCH_RECIPE - ${batchRecipeName}`;

// find all FORMULA_PARAMETER blocks
let formulaParameterBlocks = FhxUtil.findBlocks(
    batchRecipeBlock,
    "FORMULA_PARAMETER",
);
console.log(
    "Number of FORMULA_PARAMETER blocks: " + formulaParameterBlocks.length,
);
// instead of writing the blocks into separate files, we can write them into a subfolder named FORMULA_PARAMETERS
// combine all formula parameter blocks
let formulaParametersCombined = formulaParameterBlocks.join("");
FileIO.writeFile(
    `${batchRecipeDir}/FORMULA_PARAMETERS.txt`,
    formulaParametersCombined,
    {
        filetype: "txt",
    },
);

// remove the formula parameter blocks from the batch recipe block
formulaParameterBlocks.forEach((block) => {
    batchRecipeBlock = batchRecipeBlock.replaceAll(block, "");
});

// write remaining batch recipe block into a file
FileIO.writeFile(`${batchRecipeDir}/_REMAINING.txt`, batchRecipeBlock, {
    filetype: "txt",
});

// =============== Disassemble PFC_ALGORITHM ============== //
console.log("\n============Disassembling PFC_ALGORITHM==========");
let pfcAlgorithmBlocks = FhxUtil.findBlocks(batchRecipeBlock, "PFC_ALGORITHM");
console.log("Number of PFC_ALGORITHM blocks: " + pfcAlgorithmBlocks.length);
FileIO.writeFile(`./outputs/PFC_ALGORITHM.txt`, pfcAlgorithmBlocks[0], {
    filetype: "txt",
});

let pfcRemaining = pfcAlgorithmBlocks[0];
FileIO.writeFile(
    `${batchRecipeDir}/PFC_ALGORITHM/_REMAINING.txt`,
    pfcRemaining,
    {
        filetype: "txt",
    },
);
