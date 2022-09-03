import {runAllCollections} from "../testUtils/NewManUtils";
import logger from "../../src/utils/logger";

const NAMESPACE = "test/postman_tests/testsRunner.spec.ts";

runAllCollections("test/postman_tests/", NAMESPACE).then(() => {
    logger.debug(NAMESPACE, "Collections ran successfully");
});

