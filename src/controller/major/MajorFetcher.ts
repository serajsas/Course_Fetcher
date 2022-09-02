import {IMajorFetch} from "../../api/majorAPI/IMajorFetch";
import {MajorDoesNotExist, MajorModel} from "../../models/major/MajorModel";
import {getMajorCalendar} from "../../scrapers/major/MajorCalendarScraper";

export class MajorFetcher implements IMajorFetch {
    async getMajorRequirements(majorName: string, specialization: string): Promise<Array<MajorModel>> {
        let major = await getMajorCalendar(majorName, specialization);

        if (major.length == 0) {
            throw new MajorDoesNotExist();
        }
        return Promise.resolve(major);
    }
}