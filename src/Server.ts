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
import rateLimit from 'express-rate-limit'

const NAMESPACE = "src/Server.ts";

const app = express();

const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 15 minutes
    max: 50, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: false, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers,
    message:"We have noticed unusual activity coming from this IP Address."
})

// Apply the rate limiting middleware to all requests
app.use(limiter)

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