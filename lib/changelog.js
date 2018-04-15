"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const regexp = require("./regexp");
const util_1 = require("./util");
const colors = require("colors");
const fs = require("fs");
const config_1 = require("./config");
exports.current = [];
function get() {
    const data = [];
    const fileContents = fs.readFileSync(config_1.rfconfig.changelog.path).toString();
    let line = '';
    for (let i = 0; i < fileContents.length; i++) {
        if (fileContents[i] === '\n') {
            config_1.rfconfig.changelog.ignore.forEach((x) => {
                if (x !== line.trim()) // if we need to ignore the line
                    data[data.length] = line.trim();
            });
            line = '';
            continue;
        }
        if (fileContents[i] !== '\r') { // skip return carriage
            line += fileContents[i];
        }
    }
    data[data.length] = line.trim();
    return data;
}
exports.get = get;
function match(x) {
    const data = [];
    const testString = regexp.replacer(config_1.rfconfig.changelog.header_format);
    const regex = new RegExp(testString);
    let flag_r = false, flag_m = false;
    let split = [];
    let line = '';
    let j;
    split = testString.split('\n');
    if (split !== []) { // if the format string is a multi-line header
        flag_m = true;
    }
    for (let i = 0; i < x.length; i++) {
        if (!flag_r) { // if we are not currently reading an entry
            if (flag_m) { // if it's a multi-line header format
                flag_r = true; // set flag preliminarily to true
                for (j = 0; j < split.length; j++) { // loop through split array
                    if (new RegExp(split[j].trim()).test(x[i + j])) {
                        continue;
                    }
                    else {
                        j = 0;
                        flag_r = false;
                        break;
                    }
                }
            }
            else {
                if (regex.test(x[i])) { // if the string matches the header format
                    flag_r = true;
                }
            }
            i += j - 1;
            continue;
        }
        if (x[i] === '\n' || x[i] === '') { // if the data is a newline, it is the end of entry
            flag_r = false;
            continue;
        }
        line = x[i].trim();
        if (line.startsWith('-')) {
            line = '- ' + line;
        }
        if (config_1.rfconfig.changelog.replace_links) {
            line = util_1.replacer(line, { 'links': true });
        }
        data.push(line);
    }
    return data;
}
exports.match = match;
function release(file = true) {
    const ext = config_1.rfconfig.markdown ? 'md' : 'txt';
    let filename = util_1.replacer(config_1.rfconfig.changelog.dist, { interpolate: true });
    exports.current = match(get());
    filename = util_1.filenameHandler(filename, ext, 'changelog', 'changelog');
    // Write the contents to the file!
    fs.writeFile(filename, util_1.stringify(exports.current), (err) => {
        if (!err) {
            console.info(colors.green('Finished writing changelog. Wrote to'), colors.bgGreen.white(`${filename}`));
        }
        else {
            console.error(colors.red('ERROR: Failed to create changelog at'), colors.red.underline(`${filename}`), colors.red('. Perhaps the directory doesn\'t exist?'));
        }
    });
}
exports.release = release;
//# sourceMappingURL=changelog.js.map