import {
    findBlocks,
    valueOfParameter,
    findBlockWithName,
} from "../util/FhxUtil.js";
import { DSTable } from "./Common.js";

/**
 * Retrieves EM commands from the FHX data for a given module name.
 * @param {string} moduleBlock - The fhx string of a single MODULE_CLASS block
 * @returns {EMCommandsTable} - The table of EM commands.
 */
function getEMCommands(fhxdata, moduleBlock) {
    let commandNamedSet = valueOfParameter(moduleBlock, "COMMAND_SET"); // find the command set in the em block
    let namedSetBlock = findBlockWithName(
        fhxdata,
        "ENUMERATION_SET",
        commandNamedSet
    ); // find the named set in overall fhx data
    let namedSet = new NamedSet(namedSetBlock);
    let emCommands = namedSet.entries
        .filter((entry) => entry.visible && entry.selectable)
        .map((entry) => {
            return new EMCommand(entry);
        });
    return new EMCommandsTable(emCommands);
}

/**
 * Represents an entry in a named set.
 * @class
 */
class NamedSetEntry {
    /**
     * Creates an instance of NamedSetEntry.
     * @param {string} entry - The block of data.
     */
    constructor(entry) {
        this.value = valueOfParameter(entry, "VALUE");
        this.name = valueOfParameter(entry, "NAME");
        this.selectable =
            valueOfParameter(entry, "SELECTABLE") === "F" ? false : true;
        this.visible =
            valueOfParameter(entry, "VISIBLE") === "F" ? false : true;
    }
}

/**
 * Represents a named set.
 * @class
 */
class NamedSet {
    /**
     * Creates an instance of NamedSet.
     * @param {Object} block - The block of data.
     */
    constructor(block) {
        this.block = block;
        this.name = valueOfParameter(block, "NAME");
        this.description = valueOfParameter(block, "DESCRIPTION");
        this.defaultValue = valueOfParameter(block, "DEFAULT_VALUE");
        this.entries = findBlocks(block, "ENTRY").map(
            (block) => new NamedSetEntry(block)
        );
    }
}

/**
 * Represents an EM command.
 * @class
 */
class EMCommand {
    /**
     * Creates an instance of EMCommand.
     * @param {NamedSetEntry} namedSetEntry - The named set entry.
     */
    constructor(namedSetEntry) {
        this.state = namedSetEntry.name;
        this.value = namedSetEntry.value;
        this.userSelectable = namedSetEntry.selectable;
        this.visible = namedSetEntry.visible;
        this.commandName = this._getCommandName();
    }

    /**
     * Generates the command name.
     * @returns {string} - The command name.
     */
    _getCommandName() {
        // Example Command name: COMMAND_00000
        let padding = 5 - this.value.toString().length;
        return "COMMAND_00" + "0".repeat(padding) + this.value;
    }

    /**
     * Converts the command to a string representation.
     * @returns {string} - The string representation of the command.
     */
    toString() {
        `${this.name}, | ${this.moduleclass}, | ${this.ownership}`;
    }
}

/**
 * Represents a table of EM commands.
 * @class
 * @extends DSTable
 */
class EMCommandsTable extends DSTable {
    /**
     * Creates an instance of EMCommandsTable.
     * @param {EMCommand[]} emCommands - The list of EM commands.
     */
    constructor(emCommands) {
        super(
            "EM Commands",
            ["Name", "State", "Value", "Visible", "User Selectable"],
            emCommands
        );
    }

    /**
     * Converts the table to a CSV string.
     * @returns {string} - The CSV string representation of the table.
     */
    toCsvString() {
        // convert the table object to a csv string ready to be written to a csv file
        let csv = "";
        if (this.tableHeader) csv += this.tableHeader.join(",") + "\n";

        for (let {
            state,
            value,
            userSelectable,
            visible,
            commandName,
        } of this.data.sort((a, b) =>
            a.commandName.localeCompare(b.commandName)
        )) {
            visible = visible ? "Yes" : "No";
            userSelectable = userSelectable ? "Yes" : "No";
            let row = [commandName, state, value, visible, userSelectable];
            csv += row.join(",") + "\n";
        }
        return csv;
    }
}

export { getEMCommands };
