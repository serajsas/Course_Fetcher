import {CourseSeedDAO} from "./courses/CourseSeedDAO";

export async function initiateDBSSeeding() {
    let coursesSeeder = new CourseSeedDAO();
    let isCoursesDBSeeded = await coursesSeeder.isCoursesDBSeeded();
    await initiateDBSeedingForCourses(coursesSeeder);


}

async function initiateDBSeedingForCourses(courseSeeder: CourseSeedDAO) {
    // await courseSeeder.seedDBWithCourses("UBC Vancouver");
    // await sleep(86400000);
    // await courseSeeder.seedDBWithCourses("UBC Okanagan");
}