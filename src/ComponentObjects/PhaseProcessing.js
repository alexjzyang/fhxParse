/*
    PhaseProecssor.js handles the processing of the Fhx input of a Phase.
    
    The current design therefore assumes that the Fhx input only contains 
    a single BATCH_EQUIPMENT_PHASE_CLASS block. This block contains all the code
    relevant to one single Phase.
*/
import FhxUtil from "../util/FhxUtil.js";

// function SFCSteps(sfcFhx) {
//     let steps = fhxutil.findBlocks(sfcFhx, "STEP");
//     /*
//       Structure of Steps:
//       Description
//       List of ACTIONS
//     */
//     let stepValues = steps.map((step) => {
//         let getValue = (key) => fhxutil.valueOfParameter(step, key);
//         let values = {
//             name: getValue("NAME"),
//             description: getValue("DESCRIPTION"),
//             actions: SFCActions(step),
//         };
//         return values;
//     });
//     return stepValues;
// }

// function SFCTransitions(sfcFhx) {
//     let transitionBlocks = fhxutil.findBlocks(sfcFhx, "TRANSITION");
//     /*
//       Structure of Transitions:
//       Transition Header
//       transition: [
//       { id: "name", title: "NAME" },
//       { id: "description", title: "DESCRIPTION" },
//       { id: "position", title: "POSITION" },
//       { id: "termination", title: "TERMINATION" },
//       { id: "expression", title: "EXPRESSION" },
//       ],
//      */
//     let transitionValues = transitionBlocks.map((block) => {
//         let transitionValue = (key) => fhxutil.valueOfParameter(block, key);
//         let values = {
//             name: transitionValue("NAME"),
//             description: transitionValue("DESCRIPTION"),
//             position: transitionValue("POSITION"),
//             termination: transitionValue("TERMINATION"),
//             expression: transitionValue("EXPRESSION"),
//         };
//         return values;
//     });
//     return transitionValues;
// }

// function SFCActions(stepFhx) {
//     let actionBlocks = fhxutil.findBlocks(stepFhx, "ACTION");
//     /*
//         Structure of Actions:
//         Action Header
//         action: [
//         { id: "name", title: "NAME" },
//         { id: "description", title: "DESCRIPTION" },
//         { id: "actionType", title: "ACTION_TYPE" },
//         { id: "qualifier", title: "QUALIFIER" },
//         { id: "expression", title: "EXPRESSION" },
//         { id: "confirmExpression", title: "CONFIRM_EXPRESSION" },
//         { id: "confirmTimeOut", title: "CONFIRM_TIME_OUT" },
//         { id: "delayedExpression", title: "DELAY_EXPRESSION" },
//         { id: "delayTime", title: "DELAY_TIME" },
//         ]
//     */
//     let actionValues = actionBlocks.map((block) => {
//         let getValue = (key) => fhxutil.valueOfParameter(block, key);
//         let values = {
//             name: getValue("NAME"),
//             description: getValue("DESCRIPTION"),
//             actionType: getValue("ACTION_TYPE"),
//             qualifier: getValue("QUALIFIER"),
//             expression: getValue("EXPRESSION"),
//             confirmExpression: getValue("CONFIRM_EXPRESSION"),
//             confirmTimeOut: getValue("CONFIRM_TIME_OUT"),
//             delayedExpression: getValue("DELAY_EXPRESSION"),
//             delayTime: getValue("DELAY_TIME"),
//         };
//         return values;
//     });

//     return actionValues;
// }

// function processSFC(sfcFhx) {
//     let steps = SFCSteps(sfcFhx);
//     let transitions = SFCTransitions(sfcFhx);
//     return { steps, transitions };
// }

export class PhaseLogic {
    constructor(inputFhx, phaseName) {
        this.inputFhx = inputFhx;
        this.phaseFhx = FhxUtil.findBlockWithName(
            inputFhx,
            "BATCH_EQUIPMENT_PHASE_CLASS",
            phaseName,
        );
        this.phaseName = phaseName;
    }

    sfcFunctionBlocks(phaseFhx, sfcName) {
        return FhxUtil.findBlockWithName(phaseFhx, "FUNCTION_BLOCK", sfcName);
    }
    sfcDefinitions(sfcFunctionBlock) {
        return FhxUtil.valueOfParameter(sfcFunctionBlock, "DEFINITION");
    }

    sfcFhx(inputFhx, sfcDefinition) {
        return FhxUtil.findBlockWithName(
            inputFhx,
            "FUNCTION_BLOCK_DEFINITION",
            sfcDefinition,
        );
    }
    get run_logic() {
        const runLogicFunctionBlock = this.sfcFunctionBlocks(
            this.phaseFhx,
            "RUN_LOGIC",
        );
        const runLogicDefinition = this.sfcDefinitions(runLogicFunctionBlock);
        return this.sfcFhx(this.inputFhx, runLogicDefinition);
    }
    get abort_logic() {
        const abortLogicFunctionBlock = this.sfcFunctionBlocks(
            this.phaseFhx,
            "ABORT_LOGIC",
        );
        const abortLogicDefinition = this.sfcDefinitions(
            abortLogicFunctionBlock,
        );
        return this.sfcFhx(this.inputFhx, abortLogicDefinition);
    }
    get hold_logic() {
        const holdLogicFunctionBlock = this.sfcFunctionBlocks(
            this.phaseFhx,
            "HOLD_LOGIC",
        );
        const holdLogicDefinition = this.sfcDefinitions(holdLogicFunctionBlock);
        return this.sfcFhx(this.inputFhx, holdLogicDefinition);
    }
    get restart_logic() {
        const restartLogicFunctionBlock = this.sfcFunctionBlocks(
            this.phaseFhx,
            "RESTART_LOGIC",
        );
        const restartLogicDefinition = this.sfcDefinitions(
            restartLogicFunctionBlock,
        );
        return this.sfcFhx(this.inputFhx, restartLogicDefinition);
    }
    get stop_logic() {
        const stopLogicFunctionBlock = this.sfcFunctionBlocks(
            this.phaseFhx,
            "STOP_LOGIC",
        );
        const stopLogicDefinition = this.sfcDefinitions(stopLogicFunctionBlock);
        return this.sfcFhx(this.inputFhx, stopLogicDefinition);
    }
}
