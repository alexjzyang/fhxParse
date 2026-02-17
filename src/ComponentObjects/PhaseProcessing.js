/*
    PhaseProecssor.js handles the processing of the Fhx input of a Phase.
    
    The current design therefore assumes that the Fhx input only contains 
    a single BATCH_EQUIPMENT_PHASE_CLASS block. This block contains all the code
    relevant to one single Phase.
*/
import FhxUtil from "../util/FhxUtil.js";
import { SfcLogic } from "./SFCProcessing.js";

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
    // convenient helper that returns the SFC logic that finds the definition of a specific SFC in a phase
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

    // convenient helper that returns the SFC logic object given the name of the requested SFC logic (e.g. RUN_LOGIC, ABORT_LOGIC, etc.)
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
