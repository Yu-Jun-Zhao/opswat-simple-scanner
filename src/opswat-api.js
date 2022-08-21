import got from "got";
import { getApiError } from "./util.js";

const apiClient = got.extend({
	prefixUrl: "https://api.metadefender.com/v4/",
	responseType: "json",
    throwHttpErrors: false,
	headers: {
		apiKey: process.env.API_KEY,
	},
});

export async function getHashReport(hash) {

    console.log("Getting hash report");

	const data = await apiClient.get(`hash/${hash}`);

    const statusCode = data?.statusCode;
    const jsonBody = data?.body;

    if(statusCode !== 200 && statusCode !== 404){
        const customError = getApiError(statusCode, jsonBody);
        throw customError;
    }

    // 200 Found report
    // 404 Not found need to submit file
    return statusCode === 200 ? jsonBody : undefined;
}
