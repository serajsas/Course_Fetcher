import {Course} from "../models/Course/CourseModel";
import {isCourse} from "./Parser";

export function allOfParser(preReqs: string): Array<Course> {
    let parsedResult: Array<Course> = [];
    let onlyOneCourse: Array<string> =
        preReqs.split(new RegExp(":"));
    let course = getFirstCourseIfExists(onlyOneCourse[1].trim());
    if (course.length != 0) {
        let courseValues = course.split(" ");
        let parsedCourse: Course = {
            department: courseValues[0],
            courseNumber: parseInt(courseValues[1])
        }
        parsedResult.push(parsedCourse);
        return parsedResult;
    }
    let courses: Array<string> =
        preReqs.split(new RegExp("all of | All of"))[1].split(",");
    courses = courses.map((course) => {
        return course.trim();
    });
    courses.forEach(course => {
        let values = course.split(" ");
        let parsedCourse: Course = {
            department: values[0],
            courseNumber: parseInt(values[1])
        }
        parsedResult.push(parsedCourse);
    })
    return parsedResult;
}

const getFirstCourseIfExists = function (preReqs: string): string {
    let course = preReqs.substring(0, 8);
    if (isCourse(course)) {
        return course;
    }
    return "";
}


// getFirstCourseIfExists("BIOL 200 and one of APBI 312, APBI 351, BIOL 260, BIOL 351, BIOL 352, BIOL 361, FRST 311.")
// console.log(
//     allOfParser("Pre-reqs: One of CHEM 211, CHEM 215 and all of CHEM 208, CHEM 213, CHEM 245.\n")
// )