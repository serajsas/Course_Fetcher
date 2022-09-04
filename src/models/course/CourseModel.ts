export class CourseNotFoundInDB extends Error {
    constructor() {
        super("CourseNotFoundInDB");
        Error.captureStackTrace(this, CourseNotFoundInDB);
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
    preRequisites: string,
    coRequisites: string,
    campus: string
}

export function toController(data: ICourse) {
    let course: ICourse = {
        courseTitle: data.courseTitle,
        courseDescription: data.courseDescription,
        courseDepartment: data.courseDepartment,
        courseNumber: data.courseNumber,
        preRequisites: data.preRequisites,
        coRequisites: data.coRequisites,
        campus: data.campus
    };
    return course;
}

export function fromDAO(result: ICourse) {
    let courseResult: ICourse = {
        courseTitle: result.courseTitle,
        courseDescription: result.courseDescription,
        courseDepartment: result.courseDepartment,
        courseNumber: result.courseNumber,
        preRequisites: result.preRequisites,
        coRequisites: result.coRequisites,
        campus: result.campus,

    }
    return courseResult;
}