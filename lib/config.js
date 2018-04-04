"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const program = require("./program");
const json = require("jsonfile");
const fs = require("fs");
const colors = require("colors");
const xmlj = require("xml2js");
const util_1 = require("./util");
const template = {
    'package': './package.json',
    'markdown': true,
    'docs': {
        'title': 'Project Template %%version% Documentation',
        'dist': './docs/',
        'template': {
            'Overview': 'This is the documentation for %%name%.',
            'Table of Contents': '%%toc%',
            'Changelog': '%%changelog%',
            'Licensing': '%%name% version %%version% licensed under %%license%'
        }
    },
    'changelog': {
        'path': 'changelog.txt',
        'header_format': '(%n)[%n/%n/%n-%n:%n %%version% %s]',
        'replace_links': true,
        'dist': './changelog/',
        'ignore': ['Signed off by user.']
    },
    'source': {
        'dir': ['src/exampleFile.txt', 'src/exampleDirectory/exampleSubDirectory/', 'src/example5/*'],
        'dist': './source/',
        'compression': ['zip', 'tar']
    },
    'exec': 'npm run build'
};
exports.path = 'rfconfig.json';
exports.rfconfig = template;
exports.projectType = '';
function load() {
    if (program.op_configFile !== undefined) {
        exports.path = program.op_configFile;
    }
    const file = json.readFileSync(exports.path, { throws: false });
    if (file === null) {
        console.info(colors.cyan('Creating template config file in current directory...'));
        json.writeFileSync(exports.path, template, { spaces: 2, EOL: util_1.nl });
        console.info(colors.yellow.underline('rfconfig.json'), colors.yellow('file created. Please modify this file to your liking, then run the application again.\n\nReleaseflow will now close.'));
        console.info(process.exit(0));
        return;
    }
    exports.rfconfig = json.readFileSync(exports.path);
    if (exports.rfconfig.package) {
        if (exports.rfconfig.package.endsWith('package.json')) {
            exports.projectType = 'node';
            exports.projectPackage = JSON.parse(fs.readFileSync(exports.rfconfig.package).toString());
        }
        else if (exports.rfconfig.package.endsWith('pom.xml')) {
            xmlj.parseString(fs.readFileSync(exports.rfconfig.package).toString(), (err, result) => {
                if (err) {
                    console.error(colors.red('ERROR: Failed to parse pom.xml XML data'));
                    return;
                }
                exports.projectType = 'mvn';
                exports.projectPackage = result.project;
            });
        }
    }
}
exports.load = load;
//# sourceMappingURL=config.js.map