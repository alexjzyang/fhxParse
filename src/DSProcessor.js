/**
 * Takes a list of components and create tables accordingly to be used in the
 * design specification documents
 */

import {
    AlarmValue,
    HistoryValue,
    ModeValue,
    NamedSetSet,
    NamedSetValue,
    NumberValue,
    ReferenceValue,
    StringValue,
} from "./ValueBlocks.js";

export class DesignSpecTables {
    constructor(componentManager, moduleName) {
        this.componentManager = componentManager;
        this.module = componentManager.get(moduleName);
        this.tables = {
            moduleProperties: this.createModulePropertiesTable(),
            emCommands: this.createEmCommandsTable(),
            emChildDevices: this.createEmChildDevicesTable(),
            moduleParameters: this.createModuleParameterTable(),
            // instanceConfigurable: this.createInstanceConfigurableTable(),
            functionBlock: this.createFunctionBlockTable(),
            linkedComposite: this.createLinkedCompositeTable(),
            embeddedComposite: this.createEmbeddedCompositeTable(),
            // sfc: this.createSfcTable(),
            alarm: this.createAlarmTable(),
            history: this.createHistoryTable(),
        };
    }

    getAssociatedTables() {
        let { functionBlocks } = this.module;
        return functionBlocks
            ?.filter((fb) => fb.algorithmGenerated === "T")
            .map((name) => name);
    }

    // Design spec table, create table functions should isolate all the proper
    // information as the Controller in MVC, which is responsible to create the
    // modules and pass into the table classes
    // The table classes should be responsible to create the table and return
    // In fact the "model" of MVC should be the component classes, which should have
    // information of what sub components they have.
    // the csv string as a "view" object

    createModulePropertiesTable() {
        return new ModulePropertiesTable(
            this.module.properties
        ).createCsvString();
    }

    createEmCommandsTable() {
        return new EmCommandSetTable(
            this.componentManager.objects[this.module.emCommandSet]
        ).createCsvString();
    }
    createEmChildDevicesTable() {
        return new EmChildTable(this.module.childDevices).createCsvString();
    }
    createModuleParameterTable() {
        return new ModuleParameterTable(
            this.module.attributes,
            this.module.attributeInstances
        ).createCsvString();
    }
    createInstanceConfigurableTable() {}
    createFunctionBlockTable() {
        // for the function block table, we only want OOB function blocks

        let { functionBlocks } = this.module;
        let OOBFunctionBlocks = functionBlocks.filter((fb) => {
            let definitionBlock = this.componentManager.get(fb.definition);
            return definitionBlock.componentType === "FUNCTION_BLOCK_TEMPLATE";
        });

        return new FunctionBlockTable(OOBFunctionBlocks).createCsvString();
    }

    /**
     * GRAPHICS ALGORITHM=FBD dictates whether the black is function block diagram based
     * GRAPHICS ALGORITHM=SFC dictates whether the block is sequential function chart based
     */
    createLinkedCompositeTable() {
        // for the linked composite table, we only want blocks which definintion
        // has a category "Library/CompositeTemplates"
        let { functionBlocks } = this.module;
        let composites = functionBlocks.filter((fb) => {
            let definitionBlock = this.componentManager.get(fb.definition);
            return (
                definitionBlock.category?.includes(
                    "Library/CompositeTemplates"
                ) && definitionBlock.fhx.includes("GRAPHICS ALGORITHM=FBD")
            );
        });
        return new LinkedCompositeTable(composites).createCsvString();
    }
    createEmbeddedCompositeTable() {
        // for the embbeded composite table, we want the function block definitions has a empty category string
        let { functionBlocks } = this.module;
        let composites = functionBlocks.filter((fb) => {
            let definitionBlock = this.componentManager.get(fb.definition);
            return (
                definitionBlock.category?.includes("") &&
                definitionBlock.fhx.includes("GRAPHICS ALGORITHM=FBD")
            );
        });
        return new EmbeddedCompositeTable(composites).createCsvString();
    }

    createSfcTable() {
        // for the embbeded composite table, we want the function block definitions has a empty category string
        let { functionBlocks } = this.module;
        let composites = functionBlocks.filter((fb) => {
            let definitionBlock = this.componentManager.get(fb.definition);
            return (
                definitionBlock.category?.includes("") &&
                definitionBlock.fhx.includes("GRAPHICS ALGORITHM=SFC")
            );
        });
        return new SfcTable(composites).createCsvString(); // this is not implemented yet
    }

    //* fail monitor table logic is not designed for now
    createAlarmTable() {
        let alarmAttributeBlocks = this.module.attributes.filter(
            (attribute) => attribute.type === "EVENT"
        );
        let alarmAttributeInstances = alarmAttributeBlocks.map((alarmBlock) => {
            return this.module.attributeInstances.find(
                (attributeInstance) =>
                    attributeInstance.name === alarmBlock.name
            );
        });
        // let alarms = alarmAttributeInstances.map(
        //     (attributeInstance) => new AlarmValue(attributeInstance.valueBlock)
        // );
        return new AlarmTable(alarmAttributeInstances).createCsvString();
    } // alarms are attribute instances that has a associated attribute with TYPE=EVENT
    createHistoryTable() {
        let historyAttributeInstances = this.module.attributeInstances.filter(
            (attributeInstance) =>
                attributeInstance.hisotryDataPointBlock !== undefined
        );
        return new HistorizationTable(
            historyAttributeInstances
        ).createCsvString();
    }
}

class DSTable {
    assembleHeader() {}
    assembleRows() {}
    createCsvString(hasHeader = true) {
        let csv = "";
        if (hasHeader) {
            csv += this.assembleHeader().join(",");
            csv += "\n";
        }
        csv += this.assembleRows()
            .map((row) => row.join(","))
            .join("\n");
        return csv;
    }
}

/**
 * DS Module Parameter table is the current section of x.1,
 *
 * The table contains the two unnamed columns and the following rows
 *
 * Description, Module Type, Module Subtype, Scan Rate, Faceplate, Detailed Display
 * These are contained in the
 */

class ModulePropertiesTable extends DSTable {
    constructor(properties) {
        super();
        this.properties = properties;
    }

    // assembleHeader() {
    //     return ["", ""];
    // }

    assembleRows() {
        let rows = [];
        let rowsToDisplay = [
            "DESCRIPTION",
            "TYPE",
            "SUB_TYPE",
            "PERIOD",
            "INSTRUMENT_AREA_DISPLAY",
            "DETAIL_DISPLAY",
        ];

        let displayNames = {
            DESCRIPTION: "Description",
            PERIOD: "Scan Rate",
            INSTRUMENT_AREA_DISPLAY: "Faceplate",
            DETAIL_DISPLAY: "Detail Display",
            TYPE: "Module Type",
            SUB_TYPE: "Module Subtype",
        };

        for (const prop of rowsToDisplay) {
            rows.push([displayNames[prop], this.properties[prop]]);
        }
        return rows;
    }

    createCsvString() {
        return super.createCsvString(false);
    }
}

/**
 * DS Module Parameter table is the current section of x.4.1,
 * [Module Name] - Parameters - Module Parametesr
 *
 * Condition of the attribute content included in this table
 * Attribute instances which has a matching attribute.
 *
 * The table contains the following columns:
 * Parameter Name, obtained from the NAME attribute of the ATTRIBUTE block
 * Parameter Type, obtained from the TYPE attribute of the ATTRIBUTE block
 * Default Value, obtained from the VALUE attribute of the ATTRIBUTE_INSTANCE block of the same name
 */
class ModuleParameterTable extends DSTable {
    constructor(attributes, attributeInstances) {
        super();
        this.attributes = attributes;
        this.attributeInstances = attributeInstances;
    }
    assembleHeader() {
        return ["Parameter Name", "Parameter Type", "Default Value"];
    }
    assembleRows() {
        let rows = [];
        for (const attribute of this.attributes) {
            let attributeInstance = this.attributeInstances.find(
                (attributeInstance) => attributeInstance.name === attribute.name
            );
            if (attributeInstance) {
                rows.push([
                    attribute.name,
                    attribute.type,
                    `<${this.getFormatValue(
                        attribute.type,
                        attributeInstance.valueBlock
                    )}>`,
                ]);
            }
        }
        return rows.sort((a, b) => a[0].localeCompare(b[0]));
    }

    /**
     *
     * @param {string} attributeType
     * @param {FhxValue} valueFhx
     * @returns
     */
    getFormatValue(attributeType, valueFhx) {
        switch (attributeType) {
            case "FLOAT":
            case "UINT8":
            case "UINT16":
            case "UINT32": // 32 bit unsigned integer
            case "INT8":
            case "INT16":
            case "INT32":
                return this.formatNumberValue(valueFhx);
            case "BOOLEAN":
                return this.formatNumberValue(valueFhx);
            case "UNICODE_STRING":
                return this.formatStringValue(valueFhx);

            case "FLOAT_WITH_STATUS": // Float with Status"
                return this.formatParamWithStatusValue(valueFhx);
            case "INTERNAL_REFERENCE": // Internal Reference
            case "EXTERNAL_REFERENCE": // External Reference
            case "DYNAMIC_REFERENCE": // Dynamic Reference
                return this.formatReferenceValue(valueFhx);
            case "MODE": // Mode
                return this.formatModeValue(valueFhx);
            case "EVENT": // Alarm
                return this.formatAlarmValue(valueFhx);
            // Additional cases might be needed for other parameter types
            case "ENUMERATION_VALUE":
                return this.formatNamedSetValue(valueFhx);
            default:
                return;
        }
    }

    // this should be a formatter class on its own SOC

    formatAlarmValue(valueFhx) {
        return this.formatAlarmPriority(valueFhx);
    }
    formatAlarmPriority(valueFhx) {
        let value = new AlarmValue(valueFhx);
        return value.priority;
    }
    formatNamedSetValue(valueFhx) {
        let value = new NamedSetValue(valueFhx);
        return `${value.set}:${value.stringValue}`;
    }
    formatNamedSetSet(valueFhx) {
        let value = new NamedSetSet(valueFhx);
        return value.enumSet;
    }
    formatNumberValue(valueFhx) {
        let value = new NumberValue(valueFhx);
        return value.cv;
    }
    formatStringValue(valueFhx) {
        let value = new StringValue(valueFhx);
        return value.cv;
    }
    formatModeValue(valueFhx) {
        let value = new ModeValue(valueFhx);
        return `Permitted Modes: ${value.permitted.join(", ")}`;
    }
    formatReferenceValue(valueFhx) {
        let value = new ReferenceValue(valueFhx);
        return value.ref;
    }
    formatParamWithStatusValue(valueFhx) {
        let value = new ParamWithStatusValue(valueFhx);
        return value.cv;
    }
    formatExpressionValue(exp) {
        let value = new ExpressionValue(exp);
        return value.expression;
    }
}

/**
 * Table x.2
 */
class EmCommandSetTable extends DSTable {
    constructor(enumerationSet) {
        super();
        this.enumerationSet = enumerationSet;
    }
    assembleHeader() {
        return ["State", "Value", "Visible", "User Selectable"];
    }
    assembleRows() {
        let rows = [];
        for (const entry of this.enumerationSet.entries) {
            let { name, value, visible, selectable } = entry;
            visible = visible === "F" ? "No" : "Yes";
            selectable = selectable === "F" ? "No" : "Yes";

            rows.push([name, value, visible, selectable]);
        }

        return rows.sort((a, b) => a[0].localeCompare(b[0]));
    }
}

/**
 * Table x.3
 * Device IDs | Class Name | Ownership
 * AGIT1_MTR | _C_M_AGIT_M | Private
 */
class EmChildTable extends DSTable {
    constructor(childDevices) {
        super();
        this.childDevices = childDevices;
    }

    assembleHeader() {
        return ["Device IDs", "Class Name", "Ownership"];
    }
    assembleRows() {
        let rows = [];
        for (const moduleBlockComponent of this.childDevices) {
            // Child devices
            // are essentially module blocks
            let { name, module, ownership } = moduleBlockComponent;
            rows.push([name, module, ownership]);
        }
        return rows.sort((a, b) => a[0].localeCompare(b[0]));
    }
}

/**
 * Table x.4.2
 * Table layout
 * Name	| Default Value
 * AGIT2_MTR/MODULE_BLOCK_BINDING.MNAME | AGIT2_MTR2
 * DEV1_ID.CV | <AGIT1_MTR>
 *
 * The table should include all the values a DV Bulk edit have. If a param has
 * multiple element, such as alarms, they should all be captured.
 */
class InstanceConfigurableTable extends DSTable {
    constructor() {
        super();
    }

    assembleHeader() {}
    assembleRows() {}
    // Override createCsvString method if no header is needed in the table or any other special case
}

/**
 * Table x.6
 * Name | Function Block Type | *Functionality
 * ACT1 | ACT | To Set OWNER_ID
 * HOLD_REQ_LOGIC | COND | To Set/Reset Hold request status based on devices HOLD_ID and HOLD_REQ
 */
class FunctionBlockTable extends DSTable {
    // FunctionBlock Table only displays OOB function blocks. Ones which definition is a function block template

    constructor(functionBlocks, functionalities) {
        super();
        this.functionBlocks = functionBlocks;
        this.functionalities = functionalities;
    }

    assembleHeader() {
        return ["Name", "Function Block Type", "Functionality"];
    }
    assembleRows() {
        let rows = [];
        this.functionBlocks.forEach((fb, i) => {
            rows.push([
                fb.name,
                fb.definition,
                this.functionalities && this.functionalities[i]
                    ? this.functionalities[i]
                    : "N/A",
            ]);
        });
        return rows.sort((a, b) => a[0].localeCompare(b[0]));
    }
    // Override createCsvString method if no header is needed in the table or any other special case
}

/**
 * Table x.7
 * Name | Definition | Functionality
 * COMMAND_CTRL | _CT_M_CMD_CTRL | To set EM Command
 */

class LinkedCompositeTable extends DSTable {
    constructor(linkedComposites, functionalities) {
        super();
        this.linkedComposites = linkedComposites;
        this.functionalities = functionalities;
    }

    assembleHeader() {
        return ["Name", "Definition", "Functionality"];
    }
    assembleRows() {
        let rows = [];
        this.linkedComposites.forEach((fb, i) => {
            rows.push([
                fb.name,
                fb.definition,
                this.functionalities && this.functionalities[i]
                    ? this.functionalities[i]
                    : "N/A",
            ]);
        });
        return rows.sort((a, b) => a[0].localeCompare(b[0]));
    }
    // Override createCsvString method if no header is needed in the table or any other special case
}

/**
 * 4.8 -> Embedded Composites
 * 4.8.1 EQUIPMENT_LOGIC - FBD Composite  (x.8.? is a list of embedded composites
 * which fhx should exist in a separate root block, i.e. Function Block Definition)
 * 4.8.2 MONITOR – FBD Composite
 *
 * Embedded Composite should be treated as a separate block, which has their own
 * nested blocks and therefore their own set of tables
 *
 * Table x.8.1
 * Name | Type
 * GEX_AGIT_SPD_WT | Embedded Composite
 */
class EmbeddedCompositeTable extends DSTable {
    constructor(embeddedComposite) {
        super();
        this.embeddedComposite = embeddedComposite;
    }

    assembleHeader() {
        return ["Name"];
    }
    assembleRows() {
        let rows = [];
        for (const composite of this.embeddedComposite) {
            rows.push([composite.name]);
        }
        return rows.sort((a, b) => a[0].localeCompare(b[0]));
    }
    // Override createCsvString method if no header is needed in the table or any other special case
}
/**
 * Alias: SFC table is also called Commadn Logic. (x.5.x.2)
 * SFC table code is already implemented elsewhere
 *
 * Table x.8.x.x.2
 * Step and Transition | Action | Expression
 * S0000 Start | N/A | N/A
 *
 * Aside: Table x.8.x.x.1 (Composite Parameters) is just a module parameter
 * table of the function block definition of that embedded composite
 */
class SfcTable extends DSTable {
    constructor() {
        // super();
    }

    assembleHeader() {
        return ["Steps and Transitions", "Acions", "Expressions"];
    }
    assembleRows() {}
    // Override createCsvString method if no header is needed in the table or any other special case
}

// this is current not implemented, due its difficult design
class FailureMonitorTable extends DSTable {
    constructor() {
        super();
    }

    assembleHeader() {}
    assembleRows() {}
    // Override createCsvString method if no header is needed in the table or any other special case
}
/**
 * Table x.10
 * Alarm | Parameters | Parameter Limit | Default Limit | Enabled | Alarm Message | Placeholder Values | Priority
 * FAIL_ALM | FAILURE | N/A | N/A | No | %P1 %P2 | P1:FAIL P2:MONITOR/FAILURE | Warning
 *
 */
class AlarmTable extends DSTable {
    constructor(attributeInstances) {
        super();
        this.attributeInstances = attributeInstances;
        this.alarms = this.getAlarms();
    }

    getAlarms() {
        //each attirbute instance contains name and knows the value block of the alarm
        // and the value block can be used to create AlarmValue object which    contains the necessary information needed to create the able

        let alarms = this.attributeInstances.map((attributeInstance) => {
            let {
                almattr,
                limattr,
                enable,
                param1,
                param2,
                supptimeout,
                priority,
            } = new AlarmValue(attributeInstance.valueBlock);

            let name = attributeInstance.name;
            return {
                name,
                parameter: almattr,
                limit: limattr,
                enable,
                param1,
                param2,
                supptimeout,
                priority,
            };
        });
        return alarms;
    }

    assembleHeader() {
        return [
            "Alarm",
            "Parameter",
            "Parameter Limit",
            "Timeout",
            "Enabled",
            "Parameter 1",
            "Parameter 2",
            "Priority",
        ];
    }
    assembleRows() {
        let rows = [];
        for (const alarm of this.alarms) {
            let {
                name,
                parameter,
                limit,
                supptimeout,
                enable,
                param1,
                paramm2,
                priority,
            } = alarm;
            rows.push([
                name || "N/A",
                parameter || "N/A",
                limit || "N/A",
                supptimeout || "N/A",
                enable || "N/A",
                param1 || "N/A",
                paramm2 || "N/A",
                priority || "N/A",
            ]);
        }
        return rows.sort((a, b) => a[0].localeCompare(b[0]));
    }
    // Override createCsvString method if no header is needed in the table or any other special case
}

/**
 * Table x.11
 * Value Recorded | Enabled | Display Representation | Data Characteristics | Sampling Period | Compression | Deviation | At Least
 * FP_CMD.CV | Yes | Automatic | Continuous | 1 | Yes | 0 | 240
 *
 *
 */
class HistorizationTable extends DSTable {
    constructor(attributeInstances) {
        super();
        this.attributeInstances = attributeInstances;
        this.historyPoints = this.getHistoryPoints();
    }

    getHistoryPoints() {
        let historyPoints = this.attributeInstances.map((attributeInstance) => {
            let {
                field,
                enabled,
                dataRepresentation,
                dataCharacteristics,
                samplePeriod,
                compressionEnabled,
                deviationLimit,
                atLeast,
            } = new HistoryValue(attributeInstance.hisotryDataPointBlock);

            let valueRecorded = `${attributeInstance.name}.${field}`;
            enabled = enabled === "T" ? "Yes" : "No";

            compressionEnabled = compressionEnabled === "T" ? "Yes" : "No";
            return {
                valueRecorded,
                enabled,
                dataRepresentation,
                dataCharacteristics,
                samplePeriod,
                compressionEnabled,
                deviationLimit,
                atLeast,
            };
        });
        return historyPoints;
    }

    assembleHeader() {
        return [
            "Value Recorded",
            "Enabled",
            "Display Representation",
            "Data Characteristics",
            "Sampling Period",
            "Compression",
            "Deviation",
            "At Least",
        ];
    }
    assembleRows() {
        let rows = [];
        for (const historyPoint of this.historyPoints) {
            let {
                valueRecorded,
                enabled,
                dataRepresentation,
                dataCharacteristics,
                samplePeriod,
                compressionEnabled,
                deviationLimit,
                atLeast,
            } = historyPoint;
            rows.push([
                valueRecorded || "N/A",
                enabled || "N/A",
                dataRepresentation || "N/A",
                dataCharacteristics || "N/A",
                samplePeriod || "N/A",
                compressionEnabled || "N/A",
                deviationLimit || "N/A",
                atLeast || "N/A",
            ]);
        }
        return rows.sort((a, b) => a[0].localeCompare(b[0]));
    }
    // Override createCsvString method if no header is needed in the table or any other special case
}
