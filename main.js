// import { FhxProcessor, FileIO, namesFromIndex } from "fhxtool";
import fs, { mkdirSync, writeFileSync } from "fs";
import path from "path";
import * as fhxProcessor from "./src/v1/_FhxProcessor.js";
import { createTables, moduleRunner, moduleType } from "./moduleRunner.js";
import {
    ModuleParameter,
    ModuleParameterTable,
} from "./src/DSSpecific/ModuleParameterTable.js";
import { SimpleModuleClass } from "./src/v2/FhxComponents/SimpleComponent.js";

const outputPath = "output";

// const fhxFiles = [
//     "GEX CompositeTemplates.fhx",
//     "GEX ModuleTemplates.fhx",
//     "GEX Named Sets.fhx",
//     "GEX_Control_Module_Classes.fhx",
//     "GEX_Mixer_EM_Classes.fhx",
//     "GEX_Mixer_Phase_Classes.fhx",
//     "GEX_Unit_Classes.fhx",
//     "Mixer Alarm Types.fhx",
//     "Mixer CompositeTemplates.fhx",
//     "Mixer Control_Module_Classes.fhx",
//     "Mixer Mixer_EM_Classes.fhx",
//     "Mixer Mixer_Phase_Classes.fhx",
//     "Mixer ModuleTemplates.fhx",
//     "Mixer Named Sets.fhx",
//     "N-MIXERS Instances.fhx",
//     "_E_M_AGIT.fhx",
// ];

const fhxPath = "fhx";
const ems_fhxdata = fs.readFileSync(
    path.join(fhxPath, "Mixer Mixer_EM_Classes.fhx"),
    "utf-16le"
);
const cms_fhxdata = fs.readFileSync(
    path.join(fhxPath, "Mixer Control_Module_Classes.fhx"),
    "utf-16le"
);
const emname = "_E_M_AGIT";
const cmname = "_C_M_AI";
const em_E_M_AGITFhx = fs.readFileSync("./fhx/_E_M_AGIT.fhx", "utf-16le");

function runner() {
    // moduleRunner(fhx);
    console.log(fs.readdirSync("./fhx"));
}

function runner2() {
    // const em_E_M_AGITFhx = fs.readFileSync("./fhx/_E_M_AGIT.fhx", "utf-16le");

    const fhx = em_E_M_AGITFhx;

    let _E_M_AGITModuleClass = new SimpleModuleClass(fhx); // create a simple module class object
    let paramTable = _E_M_AGITModuleClass.createParameterTable();
    fs.writeFileSync(path.join(outputPath, "temp.csv"), paramTable, {
        recursive: true,
    });

    return;
}
// runner(fhx);
runner2();

function getModuleParameters(moduleBlock) {
    let moduleParameters = [];

    // Find Attribute blocks with CATEGORY=COMMON
    let attributes = fhxProcessor.findBlocks(moduleBlock, "ATTRIBUTE").filter(
        (attribute) => attribute.includes("CATEGORY=COMMON") // Filter attributes with CATEGORY=COMMON, i.e. module parameters
    );
    // Find Attribute Instance blocks of the Module Parameters
    let attributeInstances = fhxProcessor.findBlocks(
        moduleBlock,
        "ATTRIBUTE_INSTANCE"
    ); // Find  all attribute instances of the module

    // for each module parameter defined in attribute instance
    // find the parameter value described in attribute instances
    // every module parameter should have a value, if not throw an error
    for (const attrIndex in attributes) {
        for (const attrInstanceIndex in attributeInstances) {
            const attributeInstance = attributeInstances[attrInstanceIndex];
            const attribute = attributes[attrIndex];
            if (
                // find the attribute instance associated with the attribute that are module parameters
                fhxProcessor.valueOfParameter(attribute, "NAME") ===
                fhxProcessor.valueOfParameter(attributeInstance, "NAME")
            ) {
                moduleParameters.push(
                    // Create a list of ModuleParameter objects from those parameters
                    new ModuleParameter(
                        fhxProcessor.valueOfParameter(
                            attributeInstance,
                            "NAME"
                        ),
                        fhxProcessor.valueOfParameter(attribute, "TYPE"),
                        attributeInstance
                    )
                );
            }
        }
    }

    return new ModuleParameterTable(moduleParameters);
}
