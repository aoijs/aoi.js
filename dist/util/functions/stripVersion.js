"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typings_1 = require("../../typings");
function stripVersion(version) {
    const execution = typings_1.Regexes.VERSIONING.exec(version ?? "");
    if (!execution)
        return null;
    return execution.slice(1, 4).map(Number);
}
exports.default = stripVersion;
//# sourceMappingURL=stripVersion.js.map