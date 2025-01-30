/**
 * Represents a design specification table.
 * @class
 */
class DSTable {
  constructor(tableName, tableHeader, data) {
    this.tableName = tableName;
    this.tableHeader = tableHeader;
    this.data = data;
  }
  toString() {
    let tableString = `${this.tableName}\n`;
    if (this.tableHeader) {
      tableString += `${this.tableHeader.join(" | ")}\n`;
    }
    for (const row of this.data) {
      tableString += `${row.toString()}\n`;
    }
    return tableString;
  }
}

export { DSTable };
