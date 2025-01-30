/**
 * Historised parameters are parameters with HISTORY_DATA_POINT
 * block in their ATTRIBUTE_INSTANCE blocks.
 *
 */

import {
  findBlocks,
  findBlockWithName,
  valueOfParameter,
} from "../v1/_FhxProcessor.js";
import { DSTable } from "./Common.js";

function getHistoryCollection(fhxdata, modulename) {
  let module_fhxdata = findBlockWithName(fhxdata, "MODULE_CLASS", modulename);

  let historizedParameterBlocks = findBlocks(
    module_fhxdata,
    "ATTRIBUTE_INSTANCE"
  ).filter((attribute) => attribute.includes("HISTORY_DATA_POINT"));

  let historyParameters = historizedParameterBlocks.map((block) => {
    return new HistorisedParameter(block);
  });

  return new HistoryCollectionTable(historyParameters);
}
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
class HistorisedParameter {
  constructor(block) {
    this.block = block;
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

class HistoryCollectionTable extends DSTable {
  constructor(historyParameters) {
    super(
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
