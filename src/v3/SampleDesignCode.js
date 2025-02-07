class Component {
    constructor(id, parentId = null) {
        this.id = id;
        this.parentId = parentId;
    }

    process(manager) {
        console.log(
            `Processing Component ${this.id} (Parent: ${this.parentId})`
        );
    }
}


class ObjectManager {
    constructor() {
        this.objects = {};
        this.children = {};
    }

    add(obj) {
        this.objects[obj.id] = obj;

        // Track child relationships
        if (obj.parentId !== null) {
            if (!this.children[obj.parentId]) {
                this.children[obj.parentId] = [];
            }
            this.children[obj.parentId].push(obj.id);
        }

        // Process this component as soon as it's added
        obj.process(this);
    }

    get(id) {
        return this.objects[id];
    }

    getChildren(parentId) {
        return this.children[parentId]
            ? this.children[parentId].map((id) => this.get(id))
            : [];
    }

    processRecursively(id) {
        const obj = this.get(id);
        if (!obj) return;

        obj.process(this);

        // Process all children recursively
        const children = this.getChildren(id);
        for (const child of children) {
            this.processRecursively(child.id);
        }
    }
}

class EngineComponent extends Component {
    constructor(id, parentId, power) {
        super(id, parentId);
        this.power = power;
    }

    process(manager) {
        console.log(`🚀 Engine ${this.id} started with power: ${this.power}HP`);

        // Process all children (sensors, etc.)
        manager.processRecursively(this.id);
    }
}

class SensorComponent extends Component {
    constructor(id, parentId, sensitivity) {
        super(id, parentId);
        this.sensitivity = sensitivity;
    }

    process(manager) {
        console.log(
            `🔍 Sensor ${this.id} calibrated with sensitivity: ${this.sensitivity}`
        );

        // Process subcomponents if any
        manager.processRecursively(this.id);
    }
}

const manager = new ObjectManager();

// Create the engine (parent component)
const engine = new EngineComponent(1, null, 500);
manager.add(engine);

// Create sensors immediately (children of engine)
const sensor1 = new SensorComponent(2, 1, 0.9);
manager.add(sensor1);

const sensor2 = new SensorComponent(3, 1, 1.2);
manager.add(sensor2);

// Create nested components inside sensor1
const subSensor1 = new SensorComponent(4, 2, 0.5);
manager.add(subSensor1);

const subSensor2 = new SensorComponent(5, 2, 0.7);
manager.add(subSensor2);

/**
 Engine 1 started with power: 500HP
 Sensor 2 calibrated with sensitivity: 0.9
 Sensor 4 calibrated with sensitivity: 0.5
 Sensor 5 calibrated with sensitivity: 0.7
 Sensor 3 calibrated with sensitivity: 1.2
 */
