import {runAllCollections, runCollection} from "../testUtils/NewManUtils";
import logger from "../../src/utils/logger";

const NAMESPACE = "test/postman_tests/PostmanTestsRunner.ts";

runAllCollections("test/postman_tests/", NAMESPACE).then(() => {
    logger.debug(NAMESPACE, "Collections ran successfully");
});