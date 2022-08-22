import crypto from "crypto";
import fs from "fs";
import { HashFailureError } from "./error.js";

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
