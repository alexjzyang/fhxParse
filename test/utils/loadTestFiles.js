const fs = require("fs");

function loadTxtFile(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function loadFhxFile(filePath) {
  return fs.readFileSync(filePath, "utf16le");
}

function loadJsonFile(filePath) {
  const fileContent = fs.readFileSync(filePath, "utf8");
  return JSON.parse(fileContent);
}

module.exports = {
  loadTxtFile,
  loadFhxFile,
};
