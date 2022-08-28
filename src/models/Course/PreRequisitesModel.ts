import {CourseModel} from "./CourseModel";

export interface PreRequisitesModel {
    allOf: Array<CourseModel>,
    oneOf: Array<Array<CourseModel>>,
    eitherOrCase: Array<PreRequisitesModel>,
    // @TODO: When creating a user the following information must be required:
    yearStanding?: number,
    specialization?: string,
}
