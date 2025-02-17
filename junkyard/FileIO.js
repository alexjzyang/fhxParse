/**
 * FileIO.js
 * Utility functions for file operations including reading and writing txt, json, csv files.
 * Supports utf-8 and utf-16le encodings.
 */

import fs from "fs";
import path from "path";

/**
 * Prepares the directory and file path for writing.
 * @param {string} filepath - The directory path.
 * @param {string} filename - The file name.
 * @param {string} extension - The file extension to ensure.
 * @returns {string} - The full file path.
 */
function prepareFilePath(filepath, filename, extension) {
  if (!fs.existsSync(filepath)) {
    fs.mkdirSync(filepath, { recursive: true });
  }
  if (!filename.endsWith(extension)) {
    filename += extension;
  }
  return path.join(filepath, filename);
}

/**
 * Writes data to a text file at the specified path.
 * @param {string} data - The data to write.
 * @param {string} filepath - The directory path.
 * @param {string} filename - The file name.
 */
function writeTxtFile(data, filepath, filename) {
  const fullPath = prepareFilePath(filepath, filename, ".txt");
  fs.writeFileSync(fullPath, data, "utf8");
}

/**
 * Writes data to a JSON file at the specified path.
 * @param {Object} data - The data to write.
 * @param {string} filepath - The directory path.
 * @param {string} filename - The file name.
 */
function writeJsonFile(data, filepath, filename) {
  const fullPath = prepareFilePath(filepath, filename, ".json");
  fs.writeFileSync(fullPath, JSON.stringify(data, null, 2), "utf8");
}

/**
 * Writes data to a CSV file at the specified path.
 * @param {string[]} header - The CSV header.
 * @param {string[][]} records - The CSV records.
 * @param {string} filepath - The directory path.
 * @param {string} filename - The file name.
 */
function writeCsvFile(header, records, filepath, filename) {
  const fullPath = prepareFilePath(filepath, filename, ".csv");
  const csvContent = [
    header.join(","),
    ...records.map((row) => row.join(",")),
  ].join("\n");
  fs.writeFileSync(fullPath, csvContent, "utf8");
}

/**
 * Reads a file with the specified encoding.
 * @param {string} filepath - The file path.
 * @param {string} encoding - The file encoding (e.g., 'utf8', 'utf16le').
 * @returns {string} - The file content.
 */
function readFile(filepath, encoding = "utf8") {
  return fs.readFileSync(filepath, encoding);
}

/**
 * Reads an .fhx file using utf-16le encoding.
 * @param {string} filepath - The file path.
 * @returns {string} - The file content.
 */
function readFhxFile(filepath) {
  return readFile(filepath, "utf16le");
}

export { writeTxtFile, writeJsonFile, writeCsvFile, readFile, readFhxFile };
