import mongoose, {model} from "mongoose";
import {fromDAOICourse, ICourse, CourseNotFoundInDB} from "../../models/course/CourseModel";
import logger from "../../utils/logger";

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
        },
        coRequisites: {
            type: String,
            require: true
        },
        campus: {
            type: String,
            require: true
        }
    }
);

const Course = model<ICourse>('course', CourseSchema);


export class CourseDAO {

    constructor() {
        Course.createIndexes().then(() => {
            logger.debug(NAMESPACE, "INDEXES INITIALIZED!!");
        });
    }

    /**
     * This method inserts a course into the course table
     * @param courseNumber
     * @param courseDepartment
     * @param preReqs
     * @param title
     * @param description
     * @param campus
     * @param coReqs
     */
    async insertCourse(courseNumber: number,
                       courseDepartment: string,
                       preReqs: string, title: string, description: string, campus: string, coReqs: string):
        Promise<ICourse> {
        let course = new Course({
            courseDepartment: courseDepartment,
            courseNumber: courseNumber,
            preRequisites: preReqs,
            coRequisites: coReqs,
            campus: campus,
            courseTitle: title,
            courseDescription: description,

        });
        try {
            await course.save(async () => {
                logger.debug(NAMESPACE, "Course saved!");
            });
        } catch (e: any) {
            logger.error(NAMESPACE, e.message);
            return Promise.reject(e);
        }
        return Promise.resolve(course);
    };

    /**
     * This method removes a course with all its details
     * @param courseNumber
     * @param courseDepartment
     */
    async deleteCourse(courseNumber: number,
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
     * This method returns all the courses for a given courseNumber and courseDepartment
     * @param courseNumber
     * @param courseDepartment
     * @param campus
     */
    async getCourse(courseNumber: number, courseDepartment: string, campus: string): Promise<ICourse> {
        let result: Array<ICourse>;
        if (campus.toLowerCase().includes("okanagan")) {
            campus = "UBC Okanagan";
        } else {
            campus = "UBC Vancouver";
        }
        try {
            logger.debug(NAMESPACE,"Getting a course", {courseDepartment, courseNumber, campus});
            result = await Course.find({courseDepartment, courseNumber, campus}).exec();
        } catch (e: any) {
            logger.error(NAMESPACE, e.message);
            return Promise.reject(e);
        }
        if (result.length == 0) {
            return Promise.reject(new CourseNotFoundInDB());
        }

        let courseResult = fromDAOICourse(result[0]);
        return Promise.resolve(courseResult);
    }
}