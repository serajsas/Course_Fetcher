import {CourseModel} from "../models/Course/CourseModel";
import {PreRequisitesModel} from "../models/Course/PreRequisitesModel";

export interface ICourseFetch {
    /**
     * Finds the pre-requisites for a given course
     * @param deptName
     * @param courseNumber
     */
    getCoursePrereqs(deptName: string, courseNumber: number): Promise<PreRequisitesModel>;

    /**
     * Returns true if the given courses have all the required pre-requisites
     * otherwise return false
     * @param courses
     */
    doesHavePrereqs(courses: Array<CourseModel>): Promise<boolean>;

}