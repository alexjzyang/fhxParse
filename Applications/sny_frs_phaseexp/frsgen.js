import { processSFC } from "../../src/SFCProessing.js";
import FhxUtil from "../../src/util/FhxUtil.js";

/**
 * This file is dedicated to the generation of the Sanofi FRS drafting process
 * It outputs Step and action expressions in markdown format.
 * The functions that identifies phase class and the phase logic are agnostic
 * and can be reused in other applications.
 */

/**
 *
 * @param {string} fhx compile the phase logic to a markdown file of a specific
 * layout to aid the FRS drafting process
 * @returns
 */
export function sfc_steps_to_md(fhx) {
    // const steps = sfc_steps(fhx);
    const { steps } = processSFC(fhx);
    let md = "";
    steps.forEach((step) => {
        md += `### ${step.name}, ${step.description}\n`;
        step.actions.forEach((action) => {
            md += `-   ${action.name}, ${action.description}\n`;
            md += "```js\n";
            md += `${action.expression}\n`;
            md += "```\n";
        });
    });
    return md;
}

/**
 *
 * @param {string} phaseFhx fhx block of a phase
 * @param {string} sfcName Run_LOGIC, HOLD_LOGIC etc
 * @returns {string} Definition block of the phase logic
 */
export function sfcDefinitionFromPhase(phaseFhx, sfcName = "RUN_LOGIC") {
    // sfcType should be RUN_LOGIC, HOLD_LOGIC etc

    const sfcFunctionBlock = FhxUtil.findBlockWithName(
        phaseFhx,
        "FUNCTION_BLOCK",
        sfcName
    );
    const definition = FhxUtil.valueOfParameter(sfcFunctionBlock, "DEFINITION");
    return definition;
}

/**
 *
 * @param {string} fhx which contains the phase class and the phase logic definition
 * @param {string} phaseName the name of the phase class to be extracted
 * @param {string} sfcName the phase logic to be extracted, e.g. RUN_LOGIC, HOLD_LOGIC etc
 * @returns {object} The SFC block corresponding to the provided phase and logic name
 */
export function findPhaseLogic(fhx, phaseName, sfcName) {
    const phasefhx = FhxUtil.findBlockWithName(
        fhx,
        "BATCH_EQUIPMENT_PHASE_CLASS",
        phaseName
    );
    const sfcDefinition = sfcDefinitionFromPhase(phasefhx, sfcName);
    const sfcBlock = FhxUtil.findBlockWithName(
        fhx,
        "FUNCTION_BLOCK_DEFINITION",
        sfcDefinition
    );
    return sfcBlock;
}

/**
 * This function is specific to this application. The purpose is to convert the
 * SFC logic to a markdown format specific to aiding the FRS drafting process.
 * @param {string} fhx fhx block of the phase class
 * @param {string} phaseName the name of the phase class to be extracted
 * @param {string} sfcName the phase logic to be extracted, e.g. RUN_LOGIC, HOLD_LOGIC etc
 * @returns {object} The markdown representation of the SFC logic
 */
export function sfcToMd(fhx, phaseName, sfcName) {
    let sfcFhx = findPhaseLogic(fhx, phaseName, sfcName);
    let mdText = sfc_steps_to_md(sfcFhx);
    return mdText;
}
