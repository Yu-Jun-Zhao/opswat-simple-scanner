import crypto from "crypto";
import fs from "fs";
import { HashFailureError } from "./error.js";

export function hashFile(file, algorithm = "sha256") {
	try {
		console.log("Hashing the file......");

		const dataBuffer = fs.readFileSync(file);
		const hasher = crypto.createHash(algorithm);
		hasher.update(dataBuffer);
		const hashedHex = hasher.digest("hex").toUpperCase();

		console.log(`Hashed completed. The hash is: ${hashedHex}`);

		return hashedHex;
	} catch (error) {
		throw new HashFailureError(algorithm, error.message);
	}
}
