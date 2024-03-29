import {ICourse} from "../../models/course/CourseModel";


export interface ICourseFetch {
    /**
     * Finds the pre-requisites for a given course.
     * @param deptName
     * @param courseNumber
     */
    getCoursePreReqs(deptName: string, courseNumber: number): Promise<ICourse>;
}