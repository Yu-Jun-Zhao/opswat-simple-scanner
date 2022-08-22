import inquirer from "inquirer";
import isFinite from "lodash/isFinite.js";
import toNumber from "lodash/toNumber.js";

const questions = [
	{
		type: "rawlist",
		name: "content-type",
		message: "content-type?",
		choices: ["multipart/form-data", "application/octet-stream"],
	},
	{
		type: "input",
		name: "rescan_count",
		message: "rescan_count?",
		validate: (value = "") => {
			const num = toNumber(value);
			if (isFinite(num) && num >= 1 && num <= 720) {
				return true;
			} else {
				return "You must provide a number between 1 and 720";
			}
		},
	},
];

export function promptForHeaders() {
	return inquirer.prompt(questions);
}
