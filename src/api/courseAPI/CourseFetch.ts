import {ICourseFetch} from "./ICourseFetch";
import {ICourse} from "../../models/course/CourseModel";
import {Promise} from "mongoose";
import {CourseFetcher} from "../../controller/course/CourseFetcher";

export class CourseFetch implements ICourseFetch {
    private courseController;

    constructor() {
        this.courseController = new CourseFetcher();
    }

    async getCoursePreReqs(deptName: string, courseNumber: number): Promise<ICourse> {
        let preReqs: ICourse = await this.courseController.getCoursePreReqs(deptName, courseNumber);
        return preReqs;
    }

}