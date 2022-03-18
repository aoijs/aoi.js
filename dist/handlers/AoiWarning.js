"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const stripVersion_1 = __importDefault(require("../util/functions/stripVersion"));
function isOlder(current, latest, x = 0) {
    const c = current[x];
    const l = latest[x];
    if (c === undefined)
        return false;
    if (c === l)
        return isOlder(current, latest, ++x);
    return c < l;
}
async function default_1() {
    /**
     * To fetch the API version current and version installed.
     */
    try {
        const version = (0, stripVersion_1.default)(require('../../package.json').version);
        const res = await axios_1.default.get("https://api.leref.ga/package/version"); //This will change when the package is published.
        const latest = (0, stripVersion_1.default)(res.data.version);
        const results = version.map((x, y) => x >= latest[y]);
        if (isOlder(version, latest)) {
            console.warn("\x1b[31maoi.js warning: \u001b[33mv" +
                res.data.version +
                " is available to install.\u001b[0m" + " (npm i aoi.js@" + res.data.version + ")");
        }
    }
    catch {
    }
}
exports.default = default_1;
//# sourceMappingURL=AoiWarning.js.map