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

export async function getHashReport(hash) {
	const data = await apiClient.get(`hash/${hash}`);

	const statusCode = data?.statusCode;
	const jsonBody = data?.body;

	if (statusCode !== 200 && statusCode !== 404) {
		const customError = getApiError(statusCode, jsonBody);
		throw customError;
	}

	// 200 Found report
	// 404 Not found need to submit file
	return statusCode === 200 ? jsonBody : undefined;
}

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
