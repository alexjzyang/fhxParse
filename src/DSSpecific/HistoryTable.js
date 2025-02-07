/**
 * History collection fhx data looks like this:
 * It is a list of ATTRIBUTE_INSTANCE blocks with HISTORY_DATA_POINT blocks.
 * 
 * ATTRIBUTE_INSTANCE NAME="PV"
 * {
 *   VALUE { REF="AI1/OUT" }
 *   HISTORY_DATA_POINT FIELD="CV"
 *   {
 *     DATA_CHARACTERISTIC=CONTINUOUS
 *     ENABLED=T
 *     SAMPLE_PERIOD_SECONDS=2
 *     COMPRESSION_ENABLED=T
 *     RECORD_AT_LEAST_EVERY_MINUTES=240
 *     DEVIATION_LIMIT_FOR_COMPRESSION=0.01
 *     DATA_REPRESENTATION=AUTOMATIC
 *     EXPOSED=F
 *     ENTERPRISE_COLLECTION=F
 *   }
  }
 */
import {
  findBlocks,
  findBlockWithName,
  valueOfParameter,
} from "../v1/_FhxProcessor.js";
import { DSTable } from "./Common.js";

/**
 * Retrieves historised parameters for a given module name.
 * @param {string} moduleBlock - The fhx string of a single MODULE_CLASS block
 * @returns {HistoryCollectionTable} - The table of historised parameters.
 */
function getHistoryCollection(moduleBlock) {
  let historizedParameterBlocks = findBlocks(
    // find all parameters which are historized
    moduleBlock,
    "ATTRIBUTE_INSTANCE"
  ).filter((attribute) => attribute.includes("HISTORY_DATA_POINT"));

  let historyParameters = historizedParameterBlocks.map((block) => {
    // create a list of HistorisedParameter objects from those parameters
    return new HistorisedParameter(block);
  });

  return new HistoryCollectionTable(historyParameters);
}

/**
 * Represents a historised parameter.
 * @class
 */
class HistorisedParameter {
  /**
   * Stores DeltaV parameters' history collection data.
   * @param {Object} block - The attribute instance block of the parameter where historisation is enabled
   */
  constructor(block) {
    this.block = block;
    // all history collection parameters
    this.name = valueOfParameter(block, "NAME");
    this.field = valueOfParameter(block, "FIELD");
    this.dataCharacteristic = valueOfParameter(block, "DATA_CHARACTERISTIC");
    this.enabled = valueOfParameter(block, "ENABLED");
    this.samplePeriodSeconds = valueOfParameter(block, "SAMPLE_PERIOD_SECONDS");
    this.compressionEnabled = valueOfParameter(block, "COMPRESSION_ENABLED");
    this.recordAtLeastEveryMinutes = valueOfParameter(
      block,
      "RECORD_AT_LEAST_EVERY_MINUTES"
    );
    this.deviationLimitForCompression = valueOfParameter(
      block,
      "DEVIATION_LIMIT_FOR_COMPRESSION"
    );
    this.dataRepresentation = valueOfParameter(block, "DATA_REPRESENTATION");
    this.exposed = valueOfParameter(block, "EXPOSED");
    this.enterpriseCollection = valueOfParameter(
      block,
      "ENTERPRISE_COLLECTION"
    );
  }
  // toString() {}
}

/**
 * The history collection table should look like the following:
 * Value Recorded | Enabled | Display Representation | Data Characteristics | Sampling period | Compression | Deviation | At Least
 * PV.CV          | Yes     | Automatic              | Continuous           | 2               | Yes         | 0.001     | 240
 */

/**
 * Represents a table of historised parameters.
 * @class
 * @extends DSTable
 */
class HistoryCollectionTable extends DSTable {
  /**
   * Creates an instance of HistoryCollectionTable.
   * @param {Array<HistorisedParameter>} historyParameters - The list of historised parameters.
   */
  constructor(historyParameters) {
    super(
      // Instantiate the table with, table name, table header, and data
      "Historised Parameters",
      [
        "Value Recorded",
        "Enabled",
        "Display Representation",
        "Data Characteristics",
        "Sampling Period",
        "Compression",
        "Deviation",
        "At Least",
      ],
      historyParameters
    );
  }

  toCsvString() {
    // Convert the table data to a CSV string
    let csv = "";
    if (this.tableHeader) csv += this.tableHeader.join(",") + "\n";

    for (let {
      name,
      field,
      enabled,
      dataRepresentation,
      dataCharacteristic,
      samplePeriodSeconds,
      compressionEnabled,
      deviationLimitForCompression,
      recordAtLeastEveryMinutes,
    } of this.data.sort((a, b) => a.name.localeCompare(b.name))) {
      let row = [
        `${name}.${field}`,
        enabled === "T" ? "Yes" : "No",
        dataRepresentation,
        dataCharacteristic,
        samplePeriodSeconds,
        compressionEnabled === "T" ? "Yes" : "No",
        deviationLimitForCompression,
        recordAtLeastEveryMinutes,
      ];

      csv += row.join(",") + "\n";
    }
    return csv;
  }
}

export { getHistoryCollection };
