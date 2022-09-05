import {IMajorFetch} from "../../api/majorAPI/IMajorFetch";
import {MajorDoesNotExist, MajorModel} from "../../models/major/MajorModel";
import logger from "../../utils/logger";
import {MajorDAO} from "../../dao/major/MajorDAO";
import {MajorCalendarScraper} from "../../scrapers/major/MajorCalendarScraper";
import {is} from "cheerio/lib/api/traversing";
import {doesMajorContainOriginalAnd} from "../../utils/StringUtils";
import {Promise} from "mongoose";

const NAMESPACE = "src/controller/major/MajorFetcher.ts";

export class MajorFetcher implements IMajorFetch {
    private readonly majorDAO: MajorDAO;
    private majorCalendarScraper: MajorCalendarScraper;

    constructor() {
        this.majorDAO = new MajorDAO();
        this.majorCalendarScraper = new MajorCalendarScraper(this.majorDAO);
    }

    async getMajorRequirements(majorName: string, specialization: string): Promise<Array<MajorModel>> {
        let majors: Array<string> = majorName.split("and");
        let resultOne: Array<MajorModel> = [];
        let resultTwo: Array<MajorModel> = [];
        try {
            if (doesMajorContainOriginalAnd(majorName)) {
                resultOne = await this.majorDAO.getMajorModel(majorName, specialization);
                if (resultOne.length != 0) {
                    return Promise.resolve(resultOne);
                }
            } else if (majors.length > 1 && !doesMajorContainOriginalAnd(majorName)) {
                let majorResult = await this.majorDAO.getMajorModel(majorName, specialization);
                if (majorResult.length != 0) {
                    return Promise.resolve(majorResult);
                }
                resultOne = await this.majorDAO.getMajorModel(majors[0], specialization);
                resultTwo = await this.majorDAO.getMajorModel(majors[1], specialization);
                if (resultOne.length != 0 && resultTwo.length != 0) {
                    return Promise.reject(new MajorDoesNotExist());
                } else if (resultOne.length == 0 || resultTwo.length == 0) {
                    resultOne = await this.majorCalendarScraper.getMajorCalendar(majorName, specialization);
                }
            } else {
                resultOne = await this.majorDAO.getMajorModel(majorName, specialization);
                if (resultOne.length == 0) {
                    resultOne = await this.majorCalendarScraper.getMajorCalendar(majorName, specialization);
                }
                return Promise.resolve(resultOne);
            }
        } catch (e: any) {
            return Promise.reject(new MajorDoesNotExist());
        }
        return Promise.resolve(resultOne);
    }
}