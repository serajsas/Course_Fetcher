export class MajorDoesNotExist extends Error {
    constructor() {
        super("Invalid major!!");
        Error.captureStackTrace(this, MajorDoesNotExist);
    }
}

export class InvalidMajorString extends Error {
    constructor() {
        super("Invalid major!!");
        Error.captureStackTrace(this, MajorDoesNotExist);
    }
}

export interface MajorModel {
    majorTitle: string,
    requirements: Array<Requirement>
}

export interface Requirement {
    name: string,
    credits: string
}

export function createMajorModels(result: Array<Array<string>>): Array<MajorModel> {
    let foundMajors: MajorModel[] = result.map(createMajorModel);
    return foundMajors;
}

function createMajorModel(majorResult: Array<string>): MajorModel {
    let majorModel: MajorModel = {
        majorTitle: "",
        requirements: []

    };
    let result = createYearCourses(majorResult);
    majorModel.requirements = result;
    return majorModel;
}

function createYearCourses(majorResult: Array<string>): Array<Requirement> {
    let stack: string[] = [];
    for (let i = 0; i < majorResult.length; i++) {
        if (majorResult[i] == "Total Credits") {
            i = i + 1;
            continue;
        }
        stack.push(majorResult[i]);
    }
    return processStack(stack);
}

function processStack(stack: string[]): Requirement[] {
    let result: Requirement[] = [];
    while (stack.length > 0) {
        let credits: any = stack.pop();
        let requirement: any = stack.pop();
        let req: Requirement = {name: requirement, credits: credits};
        result.push(req);
    }
    result = result.reverse();
    return result;
}