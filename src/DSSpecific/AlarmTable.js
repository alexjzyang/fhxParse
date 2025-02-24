/**
 * Alarms are Attributes which types are EVENT. Their associated
 * Attribute Instance blocks contain a value block which describes
 * the parameters of the alarm.
 *
 */

import {
    findBlocks,
    valueOfParameter,
    findBlockWithName,
} from "../util/FhxUtil.js";
import { DSTable } from "./Common.js";

/**
 * Retrieves alarms for a given module name.
 * @param {string} moduleBlock - The fhx string of a single MODULE_CLASS block
 * @returns {AlarmTable} - The table of alarms.
 */
function getAlarms(moduleBlock) {
    let alarmAttributeBlocks = findBlocks(moduleBlock, "ATTRIBUTE").filter(
        (attribute) => attribute.includes("TYPE=EVENT")
    );

    let alarmAttributeInstances = alarmAttributeBlocks.map((alarmBlock) => {
        let alarmName = valueOfParameter(alarmBlock, "NAME");
        return findBlockWithName(moduleBlock, "ATTRIBUTE_INSTANCE", alarmName);
    });

    let alarmParameters = alarmAttributeInstances.map((instance) => {
        return new AlarmParameter(instance);
    });

    return new AlarmTable(alarmParameters);
}

/**
 * List of Alarm Value Block Parameters
 *   ATTRIBUTE_INSTANCE NAME="BYPASS_ON"
  {
    VALUE
    {
      PRIORITY_NAME="ALERT"
      ENAB=F
      INV=F
      ATYP="_A_M_ Bypass Alarm"
      MONATTR=""
      ALMATTR="BYPASSED"
      LIMATTR=""
      PARAM1=""
      PARAM2=""
      SUPPTIMEOUT=480
      MASK=65535
      ISDEFAULTMASK=T
      ALARM_FUNCTIONAL_CLASSIFICATION=0
    }
 */

/**
 * Represents an alarm parameter.
 * @class
 */
class AlarmParameter {
    /**
     * Creates an instance of AlarmParameter.
     * @param {Object} block - The block containing alarm data.
     */
    constructor(block) {
        // the commented out parameters are typically not used in DeltaV
        this.name = valueOfParameter(block, "NAME");
        this.block = block;
        this.priority = valueOfParameter(block, "PRIORITY_NAME");
        this.enable = valueOfParameter(block, "ENAB");
        this.inverted = valueOfParameter(block, "INV");
        this.type = valueOfParameter(block, "ATYP");
        // this.monitorAttribute = valueOfParameter(block, "MONATTR");
        this.alarmParameter = valueOfParameter(block, "ALMATTR");
        this.limit = valueOfParameter(block, "LIMATTR");
        this.param1 = valueOfParameter(block, "PARAM1");
        this.param2 = valueOfParameter(block, "PARAM2");
        this.timeout = valueOfParameter(block, "SUPPTIMEOUT");
        this.placeholder = `P1: ${this.param1}; P2: ${this.param2}`;
        // this.mask = valueOfParameter(block, "MASK");
        // this.isDefaultMask = valueOfParameter(block, "ISDEFAULTMASK");
        // this.alarmFunctionalClassification = valueOfParameter(
        //   block,
        //   "ALARM_FUNCTIONAL_CLASSIFICATION"
        // );
    }
    toString() {}

    static alarmValueBlockKeys = [
        { dvkey: "PRIORITY_NAME", displayname: "Priority", displayed: true },
        { dvkey: "ENAB", displayname: "Enabled", displayed: true },
        { dvkey: "INV", displayname: "Inverted", displayed: false },
        { dvkey: "ATYP", displayname: "Alarm Type", displayed: false },
        { dvkey: "MONATTR", displayname: "", displayed: false },
        { dvkey: "ALMATTR", displayname: "Parameter", displayed: true },
        { dvkey: "LIMATTR", displayname: "Alarm Limit", displayed: true },
        { dvkey: "PARAM1", displayname: "Parameter P1", displayed: true },
        { dvkey: "PARAM2", displayname: "Parameter P2", displayed: true },
        {
            dvkey: "SUPPTIMEOUT",
            displayname: "Timeout Minutes",
            displayed: true,
        }, // a timeout value of 1438560 is 999 days, meaning there is no intended timeout
        { dvkey: "MASK", displayname: "", displayed: false },
        { dvkey: "ISDEFAULTMASK", displayname: "", displayed: false },
        {
            dvkey: "ALARM_FUNCTIONAL_CLASSIFICATION",
            displayname: "",
            displayed: false,
        },
    ];
}

/**
 * The alarm table should look like the following:
 *
 * Alarm  | Parameter  | Parameter Limit | Timeout | Placeholder Values         | Priority
 * HI_ALM | AI1/HI_ACT | AI1/HI_LIM      | 480     | False   | P1: AI1/OUT P2: AI1/HI_LIM | Warning
 *
 *
 */

/**
 * Represents a table of alarms.
 * @class
 * @extends DSTable
 */
class AlarmTable extends DSTable {
    /**
     * Creates an instance of AlarmTable.
     * @param {Array<AlarmParameter>} alarmParameters - The list of alarm parameters.
     */
    constructor(alarmParameters) {
        super(
            "Function Blocks",
            [
                "Alarm",
                "Parameter",
                "Parameter Limit",
                "Timeout",
                "Enabled",
                "Placeholder Values",
                "Priority",
            ],
            alarmParameters
        );
    }

    toCsvString() {
        let csv = "";
        if (this.tableHeader) csv += this.tableHeader.join(",") + "\n";

        for (let {
            name,
            priority,
            enable,
            alarmParameter,
            limit,
            placeholder,
            timeout,
        } of this.data.sort((a, b) => a.name.localeCompare(b.name))) {
            limit = limit || "N/A";
            let row = [
                name,
                alarmParameter,
                limit,
                timeout,
                enable,
                placeholder,
                priority,
            ];

            csv += row.join(",") + "\n";
        }
        return csv;
    }
}

export { getAlarms };
