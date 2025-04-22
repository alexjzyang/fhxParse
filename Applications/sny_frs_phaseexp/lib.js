export function listRootBlocks(fhx) {
    // This function identifies and extracts root-level blocks from the given FHX string.
    // It tracks the depth of nested brackets and determines the boundaries of each block.

    let depth = 0; // Tracks the current depth of nested brackets.
    let currIndex = 0; // Tracks the current position in the FHX string.
    let blockStartIndex = 0; // Marks the start of a block.
    let blockEndIndex = 0; // Marks the end of a block.
    let blocks = []; // Array to store the extracted blocks.

    // Set the starting index of the current block.
    blockStartIndex = currIndex;
    while (currIndex < fhx.length) {
        // Loop to find the matching closing bracket for the current block.
        blockStartIndex = currIndex; // Set the start index of the current block.
        do {
            const openBracketIndex = fhx.indexOf("{", currIndex + 1); // Find the next opening bracket.
            const closeBracketIndex = fhx.indexOf("}", currIndex + 1); // Find the next closing bracket.

            // If no closing bracket is found, throw an error.
            if (closeBracketIndex === -1) {
                throw new Error("Unexpected EOF");
            }

            // Determine whether the next bracket is an opening or closing bracket.
            if (
                openBracketIndex < closeBracketIndex &&
                openBracketIndex !== -1
            ) {
                depth += 1; // Increase depth for an opening bracket.
                currIndex = openBracketIndex; // Move to the position of the opening bracket.
            } else {
                depth -= 1; // Decrease depth for a closing bracket.
                currIndex = closeBracketIndex; // Move to the position of the closing bracket.
            }
        } while (depth !== 0); // Continue until the depth returns to 0, indicating the end of the block.

        // Set the end index of the current block.
        blockEndIndex = ++currIndex;

        // Extract the block from the FHX string and add it to the blocks array.
        let block = fhx.substring(blockStartIndex, blockEndIndex);
        // Trim the block to remove comments and whitespace.
        block = trimComments(block);
        blocks.push(block);
    }

    return blocks;
}

export function trimComments(fhxblock) {
    return fhxblock.replace(/\/\*[\s\S]*?\*\//g, "").trim();
}

export function getBlockName(fhxblock) {
    let line = fhxblock.split("\n")[0];
    const name = line.match(/.*?NAME="([^"]+)"/);
    const tag = line.match(/.*?TAG="([^"]+)"/);
    let match = name || tag;
    return match ? match[1] : null;
}

export function getBlockType(fhxblock) {
    const match = fhxblock.match(/^\s*(\w+)/);
    return match ? match[1] : null;
}

/**
 * Identify the BLOCK_KEY, BLOCK_IDENTIFIER, BLOCK_IDENTIFIER_VALUE with the format:
 * BLOCK_KEY BLOCK_IDENTIFIER="BLOCK_IDENTIFIER_VALUE"
 * @param {*} fhx
 */
export function getBlockInfo(fhx) {}
