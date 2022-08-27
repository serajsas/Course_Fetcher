import logger from "../../src/utils/logger";
import {readLocalTestFile} from "../utils/FileReader";
import {expect} from "chai";
import {Course} from "../../src/models/Course/CourseModel";
import {allOfParser} from "../../src/parser/AllOfParser";
import {isCourse} from "../../src/parser/Parser";


const NAMESPACE = 'test/parser_test/AllOfParserTest.spec.ts';

describe("Trial all of parser test suite", function () {
    let preReqs: Array<string>;
    before(async function () {
        logger.debug(NAMESPACE, "Running before");
        try {
            preReqs = await readLocalTestFile("AllOfTestStrings");
            expect(preReqs.length).to.be.greaterThan(0);
        } catch (e: any) {
            logger.error(NAMESPACE, e);
        }
    });
    it('Check that all the returned courses are valid courses', async function () {
        let res = preReqs.every((preReq) => {
            let courses: Array<Course> = allOfParser(preReq);
            return courses.every((course) => {
                let value = course.department + " " + course.courseNumber;
                return isCourse(value) != false;
            });
        })
        expect(res).to.be.true;
    });
})