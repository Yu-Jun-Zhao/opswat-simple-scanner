export class HashFailureError extends Error {
	constructor(algorithm, errorMessage) {
		super(`Unable to hash file to ${algorithm} format. ${errorMessage}`);
		this.name = "HashFailureError";
	}
}

class ApiHttpError extends Error {
	constructor(statusCode, errorMessage) {
		super(`Api Error detected. StatusCode: ${statusCode}. Reason: ${errorMessage}`);
		this.statusCode = statusCode;
		this.name = "ApiHttpError";
	}
}

export class ApiBadRequestError extends ApiHttpError {
	constructor(errorMessage) {
		super(400, errorMessage);
		this.name = "ApiBadRequestError";
	}
}

export class ApiUnauthorizedError extends ApiHttpError {
	constructor(errorMessage) {
		super(401, errorMessage);
		this.name = "ApiUnauthorizedError";
	}
}

export class ApiNotFoundError extends ApiHttpError {
	constructor(errorMessage) {
		super(404, errorMessage);
		this.name = "ApiNotFoundError";
	}
}

export class ApiInternalServerError extends ApiHttpError {
	constructor(errorMessage) {
		super(500, errorMessage);
		this.name = "ApiInternalServerError";
	}
}
