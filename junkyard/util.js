// the depthCalc function go through the fhx code and increment and decrement the depth based on the depth open and closing characters
// further implimentation using this logic can go throught the fhx searching for the depth of a particular index or substring
// Further implimentation can identify matching brackets or brackets with the same depth, and possibly extract all blocks and nested
//    blocks substrings. However the depth calculation only takes into account of the content surrounded by the brackets, the definition
//    of a particular bracket content is out side of it. So further design on what would be meaningful information to be extracted is
//    required
function depthCalc(str, options = { depthOpen: "{", depthClose: "}" }) {
  let depth, startIndex, openIndex, closeIndex;
  depth = startIndex = openIndex = closeIndex = 0;
  // declaring variables and setting all to 0

  let { depthOpen, depthClose } = options;
  // startIndex tracks the progress. If no open bracket is found then we're
  while (true) {
    // at the end of the file
    openIndex = str.indexOf(depthOpen, startIndex);
    closeIndex = str.indexOf(depthClose, startIndex);
    if (openIndex === -1 && closeIndex === -1) break;
    //if there are no more open or close depth characters we're at the end of the file.
    if (openIndex < closeIndex && openIndex !== -1) {
      // if openIndex if smaller than closeIndex then we entered a new depth
      depth++;
      startIndex = openIndex + 1;
    } else {
      // if closeIndex is smaller than openIndex then we exited a depth level
      depth--;
      startIndex = closeIndex + 1;
    }
  }

  return depth; // returning depth of the string found
}

exports = { depthCalc };
