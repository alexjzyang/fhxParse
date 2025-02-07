import { getModuleParameters } from "../../DSSpecific/ModuleParameterTable.js";
import {
    findBlocks,
    findBlockWithName,
    valueOfParameter,
} from "../../v1/_FhxProcessor.js";

export class SimpleModuleClass {
    // blocks should refer to top level blocks, such as function block definition,
    // module class, or function block template etc
    constructor(block) {
        this.block = block;
        this.name = valueOfParameter(block, "NAME");
        this.attributes = findBlocks(block, "ATTRIBUTE").map((comp) => {
            return {
                name: valueOfParameter(comp, "NAME"),
                type: valueOfParameter(comp, "TYPE"),
                fhx: comp,
            };
        });
        this.functionBlocks = findBlocks(block, "FUNCTION_BLOCK").map(
            (comp) => {
                return {
                    name: valueOfParameter(comp, "NAME"),
                    definition: valueOfParameter(comp, "DEFINITION"),
                    fhx: comp,
                };
            }
        );
        this.attributeInstances = findBlocks(block, "ATTRIBUTE_INSTANCE").map(
            (comp) => {
                return {
                    name: valueOfParameter(comp, "NAME"),
                    valueBlock: findBlocks(comp, "VALUE")[0],
                    fhx: comp,
                };
            }
        );
    }

    listFunctionBlocks() {
        return this.functionBlocks.map((fb) => fb.name);
    }

    findFunctionBlockDefinition(fhx, name) {
        return findBlockWithName(fhx, "FUNCTION_BLOCK_DEFINITION", name);
    }

    createParameterTable() {
        // The object should be able to return the csv string of its parameter table
        return getModuleParameters(this.block).toCsvString();
    }

    othertables() {}
}
