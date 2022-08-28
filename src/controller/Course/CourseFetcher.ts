import {ICourseFetch} from "../../api/ICourseFetch";
import {CourseModel} from "../../models/Course/CourseModel";
import {PreRequisitesModel} from "../../models/Course/PreRequisitesModel";

export class CourseFetcher implements ICourseFetch {
    doesHavePrereqs(courses: Array<CourseModel>): Promise<boolean> {

        return Promise.resolve(false);
    }

    getCoursePrereqs(deptName: string, courseNumber: number): Promise<PreRequisitesModel> {
        // @ts-ignore
        return Promise.resolve(undefined);
    }

}