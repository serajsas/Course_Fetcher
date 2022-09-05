import * as cheerio from 'cheerio';
import axios from "axios";
import {CourseDoesNotExist, ICourse} from "../../models/course/CourseModel";
import logger from "../../utils/logger";

const NAMESPACE = "src/scrapers/course/CourseScraper.ts";

export async function getCourseWithPreReqs(courseDepartment: string, courseNumber: number, campus?: string): Promise<ICourse> {
    logger.debug(NAMESPACE, "Starting course scrapping", {courseDepartment, courseNumber, campus});
    let campusURI = campus != undefined && campus.toLowerCase().includes("okanagan") ? "&campuscd=UBCO" : "";
    const response =
        await axios.get(`https://www.courses.students.ubc.ca/cs/courseschedule?pname=subjarea&tname=subj-course&dept=${courseDepartment}&course=${courseNumber}` + campusURI);
    const $ = cheerio.load(response.data);
    let title: string =
        $(`h4:contains(${courseDepartment})`).text().split(" ").map((x: string) => x.trim()).join(" ");
    if (title.length == 0) {
        return Promise.reject(new CourseDoesNotExist());
    }

    let description: string = $(`h4:contains(${courseDepartment})`).next().text();
    description = description == "" ? "N/A" : description;
    let preReqs: string = $('p:contains("Pre-reqs:")').text();
    preReqs = preReqs == "" ? "N/A" : removeDuplicateTextFromPreReqsAndCoReqs(preReqs.replace(/\s+/g, ' ').trim());
    let coReqs: string =
        $('p:contains("Co-reqs:")').text();
    coReqs = coReqs == "" ? "N/A" : removeDuplicateTextFromPreReqsAndCoReqs(coReqs.replace(/\s+/g, ' ').trim());
    let camp: string =
        $('button:contains("Campus:")').text().split(":").map((x: string) => x.trim())[1];

    let course: ICourse = {
        campus: camp,
        coRequisites: coReqs,
        courseTitle: title,
        courseDescription: description,
        courseDepartment: courseDepartment,
        courseNumber: courseNumber,
        preRequisites: preReqs
    }

    logger.debug(NAMESPACE, "Course found", course);
    return Promise.resolve(course);
}

function removeDuplicateTextFromPreReqsAndCoReqs(text: string): string {
    let textArr: Array<string> = text.split(" ");
    let secondOccurrence = 0;
    let leftOver = "";
    for (let i = 0; i < textArr.length; i++) {
        if (textArr[i].includes('Pre-reqs:') && i != 0) {
            secondOccurrence = i;
            leftOver = textArr[i].substring(0, textArr[i].indexOf("Pre-reqs:"));
            break;
        } else if (textArr[i].includes('Co-reqs:') && i != 0) {
            secondOccurrence = i;
            leftOver = textArr[i].substring(0, textArr[i].indexOf("Co-reqs:"));
            break;
        }
    }
    let correctStringWithoutDuplicates = "";
    for (let i = 0; i < textArr.length; i++) {
        if (i == secondOccurrence && secondOccurrence != 0) {
            correctStringWithoutDuplicates = correctStringWithoutDuplicates + leftOver;
            break;
        }
        correctStringWithoutDuplicates = correctStringWithoutDuplicates + " " + textArr[i];
    }
    return correctStringWithoutDuplicates.trim();
}