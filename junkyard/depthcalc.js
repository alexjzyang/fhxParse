import fs from "fs";
import path from "path";
const FHX_Path = "C:/NCTM Mixers SDS Creation/FHX NCTM MXRs/";
const FHX_Export_25NOV24 = "NCTM Mixers DVfhx Export 25NOV24";
const FHX_Filenames_25NOV24 = {
  UC: "GEX_Unit_Classes.fhx",
  CompositeTemplate: "Mixer CompositeTemplates.fhx",
  EMC: "Mixer Mixer_EM_Classes.fhx",
  ModuleTemplate: "Mixer ModuleTemplates.fhx",
  Instances: "N-MIXERS Instances.fhx",
  Alarms: "Mixer Alarm Types.fhx",
  CMC: "Mixer Control_Module_Classes.fhx",
  Phase: "Mixer Mixer_Phase_Classes.fhx",
  NS: "Mixer Named Sets.fhx",
};

const FHX_Export_18NOV2024 = "NCTM Mixer Export 18NOV24";
const FHX_Filenames_18NOV24 = { CMC: "GEX_Control_Module_Classes.fhx" };

// Runner
// const FHX_Filename = FHX_Filenames.CompositeTemplate;
const FHX_Filename = FHX_Filenames_18NOV24.CMC;

// const FHX_Filename = FHX_Filenames.NS;
const outputPath = "output";
// const fhxfilepath = path.join(FHX_Path, FHX_Export_25NOV24, FHX_Filename);
const fhxfilepath = path.join(
  FHX_Path,
  FHX_Export_25NOV24,
  FHX_Filenames_25NOV24.CMC
);

// console.log("Loading file: " + fhxfilepath);
const fhx_data = fs.readFileSync(fhxfilepath, "utf-16le");

///////////////////////////////////////

/*
  The purpose of these functions is to test the performance of different approaches
  of processing FHX files.

  Additional code needed in order to extract inner block parameters.
  Currently, extracting inner block keys and names might lead to indeterminate 
  behavior
  Next, need to implement depth calculations.
    - Extract the block and inner blocks of interest, so that the returned 
      results will consist of the correct encaptulated key elements.
    - The other method is to calculate depth...

  Hypothesis: perhaps the extracting block approach will do better, because
    1. There are not that many depths to a particular list of element of interest.
      There shouldn't be much confusion.
    2. It is guaranteed to have the right path.

    Starting another section to experiment with inner block or inner element 
    extractions.

*/

/*
 => Ways to go through an entire FHX file string
 * Depth calculation methods:
 * Extract information by line focuses on determining the indentation
 * of each line. For example, if the indentation is 0 then it is a root block.
 * 
 * Another way to extract entire blocks is by finding matching open/close depth 
 * characters. However this method might not work in certain exception cases.
 * 
*/

/**
 * The function counts the number of leading spaces in a string. It is used in the
 * FHX block element depth calculation.
 * @param {string} line one line of the FHX string
 * @returns number of leading space.
 */
function lineIndentationCountSpace(line) {
  let whitespaces = 0;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === " ") whitespaces++;
    else return whitespaces;
  }
}

/**
 * The function finds the number of leading spaes of string. It is used in the
 * depth calculation of a FHX text string in the case where the string is split
 * into individual lines.
 * @param {string} line input fhx line to find the indentation for
 * @returns number of leading space.
 */
function lineIndentationRegex(line) {
  let spaces;
  const regex = /^\s+/g;
  if ((spaces = line.match(regex))) return spaces[0].length;
  else return 0;
}

// This function tests if the line has only one character that is the depth character.
// It needs an external depth counter
// This function helps to track depth
function lineTrimDepthChar(line) {
  if (line.trim() === "{") return 1;
  else if (line.trim() === "}") return -1;
  else return 0;
}

// Next calculate depths by using depth open and close characters
// it seems that this function does not currently work
// This function returns the number of depth
function depthAtIndex(
  str,
  atIndex,
  options = { depthOpen: "{", depthClose: "}" }
) {
  let depth, startIndex, openIndex, closeIndex;
  depth = startIndex = openIndex = closeIndex = 0;
  // declaring variables and setting all to 0

  let { depthOpen, depthClose } = options;
  // startIndex tracks the progress. If no open bracket is found then we're
  while (true) {
    // at the end of the file
    openIndex = str.indexOf(depthOpen, startIndex);
    closeIndex = str.indexOf(depthClose, startIndex);

    if (
      (openIndex === -1 && closeIndex === -1) ||
      (openIndex > atIndex && closeIndex > atIndex)
    )
      break;
    //if there are no more open or close depth characters we're at the end of the file.
    if (openIndex < closeIndex) {
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

function runner(data) {
  let spaces;
  const regex = /^\s+/g;
  if ((spaces = " fa2flkeajasldfkj".match(regex)))
    console.log(spaces[0].length);
}

// runner(fhx_data);
export {
  lineIndentationCountSpace,
  lineIndentationRegex,
  depthAtIndex,
  lineTrimDepthChar,
};
