"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const colors = require("colors");
const config_1 = require("./config");
exports.regexp_int = "((\\d{2,4}(.(\\d[1-9])|([1-9]\\d))?)|[1-9])";
exports.regexp_string = "[a-zA-Z0-9]+";
exports.regexp_version = "([a-zA-Z0-9]+\\.[a-zA-Z0-9]+\\.[a-zA-Z0-9]+)";
const regexp_identifier = /%%[a-zA-Z0-9]+%/;
function replacer(input) {
    let output = "";
    let option = "";
    let splitInput = input
        .replace("%n", exports.regexp_int)
        .replace("%s", exports.regexp_string)
        .replace("%v", exports.regexp_version)
        .split(regexp_identifier);
    splitInput.map((item) => {
        // escape any nonalphanumeric characters
        item = item.replace("%", "").replace(/[^a-zA-Z0-9]/, (char) => {
            return "\\" + char;
        });
        if (config_1.projectPackage[item]) {
            return config_1.projectPackage.item;
        }
        else if (config_1.rfconfig[item]) {
            return config_1.rfconfig.item;
        }
        else {
            console.warn(colors.yellow(`Property "${option}" not found. Skipping...`));
            return item;
        }
    });
    console.log(output);
    return output;
}
exports.replacer = replacer;
//# sourceMappingURL=regexp.js.map