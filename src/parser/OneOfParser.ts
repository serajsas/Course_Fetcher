import {CourseModel} from "../models/Course/CourseModel";

// oneOf: Array<Array<CourseModel>>,

export function oneOfParser(preReqs: string): Array<Array<CourseModel>> {
    let parsedResult: Array<Array<CourseModel>> = [];
    let oneOfResult: Array<string> =
        preReqs.split(new RegExp(":"));
    console.log(oneOfResult);
    // @ts-ignore
    return null;
}


// Pre-reqs: One of CPSC 302, CPSC 303, MATH 307.
// Pre-reqs: One of CPSC 313, CPEN 331 and one of CPSC 317, ELEC 331.
// Pre-reqs: One of CHEM 211, CHEM 215 and all of CHEM 208, CHEM 213, CHEM 245.
// Pre-reqs: One of CHEM 304, CHEM 305, PHYS 203.


console.log(oneOfParser("Pre-reqs: One of CPSC 302, CPSC 303, MATH 307."));