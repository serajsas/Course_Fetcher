import {IMajorFetch} from "./IMajorFetch";
import {MajorModel} from "../../models/major/MajorModel";
import {MajorFetcher} from "../../controller/major/MajorFetcher";
import logger from "../../utils/logger";
import {Promise} from "mongoose";

const NAMESPACE = "src/api/majorAPI/MajorFetch.ts";

export class MajorFetch implements IMajorFetch {
    private majorFetcher;

    constructor() {
        this.majorFetcher = new MajorFetcher();
    }

    async getMajorRequirements(majorName: string, specialization: string): Promise<Array<MajorModel>> {
        let requirementsOne: Array<MajorModel> = [];
        let requirementsTwo: Array<MajorModel> = [];
        try {
            logger.debug(NAMESPACE, "Fetching requirementsOne");
            requirementsOne = await this.majorFetcher.getMajorRequirements(majorName,
                specialization);
        } catch (e: any) {
            if (majorName.includes("and")) {
                try {
                    logger.debug(NAMESPACE, "Fetching requirementsTwo");
                    requirementsTwo = await this.majorFetcher.getMajorRequirements(
                        majorName.split(" ").reverse().join(" "),
                        specialization);
                } catch (e: any) {
                    logger.error(NAMESPACE, "requirementsTwo returned with no result");
                    return Promise.reject(e);
                }
                return Promise.resolve(requirementsTwo);
            } else {
                logger.error(NAMESPACE, "requirementsOne returned with no result and majorName does not include \"and\"");
                return Promise.reject(e);
            }
        }
        return Promise.resolve(requirementsOne);
    }

}