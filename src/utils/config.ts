import dotenv from 'dotenv';
import path from 'path';

dotenv.config({path: path.join(__dirname, '../', '../', '/.env')});

const MONGOOSE_USERNAME = process.env.DB_USERNAME;
const MONGOOSE_PASSWORD = process.env.DB_PASSWORD;
const PRODUCTION_FLAG = process.env.PRODUCTION;
const MONGOOSE = {
    user: MONGOOSE_USERNAME,
    pass: MONGOOSE_PASSWORD
};

const SERVER_HOSTNAME = process.env.SERVER_HOSTNAME;
const SERVER_PORT = process.env.SERVER_PORT;

const SERVER = {
    hostname: SERVER_HOSTNAME,
    port: SERVER_PORT
};

const config = {
    mongoose: MONGOOSE,
    server: SERVER,
    production: PRODUCTION_FLAG
};

export default config;