"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const createNativeFunction_1 = __importDefault(require("../util/functions/createNativeFunction"));
exports.default = (0, createNativeFunction_1.default)({
    name: '$ephemeral',
    description: 'Makes this reply ephemeral.',
    execute: function () {
        this.container.data.ephemeral = true;
        return this.ok();
    }
});
//# sourceMappingURL=ephemeral.js.map