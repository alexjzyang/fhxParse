/*
    SFCProecssor.js handles the processing of the SFC data from the FHX file.
    The logic in this file is duplicated into Phase Logic Processing to enlarge the 
scope in order to process an entire phase.

*/
import fhxutil from "../util/FhxUtil.js";

function SFCSteps(sfcFhx) {
    let steps = fhxutil.findBlocks(sfcFhx, "STEP");
    /*
      Structure of Steps:
      Description
      List of ACTIONS
    */
    let stepValues = steps.map((step) => {
        let getValue = (key) => fhxutil.valueOfParameter(step, key);
        let values = {
            name: getValue("NAME"),
            description: getValue("DESCRIPTION"),
            actions: SFCActions(step),
        };
        return values;
    });
    return stepValues;
}

function SFCTransitions(sfcFhx) {
    let transitionBlocks = fhxutil.findBlocks(sfcFhx, "TRANSITION");
    /*
      Structure of Transitions:
      Transition Header
      transition: [
      { id: "name", title: "NAME" },
      { id: "description", title: "DESCRIPTION" },
      { id: "position", title: "POSITION" },
      { id: "termination", title: "TERMINATION" },
      { id: "expression", title: "EXPRESSION" },
      ],
     */
    let transitionValues = transitionBlocks.map((block) => {
        let transitionValue = (key) => fhxutil.valueOfParameter(block, key);
        let values = {
            name: transitionValue("NAME"),
            description: transitionValue("DESCRIPTION"),
            position: transitionValue("POSITION"),
            termination: transitionValue("TERMINATION"),
            expression: transitionValue("EXPRESSION"),
        };
        return values;
    });
    return transitionValues;
}

function SFCActions(stepFhx) {
    let actionBlocks = fhxutil.findBlocks(stepFhx, "ACTION");
    /*
        Structure of Actions:
        Action Header
        action: [
        { id: "name", title: "NAME" },
        { id: "description", title: "DESCRIPTION" },
        { id: "actionType", title: "ACTION_TYPE" },
        { id: "qualifier", title: "QUALIFIER" },
        { id: "expression", title: "EXPRESSION" },
        { id: "confirmExpression", title: "CONFIRM_EXPRESSION" },
        { id: "confirmTimeOut", title: "CONFIRM_TIME_OUT" },
        { id: "delayedExpression", title: "DELAY_EXPRESSION" },
        { id: "delayTime", title: "DELAY_TIME" },
        ]
    */
    let actionValues = actionBlocks.map((block) => {
        let getValue = (key) => fhxutil.valueOfParameter(block, key);
        let values = {
            name: getValue("NAME"),
            description: getValue("DESCRIPTION"),
            actionType: getValue("ACTION_TYPE"),
            qualifier: getValue("QUALIFIER"),
            expression: getValue("EXPRESSION"),
            confirmExpression: getValue("CONFIRM_EXPRESSION"),
            confirmTimeOut: getValue("CONFIRM_TIME_OUT"),
            delayedExpression: getValue("DELAY_EXPRESSION"),
            delayTime: getValue("DELAY_TIME"),
        };
        return values;
    });

    return actionValues;
}

function processSFC(sfcFhx) {
    let steps = SFCSteps(sfcFhx);
    let transitions = SFCTransitions(sfcFhx);
    let connections = SFCConnections(sfcFhx);
    return { steps, transitions, connections };
}

/**
    INITIAL_STEP="H0000"
    -----------------
    STEP_TRANSITION_CONNECTION STEP="H0000" TRANSITION="T0010" { }
    STEP_TRANSITION_CONNECTION STEP="H0010" TRANSITION="T0020" { }
    STEP_TRANSITION_CONNECTION STEP="H0020" TRANSITION="T0030" { }
    STEP_TRANSITION_CONNECTION STEP="H0030" TRANSITION="T9900" { }
    STEP_TRANSITION_CONNECTION STEP="H9900" TRANSITION="HOLD_END" { }
    TRANSITION_STEP_CONNECTION TRANSITION="T0010" STEP="H0010" { }
    TRANSITION_STEP_CONNECTION TRANSITION="T0020" STEP="H0020" { }
    TRANSITION_STEP_CONNECTION TRANSITION="T0030" STEP="H0030" { }
    TRANSITION_STEP_CONNECTION TRANSITION="T9900" STEP="H9900" { }
 */

/**
 * SFC Connections should create connectors between steps and transitions
 * For each transition, other than the final transition, there should be a
 * source step from which the transition originates and a target step to which
 * the transition leads.
 */

function SFCConnections(sfcFhx) {
    let connectors = [];
    const stepToTransitionBlocks = fhxutil.findBlocks(
        sfcFhx,
        "STEP_TRANSITION_CONNECTION",
    );
    const transitionToStepBlocks = fhxutil.findBlocks(
        sfcFhx,
        "TRANSITION_STEP_CONNECTION",
    );

    const initialStep = fhxutil.valueOfParameter(sfcFhx, "INITIAL_STEP");

    // Find all step transition connections and transition steps connections lines (blocks):

    // Identify all the transitions and their target steps from TRANSITION_STEP_CONNECTION blocks
    let transitions = new Map();
    transitionToStepBlocks.forEach((block) => {
        let transitionName = fhxutil.valueOfParameter(block, "TRANSITION");
        let targetStep = fhxutil.valueOfParameter(block, "STEP");
        if (transitions.has(transitionName)) {
            transitions.get(transitionName).targetSteps.push(targetStep);
        } else {
            transitions.set(transitionName, {
                targetSteps: [targetStep],
                sourceSteps: [],
            });
        }
        transitions.set(transitionName, { isFinalTransition: false });
    });

    // Go through each STEP_TRANSITION_CONNECTION block to identify source steps for each transition
    stepToTransitionBlocks.forEach((block) => {
        let sourceStep = fhxutil.valueOfParameter(block, "STEP");
        let transitionName = fhxutil.valueOfParameter(block, "TRANSITION");

        let transition = transitions.get(transitionName);
        if (transition) {
            transition.sourceSteps.push(sourceStep);
        } else {
            // While doing so, if a transition found in STEP_TRANSITION_CONNECTION does not have an associated
            // transition object, then it is the final step.

            transitions.set(transitionName, {
                targetSteps: [],
                sourceSteps: [sourceStep],
                isFinalTransition: true,
            });
        }
    });

    // transitions can have multiple sources and targets
    Array.from(transitions.entries()).forEach(([transitionName, conn]) => {
        let { sourceSteps, targetSteps, isFinalTransition } = conn;
        sourceSteps.forEach((sourceStep) => {
            if (isFinalTransition) {
                connectors.push({
                    source: sourceStep,
                    target: null,
                    name: transitionName,
                });
            } else {
                targetSteps.forEach((targetStep) => {
                    connectors.push({
                        source: sourceStep,
                        target: targetStep,
                        name: transitionName,
                    });
                });
            }
        });
    });

    return connectors;
}

export {
    processSFC,
    //  SFCActions,
    //  SFCTransitions,
    //  SFCSteps
};
