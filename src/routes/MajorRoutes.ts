import express from "express";
import {MajorFetch} from "../api/majorAPI/MajorFetch";
import {IMajorFetch} from "../api/majorAPI/IMajorFetch";
import logger from "../utils/logger";
import {MajorModel} from "../models/major/MajorModel";

const router = express.Router();
const NAMESPACE = "src/routes/MajorRoutes.ts";
const majorAPI: IMajorFetch = new MajorFetch();

router.get('/', async (req, res) => {
    const majorName: any = req.query.name;
    let specialization: any = req.query.specialization;
    logger.debug(NAMESPACE, "Responding to get request");
    if (!majorName) {
        logger.error(NAMESPACE, "majorName is required but found undefined!")
        return res.status(404).send();
    }
    let requirements: Array<MajorModel> = []
    try {
        requirements = await majorAPI.getMajorRequirements(majorName, specialization);
    } catch (e: any) {
        return res.status(400).send({message: e.message})
    }
    return res.status(200).send({data: requirements});
})

export = router;