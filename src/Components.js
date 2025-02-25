import { findBlocks, valueOfParameter } from "./util/FhxUtil.js";
import { DesignSpecTables } from "./DSProcessor.js";
import { FhxValue } from "./ValueBlocks.js";

export class ComponentCreator {
    #getType(block) {
        let name = valueOfParameter(block, "NAME");
        if (name === undefined) return;
        let search = ` NAME="${name}"`;
        let endIndex = block.indexOf(search);
        let startIndex =
            block.lastIndexOf("\r\n", endIndex) !== -1
                ? block.lastIndexOf("\r\n", endIndex) + 2
                : 0;
        return block.substring(startIndex, endIndex);
    }

    static create(fhxStr) {
        let type = new ComponentCreator().#getType(fhxStr);

        switch (type) {
            case "MODULE_CLASS":
                return new ModuleClassComponent(fhxStr);
            case "FUNCTION_BLOCK_DEFINITION":
                return new FunctionBlockDefinitionComponent(fhxStr);
            case "ENUMERATION_SET":
                return new NamedSetComponent(fhxStr);
            default:
                return new Component(fhxStr);
        }
    }
}

class Component {
    constructor(blockFhx) {
        this.block = blockFhx;
        this.name = this.getName();
        // this.type = this.getType();
        this.componentId = Math.random().toString(36).substring(2, 9);
    }

    get fhx() {
        return this.block;
    }
    getName() {
        return valueOfParameter(this.block, "NAME");
    }
    getRectangle() {
        let rect = findBlocks(this.block, "RECTANGLE");
        if (rect.length > 1) throw new Error("More than one rectangle found");
        else if (rect.length === 0) return;
        else {
            rect = rect[0];
            return {
                x: valueOfParameter(rect, "X"),
                y: valueOfParameter(rect, "Y"),
                h: valueOfParameter(rect, "H"),
                w: valueOfParameter(rect, "W"),
            };
        }
    }

    // Specifically found in ATTRIBUTE_INSTANCEs
    getHistoryDataPoint() {
        /**
    HISTORY_DATA_POINT FIELD="CV"
    {
      DATA_CHARACTERISTIC=CONTINUOUS
      ENABLED=T
      SAMPLE_PERIOD_SECONDS=1
      COMPRESSION_ENABLED=T
      RECORD_AT_LEAST_EVERY_MINUTES=240
      DEVIATION_LIMIT_FOR_COMPRESSION=0
      DATA_REPRESENTATION=AUTOMATIC
      EXPOSED=F
      ENTERPRISE_COLLECTION=F
    }
         */
        let hist = findBlocks(this.block, "HISTORY_DATA_POINT");
        if (hist.length > 1)
            throw new Error(
                "More than one parameter historization definition found"
            );
        else if (hist.length === 0) return;
        else {
            hist = hist[0];
            return {
                field: valueOfParameter(hist, "FIELD"),
                dataCharacteristic: valueOfParameter(
                    hist,
                    "DATA_CHARACTERISTIC"
                ),
                enabled: valueOfParameter(hist, "ENABLED"),
                samplePeriodSeconds: valueOfParameter(
                    hist,
                    "SAMPLE_PERIOD_SECONDS"
                ),
                compressionEnabled: valueOfParameter(
                    hist,
                    "COMPRESSION_ENABLED"
                ),
                recordAtLeastEveryMinutes: valueOfParameter(
                    hist,
                    "RECORD_AT_LEAST_EVERY_MINUTES"
                ),
                deviationLimitForCompression: valueOfParameter(
                    hist,
                    "DEVIATION_LIMIT_FOR_COMPRESSION"
                ),
                dataRepresentation: valueOfParameter(
                    hist,
                    "DATA_REPRESENTATION"
                ),
                exposed: valueOfParameter(hist, "EXPOSED"),
                enterpriseCollection: valueOfParameter(
                    hist,
                    "ENTERPRISE_COLLECTION"
                ),
            };
        }
    }

    // Specifically found in FUNCTION_BLOCKs
    getExtensibleAttributes() {
        return findBlocks(this.block, "EXTENSIBLE_ATTRIBUTE").map((extAttr) => {
            return {
                name: valueOfParameter(extAttr, "NAME"),
                count: valueOfParameter(extAttr, "COUNT"),
            };
        });
    }
    getConnectors() {
        return findBlocks(this.block, "ADDITIONAL_CONNECTOR").map(
            (connector) => {
                return {
                    name: valueOfParameter(connector, "NAME"),
                    type: valueOfParameter(connector, "TYPE"),
                    attribute: valueOfParameter(connector, "ATTRIBUTE"),
                };
            }
        );
    }
}

export class ModuleClassComponent extends Component {
    constructor(blockFhx) {
        super(blockFhx); // initializing with block, name, type, id properties
        this.attributes;
        this.attributeInstances;
        this.functionBlocks;
        this.properties;
        this.componentType = "MODULE_CLASS";
        this.emCommandSet;
        this.initializeBlock();
    }

    initializeBlock() {
        this.attributes = findBlocks(this.block, "ATTRIBUTE").map(
            (block) => new AttributeComponent(block)
        );
        this.attributeInstances = findBlocks(
            this.block,
            "ATTRIBUTE_INSTANCE"
        ).map((block) => new AttributeInstanceComponent(block));
        this.functionBlocks = findBlocks(this.block, "FUNCTION_BLOCK").map(
            (block) => new FunctionBlockComponent(block)
        );
        // this.attributeInstanceAssociates =
        //     this.findAttributeInstanceAssociates();
        // To obtain properties, the module class is supposed to isolate information in
        // itself and pass it to the module properties class

        // for consistency a only string relevant to properties is passed into
        // the ModuleProperties class, instead of the entire block
        this.properties = new ModuleProperties(
            this.getPropertiesString()
        ).properties; // Module properties are unique to a module

        this.emCommandSet = valueOfParameter(this.fhx, "COMMAND_SET");
    }

    getPropertiesString() {
        let moduleBlockOpenBracketIndex = this.block.indexOf("{");
        let firstSubComponentBracketIndex = this.block.indexOf(
            "{",
            moduleBlockOpenBracketIndex + 1
        );
        let propertyString = this.block.substring(
            0,
            firstSubComponentBracketIndex
        );
        return propertyString;
    }

    findAssociates() {
        let associates = [];
        for (attr in this.attirbute) {
            let attributeInstance = this.attributeInstances.find(
                (ai) => ai.name === attr.name
            );
            if (attributeInstance) {
                associates.push(
                    new AttributeInstanceAssociates(attributeInstance, attr)
                );
            }
        }
    }
}

// FHX Objects
export class FunctionBlockDefinitionComponent extends Component {
    attributes;
    attributeInstances;
    functionBlocks;
    category;
    constructor(blockFhx) {
        super(blockFhx);
        this.category = valueOfParameter(blockFhx, "CATEGORY");
        this.componentType = "FUNCTION_BLOCK_DEFINITION";
        this.initializeBlock();
    }

    initializeBlock() {
        this.attributes = findBlocks(this.block, "ATTRIBUTE").map(
            (block) => new AttributeComponent(block)
        );
        this.attributeInstances = findBlocks(
            this.block,
            "ATTRIBUTE_INSTANCE"
        ).map((block) => new AttributeInstanceComponent(block));
        this.functionBlocks = findBlocks(this.block, "FUNCTION_BLOCK").map(
            (block) => new FunctionBlockComponent(block)
        );
    }
}

// one design could be running process function in Object Manager.
// When Object Manager processing is called with one module class, a list of
// items to be processed is created. This list initially consists of the attribute,
// instance, functionblock etc lists in the module class. The Object Manager will
// then loop through the list and process (calling the objects process function)
// each item in the list. As it processes each item, more items will be added to
// the object manager's process list.
// For example function block component's process function will identify the
// definition block and adding it to the object manager's process list

export class AttributeComponent extends Component {
    constructor(blockFhx) {
        super(blockFhx);
        this.type = valueOfParameter(blockFhx, "TYPE");
        this.readonly = valueOfParameter(blockFhx, "READONLY");
        this.editable = valueOfParameter(blockFhx, "EDITABLE");
        this.rectangle = this.getRectangle();
        this.helpid = valueOfParameter(blockFhx, "HELP_ID");
        this.category = valueOfParameter(blockFhx, "CATEGORY");
        this.configurable = valueOfParameter(blockFhx, "CONFIGURABLE");
        this.group = valueOfParameter(blockFhx, "GROUP");
        this.connectiion = valueOfParameter(blockFhx, "CONNECTION");
        this.componentType = "ATTRIBUTE";
    }
}

export class AttributeInstanceComponent extends Component {
    constructor(blockFhx) {
        super(blockFhx);
        this.elements = {
            EXPOSE: valueOfParameter(blockFhx, "EXPOSE"),
            EXPOSE_IS_OVERRIDDEN: valueOfParameter(
                blockFhx,
                "EXPOSE_IS_OVERRIDDEN"
            ),
            HISTORY_DATA_POINT: this.getHistorisationBlock(),
            VALUE: this.getValueBlock(),
        };
        // this.value = new FhxValue(this.valueBlock);
        // this.history = new Value(this.valueBlock);
    }

    get expose() {
        return this.elements.EXPOSE;
    }
    get exposeIsOverridden() {
        return this.elements.EXPOSE_IS_OVERRIDDEN;
    }

    get hisotryDataPointBlock() {
        return this.elements.HISTORY_DATA_POINT;
    }
    get valueBlock() {
        return this.elements.VALUE;
    }

    getValueBlock() {
        return this.getEmbeddedBlocks("VALUE");
    }
    getHistorisationBlock() {
        return this.getEmbeddedBlocks("HISTORY_DATA_POINT");
    }

    getEmbeddedBlocks(blockName) {
        let valueBlock = findBlocks(this.block, blockName);
        if (valueBlock.length > 1) {
            console.log("More than one value block found");
            if (this.name.includes("SGCR") || this.name.includes("SPLTR")) {
                console.log(`${this.name}'s value case not currently handled
                        The attribute is a SGCR or SPLTR function block`);
            }
            return "Value block handling exception";
        }
        // throw new Error("More than one value block found");
        else if (valueBlock.length === 0) return;
        else return valueBlock[0];
    }
}

export class FunctionBlockComponent extends Component {
    constructor(blockFhx) {
        super(blockFhx);
        this.definition = valueOfParameter(blockFhx, "DEFINITION");
        this.description = valueOfParameter(blockFhx, "DESCRIPTION");
        this.id = valueOfParameter(blockFhx, "ID");
        this.rectangle = this.getRectangle();
        this.additionalConnectors = this.getConnectors();
        this.getExtensibleAttributes = this.getExtensibleAttributes();
        this.algorithmGenerated = valueOfParameter(
            blockFhx,
            "ALGORITHM_GENERATED"
        );
        this.componentType = "FUNCTION_BLOCK";
    }

    findDefinition(objManager) {
        return objManager.get(this.definition);
    }
}

/*
  FIXED=F
  DESCRIPTION="_M Command state names for Mixer Agitator Control EM"
  CATEGORY="Named Sets/M_Mixer_Named_Sets"
  ENTRY VALUE=0 NAME="Disable" { }
  ENTRY VALUE=1 NAME="Constant Speed" { }
  ENTRY VALUE=2 NAME="Weight Defined" { }
  ENTRY VALUE=255 NAME="Undefined" { SELECTABLE=F VISIBLE=F }
  DEFAULT_VALUE=0
*/
export class NamedSetComponent extends Component {
    constructor(blockFhx) {
        super(blockFhx);
        this.elements = {
            FIXED: valueOfParameter(blockFhx, "FIXED"),
            DESCRIPTION: valueOfParameter(blockFhx, "DESCRIPTION"),
            CATEGORY: valueOfParameter(blockFhx, "CATEGORY"),
            ENTRIES: this.getEntries(),
            DEFAULT_VALUE: valueOfParameter(blockFhx, "DEFAULT_VALUE"),
        };
    }
    getEntries() {
        let entries = findBlocks(this.block, "ENTRY").map((entry) => {
            return {
                value: valueOfParameter(entry, "VALUE"),
                name: valueOfParameter(entry, "NAME"),
                selectable: valueOfParameter(entry, "SELECTABLE"),
                visible: valueOfParameter(entry, "VISIBLE"),
            };
        });
        return entries;
    }
    get fixed() {
        return this.elements.FIXED;
    }
    get description() {
        return this.elements.DESCRIPTION;
    }
    get category() {
        return this.elements.CATEGORY;
    }
    get entries() {
        return this.elements.ENTRIES;
    }
    get defaultValue() {
        return this.elements.DEFAULT_VALUE;
    }
}

export class ModuleProperties {
    constructor(propertyString) {
        this.fhx = propertyString;
    }

    get properties() {
        let properties = {
            NAME: valueOfParameter(this.fhx, "NAME"),
            CATEGORY: valueOfParameter(this.fhx, "CATEGORY"),
            USER: valueOfParameter(this.fhx, "USER"),
            DESCRIPTION: valueOfParameter(this.fhx, "DESCRIPTION"),
            PERIOD: valueOfParameter(this.fhx, "PERIOD"),
            PRIMARY_CONTROL_DISPLAY: valueOfParameter(
                this.fhx,
                "PRIMARY_CONTROL_DISPLAY"
            ),
            INSTRUMENT_AREA_DISPLAY: valueOfParameter(
                this.fhx,
                "INSTRUMENT_AREA_DISPLAY"
            ),
            DETAIL_DISPLAY: valueOfParameter(this.fhx, "DETAIL_DISPLAY"),
            TYPE: valueOfParameter(this.fhx, "TYPE"),
            SUB_TYPE: valueOfParameter(this.fhx, "SUB_TYPE"),
            NVM: valueOfParameter(this.fhx, "NVM"),
        };
        return properties;
    }
}
/////////////////////////////////////////////////////////////////////////////////////////
// Prototype
class Associates {
    constructor() {
        this.components = {};
    }
}

export class AttributeInstanceAssociates extends Associates {
    constructor(attributeInstanceComponent, attributeComponent) {
        super();
        this.component = { attributeInstanceComponent, attributeComponent };
        this.valueBlock = this.component.attributeInstanceComponent.valueBlock;
        this.attributeType = this.getValueTypes();
        this.value = this.getValues();
    }

    get block() {
        return this.valueBlock;
    }
    get fhx() {
        return this.valueBlock;
    }
    // Associates should contain the paired attribute and attirbuteInstance of the same name
    getValueTypes() {
        return valueOfParameter(this.component.attributeComponent.fhx, "TYPE");
    }

    /**
     * Extracts the value from a value block based on its type.
     * @param {Object} param - The parameter object containing type of the parameter
     * found in the ATTRIBUTE block; The block parameter contains the associated
     * ATTRIBUTE_INSTANCE block.
     * @returns {string} - The extracted value of the parameter
     */

    getValues() {
        let value;
        switch (this.attributeType) {
            case "ENUMERATION_VALUE":
                let set = valueOfParameter(this.valueBlock, "SET");
                let option = valueOfParameter(this.valueBlock, "STRING_VALUE");
                value = `${set}:${option}`;
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
            case "FLOAT_WITH_STATUS": // Float with Status"
                value = valueOfParameter(this.valueBlock, "CV");
                break;
            case "INTERNAL_REFERENCE": // Internal Reference
            case "EXTERNAL_REFERENCE": // External Reference
            case "DYNAMIC_REFERENCE": // Dynamic Reference
                value = this.valueFromReferences();
                break;
            case "MODE": // Mode
                value = valueFromMode();
                break;
            case "EVENT": // Alarm
                value = "ALARM";
                break;
            // Additional cases might be needed for other parameter types
            default:
                return;
        }
        return value;
    }

    // a list of elements created from value blocks, the processing and the display of these
    // should be handled in the "View" of the MVC

    valueFromString() {
        return valueOfParameter(this.valueBlock, "CV");
    }
    valueFromEvent() {
        //WIP
    }
    valueFromNumber() {
        return valueOfParameter(this.block, "CV");
    }
    valueFromEnum() {
        // WIP
    }
    valueFromReferences() {
        return valueOfParameter(this.block, "REF");
    }
    valueFromParameterWithStatus() {
        return valueOfParameter(this.block, "CV");
    }

    /**
     * Extracts the mode value from a block.
     * Similar to valueFromBlock, but handling the Mode parameter type.
     * @param {Object} this.valueBlock - The block containing mode information.
     * @returns {string} - The extracted mode value.
     */
    valueFromMode() {
        let modeOptions = [
            {
                fhxKey: "OOS_P",
                displayName: "Out of Servive",
                value: valuevalueOfParameter(this.valueBlock, "OOS_P"),
            },
            {
                fhxKey: "IMAN_P",
                displayName: "Initialization Manual",
                value: valuevalueOfParameter(this.valueBlock, "OOS_P"),
            },
            {
                fhxKey: "LOV_P",
                displayName: "Local Override",
                value: valuevalueOfParameter(this.valueBlock, "OOS_P"),
            },
            {
                fhxKey: "MAN_P",
                displayName: "Manual",
                value: valuevalueOfParameter(this.valueBlock, "OOS_P"),
            },
            {
                fhxKey: "AUTO_P",
                displayName: "Auto",
                value: valuevalueOfParameter(this.valueBlock, "OOS_P"),
            },
            {
                fhxKey: "CAS_P",
                displayName: "Cascade",
                value: valuevalueOfParameter(this.valueBlock, "OOS_P"),
            },
            {
                fhxKey: "RCAS_P",
                displayName: "Remote Cascade",
                value: valuevalueOfParameter(this.valueBlock, "OOS_P"),
            },
            {
                fhxKey: "ROUT_P",
                displayName: "Remote Out",
                value: valuevalueOfParameter(this.valueBlock, "OOS_P"),
            },
        ];
    }
}
