import {MajorModel} from "../../models/major/MajorModel";

export interface IMajorFetch {

    getMajorRequirements(majorName: string, specialization: string): Promise<Array<MajorModel>>;
}