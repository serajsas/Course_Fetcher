import mongoose from "mongoose";
import config from "./config";
import logger from "./logger";

const NAMESPACE = 'src/utils/dbConnector.ts';
const url = `mongodb+srv://${config.mongoose.user}:${config.mongoose.pass}@cluster0.sndj1.mongodb.net/Course`;

export function connect(): void {
    mongoose.connect(
        url
    ).then(function () {
        logger.info(NAMESPACE,"Connection has been established!!");
    }).catch(err => {
        console.log(err)
    })
};
