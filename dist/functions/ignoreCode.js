"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Return_1 = require("../structures/Return");
const createNativeFunction_1 = __importDefault(require("../util/functions/createNativeFunction"));
exports.default = (0, createNativeFunction_1.default)({
    name: '$ignoreCode',
    brackets: true,
    description: 'This will ignore the code inside the field. (Used to make a comment in your code)',
    returns: 'STRING',
    fields: [
        {
            name: 'text',
            description: 'Anything added here will be ignored/not execute.',
            required: true,
            type: 'STRING'
        }
    ],
    execute: function () {
        return Return_1.Return.string();
    }
});
//# sourceMappingURL=ignoreCode.js.map