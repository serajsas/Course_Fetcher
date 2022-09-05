import express from 'express';
import bodyParser from "body-parser";
import logger from "./utils/logger";
import config from "./utils/config";
import CourseRoutes from './routes/CourseRoutes';
import swaggerDocs from '../swagger.json';
import swaggerUI from 'swagger-ui-express';
import {connect} from "./utils/dbConnector";
import MajorRoutes from './routes/MajorRoutes';
import {initiateDBSSeeding} from "../seed/Seeder";

const NAMESPACE = "src/Server.ts";

const app = express();

app.use('/api/v1/docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));

app.use(bodyParser.urlencoded({extended: true}));

app.use(bodyParser.json());

app.use('/api/v1/course', CourseRoutes);
app.use('/api/v1/major', MajorRoutes);

app.get("*", (req, res) => {
    logger.debug(NAMESPACE, "Server received a request");
    return res.redirect('/api/v1/docs');
});

connect();

app.listen(config.server.port, () => {
    logger.debug(NAMESPACE, `Server is running ${config.server.hostname}:${config.server.port}`)
    initiateDBSSeeding().then(() => {
        logger.debug(NAMESPACE, "DB is fully seeded now!!")
    }).catch((e) => {
        logger.error(NAMESPACE, "DB is fully seeded now!!")
    })
})