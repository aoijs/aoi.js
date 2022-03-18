"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Return_1 = require("../structures/Return");
const ReturnType_1 = require("../typings/enums/ReturnType");
const createNativeFunction_1 = __importDefault(require("../util/functions/createNativeFunction"));
exports.default = (0, createNativeFunction_1.default)({
    name: '$break',
    description: 'breaks this scope',
    execute: async function (d) {
        return new Return_1.Return(ReturnType_1.ReturnType.Break, null);
    }
});
//# sourceMappingURL=break.js.map