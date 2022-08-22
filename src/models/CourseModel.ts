import {preRequisites} from "./PreRequisitesModel";

export interface CourseModel {
    department : string,
    courseNumber: number,
    preReqs: preRequisites
}