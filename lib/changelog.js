"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = require("./config");
const regexp = require("./regexp");
const util = require("./util");
const fs = require("fs");
exports.current = [];
function get() {
    const data = [];
    const fileContents = fs.readFileSync(config.data.changelog.path).toString();
    let line = '';
    for (let i = 0; i < fileContents.length; i++) {
        if (fileContents[i] === '\n') {
            config.data.changelog.ignore.forEach((x) => {
                if (x !== line.trim())
                    data[data.length] = line.trim();
            });
            line = '';
            continue;
        }
        if (fileContents[i] !== '\r') {
            line += fileContents[i];
        }
    }
    data[data.length] = line.trim();
    return data;
}
exports.get = get;
function match(x) {
    const data = [];
    const testString = regexp.replacer(config.data.changelog.header_format);
    const regex = new RegExp(testString);
    let flag = false;
    for (let i = 0; i < x.length; i++) {
        if (!flag) {
            if (regex.test(x[i])) {
                flag = true;
            }
            continue;
        }
        if (x[i] === '\n' || x[i] === '') {
            flag = false;
            continue;
        }
        data[data.length] = (!x[i].trim().startsWith('-') ? '- ' : '') + (config.data.changelog.replace_links ? util.replacer(x[i], { 'links': true }) : x[i]);
    }
    return data;
}
exports.match = match;
function release(file = true) {
    exports.current = match(get());
    if (file) {
        fs.writeFileSync(config.data.changelog.dist + 'changelog-' + config.projectPackage.version + '.' + (config.data.markdown ? 'md' : 'txt'), util.stringify(exports.current));
    }
}
exports.release = release;
//# sourceMappingURL=changelog.js.map