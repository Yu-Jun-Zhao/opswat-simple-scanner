import "dotenv/config";
import isNil from "lodash/isNil.js";
import { resolve, basename } from "path";
import { hashFile } from "./hash.js";
import {
	analyzeFile,
	extendApiClientHeaders,
	getHashReport,
	getAnalysisResult,
} from "./opswat-api.js";
import { parseArgs, displayReport, apiPolling } from "./util.js";
import { promptForHeaders } from "./header-prompt.js";

// Main Application
async function app() {
	try {
		// retrieve path from commandline
		const { filePath, useDefaultHeaders } = parseArgs(process.argv);

		if (isNil(filePath)) {
			console.error("Unable to locate file. Please try again.");
			return;
		}

		const absfilePath = resolve(filePath);
		console.log(`Absolute Path of file: ${absfilePath}`);

		console.log("Hashing the file......");
		const hashHex = hashFile(absfilePath);
		console.log(`Hashed completed. The hash is: ${hashHex}`);

		console.log("Getting hash report");
		const hashResult = await getHashReport(hashHex);
		if (hashResult) {
			displayReport(basename(absfilePath), hashResult);
			return;
		}
		console.log("Hash report not found");

		if (!useDefaultHeaders) {
			console.log("Prompting for supported headers");
			const answers = await promptForHeaders();
			extendApiClientHeaders(answers);
		}

		console.log("Submitting file for analysis");
		const analyzeFileResponse = await analyzeFile(absfilePath);
		const dataId = analyzeFileResponse["data_id"];
		console.log("Submitted file and data_id:", dataId);

		console.log("Getting analysis");
		const pollIntervalMS = Number(process.env.API_FETCH_INTERVAL_IN_MS) || 100;
		const analyzedResult = await apiPolling(
			async () => {
				return await getAnalysisResult(dataId);
			},
			pollIntervalMS,
			"scan_results.progress_percentage",
			100
		);

		displayReport(basename(absfilePath), analyzedResult);
	} catch (error) {
		console.error(`${error.name}: ${error.message}`);
		console.log("Program exiting.");
	}
}

export default app;
