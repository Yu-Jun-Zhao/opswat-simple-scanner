import { ApiBadRequestError, ApiUnauthorizedError, ApiInternalServerError } from "./error.js";

// log results in console
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
