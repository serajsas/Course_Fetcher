import * as cheerio from 'cheerio';
import axios from "axios";
import {CourseDoesNotExist, ICourse} from "../models/Course/CourseModel";

export async function scrape(courseDepartment: string, courseNumber: number): Promise<ICourse> {
    const response =
        await axios.get(`https://www.courses.students.ubc.ca/cs/courseschedule?pname=subjarea&tname=subj-course&dept=${courseDepartment}&course=${courseNumber}`);
    const $ = cheerio.load(response.data);

    let title: string =
        $(`h4:contains(${courseDepartment})`).text().split(" ").map((x: string) => x.trim()).join(" ");
    if (title.length == 0) {
        return Promise.reject(new CourseDoesNotExist());
    }
    let description: string = $(`h4:contains(${courseDepartment})`).next().text();
    let preReqs: string =
        $('p:contains("Pre-reqs:")').text().split(":").map((x: string) => x.trim()).join(": ");
    let course: ICourse = {
        courseTitle: title,
        courseDescription: description,
        courseDepartment: courseDepartment,
        courseNumber: courseNumber,
        preRequisites: preReqs
    }
    return Promise.resolve(course);
}