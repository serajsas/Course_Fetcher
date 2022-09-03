import logger from "./logger";
import {InvalidMajorString} from "../models/major/MajorModel";

const NAMESPACE = "src/utils/StringUtils.ts";

export function isTwoStringsContainTheSameWords(pageMajor: string, major: string, specialization: string | undefined): boolean {
    logger.debug(NAMESPACE, "isTwoStringsContainTheSameWords", {pageMajor, major, specialization});
    if (pageMajor == undefined) {
        logger.debug(NAMESPACE, "isTwoStringsContainTheSameWords is returning undefined!!");
        return false;
    }
    let pageMajorCapitalized = capitalizeFirstLetterAndLowerRest(pageMajor.split(" ")).join(" ");
    let majorCapitalized = capitalizeFirstLetterAndLowerRest(major.split(" ")).join(" ");
    let specializationCapitalized: string = "";
    if (specialization) {
        specializationCapitalized = capitalizeFirstLetterAndLowerRest(specialization.split(" ")).join(" ");
    }
    let extractedMajor = extractMajorNameOnly(pageMajorCapitalized);
    let majorCopy = isAnagram(extractedMajor, majorCapitalized);
    let specializationCopy = isAnagram(extractedMajor, specializationCapitalized);
    let majorCopyResult = equals(majorCopy.a_copy, majorCopy.b_copy);
    if (specialization) {
        let result = equals(specializationCopy.a_copy, specializationCopy.b_copy) ||
            (pageMajorCapitalized.includes(specializationCapitalized) && majorCopyResult);
        logger.debug(NAMESPACE, "isTwoStringsContainTheSameWords", {specializationCopy, result});
        return result;
    }
    logger.debug(NAMESPACE, "isTwoStringsContainTheSameWords", {majorCopy, majorCopyResult});
    return majorCopyResult;
}

export function capitalizeFirstLetterAndLowerRest(arr: Array<string>): Array<string> {
    logger.debug(NAMESPACE, "capitalizeStrings", arr);
    let words: Array<string> = [];
    for (let i = 0; i < arr.length; i++) {
        if (!arr[i]) {
            continue;
        }
        if (arr[i].toLowerCase().includes('and')) {
            words.push('and');
            continue;
        }
        words.push(arr[i][0].toUpperCase() + arr[i].slice(1).toLowerCase());
    }
    return words;
}

export function formatStringToGetMajorPage(major: string) {
    logger.debug(NAMESPACE, "formatStringToGetMajorPage", major);
    let majors: Array<string> = major.split(" ").map(x => x.trim());
    majors = capitalizeFirstLetterAndLowerRest(majors);
    major = majors.join(" ")
    if (major == "Cellular and Physiological Sciences" ||
        major == "Earth and Ocean Sciences" ||
        major == "Microbiology and Immunology") {
        return major;
    }
    majors = major.split("and").map(x => x.trim());
    if (majors.length <= 1) {
        majors = major.split(" ").map(x => x.trim());
        majors = capitalizeFirstLetterAndLowerRest(majors);
        if (majors.length == 1) {
            return majors.join("");
        }
        return majors.join(" ");
    } else {
        return majors[0];
    }
}

function removeExtraWhiteSpaces(s: string) {
    logger.debug(NAMESPACE, "removeExtraWhiteSpaces", s);
    let arr: Array<string> = s.split(" ");
    arr = arr.map(s => s.trim());
    return arr.join(" ");
}

function isAnagram(pageMajor: string, major: string | undefined) {
    logger.debug(NAMESPACE, "isAnagram", {pageMajor, major});
    if (major == undefined)
        return {};
    let a_copy = pageMajor.split(" ");
    a_copy = a_copy.map(s => s.trim().toLowerCase())
    a_copy.sort();
    let b_copy = major.split(" ");
    b_copy = b_copy.map(s => s.trim().toLowerCase())
    b_copy.sort();
    return {a_copy, b_copy};
}

function extractMajorNameOnly(major: string): string {
    if (!major.includes(":")) {
        throw new InvalidMajorString();
    }
    let extractedMajor = major.split(":")[1];
    let result = "";
    for (let i = 0; i < extractedMajor.length; i++) {
        if (extractedMajor[i] == '(') {
            break;
        }
        result = result + extractedMajor[i];
    }
    logger.debug(NAMESPACE, "extractMajorNameOnly", result.trim());
    return result.trim();
}

function equals(a: any, b: any) {
    return a.length === b.length &&
        a.every((v: any, i: any) => v === b[i]);
}