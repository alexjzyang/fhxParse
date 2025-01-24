import * as fhxProcessor from "./FhxProcessor.js";

/**
 * Extracts the default values of module parameters from a given module data.
 *
 * @param {string} module_data - The FHX string containing the module data.
 * @param {string} modulename - The name of the module.
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

/**
 * Finds all blocks of a specified type in the provided FHX data that match the given criteria.
 * Optionally writes each matching block to a text file in the specified output directory.
 *
 * @param {string} fhx_data - The FHX data as a string.
 * @param {string} elementKey - The key of the element to search for.
 * @param {object} includes - The criteria to filter the blocks by (e.g., { key: "CATEGORY", includes: "Equipment Module Classes" }).
 * @returns {Array} - An array of the found blocks.
 */
function findAll(fhx_data, elementKey, includes) {
  let blocks = fhxProcessor.findBlocks(fhx_data, elementKey);
  let results = blocks.filter((block) => {
    // Filter blocks based on the provided criteria
    return fhxProcessor.valueOf(block, includes.key)?.includes(includes.value);
  });

  return results;
}

/**
 * Finds all Equipment Module Classes (EMC) in the provided FHX data.
 * Writes each EMC block to a text file in the specified output directory.
 *
 * @param {string} fhx_data - The FHX data as a string.
 * @param {string} [outputFilePath="output/All EMC"] - The path to the output directory (optional).
 */
function findAllEMClasses(fhx_data) {
  let elementKey = "MODULE_CLASS";
  let emCriteria = { value: "Equipment Module Classes", key: "CATEGORY" };
  return findAll(fhx_data, elementKey, emCriteria);
}

/**
 * Finds all Control Module Classes (CMC) in the provided FHX data.
 * Writes each CMC block to a text file in the specified output directory.
 *
 * @param {string} fhx_data - The FHX data as a string.
 * @param {string} [outputFilePath="output/All CMC"] - The path to the output directory (optional).
 */
function findAllCMClasses(fhx_data) {
  let elementKey = "MODULE_CLASS";
  let emCriteria = { value: "Equipment Module Classes", key: "CATEGORY" };
  return findAll(fhx_data, elementKey, emCriteria);
}

/**
 * Converts SFC data to CSV format and writes it to a file.
 *
 * @param {string} filepath - The path where the CSV file will be saved.
 * @param {string} filename - The name of the CSV file.
 * @param {string} sfcBlockFhx - The FHX of a Function Block Definition containing SFC block.
 */
function sfcToCsv(filepath, filename, sfcBlockFhx) {
  let sfcDataObj = processSFC(sfcBlockFhx);

  // write to csv
  let csvHeaders = [
    { id: "steps", title: "Steps and Transitions" },
    { id: "actions", title: "Actions" },
    { id: "expressions", title: "Expressions" },
  ];

  let recordsArr = [];

  for (let stepIndex = 0; stepIndex < sfcDataObj.steps.length; stepIndex++) {
    let step = sfcDataObj.steps[stepIndex];
    let stepText = `${step.name}\n${step.description}`;
    if (step.actions.length === 0) {
      recordsArr.push({ steps: stepText, actions: "N/A", expressions: "N/A" });
    }
    for (
      let actionIndex = 0;
      actionIndex < step.actions.length;
      actionIndex++
    ) {
      let action = step.actions[actionIndex];
      let actionText = `${action.name}\n${action.description}`;
      for (let expIndex = 0; expIndex < 3; expIndex++) {
        let delay, act, confirm;
        delay = act = confirm = "";
        if (action.delayedExpression) {
          delay += `Delay Expression: \n${action.delayedExpression}\n`;
        }
        if (action.delayTime) {
          delay += `Delay Time: \n${action.delayTime}\n`;
        }

        act = `Action: \n${action.expression}\n`;

        if (action.confirmExpression) {
          confirm += `Confirm Expression: \n${action.confirmExpression}\n`;
        }
        if (action.confirmTimeOut) {
          confirm += `Confirm TimeOut: \n${action.confirmTimeOut}\n`;
        }

        delay = delay === "" ? `Delay Time: \n0` : delay;
        confirm =
          confirm === ""
            ? `Confirm Expression: True;\nConfirm TimeOut: \n0`
            : confirm;
        let exps = { delay, act, confirm };
        let record = {};

        record.steps = actionIndex === 0 && expIndex === 0 ? stepText : "";
        record.actions = expIndex === 0 ? actionText : "";
        switch (expIndex) {
          case 0:
            record.expressions = exps.delay;
            break;
          case 1:
            record.expressions = exps.act;
            break;
          case 2:
            record.expressions = exps.confirm;
            break;
        }

        recordsArr.push(record);
      }
    }
  }
  sfcDataObj.transitions.forEach((transition) => {
    let record = {
      steps: `${transition.name}\n${transition.description}`, // In the transition section, csv header id is still "steps"
      expressions: transition.expression,
    };
    recordsArr.push(record);
  });
  fhxProcessor.writeCsv(csvHeaders, recordsArr, filepath, filename);
}

/**
 * Finds the definition of a composite block within another block.
 * Typically used to find the definition of an SFC block.
 *
 * @param {string} inBlock - The FHX block containing the composite block.
 * @param {string} inFhx - The FHX data as a string.
 * @param {string} blockName - The name of the composite block.
 * @returns {string} - The FHX block definition.
 */
function findCompositeDefinitionOf(inBlock, inFhx, blockName) {
  let fbBlockDefinitionName = fhxProcessor.findFbdOf(blockName, inBlock, inFhx);
  let blockNameDefinitionBlock = fhxProcessor.findBlockWithName(
    inFhx,
    "FUNCTION_BLOCK_DEFINITION",
    fbBlockDefinitionName
  );
  return blockNameDefinitionBlock;
}

/**
 * Finding the alarm names, priority,
 * Parameter,
 * Parameter Limit
 * Default limit,
 * Enabled
 * Alarm Message,
 * Placeholder
 * Priority
 *
 * @param {string} module_class fhx of a module class
 */
function getAlarms(module_class) {
  // getAlarms is SIP because valueOf an empty string ("")is not yet working
  let attribute_instances = fhxProcessor.findBlocks(
    module_class,
    "ATTRIBUTE_INSTANCE"
  );
  let alarms = attribute_instances.filter((block) => {
    return block.includes("PRIORITY_NAME");
  });

  let alarm_attribute_instances_keys = {
    name: "NAME",
    priority: "PRIORITY_NAME",
    enable: "ENAB",
    inverted: "INV",
    type: "ATYP",
    monitor_attribute: "MONATTR",
    alarm_parameter: "ALMATTR",
    limit: "LIMATTR",
    p1: "PARAM1",
    p2: "PARAM2",
    timeout: "SUPPTIMEOUT",
  };
  let alarm_parameters = alarms.map((alarm) => {
    let alarm_values = {};
    for (let key in alarm_attribute_instances_keys) {
      let dvkey = alarm_attribute_instances_keys[key];
      let value = fhxProcessor.valueOf(alarm, dvkey);
      alarm_values[key] = value;
    }
    return alarm_values;
  });
  if (alarm_parameters.timeout) {
    alarm_parameters.timeoutHours = alarm_parameters.timeout / 3600;
    alarm_parameters.timeoutMinutes = (alarm_parameters.timeout % 3600) / 60;
    alarm_parameters.alarm_timeout_seconds =
      (alarm_parameters[timeout] % 3600) % 60;
  }
  return alarm_parameters;
}

function moduleProperties(moduleFhx) {}
export {
  // find lists of parameters
  valuesOfModuleParameters,
  moduleProperties,
  // find lists of blocks
  findAll,
  findAllEMClasses,
  findAllCMClasses,
  // Find definition of another block's component
  // Typically a sfc block
  // write sfc to csv
  sfcToCsv,
  findCompositeDefinitionOf,
  getAlarms, // WIP to be tested
};
