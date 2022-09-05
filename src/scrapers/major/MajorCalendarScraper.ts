import * as cheerio from 'cheerio';
import {CheerioAPI} from 'cheerio';
import axios from "axios";
import {
    capitalizeFirstLetterAndLowerRest,
    formatStringToGetMajorPage,
    isTwoStringsContainTheSameWords,
    removeExtraWhiteSpaces,
} from "../../utils/StringUtils";
import {createMajorModels, MajorDoesNotExist, MajorModel, Requirement} from "../../models/major/MajorModel";
import {MajorDAO} from "../../dao/major/MajorDAO";
import logger from "../../utils/logger";
import {Promise} from "mongoose";

const NAMESPACE = "src/scrapers/major/MajorCalendarScraper.ts";
const majorDoesNotExistFlag = "Requirements not found! Check other pages";
const majorNotFoundFlag = "Requirements might exist on the other major's page, try to invert your majors";

export class MajorCalendarScraper {
    private majorDAO: MajorDAO;

    constructor(majorDAO: MajorDAO) {
        this.majorDAO = majorDAO;
    }

    async getMajorCalendar(major: string, specialization: string): Promise<Array<MajorModel>> {
        logger.debug(NAMESPACE, "Starting major scrapping", {major, specialization});
        let majorLink: string = await this.getMajorTree(major);
        const response = await axios.get(majorLink);
        const page = cheerio.load(response.data);
        page('sup').remove();
        page('.footnote').remove();
        let majorCapitalized = capitalizeFirstLetterAndLowerRest(major.split(" ")).join(" ");
        let specializationCapitalized = undefined;
        if (specialization) {
            specializationCapitalized = capitalizeFirstLetterAndLowerRest(specialization.split(" ")).join(" ");
        }
        let {scrapedData, requiredNames} = this.fetchRequirementsFromPage(page,
            majorCapitalized,
            specializationCapitalized);
        let majorModels = this.prepareMajorModels(scrapedData,
            requiredNames,
            majorCapitalized, specializationCapitalized
        );
        return Promise.resolve(majorModels);
    }


    private fetchRequirementsFromPage(page: CheerioAPI, major: string, specialization: string | undefined):
        { requiredNames: any; scrapedData: any } {
        let scrapedData: any = [];
        let requiredNames: any = page(`h4:contains("Major"), h4:contains("Honours"), h4:contains("Dual Degree"), h4:contains(${major}), h4:contains(${specialization})`)
            .toArray().map(e => {
                if (page(e).next().next(`p`).text().trim().includes("See ")) {
                    return majorDoesNotExistFlag;
                }
                return removeExtraWhiteSpaces(page(e).text().trim());
            })
        page(`table`).each((function (e, i) {
            const row: any = [];
            page(this).find("td").each(function (i, e) {
                row.push(page(this).text().trim());
            });
            scrapedData.push(row);
        }));
        return {scrapedData, requiredNames};
    }

    private prepareMajorModels(result: any, names: any, major: string, specialization: string | undefined): Array<MajorModel> {
        let majorModels: Array<MajorModel> = createMajorModels(result);

        names = names.filter((s: string) => {
            return s != majorDoesNotExistFlag;
        });

        for (let i = 0; i < majorModels.length; i++) {
            majorModels[i].majorTitle = names[i];
        }

        majorModels = majorModels.map((s) => {
            if (s.requirements.length == 0) {
                let req: Requirement = {
                    name: majorNotFoundFlag,
                    credits: "0"
                };
                s.requirements.push(req);
            }
            return s;
        });

        majorModels.forEach(async (model) => {
            await this.majorDAO.insertMajorModel(model);
        });

        majorModels = majorModels.filter(s => {
            return isTwoStringsContainTheSameWords(s.majorTitle,
                major,
                specialization);
        })

        if (majorModels.length == 0) {
            return Promise.reject(new MajorDoesNotExist());
        }

        return majorModels;
    }

    private async getMajorTree(major: string): Promise<string> {
        let uriComponent = "index.cfm?tree=12,215,410,1457";
        const response =
            await axios.get(`https://www.calendar.ubc.ca/vancouver/${uriComponent}`);
        const $ = cheerio.load(response.data);
        let majorString = formatStringToGetMajorPage(major);
        let tree: string | undefined = $(`a:contains(${majorString.split("and")[0]})`).attr("href");
        if (majorString == "Neuroscience") {
            tree = "index.cfm?tree=12,215,410,1701";
        }
        if (tree == undefined) {
            return Promise.reject(new MajorDoesNotExist());
        }
        return Promise.resolve("https://www.calendar.ubc.ca/vancouver/" + tree);
    }
}
