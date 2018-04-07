"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const program = require("commander");
function options() {
    program
        .version('1.2.4')
        .option('-l, --changelog', 'build changelog')
        .option('-d, --docs', 'build documentation template')
        .option('-e, --exec', 'build executable')
        .option('-c, --config <path>', 'set config path')
        .option('-s, --source', 'package source code')
        .parse(process.argv);
    exports.op_changelog = program.changelog ? true : false;
    exports.op_docs = program.docs ? true : false;
    exports.op_exec = program.exec ? true : false;
    exports.op_source = program.source ? true : false;
    exports.op_configFile = program.config ? program.config : undefined;
}
exports.options = options;
//# sourceMappingURL=program.js.map