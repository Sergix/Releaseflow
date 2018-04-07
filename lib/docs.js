"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const colors = require("colors");
const util_1 = require("./util");
const util_2 = require("util");
const config_1 = require("./config");
exports.toc = '';
let bIndex = 1;
let tIndex = 1;
const contents = [];
function title(text) {
    let output = '';
    if (config_1.rfconfig.markdown) {
        for (let i = 0; i < bIndex; i++) {
            output += '#';
        }
    }
    output += ` ${util_1.replacer(text, { interpolate: true })}` + util_1.nl;
    contents.push(output);
}
function build(x) {
    bIndex++;
    for (const y in x) {
        if (util_2.isObject(x[y])) {
            title(y);
            build(x[y]);
            bIndex--;
        }
        else {
            title(y);
            if (!config_1.rfconfig.markdown)
                contents.push('----------------------');
            contents.push(util_1.replacer(x[y], { interpolate: true }));
            contents.push(util_1.nl);
        }
    }
}
function buildToc(x) {
    let t = 1;
    for (const y in x) {
        if (util_2.isObject(x[y])) {
            tIndex++;
            buildToc(x[y]);
            tIndex--;
        }
        else {
            for (let i = 0; i < tIndex - 1; i++) {
                exports.toc += '\t';
            }
            exports.toc += `${t}. ${y}  ` + util_1.nl;
            t++;
        }
    }
}
function release() {
    const ext = config_1.rfconfig.markdown ? 'md' : 'txt';
    let filename = util_1.replacer(config_1.rfconfig.docs.dist, { interpolate: true });
    title(config_1.rfconfig.docs.title + util_1.nl);
    buildToc(config_1.rfconfig.docs.template);
    build(config_1.rfconfig.docs.template);
    filename = util_1.filenameHandler(filename, ext, 'docs', 'documentation');
    // Write the doc contents to the file!
    fs.writeFile(filename, util_1.stringify(contents), (err) => {
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