"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const structures_1 = require("../structures");
const createNativeFunction_1 = __importDefault(require("../util/functions/createNativeFunction"));
exports.default = (0, createNativeFunction_1.default)({
    name: '$getTimestamp',
    description: 'Gets current ms since 1970.',
    returns: 'NUMBER',
    execute: function () {
        return structures_1.Return.string(Date.now());
    }
});
//# sourceMappingURL=getTimestamp.js.map