import {PreRequisitesModel} from "./PreRequisitesModel";

export interface CourseModel {
    department: string,
    courseNumber: number,
    preReqs: PreRequisitesModel
}

export interface Course {
    department: string,
    courseNumber: number
}