// If this test, the test for moduleRunner.js is successful, it means the code under DSSpecific folder is mostly correct,
// irregards to the content of the tables, nevertheless.

import fs from "fs";
import path from "path";
import { expect, should } from "chai";
import {
    findBlocks,
    valueOfParameter,
    findBlockWithCondition,
} from "../src/util/FhxUtil.js";
import { fileURLToPath } from "url";
should();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe("FhxUtil", function () {
    describe("findBlocks", function () {
        it("should return an array of blocks", function () {
            let fhx = fs.readFileSync("test/data/UtilTestData.txt", "utf8");
            let fbFhx = findBlocks(fhx, "FUNCTION_BLOCK");
            fbFhx.should.be.an("array");
            fbFhx[0].should.be.a("string");
            fbFhx.length.should.equal(4);
        });
    });

    describe("valueOfParmaeter", function () {
        it("should return the value of the parameter", function () {
            let fhx = fs.readFileSync("test/data/UtilTestData.txt", "utf8");
            let fbFhx = findBlocks(fhx, "ATTRIBUTE")[0];
            valueOfParameter(fbFhx, "NAME").should.equal("VERSION_CLASS");
            valueOfParameter(fbFhx, "HELP_ID").should.equal("337652");
            valueOfParameter(fbFhx, "CATEGORY").should.equal(
                "{ CATEGORY=ONLINE }" // this would fail with the current implimentation
            );
        });
    });
    describe("findBlockWithCondition", function () {
        let testFhx = fs.readFileSync(
            "test/data/FhxComponents/Components.txt",
            "utf8"
        );
        let fbdFhx = fs.readFileSync(
            "test/data/Mixer Mixer_EM_Classes.fhx",
            "utf16le"
        );

        it("should return specified parameters of a smaller innerblock", function () {
            // because of indentatnion in the fhx block's formatting, it is best
            // to not test against the entire string
            let block = findBlockWithCondition(testFhx, {
                blockType: "ATTRIBUTE_INSTANCE",
                key: "NAME",
                value: "REQ_SP",
            });
            block.should.be.a("string");
            block.should.include('ATTRIBUTE_INSTANCE NAME="REQ_SP"');
            block.should.include("_N_M_EM_CMD_10");
        });
        it("should also return the specified parameters of a larger block", function () {
            let block = findBlockWithCondition(fbdFhx, {
                blockType: "FUNCTION_BLOCK_DEFINITION",
                key: "NAME",
                value: "__5D24CE4A_A808E6E3__",
            });
            block.should.be.a("string");
            block.should.include(
                'NAME="{DBE0527A-43A1-46C5-B14D-81AA30A1C512}"'
            );
            block.should.include('ATTRIBUTE NAME="CFM_MAX_TIME" TYPE=FLOAT');
        });
    });

    describe("processValueBlocks", function () {
        let fhx = fs.readFileSync(
            "test/data/FhxComponents/ValueBlocks.txt",
            "utf8"
        );

        let blocks = findBlocks(fhx, "VALUE");
        let valueBlocks = {
            namedSet: blocks[0],
            integer: blocks[1],
            alarm: blocks[2],
            enum: blocks[3],
            paramWithStatus: blocks[4],
            reference: blocks[5],
            mode: blocks[6],
            string: blocks[7],
        };

        it.skip("should return the correct Named Set Value", function () {
            true.should.be.true;
            // processValueBlocks(valueBlocks.namedSet).should.equal("1,2,3,4,5");
        });
    });
});
