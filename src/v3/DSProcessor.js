/**
 * Takes a list of components and create tables accordingly to be used in the
 * design specification documents
 */

import {
  AttributeComponent,
  AttributeInstanceComponent,
  FunctionBlockComponent,
} from "./Components.js";

export class DesignSpecTables {
  constructor() {
    this.attributes = [];
    this.attributeInstances = [];
    this.functionBlocks = [];
  }

  add(comp) {
    if (comp instanceof AttributeComponent) {
      this.attributes.push(comp);
    } else if (comp instanceof AttributeInstanceComponent) {
      this.attributeInstances.push(comp);
    } else if (comp instanceof FunctionBlockComponent) {
      this.functionBlocks.push(comp);
    }
  }

  createModuleParameterTable() {
    return new ModuleParameterTable(
      this.attributes,
      this.attributeInstances
    ).createCsv();
  }
  // CreateEMCommandsTable()
  // CreateModulePropertiesTable()
  // CreateFunctionBlockTable()
  // etc...
}

/**
 * DS Module Parameter table is the current section of x.4.1,
 * [Module Name] - Parameters - Module Parametesr
 *
 * The table contains the following columns:
 * Parameter Name, obtained from the NAME attribute of the ATTRIBUTE block
 * Parameter Type, obtained from the TYPE attribute of the ATTRIBUTE block
 * Default Value, obtained from the VALUE attribute of the ATTRIBUTE_INSTANCE block of the same name
 */
class ModuleParameterTable {
  constructor(attributes, attributeInstances) {
    this.attributes = attributes;
    this.attributeInstances = attributeInstances;
  }
  assembleHeader() {
    return ["Parameter Name", "Parameter Type", "Default Value"];
  }
  assembleRows() {
    let rows = [];
    /**
     * let attributeWithoutInstance = [];
     * let attributeInstanceWithoutAttribute = [];
     * following the same assumption of DSSpecific/ModuleParameterTable.js -> getModuleParameters()
     * every module parameter should have a value
     */

    for (const attr of this.attributes) {
      let attributeInstance = this.attributeInstances.find(
        (ai) => ai.name === attr.name
      );
      if (attributeInstance) {
        rows.push([attr.name, attr.type, attributeInstance.value]);
      } else {
        attributeWithoutInstance.push(attr);
      }
    }
    return rows.sort((a, b) => a[0].localeCompare(b[0]));
  }

  createCsv() {
    let csv = "";
    csv += this.assembleHeader().join(",");
    csv += this.assembleRows()
      .map((row) => row.join(","))
      .join("\n");
    // csv += this.assembleRows().reduce((acc, row) => acc + row.join(","), ""); // creating individual rows
    //   .reduce((acc, row) => acc + row.join(","), "") // creating individual rows
    //   .join("\n"); // joining the rows
    return csv;
  }
}
