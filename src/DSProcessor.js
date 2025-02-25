/**
 * Takes a list of components and create tables accordingly to be used in the
 * design specification documents
 */

import {
    AttributeComponent,
    AttributeInstanceComponent,
    FunctionBlockComponent,
} from "./Components.js";
import { valueOfParameter } from "./util/FhxUtil.js";
import {
    AlarmValue,
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
        // this.associatedModules = this.getAssociatedModules();
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
    createEmChildDevicesTable() {}
    createModuleParameterTable() {
        return new ModuleParameterTable(
            this.module.attributes,
            this.module.attributeInstances
        ).createCsvString();
    }
    createInstanceConfigurableTable() {}
    createFunctionBlockTable() {}
    createLinkedCompositeTable() {}
    createEmbeddedCompositeTable() {}
    createSfcTable() {}
    //* fail monitor table logic is not designed for now
    createAlarmTable() {}
    createHistoryTable() {}
}

/**
 * DS Module Parameter table is the current section of x.1,
 *
 * The table contains the two unnamed columns and the following rows
 *
 * Description, Module Type, Module Subtype, Scan Rate, Faceplate, Detailed Display
 * These are contained in the
 */

class ModulePropertiesTable {
    constructor(properties) {
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
        let csv = "";
        if (this.assembleHeader) {
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

    createCsvString() {
        let csv = "";
        if (this.assembleHeader()) {
            csv += this.assembleHeader().join(",");
            csv += "\n";
        }
        csv += this.assembleRows()
            .map((row) => row.join(","))
            .join("\n");
        return csv;
    }
}

class EmCommandSetTable {
    constructor(enumerationSet) {
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

    createCsvString() {
        let csv = "";
        if (this.assembleHeader()) {
            csv += this.assembleHeader().join(",");
            csv += "\n";
        }
        csv += this.assembleRows()
            .map((row) => row.join(","))
            .join("\n");
        return csv;
    }
}
