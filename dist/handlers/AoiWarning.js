"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const undici_1 = require("undici");
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
        const { body } = await (0, undici_1.request)("https://api.leref.repl.co/package/version"); //This will change when the package is published.
        for await (const data of body) {
            const latest = (0, stripVersion_1.default)(data.version);
            const results = version.map((x, y) => x >= latest[y]);
            if (isOlder(version, latest)) {
                console.warn("\x1b[31mAoiWarning: \x1b[33mv" +
                    data.version +
                    " is available to install.\x1b[0m" + " (npm i aoi.js@" + data.version + ")");
            }
        }
    }
    catch {
    }
}
exports.default = default_1;
//# sourceMappingURL=AoiWarning.js.map