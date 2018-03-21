"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const program = require("./program");
const json = require("jsonfile");
const fs = require("fs");
const colors = require("colors");
const xmlj = require("xml2js");
const template = json.readFileSync('./src/template.json');
exports.path = 'rfconfig.json';
exports.data = template;
exports.type = '';
function load() {
    if (program.op_configFile !== undefined) {
        exports.path = program.op_configFile;
    }
    const file = json.readFileSync(exports.path, { throws: false });
    if (file === null) {
        console.info(colors.cyan('Creating template config file in current directory...'));
        json.writeFileSync(exports.path, template, { spaces: 2, EOL: '\r\n' });
        console.info(colors.yellow.underline('rfconfig.json'), colors.yellow('file created. Please modify this file to your liking, then run the application again.\n\nReleaseflow will now close.'));
        console.info(process.exit(0));
        return;
    }
    exports.data = json.readFileSync(exports.path);
    // TODO
    // assuming the package data is in json... at the moment
    // add statement to check file extension and parse xml as well
    if (exports.data.package) {
        if (exports.data.package.endsWith('package.json')) {
            exports.type = 'node';
            exports.projectPackage = JSON.parse(fs.readFileSync(exports.data.package).toString());
        }
        else if (exports.data.package.endsWith('pom.xml')) {
            xmlj.parseString(fs.readFileSync(exports.data.package).toString(), (err, result) => {
                if (err) {
                    console.error(colors.red('ERROR: Failed to parse pom.xml XML data'));
                    return;
                }
                exports.type = 'mvn';
                exports.projectPackage = result.project;
            });
        }
    }
}
exports.load = load;
//# sourceMappingURL=config.js.map