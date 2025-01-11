import * as fhxProcessor from "./fhxProcessor.js";

/**
 * Find the property values of a module class block and write them to a csv file
 * @param {string} fhx_data input fhx data
 * @param {string} modulename the module which properties are to be found
 */
function obtainModuleProperties(fhx_data, modulename) {
  let block = fhxProcessor.fhxObject(fhx_data, "MODULE_CLASS", modulename); // Find the module class block
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
    outputPath,
    `${modulename}Properties.csv`
  ); // Write the records to a CSV file
}

/**
 * Extracts the default values of module parameters from a given module data.
 * Find parameters that are both associated with an Attribute and an Attribute
 * Instance blocks.
 *
 * @param {string} module_data - The FHX string containing the module data.
 * @returns {Array<{name: string, value: string}>} - An array of objects containing the parameter names and their default values.
 */
function valuesOfModuleParameters(module_data) {
  let attributes = fhxProcessor.findBlocks(module_data, "ATTRIBUTE"); // Find all attribute blocks
  let attributeInstances = fhxProcessor.findBlocks(
    // Find all attribute instance blocks
    module_data,
    "ATTRIBUTE_INSTANCE"
  );
  let values = [];
  attributeInstances.forEach((instance) => {
    // Loop through the attribute instances
    if (instance.includes("PRIORITY_NAME")) return; // it is an alarm

    for (let index = 0; index < attributes.length; index++) {
      // Loop through the attributes
      let attribute = attributes[index];
      let name = fhxProcessor.nameOf(attribute);
      if (name === fhxProcessor.nameOf(instance)) {
        // Check if the attribute name matches the attribute instance name
        let value;
        let type = fhxProcessor.valueOf(attribute, "TYPE");
        // identify what type of parameter it is before extracting the value
        switch (type) {
          case "ENUMERATION_VALUE":
            let set = fhxProcessor.valueOf(instance, "SET");
            let option = fhxProcessor.valueOf(instance, "STRING_VALUE");
            value = `$${set}:${option}`;
            break;
          case "FLOAT":
          case "UINT32": // 32 bit unsigned integer
          case "BOOLEAN": // Boolean
          case "UNICODE_STRING": // String
            value = fhxProcessor.valueOf(instance, "CV");
            break;
          case "INTERNAL_REFERENCE": // Internal Reference
          case "EXTERNAL_REFERENCE": // External Reference
            value = fhxProcessor.valueOf(instance, "REF") || "";
            break;
          case "EVENT": // Alarm
            value = "ALARM";
            break;
          // Additional cases might be needed for other parameter types
          default:
            return;
        }
        value = `<${value}>`; // Wrap the value in angle brackets (expression of default value of a parameter)
        values.push({ name, value, type });
      }
    }
  });
  return values;
}

export { obtainModuleProperties, valuesOfModuleParameters };
