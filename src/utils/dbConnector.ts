import mongoose from "mongoose";
import logger from "./logger";
import config from "./config";

const NAMESPACE = 'src/utils/dbConnector.ts';
let url = `mongodb://mongodb_container:27017/ubcapi`;

export function connect(): void {
    if(config.env == "PRODUCTION"){
        url = `mongodb+srv://${process.env.USERNAME}:${process.env.DB_PASSWORD}@cluster0.sndj1.mongodb.net/?retryWrites=true&w=majority/ubcapi`;
    }
    mongoose.connect(
        url,
        {autoIndex: false}
    ).then(function () {
        logger.debug(NAMESPACE, "DB Connection has been established!!");
    }).catch((err: any) => {
        logger.error(NAMESPACE, err.message);
    })
}
