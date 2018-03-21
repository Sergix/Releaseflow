"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = require("./config");
exports.regexp_int = '((\\d{2,4}(\.(\\d[1-9])|([1-9]\\d))?)|[1-9])';
exports.regexp_string = '[a-zA-Z0-9]+';
function replacer(x) {
    let flag_s = false, flag_m = false;
    let output = '';
    let option = '';
    for (let i = 0; i < x.length; i++) {
        if (flag_s || flag_m) {
            if (x[i] !== '%' && flag_m) {
                option += x[i];
                continue;
            }
            else if (x[i] === 'n') {
                output += exports.regexp_int; // integer regex
            }
            else if (x[i] === 's') {
                output += exports.regexp_string; // string regex
            }
            else if (x[i] === 'v') {
                output += '([a-zA-Z0-9]+\\.[a-zA-Z0-9]+\\.[a-zA-Z0-9]+)'; // version regex
            }
            else if (x[i] === '%' && !flag_m) {
                flag_s = false;
                flag_m = true;
                continue;
            }
            if (option !== '') {
                if (config.projectPackage[option]) {
                    for (let j = 0; j < config.projectPackage[option].length; j++) {
                        if (config.projectPackage[option][j] === '[' || config.projectPackage[option][j] === ']' || config.projectPackage[option][j] === '\\' || config.projectPackage[option][j] === '/' || config.projectPackage[option][j] === '(' || config.projectPackage[option][j] === ')' || config.projectPackage[option][j] === '^' || config.projectPackage[option][j] === '$' || config.projectPackage[option][j] === '*' || config.projectPackage[option][j] === '?' || config.projectPackage[option][j] === '>' || config.projectPackage[option][j] === '<' || config.projectPackage[option][j] === '.' || config.projectPackage[option][j] === '+' || config.projectPackage[option][j] === '|' || config.projectPackage[option][j] === '&' || config.projectPackage[option][j] === '#' || config.projectPackage[option][j] === '=' || config.projectPackage[option][j] === '!' || config.projectPackage[option][j] === '{' || config.projectPackage[option][j] === '}' || config.projectPackage[option][j] === ',') {
                            output += '\\';
                        }
                        output += config.projectPackage[option][j];
                    }
                }
                else if (config.data[option]) {
                    for (let j = 0; j < config.data[option].length; j++) {
                        if (config.data[option][j] === '[' || config.data[option][j] === ']' || config.data[option][j] === '\\' || config.data[option][j] === '/' || config.data[option][j] === '(' || config.data[option][j] === ')' || config.data[option][j] === '^' || config.data[option][j] === '$' || config.data[option][j] === '*' || config.data[option][j] === '?' || config.data[option][j] === '>' || config.data[option][j] === '<' || config.data[option][j] === '.' || config.data[option][j] === '+' || config.data[option][j] === '|' || config.data[option][j] === '&' || config.data[option][j] === '#' || config.data[option][j] === '=' || config.data[option][j] === '!' || config.data[option][j] === '{' || config.data[option][j] === '}' || config.data[option][j] === ',') {
                            output += '\\';
                        }
                        output += config.data[option][j];
                    }
                }
                else {
                    console.warn('Unknown property "' + option + '". Skipping...');
                }
                option = '';
            }
            flag_s = false;
            flag_m = false;
            continue;
        }
        if (x[i] === '%') {
            flag_s = true;
            continue;
        }
        if (x[i] === '[' || x[i] === ']' || x[i] === '\\' || x[i] === '/' || x[i] === '(' || x[i] === ')' || x[i] === '^' || x[i] === '$' || x[i] === '*' || x[i] === '?' || x[i] === '>' || x[i] === '<' || x[i] === '.' || x[i] === '+' || x[i] === '|' || x[i] === '&' || x[i] === '#' || x[i] === '=' || x[i] === '!' || x[i] === '{' || x[i] === '}' || x[i] === ',') {
            output += '\\';
        }
        output += x[i];
    }
    return output;
}
exports.replacer = replacer;
//# sourceMappingURL=regexp.js.map