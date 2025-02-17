import {
  findBlocks,
  findBlockWithName,
  valueOfParameter,
} from "../util/FhxUtil.js";
import { DSTable } from "./Common.js";

// Design Consideration: EM Child Devices
// Find module block of the EM (EM's fhx)
// Look for MODULE_BLOCK of the EM's fhx these are embedded modules of the EM

/**
 *
 * @param {string} moduleBlock - The fhx string of a single MODULE_CLASS block
 * @returns {EMChildDeviceTable} - The table of EM child devices.
 */
function getEMChildDevices(moduleBlock) {
  let moduleBlocks = findBlocks(moduleBlock, "MODULE_BLOCK"); // find all module blocks in the module class block

  let childDevices = moduleBlocks.map((mb) => {
    let name = valueOfParameter(mb, "NAME");
    let moduleclass = valueOfParameter(mb, "MODULE");
    let ownership = valueOfParameter(mb, "OWNERSHIP");
    return new EMChildDevice(name, moduleclass, ownership);
  });
  return new EMChildDeviceTable(childDevices);
}

/**
 * Represents a child device of an EM.
 * @class
 */
class EMChildDevice {
  /**
   * @param {string} name - The name of the function block.
   * @param {string} definition - The definition of the function block.
   */
  constructor(name, moduleclass, ownership) {
    this.name = name;
    this.moduleclass = moduleclass;
    this.ownership = ownership;
  }

  toString() {
    `${this.name}, | ${this.moduleclass}, | ${this.ownership}`;
  }
}

class EMChildDeviceTable extends DSTable {
  constructor(childDevices) {
    super("Child Devices", ["Name", "Module Class", "Ownership"], childDevices);
  }
  toCsvString() {
    // convert the table object to a csv string ready to be written to a csv file
    let csv = "";
    if (this.tableHeader) csv += this.tableHeader.join(",") + "\n";

    for (let { name, moduleclass, ownership } of this.data.sort((a, b) =>
      a.name.localeCompare(b.name)
    )) {
      ownership = ownership === "OWNED" ? "Private" : "Shared";
      let row = [name, moduleclass, ownership];
      csv += row.join(",") + "\n";
    }
    return csv;
  }
}

export { getEMChildDevices };
