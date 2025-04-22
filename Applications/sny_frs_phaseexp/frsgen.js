import { processSFC } from "../../src/SFCProessing.js";
import FhxUtil from "../../src/util/FhxUtil.js";

/**
    output format to md file:
 
    ### Step 0010, description
        -   Action 010, description
        ````
        Code
        ````
 */

/**
 * Data structure:
 * steps = [{name, description, actions: [{name, description, expression}]}]
 *
 * sfc_steps(fhx) is replaced by processSFC(fhx) from the fhxparse library
 */

// function sfc_steps(fhx) {
//     const steps = FhxUtil.findBlocks(fhx, "STEP");
//     let stepsObj = [];
//     steps.forEach((step) => {
//         const stepName = FhxUtil.valueOfParameter(step, "NAME");
//         const stepDescription = FhxUtil.valueOfParameter(step, "DESCRIPTION");
//         const actions = FhxUtil.findBlocks(step, "ACTION");
//         let actionObj = [];
//         actions.forEach((action) => {
//             const actionName = FhxUtil.valueOfParameter(action, "NAME");
//             const actionDescription =
//                 FhxUtil.valueOfParameter(action, "DESCRIPTION") || "";
//             const actionExpression = FhxUtil.valueOfParameter(
//                 action,
//                 "EXPRESSION"
//             );
//             actionObj.push({
//                 name: actionName,
//                 description: actionDescription,
//                 expression: actionExpression,
//             });
//         });
//         stepsObj.push({
//             name: stepName,
//             description: stepDescription || "",
//             actions: actionObj,
//         });
//     });
//     return stepsObj;
// }

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

// FUNCTION_BLOCK NAME="RUN_LOGIC" DEFINITION="__67DEF874_7069CB3B__"

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

export function sfcToMd(fhx, phaseName, sfcName) {
    let sfcFhx = findPhaseLogic(fhx, phaseName, sfcName);
    let mdText = sfc_steps_to_md(sfcFhx);
    return mdText;
}
