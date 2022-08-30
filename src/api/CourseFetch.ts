import {ICourseFetch} from "./ICourseFetch";
import {CourseModel, ICourse} from "../models/Course/CourseModel";
import {Promise} from "mongoose";
import {CourseFetcher} from "../controller/Course/CourseFetcher";

export class CourseFetch implements ICourseFetch {
    private courseController;

    constructor() {
        this.courseController = new CourseFetcher();
    }

    doesHavePreReqs(courses: Array<CourseModel>): Promise<boolean> {
        return Promise.resolve(false);
    }

    async getCoursePreReqs(deptName: string, courseNumber: number): Promise<ICourse> {
        let preReqs: ICourse = await this.courseController.getCoursePreReqs(deptName, courseNumber);
        return preReqs;
    }

}