import fs from "fs";
import path from "path";

class FileIO {
  /**
   * Creates a directory if it does not exist.
   *
   * @param {string} dirPath - The path of the directory to create.
   */
  static createDirIfNotExists(dirPath) {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  }

  /**
   * Clears all files in the specified directory.
   *
   * @param {string} dirPath - The path of the directory to clear.
   */
  static clearDirectory(dirPath) {
    fs.readdirSync(dirPath).forEach((file) => {
      fs.unlinkSync(path.join(dirPath, file));
    });
  }

  /**
   * Ensures the file has a .txt extension.
   *
   * @param {string} filename - The filename to check.
   * @returns {string} - The filename with a .txt extension.
   */
  static addExtensions(filename) {
    return filename.endsWith(".txt") ? filename : `${filename}.txt`;
  }

  /**
   * Prepares the directory and file path for writing.
   *
   * @param {string} outputFilePath - The path where the text file will be written.
   * @param {boolean} clearDir - Flag indicating whether to clear the directory before writing the file.
   * @returns {string} - The prepared file path with a .txt extension.
   */
  static prepareFilePath(outputFilePath, clearDir) {
    const dirPath = path.dirname(outputFilePath);

    // Create directory if it does not exist
    this.createDirIfNotExists(dirPath);

    // Clear the directory if the flag is set to true
    if (clearDir) {
      this.clearDirectory(dirPath);
    }

    // Ensure the file has a .txt extension
    return this.addExtensions(outputFilePath);
  }

  /**
   * Writes data to a text file at the specified path.
   *
   * @param {string} outputFilePath - The path where the text file will be written.
   * @param {string} data - The data to be written to the text file.
   * @returns {string} - Success message indicating the file was written successfully.
   * @throws {Error} - Throws an error if there is an issue writing the file.
   */
  static writeTxtSync(outputFilePath, data) {
    // Write data to the file
    try {
      fs.writeFileSync(outputFilePath, data, "utf8");
      return `File successfully written to ${outputFilePath}`; // Success message
    } catch (err) {
      throw new Error(`Error writing to file: ${err.message}`); // Error handling
    }
  }

  /**
   * Writes multiple text files to the specified directory.
   *
   * @param {string} dirPath - The directory where the text files will be written.
   * @param {Array<{filename: string, data: string}>} files - Array of objects containing filenames and data.
   * @param {boolean} [clearDir=false] - Flag indicating whether to clear the directory before writing the files.
   * @returns {Array<string>} - Array of success messages indicating the files were written successfully.
   * @throws {Error} - Throws an error if there is an issue writing any of the files.
   */
  static writeTxtFiles(dirPath, files, clearDir = false) {
    // Prepare directory
    this.createDirIfNotExists(dirPath);
    if (clearDir) {
      this.clearDirectory(dirPath);
    }

    // Write each file
    return files.map((file) => {
      const outputFilePath = path.join(
        dirPath,
        this.addExtensions(file.filename)
      );
      return this.writeTxtSync(outputFilePath, file.data);
    });
  }

  /**
   * Writes a single text file to the specified directory with an auto-increment prefix.
   *
   * @param {string} dirPath - The directory where the text file will be written.
   * @param {string} filename - The base filename for the text file.
   * @param {string} data - The data to be written to the text file.
   * @param {boolean} [clearDir=false] - Flag indicating whether to clear the directory before writing the file.
   * @returns {string} - Success message indicating the file was written successfully.
   * @throws {Error} - Throws an error if there is an issue writing the file.
   */
  static writeTxtFileWithPrefix(dirPath, filename, data, clearDir = false) {
    // Prepare directory
    this.createDirIfNotExists(dirPath);
    if (clearDir) {
      this.clearDirectory(dirPath);
    }

    // Generate auto-increment prefix
    const files = fs.readdirSync(dirPath);
    const prefix = files.length + 1;
    const outputFilePath = path.join(
      dirPath,
      `${prefix}_${this.addExtensions(filename)}`
    );

    return this.writeTxtSync(outputFilePath, data);
  }

  /**
   * Writes text files to the specified directory. If a single filename is provided, it adds an auto-increment prefix.
   * If data is an array, it writes one single text file.
   *
   * @param {string} dirPath - The directory where the text files will be written.
   * @param {string|Array<{filename: string, data: string}>} files - A single filename or an array of objects containing filenames and data.
   * @param {string|Array<string>} [data] - The data to be written to the text file if a single filename is provided, or an array of data if writing a single file.
   * @param {boolean} [clearDir=false] - Flag indicating whether to clear the directory before writing the files.
   * @returns {Array<string>|string} - Array of success messages indicating the files were written successfully or a single success message.
   * @throws {Error} - Throws an error if there is an issue writing any of the files.
   */
  static writeFiles(dirPath, files, data, clearDir = false) {
    // Prepare directory
    this.createDirIfNotExists(dirPath);
    if (clearDir) {
      this.clearDirectory(dirPath);
    }

    if (Array.isArray(files)) {
      // Write multiple files
      return this.writeTxtFiles(dirPath, files);
    } else if (Array.isArray(data)) {
      // Write a single file with concatenated data
      const filesInDir = fs.readdirSync(dirPath);
      const prefix = filesInDir.length + 1;
      const outputFilePath = path.join(
        dirPath,
        `${prefix}_${this.addExtensions(files)}`
      );
      const concatenatedData = data.join("\n");
      return this.writeTxtSync(outputFilePath, concatenatedData);
    } else {
      // Write a single file with auto-increment prefix
      return this.writeTxtFileWithPrefix(dirPath, files, data);
    }
  }
}

export { FileIO };
