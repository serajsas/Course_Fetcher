export class PreReqsNotFoundInDB extends Error {
    constructor() {
        super("PreReqsNotFoundInDB");
        Error.captureStackTrace(this, PreReqsNotFoundInDB);
    }
}

export class CourseDoesNotExist extends Error {
    constructor() {
        super("Invalid course, course might not be offered for this session, " +
            "or is not offered in selected campus");
        Error.captureStackTrace(this, CourseDoesNotExist);
    }
}

export interface ICourse {
    courseTitle: string
    courseDescription: string,
    courseDepartment: string,
    courseNumber: number,
    preRequisites: string
}
