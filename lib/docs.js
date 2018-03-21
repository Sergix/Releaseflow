"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const changelog = require("./changelog");
const config = require("./config");
const fs = require("fs");
const colors = require("colors");
const util = require("./util");
let toc = '';
function replacer(line) {
    /*
    flag_s: single '%'
    flag_m: double '%'
    */
    let flag_s = false, flag_m = false;
    let option = '';
    let output = '';
    for (let i = 0; i < line.length; i++) {
        if (flag_s || flag_m) {
            if (line[i] !== '%') {
                option += line[i];
                continue;
            }
            else if (line[i] === '%' && !flag_m) {
                flag_s = false;
                flag_m = true;
                continue;
            }
            if (option !== '') {
                if (option === 'changelog') {
                    if (changelog.current.length === 0) {
                        changelog.release(false);
                    }
                    for (let j = 0; j < changelog.current.length; j++) {
                        output += `${changelog.current[j]}\r\n`;
                    }
                }
                else if (option === 'toc') {
                    output += `${toc}\r\n`;
                }
                else {
                    if (config.projectPackage !== undefined)
                        output += config.projectPackage[option];
                }
                option = ''; // clear option string
            }
            flag_s = false;
            flag_m = false;
            continue;
        }
        if (line[i] === '%') {
            flag_s = true;
            continue;
        }
        output += line[i];
    }
    return output;
}
function generateToc() {
    let i = 1;
    for (const x in config.data.docs.template) {
        toc += `${i}. ${x}\r\n`;
        i++;
    }
}
function build() {
    const data = [];
    generateToc();
    data.push((config.data.markdown ? '# ' : '') + replacer(config.data.docs.title) + '\r\n\r\n');
    for (const x in config.data.docs.template) {
        data.push((config.data.markdown ? '## ' : '') + `${x}\r\n`); // title
        if (!config.data.markdown)
            data.push('----------------------');
        data.push(replacer(config.data.docs.template[x])); // format the line's specified options
        data.push('\r\n'); // extra newline between sections
    }
    return data;
}
exports.build = build;
function release() {
    const contents = build();
    // TODO
    // Add option in config
    // for custom filename
    const filename = config.data.docs.dist + 'docs-' + config.projectPackage.version + '.md';
    fs.writeFile(filename, util.stringify(contents), (err) => {
        if (!err) {
            console.info(colors.green('Finished writing documentation. Wrote to'), colors.bgGreen.white(`${filename}`));
        }
        else {
            console.error(colors.red('ERROR: Failed to create documentation at'), colors.red.underline(`${filename}`), colors.red('. Perhaps the directory doesn\'t exist?'));
        }
    });
}
exports.default = release;
//# sourceMappingURL=docs.js.map