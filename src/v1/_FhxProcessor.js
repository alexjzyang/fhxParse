import { FileIO } from "./_FileIO.js";

import fs from "fs";
import path from "path";
import { createObjectCsvWriter as createCsvWriter } from "csv-writer";

/**
 * findBlocks takes an entire fhx string and finds all the blocks of given type
 * by using indexOf over the block type and isolating block content by counting
 * depth change characters. This function now works with inner blocks, when the
 * input contains a single DeltaV object. The search criteria is "[BLOCKTYPE] NAME"
 * @param {string} fhxstring input fhx data
 * @param {string} blockType the fhx block type to find
 * @returns {[string]} fhx text describing each block
 * This replaces FhxProcessor.extractBlockTexts from the fhx-102024 project
 */
function findBlocks(fhxstring, blockType) {
  let blocks = [];
  let currIndex, blockStartIndex, blockEndIndex;
  // All the relevant blocks start with the format [blockType] NAME="
  // The exceptions are fhx file header, and other non control logic related strings
  let search;
  let endWithSpace = blockType + " ";
  let endingWithReturn = blockType + "\r\n";

  if (fhxstring.indexOf(endWithSpace) !== -1) search = endWithSpace;
  else if (fhxstring.indexOf(endWithSpace) !== -1) search = endingWithReturn;
  else return blocks;

  // Repeat the following
  // finds the first key using indexOf this is the start index of the substring to cut later
  while ((currIndex = fhxstring.indexOf(search, currIndex)) !== -1) {
    blockStartIndex = currIndex;
    let depth = 0;
    do {
      // finds the next open bracket and the next close bracket
      const openIndex = fhxstring.indexOf("{", currIndex + 1);
      const closeIndex = fhxstring.indexOf("}", currIndex + 1);
      if (closeIndex === -1) {
        // if there is no closing bracket for the rest of the fhxstring and
        // the depth is still not 0, there's an error
        throw new Error("Unexpected EOF");
      }

      // Start counting the depths.
      if (openIndex < closeIndex && openIndex !== -1) {
        // if the next index of open bracket is smaller than the closing bracket and
        // it is not -1, increase depth counter
        depth += 1;
        // increment the currIndex so the next iteration start counting from
        // the new index position
        currIndex = openIndex;
      } else {
        // If the above is not true
        // If the index of the next open bracket is not smaller than the closing bracket,
        // or if there is no more open bracket, decrease depth counter
        depth -= 1;
        // update curr index
        currIndex = closeIndex;
      }
    } while (depth !== 0); // Stop counting when the depth is back to 0 again.
    // this index will be the end index of the block string.
    // isolate the block string
    blockEndIndex = currIndex + 1;
    blocks.push(fhxstring.substring(blockStartIndex, blockEndIndex));
  }

  return blocks;
}

/**
 * identifyBlock takes a list of block items and returns the one with the name equal
 * to the input name value by using [BLOCKTYPE] NAME="[NAME]" search criteria
 * @param {string} blockType the type (blockKey) of the input fhx block
 * @param {string} name the name of which block to extract
 * @param {[string]} blocks an array of fhx blocks
 * @returns {string} a block element which name matches the input name
 */
function identifyBlock(blockType, name, blocks) {
  // const inBlock = [{ key: "MODULE_CLASS", id: "_C_M_AI" }];
  const signature = `${blockType} NAME="${name}"`;
  let res = blocks.filter((b) => b.includes(signature));
  if (res.length > 1) {
    throw new Error("more than one block found");
  }

  return res[0];
}

/**
 * extractValueFrom is speficit to the extract the inner value block from a single
 * block object
 * @param {string} block one fhx block
 * @param {string} keyname name of the value to be extracted
 * @returns
 */
function extractValueFrom(block, keyname) {
  // find the `[valuename]=`
  let search = `${keyname}=`;
  let startIndex = block.indexOf(search);
  if (startIndex === -1) return "";
  else startIndex += search.length;
  // find the end of the property value
  let indexOfSpace = block.indexOf(" ", startIndex);
  let indexOfReturn = block.indexOf("\r\n", startIndex);
  let endIndex;
  if (indexOfSpace === -1) endIndex = indexOfReturn;
  else if (indexOfReturn === -1) endIndex = indexOfSpace;
  // find either the next space or the next return line, which ever the index is lower
  else endIndex = indexOfSpace < indexOfReturn ? indexOfSpace : indexOfReturn;
  let value = block.substring(startIndex, endIndex);
  // extract the substring, and erase the double quotes
  if (value[0] === '"') return value.substring(1, value.length - 1);
  else return value;
  // Special case needs to be given for T_EXPRESSION
}

// Below are helper functions and functions for specific cases and should not
// be integrated into the general fhxprocessor library

/**
 * unindentation and blockIndentation functions are tightly coupled with the
 * functions that identifies and isolates a fhx block. The isolation process
 * produces a string where lines retain their indentations from the original
 * fhx string. These two helper functions fix the issue and produce a new fhx
 * string where the new block starts with no leading spaces
 * @param {string} blockString a fhx string of a single block (inner block)
 * @param {number} numToUninent represents the number of spaces
 * @returns a new fhx string where the block is properly unindented.
 */
function unindentation(blockString, numToUninent) {
  let newBlock = blockString.split("\r\n").map((line) => {
    if (line.startsWith(" ".repeat(numToUninent))) {
      return line.substring(numToUninent);
    } else {
      return line;
    }
  });
  return newBlock.join("\r\n");
}

/**
 * blockIndentation finds out the number of leading spaces of the input block.
 * and therefore provides block depth information. The function only examines
 * the indentation of the last line. The line where the closing bracket of the
 * block is found.
 * @param {string} block the fhx string describing a deltav object block or a
 * inner block
 * @returns the number of leading spaces of the block of this depth
 */
function blockIndentation(block) {
  const indentationIndex = block.lastIndexOf("\r\n");
  const indentation = block.substring(indentationIndex + 2, block.length - 1);
  return indentation.length;
}

/**
 * tempWrite is a helper function to write a string into a text file for test and review
 * @param {string} input string to be written to text file
 * @param {string} filename file name. The default is ./output/temp.txt
 * @param {boolean} clear flag to clear the directory before writing
 * @returns return value is ont used
 */
function tempWrite(
  input,
  filepath = "./output",
  filename = "temp.txt",
  clear = false
) {
  if (clear) {
    fs.readdirSync(filepath).forEach((file) => {
      const filePath = path.join(filepath, file);
      if (fs.lstatSync(filePath).isFile()) {
        fs.unlinkSync(filePath);
      }
    });
  }
  if (input) {
    FileIO.writeTxtSync(path.join(filepath, filename), input);
  }
}

/**
 * writeCsv writes a csv file based on the input
 * @param {} header
 * @param {} records
 * @param {string} filepath
 * @param {string} filename the default is ./output/tempcsv.csv
 */
function writeCsv(
  header,
  records,
  filepath = "./output",
  filename = "tempcsv"
) {
  // if no filename is given use a hardcoded filename tempcsv
  // if filename doesn't have .csv suffix add .csv to it
  if (!filename.includes(".csv")) filename += ".csv";

  // boilerplate to create a csvwriter with filepath and table header
  const csvWriter = createCsvWriter({
    path: path.join(filepath, filename), // The path where the CSV file will be saved
    header: header,
  });

  // create csv file with the input records/rows
  csvWriter
    .writeRecords(records) // returns a promise
    .then(() => {
      console.log("CSV file was written successfully." + filename);
    });
}

/**
 * In a single fhx object find a list of block of interest. Extract all the
 * desired information of that block. For example, given a control module
 * class, find all the ATTRIBUTE_INSTANCEs. Extract their NAMEs and the EXPOSE
 * parameter, if exists
 * Additional logic is needed to work with information that has unique formatting
 * @param {string} data fhxstring containing one single fhx object
 * @param {string} blockType the block which contains the parameter
 * @param {[{id,fhx}]} keys an array which contains all the fhx terms to be
 * extracted from the parameter block
 */
function findParameterList(data, blockType, keys) {
  // find all the inner blocks tha thas the desired block type
  let blocks = findBlocks(data, blockType);

  let params = [];

  for (let index = 0; index < blocks.length; index++) {
    const block = blocks[index];
    let param = {};
    // the keys contain all the information that should be extracted from the inner block
    keys.forEach(({ id, fhx }) => {
      // for each id in keys, find and extract the fhx value ([VALUENAME(id)]="[VALUE(fhx)]")
      // and store in a new param object
      param[id] = extractValueFrom(block, fhx);
    });

    // creating a list of found parameter value.
    params.push(param);
  }

  // apply certain degree of sorting for a neat presentation
  let sort = keys[0].id;
  params = params.sort((a, b) =>
    a[sort].toLowerCase().localeCompare(b[sort].toLowerCase())
  );

  // converting keys into a writeCsv friendly format, i.e. instead of using the
  // object key "fhx", the write csv package requires the use of object key "title"
  keys.forEach((key) => {
    key["title"] = key["fhx"];
  });

  // write the parameter data into a csv file. (hard coded to be temp.csv for now)
  writeCsv(keys, params, outputPath, "tempexpo.csv");
  return params;
}

/**
 * Takes one string and replace the value from fhx term to the DV display term
 * This function is simply string manipulation. It needs to be generalized and
 * integrated for FHX processing
 * @param {string} input string to be replaced
 * @param {[{fhx,display}]} replacer a replacer to replace the fhx term into the display term
 * @returns modified string
 * The replacer can be dynamically from a csv file
 */
function fhxReplacer(input, replacer) {
  // in the input doesn't exist, exit and return undefined
  // this can happen when the outter function does not find any
  // value in any particular case
  if (!input) return;
  // this list can grow and be fed through a csv table
  let defaultReplacer = [
    { fhx: "INTERNAL_REFERENCE", display: "Internal Reference" },
    { fhx: "BOOLEAN", display: "Boolean" },
    { fhx: "FLOAT", display: "Floating point" },
    { fhx: "UNICODE_STRING", display: "String" },
    { fhx: "EVENT", display: "Alarm" },
    { fhx: "EXTERNAL_REFERENCE", display: "External Reference" },
    { fhx: "ENUMERATION_VALUE", display: "Named Set" },
    { fhx: "UINT32", display: "32 bit unsigned integer" },
    // { fhx: "", display: "" },
    // { fhx: "", display: "" },
    // { fhx: "", display: "" },
  ];
  // use the given replacer if present, otherwise use the default replacer
  if (!replacer) replacer = defaultReplacer;
  // go through each item in the replacer arrange and replace any term found
  // in the input string by the replacer value.
  replacer.forEach(({ fhx, display }) => {
    input = input.replace(fhx, display);
  });
  return input;
}

/**
 * fhxObject finds a particular fhx object
 * @param {string} fhxstring fhx string as input
 * @param {string} type the type of fhx object
 * @param {string} name the block that needs to be found
 * @returns a fhx string that contains one single block
 */
function findBlockWithName(fhxstring, type, name, print = false) {
  // find a list of block matching the block type
  let blocks = findBlocks(fhxstring, type);
  // within this list, find the block that matches the name
  let res = identifyBlock(type, name, blocks);
  if (print) {
    FileIO.writeTxtFile(res, "output/temp", name);
  }
  return res;
}
/*
    In order to find the defauly values of the parameters, we need to find
    1. attributes blocks: These are module parameter blocks
    2. attribute instance blocks which have the same name as the attribute blocks:
      These are the default values of the module parameters
    3. value blocks: The actual values of the parameters are store in CV=, and 
      REF=
  */

/**
 * valueOf finds the value of a particular parameter in a single fhx block
 * @param {string} fhxBlock fhx string of a single block
 * @param {string} key the name of the value to be extracted
 * @returns value of the key
 * Example: Extracting CATEGORY from a MODULE_CLASS block
 */

function valueOfParameter(fhxBlock, key) {
  // this function should be generalized/reworked.
  // If the key is T_EXPRESSION, then it will be surrounded by quotes; otherwise it will not.
  // Alternatively, we can pass in a flag indicating whether we're looking for an expression or not.
  // valuesOfModuleParameters() currently uses the the switching option to predetermine the type of the parameter
  key += "=";
  let startIndex = fhxBlock.indexOf(key);
  if (startIndex === -1) return;

  startIndex += key.length;
  let endIndex;
  if (fhxBlock[startIndex] === '"' && fhxBlock[startIndex + 1] !== '"') {
    endIndex = ++startIndex;
    do {
      endIndex = fhxBlock.indexOf('"', endIndex + 1); // find the next closing double quote
    } while (fhxBlock[endIndex + 1] === '"');
  } else if (fhxBlock[startIndex] === '"' && fhxBlock[startIndex + 1] === '"') {
    // this code is to be refactored and decoupled
    endIndex = startIndex + 2;
  } else {
    let indexOfSpace = fhxBlock.indexOf(" ", startIndex + 1);
    let indexOfReturn = fhxBlock.indexOf("\r\n", startIndex + 1);
    endIndex = indexOfSpace < indexOfReturn ? indexOfSpace : indexOfReturn;
  }

  if (startIndex === -1 || endIndex === -1) return;
  return fhxBlock.substring(startIndex, endIndex);
}

/**
 * Extracts the name of a given FHX block.
 *
 * @param {string} fhxBlock - The FHX string of a single block.
 * @returns {string} - The name of the block.
 */
function nameOf(fhxBlock) {
  // fhxBlock has to be one single block.
  let startIndex = fhxBlock.indexOf('NAME="') + 6;
  let endIndex = fhxBlock.indexOf('"', startIndex);
  if (startIndex === -1 || endIndex === -1) return;
  let name = fhxBlock.substring(startIndex, endIndex);
  return name;
}

/**
 * Finds the function block definition of a composite block (FUNCTION_BLOCK)
 * in a fhx Block (FUNCTION_BLOCK_DEFINITION).
 * @param {string} blockName the name of the composite block
 * @param {string} fbOfObj the fhx block where the composite block is in
 * @param {string} fromFhx the fhx where the composite block is defined
 * @returns {string} the function block definition of the composite block
 */
function findFbdOf(blockName, fbOfObj, fromFhx) {
  let fbBlock = findBlockWithName(fbOfObj, "FUNCTION_BLOCK", blockName);
  let fbdDefName = valueOfParameter(fbBlock, "DEFINITION");
  return findBlockWithName(fromFhx, "FUNCTION_BLOCK_DEFINITION", fbdDefName);
}

function SFCSteps(emFhxData) {
  let steps = fhxProcessor.findBlocks(emFhxData, "STEP");
  /*
    Structure of Steps:
    Description
    List of ACTIONS
  */
  let stepValues = steps.map((step) => {
    let getValue = (key) => valueOfParameter(step, key);
    let values = {
      name: getValue("NAME"),
      description: getValue("DESCRIPTION"),
      actions: SFCActions(step),
    };
    return values;
  });
  return stepValues;
}

function SFCTransitions(cmdFhxData) {
  let transitionBlocks = fhxProcessor.findBlocks(cmdFhxData, "TRANSITION");
  /*
    Structure of Transitions:
    Transition Header
    transition: [
    { id: "name", title: "NAME" },
    { id: "description", title: "DESCRIPTION" },
    { id: "position", title: "POSITION" },
    { id: "termination", title: "TERMINATION" },
    { id: "expression", title: "EXPRESSION" },
    ],
   */
  let transitionValues = transitionBlocks.map((block) => {
    let transitionValue = (key) => valueOfParameter(block, key);
    let values = {
      name: transitionValue("NAME"),
      description: transitionValue("DESCRIPTION"),
      position: transitionValue("POSITION"),
      termination: transitionValue("TERMINATION"),
      expression: transitionValue("EXPRESSION"),
    };
    return values;
  });
  return transitionValues;
}

function SFCActions(stepFhxData) {
  let actionBlocks = fhxProcessor.findBlocks(stepFhxData, "ACTION");
  /*
      Structure of Actions:
      Action Header
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
      ]
  */
  let actionValues = actionBlocks.map((block) => {
    let getValue = (key) => valueOfParameter(block, key);
    let values = {
      name: getValue("NAME"),
      description: getValue("DESCRIPTION"),
      actionType: getValue("ACTION_TYPE"),
      qualifier: getValue("QUALIFIER"),
      expression: getValue("EXPRESSION"),
      confirmExpression: getValue("CONFIRM_EXPRESSION"),
      confirmTimeOut: getValue("CONFIRM_TIME_OUT"),
      delayedExpression: getValue("DELAY_EXPRESSION"),
      delayTime: getValue("DELAY_TIME"),
    };
    return values;
  });

  return actionValues;
}

function processSFC(cmdfhx) {
  let steps = SFCSteps(cmdfhx);
  let transitions = SFCTransitions(cmdfhx);
  return { steps, transitions };
}

export {
  findBlocks,
  identifyBlock,
  extractValueFrom,
  unindentation,
  blockIndentation,
  tempWrite,
  writeCsv,
  findParameterList,
  fhxReplacer,
  findBlockWithName,
  valueOfParameter,
  nameOf,
  findFbdOf,
  // SFC related functions
  SFCSteps,
  SFCTransitions,
  SFCActions,
  processSFC,
};
