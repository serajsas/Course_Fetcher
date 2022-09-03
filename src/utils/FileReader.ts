import fs from "fs/promises";
import path from "path";

export class ErrorReadingFile extends Error {
    constructor(message?: string) {
        super(message);
        Error.captureStackTrace(this, ErrorReadingFile);
    }
}

export async function readLocalTestFile(filePath: string): Promise<Array<string>> {
    let preReqs: Array<string>;
    try {
        let data = await fs.readFile(path.join(__dirname, "../../", filePath), 'utf8');
        preReqs = data.split("\n");
    } catch (e: any) {
        throw new ErrorReadingFile("Error reading file!");
    }
    return preReqs;
}