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
        this.type = this.getType();
        this.componentId = Math.random().toString(36).substring(2, 9);
    }
    process() {
        console.log(`Processing ${this.type} ${this.name}`);
    }

    getName() {
        return valueOfParameter(this.block, "NAME");
    }

    getType() {
        //this version of getType uses getName. This means it assumes that if the name is not found, the type is not handled
        let name = this.name;
        if (this.name === undefined) return;
        // {
        //   throw new Error(
        //     "Name not found in block. Fhx block is not currently identified"
        //   );
        // }
        let search = ` NAME="${name}"`;
        let endIndex = this.block.indexOf(search);
        let startIndex =
            this.block.lastIndexOf("\r\n", endIndex) !== -1
                ? this.block.lastIndexOf("\r\n", endIndex) + 2
                : 0;
        return this.block.substring(startIndex, endIndex);
    }
}

export class ModuleClassComponent extends Component {
    constructor(blockFhx) {
        super(blockFhx); // initializing with block, name, type, id properties
        this.attributes = [];
        this.attributeInstances = [];
        this.functionBlocks = [];
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
    // test to match type obtained from getType vs the component's intended type
    process() {
        console.log(`Processing Function Block Definition ${this.name}
            It has ${this.attributeInstances.length} attribute instances
            This block also has ${this.functionBlocks.length} function blocks
            `);
        // this.functionBlocks.forEach((fb) =>
        //     objManager.get(fb.name)?.process(objManager)
        // );
        this.functionBlocks.forEach((fb) => {
            // fb.process(objManager);
            fb.findDefinition(objManager)?.process(objManager);
        });
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
    }

    getRectangle() {
        let rect = findBlocks(this.block, "RECTANGLE")[0];
        return {
            x: valueOfParameter(rect, "X"),
            y: valueOfParameter(rect, "Y"),
            h: valueOfParameter(rect, "H"),
            w: valueOfParameter(rect, "W"),
        };
    }

    process() {
        console.log(`Attribute ${this.name} has type ${this.type}`);
    }
}

export class AttributeInstanceComponent extends Component {
    constructor(blockFhx) {
        super(blockFhx);
        this.value = this.getValue();
        this.expose = valueOfParameter(blockFhx, "EXPOSE");
        this.exposeIsOverridden = valueOfParameter(
            blockFhx,
            "EXPOSE_IS_OVERRIDDEN"
        );
    }

    getValue() {
        return "[Attribute Instance Value]";
    }

    process() {
        console.log(`Attribute Instance ${this.name} has value ${this.value}`);
    }
}

export class FunctionBlockComponent extends Component {
    constructor(blockFhx) {
        super(blockFhx);
        this.definition = valueOfParameter(blockFhx, "DEFINITION");
        this.description = valueOfParameter(blockFhx, "DESCRIPTION");
        this.id = valueOfParameter(blockFhx, "ID");
        this.rectangle = this.getRectangle();
        this.connectors = this.getConnectors();
        this.getExtensibleAttributes = this.getExtensibleAttributes();
        this.algorithmGenerated = valueOfParameter(
            blockFhx,
            "ALGORITHM_GENERATED"
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
    getRectangle() {
        let rect = findBlocks(this.block, "RECTANGLE");
        if (rect.length === 0) throw new Error("More than one rectangle found");
        rect = rect[0];
        return {
            x: valueOfParameter(rect, "X"),
            y: valueOfParameter(rect, "Y"),
            h: valueOfParameter(rect, "H"),
            w: valueOfParameter(rect, "W"),
        };
    }
    findDefinition(objManager) {
        return objManager.get(this.definition);
    }

    process() {
        console.log(
            `Function Block ${this.name} has definition ${this.definition}`
        );
    }
}

export function componentRunner(fhx) {
    return;
}
