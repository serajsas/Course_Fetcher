import mongoose from "mongoose";
import logger from "./logger";

const NAMESPACE = 'src/utils/dbConnector.ts';
const url = `mongodb://mongodb_container:27017`;

export function connect(): void {
    mongoose.connect(
        url
    ).then(function () {
        logger.info(NAMESPACE,"DB Connection has been established!!");
    }).catch(err => {
        console.log(err)
    })
}
