import express from 'express';
import bodyParser from "body-parser";
import logger from "./utils/logger";
import config from "./utils/config";
import CourseRoutes from './routes/CourseRoutes';
import {connect} from "./utils/dbConnector";
import MajorRoutes from './routes/MajorRoutes';

const NAMESPACE = "src/Server.ts";

const app = express();
app.use(bodyParser.urlencoded({extended: true}));

app.use(bodyParser.json());

app.use('/prerequisites', CourseRoutes);
app.use('/major', MajorRoutes);

app.get("*", (req, res) => {
    logger.debug(NAMESPACE, "Server received a request")
    return res.status(404).send();
});

connect();

app.listen(config.server.port, () => {
    logger.debug(NAMESPACE, `Server is running ${config.server.hostname}:${config.server.port}`)
})