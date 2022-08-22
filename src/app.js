import "dotenv/config";
import isNil from "lodash/isNil.js";
import { resolve, basename } from "path";
import { hashFile } from "./hash.js";
import { getHashReport, analyzeFile, getAnalysisResult } from "./opswat-api.js";
import { displayReport, apiPolling } from "./util.js";

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

		console.log("Hashing the file......");
		const hashHex = hashFile(filePath);
		console.log(`Hashed completed. The hash is: ${hashHex}`);

		console.log("Getting hash report");
		const hashResult = await getHashReport(hashHex);
		if (hashResult) {
			displayReport(basename(filePath), hashResult);
			return;
		}
		console.log("Hash report not found");

		console.log("Submitting file for analysis");
		const analyzeFileResponse = await analyzeFile(filePath);
		const dataId = analyzeFileResponse["data_id"];
		console.log("Submitted file and data_id:", dataId);

		console.log("Getting analysis report");
		const pollIntervalMS = Number(process.env.API_FETCH_INTERVAL_IN_MS) || 100;
		const analyzedResult = await apiPolling(
			async () => {
				return await getAnalysisResult(dataId);
			},
			pollIntervalMS,
			"scan_results.progress_percentage",
			100
		);

		displayReport(basename(filePath), analyzedResult);
	} catch (error) {
		console.error(`${error.name}: ${error.message}`);
		console.log("Program exiting.");
	}
}

export default app;
