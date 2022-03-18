"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Regexes_1 = require("../../typings/namespaces/Regexes");
function stripVersion(version) {
    const execution = Regexes_1.Regexes.VERSIONING.exec(version);
    if (!execution)
        return null;
    return execution.slice(1, 4).map(Number);
}
exports.default = stripVersion;
//# sourceMappingURL=stripVersion.js.map