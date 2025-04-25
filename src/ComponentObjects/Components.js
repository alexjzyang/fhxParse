import { findBlocks, valueOfParameter } from "../util/FhxUtil.js";

class ComponentCreator {
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
            case "FUNCTION_BLOCK_TEMPLATE":
                return new FunctionBlockTemplateComponent(fhxStr);
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
}

class ModuleClassComponent extends Component {
    constructor(blockFhx) {
        super(blockFhx); // initializing with block, name, type, id properties
        this.attributes;
        this.attributeInstances;
        this.functionBlocks;
        this.properties;
        this.componentType = "MODULE_CLASS";
        this.childDevices;
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
        this.childDevices = findBlocks(this.block, "MODULE_BLOCK").map(
            (block) => new ModuleBlockComponent(block)
        );

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
class FunctionBlockDefinitionComponent extends Component {
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

class AttributeComponent extends Component {
    constructor(blockFhx) {
        super(blockFhx);
        this.elements = {
            TYPE: valueOfParameter(blockFhx, "TYPE"),
            CONNECTION: valueOfParameter(blockFhx, "CONNECTION"),
            RECTANGLE: this.getRectangle(),
            GROUP: valueOfParameter(blockFhx, "GROUP"),
            CATEGORY: valueOfParameter(blockFhx, "CATEGORY"),
            EDITABLE: valueOfParameter(blockFhx, "EDITABLE"),
            HELP_ID: valueOfParameter(blockFhx, "HELP_ID"),
            READONLY: valueOfParameter(blockFhx, "READONLY"),
            CONFIGURABLE: valueOfParameter(blockFhx, "CONFIGURABLE"),
        };

        this.componentType = "ATTRIBUTE";
    }
    get type() {
        return this.elements.TYPE;
    }
    get connection() {
        return this.elements.CONNECTION;
    }
    get rectangle() {
        return this.elements.RECTANGLE;
    }
    get group() {
        return this.elements.GROUP;
    }
    get category() {
        return this.elements.CATEGORY;
    }
    get editable() {
        return this.elements.EDITABLE;
    }
    get helpId() {
        return this.elements.HELP_ID;
    }
    get readonly() {
        return this.elements.READONLY;
    }
    get configurable() {
        return this.elements.CONFIGURABLE;
    }
}

class AttributeInstanceComponent extends Component {
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
        this.componentType = "ATTRIBUTE_INSTANCE";
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
        let block = findBlocks(this.block, blockName);
        if (block.length > 1) {
            // console.log("More than one value block found");
            if (this.name.includes("SGCR") || this.name.includes("SPLTR")) {
                // console.log(`${this.name}'s value case not currently handled
                //         The attribute is a SGCR or SPLTR function block`);
            }
            return "Value block handling exception";
        }
        // throw new Error("More than one value block found");
        else if (block.length === 0) return;
        else return block[0];
    }
}

class FunctionBlockComponent extends Component {
    constructor(blockFhx) {
        super(blockFhx);
        this.elements = {
            DEFINITION: valueOfParameter(blockFhx, "DEFINITION"),
            DESCRIPTION: valueOfParameter(blockFhx, "DESCRIPTION"),
            ID: valueOfParameter(blockFhx, "ID"),
            ALGORITHM_GENERATED: valueOfParameter(
                blockFhx,
                "ALGORITHM_GENERATED"
            ),
            RECTANGLE: this.getRectangle(),
            ADDITIONAL_CONNECTORS: this.getConnectors(),
            EXTENSIBLE_ATTRIBUTE: this.getExtensibleAttributes(),
            ALGORITHM_GENERATED: valueOfParameter(
                blockFhx,
                "ALGORITHM_GENERATED"
            ),
        };
        this.componentType = "FUNCTION_BLOCK";
        this.getDefinitionBlock = this.findDefinition;
    }
    findDefinition(objManager) {
        return objManager.get(this.definition);
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
    getExtensibleAttributes() {
        return findBlocks(this.block, "EXTENSIBLE_ATTRIBUTE").map((extAttr) => {
            return {
                name: valueOfParameter(extAttr, "NAME"),
                count: valueOfParameter(extAttr, "COUNT"),
            };
        });
    }
    get definition() {
        return this.elements.DEFINITION;
    }
    get description() {
        return this.elements.DESCRIPTION;
    }
    get id() {
        return this.elements.ID;
    }
    get algorithmGenerated() {
        return this.elements.ALGORITHM_GENERATED;
    }
    get rectangle() {
        return this.elements.RECTANGLE;
    }
    get additionalConnectors() {
        return this.elements.ADDITIONAL_CONNECTORS;
    }
    get extensibleAttributes() {
        return this.elements.EXTENSIBLE_ATTRIBUTE;
    }
    get algorithmGenerated() {
        return this.elements.ALGORITHM_GENERATED;
    }
}

class ModuleBlockComponent extends Component {
    constructor(blockFhx) {
        super(blockFhx);
        /**
         * DESCRIPTION="CM Class _GEX_AGIT_M Design Specification"
         * OWNERSHIP=OWNED
         * ALLOW_VARIANTS=T
         * RECTANGLE= { X=620 Y=920 H=316 W=140 }
         */
        this.elements = {
            MODULE: valueOfParameter(blockFhx, "MODULE"),
            DESCRIPTION: valueOfParameter(blockFhx, "DESCRIPTION"),
            OWNERSHIP: valueOfParameter(blockFhx, "OWNERSHIP"),
            ALLOW_VARIANTS: valueOfParameter(blockFhx, "ALLOW_VARIANTS"),
            RECTANGLE: this.getRectangle(),
        };
        this.componentType = "MODULE_BLOCK";
    }
    get module() {
        return this.elements.MODULE;
    }
    get description() {
        return this.elements.DESCRIPTION;
    }
    get ownership() {
        return this.elements.OWNERSHIP;
    }
    get allowVariants() {
        return this.elements.ALLOW_VARIANTS;
    }
    get rectangle() {
        return this.elements.RECTANGLE;
    }
}

class FunctionBlockTemplateComponent extends Component {
    constructor(blockFhx) {
        super(blockFhx);
        this.elements = {
            DESCRIPTION: valueOfParameter(blockFhx, "DESCRIPTION"),
        };
        this.componentType = "FUNCTION_BLOCK_TEMPLATE";
    }

    get description() {
        return this.elements.DESCRIPTION;
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
class NamedSetComponent extends Component {
    constructor(blockFhx) {
        super(blockFhx);
        this.elements = {
            FIXED: valueOfParameter(blockFhx, "FIXED"),
            DESCRIPTION: valueOfParameter(blockFhx, "DESCRIPTION"),
            CATEGORY: valueOfParameter(blockFhx, "CATEGORY"),
            ENTRIES: this.getEntries(),
            DEFAULT_VALUE: valueOfParameter(blockFhx, "DEFAULT_VALUE"),
        };
        this.componentType = "NAMED_SET";
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
``;

class ModuleProperties {
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

class EquipmentModuleComponent extends ModuleClassComponent {
    // equipment module is a module class with an element
    // IS_EQUIPMENT_MODULE=T
}

class ControlModuleComponent extends ModuleClassComponent {
    // control module is a module class without
    // IS_CONTROL_MODULE=T
}

class EmbeddedFunctionBlockComponent {
    // Embedded function block is a function that has
    // ALGORITHM_GENERATED=T in the function block (embedded), and
    // GRAPHICS ALGORITHM=FBD in its definition block
}

class EmbeddedSequentialFunctionChartComponent {
    // Embedded sequential function chart is a function block that has
    // ALGORITHM_GENERATED=T in the function block (embedded), and
    // GRAPHICS ALGORITHM=SFC in its definition block
    // steps;
    // transitions;
    // constructor(fhx) {
    //     super(fhx);
    //     this.componentType = "SFC";
    // }
}

class LinkedFunctionBlockComponent {
    // Linked function block is a function block that does NOT have
    // ALGORITHM_GENERATED=T
    // Being a function block diagram, they should still have
    // GRAPHICS ALGORITHM=FBD in their definition block
}

export {
    ComponentCreator,
    Component,
    ModuleClassComponent,
    FunctionBlockDefinitionComponent,
    AttributeComponent,
    AttributeInstanceComponent,
    FunctionBlockComponent,
    ModuleBlockComponent,
    FunctionBlockTemplateComponent,
    NamedSetComponent,
    ModuleProperties,
};
