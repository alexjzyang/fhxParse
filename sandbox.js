// import path from "path";
// let url = import.meta.url;

// let pathname = new URL(import.meta.url).pathname;
// let currentDir = path.dirname(new URL(import.meta.url).pathname);
// currentDir = path.resolve(currentDir);

// console.log(currentDir);

import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
