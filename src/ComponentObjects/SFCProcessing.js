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
    return { steps, transitions };
}

export {
    processSFC,
    //  SFCActions,
    //  SFCTransitions,
    //  SFCSteps
};
