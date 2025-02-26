/* These are encapsulated value block information, not all the information is 
reference for the DSTable generation. For instance, for a complex parameter,
depending on the designed table, the desired use case might only the name and 
the type of the parameter.
*/

import { valueOfParameter } from "./util/FhxUtil.js";

class FhxValue {
    constructor(fhxString) {
        this.fhx = fhxString;
    }
}
class AlarmValue extends FhxValue {
    constructor(fhxString) {
        super(fhxString);
        this.elements = {
            PRIORITY_NAME: valueOfParameter(fhxString, "PRIORITY_NAME"),
            ENAB: valueOfParameter(fhxString, "ENAB"),
            INV: valueOfParameter(fhxString, "INV"),
            ATYP: valueOfParameter(fhxString, "ATYP"),
            MONATTR: valueOfParameter(fhxString, "MONATTR"),
            ALMATTR: valueOfParameter(fhxString, "ALMATTR"),
            LIMATTR: valueOfParameter(fhxString, "LIMATTR"),
            PARAM1: valueOfParameter(fhxString, "PARAM1"),
            PARAM2: valueOfParameter(fhxString, "PARAM2"),
            SUPPTIMEOUT: valueOfParameter(fhxString, "SUPPTIMEOUT"),
            MASK: valueOfParameter(fhxString, "MASK"),
            ISDEFAULTMASK: valueOfParameter(fhxString, "ISDEFAULTMASK"),
            ALARM_FUNCTIONAL_CLASSIFICATION: valueOfParameter(
                fhxString,
                "ALARM_FUNCTIONAL_CLASSIFICATION"
            ),
        };
    }
    get priority() {
        return this.elements.PRIORITY_NAME;
    }
    get enable() {
        return this.elements.ENAB;
    }
    get inverted() {
        return this.elements.INV;
    }
    get atyp() {
        return this.elements.ATYP;
    }
    get monattr() {
        return this.elements.MONATTR;
    }
    get almattr() {
        return this.elements.ALMATTR;
    }
    get limattr() {
        return this.elements.LIMATTR;
    }
    get param1() {
        return this.elements.PARAM1;
    }
    get param2() {
        return this.elements.PARAM2;
    }
    get supptimeout() {
        return this.elements.SUPPTIMEOUT;
    }
    get mask() {
        return this.elements.MASK;
    }
    get isdefaultmask() {
        s;
        return this.elements.ISDEFAULTMASK;
    }
    get alarmFunctionalClassification() {
        return this.elements.ALARM_FUNCTIONAL_CLASSIFICATION;
    }
}

/*
    HISTORY_DATA_POINT FIELD="CV"
    {
      DATA_CHARACTERISTIC=CONTINUOUS
      ENABLED=T
      SAMPLE_PERIOD_SECONDS=1
      COMPRESSION_ENABLED=T
      RECORD_AT_LEAST_EVERY_MINUTES=240
      DEVIATION_LIMIT_FOR_COMPRESSION=0
      DATA_REPRESENTATION=AUTOMATIC
      EXPOSED=F
      ENTERPRISE_COLLECTION=F
    }
*/
class HistoryValue extends FhxValue {
    constructor(fhxString) {
        super(fhxString);
        this.elements = {
            FIELD: valueOfParameter(fhxString, "FIELD"),
            DATA_CHARACTERISTIC: valueOfParameter(
                fhxString,
                "DATA_CHARACTERISTIC"
            ),
            ENABLED: valueOfParameter(fhxString, "ENABLED"),
            SAMPLE_PERIOD_SECONDS: valueOfParameter(
                fhxString,
                "SAMPLE_PERIOD_SECONDS"
            ),
            COMPRESSION_ENABLED: valueOfParameter(
                fhxString,
                "COMPRESSION_ENABLED"
            ),
            RECORD_AT_LEAST_EVERY_MINUTES: valueOfParameter(
                fhxString,
                "RECORD_AT_LEAST_EVERY_MINUTES"
            ),
            DEVIATION_LIMIT_FOR_COMPRESSION: valueOfParameter(
                fhxString,
                "DEVIATION_LIMIT_FOR_COMPRESSION"
            ),
            DATA_REPRESENTATION: valueOfParameter(
                fhxString,
                "DATA_REPRESENTATION"
            ),
            EXPOSED: valueOfParameter(fhxString, "EXPOSED"),
            ENTERPRISE_COLLECTION: valueOfParameter(
                fhxString,
                "ENTERPRISE_COLLECTION"
            ),
        };
    }

    get field() {
        return this.elements.FIELD;
    }
    get dataCharacteristics() {
        return this.elements.DATA_CHARACTERISTIC;
    }
    get enabled() {
        return this.elements.ENABLED;
    }

    get samplePeriod() {
        return this.elements.SAMPLE_PERIOD_SECONDS;
    }
    get compressionEnabled() {
        return this.elements.COMPRESSION_ENABLED;
    }
    get atLeast() {
        return this.elements.RECORD_AT_LEAST_EVERY_MINUTES;
    }
    get deviationLimit() {
        return this.elements.DEVIATION_LIMIT_FOR_COMPRESSION;
    }
    get dataRepresentation() {
        return this.elements.DATA_REPRESENTATION;
    }
    get exposed() {
        return this.elements.EXPOSED;
    }
    get enterpriseCollection() {
        return this.elements.ENTERPRISE_COLLECTION;
    }
}

class NamedSetValue extends FhxValue {
    constructor(fhxString) {
        super(fhxString);
        this.elements = {
            SET: valueOfParameter(fhxString, "SET"),
            STRING_VALUE: valueOfParameter(fhxString, "STRING_VALUE"),
            CHANGEABLE: valueOfParameter(fhxString, "CHANGEABLE"),
        };
    }
    get set() {
        return this.elements.SET;
    }
    get stringValue() {
        return this.elements.STRING_VALUE;
    }
    get changeable() {
        return this.elements.CHANGEABLE;
    }
}
class NamedSetSet extends FhxValue {
    constructor(fhxString) {
        super(fhxString);
        this.elements = {
            ENUM_SET: valueOfParameter(fhxString, "ENUM_SET"),
            OPTIONS: this.getOptions(),
        };
    }

    get enumSet() {
        return this.elements.ENUM_SET;
    }
    get options() {
        return this.elements.OPTION;
    }

    getOptions() {
        let options;
        let indexOfOption = 0;
        let indexOfEqual = 0;
        while (indexOfOption !== -1) {
            indexOfOption = this.fhx.indexOf(search, indexOfEqual);
            indexOfEqual = this.fhx.indexOf("OPTION", indexOfOption);
            let optionName = this.fhx.substring(indexOfOption, indexOfEqual);
            let optionValue = valueOfParameter(this.fhx, optionName);
            options.push({ optionName, optionValue });
        }
        return options;
    }
}

class NumberValue extends FhxValue {
    constructor(fhxString) {
        super(fhxString);
        this.elements = {
            CV: valueOfParameter(fhxString, "CV"),
        };
    }
    get cv() {
        return this.elements.CV;
    }
}
class StringValue extends FhxValue {
    constructor(fhxString) {
        super(fhxString);
        this.elements = {
            CV: valueOfParameter(fhxString, "CV"),
        };
    }
    get cv() {
        return this.elements.CV;
    }
}
class ModeValue extends FhxValue {
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

        this.elements = {
            OOS_P: valueOfParameter(fhxString, "OOS_P"),
            IMAN_P: valueOfParameter(fhxString, "IMAN_P"),
            LOV_P: valueOfParameter(fhxString, "LOV_P"),
            MAN_P: valueOfParameter(fhxString, "MAN_P"),
            AUTO_P: valueOfParameter(fhxString, "AUTO_P"),
            CAS_P: valueOfParameter(fhxString, "CAS_P"),
            RCAS_P: valueOfParameter(fhxString, "RCAS_P"),
            ROUT_P: valueOfParameter(fhxString, "ROUT_P"),
            OOS_A: valueOfParameter(fhxString, "OOS_A"),
            IMAN_A: valueOfParameter(fhxString, "IMAN_A"),
            LOV_A: valueOfParameter(fhxString, "LOV_A"),
            MAN_A: valueOfParameter(fhxString, "MAN_A"),
            AUTO_A: valueOfParameter(fhxString, "AUTO_A"),
            CAS_A: valueOfParameter(fhxString, "CAS_A"),
            RCAS_A: valueOfParameter(fhxString, "RCAS_A"),
            ROUT_A: valueOfParameter(fhxString, "ROUT_A"),
            TARGET: valueOfParameter(fhxString, "TARGET"),
            NORMAL: valueOfParameter(fhxString, "NORMAL"),
        };
    }

    get permitteredModes() {
        let permittedModes = [
            "OOS_P",
            "IMAN_P",
            "LOV_P",
            "MAN_P",
            "AUTO_P",
            "CAS_P",
            "RCAS_P",
            "ROUT_P",
        ];
        return permittedModes.filter((mode) => this.elements[mode] === "T");
    }

    get oosP() {
        return this.elements.OOS_P;
    }
    get imanP() {
        return this.elements.IMAN_P;
    }
    get lovP() {
        return this.elements.LOV_P;
    }
    get manP() {
        return this.elements.MAN_P;
    }
    get autoP() {
        return this.elements.AUTO_P;
    }
    get casP() {
        return this.elements.CAS_P;
    }
    get rcasP() {
        return this.elements.RCAS_P;
    }
    get routP() {
        return this.elements.ROUT_P;
    }
    get oosA() {
        return this.elements.OOS_A;
    }
    get imanA() {
        return this.elements.IMAN_A;
    }
    get lovA() {
        return this.elements.LOV_A;
    }
    get manA() {
        return this.elements.MAN_A;
    }
    get autoA() {
        return this.elements.AUTO_A;
    }
    get casA() {
        return this.elements.CAS_A;
    }
    get rcasA() {
        return this.elements.RCAS_A;
    }
    get routA() {
        return this.elements.ROUT_A;
    }
    get target() {
        return this.elements.TARGET;
    }
    get normal() {
        return this.elements.NORMAL;
    }
}
class ReferenceValue extends FhxValue {
    constructor(fhxString) {
        super(fhxString);
        this.elements = {
            REF: valueOfParameter(fhxString, "REF"),
        };
    }
    get ref() {
        return this.elements.REF;
    }
}
class ParamWithStatusValue extends FhxValue {
    /*
    // Paramater with status
    VALUE { CV=1 ST= { SQ=GOODNONCASCADE GPSS=NONSPECIFIC LS=NOTLIMITED } }
    */
    constructor(fhxString) {
        super(fhxString);
        this.elements = {
            CV: valueOfParameter(fhxString, "CV"),
            ST: valueOfParameter(fhxString, "ST"),
            SQ: valueOfParameter(fhxString, "SQ"),
            GPSS: valueOfParameter(fhxString, "GPSS"),
            LS: valueOfParameter(fhxString, "LS"),
        };
    }
    get cv() {
        return this.elements.CV;
    }
    get st() {
        return this.elements.ST;
    }
    get sq() {
        return this.elements.SQ;
    }
    get gpss() {
        return this.elements.GPSS;
    }
    get ls() {
        return this.elements.LS;
    }
}
class ExpressionValue extends FhxValue {
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
        this.elements = {
            TYPE: valueOfParameter(fhxString, "TYPE"),
            EXPRESSION: valueOfParameter(fhxString, "EXPRESSION"),
        };
    }
    get type() {
        return this.elements.TYPE;
    }
    get expression() {
        return this.elements.EXPRESSION;
    }
}

export {
    FhxValue,
    AlarmValue,
    HistoryValue,
    NamedSetValue,
    NamedSetSet,
    NumberValue,
    StringValue,
    ModeValue,
    ReferenceValue,
    ParamWithStatusValue,
    ExpressionValue,
};
