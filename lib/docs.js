"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = require("./config");
const fs = require("fs");
const colors = require("colors");
const util = require("./util");
exports.toc = '';
function generateToc() {
    let i = 1;
    // loop through each tempalate section
    for (const x in config.data.docs.template) {
        // (i)      (x)
        //  1. Section Title
        exports.toc += `${i}. ${x}\r\n`;
        i++;
    }
}
function build() {
    const data = [];
    // go ahead and generate the table of contents in case we need it later
    generateToc();
    // add the document title
    data.push((config.data.markdown ? '# ' : '') + util.replacer(config.data.docs.title, { interpolate: true }) + '\r\n\r\n');
    // TODO
    // add subsections by checking if the section is an object rather than a string
    // recursiveness will really come in handy
    // loop through each section
    for (const x in config.data.docs.template) {
        // add the section title
        data.push((config.data.markdown ? '## ' : '') + `${x}\r\n`);
        // if we're not writing in markdown, add a little section underline
        if (!config.data.markdown)
            data.push('----------------------');
        /// interpolate user specified package properties
        data.push(util.replacer(config.data.docs.template[x], { interpolate: true }));
        // add an extra newline between sections
        data.push('\r\n');
    }
    return data;
}
exports.build = build;
function release() {
    const ext = config.data.markdown ? 'md' : 'txt';
    const contents = build();
    let filename = util.replacer(config.data.docs.dist, { interpolate: true });
    let isDir = false;
    // check if the file exists
    try {
        fs.accessSync(filename, fs.constants.F_OK);
        isDir = false;
    }
    catch (err) {
        // check if its a directory
        try {
            fs.statSync(filename).isDirectory();
            isDir = true;
        }
        catch (err) {
            isDir = false;
        }
    }
    // if it's a directory, use the default changelog filename
    if (isDir) {
        if (!filename.endsWith('/') && !filename.endsWith('\\')) {
            filename += '/';
        }
        filename += 'docs-' +
            (config.projectPackage.version !== undefined && config.projectPackage.version !== null ?
                config.projectPackage.version :
                (console.info(colors.yellow('WARNING: No version number found in package file. A timestamp will be used in the documentation filename.')), Date.now().toString())) + '.' + ext;
    }
    // Write the doc contents to the file!
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