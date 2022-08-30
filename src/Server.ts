import express from 'express';
import bodyParser from "body-parser";
import logger from "./utils/logger";
import config from "./utils/config";
import CourseRoutes from './routes/CourseRoutes';
import {connect} from "./utils/dbConnector";

const NAMESPACE = "src/Server.ts";

const app = express();
app.use(bodyParser.urlencoded({extended: true}));

app.use(bodyParser.json());

app.use('/', CourseRoutes);

app.get("*", (req, res) => {
    logger.info(NAMESPACE, "Server received a request")
});

connect();

app.listen(config.server.port, () => {
    logger.info(NAMESPACE, `Server is running ${config.server.hostname}:${config.server.port}`)
})