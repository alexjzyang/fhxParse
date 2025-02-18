import fs from "fs";
import path from "path";

class _FileIO {
    /**
     * Prepares the directory and file path for writing.
     *
     * @param {string} filepath - The path where the text file will be written.
     * @param {string} filename - The name of the file to be written.
     * @param {boolean} [replace=true] - Flag indicating whether to replace the file if it exists.
     * @returns {string} - The prepared file path with a .txt extension.
     */
    static prepareFilePath(filepath, filename, ext) {
        // Create directory if it does not exist
        if (!fs.existsSync(filepath)) {
            fs.mkdirSync(filepath, { recursive: true });
        }
        if (ext)
            filename = filename.endsWith(ext) ? filename : `${filename}.${ext}`;
        return path.join(filepath, filename);
    }
    /**
     * Writes data to a text file at the specified path.
     *
     * @param {string} data - The data to be written to the text file.
     * @param {string} filepath - The path where the text file will be written.
     * @param {string} filename - The name of the file to be written.
     * @param {boolean} [replace=true] - Flag indicating whether to replace the file if it exists.
     * @returns {string} - Success message indicating the file was written successfully.
     * @throws {Error} - Throws an error if there is an issue writing the file.
     */
    static writeFile(data, filepath, filename, replace = false) {
        let outputFilePath = this.prepareFilePath(filepath, filename);
        // Write data to the file
        if (replace && fs.existsSync(outputFilePath)) {
            fs.unlinkSync(outputFilePath);
        }
        try {
            fs.writeFileSync(outputFilePath, data, "utf8");
            return `File successfully written to ${outputFilePath}`; // Success message
        } catch (err) {
            throw new Error(`Error writing to file: ${err.message}`); // Error handling
        }
    }

    /**
   * Writes data to a text file at the specified path.
   *
   * @param {string} data - The data to be written to the text file.
   * @param {string} filepath - The path where the text file will be written.
   * @param {string} filename - The name of the file to be written.
   @param {boolean} [replace=true] - Flag indicating whether to replace the file if it exists.
   * @returns {string} - Success message indicating the file was written successfully.
   * @throws {Error} - Throws an error if there is an issue writing the file.
   */
    static writeTxtFile(data, filepath, filename, replace = false) {
        let outputFilePath = this.prepareFilePath(filepath, filename, "txt");
        // Write data to the file
        if (replace && fs.existsSync(outputFilePath)) {
            fs.unlinkSync(outputFilePath);
        }
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
     * @param {Array<{data: string, filename: string}>} files - Array of objects containing filenames and data.
     * @param {string} filepath - The path where the text files will be written.
     * @param {boolean} [replace=true] - Flag indicating whether to replace the files if they exist.
     * @returns {Array<string>} - Array of success messages indicating the files were written successfully.
     * @throws {Error} - Throws an error if there is an issue writing any of the files.
     */
    static writeTxtFiles(files, filepath, replace) {
        // Write each file
        return files.map(({ data, filename }) => {
            return this.writeTxtFile(data, filepath, filename, replace);
        });
    }

    /**
     * Writes a single text file with data concatenated into a single string
     *
     * @param {Array<string>} data - The data to be concatenated and written to the text file.
     * @param {string} filepath - The path where the text file will be written.
     * @param {string} filename - The name of the file to be written.
     * @param {boolean} [replace=true] - Flag indicating whether to replace the file if it exists.
     * @returns {string} - Success message indicating the file was written successfully.
     * @throws {Error} - Throws an error if there is an issue writing the file.
     */
    static writeTxtFileConcat(data, filepath, filename, replace) {
        return this.writeTxtFile(
            data.join("\r\n"),
            filepath,
            filename,
            replace
        );
    }

    /**
     * Writes multiple text files to the specified directory with an auto-increment prefix.
     *
     * @param {Array<string>} data - The data to be written to the text files.
     * @param {string} filepath - The path where the text files will be written.
     * @param {string} baseFilename - The base filename for the text files.
     * @returns {Array<string>} - Array of success messages indicating the files were written successfully.
     * @throws {Error} - Throws an error if there is an issue writing any of the files.
     */
    static writeTxtFileWithPrefix(data, filepath, baseFilename, replace) {
        return data.map((data, index) => {
            // Generate auto-increment prefix
            const files = fs.readdirSync(filepath);
            const prefix = files.length + 1;
            const outputFilePath = path.join(
                filepath,
                `${prefix}_${this.addExtension(baseFilename)}`
            );
            return this.writeTxtFile(
                data,
                filepath,
                baseFilename + (index + 1)
            );
        });
    }

    static writeJsonFile(data, filepath, filename, replace) {
        let outputFilePath = this.prepareFilePath(
            filepath,
            filename,
            "json",
            replace
        );
        // Write data to the file
        this.addExtension(outputFilePath, "json");
        try {
            fs.writeFileSync(outputFilePath, JSON.stringify(data), "utf8");
            return `File successfully written to ${outputFilePath}`; // Success message
        } catch (err) {
            throw new Error(`Error writing to file: ${err.message}`); // Error handling
        }
    }

    static addExtension(baseFilename, ext = "txt") {
        return baseFilename.endsWith(`.${ext}`)
            ? baseFilename
            : `${baseFilename}.${ext}`;
    }
}

// export { FileIO };

export class FileIO {
    // if path includes an extension that is fhx, then the encoding should be utf16le
    // if the subfolders do not exist, they should be created
    // if any additional actions were taken, there should be a console log output
    static writeFile(filepath, data, options) {
        let filetype, encoding, override;
        filetype = options?.filetype || "txt";
        encoding = options?.encoding || "utf8";
        override = options?.override === undefined || true;

        // Additional logic to handle different file types
        // if function call specifies do not override, then skip the following
        if (override) {
            // if fhx file is to be written, then set encoding to utf16le
            if (filetype === "fhx" || filepath.endsWith(".fhx")) {
                encoding = "utf16le";
                console.log("Encoding set to utf16le for the input fhx file.");
            }
            // if the filepath does not exist, create the directory
            if (!fs.existsSync(filepath)) {
                const dir = path.dirname(filepath);
                fs.mkdirSync(dir, { recursive: true });
                console.log(`Directory created at ${dir}`);
            }
        }

        // Write data to the file
        fs.writeFileSync(filepath, data, encoding);
    }

    static readFile(filepath, options) {
        let filetype, encoding, override;
        filetype = options?.filetype || "txt";
        encoding = options?.encoding || "utf8";
        override = options?.override === undefined || true;

        if (override) {
            if (filepath.endsWith(".fhx" || filetype === "fhx")) {
                encoding = "utf16le";
                console.log("Encoding set to utf16le for the input fhx file.");
            }
        }
        return fs.readFileSync(filepath, encoding);
    }

    // more specifit interfaces such as writeTxtFile, writeCsvFile, readJsonFile,
    // etc. can be added here, if their usage is frequent.
}
