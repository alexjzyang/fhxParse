/*
SFCProecssor.js handles the processing of the SFC data from the FHX file.

*/
import * as fhxutil from "./util/FhxUtil.js";

function SFCSteps(emFhxData) {
  let steps = fhxutil.findBlocks(emFhxData, "STEP");
  /*
      Structure of Steps:
      Description
      List of ACTIONS
    */
  let stepValues = steps.map((step) => {
    let getValue = (key) => valueOfParameter(step, key);
    let values = {
      name: getValue("NAME"),
      description: getValue("DESCRIPTION"),
      actions: SFCActions(step),
    };
    return values;
  });
  return stepValues;
}

function SFCTransitions(cmdFhxData) {
  let transitionBlocks = fhxutil.findBlocks(cmdFhxData, "TRANSITION");
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
    let transitionValue = (key) => valueOfParameter(block, key);
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

function SFCActions(stepFhxData) {
  let actionBlocks = fhxutil.findBlocks(stepFhxData, "ACTION");
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
    let getValue = (key) => valueOfParameter(block, key);
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

function processSFC(cmdfhx) {
  let steps = SFCSteps(cmdfhx);
  let transitions = SFCTransitions(cmdfhx);
  return { steps, transitions };
}

export { processSFC, SFCActions, SFCTransitions, SFCSteps };
