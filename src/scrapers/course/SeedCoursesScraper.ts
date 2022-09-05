import logger from "../../utils/logger";
import axios from "axios";
import * as cheerio from "cheerio";

const NAMESPACE = "seed/courses/SeedCoursesScraper.ts";

const basePath = "https://courses.students.ubc.ca";

export async function getAllSubjectCodes(url: string): Promise<Array<string>> {
    logger.debug(NAMESPACE, "getAllSubjectCodes", url);
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    let subjectCodes: Array<string> = [];
    $('table[id="mainTable"]').find('a').each(function (index, element) {
        subjectCodes.push($(element).text());
    });
    return Promise.resolve(subjectCodes);
}

export async function getSubjectCodeCourses(subjectCode: string, url: string): Promise<Array<string>> {
    logger.debug(NAMESPACE, "getSubjectCodeCourses", {subjectCode, url});
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    let coursesLink: string | undefined =
        $('table[id="mainTable"]').find(`a:contains(${subjectCode})`).attr("href");
    if (coursesLink == undefined) {
        return Promise.reject();
    }
    coursesLink = basePath + coursesLink;
    let coursesResponse = await axios.get(coursesLink);
    const $coursesResponse = cheerio.load(coursesResponse.data);
    let courses: Array<string> = [];
    $coursesResponse('table[id="mainTable"]').find('a').each(function (index, element) {
        courses.push($coursesResponse(element).text());
    });
    return Promise.resolve(courses);
}

