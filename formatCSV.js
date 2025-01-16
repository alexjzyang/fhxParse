import path from "path";
import fs from "fs";
import { createObjectCsvWriter } from "csv-writer";

const inputfilepath = path.join(
  "output",
  "_E_M_AGIT",
  "commands",
  "steps",
  "actions.json"
);

const outputfilepath = path.join(
  "output",
  "_E_M_AGIT",
  "commands",
  "steps",
  "actions.csv"
);
const csvHeaders = {
  action: [
    { id: "name", title: "NAME" },
    { id: "description", title: "DESCRIPTION" },
    { id: "actionType", title: "ACTION_TYPE" },
    { id: "qualifier", title: "QUALIFIER" },
    { id: "expression", title: "EXPRESSION" },
    { id: "confirmExpression", title: "CONFIRM_EXPRESSION" },
    { id: "confirmTimeOut", title: "CONFIRM_TIME_OUT" },
    { id: "delayedExpression", title: "DELAY_EXPRESSION" },
    { id: "delayTime", title: "DELAY_TIME" },
  ],
  transition: [
    { id: "name", title: "NAME" },
    { id: "description", title: "DESCRIPTION" },
    { id: "termination", title: "TERMINATION" },
    { id: "expression", title: "EXPRESSION" },
  ],
};

function readJsonFile(filepath) {
  let jsonData = fs.readFileSync(filepath, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(data);
  });
  return JSON.parse(jsonData);
}

function createCsvWriter(filepath, header) {
  return createObjectCsvWriter({
    path: filepath,
    header,
  });
}

function writeCsvFile(csvWriter, records) {
  csvWriter
    .writeRecords(records)
    .then(() => {
      console.log("CSV file was written successfully");
    })
    .catch((error) => {
      console.error("Error writing CSV file:", error);
    });
}

function massageData(records, headers) {
  return records.map((record) => {
    const newRecord = {};
    headers.forEach((header) => {
      const keys = header.id.split(".");
      let value = record;
      keys.forEach((key) => {
        value = value ? value[key] : null;
      });
      newRecord[header.id] = value;
    });
    return newRecord;
  });
}

function writeCommandsToCsv(jsonFilePath, csvFilePath, csvHeaders) {
  const records = readJsonFile(jsonFilePath);
  const massagedRecords = massageData(records, csvHeaders);
  const csvWriter = createCsvWriter(csvFilePath, csvHeaders);
  writeCsvFile(csvWriter, massagedRecords);
}

function generateCsvHeader(jsonFilePath) {
  const records = readJsonFile(jsonFilePath);
  const headers = new Set();

  function addHeaders(obj, prefix = "") {
    Object.keys(obj).forEach((key) => {
      const newKey = prefix ? `${prefix}.${key}` : key;
      if (typeof obj[key] === "object" && obj[key] !== null) {
        addHeaders(obj[key], newKey);
      } else {
        headers.add(newKey);
      }
    });
  }

  records.forEach((record) => {
    addHeaders(record);
  });

  return Array.from(headers).map((header) => ({
    id: header,
    title: header.toUpperCase(),
  }));
}

function main() {
  const jsonFilePath = path.join("output", "_E_M_AGIT", "commands.json");

  const csvFilePath = path.join("output", "_E_M_AGIT", "commands.csv");

  const csvHeaders = generateCsvHeader(jsonFilePath);
  writeCommandsToCsv(jsonFilePath, csvFilePath, csvHeaders);
}

main();

/**
 * The word file output
 * S0001 | A000 | Delay: Time | Delayed Expression
 *              | Expression  | Qualifier
 *              | Confirm: Expression | Time Out
 *       | A010 | Delay: Time | Delayed Expression
 *              | Expression  | Qualifier
 *              | Confirm: Expression | Time Out
 *       | A020 | Delay: Time | Delayed Expression
 *              | Expression  | Qualifier
 *              | Confirm: Expression | Time Out
 * S0002 | A000 | Delay: Time | Delayed Expression
 *              | Expression  | Qualifier
 *              | Confirm: Expression | Time Out
 *       | A010 | Delay: Time | Delayed Expression
 * ... ... ...
 *
 * Header
 *
 *
 *
 */
