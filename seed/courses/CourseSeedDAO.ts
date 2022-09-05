import mongoose, {model} from "mongoose";
import {getAllSubjectCodes, getSubjectCodeCourses} from "../../src/scrapers/course/SeedCoursesScraper";
import logger from "../../src/utils/logger";
import {SeededCourseNotFoundInDB} from "../../src/models/course/CourseModel";
import {sleep} from "../../src/utils/dbConnector";

const NAMESPACE = "seed/courses/CourseSeedDAO.ts";
const CourseSeedSchema = new mongoose.Schema(
    {
        courseTitle: {
            type: String,
            require: true,
            index: true
        },
        campus: {
            type: String,
            require: true
        }
    }
);

export interface CourseSeedModel {
    courseTitle: string,
    campus: string
}

const CourseSeed = model<CourseSeedModel>('course_seed', CourseSeedSchema);

function getNotSeededSubjectCodes(subjectCodes: Array<string>, lastSubjectCode: string) {
    let lastOne = -1;
    for (let i = 0; i < subjectCodes.length; i++) {
        if (subjectCodes[i] == lastSubjectCode) {
            lastOne = i;
        }
    }
    if (lastOne == -1) {
        return subjectCodes;
    }
    let notInsertedSubjectCodes = [];
    for (let i = 0; i < subjectCodes.length; i++) {
        if (i > lastOne) {
            notInsertedSubjectCodes.push(subjectCodes[i]);
        }
    }
    return notInsertedSubjectCodes;
}

export class CourseSeedDAO {
    constructor() {
        CourseSeed.createIndexes().then(() => {
            logger.debug(NAMESPACE, "INDEXES INITIALIZED!!");
        });
    }

    async seedDBWithCourses(campus: string) {
        let url: string = "";
        if (campus.toLowerCase().includes("okanagan")) {
            url = "https://courses.students.ubc.ca/cs/courseschedule?pname=subjarea&campuscd=UBCO";
        } else {
            url = "https://courses.students.ubc.ca/cs/courseschedule?pname=subjarea&campuscd=UBC";
        }
        let subjectCodes = await getAllSubjectCodes(url);
        // subjectCodes = getNotSeededSubjectCodes(subjectCodes, 'SCAN');
        for (const code of subjectCodes) {
            let courses;
            try {
                courses = await getSubjectCodeCourses(code, url);
                for (const course of courses) {
                    logger.debug(NAMESPACE, "Inserting course in DB", course);
                    await this.insertSeededCourse(course.trim(), campus);
                }
            } catch (e) {

            }
            logger.debug(NAMESPACE, "Before Sleep", courses);
            await sleep(10000);
        }
    }


    async getSeededCourse(name: string) {
        let result: Array<CourseSeedModel>;
        try {
            logger.debug(NAMESPACE, "Getting a seeded course", {name});
            result = await CourseSeed.find({courseTitle: name}).exec();
            logger.debug(NAMESPACE, "Result of finding seeded course", result);

        } catch (e: any) {
            logger.error(NAMESPACE, e.message);
            return Promise.reject(e);
        }
        if (result.length == 0) {
            return Promise.reject(new SeededCourseNotFoundInDB());
        }

        let courseResult: CourseSeedModel = {courseTitle: result[0].courseTitle, campus: result[0].campus};
        return Promise.resolve(courseResult);
    }

    async insertSeededCourse(courseTitle: string, campus: string) {
        let seededCourse = new CourseSeed({
            courseTitle: courseTitle,
            campus: campus
        });
        try {
            await seededCourse.save(async () => {
                logger.debug(NAMESPACE, "Course saved!");
            });
        } catch (e: any) {
            logger.error(NAMESPACE, e.message);
            return Promise.reject(e);
        }
        return Promise.resolve(seededCourse);
    }

    async isCoursesDBSeeded(): Promise<number> {
        let count = await CourseSeed.count({$or: [{campus: "UBC Vancouver"}, {campus: "UBC Okanagan"}]});
        return count;
    }

}