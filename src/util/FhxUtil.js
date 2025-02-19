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
    else if (fhxstring.indexOf(endingWithReturn) !== -1)
        search = endingWithReturn;
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

/*
    In order to find the default values of the parameters, we need to find
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
    if (
        fhxBlock[startIndex] === '"'
        // && fhxBlock[startIndex + 1] !== '"'
    ) {
        endIndex = startIndex++;
        do {
            endIndex = fhxBlock.indexOf('"', endIndex + 1); // find the next closing double quote
        } while (fhxBlock[endIndex + 1] === '"');
        // } else if (fhxBlock[startIndex] === '"' && fhxBlock[startIndex + 1] === '"') {
        //   // this code is to be refactored and decoupled
        //   endIndex = startIndex + 2;
    } else {
        let indexOfSpace = fhxBlock.indexOf(" ", startIndex + 1);
        let indexOfReturn = fhxBlock.indexOf("\r\n", startIndex + 1);
        if (indexOfSpace === -1 && indexOfReturn !== -1)
            endIndex = indexOfReturn;
        else if (indexOfSpace !== -1 && indexOfReturn === -1)
            endIndex = indexOfSpace;
        else
            endIndex =
                indexOfSpace < indexOfReturn ? indexOfSpace : indexOfReturn;
    }

    if (startIndex === -1 || endIndex === -1) return;
    return fhxBlock.substring(startIndex, endIndex);
}

function findBlockWithName(fhxstring, blockType, name) {
    return findBlockWithCondition(fhxstring, {
        blockType,
        key: "NAME",
        value: name,
    });
}

/**
 *
 * @param {*} fhxstring
 * @param {*} condition {blockType, key, value}
 * @returns
 */
function findBlockWithCondition(fhxstring, condition) {
    let { blockType, key, value } = condition;

    let blocks = findBlocks(fhxstring, blockType);

    let search = ` ${key}="${value}"`;
    let res = blocks.filter((b) => b.includes(search));
    if (res.length > 1) {
        throw new Error("more than one block found");
    }
    return res[0];
}

function processValueBlocks(block) {
    // TYPES OF VALUE BLOCKS
    // NamedSet value
    // Number
    // For alarms
    // Enum values
    // Paramater with status
    // Reference values
    // Modes
}

export {
    findBlocks,
    valueOfParameter,
    findBlockWithName,
    findBlockWithCondition,
    processValueBlocks,
};
