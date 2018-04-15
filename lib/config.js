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
    let packageFile;
    if (program.op_configFile !== undefined) { // config file path was specified by user
        exports.path = program.op_configFile;
    }
    exports.rfconfig = json.readFileSync(exports.path, { throws: false });
    if (exports.rfconfig === null) { // config file does not exist
        console.info(colors.cyan('Creating template config file in current directory...'));
        json.writeFileSync('rfconfig.json', template, { spaces: 2, EOL: util_1.nl });
        console.info(colors.yellow.underline(exports.path), colors.yellow('file created. Please modify this file to your liking, then run the application again.\n\nReleaseflow will now close.'));
        process.exit(0);
        return;
    }
    try {
        packageFile = fs.readFileSync(exports.rfconfig.package).toString();
    }
    catch (err) {
        console.info(colors.cyan(err));
        console.error(colors.red(`ERROR: Could not read project file "${exports.rfconfig.package}".`));
        process.exit(0);
    }
    if (exports.rfconfig.package.endsWith('.json')) {
        if (exports.rfconfig.package.endsWith('package.json'))
            exports.projectType = 'node'; // Node.js
        exports.projectPackage = JSON.parse(packageFile);
    }
    else if (exports.rfconfig.package.endsWith('.xml')) {
        if (exports.rfconfig.package.endsWith('pom.xml'))
            exports.projectType = 'mvn'; // Maven
        xmlj.parseString(packageFile, (err, result) => {
            if (err) {
                console.error(colors.red('ERROR: Failed to parse package XML data.'));
                process.exit(0);
            }
            exports.projectPackage = result.project;
        });
    }
}
exports.load = load;
//# sourceMappingURL=config.js.map