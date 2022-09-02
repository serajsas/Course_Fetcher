export function capitalizeStrings(arr: Array<string>): Array<string> {
    let words: Array<string> = [];
    for (let i = 0; i < arr.length; i++) {
        if (!arr[i]) {
            continue;
        }
        if (arr[i].includes('and')) {
            words.push('and');
            continue;
        }
        words.push(arr[i][0].toUpperCase() + arr[i].slice(1).toLowerCase());
    }
    return words;
}

export function formatStringToGetMajorPage(major: string) {
    if (major == "Cellular and Physiological Sciences" ||
        major == "Earth and Ocean Sciences" ||
        major == "Microbiology and Immunology") {
        return major;
    }
    let majors: Array<string> = major.split(" ").map(x => x.trim());
    majors = capitalizeStrings(majors);
    major = majors.join(" ")
    majors = major.split("and").map(x => x.trim());
    if (majors.length <= 1) {
        majors = major.split(" ").map(x => x.trim());
        majors = capitalizeStrings(majors);
        if (majors.length == 1) {
            return majors.join("");
        }
        return majors.join(" ");
    } else {
        return majors[0];
    }
}

export function removeExtraWhiteSpaces(s: string) {
    let arr: Array<string> = s.split(" ");
    arr = arr.map(s => s.trim());
    return arr.join(" ");
}

function isAnagram(pageMajor: string, major: string | undefined) {
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

export function isTwoStringsContainTheSameWordsSeperatedWithAnd(pageMajor: string, major: string, specialization: string | undefined): boolean {
    if (pageMajor == undefined)
        return false;
    pageMajor = extractMajorNameOnly(pageMajor);
    let majorCopy = isAnagram(pageMajor, major);
    let specializationCopy = isAnagram(pageMajor, specialization);
    if (specialization) {
        return equals(specializationCopy.a_copy, specializationCopy.b_copy);
    }
    return equals(majorCopy.a_copy, majorCopy.b_copy);
}

function extractMajorNameOnly(major: string): string {
    let extractedMajor = major.split(":")[1];
    let result = "";
    for (let i = 0; i < extractedMajor.length; i++) {
        if (extractedMajor[i] == '(') {
            break;
        }
        result = result + extractedMajor[i];
    }
    return result.trim();
}

function equals(a: any, b: any) {
    return a.length === b.length &&
        a.every((v: any, i: any) => v === b[i]);
}