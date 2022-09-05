import {ICourseFetch} from "../../api/courseAPI/ICourseFetch";
import {CourseDAO} from "../../dao/course/CourseDAO";
import logger from "../../utils/logger";
import {getCourseWithPreReqs} from "../../scrapers/course/CourseScraper";
import {
    CourseDoesNotExist,
    ICourse,
    CourseNotFoundInDB,
    toController,
    SeededCourseNotFoundInDB
} from "../../models/course/CourseModel";

const NAMESPACE = "src/controller/Course/CourseFetcher.ts";

export class CourseFetcher implements ICourseFetch {
    private courseDAO: CourseDAO;

    constructor() {
        this.courseDAO = new CourseDAO();
    }

    async getCourse(deptName: string, courseNumber: number, campus: string): Promise<ICourse> {
        let course: ICourse = {
            courseTitle: "",
            courseDescription: "",
            courseDepartment: "",
            courseNumber: 0,
            preRequisites: "",
            coRequisites: "",
            campus: ""
        };
        try {
            course = await this.courseDAO.getCourse(courseNumber,
                deptName,
                campus);
        } catch (e: any) {
            if (e instanceof SeededCourseNotFoundInDB) {
                logger.debug(NAMESPACE, "SeededCourseNotFoundInDB", e);
                return Promise.reject(new SeededCourseNotFoundInDB());
            } else if (e instanceof CourseNotFoundInDB) {
                logger.debug(NAMESPACE, e.message);
                let data: ICourse;
                try {
                    data = await getCourseWithPreReqs(deptName, courseNumber, campus);
                    await this.courseDAO.insertCourse(data.courseNumber,
                        data.courseDepartment,
                        data.preRequisites,
                        data.courseTitle,
                        data.courseDescription,
                        data.campus,
                        data.coRequisites);
                    course = toController(data);
                } catch (e: any) {
                    logger.debug(NAMESPACE, "", e);
                    return Promise.reject(new CourseDoesNotExist());
                }
            }
        }
        logger.debug(NAMESPACE, "Retrieved preReqs for", {deptName, courseNumber});
        return Promise.resolve(course);
    }
}