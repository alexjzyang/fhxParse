import {
    findBlocks,
    findBlockWithName,
    valueOfParameter,
} from "../v1/_FhxProcessor.js";

class Component {
    constructor(blockFhx) {
        this.block = blockFhx;
        this.name = this._getName();
        this.key = this._getType();
        this.id = Math.random().toString(36).substring(2, 9);
    }

    _getType() {
        let endIndex = this.block.indexOf(" ");
        return this.block.substring(0, endIndex);
    }

    _getName() {
        return valueOfParameter(this.block, "NAME");
    }

    process() {
        console.log(`Component ${this.name} is a ${this.key}`);
    }
}

class ObjectManager {
    constructor() {
        this.objects = {};
        // this.children = {};
    }

    add(obj) {
        // this.objects[obj.id] = obj;
        if (this.objects[obj.name] !== undefined)
            throw new Error("Duplicate Object Found: " + obj.name);
        this.objects[obj.name] = obj;
        obj.objManager = this;
    }

    // get(id) {
    //     return this.objects[id];
    // }
    get(name) {
        return this.objects[name];
    }
}

class ModuleClassComponent extends Component {
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

    process(objManager) {
        super.process();
        console.log(
            `Module: ${this.name} contains:
            ${this.attributes.length} attributes
            ${this.attributeInstances.length} attribute instances
            ${this.functionBlocks.length} function blocks
            Each function block has a definition
            `
        );
        // this.functionBlocks.forEach((fb) => {
        //     fb.findDefinition(objManager)?.process(objManager);
        // });

        this.functionBlocks.forEach((fb) => {
            // fb.process(objManager);
            console.log(
                `Processing Function Block ${fb.name}, with definition ${fb.definition}`
            );
            fb.findDefinition(objManager)?.process(objManager);
        });
    }
}

// one design could be running process function in Object Manager.
// When Object Manager processing is called with one module class, a list of items to be processed is created
// This list initially consists of the attribute, instance, functionblock etc lists in the module class.
// The Object Manager will then loop through the list and process (calling the objects process function) each item in the list
// As it processes each item, more items will be added to the object manager's process list.
// For example function block component's process function will identify the definition block and adding it to the object manager's process list
class FunctionBlockComponent extends Component {
    constructor(blockFhx) {
        super(blockFhx);
        this.definition = valueOfParameter(blockFhx, "DEFINITION");
    }
    findDefinition(objManager) {
        return objManager.get(this.definition);
    }
    process(objManager) {
        super.process();
        console.log(`Function Block ${this.name} has definition ${this.definition}
            `);
    }
}

class AttributeInstanceComponent extends Component {
    constructor(blockFhx) {
        super(blockFhx);
        this.value = { fhx: findBlocks(blockFhx, "VALUE")[0] };
    }
}

class AttributeComponent extends Component {
    constructor(blockFhx) {
        super(blockFhx);
        this.key = valueOfParameter(blockFhx, "TYPE");
    }
}

class FunctionBlockDefinitionComponent extends Component {
    constructor(blockFhx) {
        super(blockFhx);
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
    // test to match type obtained from _getType vs the component's intended type
    process(objManager) {
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

export function componentRunner(fhx) {
    // let fhx = "FHX";
    // create object manager
    let objManager = new ObjectManager();
    // find and store all function block definitions
    let functionBlockDefinitions = findBlocks(fhx, "FUNCTION_BLOCK_DEFINITION");
    let fbdObjs = functionBlockDefinitions.map(
        (fbdfhx) => new FunctionBlockDefinitionComponent(fbdfhx)
    );
    fbdObjs.forEach((obj) => objManager.add(obj));

    // find and store all module class
    let moduleClasses = findBlocks(fhx, "MODULE_CLASS");
    let mcObjs = moduleClasses.map((mcfhx) => new ModuleClassComponent(mcfhx));
    mcObjs.forEach((obj) => objManager.add(obj));

    let _E_M_AGIT = objManager.get("_E_M_AGIT");
    let fbd = _E_M_AGIT.functionBlocks
        .filter((fb) => fb.name === "COMMAND_00001")[0]
        .findDefinition(objManager);

    _E_M_AGIT.process(objManager);

    return;
}
