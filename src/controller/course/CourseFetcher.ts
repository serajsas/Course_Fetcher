import {ICourseFetch} from "../../api/courseAPI/ICourseFetch";
import {CourseDAO} from "../../dao/course/CourseDAO";
import logger from "../../utils/logger";
import {getCourseWithPreReqs} from "../../scrapers/course/CoursePreReqsScraper";
import {CourseDoesNotExist, ICourse, PreReqsNotFoundInDB} from "../../models/course/CourseModel";

const NAMESPACE = "src/controller/Course/CourseFetcher.ts";

export class CourseFetcher implements ICourseFetch {
    private courseDAO: CourseDAO;

    constructor() {
        this.courseDAO = new CourseDAO();
    }

    async getCoursePreReqs(deptName: string, courseNumber: number): Promise<ICourse> {
        let preReqs: ICourse = {
            courseTitle: "",
            courseDescription: "",
            courseDepartment: "",
            courseNumber: 0,
            preRequisites: ""
        };
        try {
            preReqs = await this.courseDAO.getPreReqCourses(courseNumber, deptName);
        } catch (e: any) {
            if (e instanceof PreReqsNotFoundInDB) {
                logger.debug(NAMESPACE, e.message);
                let data: ICourse;
                try {
                    data = await getCourseWithPreReqs(deptName, courseNumber);
                    await this.courseDAO.insertPreReqCourse(data.courseNumber,
                        data.courseDepartment,
                        data.preRequisites,
                        data.courseTitle,
                        data.courseDescription);
                    preReqs = data;
                } catch (e: any) {
                    logger.debug(NAMESPACE, e.message)
                    return Promise.reject(new CourseDoesNotExist());
                }
            }
        }
        logger.info(NAMESPACE, "Retrieved preReqs for", {deptName, courseNumber})
        return Promise.resolve(preReqs);
    }
}