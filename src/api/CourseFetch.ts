import {ICourseFetch} from "./ICourseFetch";
import {CourseModel} from "../models/Course/CourseModel";
import {PreRequisitesModel} from "../models/Course/PreRequisitesModel";

export class CourseFetch implements ICourseFetch {
    doesHavePreReqs(courses: Array<CourseModel>): Promise<boolean> {
        return Promise.resolve(false);
    }

    getCoursePreReqs(deptName: string, courseNumber: number): Promise<PreRequisitesModel> {
        // @ts-ignore
        return Promise.resolve(undefined);
    }

}