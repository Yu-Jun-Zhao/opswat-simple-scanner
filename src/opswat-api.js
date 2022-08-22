import got from "got";
import { fileFromPath } from "formdata-node/file-from-path";
import { FormData } from "formdata-node";

import { getApiError } from "./util.js";

let apiClient = got.extend({
	prefixUrl: "https://api.metadefender.com/v4/",
	responseType: "json",
	throwHttpErrors: false,
	headers: {
		apiKey: process.env.API_KEY,
	},
});

/**
 * Add additional headers to the apiClient
 * @param {object} options - An JSON that contains header values 
 */
export function extendApiClientHeaders(options) {
	if (options["content-type"] === "multipart/form-data") {
		delete options["content-type"];
	}

	apiClient = apiClient.extend({
		headers: {
			...options,
		},
	});
}

/**
 * For getting the initial hash report.
 * @param {string} hash - the sha256 hash
 * @returns {object | undefined} - 200 - the body JSON of the result. 404 - undefined 
 */
export async function getHashReport(hash) {
	const data = await apiClient.get(`hash/${hash}`);

	const statusCode = data?.statusCode;
	const jsonBody = data?.body;

	if (statusCode !== 200 && statusCode !== 404) {
		const customError = getApiError(statusCode, jsonBody);
		throw customError;
	}

	return statusCode === 200 ? jsonBody : undefined;
}

/**
 * Send a file to the /file endpoint to analyze file
 * @param {string} filePath 
 * @returns {object} - 200 - the body JSON of the result.
 */
export async function analyzeFile(filePath) {
	const form = new FormData();
	form.set("file", await fileFromPath(filePath));
	const data = await apiClient.post("file", {
		body: form,
	});

	const statusCode = data?.statusCode;
	const jsonBody = data?.body;

	if (statusCode !== 200) {
		const customError = getApiError(statusCode, jsonBody);
		throw customError;
	}

	return jsonBody;
}

/**
 * To get back the full report of the analyzed report
 * @param {string} dataId - The id for looking up the analyzed result
 * @returns {object} - 200 - the body JSON of the result.
 */
export async function getAnalysisResult(dataId) {
	const data = await apiClient.get(`file/${dataId}`);

	const statusCode = data?.statusCode;
	const jsonBody = data?.body;

	if (statusCode !== 200) {
		const customError = getApiError(statusCode, jsonBody);
		throw customError;
	}

	return jsonBody;
}
