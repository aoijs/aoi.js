"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const createNativeFunction_1 = __importDefault(require("../util/functions/createNativeFunction"));
const resolveColor_1 = __importDefault(require("../util/functions/resolveColor"));
exports.default = (0, createNativeFunction_1.default)({
    name: '$color',
    description: 'Add an embed color.',
    brackets: true,
    fields: [
        {
            name: 'index',
            description: 'the embed to add this description to',
            required: true,
            type: 'NUMBER'
        },
        {
            name: 'color hex or int',
            type: 'STRING',
            description: 'the color to use'
        }
    ],
    execute: async function (fn) {
        return this.manage(await fn.resolveArray(this), async ([index, color]) => {
            this.embed(index).setColor((0, resolveColor_1.default)(color));
            return this.ok();
        });
    }
});
//# sourceMappingURL=color.js.map