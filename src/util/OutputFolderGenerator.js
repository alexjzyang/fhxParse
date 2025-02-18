import fs from "fs";
import path from "path";

/**
 * Increments the run number based on existing folders in the base directory.
 * @param {string} baseDir - The base directory where folders are located.
 * @param {string} baseName - The base name for the folders.
 * @returns {string} - The incremented run number.
 */
function incrementRunNumber(baseDir, baseName) {
    const existingFolders = fs.existsSync(baseDir)
        ? fs.readdirSync(baseDir)
        : [];

    let runNumber = 1;

    for (const folder of existingFolders) {
        let folderWithRunNumber = `${baseName}${runNumber}`;
        if (folder.includes(folderWithRunNumber)) {
            runNumber++;
        }
    }
    return `${baseName}${runNumber}`;
}

/**
 * Creates a new folder with an auto-incremented number and date in the base directory.
 * @param {string} baseDir - The base directory where folders will be created.
 * @param {string} baseName - The base name for the folders.
 * @param {Date} [date=new Date()] - The date to be included in the folder name.
 * @returns {string} - The path of the created folder.
 */
function createTestFolder(baseDir, baseName, date = new Date()) {
    let dateString = `${String(date.getFullYear())}${String(
        date.getMonth() + 1
    ).padStart(2, "0")}${String(date.getDate() + 1).padStart(2, "0")}`;
    const existingFolders = fs.existsSync(baseDir)
        ? fs.readdirSync(baseDir)
        : [];

    for (const folder of existingFolders) {
        if (folder.includes(dateString)) {
            return path.join(baseDir, folder);
        }
    }
    let runNumber = incrementRunNumber(baseDir, baseName);
    const newFolderName = `${runNumber}_${dateString}`;
    let newFolderPath = path.join(baseDir, newFolderName);
    fs.mkdirSync(newFolderPath, { recursive: true });
    return newFolderPath;
}

export { incrementRunNumber, createTestFolder };
