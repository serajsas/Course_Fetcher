import * as cheerio from 'cheerio';
import {CheerioAPI} from 'cheerio';
import axios from "axios";
import {createMajorModels, MajorDoesNotExist, MajorModel} from "../models/Course/MajorModel";
import {formatString, isTwoStringsContainTheSameWordsSeperatedWithAnd,} from "./StringUtils";

export async function getMajorCalendar(major: string, specialization = "Major"): Promise<Array<MajorModel>> {
    let majorLink: string = await getMajorTree(major);

    const response = await axios.get(majorLink);
    const page = cheerio.load(response.data);

    page('sup').remove();
    page('.footnote').remove();

    let majorString = formatString(major);
    let specializationString = formatString(specialization);
    let {scrapedData, requiredNames} = fetchRequirementsFromPage(page);
    let majorModels = prepareMajorModels(scrapedData,
        requiredNames,
        majorString,
        specializationString);
    return majorModels;
}

function fetchRequirementsFromPage(page: CheerioAPI) {
    let scrapedData: any = [];
    let requiredNames: any = page(`h4:contains("Major"),h4:contains("Honours"), h4:contains("Dual Degree")`)
        .toArray().map(e => {
            if (page(e).next().next(`p`).text().trim().includes("See ")) {
                return "Requirements not found! Check other pages";
            }
            return page(e).text().trim();
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

function prepareMajorModels(result: any, names: any, major: string, specialization: string): Array<MajorModel> {
    let majorModels: Array<MajorModel> = createMajorModels(result);
    names = names.filter((s: string) => {
        return s != "Requirements not found! Check other pages";
    })
    for (let i = 0; i < majorModels.length; i++) {
        majorModels[i].majorTitle = names[i];
    }
    majorModels = majorModels.filter(s => {
        return isTwoStringsContainTheSameWordsSeperatedWithAnd(s.majorTitle, major, specialization);
    })
    majorModels = majorModels.map((s) => {
        if (s.requirements.length == 0) {
            s.requirements.push("Requirements might exist on the other major's page, try to invert your majors")
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
    let majorString = formatString(major);
    let tree: string | undefined = $(`a:contains(${majorString.split("and")[0]})`).attr("href");
    if (tree == undefined) {
        throw new MajorDoesNotExist();
    }
    return "https://www.calendar.ubc.ca/vancouver/" + tree;
}