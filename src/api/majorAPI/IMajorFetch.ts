import {MajorModel} from "../../models/major/MajorModel";

export interface IMajorFetch {
    /**
     * This method takes a major name and the specialization and returns the major's requirements.
     * Specialization could be a major name or (Honours, Combined Honours, Major, Combined Major,Dual Degree).
     * If multiple major names are matched, then all requirements for these majors will be returned.
     * @param majorName
     * @param specialization
     */
    getMajorRequirements(majorName: string, specialization: string): Promise<Array<MajorModel>>;
}