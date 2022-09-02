import * as cheerio from 'cheerio';
import {CheerioAPI} from 'cheerio';
import axios from "axios";
import {
    capitalizeStrings,
    formatStringToGetMajorPage,
    isTwoStringsContainTheSameWordsSeperatedWithAnd,
    removeExtraWhiteSpaces,
} from "../../utils/StringUtils";
import {createMajorModels, MajorDoesNotExist, MajorModel, Requirement} from "../../models/major/MajorModel";

const majorDoesNotExistFlag = "Requirements not found! Check other pages";
const majorNotFoundFlag = "Requirements might exist on the other major's page, try to invert your majors";

export async function getMajorCalendar(major: string, specialization: string): Promise<Array<MajorModel>> {
    let majorLink: string = await getMajorTree(major);
    const response = await axios.get(majorLink);
    const page = cheerio.load(response.data);
    page('sup').remove();
    page('.footnote').remove();
    let majorCapitalized = capitalizeStrings(major.split(" ")).join(" ");
    let specializationCapitalized = undefined;
    if (specialization) {
        specializationCapitalized = capitalizeStrings(specialization.split(" ")).join(" ");
    }
    let {scrapedData, requiredNames} = fetchRequirementsFromPage(page,
        majorCapitalized,
        specializationCapitalized);
    let majorModels = prepareMajorModels(scrapedData,
        requiredNames,
        majorCapitalized, specializationCapitalized
    );
    return majorModels;
}

function fetchRequirementsFromPage(page: CheerioAPI, major: string, specialization: string | undefined) {
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

function prepareMajorModels(result: any, names: any, major: string, specialization: string | undefined): Array<MajorModel> {
    let majorModels: Array<MajorModel> = createMajorModels(result);
    names = names.filter((s: string) => {
        return s != majorDoesNotExistFlag;
    })
    for (let i = 0; i < majorModels.length; i++) {
        majorModels[i].majorTitle = names[i];
    }
    majorModels = majorModels.filter(s => {
        return isTwoStringsContainTheSameWordsSeperatedWithAnd(s.majorTitle,
            major,
            specialization);
    })
    majorModels = majorModels.map((s) => {
        if (s.requirements.length == 0) {
            let req: Requirement = {
                name: majorNotFoundFlag,
                credits: "0"
            };
            s.requirements.push(req);
        }
        return s;
    })
    return majorModels;
}

async function getMajorTree(major: string): Promise<string> {
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
        throw new MajorDoesNotExist();
    }
    return "https://www.calendar.ubc.ca/vancouver/" + tree;
}