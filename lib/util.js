"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = require("./config");
const colors = require("colors");
exports.regexp_int = '((\\d{2,4}(\.(\\d[1-9])|([1-9]\\d))?)|[1-9])';
exports.regexp_string = '[a-zA-Z0-9]+';
function stringify(data) {
    let output = '';
    for (let i = 0; i < data.length; i++) {
        output += data[i];
        if (!data[i].endsWith('\n')) {
            output += '\r\n';
        }
    }
    return output;
}
exports.stringify = stringify;
function links(x) {
    let data = '';
    const regex = new RegExp(exports.regexp_int); // integer match
    let num = '';
    let flag = false;
    let repo = config.type === 'node' ? config.projectPackage.repository.url
        : (config.type === 'mvn' ? config.projectPackage.url.toString()
            : (console.error(colors.red('ERROR: Could not replace links, no URL property found in project package file.')),
                process.exit(0)));
    if (repo.endsWith('.git')) {
        repo = repo.substr(0, repo.length - 4);
    }
    else if (repo.endsWith('/')) {
        repo = repo.substr(0, repo.length - 1);
    }
    for (let i = 0; i < x.length; i++) {
        if (flag) {
            if (/[0-9]/.test(x[i])) {
                num += x[i]; // add it to the issue number string
                continue;
            }
            else if (num !== '') {
                if (config.data.markdown) {
                    data += `[#${num}](`;
                }
                data += `${repo}/issues/${num}`;
                if (config.data.markdown) {
                    data += ')';
                }
                num = '';
            }
            // not a number and we are not currently reading a number
            flag = false;
        }
        if (x[i] === '#') {
            flag = true;
            continue;
        }
        data += x[i]; // add the character to the line
    }
    if (num !== '') {
        if (config.data.markdown) {
            data += `'[#${num}]('`;
        }
        data += repo + '/issues/' + num;
        if (config.data.markdown) {
            data += ')';
        }
        num = '';
    }
    return data;
}
/*
  {
    links: true,
    searchPackage: true
  }
*/
function replacer(x, options) {
    let output = x;
    if (options.links) {
        output = links(output);
    }
    if (options.searchPackage) {
        output;
    }
    return output;
}
exports.replacer = replacer;
//# sourceMappingURL=util.js.map