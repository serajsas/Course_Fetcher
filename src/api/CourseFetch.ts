import {ICourseFetch} from "./ICourseFetch";
import {CourseModel} from "../models/CourseModel";

export class CourseFetch implements ICourseFetch {
    getCoursePrereqs(deptName: string, courseNumber: number): Promise<CourseModel> {
        // @ts-ignore
        return Promise.resolve(undefined);
    }

}