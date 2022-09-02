import mongoose, {model} from "mongoose";
import {MajorModel} from "../../models/major/MajorModel";
import logger from "../../utils/logger";

const NAMESPACE = "src/dao/major/MajorDAO.ts";

const MajorSchema = new mongoose.Schema(
    {
        majorTitle: {
            type: String,
            require: true
        },
        requirements: [{name: String, credits: String}]
    }
);

const Major = model<MajorModel>('major', MajorSchema);

export class MajorDAO {
    /**
     * This method inserts a major model and returns a majorTitle string
     * @param requirement
     */
    async insertMajorModel(toInsert: MajorModel): Promise<MajorModel> {
        let major = new Major(toInsert);
        try {
            await major.save(() => {
                logger.info(NAMESPACE, "Major saved!");
            });
        } catch (e: any) {
            logger.error(NAMESPACE, e.message);
            return Promise.reject();
        }
        return Promise.resolve(major);
    }
}