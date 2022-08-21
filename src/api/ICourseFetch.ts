import {CourseModel} from "../models/CourseModel";

export interface ICourseFetch {
    getCoursePrereqs(deptName: string, courseNumber: number):Promise<CourseModel>;
}