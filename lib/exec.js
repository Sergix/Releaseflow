"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const colors = require("colors");
const config_1 = require("./config");
function release() {
    child_process_1.exec(config_1.rfconfig.exec, (error, stdout, stderr) => {
        if (error) {
            console.error(colors.red(`ERROR: could not build application executable: ${error}`));
            return;
        }
        console.info(colors.green('Finished building application executable.'));
    });
}
exports.default = release;
//# sourceMappingURL=exec.js.map