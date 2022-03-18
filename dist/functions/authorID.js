"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Return_1 = require("../structures/Return");
const createNativeFunction_1 = __importDefault(require("../util/functions/createNativeFunction"));
exports.default = (0, createNativeFunction_1.default)({
    name: '$authorID',
    description: 'Returns the author\'s ID',
    returns: 'STRING',
    execute: function () {
        return Return_1.Return.string(this.context.getUser()?.id);
    }
});
//# sourceMappingURL=authorID.js.map