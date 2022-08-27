"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const AoiFunctionManager_1 = __importDefault(require("../core/AoiFunctionManager"));
function default_1() {
    const summary = (0, fs_1.readFileSync)(`./docs/_sidebar.md`, 'utf-8');
    const middle = summary.split('* Available Functions')[1].split('* [Changes]')[0];
    return summary.replace(middle, '\n\n' + Array.from(AoiFunctionManager_1.default.nativeFunctions.values()).map(c => `functions/available-functions/${c.name.slice(1)}`).join('\n') + '\n');
}
exports.default = default_1;
//# sourceMappingURL=updateSummaryFunctions.js.map