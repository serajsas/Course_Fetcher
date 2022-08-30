import {CourseModel, ICourse} from "../models/Course/CourseModel";
import {PreRequisitesModel} from "../models/Course/PreRequisitesModel";


export interface ICourseFetch {
    /**
     * Finds the pre-requisites for a given course
     * @param deptName
     * @param courseNumber
     */
    getCoursePreReqs(deptName: string, courseNumber: number): Promise<ICourse>;

    /**
     * Returns true if the given courses have all the required pre-requisites
     * otherwise return false
     * @param courses
     */
    doesHavePreReqs(courses: Array<CourseModel>): Promise<boolean>;

}