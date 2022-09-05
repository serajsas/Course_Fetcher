import mongoose, {model} from "mongoose";
import {getCourses} from "../../src/scrapers/course/SeedCoursesScraper";
import logger from "../../src/utils/logger";
import {SeededCourseNotFoundInDB} from "../../src/models/course/CourseModel";

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

export interface courseSeedModel {
    courseTitle: string,
    campus: string
}

const CourseSeed = model<courseSeedModel>('course_seed', CourseSeedSchema);

export class CourseSeedDAO {
    async seedDBWithCourses(campus: string) {
        getCourses(campus).then(async (allArraysOfCourses) => {
            for (let i = 0; i < allArraysOfCourses.length; i++) {
                const arrayOfCourses = allArraysOfCourses[i];
                for (let j = 0; j < arrayOfCourses.length; j++) {
                    const course = arrayOfCourses[j];
                    logger.debug(NAMESPACE, "Inserting seeded course into DB", {course, campus});
                    await this.insertSeededCourse(course.trim(), campus);
                }
            }
        });
    }

    async getSeededCourse(name: string, campus: string) {
        let result: Array<courseSeedModel>;
        try {
            logger.debug(NAMESPACE, "Getting a seeded course", {name, campus});
            result = await CourseSeed.find({name, campus}).exec();
        } catch (e: any) {
            logger.error(NAMESPACE, e.message);
            return Promise.reject(e);
        }
        if (result.length == 0) {
            return Promise.reject(new SeededCourseNotFoundInDB());
        }

        let courseResult: courseSeedModel = {courseTitle: result[0].courseTitle, campus: result[0].campus};
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

    async isCoursesDBSeeded(): Promise<boolean> {
        let count = await CourseSeed.count({campus: "UBC Vancouver" || "UBC Okanagan"});
        return count != 0;
    }
}