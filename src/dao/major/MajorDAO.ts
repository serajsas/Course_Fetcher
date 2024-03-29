import mongoose, {model} from "mongoose";
import {MajorDoesNotExist, MajorModel} from "../../models/major/MajorModel";
import logger from "../../utils/logger";
import {isTwoStringsContainTheSameWords} from "../../utils/StringUtils";

const NAMESPACE = "src/dao/major/MajorDAO.ts";

const MajorSchema = new mongoose.Schema(
    {
        majorTitle: {
            type: String,
            require: true,
            unique: true
        },
        requirements: [{name: String, credits: String}]
    }
);

const Major = model<MajorModel>('major', MajorSchema);

export class MajorDAO {
    constructor() {
        Major.createIndexes().then(() => {
            logger.debug(NAMESPACE, "INDEXES INITIALIZED!!");
        });
    }

    /**
     * This method inserts a major model and returns a majorTitle string
     * @param requirement
     */
    async insertMajorModel(toInsert: MajorModel): Promise<MajorModel> {
        let major = new Major(toInsert);
        try {
            await major.save(() => {
                logger.debug(NAMESPACE, "Major saved!");
            });
        } catch (e: any) {
            logger.error(NAMESPACE, e.message);
            return Promise.reject(e);
        }
        return Promise.resolve(major);
    }

    async getMajorModel(majorName: string, specialization?: string): Promise<Array<MajorModel>> {
        let result: Array<MajorModel>;
        let query = {
            $or: [{majorTitle: {$regex: `${majorName}`}},
                {majorTitle: {$regex: `${majorName.split(" ").reverse().join(" ")}`}}]
        };
        try {
            logger.debug(NAMESPACE, "Getting majors calendar");
            result = await Major.find({query}).exec();
            result = result.filter(s => {
                return isTwoStringsContainTheSameWords(s.majorTitle,
                    majorName,
                    specialization);
            });
            logger.debug(NAMESPACE, "Result of filter", result);
            if (result.length == 0) {
                logger.debug(NAMESPACE, "Major calendar does not exist in DB");
                return Promise.reject(new MajorDoesNotExist());
            }
            result = result.map((major) => {
                let newMajor: MajorModel = {
                    majorTitle: major.majorTitle, requirements: major.requirements.map((requirement) => {
                        return {name: requirement.name, credits: requirement.credits}
                    })
                };
                return newMajor;
            });
        } catch (e: any) {
            logger.error(NAMESPACE, e.message);
            return Promise.reject(e);
        }
        return Promise.resolve(result);
    }
}