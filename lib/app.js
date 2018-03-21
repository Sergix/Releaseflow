#! /usr/bin/env node

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const program = require("./program");
const config = require("./config");
const exec_1 = require("./exec");
const changelog = require("./changelog");
const docs_1 = require("./docs");
const source_1 = require("./source");
program.options();
config.load();
if (program.op_changelog) {
    changelog.release();
}
if (program.op_docs) {
    docs_1.default();
}
if (program.op_exec) {
    exec_1.default();
}
if (program.op_source) {
    source_1.default();
}
//# sourceMappingURL=app.js.map