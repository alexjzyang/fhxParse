/*
    PhaseProecssor.js handles the processing of the Fhx input of a Phase.
    
    The current design therefore assumes that the Fhx input only contains 
    a single BATCH_EQUIPMENT_PHASE_CLASS block. This block contains all the code
    relevant to one single Phase.
*/
import FhxUtil from "../util/FhxUtil.js";
import { processSFC } from "./SFCProcessing.js";

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
        // Each phase object should contain the fhx of the phase for reference
        this.inputFhx = inputFhx;
        this.phaseFhx = FhxUtil.findBlockWithName(
            inputFhx,
            "BATCH_EQUIPMENT_PHASE_CLASS",
            phaseName,
        );

        // It should contain the identity of the phase (name of the phase, description, and
        // any other information to be implemented later)
        this.phaseName = phaseName;
        this.description = FhxUtil.valueOfParameter(
            this.phaseFhx,
            "DESCRIPTION",
        );
    }
    get name() {
        return this.phaseName;
    }
    get fhx() {
        return this.phaseFhx;
    }

    sfcFhx(sfcName) {
        // returns the functionblock which the name of the definition block of the sfc with sfcName (ex.RUN_LOGIC)
        const sfcFunctionBlock = FhxUtil.findBlockWithName(
            this.phaseFhx,
            "FUNCTION_BLOCK",
            sfcName,
        );
        const sfcDefinition = FhxUtil.valueOfParameter(
            sfcFunctionBlock,
            "DEFINITION",
        );

        const sfcFunctionBlockDefinition = FhxUtil.findBlockWithName(
            this.inputFhx,
            "FUNCTION_BLOCK_DEFINITION",
            sfcDefinition,
        );
        return sfcFunctionBlockDefinition;
    }
    // sfcDefinitions(sfcFunctionBlock) {
    //     return FhxUtil.valueOfParameter(sfcFunctionBlock, "DEFINITION");
    // }

    // sfcFhx(inputFhx, sfcDefinition) {
    //     return FhxUtil.findBlockWithName(
    //         inputFhx,
    //         "FUNCTION_BLOCK_DEFINITION",
    //         sfcDefinition,
    //     );
    // }

    // Each phase should contain SFC objects for each of its logics (run, hold, abort, restart, stop)

    sfcLogic(sfcName) {
        const fhx = this.sfcFhx(sfcName);
        return new SfcLogic(fhx, sfcName);
    }

    get run_logic() {
        return this.sfcLogic("RUN_LOGIC");
    }
    get abort_logic() {
        return this.sfcLogic("ABORT_LOGIC");
    }
    get hold_logic() {
        return this.sfcLogic("HOLD_LOGIC");
    }
    get restart_logic() {
        return this.sfcLogic("RESTART_LOGIC");
    }
    get stop_logic() {
        return this.sfcLogic("STOP_LOGIC");
    }
}

class SfcLogic {
    constructor(phaseFhx, sfcName) {
        // It should contain the fhx of the SFC for reference
        this.fhx = phaseFhx;
        // It should contain the name of the SFC
        this.name = sfcName;
    }

    // It should be able to output the SFCs in json and in txt format
    get json() {
        return processSFC(this.fhx);
    }
    toString() {
        return this.fhx;
    }

    // Each SFC object should contain json representation of the steps and transitions
    get steps() {
        return this.json.steps;
    }
    get transitions() {
        return this.json.transitions;
    }
    // It should contain the connections between steps and transitions
    get connections() {
        return this.json.connections;
    }
}
