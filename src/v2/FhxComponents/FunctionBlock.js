/**
 * Code to find all function blocks
 * If two function blocks have the same list of properties, treat them as
 * duplicate template and remove one
 * Create txt file with all unique function block cases
 */

import { valueOfParameter } from "../../v1/_FhxProcessor.js";
import { FhxComponents } from "./Components.js";

/*
  FUNCTION_BLOCK NAME="COMMAND_00001" DEFINITION="__5D24CE4A_A808E6E3__"
  {
    ID=241459870
    RECTANGLE= { X=-50 Y=-50 H=1 W=1 }
    ALGORITHM_GENERATED=T
  }
*/
/**
 *   
  FUNCTION_BLOCK NAME="COMMAND_CTRL" DEFINITION="_CT_M_CMD_CTRL"
  {
    DESCRIPTION="GEX Equipment Module Composite for state/command control of EQM"
    ID=3172444
    RECTANGLE= { X=870 Y=175 H=156 W=140 }
    ADDITIONAL_CONNECTOR NAME="REQ_SP" TYPE=INPUT { ATTRIBUTE="REQ_SP" }
    ADDITIONAL_CONNECTOR NAME="SP_OP" TYPE=INPUT { ATTRIBUTE="SP_OP" }
    ADDITIONAL_CONNECTOR NAME="SP_HOLD" TYPE=INPUT { ATTRIBUTE="SP_HOLD" }
    ADDITIONAL_CONNECTOR NAME="BSTATUS" TYPE=OUTPUT { ATTRIBUTE="BSTATUS" }
    ADDITIONAL_CONNECTOR NAME="PREV_STATE" TYPE=OUTPUT { ATTRIBUTE="PREV_STATE" }
    ADDITIONAL_CONNECTOR NAME="SP_HOLD_OP" TYPE=INPUT { ATTRIBUTE="SP_HOLD_OP" }
    ADDITIONAL_CONNECTOR NAME="SP_INIT" TYPE=INPUT { ATTRIBUTE="SP_INIT" }
    ADDITIONAL_CONNECTOR NAME="XCOMMAND" TYPE=INPUT { ATTRIBUTE="XCOMMAND" }
    ADDITIONAL_CONNECTOR NAME="EM_IN_HOLD" TYPE=OUTPUT { ATTRIBUTE="EM_IN_HOLD" }
  }
 */
// let propertiesTemplate = {
//   functionBlock: {
//     name: "",
//     definition: "",
//     id: 0,
//     rectangle: { x: 0, y: 0, h: 0, w: 0 },
//     algorithmGenerated: "T",
//   },
// };

/**
 * Encapsulates a FHX FunctionBlock object
 */
export class FunctionBlock extends FhxComponents {
  constructor(fhxblock) {
    super(fhxblock);
    this.fhx = fhxblock;
    this.name = valueOfParameter(fhxblock, "NAME");
    this.definition = valueOfParameter(fhxblock, "DEFINITION");
    this.description = valueOfParameter(fhxblock, "DESCRIPTION");
    this.id = valueOfParameter(fhxblock, "ID");
    this.rectangle = {
      x: valueOfParameter(fhxblock, "X"),
      y: valueOfParameter(fhxblock, "Y"),
      h: valueOfParameter(fhxblock, "H"),
      w: valueOfParameter(fhxblock, "W"),
    };
    this.algorithmGenerated = valueOfParameter(fhxblock, "ALGORITHM_GENERATED");
    this.additionalConnectors = this.getAdditionalConnectors(fhxblock);
  }

  // Since AdditionalConnector has its own clas, add a method to create the array of AdditionalConnector objects
  getAdditionalConnectors() {
    let additionalConnectors = [];
    let additionalConnectorBlocks = this.fhx.split("ADDITIONAL_CONNECTOR");
    additionalConnectorBlocks.shift();
    additionalConnectorBlocks.forEach((block) => {
      additionalConnectors.push(new AdditionalConnector(block));
    });
    return additionalConnectors;
  }

  toString() {
    const tab = "    ";
    const descLine = this.description
      ? `${tab}DESCRIPTION="${this.description}"\n`
      : "";
    const idLine = this.id ? `${tab}ID=${this.id}\n` : "";
    const recLine = this.rectangle
      ? `${tab}RECTANGLE= { X=${this.rectangle.x} Y=${this.rectangle.y} H=${this.rectangle.h} W=${this.rectangle.w} }\n`
      : "";
    const connectorLines = this.additionalConnectors
      ? `${this.additionalConnectors
          .map((connector) => connector.toString())
          .join("")}`
      : "";
    const algorithmLine = this.algorithmGenerated
      ? `${tab}ALGORITHM_GENERATED=${this.algorithmGenerated}\n`
      : "";
    return `FUNCTION_BLOCK NAME="${this.name}" DEFINITION="${this.definition}"
  {\n${descLine}${idLine}${recLine}${connectorLines}${algorithmLine}  }`;
  }
}

/**
 * For properties that are more complexed, i.e. with multiple key-value pairs within its own block,
 * create a new class for that property.
 */
class AdditionalConnector extends FhxComponents {
  constructor(fhxblock) {
    super(fhxblock);

    this.fhx = fhxblock;
    this.name = valueOfParameter(fhxblock, "NAME");
    this.type = valueOfParameter(fhxblock, "TYPE");
    this.attribute = valueOfParameter(fhxblock, "ATTRIBUTE");
  }
  toString() {
    const tab = "    ";
    return `${tab}ADDITIONAL_CONNECTOR NAME="${this.name}" TYPE=${this.type} { ATTRIBUTE="${this.attribute}" }\n`;
  }
}
