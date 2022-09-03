import mongoose from "mongoose";
import logger from "./logger";

const NAMESPACE = 'src/utils/dbConnector.ts';
const url = `mongodb://mongodb_container:27017`;

export function connect(): void {
    mongoose.connect(
        url, {autoIndex:false}
    ).then(function () {
        logger.debug(NAMESPACE, "DB Connection has been established!!");
    }).catch((err: any) => {
        logger.error(NAMESPACE, err.message);
    })
}
