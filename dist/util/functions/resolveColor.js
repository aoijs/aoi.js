"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const toTitleCase_1 = require("./toTitleCase");
function default_1(resolvable) {
    const color = discord_js_1.Colors[(0, toTitleCase_1.toTitleCase)(resolvable)];
    if (color !== undefined)
        return color;
    const n = Number(resolvable);
    return !isNaN(n) ? n : parseInt(resolvable.replace('#', ''), 16);
}
exports.default = default_1;
//# sourceMappingURL=resolveColor.js.map