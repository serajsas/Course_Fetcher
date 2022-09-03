export class PreReqsNotFoundInDB extends Error {
    constructor() {
        super("PreReqsNotFoundInDB");
        Error.captureStackTrace(this, PreReqsNotFoundInDB);
    }
}

export class CourseDoesNotExist extends Error {
    constructor() {
        super("Invalid course or course might not be offered for this session");
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
