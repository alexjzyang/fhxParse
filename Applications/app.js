/**
 * @file app.js
 * @description Sanofi Swiftwater Morpheus Project apps
 * @author Alex Yang
 * @date April 16, 2025
 */

/**
 * fhx inputs
 * foler: "/Users/alexyang/Library/CloudStorage/GoogleDrive-alex.yang@awesomepresent.com/Shared drives/Awesome Present Technologies/FHX/Sanofi_Swift_Water_B55"
 * files: "055MSS3700.fhx", "A-PROTEIN_PROD.fhx"
 */

// input constants //
const fhxFolder =
    "/Users/alexyang/Library/CloudStorage/GoogleDrive-alex.yang@awesomepresent.com/Shared drives/Awesome Present Technologies/FHX/Sanofi_Swift_Water_B55";
const fhxFiles = ["055MSS3700.fhx", "A-PROTEIN_PROD.fhx"];

// initial setup //
import { setup } from "./setup.js";
setup(
    { files: fhxFiles, folder: fhxFolder },
    { override: true, clear: true, create: true }
);

// //
