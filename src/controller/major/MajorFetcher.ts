import {IMajorFetch} from "../../api/majorAPI/IMajorFetch";
import {MajorDoesNotExist, MajorModel} from "../../models/major/MajorModel";
import logger from "../../utils/logger";
import {MajorDAO} from "../../dao/major/MajorDAO";
import {MajorCalendarScraper} from "../../scrapers/major/MajorCalendarScraper";

const NAMESPACE = "src/controller/major/MajorFetcher.ts";

export class MajorFetcher implements IMajorFetch {
    private readonly majorDAO: MajorDAO;
    private majorCalendarScraper: MajorCalendarScraper;

    constructor() {
        this.majorDAO = new MajorDAO();
        this.majorCalendarScraper = new MajorCalendarScraper(this.majorDAO);
    }

    async getMajorRequirements(majorName: string, specialization: string): Promise<Array<MajorModel>> {
        let result: Array<MajorModel>;
        try {
            result = await this.majorDAO.getMajorModel(majorName, specialization);
        } catch (e: any) {
            result = await this.majorCalendarScraper.getMajorCalendar(majorName, specialization);
            if (result.length == 0) {
                logger.error(NAMESPACE, "major.length is zero for", {majorName, specialization});
                throw new MajorDoesNotExist();
            }
        }
        return Promise.resolve(result);
    }
}