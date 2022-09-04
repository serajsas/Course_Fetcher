import express from "express";
import logger from "../utils/logger";
import {ICourseFetch} from "../api/courseAPI/ICourseFetch";
import {CourseFetch} from "../api/courseAPI/CourseFetch";
import {ICourse} from "../models/course/CourseModel";

const router = express.Router();

const NAMESPACE = "src/routes/CourseRoutes.ts";

const courseAPI: ICourseFetch = new CourseFetch();

router.get('/', async (req, res) => {
    const departmentName: any = req.query.dept;
    const courseNumber: any = req.query.number;
    const campus: any = req.query.campus;
    logger.debug(NAMESPACE, "Responding to get request");
    if (!departmentName || !courseNumber) {
        logger.error(NAMESPACE, "departmentName and courseNumber are required but found undefined!!");
        return res.status(404).send();
    }
    let course: ICourse;
    try {
        logger.debug(NAMESPACE, "Fetching course course");
        course = await courseAPI.getCoursePreReqs(departmentName.toUpperCase(),
            parseInt(courseNumber), campus != undefined ? campus.toUpperCase() : "");
    } catch (e: any) {
        logger.error(NAMESPACE, "No course matching is found!", {departmentName, courseNumber});
        return res.status(400).send({
            message: e.message,
        });
    }
    return res.status(200).send({data: course});
})


export = router;