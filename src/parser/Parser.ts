import {PreRequisitesModel} from "../models/Course/PreRequisitesModel";

export function parser(preReqs: string): PreRequisitesModel {
    // @ts-ignore
    return null;
}

export function isCourse(course: string): boolean {
    let courseName: string = "";
    let courseNumber: string = "";
    for (let i = 0; i < 4; i++) {
        courseName = course[i] + courseName;
    }
    for (let i = 5; i < 8; i++) {
        courseNumber = course[i] + courseNumber;
    }
    if (/^\d+$/.test(courseNumber)) {
        return /^[a-zA-Z]+$/.test(courseName);
    }
    return false;
}