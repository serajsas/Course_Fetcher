import dotenv from 'dotenv';
import path from 'path';

dotenv.config({path: path.join(__dirname, '../', '../', '/.env')});

const MONGOOSE_USERNAME = process.env.DB_USERNAME;
const MONGOOSE_PASSWORD = process.env.DB_PASSWORD;
const ENV = process.env.ENV;
const MONGOOSE = {
    user: MONGOOSE_USERNAME,
    pass: MONGOOSE_PASSWORD
};

const SERVER_HOSTNAME = process.env.SERVER_HOSTNAME;
const SERVER_PORT = process.env.PORT || 8000;

const SERVER = {
    hostname: SERVER_HOSTNAME,
    port: SERVER_PORT
};

const config = {
    mongoose: MONGOOSE,
    server: SERVER,
    env: ENV
};

export default config;