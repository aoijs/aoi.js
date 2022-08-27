"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Return_1 = require("../structures/Return");
const createNativeFunction_1 = __importDefault(require("../util/functions/createNativeFunction"));
exports.default = (0, createNativeFunction_1.default)({
    name: '$packageVersion',
    description: 'Returns the Package Version.',
    returns: 'STRING',
    execute: function () {
        const { version } = require('../../package.json');
        return Return_1.Return.string(version);
    }
});
//# sourceMappingURL=packageVersion.js.map