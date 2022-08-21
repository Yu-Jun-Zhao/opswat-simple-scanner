import "dotenv/config";
import isNil from "lodash/isNil.js";
import { resolve, basename } from "path";
import { hashFile } from "./hash.js";
import { getHashReport } from "./opswat-api.js";
import { displayReport } from "./util.js";

async function app() {
	try {
		// retrieve path from commandline
		let filePath = process.argv[2];

		if (isNil(filePath)) {
			console.error("Unable to locate file. Please try again.");
			return;
		}

		filePath = resolve(filePath);
		console.log(`Absolute Path of file: ${filePath}`);

		// hash the file
		const hashHex = hashFile(filePath);

		const hashResult = await getHashReport(hashHex);
		// if result is found, print and exit;
		if (hashResult) {
			displayReport(basename(filePath), hashResult);
			return;
		}
	} catch (error) {
		console.error(`${error.name}: ${error.message}`);
	}
}

export default app;
