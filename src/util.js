import arg from "arg";
import has from "lodash/has.js";
import get from "lodash/get.js";
import round from "lodash/round.js";
import {
	ApiBadRequestError,
	ApiUnauthorizedError,
	ApiNotFoundError,
	ApiInternalServerError,
} from "./error.js";

/**
 * For logging the report.
 * @param {string} fileName - name of the uploaded file
 * @param {object} result - the report
 */
export function displayReport(fileName, result) {
	console.log("Report found.");
	console.log("filename:", fileName);

	const scanResults = result.scan_results;
	const fileInfo = result.file_info;

	if (scanResults && fileInfo) {
		console.log("display_name (from API):", fileInfo["display_name"]);
		console.log(
			"overall_status:",
			scanResults["scan_all_result_a"] === "No Threat Detected"
				? "Clean"
				: scanResults["scan_all_result_a"]
		);

		displayScanDetails(scanResults["scan_details"]);
	} else {
		console.log("Unable to locate scan_results or file_info");
	}
}

function displayScanDetails(scanDetails) {
	for (const engine in scanDetails) {
		const engineDetail = scanDetails[engine];
		console.log("engine:", engine);
		console.log("threat_found:", engineDetail["threat_found"] || "Clean");
		console.log("scan_result:", engineDetail["scan_result_i"]);
		console.log("def_time", engineDetail["def_time"]);
	}
}

const errorMap = new Map([
	[400, ApiBadRequestError],
	[401, ApiUnauthorizedError],
	[404, ApiNotFoundError],
	[500, ApiInternalServerError],
]);


export function getApiError(statusCode, body) {
	if (errorMap.has(statusCode)) {
		const CustomError = errorMap.get(statusCode);
		const errorMessages = body?.error?.messages;

		// assuming all messages in error is an array
		return new CustomError(errorMessages[0]);
	}
	return new Error("Unknown Error");
}

/**
 * For getting the flag and filePath
 * @param {string[]} processArgv - process.argv 
 * @returns {object} 
 */
export function parseArgs(processArgv) {
	const args = arg(
		{
			"-d": arg.COUNT,
		},
		{ argv: processArgv.slice(2)}
	);

	return {
		useDefaultHeaders: args['-d'] > 0 ? true : false,
		filePath: args._[0]
	}
}

function sleepForMilliSecond(ms) {
	return new Promise((resolve) => setTimeout(resolve, round(ms)));
}

/**
 * Keeps calling the async function until the data contains the match.
 * When value of data[pathKey] matches the match, stop polling
 * @param {function} asyncCallback - an async function to be called every ms 
 * @param {number} ms - millisecond
 * @param {string} pathKey - path to find the key in the data
 * @param {string | number} match - for defining when to stop polling
 * @returns 
 */
export async function apiPolling(asyncCallback, ms, pathKey, match) {
	if (typeof asyncCallback !== "function") {
		return;
	}

	while (true) {
		let data = await asyncCallback();
		if (has(data, pathKey)) {
			const val = get(data, pathKey);

			console.log(`${pathKey}: ${val}`);

			if (val == match) {
				return data;
			}
		}

		await sleepForMilliSecond(ms);
	}
}
