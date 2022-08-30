import express from "express";
import logger from "../utils/logger";
import {ICourseFetch} from "../api/ICourseFetch";
import {CourseFetch} from "../api/CourseFetch";
import {ICourse} from "../models/Course/CourseModel";

const router = express.Router();

const NAMESPACE = "src/routes/CourseRoutes.ts";

const courseAPI: ICourseFetch = new CourseFetch();

router.get('/prerequisites/', async (req, res) => {
    const departmentName: any = req.query.dept;
    const courseNumber: any = req.query.number;
    logger.info(NAMESPACE, "Responding to get request");
    let preReqs: ICourse;
    try {
        preReqs = await courseAPI.getCoursePreReqs(departmentName, courseNumber);
    } catch (e: any) {
        return res.status(400).send({
            message: e.message,
        });
    }
    return res.status(200).send(preReqs);
})


export = router;