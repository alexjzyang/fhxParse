// import path from "path";
// let url = import.meta.url;

// let pathname = new URL(import.meta.url).pathname;
// let currentDir = path.dirname(new URL(import.meta.url).pathname);
// currentDir = path.resolve(currentDir);

// console.log(currentDir);

import { fileURLToPath } from "url";
import path, { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
console.log(__dirname);

const fhxFolderPath = path.join("FHX-Files", "Sanofi_Swift_Water_B55");
const inputFhxPath = path.join(__dirname, fhxFolderPath, "A-PROTEIN_PROD.fhx");

import { processSFC } from "./src/ComponentObjects/SFCProcessing.js";
import FhxUtil from "./src/util/FhxUtil.js";
import { FileIO } from "./src/util/FileIO.js";

const inputFhx = FileIO.readFile(inputFhxPath);


