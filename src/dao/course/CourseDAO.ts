import mongoose, {model} from "mongoose";
import {ICourse, PreReqsNotFoundInDB} from "../../models/course/CourseModel";
import logger from "../../utils/logger";
import {data} from "cheerio/lib/api/attributes";
import {connect} from "../../utils/dbConnector";

const NAMESPACE = "src/dao/course/CourseDAO.ts";

const CourseSchema = new mongoose.Schema(
    {
        courseTitle: {
            type: String,
            require: true,
        },
        courseDescription: {
            type: String,
            require: true
        },
        courseDepartment: {
            type: String,
            require: true,
            index: true
        },
        courseNumber: {
            type: Number,
            require: true,
            index: true
        },
        preRequisites: {
            type: String,
            require: true
        }
    }
);

const Course = model<ICourse>('course', CourseSchema);


export class CourseDAO {

    constructor() {
        Course.createIndexes().then(()=> {
            logger.debug(NAMESPACE, "INDEXES INITIALIZED!!");
        });
    }

    /**
     * This method inserts a course and its preRequisites in the pre_req table
     * @param courseNumber
     * @param courseDepartment
     * @param preReqs
     */
    async insertPreReqCourse(courseNumber: number,
                             courseDepartment: string,
                             preReqs: string, title: string, description: string):
        Promise<ICourse> {
        let course = new Course({
            courseDepartment: courseDepartment,
            courseNumber: courseNumber,
            preRequisites: preReqs,
            courseTitle: title,
            courseDescription: description
        });
        try {
            await course.save(() => {
                logger.debug(NAMESPACE, "Course saved!");
            });
        } catch (e: any) {
            logger.error(NAMESPACE, e.message);
            return Promise.reject(e);
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
            logger.debug(NAMESPACE, "Deleting a course with all its preReqs");
            await Course.deleteMany({courseDepartment, courseNumber}).exec();
        } catch (e: any) {
            logger.error(NAMESPACE, e.message);
            return Promise.reject(e);
        }
        return Promise.resolve();
    };

    /**
     * This method returns all the preReqs for a given course
     * @param courseNumber
     * @param courseDepartment
     */
    async getPreReqCourses(courseNumber: number, courseDepartment: string): Promise<ICourse> {
        let result: Array<ICourse>;

        try {
            logger.debug(NAMESPACE, "Getting a course preReqs");
            result = await Course.find({courseDepartment, courseNumber}).exec();
        } catch (e: any) {
            logger.error(NAMESPACE, e.message);
            return Promise.reject(e);
        }

        if (result.length == 0) {
            return Promise.reject(new PreReqsNotFoundInDB());
        }

        let courseResult: ICourse = {
            courseTitle: result[0].courseTitle,
            courseDescription: result[0].courseDescription,
            courseDepartment: result[0].courseDepartment,
            courseNumber: result[0].courseNumber,
            preRequisites: result[0].preRequisites

        }
        return Promise.resolve(courseResult);
    }
}