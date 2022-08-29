import {PreRequisitesModel} from "./PreRequisitesModel";

export interface ICourse {
    courseDepartment: string,
    courseNumber: number,
    preRequisites: string
};


export interface CourseModel {
    courseDepartment: string,
    courseNumber: number,
    preRequisites?: PreRequisitesModel
}

