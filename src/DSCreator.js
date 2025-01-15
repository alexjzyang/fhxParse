import * as fhxProcessor from "./fhxProcessor.js";
import path from "path";
const outputPath = path.join("./output");
let ModuleClass = "MODULE_CLASS";

/**
 * Find the property values of a module class block and write them to a csv file
 * @param {string} fhx_data input fhx data
 * @param {string} modulename the module which properties are to be found
 */
function obtainModuleProperties(fhx_data, modulename) {
  let blockType = ModuleClass; // The block is a module class block
  let block = fhxProcessor.fhxObject(fhx_data, blockType, modulename); // Find the module class block
  let properties = fhxProcessor.classProperties(block); // Extract the properties of the module class block
  let header = [
    // Header row for the CSV file
    { id: "Name", title: "Name" },
    { id: "Item", title: "Item" },
  ];
  let records = []; // Records to be written to the CSV

  for (const key in properties) {
    // Loop through the properties object
    if (Object.hasOwnProperty.call(properties, key)) {
      const property = properties[key];
      records.push({ Name: property.DVname, Item: property.value }); // Add the property name and value to the records
    }
  }
  fhxProcessor.writeCsv(
    header,
    records,
    path.join(outputPath, modulename),
    `${modulename} Properties.csv`
  ); // Write the records to a CSV file
}

/**
 * Extracts the default values of module parameters from a given module data.
 *
 * @param {string} module_data - The FHX string containing the module data.
 * @returns {Array<{name: string, type:string, value: string}>} - An array of objects containing the parameter names and their default values.
 */
function valuesOfModuleParameters(module_data, modulename) {
  let moduleParameters = fhxProcessor
    .findBlocks(module_data, "ATTRIBUTE")
    .filter((attribute) => attribute.includes("CATEGORY=COMMON"))
    .map((attribute) => {
      return {
        name: fhxProcessor.nameOf(attribute),
        type: fhxProcessor.valueOf(attribute, "TYPE"),
        value: "",
        configurable: "",
      };
    }); // Find names of all module parameters (Attributes with CATEGORY=COMMON)

  let attributeInstances = fhxProcessor.findBlocks(
    module_data,
    "ATTRIBUTE_INSTANCE"
  ); // Find all attribute instances

  let attributeInstanceObjects = {};
  attributeInstances.forEach((instance) => {
    attributeInstanceObjects[fhxProcessor.nameOf(instance)] = instance;
  }); // Create an object with the attribute instance names as keys and the instances as values

  moduleParameters.forEach((param) => {
    if (!attributeInstanceObjects[param.name]) {
      throw new Error(`Attribute instance for ${param.name} not found`);
    }
    let instance = attributeInstanceObjects[param.name];

    // identify what type of parameter it is before extracting the value
    switch (param.type) {
      case "ENUMERATION_VALUE":
        let set = fhxProcessor.valueOf(instance, "SET");
        let option = fhxProcessor.valueOf(instance, "STRING_VALUE");
        param.value = `$${set}:${option}`;
        break;
      case "FLOAT":
      case "UINT8":
      case "UINT16":
      case "UINT32": // 32 bit unsigned integer
      case "INT8":
      case "INT16":
      case "INT32": // 32 bit signed integer
      case "BOOLEAN": // Boolean
      case "UNICODE_STRING": // String
        param.value = fhxProcessor.valueOf(instance, "CV");
        break;
      case "INTERNAL_REFERENCE": // Internal Reference
      case "EXTERNAL_REFERENCE": // External Reference
        param.value = fhxProcessor.valueOf(instance, "REF") || "";
        break;
      case "EVENT": // Alarm
        param.value = "ALARM";
        break;
      // Additional cases might be needed for other parameter types
      default:
        return;
    }
    param.value = `<${param.value}>`; // Wrap the value in angle brackets (expression of default value of a parameter)

    // Determine if the parameter is instant configurable
    if (instance.includes("EXPOSE=")) {
      if (fhxProcessor.valueOf(instance, "EXPOSE") === "T") {
        param.configurable = "True";
      } else if (fhxProcessor.valueOf(instance, "EXPOSE") === "F") {
        param.configurable = "False";
      }
    } else {
      if (param.type === "EXTERNAL_REFERENCE") {
        param.configurable = "True";
      } else if (param.type === "INTERNAL_REFERENCE") {
        param.configurable = "False";
      } else {
        param.configurable = "True";
      }
    }
  });

  return fhxProcessor.writeCsv(
    [
      { id: "name", title: "Name" },
      { id: "type", title: "Type" },
      { id: "value", title: "Default Value" },
      { id: "configurable", title: "Configurable" },
    ],
    moduleParameters,
    path.join(outputPath, modulename),
    `${modulename}-ModuleParameters.csv`
  );
  // return moduleParameters;
}

export { obtainModuleProperties, valuesOfModuleParameters };
