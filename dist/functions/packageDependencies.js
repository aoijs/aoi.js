"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Return_1 = require("../structures/Return");
const createNativeFunction_1 = __importDefault(require("../util/functions/createNativeFunction"));
exports.default = (0, createNativeFunction_1.default)({
    name: '$packageDependencies',
    description: 'Returns the Package Dependencies.',
    returns: 'STRING',
    execute: function () {
        const dependencies = Object.keys(require("../../package.json").dependencies).join(", ");
        return Return_1.Return.string(dependencies);
    }
});
//# sourceMappingURL=packageDependencies.js.map