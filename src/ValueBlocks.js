import { valueOfParameter } from "./util/FhxUtil";

/* These are encapsulated value block information, not all the information is 
reference for the DSTable generation. For instance, for a complex parameter,
depending on the designed table, the desired use case might only the name and 
the type of the parameter.
*/

class ValueBlock {
    constructor(fhxString) {
        this.fhx = fhxString;
    }

    // this is a helper to evaluate fhx coverage
    missingParameters() {}
    processingParameters() {}
}
class AlarmBlock extends ValueBlock {
    /*
VALUE
{
    PRIORITY_NAME="ALERT"
    ENAB=F
    INV=F
    ATYP="_A_M_ HM/SM Bypass"
    MONATTR=""
    ALMATTR="MONITOR/BYPASS"
    LIMATTR=""
    PARAM1=""
    PARAM2=""
    SUPPTIMEOUT=480
    MASK=65535
    ISDEFAULTMASK=T
    ALARM_FUNCTIONAL_CLASSIFICATION=0
}
*/
    constructor(fhxString) {
        super(fhxString);
        this.priorityName = valueOfParameter(fhxString, "PRIORITY_NAME");
        this.enab = valueOfParameter(fhxString, "ENAB");
        this.inv = valueOfParameter(fhxString, "INV");
        this.atyp = valueOfParameter(fhxString, "ATYP");
        this.monattr = valueOfParameter(fhxString, "MONATTR");
        this.almattr = valueOfParameter(fhxString, "ALMATTR");
        this.limattr = valueOfParameter(fhxString, "LIMATTR");
        this.param1 = valueOfParameter(fhxString, "PARAM1");
        this.param2 = valueOfParameter(fhxString, "PARAM2");
        this.supptimeout = valueOfParameter(fhxString, "SUPPTIMEOUT");
        this.mask = valueOfParameter(fhxString, "MASK");
        this.isdefaultmask = valueOfParameter(fhxString, "ISDEFAULTMASK");
        this.alarmFunctionalClassification = valueOfParameter(
            fhxString,
            "ALARM_FUNCTIONAL_CLASSIFICATION"
        );
    }
}
class NamedSetBlock extends ValueBlock {
    /*
// NamedSet value
VALUE
{
    SET="_N_M_CANCEL_WAIT"
    STRING_VALUE="Reset"
    CHANGEABLE=F
}
*/
    constructor(fhxString) {
        super(fhxString);
        this.set = valueOfParameter(fhxString, "SET");
        this.stringValue = valueOfParameter(fhxString, "STRING_VALUE");
        this.changeable = valueOfParameter(fhxString, "CHANGEABLE");
    }
}

class IntegerBlock extends ValueBlock {
    /*
    // Number
    VALUE { CV=0 }
*/
    constructor(fhxString) {
        super(fhxString);
        this.cv = valueOfParameter(fhxString, "CV");
    }
}
class StringBlock extends ValueBlock {
    /*
    // String
    VALUE { CV="Agitator 1 Speed Setpoint (%) " }

    */
    constructor(fhxString) {
        super(fhxString);
        this.cv = valueOfParameter(fhxString, "CV");
    }
}
class ModeBlock extends ValueBlock {
    /*
// Modes
VALUE
{
    OOS_P=F
    IMAN_P=F
    LOV_P=F
    MAN_P=F
    AUTO_P=T
    CAS_P=T
    RCAS_P=F
    ROUT_P=F
    OOS_A=T
    IMAN_A=T
    LOV_A=T
    MAN_A=T
    AUTO_A=T
    CAS_A=T
    RCAS_A=T
    ROUT_A=T
    TARGET=AUTO
    NORMAL=AUTO
}
    */
    constructor(fhxString) {
        super(fhxString);
        this.oosP = valueOfParameter(fhxString, "OOS_P");
        this.imanP = valueOfParameter(fhxString, "IMAN_P");
        this.lovP = valueOfParameter(fhxString, "LOV_P");
        this.manP = valueOfParameter(fhxString, "MAN_P");
        this.autoP = valueOfParameter(fhxString, "AUTO_P");
        this.casP = valueOfParameter(fhxString, "CAS_P");
        this.rcasP = valueOfParameter(fhxString, "RCAS_P");
        this.routP = valueOfParameter(fhxString, "ROUT_P");
        this.oosA = valueOfParameter(fhxString, "OOS_A");
        this.imanA = valueOfParameter(fhxString, "IMAN_A");
        this.lovA = valueOfParameter(fhxString, "LOV_A");
        this.manA = valueOfParameter;
        this.autoA = valueOfParameter(fhxString, "AUTO_A");
        this.casA = valueOfParameter(fhxString, "CAS_A");
        this.rcasA = valueOfParameter(fhxString, "RCAS_A");
        this.routA = valueOfParameter(fhxString, "ROUT_A");
        this.target = valueOfParameter(fhxString, "TARGET");
        this.normal = valueOfParameter(fhxString, "NORMAL");
    }
}
class ReferenceBlock extends ValueBlock {
    /*
    // Reference values
    VALUE { REF="EM_AGIT2_DIR" }
    */
    constructor(fhxString) {
        super(fhxString);
        this.ref = valueOfParameter(fhxString, "REF");
    }
}
class ParamWithStatusBlock extends ValueBlock {
    /*
    // Paramater with status
    VALUE { CV=1 ST= { SQ=GOODNONCASCADE GPSS=NONSPECIFIC LS=NOTLIMITED } }
    */
    constructor(fhxString) {
        super(fhxString);
        this.cv = valueOfParameter(fhxString, "CV");
        this.st = valueOfParameter(fhxString, "ST");
        this.sq = valueOfParameter(fhxString, "SQ");
        this.gpss = valueOfParameter(fhxString, "GPSS");
        this.ls = valueOfParameter(fhxString, "LS");
    }
}
class expressionBlock extends ValueBlock {
    /*
    T Expression partial block sample
    // T Expressions
    VALUE { TYPE=ACTION EXPRESSION="(*
    =====================================================================================
    Sets the OVR_ENAB and HOLD_REQ based on operator request
    =====================================================================================
    *)" }
    */
    constructor(fhxString) {
        super(fhxString);
        this.type = valueOfParameter(fhxString, "TYPE");
        this.expression = valueOfParameter(fhxString, "EXPRESSION");
    }
}
