import fs from "fs/promises";
import path from "path";

export class ErrorReadingFile extends Error {
    constructor(msg?: string) {
        super(msg);
    }
}

export async function readLocalTestFile(filePath: string): Promise<Array<string>> {
    let preReqs: Array<string>;
    try {
        let data = await fs.readFile(path.join(__dirname, "../test_files/", filePath), 'utf8');
        preReqs = data.split("\n");
    } catch (e) {
        throw new ErrorReadingFile("Error reading file!");
    }
    return preReqs;
}