import { findBlocks, valueOfParameter } from "./util/FhxUtil.js";
import { DesignSpecTables } from "./DSProcessor.js";

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

    getName() {
        return valueOfParameter(this.block, "NAME");
    }

    getValue() {}

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
        this.attributes = [];
        this.attributeInstances = [];
        this.functionBlocks = [];
        this.initializeBlock();
        this.typeName = "MODULE_CLASS";
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

    processDSTable() {
        // this object should be created by the
        // Object Manager or whoever is calling for the DStable creations. And the
        // object should be passed in as an argument
        let dsTables = new DesignSpecTables();
        this.attributes.forEach((attr) => dsTables.add(attr));
        this.attributeInstances.forEach((ai) => dsTables.add(ai));
        this.functionBlocks.forEach((fb) => dsTables.add(fb));
        return dsTables.createModuleParameterTable();
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
        this.typeName = "FUNCTION_BLOCK_DEFINITION";
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
        this.attributeType = valueOfParameter(blockFhx, "TYPE");
        this.readonly = valueOfParameter(blockFhx, "READONLY");
        this.editable = valueOfParameter(blockFhx, "EDITABLE");
        this.rectangle = this.getRectangle();
        this.helpid = valueOfParameter(blockFhx, "HELP_ID");
        this.category = valueOfParameter(blockFhx, "CATEGORY");
        this.configurable = valueOfParameter(blockFhx, "CONFIGURABLE");
        this.group = valueOfParameter(blockFhx, "GROUP");
        this.connectiion = valueOfParameter(blockFhx, "CONNECTION");
        this.typeName = "ATTRIBUTE";
    }
}

export class AttributeInstanceComponent extends Component {
    /**
ATTRIBUTE_INSTANCE NAME="DFLT_OPMD"
EXPOSE=T
EXPOSE_IS_OVERRIDDEN=T

HISTORY_DATA_POINT FIELD="CV" ...
    DATA_CHARACTERISTIC=CONTINUOUS
    ENABLED=T
    SAMPLE_PERIOD_SECONDS=1
    COMPRESSION_ENABLED=T
    RECORD_AT_LEAST_EVERY_MINUTES=240
    DEVIATION_LIMIT_FOR_COMPRESSION=0
    DATA_REPRESENTATION=AUTOMATIC
    EXPOSED=F
    ENTERPRISE_COLLECTION=F

EXPLICIT_OVERRIDE=T
 */

    constructor(blockFhx) {
        super(blockFhx);
        this.expose = valueOfParameter(blockFhx, "EXPOSE");
        this.exposeIsOverridden = valueOfParameter(
            blockFhx,
            "EXPOSE_IS_OVERRIDDEN"
        );
        this.explicitOverride = valueOfParameter(blockFhx, "EXPLICIT_OVERRIDE");
        // this.value = this.getValue()
        // this.valueType = this.getValueType()
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
    }

    findDefinition(objManager) {
        return objManager.get(this.definition);
    }
}

export function componentRunner(fhx) {
    return;
}
