import {CourseModel} from "./CourseModel";

export interface preRequisites {
    allOf: Array<CourseModel>,
    oneOf: Array<Array<CourseModel>>,
    eitherOrCase: Array<preRequisites>,
    departmentPermission?: boolean
    // @TODO: When creating a user the following information must be required:
    yearStanding?: number,
    specialization?: string,
}
