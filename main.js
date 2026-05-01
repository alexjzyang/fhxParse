// 29APR2026 todo
// task: use moo to extract formula lines
// -> use fhxutil to isolate block
// -> use moo lexer on formula params
// -> write test

import path from "path";
import fs from "fs";
import _config from "./_config.js";
import fhxlib from "./src/main.js";
import moo from "moo";

const { FhxUtil } = fhxlib;

// project folder path:
const { rootDir } = _config;
const Fhx_Paths = {};
Fhx_Paths._PR_DOWNSTREAM_Y =
    "FHX-Files/Cytiva_Muskegon/original/_PR_DOWNSTREAM_Y.txt";

// load file
const fhx = {};
fhx._PR_DOWNSTREAM_Y = fs.readFileSync(
    path.join(rootDir, Fhx_Paths._PR_DOWNSTREAM_Y),
    "utf-8",
);

const blocks = {};
blocks._PR_DOWNSTREAM_Y = FhxUtil.findBlockWithName(
    fhx._PR_DOWNSTREAM_Y,
    "BATCH_RECIPE",
    "_PR_DOWNSTREAM_Y",
);

blocks.formula = FhxUtil.findBlocks(
    fhx._PR_DOWNSTREAM_Y,
    "BATCH_RECIPE_FORMULA",
);

// blocks._PR_DOWNSTREAM_Y stores the single block string of
// the BATCH_RECIPE block with name _PR_DOWNSTREAM_Y
// blocks.formula stores BATCH_RECIPE_FORMULA blocks in an array
