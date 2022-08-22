import crypto from "crypto";
import fs from "fs";
import { HashFailureError } from "./error.js";

/**
 * 
 * @param {string} file - path to the file 
 * @param {string} algorithm - sha256, sha1, md5
 * @returns {string} - the hash in hex format
 */
export function hashFile(file, algorithm = "sha256") {
	try {
		const dataBuffer = fs.readFileSync(file);
		const hasher = crypto.createHash(algorithm);
		hasher.update(dataBuffer);
		const hashHex = hasher.digest("hex").toUpperCase();

		return hashHex;
	} catch (error) {
		throw new HashFailureError(algorithm, error.message);
	}
}
