import logger from "../../src/utils/logger";
import {expect} from "chai";
import {allOfParser} from "../../src/parser/AllOfParser";
import {isCourse} from "../../src/parser/Parser";
import {readLocalTestFile} from "../../src/utils/FileReader";
import {CourseModel} from "../../src/models/Course/CourseModel";


const NAMESPACE = 'test/parser_test/AllOfParserTest.spec.ts';

describe("Trial all of parser test suite", function () {
    let preReqs: Array<string>;
    before(async function () {
        logger.debug(NAMESPACE, "Running before hook");
        try {
            preReqs = await readLocalTestFile("test/test_files/AllOfTestStrings");
            expect(preReqs.length).to.be.greaterThan(0);
        } catch (e: any) {
            logger.error(NAMESPACE, e);
        }
    });

    it('Check that all the returned courses are valid courses', async function () {
        const title = this.test == undefined ? "" : this.test.title;
        logger.debug(NAMESPACE, "Running test:", title);

        let res = preReqs.every((preReq) => {
            let courses: Array<CourseModel> = allOfParser(preReq);
            return courses.every((course) => {
                let value = course.courseDepartment + " " + course.courseNumber;
                return isCourse(value) != false;
            });
        })
        expect(res).to.be.true;
    });
})