import express from 'express';
import bodyParser from "body-parser";
import logger from "./utils/logger";
import config from "./utils/config";

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const NAMESPACE = "src/Server.ts";

app.get("*", (req, res) => {
    logger.info(NAMESPACE, "Server received a request")
});

app.listen(config.server.port, () => {
    logger.info(NAMESPACE, `Server is running ${config.server.hostname}:${config.server.port}`)
})