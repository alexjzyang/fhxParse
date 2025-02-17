/*
  Unit test
  All 4 mothods should yeld the same results

  
  moduleClassNames_Regex,
  moduleClassNames_IndexOf,
  usingRex,
  usingSubstring,

  Examine the depth characters
  Processing one line at the time even though is slow, it does provide finer 
  control. There is less future bug possibilities, because each test is run 
  on a smaller string.
  On the other hand, this means that the "identity" of the line requires 
  scrutiny. For example when performing depth calculation, where the context,
  i.e. lines before or after is important.

  On the other hand runing overall indexOf or even running Regex against
  the entire file already impliment the same logic as the depth caluclation.

  There is a dilemma where examining the depth by testing the depth characters
  might be a logic that has to be tightly coupled with the extraction code.
  The implementations is either 
  - run indexOf against depth characters and compare indices.
  - somehow run character looping**


  Leading spaces:
  If the hypothesis holds that the depth of the fhx blocks can be determined
  by the leading spaces, then processing line by line might be an easier 
  implementation
*/

import fs from "fs";
import path from "path";
// FhxProcessor.stripComments();
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
// console.log("");

// Sandbox code
// Load a FHX file into data
// log("Start loading fhx");
// console.log("Loading file: " + fhxfilepath);
const fhx_data = fs.readFileSync(fhxfilepath, "utf-16le");

///////////////////////////////////////
/*
  Goal: produce a list of module class names:
  Four Different methods (regex and indexof methods used in spliting strings by 
  lines are considered a single approach here) of producing a list of module 
  class names are implimented below
    1. Runing regex against the entire fhx string
    2. Running indexof against the entire fhx string
    3. Running regex against fhx strings split by lines
    4. Running indexOf agsint fhx strings split by lines

*/

/**
 * This method tests regex a prefix of the entire file. Therefore depth calculation
 * needs to be done along side of it
 * @param {string} data
 * @returns a list of MODULE_CLASS Names
 */
function moduleClassNames_Regex(data) {
  const regex = /(?<=ATTRIBUTE NAME=")\w+(?=")/g; // Regex that returns the name of MCMs
  const CMCNameMatches = data.matchAll(regex);
  let results = [];
  for (const match of CMCNameMatches) {
    results.push(match[0]);
  }
  return results;
}

/**
 * finds module class names with indexof method.
 * This method tests Indexof a prefix of the entire file. Therefore depth calculation
 * needs to be done along side of it
 * @param {string} data
 * @returns a list of MODULE_CLASS Names
 */
function moduleClassNames_IndexOf(data) {
  // prepare prefix and suffix
  const blockKey = "ATTRIBUTE";
  const elementKey = "NAME";
  const prefix = `${blockKey} ${elementKey}="`;
  const suffix = `"`;

  // Initializing the indices and set them to 0
  let startIndex = 0,
    endIndex = 0;

  // Initializing an empty string to store the results.
  let results = [];

  while ((startIndex = data.indexOf(prefix, startIndex + 1)) !== -1) {
    startIndex += prefix.length;
    endIndex = data.indexOf(suffix, startIndex);
    results.push(data.substring(startIndex, endIndex));
  }
  return results;
}

/**
 * going through the fhx file line by line returning a list of module class names
 * using regex
 * @param {string} lines
 * @returns a list of Module Class names
 */
function usingRexOverLine(data) {
  let lines = data.split("\r\n");
  const regexResults = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const regex = /(?<=ATTRIBUTE NAME=")\w+(?=")/g;

    let result = line.match(regex);
    if (result) regexResults.push(result[0]);
  }
  return regexResults;
}

/**
 * going through the fhx file line by line returning a list of module class names
 * using indexOf and substring
 * @param {string} lines
 * @returns a list of Module Class names
 */

function usingSubstringOverLine(data) {
  let lines = data.split("\r\n");
  const substringResults = [];
  let startIndex, endIndex;

  const key = "ATTRIBUTE";
  const prefix = key + ' NAME="';
  const prefixLen = prefix.length;
  const suffix = '"';
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if ((startIndex = line.indexOf(prefix) !== -1)) {
      startIndex += prefixLen;
      endIndex = line.indexOf('"', startIndex + 1);
      substringResults.push(line.substring(startIndex, endIndex));
    }
  }

  return substringResults;
}

/**
 * This function is to test the performance of using regex or index of runing through
 * each lines
 * @param {string} data
 * @returns results object which returns a list of Module Class names using
 * different methods of going through the text ONE LINE at the time.
 */
function performanceTest(data, repeatTime = 10) {
  console.time("fn1");
  let res1 = repeat(moduleClassNames_IndexOf, {
    times: repeatTime,
    input: data,
  });
  console.timeEnd("fn1");
  console.time("fn2");
  let res2 = repeat(moduleClassNames_Regex, { times: repeatTime, input: data });
  console.timeEnd("fn2");
  console.time("fn3");
  let res3 = repeat(usingSubstringOverLine, { times: repeatTime, input: data });
  console.timeEnd("fn3");
  console.time("fn4");
  let res4 = repeat(usingRexOverLine, { times: repeatTime, input: data });
  console.timeEnd("fn4");
  return { res1, res2, res3, res4 };
}

/*
  The performance test of 100 repeats shows the following results
  fn1: 78.467ms  (moduleClassNames_IndexOf)
  fn2: 338.179ms (moduleClassNames_Regex)
  fn3: 443.015ms (usingSubstring)
  fn4: 786.344ms (usingRex)

  This means processing the fhx by splitting the lines are much slower.
  Using regex is slow than indexOf

*/

function repeat(fn, options = { input, times: 1 }) {
  let res;
  let { input, times } = options;
  for (let i = 0; i < times; i++) {
    try {
      res = fn(input);
    } catch (error) {
      console.log(error);

      console.log("invalid input");
    }
  }
  return res;
}

function runner(data) {
  let { res1, res2, res3, res4 } = performanceTest(data, 5000);
  console.log([res1.length, res2.length, res3.length, res4.length]);
  // return log({ returnVar, count: returnVar.length });
}

// runner(fhx_data);

export {
  moduleClassNames_Regex,
  moduleClassNames_IndexOf,
  usingRexOverLine,
  usingSubstringOverLine,
};
