import {IMajorFetch} from "../../api/majorAPI/IMajorFetch";
import {MajorDoesNotExist, MajorModel} from "../../models/major/MajorModel";
import {getMajorCalendar} from "../../scrapers/major/MajorCalendarScraper";
import logger from "../../utils/logger";

const NAMESPACE = "src/controller/major/MajorFetcher.ts";

export class MajorFetcher implements IMajorFetch {
    async getMajorRequirements(majorName: string, specialization: string): Promise<Array<MajorModel>> {
        let major = await getMajorCalendar(majorName, specialization);

        if (major.length == 0) {
            logger.error(NAMESPACE, "major.length is zero for", {majorName, specialization});
            throw new MajorDoesNotExist();
        }
        return Promise.resolve(major);
    }
}