import express from "express";
import {ICourseFetch} from "../api/courseAPI/ICourseFetch";
import {CourseFetch} from "../api/courseAPI/CourseFetch";
import {MajorFetch} from "../api/majorAPI/MajorFetch";
import {IMajorFetch} from "../api/majorAPI/IMajorFetch";
import logger from "../utils/logger";
import {MajorModel} from "../models/major/MajorModel";

const router = express.Router();
const NAMESPACE = "src/routes/MajorRoutes.ts";
const majorAPI: IMajorFetch = new MajorFetch();

router.get('/major/', async (req, res) => {
    const majorName: any = req.query.major;
    let specialization: any = req.query.specialization;
    logger.info(NAMESPACE, "Responding to get request");
    if (!majorName) {
        return res.status(404).send();
    }
    let requirementsOne: Array<MajorModel> = [];
    let requirementsTwo: Array<MajorModel> = [];
    try {
        requirementsOne = await majorAPI.getMajorRequirements(majorName,
            specialization);
    } catch (e: any) {
        if (majorName.includes("and")) {
            try {
                requirementsTwo = await majorAPI.getMajorRequirements(
                    majorName.split(" ").reverse().join(" "),
                    specialization);
            } catch (e: any) {
                return res.status(400).send({
                    message: e.message,
                });
            }
            return res.status(200).send(requirementsTwo);
        } else {
            return res.status(400).send({
                message: e.message,
            });
        }
    }
    return res.status(200).send(requirementsOne);
})

export = router;