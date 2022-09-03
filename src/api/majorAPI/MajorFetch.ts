import {IMajorFetch} from "./IMajorFetch";
import {MajorModel} from "../../models/major/MajorModel";
import {MajorFetcher} from "../../controller/major/MajorFetcher";

export class MajorFetch implements IMajorFetch {
    private majorFetcher;

    constructor() {
        this.majorFetcher = new MajorFetcher();
    }

    getMajorRequirements(majorName: string, specialization: string): Promise<Array<MajorModel>> {
        return this.majorFetcher.getMajorRequirements(majorName, specialization);
    }

}