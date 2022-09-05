import {CourseSeedDAO} from "./courses/CourseSeedDAO";
import {sleep} from "../src/utils/dbConnector";

export async function initiateDBSSeeding() {
    let coursesSeeder = new CourseSeedDAO();
    await initiateDBSeedingForCourses(coursesSeeder);
}

async function initiateDBSeedingForCourses(courseSeeder: CourseSeedDAO) {
    await courseSeeder.seedDBWithCourses("UBC Vancouver");
    await sleep(86400000);
    await courseSeeder.seedDBWithCourses("UBC Okanagan");
}