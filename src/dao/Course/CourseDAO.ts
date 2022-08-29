import mongoose, {model} from "mongoose";
import {ICourse} from "../../models/Course/CourseModel";
import logger from "../../utils/logger";

const NAMESPACE = "src/dao/Course/CourseDAO.ts";

const CourseSchema = new mongoose.Schema(
    {
        courseDepartment: {
            type: String,
            require: true
        },
        courseNumber: {
            type: Number,
            require: true
        },
        preRequisites: {
            type: String,
            require: true
        }
    }
);
const Course = model<ICourse>('course', CourseSchema);

export class CourseDAO {

    /**
     * This method inserts a course and its preRequisites in the pre_req table
     * @param courseNumber
     * @param courseDepartment
     * @param preReqs
     */
    async insertPreReqCourse(courseNumber: number,
                             courseDepartment: string,
                             preReqs: string):
        Promise<ICourse> {
        let course = new Course({
            courseDepartment: courseDepartment,
            courseNumber: courseNumber,
            preRequisites: preReqs
        });
        try {
            await course.save(() => {
                logger.info(NAMESPACE, "Course saved!");
            });
        } catch (e: any) {
            logger.error(NAMESPACE, e.message);
            return Promise.reject();
        }
        return Promise.resolve(course);
    };

    /**
     * This method removes a course with all its preReqs
     * @param courseNumber
     * @param courseDepartment
     */
    async deletePreReqCourse(courseNumber: number,
                             courseDepartment: string): Promise<void> {
        try {
            logger.info(NAMESPACE, "Deleting a course with all its preReqs");
            await Course.deleteMany({courseDepartment, courseNumber}).exec();
        } catch (e: any) {
            logger.error(NAMESPACE, e.message);
            return Promise.reject();
        }
        return Promise.resolve();
    };

    /**
     * This method returns all the preReqs for a given course
     * @param courseNumber
     * @param courseDepartment
     */
    async getPreReqCourses(courseNumber: number, courseDepartment: string): Promise<string> {
        let result: Array<ICourse>;

        try {
            logger.info(NAMESPACE, "Getting a course preReqs");
            result = await Course.find({courseDepartment, courseNumber}).exec();
        } catch (e: any) {
            logger.error(NAMESPACE, e.message);
            return Promise.reject();
        }
        if (result.length == 0) {
            return Promise.reject(new Error("No courses found!"));
        }
        let courseResult: ICourse = result[0] as ICourse;

        return Promise.resolve(courseResult.preRequisites);
    }
}