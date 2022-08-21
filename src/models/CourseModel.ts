export interface CourseModel {
    courseName: string,
    description: string,
    pre_reqs: Array<CourseModel>
}