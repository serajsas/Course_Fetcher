export function capitalizeStrings(arr: Array<string>): Array<string> {
    let words: Array<string> = [];
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] == 'and') {
            words.push('and');
            continue;
        }
        words.push(arr[i][0].toUpperCase() + arr[i].slice(1).toLowerCase());
    }
    return words;
}

export function formatString(major: string) {
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

export function isTwoStringsContainTheSameWordsSeperatedWithAnd(pageMajor: string, major: string, specialization: string): boolean {
    if (pageMajor == undefined || !pageMajor.includes(specialization))
        return false;
    pageMajor = extractMajorNameOnly(pageMajor);
    let a_copy = pageMajor.split(" ");
    a_copy = a_copy.map(s => s.trim().toLowerCase())
    a_copy.sort();
    let b_copy = major.split(" ");
    b_copy = b_copy.map(s => s.trim().toLowerCase())
    b_copy.sort();
    return equals(a_copy, b_copy);
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