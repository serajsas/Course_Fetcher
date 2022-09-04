import newman from "newman";
import logger from "../../src/utils/logger";
import {readDirectoryFiles} from "../../src/utils/FileReader";
import * as path from "path";

export async function runAllCollections(directoryName: string, namespace: string) {
    let filesName = await readDirectoryFiles(directoryName);
    filesName.forEach((file) => {
        if (file.includes('.json')) {
            runCollection(path.join(directoryName, file), namespace);
        }
    })
}

export function runCollection(filePath: string, namespace: string) {
    newman.run({
        collection: require(path.join(__dirname, "../../", filePath)),
        reporters: 'cli'
    }, function (err) {
        if (err) {
            logger.error(namespace, err.message);
            throw err;
        }
    });
}
