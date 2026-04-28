/**
 * Handling different cases of disassembling fhx blocks
 * - Unique blocks (Top level or embedded)
 * - Top level blocks with multiple instances (e.g. BATCH_RECIPE_FORMULA)
 * - Embedded blocks with multiple instances (e.g. ATTRIBUTE_INSTSANCES)
 *      These can be found in the root block level, for example the attribute instances of formula parameter values
 *      They can also be found in the PFC_ALGORITHM block, for example the attribute instances of the STEPS
 *      They need to be handled separately based on their location in the fhx string / indention level
 */

import FhxUtil from "../../src/util/FhxUtil";

/**
 * Signature
 * Class: FhxObject
 * Methods:
 * - addUniqueBlock: adds a unique block
 * - addRecurringBlock: adds a block type that has multiple instances
 * - addEmbeddedBlock: adds a block that represents an array of elements in the block
 * - processFhx: consumes the fhxobject and create a new object. The new object contains an array of block types
 * - .reminder: gives fhx text after extracting the block
 * -
 */

class FhxObject {
    constructor(fhx) {
        this.fhx = fhx;
        this.uniqueBlocks = [];
        this.recurringBlocks = [];
        this.embeddedBlocks = [];
        this.remainer = fhx;
    }
    addUniqueBlock(blockType) {
        this.uniqueBlocks.push(blockType);
    }
    addRecurringBlock(blockType) {
        this.recurringBlocks.push(blockType);
    }
    addEmbeddedBlock(blockType) {
        this.embeddedBlocks.push(blockType);
    }

    obtainBlocks(type) {
        return FhxUtil.findBlocks(this.fhx, type);
    }

    processFhx() {
        let blocks = [];
        this.uniqueBlocks.forEach((blockType) => {
            let block = this.obtainBlocks(blockType)[0];
            blocks.push(block);
            this.remainer = this.remainer.replace(block, "");
        });
        this.recurringBlocks.forEach((blockType) => {
            blockType.forEach(() => {});

            let blockInstances = this.obtainBlocks(blockType);
            blocks.push(...blockInstances);
            blockInstances.forEach((block) => {
                this.remainer = this.remainer.replace(block, "");
            });
        });
        return blocks;
    }
}
