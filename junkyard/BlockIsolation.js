/*
    BlockIsolation.js aims to find and isolate and extract DeltaV objects of 
    interest and its inner block properties. 

    For example:
    These functions can extract the list of ATTIRBUTE blocks from _C_M_AI class modules.

    TODO: given these blocks, one can identify the object value and properties.
*/

/**
 * classProperties finds the module header properties of a control module class
 * @param {string} block string of a particular fhx block
 * @returns an object with all the header properties of a control module class block
 *
 * TODO: This can be generalized
 * This function can correctly identify the values of the header properties.
 * However the names of the properties are hard coded. Further modifications
 * would enable dynamic inputs for values to find, possibly from a separate
 * object where information of the fhx element names is stored
 */
function classProperties(block) {
  // This is supposed to be an input values
  // const blockIdentity = `MODULE_CLASS NAME="_C_M_AGIT_M"`;
  let blockHeader = {
    desc: { fhxkey: "DESCRIPTION", DVname: "Description" },
    rate: { fhxkey: "PERIOD", DVname: "Scan Rate" },
    pic: {
      fhxkey: "PRIMARY_CONTROL_DISPLAY",
      DVname: "Primary Control Display",
    },
    fp: { fhxkey: "INSTRUMENT_AREA_DISPLAY", DVname: "Faceplate" },
    dt: { fhxkey: "DETAIL_DISPLAY", DVname: "Detail Display" },
    type: { fhxkey: "TYPE", DVname: "Module Type " },
    subtype: { fhxkey: "SUB_TYPE", DVname: "Module Subtype" },
    nvm: { fhxkey: "NVM", DVname: "TBD" },
    restart: { fhxkey: "PERSIST", DVname: "TBD-Restart Mode" },
  };

  for (const key in blockHeader) {
    if (Object.prototype.hasOwnProperty.call(blockHeader, key)) {
      const fhxkey = blockHeader[key].fhxkey;
      let searchFor = `${fhxkey}=`;
      let startIndex = block.indexOf(searchFor) + searchFor.length;
      let endIndex = block.indexOf("\r\n", startIndex);
      let value = block.substring(startIndex, endIndex);
      if (value[0] === '"' && value[value.length - 1] === '"') {
        value = value.substring(1, value.length - 1);
      }
      blockHeader[key]["value"] = value;
    }
  }
  return blockHeader;
}

/**
 * isolateBlock takes an entire fhx string and finds all the blocks of given type
 * by using indexOf over the block type and isolating block content by counting
 * depth change characters. This function now works with inner blocks, when the
 * input contains a single DeltaV object.
 * @param {string} fhxstring input fhx data
 * @param {string} blockType the fhx block type to find
 * @returns [string] fhx text describing each block
 * This replaces FhxProcessor.extractBlockTexts from the fhx-102024 project
 */
function isolateBlock(fhxstring, blockType) {
  let blocks = [];
  let currIndex, blockStartIndex, blockEndIndex;
  // All the relevant blocks start with the format [blockType] NAME="
  // The exceptions are fhx file header, and other non control logic related strings
  let search = blockType + " NAME";
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
